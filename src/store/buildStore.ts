import { create } from 'zustand';
import { Component } from '@/lib/validation';

interface BuildState {
    parts: Record<string, Component | null>;
    validationErrors: string[];
    cadence: number;
    totalWeight: number;
    unitSystem: 'imperial' | 'metric';
    setPart: (type: string, component: Component) => void;
    removePart: (type: string) => void;
    setCadence: (cadence: number) => void;
    toggleUnits: () => void;
    setBuild: (parts: Record<string, Component | null>) => void;
    validateBuild: () => Promise<void>;
}

export const useBuildStore = create<BuildState>((set, get) => ({
    parts: {
        Frame: null,
        Wheel: null,
        Tire: null,
        BottomBracket: null,
        Crank: null,
        Shifter: null,
        Derailleur: null,
        Cassette: null,
    },
    validationErrors: [],
    cadence: 90,
    totalWeight: 0,
    unitSystem: 'imperial',
    setPart: (type, component) => {
        set((state) => {
            const newParts = { ...state.parts, [type]: component };
            const newWeight = Object.values(newParts).reduce((total, part) => {
                if (part && part.attributes.weight_g) {
                    return total + (part.attributes.weight_g as number);
                }
                return total;
            }, 0);
            return {
                parts: newParts,
                totalWeight: newWeight,
            };
        });
        get().validateBuild();
    },
    removePart: (type) => {
        set((state) => {
            const newParts = { ...state.parts, [type]: null };
            const newWeight = Object.values(newParts).reduce((total, part) => {
                if (part && part.attributes.weight_g) {
                    return total + (part.attributes.weight_g as number);
                }
                return total;
            }, 0);
            return {
                parts: newParts,
                totalWeight: newWeight,
            };
        });
        get().validateBuild();
    },
    setCadence: (cadence) => {
        set({ cadence });
    },
    toggleUnits: () => {
        set((state) => ({
            unitSystem: state.unitSystem === 'imperial' ? 'metric' : 'imperial',
        }));
    },
    setBuild: (parts) => {
        set((state) => {
            const newWeight = Object.values(parts).reduce((total, part) => {
                if (part && part.attributes.weight_g) {
                    return total + (part.attributes.weight_g as number);
                }
                return total;
            }, 0);
            return {
                parts,
                totalWeight: newWeight,
            };
        });
        get().validateBuild();
    },
    validateBuild: async () => {
        const { parts } = get();
        const errors: string[] = [];

        // Frame-Wheel Validation
        if (parts.Frame && parts.Wheel) {
            const res = await fetch('/api/validate/frame-wheel', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ frame: parts.Frame, wheel: parts.Wheel, tire: parts.Tire }),
            });
            const data = await res.json();
            if (!data.compatible) errors.push(...data.reasons);
        }


        // Frame-BB Validation (check Frame-BB interface match)
        if (parts.Frame && parts.BottomBracket) {
            const bb = parts.BottomBracket;
            const frame = parts.Frame;
            if (bb.interfaces.frame_interface !== frame.interfaces.bottom_bracket_shell) {
                errors.push(`BB frame interface (${bb.interfaces.frame_interface}) does not match Frame shell (${frame.interfaces.bottom_bracket_shell})`);
            }
        }

        // BB-Crank Validation (check BB-Crank interface match)
        if (parts.BottomBracket && parts.Crank) {
            const bb = parts.BottomBracket;
            const crank = parts.Crank;
            if (bb.interfaces.crank_interface !== crank.interfaces.spindle_type) {
                errors.push(`BB crank interface (${bb.interfaces.crank_interface}) does not match Crank spindle (${crank.interfaces.spindle_type})`);
            }
        }


        // Shifter-Derailleur Protocol Validation
        if (parts.Shifter && parts.Derailleur) {
            const shifter = parts.Shifter;
            const derailleur = parts.Derailleur;
            if (shifter.interfaces.protocol !== derailleur.interfaces.protocol) {
                errors.push(`Shifter protocol (${shifter.interfaces.protocol}) does not match Derailleur protocol (${derailleur.interfaces.protocol})`);
            }
        }

        // Derailleur-Cassette Validation (max tooth and capacity)
        if (parts.Derailleur && parts.Cassette) {
            const derailleur = parts.Derailleur;
            const cassette = parts.Cassette;

            // Max tooth check
            const maxTooth = derailleur.attributes.max_tooth;
            const largestCog = cassette.attributes.largest_cog;
            if (maxTooth && largestCog && largestCog > maxTooth) {
                errors.push(`Cassette largest cog (${largestCog}t) exceeds Derailleur max tooth (${maxTooth}t)`);
            }

            // Capacity check (if crank is present)
            if (parts.Crank) {
                const capacity = derailleur.attributes.capacity;
                const cassetteDiff = cassette.attributes.diff;
                const chainringDiff = parts.Crank.attributes.chainring_diff || 0;

                if (capacity && cassetteDiff !== undefined) {
                    const requiredCapacity = cassetteDiff + chainringDiff;
                    if (requiredCapacity > capacity) {
                        errors.push(`Required capacity (${requiredCapacity}t) exceeds Derailleur capacity (${capacity}t)`);
                    }
                }
            }
        }

        // Wheel-Cassette Freehub Body Validation
        if (parts.Wheel && parts.Cassette) {
            const wheel = parts.Wheel;
            const cassette = parts.Cassette;
            if (wheel.interfaces.freehub_body && cassette.interfaces.cassette_mount) {
                if (wheel.interfaces.freehub_body !== cassette.interfaces.cassette_mount) {
                    errors.push(`Wheel freehub body (${wheel.interfaces.freehub_body}) does not match Cassette mount (${cassette.interfaces.cassette_mount})`);
                }
            }
        }

        set({ validationErrors: errors });
    },
}));

import { create } from 'zustand';
import { Validator } from '../lib/validation';
import { CompatibilityResult } from '../lib/types/compatibility';
import {
    Frame, Fork, Wheel, Tire, BottomBracket, Crankset,
    Cassette, RearDerailleur, Shifter, Chain, BrakeCaliper,
    BrakeRotor, Stem, Handlebar, Seatpost
} from '../types/components';

// Define a union type for all possible components
export type AnyComponent =
    | Frame | Fork | Wheel | Tire
    | BottomBracket | Crankset | Cassette | RearDerailleur | Shifter | Chain
    | BrakeCaliper | BrakeRotor | Stem | Handlebar | Seatpost;

interface BuildParts {
    Frame: Frame | null;
    Fork: Fork | null;
    WheelFront: Wheel | null;
    WheelRear: Wheel | null;
    TireFront: Tire | null;
    TireRear: Tire | null;
    BottomBracket: BottomBracket | null;
    Crankset: Crankset | null;
    Cassette: Cassette | null;
    RearDerailleur: RearDerailleur | null;
    Shifter: Shifter | null;
    BrakeCaliperFront: BrakeCaliper | null;
    BrakeCaliperRear: BrakeCaliper | null;
    BrakeRotorFront: BrakeRotor | null;
    BrakeRotorRear: BrakeRotor | null;
    Stem: Stem | null;
    Handlebar: Handlebar | null;
    Seatpost: Seatpost | null;
}

// Factory fork state for Road/Gravel framesets
interface FactoryForkState {
    usingFactoryFork: boolean; // true = keeping factory fork, false = using aftermarket
    factoryForkWeight: number; // Weight of factory fork in grams (to deduct if not using)
    factoryForkName: string | null; // Name of factory fork for display
}

interface BuildState {
    parts: BuildParts;
    validationResult: CompatibilityResult;
    totalWeight: number;
    cadence: number;
    selectedFreehubStandard: string | null;

    // Factory fork state
    factoryFork: FactoryForkState;

    // Actions
    setPart: (key: keyof BuildParts, component: AnyComponent) => void;
    setFreehubStandard: (standard: string | null) => void;
    removePart: (key: keyof BuildParts) => void;
    setBuild: (parts: Partial<BuildParts>) => void;
    loadTemplate: (parts: Partial<BuildParts>) => void;
    clearBuild: () => void;
    validateBuild: () => void;
    setCadence: (cadence: number) => void;

    // Factory fork actions
    setFactoryForkChoice: (usingFactory: boolean) => void;
    setFactoryForkInfo: (weight: number, name: string | null) => void;
}

export const useBuildStore = create<BuildState>((set, get) => ({
    parts: {
        Frame: null,
        Fork: null,
        WheelFront: null,
        WheelRear: null,
        TireFront: null,
        TireRear: null,
        BottomBracket: null,
        Crankset: null,
        Cassette: null,
        RearDerailleur: null,
        Shifter: null,
        BrakeCaliperFront: null,
        BrakeCaliperRear: null,
        BrakeRotorFront: null,
        BrakeRotorRear: null,
        Stem: null,
        Handlebar: null,
        Seatpost: null,
    },
    validationResult: { compatible: true, issues: [] } as CompatibilityResult,
    totalWeight: 0,
    cadence: 90,
    selectedFreehubStandard: null,

    // Factory fork initial state
    factoryFork: {
        usingFactoryFork: true, // Default to keeping factory fork
        factoryForkWeight: 0,
        factoryForkName: null
    },

    setFreehubStandard: (standard) => set({ selectedFreehubStandard: standard }),

    setFactoryForkChoice: (usingFactory) => {
        set((state) => {
            // Recalculate weight when factory fork choice changes
            const parts = state.parts;
            let newWeight = Object.values(parts).reduce((total, part) => {
                const w = part ? (part as any).weightGrams : 0;
                return total + (typeof w === 'number' ? w : 0);
            }, 0);

            // If NOT using factory fork and we have a factory fork weight recorded,
            // the frameset weight already includes it, so we need to deduct it
            // (the aftermarket fork weight will be added when they select one)
            if (!usingFactory && state.factoryFork.factoryForkWeight > 0) {
                newWeight -= state.factoryFork.factoryForkWeight;
            }

            return {
                factoryFork: { ...state.factoryFork, usingFactoryFork: usingFactory },
                totalWeight: newWeight
            };
        });
    },

    setFactoryForkInfo: (weight, name) => {
        set((state) => ({
            factoryFork: {
                ...state.factoryFork,
                factoryForkWeight: weight,
                factoryForkName: name
            }
        }));
    },

    setPart: (key, component) => {
        set((state) => {
            const newParts = { ...state.parts, [key]: component };

            // Recalculate weight
            let newWeight = Object.values(newParts).reduce((total, part) => {
                const w = part ? (part as any).weightGrams : 0;
                return total + (typeof w === 'number' ? w : 0);
            }, 0);

            // If NOT using factory fork and we have a factory fork weight,
            // deduct it from total (frameset weight includes factory fork)
            if (!state.factoryFork.usingFactoryFork && state.factoryFork.factoryForkWeight > 0) {
                newWeight -= state.factoryFork.factoryForkWeight;
            }

            return { parts: newParts, totalWeight: newWeight };
        });
        get().validateBuild();
    },

    setBuild: (parts) => {
        set((state) => {
            const newParts = { ...state.parts, ...parts };
            // Recalculate weight
            const newWeight = Object.values(newParts).reduce((total, part) => {
                const w = part ? (part as any).weightGrams : 0;
                return total + (typeof w === 'number' ? w : 0);
            }, 0);
            return { parts: newParts, totalWeight: newWeight };
        });
        get().validateBuild();
    },

    loadTemplate: (parts) => {
        get().setBuild(parts);
    },

    removePart: (key) => {
        set((state) => {
            const newParts = { ...state.parts, [key]: null };

            // Recalculate weight
            const newWeight = Object.values(newParts).reduce((total, part) => {
                const w = part ? (part as any).weightGrams : 0;
                return total + (typeof w === 'number' ? w : 0);
            }, 0);

            return { parts: newParts, totalWeight: newWeight };
        });
        get().validateBuild();
    },

    clearBuild: () => {
        set({
            parts: {
                Frame: null,
                Fork: null,
                WheelFront: null,
                WheelRear: null,
                TireFront: null,
                TireRear: null,
                BottomBracket: null,
                Crankset: null,
                Cassette: null,
                RearDerailleur: null,
                Shifter: null,
                BrakeCaliperFront: null,
                BrakeCaliperRear: null,
                BrakeRotorFront: null,
                BrakeRotorRear: null,
                Stem: null,
                Handlebar: null,
                Seatpost: null,
            },
            validationResult: { compatible: true, issues: [] },
            totalWeight: 0,
            selectedFreehubStandard: null,
            factoryFork: {
                usingFactoryFork: true,
                factoryForkWeight: 0,
                factoryForkName: null
            }
        });
    },

    validateBuild: () => {
        const { parts } = get();

        // Map flat parts to Validator structure
        const buildData = {
            frame: parts.Frame || undefined,
            fork: parts.Fork || undefined,
            wheels: [parts.WheelFront, parts.WheelRear].filter(Boolean),
            tires: [parts.TireFront, parts.TireRear].filter(Boolean),
            bottomBracket: parts.BottomBracket || undefined,
            crankset: parts.Crankset || undefined,
            cassette: parts.Cassette || undefined,
            rearDerailleur: parts.RearDerailleur || undefined,
            shifter: parts.Shifter || undefined,
            chain: undefined, // Add if in store
            // Brakes and Cockpit need mapping if detailed validation is enabled
            cockpit: {
                stem: parts.Stem || undefined,
                handlebar: parts.Handlebar || undefined,
                seatpost: parts.Seatpost || undefined
            }
        };

        const result = Validator.validateBuild(buildData);
        set({ validationResult: result });
    },

    setCadence: (cadence: number) => {
        set({ cadence });
    }
}));

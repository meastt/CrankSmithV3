import { create } from 'zustand';
import { Validator, ValidationResult } from '../engine/Validator';
import {
    Frame, Fork, Wheel, Tire, BottomBracket, Crankset,
    Cassette, RearDerailleur, Shifter, BrakeCaliper,
    BrakeRotor, Stem, Handlebar, Seatpost
} from '../types/components';

// Define a union type for all possible components
export type AnyComponent =
    | Frame | Fork | Wheel | Tire
    | BottomBracket | Crankset | Cassette | RearDerailleur | Shifter
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

interface BuildState {
    parts: BuildParts;
    validationResults: ValidationResult[];
    totalWeight: number;

    // Actions
    setPart: (key: keyof BuildParts, component: AnyComponent) => void;
    removePart: (key: keyof BuildParts) => void;
    clearBuild: () => void;
    validateBuild: () => void;
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
    validationResults: [],
    totalWeight: 0,

    setPart: (key, component) => {
        set((state) => {
            const newParts = { ...state.parts, [key]: component };

            // Recalculate weight
            const newWeight = Object.values(newParts).reduce((total, part) => {
                return total + (part ? part.weightGrams : 0);
            }, 0);

            return { parts: newParts, totalWeight: newWeight };
        });
        get().validateBuild();
    },

    removePart: (key) => {
        set((state) => {
            const newParts = { ...state.parts, [key]: null };

            // Recalculate weight
            const newWeight = Object.values(newParts).reduce((total, part) => {
                return total + (part ? part.weightGrams : 0);
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
            validationResults: [],
            totalWeight: 0
        });
    },

    validateBuild: () => {
        const { parts } = get();

        // Map flat parts to Validator structure
        const buildData = {
            frame: parts.Frame || undefined,
            fork: parts.Fork || undefined,
            wheels: [parts.WheelFront, parts.WheelRear].filter((w): w is Wheel => w !== null),
            tires: [parts.TireFront, parts.TireRear].filter((t): t is Tire => t !== null),
            bottomBracket: parts.BottomBracket || undefined,
            crankset: parts.Crankset || undefined,
            cassette: parts.Cassette || undefined,
            rearDerailleur: parts.RearDerailleur || undefined,
            shifter: parts.Shifter || undefined,
            brakes: {
                levers: parts.Shifter || undefined, // Assuming Shifter acts as lever for now
                calipers: [parts.BrakeCaliperFront, parts.BrakeCaliperRear].filter((c): c is BrakeCaliper => c !== null),
                rotors: [parts.BrakeRotorFront, parts.BrakeRotorRear].filter((r): r is BrakeRotor => r !== null),
            },
            cockpit: {
                stem: parts.Stem || undefined,
                handlebar: parts.Handlebar || undefined,
                seatpost: parts.Seatpost || undefined
            }
        };

        const start = performance.now();
        const results = Validator.validateBuild(buildData);
        const end = performance.now();

        if (process.env.NODE_ENV === 'development') {
            console.log(`Validation took ${(end - start).toFixed(2)}ms`);
        }

        // Filter out successful validations if we only want to show issues?
        // Or keep all? Let's keep all for the "Scorecard".
        set({ validationResults: results });
    }
}));

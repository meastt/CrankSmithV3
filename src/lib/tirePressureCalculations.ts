/**
 * Pure tire pressure calculation logic — no React/store dependencies.
 * All inputs in metric (kg, mm), output in PSI.
 */

export type SurfaceType = 'road-smooth' | 'road-poor' | 'gravel-smooth' | 'gravel-chunky' | 'mtb-trail' | 'mtb-enduro';

export interface PressureResult {
    front: { min: number; max: number; recommended: number };
    rear: { min: number; max: number; recommended: number };
}

export interface TirePressureInput {
    riderWeight: number;   // kg
    bikeWeight: number;    // kg
    tireWidth: number;     // mm
    rimWidth: number;      // mm (internal)
    surface: SurfaceType;
    isTubeless: boolean;
    isWet: boolean;
    preference: number;    // -1 (grip) to +1 (speed)
}

const SURFACE_MODIFIERS: Record<SurfaceType, number> = {
    'road-smooth': 1.0,
    'road-poor': 0.95,
    'gravel-smooth': 0.9,
    'gravel-chunky': 0.85,
    'mtb-trail': 0.8,
    'mtb-enduro': 0.75,
};

/**
 * Modified Frank Berto formula approximation.
 * @param loadLbs - weight on this wheel in pounds
 * @param widthMm - effective tire width in mm
 */
export function calculateBasePsi(loadLbs: number, widthMm: number): number {
    return 140 * Math.pow(loadLbs / Math.pow(widthMm, 1.5), 0.9);
}

/**
 * Calculate recommended front and rear tire pressures.
 */
export function calculateTirePressure(input: TirePressureInput): PressureResult {
    const { riderWeight, bikeWeight, tireWidth, rimWidth, surface, isTubeless, isWet, preference } = input;

    const totalWeightKg = riderWeight + bikeWeight;
    const totalWeightLbs = totalWeightKg * 2.20462;

    // Weight distribution (45% Front / 55% Rear)
    const frontLoadLbs = totalWeightLbs * 0.45;
    const rearLoadLbs = totalWeightLbs * 0.55;

    // Adjust tire width based on rim width
    const measuredWidth = tireWidth + (rimWidth - 19) * 0.4;

    let frontPsi = calculateBasePsi(frontLoadLbs, measuredWidth);
    let rearPsi = calculateBasePsi(rearLoadLbs, measuredWidth);

    // Tubeless adjustment
    if (isTubeless) {
        frontPsi *= 0.9;
        rearPsi *= 0.9;
    }

    // Surface adjustments
    frontPsi *= SURFACE_MODIFIERS[surface];
    rearPsi *= SURFACE_MODIFIERS[surface];

    // Wet adjustment
    if (isWet) {
        frontPsi -= 3;
        rearPsi -= 3;
    }

    // Preference adjustment (±8%)
    const preferenceModifier = 1 + (preference * 0.08);
    frontPsi *= preferenceModifier;
    rearPsi *= preferenceModifier;

    // Safety clamps
    frontPsi = Math.max(15, Math.min(120, frontPsi));
    rearPsi = Math.max(15, Math.min(120, rearPsi));

    return {
        front: {
            min: frontPsi * 0.9,
            max: frontPsi * 1.1,
            recommended: frontPsi,
        },
        rear: {
            min: rearPsi * 0.9,
            max: rearPsi * 1.1,
            recommended: rearPsi,
        },
    };
}

/**
 * Gear ratio and performance calculations for bicycle drivetrains
 */

const RIM_DIAMETER_700C = 622; // mm (standard road/gravel rim)
const RIM_DIAMETER_650B = 584; // mm (650b/27.5" rim)

const CASSETTE_LIBRARY: Record<string, { cogs: number[]; family: string }> = {
    // 11-speed road/gravel
    '11-25': { cogs: [11, 12, 13, 14, 15, 16, 17, 19, 21, 23, 25], family: 'Road 11-speed' },
    '11-28': { cogs: [11, 12, 13, 14, 15, 17, 19, 21, 23, 25, 28], family: 'Road 11-speed' },
    '11-30': { cogs: [11, 12, 13, 14, 15, 17, 19, 21, 23, 26, 30], family: 'Road 11-speed' },
    '11-32': { cogs: [11, 12, 13, 14, 15, 17, 19, 21, 24, 28, 32], family: 'Road/Gravel 11-speed' },
    '11-34': { cogs: [11, 12, 13, 14, 15, 17, 19, 21, 24, 28, 34], family: 'Road/Gravel 11-speed' },

    // 12-speed road/gravel
    '10-28': { cogs: [10, 11, 12, 13, 14, 15, 16, 17, 19, 21, 24, 28], family: 'Road 12-speed' },
    '10-30': { cogs: [10, 11, 12, 13, 14, 15, 17, 19, 21, 24, 27, 30], family: 'Road 12-speed' },
    '10-33': { cogs: [10, 11, 12, 13, 14, 15, 17, 19, 21, 24, 28, 33], family: 'Road 12-speed' },
    '10-36': { cogs: [10, 11, 12, 13, 15, 17, 19, 21, 24, 28, 32, 36], family: 'Road 12-speed' },
    '10-44': { cogs: [10, 11, 13, 15, 17, 19, 21, 24, 28, 32, 38, 44], family: 'Gravel 12-speed' },
    '10-45': { cogs: [10, 12, 14, 16, 18, 21, 24, 28, 32, 36, 40, 45], family: 'MTB/Gravel 12-speed' },
    '10-50': { cogs: [10, 12, 14, 16, 18, 21, 24, 28, 32, 36, 42, 50], family: 'MTB 12-speed' },
    '10-51': { cogs: [10, 12, 14, 16, 18, 21, 24, 28, 33, 39, 45, 51], family: 'MTB 12-speed' },
    '10-52': { cogs: [10, 12, 14, 16, 18, 21, 24, 28, 33, 39, 45, 52], family: 'MTB 12-speed' },
    '9-45': { cogs: [9, 10, 11, 13, 15, 17, 20, 23, 27, 31, 36, 45], family: 'Road/Gravel 12-speed' },
    '9-46': { cogs: [9, 10, 11, 13, 15, 17, 20, 24, 28, 33, 39, 46], family: 'Road/Gravel 12-speed' },
    '9-52': { cogs: [9, 10, 11, 13, 15, 18, 21, 24, 28, 34, 42, 52], family: 'MTB 12-speed' },
};

/**
 * Calculate gear ratio (chainring teeth / cog teeth)
 */
export function calculateGearRatio(chainring: number, cog: number): number {
    return chainring / cog;
}

/**
 * Calculate gear inches (traditional measure)
 * Formula: (chainring / cog) * wheel diameter in inches
 */
export function calculateGearInches(
    chainring: number,
    cog: number,
    wheelDiameterMm: number = RIM_DIAMETER_700C + (2 * 28) // Default to 700x28c equivalent
): number {
    const wheelDiameterInches = wheelDiameterMm / 25.4;
    return (chainring / cog) * wheelDiameterInches;
}

/**
 * Calculate speed at given cadence
 * @param gearRatio - chainring / cog
 * @param wheelCircumferenceMm - wheel circumference in mm
 * @param cadenceRpm - cadence in RPM
 * @returns speed in km/h
 */
export function calculateSpeed(
    gearRatio: number,
    wheelCircumferenceMm: number,
    cadenceRpm: number
): number {
    // Distance per crank revolution = gear ratio * wheel circumference
    const distancePerRevMm = gearRatio * wheelCircumferenceMm;
    // Distance per minute = distance per rev * cadence (rev/min)
    const distancePerMinMm = distancePerRevMm * cadenceRpm;
    // Convert to km/h: mm/min -> km/h = (mm/min) / (1000 * 1000) * 60
    const speedKmh = (distancePerMinMm / 1000000) * 60;
    return speedKmh;
}

/**
 * Calculate wheel circumference from rim diameter and tire width
 * @param rimDiameterMm - rim diameter in mm (default 622 for 700c)
 * @param tireWidthMm - tire width in mm (default 28mm)
 * @returns circumference in mm
 */
export function calculateWheelCircumference(
    rimDiameterMm: number = RIM_DIAMETER_700C,
    tireWidthMm: number = 28
): number {
    // Total diameter = Rim Diameter + (2 * Tire Height)
    // Tire height is approximately equal to tire width for standard clinchers
    const totalDiameter = rimDiameterMm + (2 * tireWidthMm);
    return Math.PI * totalDiameter;
}

/**
 * Calculate climbing index (lower is easier for climbing)
 * Based on lowest gear ratio - lower values = easier climbing
 */
export function calculateClimbingIndex(lowestGearRatio: number): number {
    // Return inverse for easier interpretation (higher = easier climbing)
    return 1 / lowestGearRatio;
}

/**
 * Get all possible gear combinations
 */
export function getAllGearRatios(
    chainrings: number[],
    cassetteCogs: number[]
): Array<{ chainring: number; cog: number; ratio: number; gearInches: number }> {
    const gears: Array<{ chainring: number; cog: number; ratio: number; gearInches: number }> = [];

    for (const chainring of chainrings) {
        for (const cog of cassetteCogs) {
            gears.push({
                chainring,
                cog,
                ratio: calculateGearRatio(chainring, cog),
                gearInches: calculateGearInches(chainring, cog),
            });
        }
    }

    // Sort by ratio ascending (easiest to hardest)
    return gears.sort((a, b) => a.ratio - b.ratio);
}

/**
 * Calculate speed range for all gears at given cadence
 */
export function getSpeedRange(
    chainrings: number[],
    cassetteCogs: number[],
    cadenceRpm: number,
    rimDiameterMm: number = RIM_DIAMETER_700C,
    tireWidthMm: number = 28
): { min: number; max: number; speeds: number[] } {
    const wheelCircumference = calculateWheelCircumference(rimDiameterMm, tireWidthMm);
    const gears = getAllGearRatios(chainrings, cassetteCogs);

    const speeds = gears.map(gear =>
        calculateSpeed(gear.ratio, wheelCircumference, cadenceRpm)
    );

    return {
        min: Math.min(...speeds),
        max: Math.max(...speeds),
        speeds,
    };
}

/**
 * Parse cassette range string to array of cog sizes
 * e.g., "10-33" with known increments
 */
export function parseCassetteRange(largestCog: number, smallestCog: number = 10): number[] {
    return getCassetteProgressionMeta(largestCog, smallestCog).cogs;
}

export function getCassetteProgressionMeta(
    largestCog: number,
    smallestCog: number = 10
): { cogs: number[]; synthetic: boolean; family: string } {
    const key = `${smallestCog}-${largestCog}`;
    const known = CASSETTE_LIBRARY[key];
    if (known) {
        return { cogs: known.cogs, synthetic: false, family: known.family };
    }

    // Fallback: create smooth geometric-ish progression.
    const numCogs = largestCog - smallestCog > 24 ? 12 : 11;
    const span = largestCog / smallestCog;
    const cogs = Array.from({ length: numCogs }, (_, i) => {
        const t = i / (numCogs - 1);
        const value = smallestCog * Math.pow(span, t);
        return Math.round(value);
    });
    cogs[0] = smallestCog;
    cogs[cogs.length - 1] = largestCog;

    const deduped = [...new Set(cogs)].sort((a, b) => a - b);
    return { cogs: deduped, synthetic: true, family: 'Synthetic progression' };
}

/**
 * Convert speed from km/h to target unit
 */
export function convertSpeed(speedKmh: number, targetUnit: 'imperial' | 'metric'): number {
    if (targetUnit === 'metric') return speedKmh;
    return speedKmh * 0.621371;
}

/**
 * Get display label for speed unit
 */
export function getSpeedUnit(unitSystem: 'imperial' | 'metric'): string {
    return unitSystem === 'metric' ? 'km/h' : 'mph';
}

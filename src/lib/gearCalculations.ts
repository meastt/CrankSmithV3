/**
 * Gear ratio and performance calculations for bicycle drivetrains
 */

const RIM_DIAMETER_700C = 622; // mm (standard road/gravel rim)
const RIM_DIAMETER_650B = 584; // mm (650b/27.5" rim)

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
    // Common 11-speed cassette progressions
    const common11Speed: Record<string, number[]> = {
        '11-28': [11, 12, 13, 14, 15, 17, 19, 21, 23, 25, 28],
        '11-30': [11, 12, 13, 14, 15, 17, 19, 21, 23, 26, 30],
        '11-32': [11, 12, 13, 14, 15, 17, 19, 21, 24, 28, 32],
        '11-34': [11, 12, 13, 14, 15, 17, 19, 21, 24, 28, 34],
    };

    const common12Speed: Record<string, number[]> = {
        '10-28': [10, 11, 12, 13, 14, 15, 16, 17, 19, 21, 24, 28],
        '10-30': [10, 11, 12, 13, 14, 15, 17, 19, 21, 24, 27, 30],
        '10-33': [10, 11, 12, 13, 14, 15, 17, 19, 21, 24, 28, 33],
        '10-36': [10, 11, 12, 13, 15, 17, 19, 21, 24, 28, 32, 36],
        '10-50': [10, 12, 14, 16, 18, 21, 24, 28, 32, 36, 42, 50],
        '10-51': [10, 12, 14, 16, 18, 21, 24, 28, 33, 39, 45, 51],
        '10-52': [10, 12, 14, 16, 18, 21, 24, 28, 33, 39, 45, 52],
    };

    const key = `${smallestCog}-${largestCog}`;

    // Try to find in common progressions
    if (common12Speed[key]) return common12Speed[key];
    if (common11Speed[key]) return common11Speed[key];

    // Fallback: create linear progression
    const numCogs = 12; // Assume 12-speed
    const increment = (largestCog - smallestCog) / (numCogs - 1);
    return Array.from({ length: numCogs }, (_, i) => Math.round(smallestCog + increment * i));
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

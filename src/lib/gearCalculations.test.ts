import {
    calculateGearRatio,
    calculateSpeed,
    calculateClimbingIndex,
    getAllGearRatios,
    getSpeedRange,
    parseCassetteRange,
    calculateWheelCircumference
} from './gearCalculations';

describe('Gear Calculations', () => {
    describe('calculateGearRatio', () => {
        it('should calculate ratio correctly', () => {
            expect(calculateGearRatio(50, 25)).toBe(2.0);
            expect(calculateGearRatio(34, 34)).toBe(1.0);
        });
    });

    describe('calculateSpeed', () => {
        it('should calculate speed correctly', () => {
            // 50/11 ratio ~ 4.54
            // 700c wheel circumference ~ 2099mm
            // 90 rpm
            // Speed = (4.54 * 2099 * 90) / 1000000 * 60 ~ 51.5 km/h
            const ratio = 50 / 11;
            const circumference = 2099; // approx 700c
            const cadence = 90;
            const speed = calculateSpeed(ratio, circumference, cadence);
            expect(speed).toBeCloseTo(51.5, 1);
        });
    });

    describe('calculateClimbingIndex', () => {
        it('should return inverse of lowest gear ratio', () => {
            // Ratio 1.0 -> Index 1.0
            expect(calculateClimbingIndex(1.0)).toBe(1.0);
            // Ratio 0.5 (easier) -> Index 2.0 (higher score)
            expect(calculateClimbingIndex(0.5)).toBe(2.0);
        });
    });

    describe('getAllGearRatios', () => {
        it('should generate all combinations sorted by ratio', () => {
            const chainrings = [34, 50];
            const cogs = [11, 28];
            const gears = getAllGearRatios(chainrings, cogs);

            expect(gears).toHaveLength(4);
            // Expected ratios: 34/28 (1.21), 34/11 (3.09), 50/28 (1.78), 50/11 (4.54)
            // Sorted: 1.21, 1.78, 3.09, 4.54
            expect(gears[0].ratio).toBeCloseTo(34 / 28, 2);
            expect(gears[3].ratio).toBeCloseTo(50 / 11, 2);
        });
    });

    describe('getSpeedRange', () => {
        it('should return min and max speeds', () => {
            const chainrings = [50];
            const cogs = [10, 20]; // Ratios: 5.0, 2.5
            const cadence = 90;
            const result = getSpeedRange(chainrings, cogs, cadence);

            expect(result.min).toBeLessThan(result.max);
            expect(result.speeds).toHaveLength(2);
        });
    });

    describe('parseCassetteRange', () => {
        it('should return known 12-speed range', () => {
            const range = parseCassetteRange(33, 10);
            expect(range).toEqual([10, 11, 12, 13, 14, 15, 17, 19, 21, 24, 28, 33]);
        });

        it('should fallback to linear interpolation for unknown range', () => {
            const range = parseCassetteRange(100, 10); // Hypothetical giant cassette
            expect(range).toHaveLength(12);
            expect(range[0]).toBe(10);
            expect(range[11]).toBe(100);
        });
    });
});

import {
    calculateGearRatio,
    calculateGearInches,
    calculateSpeed,
    calculateClimbingIndex,
    calculateWheelCircumference,
    getAllGearRatios,
    getSpeedRange,
    parseCassetteRange,
    convertSpeed,
    getSpeedUnit,
    getCassetteProgressionMeta
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

        it('should fallback to synthetic interpolation for unknown range', () => {
            const range = parseCassetteRange(100, 10); // Hypothetical giant cassette
            expect(range.length).toBeGreaterThanOrEqual(10);
            expect(range[0]).toBe(10);
            expect(range[range.length - 1]).toBe(100);
        });

        it('should return metadata for known and synthetic cassettes', () => {
            const known = getCassetteProgressionMeta(33, 10);
            const synthetic = getCassetteProgressionMeta(47, 10);

            expect(known.synthetic).toBe(false);
            expect(known.family).toMatch(/12-speed/i);
            expect(synthetic.synthetic).toBe(true);
            expect(synthetic.family).toBe('Synthetic progression');
        });
    });
});

// ===========================================================================
// Extended Tests — Real-world Scenarios
// ===========================================================================

describe('calculateGearInches', () => {
    it('50/11 on default wheel should return ~121 gear inches', () => {
        // Default wheel = 622 + 2*28 = 678mm diameter = 26.69 inches
        // Ratio 50/11 = 4.545; gear inches = 4.545 * 26.69 = ~121.3
        const gi = calculateGearInches(50, 11);
        expect(gi).toBeCloseTo(121.3, 0);
    });

    it('34/34 on default wheel should return ~26.7 gear inches', () => {
        const gi = calculateGearInches(34, 34);
        expect(gi).toBeCloseTo(26.69, 0);
    });

    it('should accept custom wheel diameter', () => {
        // 650b x 47c: diameter = 584 + 2*47 = 678mm = 26.69 inches
        const gi = calculateGearInches(40, 20, 678);
        const expected = (40 / 20) * (678 / 25.4);
        expect(gi).toBeCloseTo(expected, 2);
    });
});

describe('calculateWheelCircumference — extended', () => {
    it('700x25c -> ~2111mm', () => {
        // pi * (622 + 2*25) = pi * 672 = 2111.15
        expect(calculateWheelCircumference(622, 25)).toBeCloseTo(Math.PI * 672, 0);
    });

    it('700x28c -> ~2130mm', () => {
        expect(calculateWheelCircumference(622, 28)).toBeCloseTo(Math.PI * 678, 0);
    });

    it('29x2.4" (622 + 60mm tire) -> ~2331mm', () => {
        // 29er with 2.4" tire ≈ 60mm; pi * (622 + 120) = pi * 742
        expect(calculateWheelCircumference(622, 60)).toBeCloseTo(Math.PI * 742, 0);
    });

    it('650bx47c -> ~2130mm', () => {
        // pi * (584 + 2*47) = pi * 678
        expect(calculateWheelCircumference(584, 47)).toBeCloseTo(Math.PI * 678, 0);
    });

    it('700x28c and 650bx47c should have similar circumference', () => {
        const road = calculateWheelCircumference(622, 28);
        const gravel650 = calculateWheelCircumference(584, 47);
        expect(Math.abs(road - gravel650)).toBeLessThan(1); // nearly identical
    });
});

describe('Real-world drivetrain scenarios', () => {
    const circ700x25 = calculateWheelCircumference(622, 25);
    const circ700x28 = calculateWheelCircumference(622, 28);
    const circ700x40 = calculateWheelCircumference(622, 40);
    const circ29x24 = calculateWheelCircumference(622, 60);
    const circ650bx47 = calculateWheelCircumference(584, 47);

    describe('Pro road: 54/40 x 11-28 on 700x25c', () => {
        const chainrings = [54, 40];
        const cassette = parseCassetteRange(28, 11);

        it('should calculate correct top speed at 90 rpm', () => {
            const topRatio = calculateGearRatio(54, 11);
            const topSpeed = calculateSpeed(topRatio, circ700x25, 90);
            expect(topSpeed).toBeCloseTo(55.96, 0);
        });

        it('should calculate correct min speed at 90 rpm', () => {
            const lowRatio = calculateGearRatio(40, 28);
            const minSpeed = calculateSpeed(lowRatio, circ700x25, 90);
            expect(minSpeed).toBeCloseTo(16.29, 0);
        });

        it('should generate correct total gear combinations', () => {
            const gears = getAllGearRatios(chainrings, cassette);
            expect(gears).toHaveLength(chainrings.length * cassette.length);
        });
    });

    describe('Compact road: 50/34 x 11-34 on 700x28c', () => {
        const chainrings = [50, 34];
        const cassette = parseCassetteRange(34, 11);

        it('top speed at 90 rpm', () => {
            const range = getSpeedRange(chainrings, cassette, 90, 622, 28);
            expect(range.max).toBeCloseTo(calculateSpeed(50 / 11, circ700x28, 90), 1);
        });

        it('min speed at 90 rpm', () => {
            const range = getSpeedRange(chainrings, cassette, 90, 622, 28);
            expect(range.min).toBeCloseTo(calculateSpeed(34 / 34, circ700x28, 90), 1);
        });

        it('climbing index from lowest gear (34/34)', () => {
            expect(calculateClimbingIndex(34 / 34)).toBe(1.0);
        });
    });

    describe('Gravel 1x: 40T x 10-44 on 700x40c', () => {
        it('top speed at 90 rpm', () => {
            const topSpeed = calculateSpeed(40 / 10, circ700x40, 90);
            expect(topSpeed).toBeGreaterThan(45);
            expect(topSpeed).toBeLessThan(55);
        });

        it('climbing index (40/44)', () => {
            const index = calculateClimbingIndex(40 / 44);
            expect(index).toBeCloseTo(1.1, 1);
        });
    });

    describe('MTB Eagle: 32T x 10-52 on 29x2.4"', () => {
        it('top speed at 90 rpm', () => {
            const topSpeed = calculateSpeed(32 / 10, circ29x24, 90);
            expect(topSpeed).toBeGreaterThan(38);
            expect(topSpeed).toBeLessThan(45);
        });

        it('min speed at 90 rpm (32/52)', () => {
            const minSpeed = calculateSpeed(32 / 52, circ29x24, 90);
            expect(minSpeed).toBeGreaterThan(6);
            expect(minSpeed).toBeLessThan(10);
        });

        it('climbing index (32/52)', () => {
            const index = calculateClimbingIndex(32 / 52);
            // 1 / (32/52) = 52/32 = 1.625
            expect(index).toBeCloseTo(1.625, 2);
        });

        it('gear range should be ~520%', () => {
            const highest = 32 / 10;
            const lowest = 32 / 52;
            const rangePercent = (highest / lowest) * 100;
            expect(rangePercent).toBeCloseTo(520, 0);
        });
    });

    describe('650b gravel: 46/30 x 11-34 on 650bx47c', () => {
        const chainrings = [46, 30];
        const cassette = parseCassetteRange(34, 11);

        it('top speed at 90 rpm', () => {
            const topSpeed = calculateSpeed(46 / 11, circ650bx47, 90);
            expect(topSpeed).toBeGreaterThan(44);
            expect(topSpeed).toBeLessThan(52);
        });

        it('min speed at 90 rpm (30/34)', () => {
            const minSpeed = calculateSpeed(30 / 34, circ650bx47, 90);
            expect(minSpeed).toBeGreaterThan(8);
            expect(minSpeed).toBeLessThan(12);
        });
    });
});

describe('Speed at different cadences', () => {
    const circ = calculateWheelCircumference(622, 25);
    const ratio = calculateGearRatio(50, 11);

    it('speed at 60 rpm should be 2/3 of speed at 90 rpm', () => {
        const s60 = calculateSpeed(ratio, circ, 60);
        const s90 = calculateSpeed(ratio, circ, 90);
        expect(s60).toBeCloseTo(s90 * (60 / 90), 2);
    });

    it('speed at 110 rpm should be 110/90 of speed at 90 rpm', () => {
        const s90 = calculateSpeed(ratio, circ, 90);
        const s110 = calculateSpeed(ratio, circ, 110);
        expect(s110).toBeCloseTo(s90 * (110 / 90), 2);
    });

    it('speed scales linearly with cadence', () => {
        const s1 = calculateSpeed(ratio, circ, 50);
        const s2 = calculateSpeed(ratio, circ, 100);
        expect(s2).toBeCloseTo(s1 * 2, 2);
    });

    it('zero cadence should return 0 speed', () => {
        expect(calculateSpeed(ratio, circ, 0)).toBe(0);
    });
});

describe('Wheel size comparison', () => {
    it('650b should produce lower speed than 700c with same drivetrain', () => {
        const circ700 = calculateWheelCircumference(622, 28);
        const circ650 = calculateWheelCircumference(584, 47);
        const ratio = calculateGearRatio(40, 20);
        const speed700 = calculateSpeed(ratio, circ700, 90);
        const speed650 = calculateSpeed(ratio, circ650, 90);
        // 700x28c and 650bx47c have nearly identical circumference
        // so speeds should be very close
        expect(Math.abs(speed700 - speed650)).toBeLessThan(0.1);
    });

    it('700x25c should be faster than 650bx40c with same gear', () => {
        const circ700 = calculateWheelCircumference(622, 25); // pi*672
        const circ650 = calculateWheelCircumference(584, 40); // pi*664
        const ratio = 2.0;
        const speed700 = calculateSpeed(ratio, circ700, 90);
        const speed650 = calculateSpeed(ratio, circ650, 90);
        expect(speed700).toBeGreaterThan(speed650);
    });
});

describe('parseCassetteRange — all known progressions', () => {
    // 11-speed
    it('11-28', () => {
        expect(parseCassetteRange(28, 11)).toEqual([11, 12, 13, 14, 15, 17, 19, 21, 23, 25, 28]);
    });
    it('11-30', () => {
        expect(parseCassetteRange(30, 11)).toEqual([11, 12, 13, 14, 15, 17, 19, 21, 23, 26, 30]);
    });
    it('11-32', () => {
        expect(parseCassetteRange(32, 11)).toEqual([11, 12, 13, 14, 15, 17, 19, 21, 24, 28, 32]);
    });
    it('11-34', () => {
        expect(parseCassetteRange(34, 11)).toEqual([11, 12, 13, 14, 15, 17, 19, 21, 24, 28, 34]);
    });

    // 12-speed
    it('10-28', () => {
        expect(parseCassetteRange(28, 10)).toEqual([10, 11, 12, 13, 14, 15, 16, 17, 19, 21, 24, 28]);
    });
    it('10-30', () => {
        expect(parseCassetteRange(30, 10)).toEqual([10, 11, 12, 13, 14, 15, 17, 19, 21, 24, 27, 30]);
    });
    it('10-33', () => {
        expect(parseCassetteRange(33, 10)).toEqual([10, 11, 12, 13, 14, 15, 17, 19, 21, 24, 28, 33]);
    });
    it('10-36', () => {
        expect(parseCassetteRange(36, 10)).toEqual([10, 11, 12, 13, 15, 17, 19, 21, 24, 28, 32, 36]);
    });
    it('10-50', () => {
        expect(parseCassetteRange(50, 10)).toEqual([10, 12, 14, 16, 18, 21, 24, 28, 32, 36, 42, 50]);
    });
    it('10-51', () => {
        expect(parseCassetteRange(51, 10)).toEqual([10, 12, 14, 16, 18, 21, 24, 28, 33, 39, 45, 51]);
    });
    it('10-52', () => {
        expect(parseCassetteRange(52, 10)).toEqual([10, 12, 14, 16, 18, 21, 24, 28, 33, 39, 45, 52]);
    });
});

describe('Edge cases', () => {
    it('single-speed: 1 chainring, 1 cog -> 1 gear', () => {
        const gears = getAllGearRatios([42], [16]);
        expect(gears).toHaveLength(1);
        expect(gears[0].ratio).toBeCloseTo(42 / 16, 3);
    });

    it('extreme low ratio: 30/52 -> 0.577', () => {
        expect(calculateGearRatio(30, 52)).toBeCloseTo(0.577, 2);
    });

    it('climbing index for extreme low ratio', () => {
        // 1 / (30/52) = 52/30 = 1.733
        expect(calculateClimbingIndex(30 / 52)).toBeCloseTo(1.733, 2);
    });

    it('getAllGearRatios with empty arrays — returns empty, no crash', () => {
        expect(getAllGearRatios([], [])).toEqual([]);
        expect(getAllGearRatios([50], [])).toEqual([]);
        expect(getAllGearRatios([], [11])).toEqual([]);
    });

    it('parseCassetteRange with 9-speed style range (synthetic fallback)', () => {
        const range = parseCassetteRange(32, 11);
        // 11-32 is a known 11-speed range, but a 9-speed 11-32 doesn't exist in library
        // It should match the known 11-speed entry
        expect(range).toBeDefined();
        expect(range.length).toBeGreaterThanOrEqual(9);
        expect(range[0]).toBe(11);
        expect(range[range.length - 1]).toBe(32);
    });
});

describe('convertSpeed', () => {
    it('metric returns km/h as-is', () => {
        expect(convertSpeed(50, 'metric')).toBe(50);
    });

    it('imperial converts km/h to mph', () => {
        expect(convertSpeed(50, 'imperial')).toBeCloseTo(31.069, 2);
    });

    it('0 km/h -> 0 mph', () => {
        expect(convertSpeed(0, 'imperial')).toBe(0);
    });
});

describe('getSpeedUnit', () => {
    it('metric -> km/h', () => {
        expect(getSpeedUnit('metric')).toBe('km/h');
    });

    it('imperial -> mph', () => {
        expect(getSpeedUnit('imperial')).toBe('mph');
    });
});

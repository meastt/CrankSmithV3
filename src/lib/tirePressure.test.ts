import { calculateBasePsi, calculateTirePressure, type TirePressureInput } from './tirePressureCalculations';
import { toWeight, fromWeight, toPressure, pressureUnit, weightUnit, toSpeed, speedUnit } from './unitConversions';

// Helper to build a default input and override specific fields
function makeInput(overrides: Partial<TirePressureInput> = {}): TirePressureInput {
    return {
        riderWeight: 75,
        bikeWeight: 8,
        tireWidth: 28,
        rimWidth: 21,
        surface: 'road-smooth',
        isTubeless: true,
        isWet: false,
        preference: 0,
        ...overrides,
    };
}

// ===========================================================================
// calculateBasePsi
// ===========================================================================

describe('calculateBasePsi', () => {
    it('should return a positive value for valid inputs', () => {
        expect(calculateBasePsi(100, 25)).toBeGreaterThan(0);
    });

    it('should increase with higher load', () => {
        const low = calculateBasePsi(80, 25);
        const high = calculateBasePsi(120, 25);
        expect(high).toBeGreaterThan(low);
    });

    it('should decrease with wider tires', () => {
        const narrow = calculateBasePsi(100, 25);
        const wide = calculateBasePsi(100, 40);
        expect(wide).toBeLessThan(narrow);
    });

    it('should match the formula: 140 * (load / width^1.5)^0.9', () => {
        const load = 100;
        const width = 28;
        const expected = 140 * Math.pow(load / Math.pow(width, 1.5), 0.9);
        expect(calculateBasePsi(load, width)).toBeCloseTo(expected, 5);
    });
});

// ===========================================================================
// calculateTirePressure — Real-world scenarios
// ===========================================================================

describe('calculateTirePressure', () => {
    describe('Real-world scenarios', () => {
        it('Road cyclist: 75kg rider, 8kg bike, 25mm tires, 19mm rims, smooth, tubeless', () => {
            const result = calculateTirePressure(makeInput({
                tireWidth: 25, rimWidth: 19, surface: 'road-smooth', isTubeless: true,
            }));
            // 25mm tire on 19mm rim => measuredWidth = 25 + (19-19)*0.4 = 25mm
            // Total = 83kg * 2.20462 = 182.98 lbs
            // Front load = 82.34, Rear load = 100.64
            // Base front = 140 * (82.34 / 25^1.5)^0.9, rear similar
            // Then tubeless *0.9
            expect(result.front.recommended).toBeGreaterThan(60);
            expect(result.front.recommended).toBeLessThan(110);
            expect(result.rear.recommended).toBeGreaterThan(result.front.recommended);
        });

        it('Light gravel rider: 65kg, 9kg, 40mm tires, 25mm rims, gravel-smooth, tubeless', () => {
            const result = calculateTirePressure(makeInput({
                riderWeight: 65, bikeWeight: 9, tireWidth: 40, rimWidth: 25,
                surface: 'gravel-smooth', isTubeless: true,
            }));
            expect(result.front.recommended).toBeGreaterThan(25);
            expect(result.front.recommended).toBeLessThan(50);
            expect(result.rear.recommended).toBeGreaterThan(result.front.recommended);
        });

        it('Heavy MTB enduro: 100kg, 14kg, 60mm tires, 30mm rims, enduro, tubeless', () => {
            const result = calculateTirePressure(makeInput({
                riderWeight: 100, bikeWeight: 14, tireWidth: 60, rimWidth: 30,
                surface: 'mtb-enduro', isTubeless: true,
            }));
            expect(result.front.recommended).toBeGreaterThan(15);
            expect(result.front.recommended).toBeLessThan(35);
            expect(result.rear.recommended).toBeGreaterThan(result.front.recommended);
        });

        it('Lightweight climber: 55kg, 6.5kg, 28mm tires, 21mm rims, smooth, clincher', () => {
            const result = calculateTirePressure(makeInput({
                riderWeight: 55, bikeWeight: 6.5, tireWidth: 28, rimWidth: 21,
                surface: 'road-smooth', isTubeless: false,
            }));
            // Clincher (not tubeless) — should be higher than tubeless equivalent
            expect(result.front.recommended).toBeGreaterThan(50);
            expect(result.front.recommended).toBeLessThan(90);
        });
    });

    // -----------------------------------------------------------------------
    // Modifier effects
    // -----------------------------------------------------------------------

    describe('Modifier effects', () => {
        it('tubeless reduces pressure by exactly 10%', () => {
            const clincher = calculateTirePressure(makeInput({ isTubeless: false }));
            const tubeless = calculateTirePressure(makeInput({ isTubeless: true }));
            expect(tubeless.front.recommended).toBeCloseTo(clincher.front.recommended * 0.9, 1);
            expect(tubeless.rear.recommended).toBeCloseTo(clincher.rear.recommended * 0.9, 1);
        });

        it('road-poor applies 0.95 multiplier', () => {
            const smooth = calculateTirePressure(makeInput({ surface: 'road-smooth' }));
            const poor = calculateTirePressure(makeInput({ surface: 'road-poor' }));
            expect(poor.front.recommended).toBeCloseTo(smooth.front.recommended * 0.95, 1);
        });

        it('gravel-smooth applies 0.9 multiplier', () => {
            const smooth = calculateTirePressure(makeInput({ surface: 'road-smooth' }));
            const gravel = calculateTirePressure(makeInput({ surface: 'gravel-smooth' }));
            expect(gravel.front.recommended).toBeCloseTo(smooth.front.recommended * 0.9, 1);
        });

        it('gravel-chunky applies 0.85 multiplier', () => {
            const smooth = calculateTirePressure(makeInput({ surface: 'road-smooth' }));
            const chunky = calculateTirePressure(makeInput({ surface: 'gravel-chunky' }));
            expect(chunky.front.recommended).toBeCloseTo(smooth.front.recommended * 0.85, 1);
        });

        it('mtb-trail applies 0.8 multiplier', () => {
            const smooth = calculateTirePressure(makeInput({ surface: 'road-smooth' }));
            const trail = calculateTirePressure(makeInput({ surface: 'mtb-trail' }));
            expect(trail.front.recommended).toBeCloseTo(smooth.front.recommended * 0.8, 1);
        });

        it('mtb-enduro applies 0.75 multiplier', () => {
            const smooth = calculateTirePressure(makeInput({ surface: 'road-smooth' }));
            const enduro = calculateTirePressure(makeInput({ surface: 'mtb-enduro' }));
            expect(enduro.front.recommended).toBeCloseTo(smooth.front.recommended * 0.75, 1);
        });

        it('wet conditions subtract exactly 3 psi', () => {
            const dry = calculateTirePressure(makeInput({ isWet: false }));
            const wet = calculateTirePressure(makeInput({ isWet: true }));
            // Wet subtracts 3 psi BEFORE preference but after surface
            // With preference=0, modifier=1, so wet = dry - 3
            expect(wet.front.recommended).toBeCloseTo(dry.front.recommended - 3, 1);
            expect(wet.rear.recommended).toBeCloseTo(dry.rear.recommended - 3, 1);
        });

        it('max grip preference (−1) reduces by ~8%', () => {
            const balanced = calculateTirePressure(makeInput({ preference: 0 }));
            const grip = calculateTirePressure(makeInput({ preference: -1 }));
            expect(grip.front.recommended).toBeCloseTo(balanced.front.recommended * 0.92, 1);
        });

        it('max speed preference (+1) increases by ~8%', () => {
            const balanced = calculateTirePressure(makeInput({ preference: 0 }));
            const speed = calculateTirePressure(makeInput({ preference: 1 }));
            expect(speed.front.recommended).toBeCloseTo(balanced.front.recommended * 1.08, 1);
        });
    });

    // -----------------------------------------------------------------------
    // Rim width effect
    // -----------------------------------------------------------------------

    describe('Rim width effect', () => {
        it('wider rim lowers pressure (same tire width)', () => {
            const narrow = calculateTirePressure(makeInput({ tireWidth: 25, rimWidth: 17 }));
            const wide = calculateTirePressure(makeInput({ tireWidth: 25, rimWidth: 25 }));
            expect(wide.front.recommended).toBeLessThan(narrow.front.recommended);
        });

        it('standard 19mm rim applies no width adjustment', () => {
            // measuredWidth = tireWidth + (19-19)*0.4 = tireWidth exactly
            const result = calculateTirePressure(makeInput({ tireWidth: 25, rimWidth: 19 }));
            // Verify by computing manually
            const totalLbs = (75 + 8) * 2.20462;
            const frontLoad = totalLbs * 0.45;
            const expectedFront = calculateBasePsi(frontLoad, 25) * 0.9; // tubeless
            expect(result.front.recommended).toBeCloseTo(expectedFront, 1);
        });
    });

    // -----------------------------------------------------------------------
    // Safety clamping
    // -----------------------------------------------------------------------

    describe('Safety clamping', () => {
        it('should clamp to 15 psi minimum for very light rider with wide MTB tires', () => {
            const result = calculateTirePressure(makeInput({
                riderWeight: 40, bikeWeight: 5, tireWidth: 60, rimWidth: 35,
                surface: 'mtb-enduro', isTubeless: true, isWet: true, preference: -1,
            }));
            expect(result.front.recommended).toBe(15);
            expect(result.rear.recommended).toBeGreaterThanOrEqual(15);
        });

        it('should clamp to 120 psi maximum for heavy rider with narrow tires', () => {
            const result = calculateTirePressure(makeInput({
                riderWeight: 140, bikeWeight: 12, tireWidth: 23, rimWidth: 15,
                surface: 'road-smooth', isTubeless: false, preference: 1,
            }));
            expect(result.rear.recommended).toBe(120);
        });
    });

    // -----------------------------------------------------------------------
    // Weight distribution
    // -----------------------------------------------------------------------

    describe('Weight distribution', () => {
        it('rear should always be higher than front (55/45 split)', () => {
            const scenarios: Partial<TirePressureInput>[] = [
                { tireWidth: 25, surface: 'road-smooth' },
                { tireWidth: 40, surface: 'gravel-smooth' },
                { tireWidth: 60, surface: 'mtb-trail' },
            ];
            for (const s of scenarios) {
                const result = calculateTirePressure(makeInput(s));
                expect(result.rear.recommended).toBeGreaterThan(result.front.recommended);
            }
        });
    });

    // -----------------------------------------------------------------------
    // Min / Max range
    // -----------------------------------------------------------------------

    describe('Min/Max range', () => {
        it('min should be 90% of recommended, max should be 110%', () => {
            const result = calculateTirePressure(makeInput());
            expect(result.front.min).toBeCloseTo(result.front.recommended * 0.9, 5);
            expect(result.front.max).toBeCloseTo(result.front.recommended * 1.1, 5);
            expect(result.rear.min).toBeCloseTo(result.rear.recommended * 0.9, 5);
            expect(result.rear.max).toBeCloseTo(result.rear.recommended * 1.1, 5);
        });
    });
});

// ===========================================================================
// Unit Conversions
// ===========================================================================

describe('Unit Conversions', () => {
    it('toWeight: 75 kg -> ~165.35 lbs', () => {
        expect(toWeight(75, 'imperial')).toBeCloseTo(165.346, 1);
    });

    it('toWeight: kg stays as kg in metric', () => {
        expect(toWeight(75, 'metric')).toBe(75);
    });

    it('fromWeight: 165 lbs -> ~74.84 kg', () => {
        expect(fromWeight(165, 'imperial')).toBeCloseTo(74.843, 1);
    });

    it('fromWeight: kg stays as kg in metric', () => {
        expect(fromWeight(75, 'metric')).toBe(75);
    });

    it('toPressure: 100 psi -> ~6.89 bar', () => {
        expect(toPressure(100, 'metric')).toBeCloseTo(6.895, 2);
    });

    it('toPressure: psi stays as psi in imperial', () => {
        expect(toPressure(100, 'imperial')).toBe(100);
    });

    it('pressureUnit: metric -> bar, imperial -> psi', () => {
        expect(pressureUnit('metric')).toBe('bar');
        expect(pressureUnit('imperial')).toBe('psi');
    });

    it('weightUnit: metric -> kg, imperial -> lbs', () => {
        expect(weightUnit('metric')).toBe('kg');
        expect(weightUnit('imperial')).toBe('lbs');
    });

    it('toSpeed: 50 km/h -> ~31.07 mph', () => {
        expect(toSpeed(50, 'imperial')).toBeCloseTo(31.069, 2);
    });

    it('toSpeed: km/h stays in metric', () => {
        expect(toSpeed(50, 'metric')).toBe(50);
    });

    it('speedUnit: metric -> km/h, imperial -> mph', () => {
        expect(speedUnit('metric')).toBe('km/h');
        expect(speedUnit('imperial')).toBe('mph');
    });
});

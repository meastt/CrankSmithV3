import { computeUnifiedWhatIf, WhatIfInput } from './whatIfEngine';

function makeInput(overrides: Partial<WhatIfInput> = {}): WhatIfInput {
    return {
        baseline: {
            chainrings: [50, 34],
            cassetteRange: '11-30',
            tireSize: 28,
            wheelSize: 622,
        },
        candidate: {
            chainrings: [48, 31],
            cassetteRange: '10-44',
            tireSize: 40,
            wheelSize: 622,
        },
        ftp: 260,
        riderWeightKg: 75,
        ...overrides,
    };
}

describe('computeUnifiedWhatIf', () => {
    it('returns directional deltas between setups', () => {
        const result = computeUnifiedWhatIf(makeInput());

        expect(typeof result.topSpeedDeltaKph).toBe('number');
        expect(typeof result.cadenceDeltaRpmAtGrade).toBe('number');
        expect(result.pressureHintDeltaPct).toBeLessThan(0); // wider tire candidate -> lower pressure hint
    });

    it('identical baseline and candidate — all deltas should be zero', () => {
        const setup = {
            chainrings: [50, 34],
            cassetteRange: '11-30',
            tireSize: 28,
            wheelSize: 622,
        };
        const result = computeUnifiedWhatIf(makeInput({
            baseline: { ...setup },
            candidate: { ...setup },
        }));

        expect(result.topSpeedDeltaKph).toBe(0);
        expect(result.cadenceDeltaRpmAtGrade).toBe(0);
        expect(result.pressureHintDeltaPct).toBe(0);
    });

    it('wider tire candidate — pressureHintDeltaPct should be negative', () => {
        const result = computeUnifiedWhatIf(makeInput({
            baseline: { chainrings: [50, 34], cassetteRange: '11-30', tireSize: 25, wheelSize: 622 },
            candidate: { chainrings: [50, 34], cassetteRange: '11-30', tireSize: 40, wheelSize: 622 },
        }));

        expect(result.pressureHintDeltaPct).toBeLessThan(0);
    });

    it('narrower tire candidate — pressureHintDeltaPct should be positive', () => {
        const result = computeUnifiedWhatIf(makeInput({
            baseline: { chainrings: [50, 34], cassetteRange: '11-30', tireSize: 40, wheelSize: 622 },
            candidate: { chainrings: [50, 34], cassetteRange: '11-30', tireSize: 25, wheelSize: 622 },
        }));

        expect(result.pressureHintDeltaPct).toBeGreaterThan(0);
    });

    it('1x vs 2x drivetrain — 2x should have higher top speed', () => {
        const result = computeUnifiedWhatIf(makeInput({
            baseline: { chainrings: [40], cassetteRange: '10-44', tireSize: 40, wheelSize: 622 },
            candidate: { chainrings: [50, 34], cassetteRange: '11-30', tireSize: 28, wheelSize: 622 },
        }));

        // 2x candidate with 50T big ring should be faster than 1x 40T
        expect(result.topSpeedDeltaKph).toBeGreaterThan(0);
    });

    it('same tire size — pressureHintDeltaPct should be zero', () => {
        const result = computeUnifiedWhatIf(makeInput({
            baseline: { chainrings: [50, 34], cassetteRange: '11-30', tireSize: 28, wheelSize: 622 },
            candidate: { chainrings: [48, 31], cassetteRange: '10-44', tireSize: 28, wheelSize: 622 },
        }));

        expect(result.pressureHintDeltaPct).toBe(0);
    });

    it('invalid cassetteRange format — should not throw', () => {
        expect(() => computeUnifiedWhatIf(makeInput({
            baseline: { chainrings: [50], cassetteRange: 'abc', tireSize: 28, wheelSize: 622 },
            candidate: { chainrings: [50], cassetteRange: '11-30', tireSize: 28, wheelSize: 622 },
        }))).not.toThrow();
    });
});

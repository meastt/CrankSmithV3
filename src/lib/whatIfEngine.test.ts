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

    describe('Phase 5 non-builder coverage', () => {
        it('supports MTB-to-gravel comparisons without builder discipline metadata', () => {
            const result = computeUnifiedWhatIf(makeInput({
                baseline: { chainrings: [32], cassetteRange: '10-52', tireSize: 60, wheelSize: 622 }, // MTB-like
                candidate: { chainrings: [40], cassetteRange: '10-44', tireSize: 42, wheelSize: 622 }, // Gravel-like
                ftp: 280,
                riderWeightKg: 82,
            }));

            expect(Number.isFinite(result.topSpeedDeltaKph)).toBe(true);
            expect(Number.isFinite(result.cadenceDeltaRpmAtGrade)).toBe(true);
            expect(Number.isFinite(result.pressureHintDeltaPct)).toBe(true);
        });

        it('supports road-to-gravel comparisons and preserves pressure hint direction', () => {
            const result = computeUnifiedWhatIf(makeInput({
                baseline: { chainrings: [52, 36], cassetteRange: '11-30', tireSize: 28, wheelSize: 622 }, // Road-like
                candidate: { chainrings: [48, 31], cassetteRange: '10-44', tireSize: 40, wheelSize: 622 }, // Gravel-like
            }));

            // Candidate tire is wider than baseline -> pressure hint should be negative
            expect(result.pressureHintDeltaPct).toBeLessThan(0);
        });

        it('remains finite when legacy/non-builder payload has malformed numeric inputs', () => {
            const result = computeUnifiedWhatIf(makeInput({
                baseline: {
                    chainrings: [],
                    cassetteRange: 'abc',
                    tireSize: -1 as unknown as number,
                    wheelSize: Number.NaN as unknown as number,
                },
                candidate: {
                    chainrings: [0, -10],
                    cassetteRange: '10-44',
                    tireSize: Number.NaN as unknown as number,
                    wheelSize: 622,
                },
                ftp: Number.NaN as unknown as number,
                riderWeightKg: -5,
                cadenceRpm: Number.NaN as unknown as number,
                climbGradePercent: -1,
            }));

            expect(Number.isFinite(result.topSpeedDeltaKph)).toBe(true);
            expect(Number.isFinite(result.cadenceDeltaRpmAtGrade)).toBe(true);
            expect(Number.isFinite(result.pressureHintDeltaPct)).toBe(true);
        });
    });
});

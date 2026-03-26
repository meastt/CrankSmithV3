import { computeUnifiedWhatIf } from './whatIfEngine';

describe('computeUnifiedWhatIf', () => {
    it('returns directional deltas between setups', () => {
        const result = computeUnifiedWhatIf({
            baseline: {
                chainrings: [50, 34],
                cassetteRange: '11-30',
                tireSize: 28,
                wheelSize: 622
            },
            candidate: {
                chainrings: [48, 31],
                cassetteRange: '10-44',
                tireSize: 40,
                wheelSize: 622
            },
            ftp: 260,
            riderWeightKg: 75
        });

        expect(typeof result.topSpeedDeltaKph).toBe('number');
        expect(typeof result.cadenceDeltaRpmAtGrade).toBe('number');
        expect(result.pressureHintDeltaPct).toBeLessThan(0); // wider tire candidate -> lower pressure hint
    });
});

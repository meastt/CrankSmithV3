export interface RolloutGateMetrics {
    builderCompletionRate: number;
    validationErrorRate: number;
    nonGravelSelectionAttempts: number;
}

export interface RolloutGateCheck {
    name: string;
    pass: boolean;
    detail: string;
}

export interface RolloutGateResult {
    pass: boolean;
    checks: RolloutGateCheck[];
}

const EPSILON = 1e-9;

function pctChange(current: number, baseline: number): number {
    if (baseline === 0) return current === 0 ? 0 : Infinity;
    return ((current - baseline) / baseline) * 100;
}

/**
 * Phase 6 KPI gates from Section 5.4
 * 1) completion rate drop < 5%
 * 2) validation error rate increase < 10%
 * 3) non-gravel selection attempts trend downward (current <= baseline)
 */
export function evaluateRolloutGates(
    baseline: RolloutGateMetrics,
    current: RolloutGateMetrics
): RolloutGateResult {
    const completionDropPct = pctChange(current.builderCompletionRate, baseline.builderCompletionRate);
    const validationIncreasePct = pctChange(current.validationErrorRate, baseline.validationErrorRate);
    const nonGravelDeltaPct = pctChange(current.nonGravelSelectionAttempts, baseline.nonGravelSelectionAttempts);

    const checks: RolloutGateCheck[] = [
        {
            name: 'builder_completion_rate',
            pass: completionDropPct > -5,
            detail: `completion Δ=${completionDropPct.toFixed(2)}% (must be > -5.00%)`,
        },
        {
            name: 'validation_error_rate',
            pass: validationIncreasePct < (10 - EPSILON),
            detail: `validation errors Δ=${validationIncreasePct.toFixed(2)}% (must be < 10.00%)`,
        },
        {
            name: 'non_gravel_selection_attempts',
            pass: current.nonGravelSelectionAttempts <= baseline.nonGravelSelectionAttempts,
            detail: `attempts ${baseline.nonGravelSelectionAttempts} -> ${current.nonGravelSelectionAttempts} (Δ=${nonGravelDeltaPct.toFixed(2)}%, must be <= baseline)`,
        },
    ];

    return {
        pass: checks.every((c) => c.pass),
        checks,
    };
}

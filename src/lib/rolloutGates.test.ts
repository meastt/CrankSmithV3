import { evaluateRolloutGates } from './rolloutGates';

describe('evaluateRolloutGates', () => {
  const baseline = {
    builderCompletionRate: 0.5,
    validationErrorRate: 0.1,
    nonGravelSelectionAttempts: 100,
  };

  test('passes when all KPI gates are within thresholds', () => {
    const result = evaluateRolloutGates(baseline, {
      builderCompletionRate: 0.49, // -2%
      validationErrorRate: 0.105, // +5%
      nonGravelSelectionAttempts: 90,
    });

    expect(result.pass).toBe(true);
    expect(result.checks.every((c) => c.pass)).toBe(true);
  });

  test('fails when completion drops by 5% or more', () => {
    const result = evaluateRolloutGates(baseline, {
      builderCompletionRate: 0.475, // -5%
      validationErrorRate: 0.105,
      nonGravelSelectionAttempts: 90,
    });

    expect(result.pass).toBe(false);
    expect(result.checks.find((c) => c.name === 'builder_completion_rate')?.pass).toBe(false);
  });

  test('fails when validation error increase is 10% or more', () => {
    const result = evaluateRolloutGates(baseline, {
      builderCompletionRate: 0.49,
      validationErrorRate: 0.11, // +10%
      nonGravelSelectionAttempts: 90,
    });

    expect(result.pass).toBe(false);
    expect(result.checks.find((c) => c.name === 'validation_error_rate')?.pass).toBe(false);
  });

  test('fails when non-gravel attempts increase', () => {
    const result = evaluateRolloutGates(baseline, {
      builderCompletionRate: 0.49,
      validationErrorRate: 0.105,
      nonGravelSelectionAttempts: 101,
    });

    expect(result.pass).toBe(false);
    expect(result.checks.find((c) => c.name === 'non_gravel_selection_attempts')?.pass).toBe(false);
  });
});

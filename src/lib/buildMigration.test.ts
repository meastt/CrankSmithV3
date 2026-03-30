import { assessBuildForBuilderMigration } from './buildMigration';

describe('assessBuildForBuilderMigration', () => {
  test('marks gravel-compatible builds', () => {
    const result = assessBuildForBuilderMigration({
      Frame: { id: 'f1', name: 'Gravel Frame', discipline: 'gravel', builderEligible: true },
    });

    expect(result.status).toBe('gravel_compatible');
    expect(result.violations).toEqual([]);
  });

  test('marks legacy non-gravel builds with violations', () => {
    const result = assessBuildForBuilderMigration({
      Frame: { id: 'f1', name: 'Road Frame', discipline: 'road', builderEligible: true },
    });

    expect(result.status).toBe('legacy_non_gravel');
    expect(result.violations).toEqual(['Frame: Road Frame']);
  });

  test('marks invalid string payloads', () => {
    const result = assessBuildForBuilderMigration('{invalid-json');

    expect(result.status).toBe('invalid_payload');
    expect(result.violations).toEqual(['Invalid build payload']);
  });
});

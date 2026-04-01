import { buildComponentWhereClause } from './componentFilters';

describe('buildComponentWhereClause', () => {
  const originalFlag = process.env.CRANKSMITH_GRAVEL_BUILDER_ENABLED;

  afterEach(() => {
    if (originalFlag === undefined) delete process.env.CRANKSMITH_GRAVEL_BUILDER_ENABLED;
    else process.env.CRANKSMITH_GRAVEL_BUILDER_ENABLED = originalFlag;
  });

  test('does not apply builder gating for default/non-builder contexts', () => {
    const where = buildComponentWhereClause({
      type: 'Wheel',
      context: null,
      discipline: null,
      builderEligible: null,
    });

    expect(where).toEqual({
      type: 'Wheel',
    });
  });

  test('builds builder context filter', () => {
    const where = buildComponentWhereClause({
      type: 'Frame',
      context: 'builder',
      discipline: null,
      builderEligible: null,
    });

    expect(where).toEqual({
      type: 'Frame',
      builderEligible: true,
      discipline: { in: ['gravel', 'multi'] },
    });
  });

  test('supports explicit non-builder filtering controls', () => {
    const where = buildComponentWhereClause({
      type: 'Cassette',
      context: null,
      discipline: 'road',
      builderEligible: 'false',
    });

    expect(where).toEqual({
      type: 'Cassette',
      discipline: 'road',
      builderEligible: false,
    });
  });

  test('ignores invalid boolean query values', () => {
    const where = buildComponentWhereClause({
      type: null,
      context: null,
      discipline: 'gravel',
      builderEligible: 'sometimes',
    });

    expect(where).toEqual({
      discipline: 'gravel',
    });
  });

  test('builder context ignores discipline and builderEligible query overrides', () => {
    const where = buildComponentWhereClause({
      type: 'Frame',
      context: 'builder',
      discipline: 'road',
      builderEligible: 'false',
    });

    expect(where).toEqual({
      type: 'Frame',
      builderEligible: true,
      discipline: { in: ['gravel', 'multi'] },
    });
  });

  test('treats builder context case-insensitively and trims whitespace', () => {
    const where = buildComponentWhereClause({
      type: 'Frame',
      context: '  BuIlDeR  ',
      discipline: 'road',
      builderEligible: 'false',
    });

    expect(where).toEqual({
      type: 'Frame',
      builderEligible: true,
      discipline: { in: ['gravel', 'multi'] },
    });
  });

  test('disables builder-only filtering when rollout flag is off (soft rollback)', () => {
    process.env.CRANKSMITH_GRAVEL_BUILDER_ENABLED = 'false';
    const where = buildComponentWhereClause({
      type: 'Frame',
      context: 'builder',
      discipline: 'road',
      builderEligible: 'false',
    });

    expect(where).toEqual({
      type: 'Frame',
      discipline: 'road',
      builderEligible: false,
    });
  });
});

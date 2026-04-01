import { validateBuilderPartsPayload } from './builderGuard';

describe('builder guard', () => {
  test('accepts gravel and multi+gravel-tag components', () => {
    const payload = {
      Frame: { id: 'f1', name: 'Gravel Frame', discipline: 'gravel', builderEligible: true },
      RearDerailleur: {
        id: 'rd1',
        name: 'Multi RD',
        discipline: 'multi',
        disciplineTags: ['gravel', 'road'],
        builderEligible: true,
      },
      TireFront: null,
    };

    const result = validateBuilderPartsPayload(payload);
    expect(result.valid).toBe(true);
    expect(result.violations).toEqual([]);
  });

  test('rejects road and mtb builder payload entries', () => {
    const payload = {
      Frame: { id: 'road-1', name: 'Road Frame', discipline: 'road', builderEligible: true },
      Fork: { id: 'mtb-1', name: 'MTB Fork', discipline: 'mtb', builderEligible: true },
    };

    const result = validateBuilderPartsPayload(payload);
    expect(result.valid).toBe(false);
    expect(result.violations).toEqual(expect.arrayContaining([
      'Frame: Road Frame',
      'Fork: MTB Fork',
    ]));
  });

  test('accepts multi components without gravel tag when builderEligible', () => {
    const payload = {
      Cassette: {
        id: 'c1',
        name: 'Multi no gravel',
        discipline: 'multi',
        disciplineTags: ['road'],
        builderEligible: true,
      },
    };

    const result = validateBuilderPartsPayload(payload);
    expect(result.valid).toBe(true);
    expect(result.violations).toEqual([]);
  });
});

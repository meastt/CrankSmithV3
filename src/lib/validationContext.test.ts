import { validateBuilderBuild } from './validationContext';

describe('validateBuilderBuild', () => {
  test('adds builder scope errors for non-gravel parts', () => {
    const result = validateBuilderBuild({
      frame: {
        id: 'road-1',
        name: 'Road Frame',
        discipline: 'road',
        builderEligible: true,
        specs: {},
      },
      wheels: [],
      tires: [],
      brakes: { calipers: [], rotors: [] },
      cockpit: {},
    });

    expect(result.compatible).toBe(false);
    expect(result.issues.some(i => i.message.includes('Builder gravel scope violation'))).toBe(true);
  });

  test('keeps compatibility result when payload is builder-valid', () => {
    const result = validateBuilderBuild({
      frame: {
        id: 'gravel-1',
        name: 'Gravel Frame',
        discipline: 'gravel',
        builderEligible: true,
        specs: {},
      },
      wheels: [],
      tires: [],
      brakes: { calipers: [], rotors: [] },
      cockpit: {},
    });

    const guardIssues = result.issues.filter(i => i.message.includes('Builder gravel scope violation'));
    expect(guardIssues.length).toBe(0);
  });

  test('adds gravel-assumption error for unsupported wheel size', () => {
    const result = validateBuilderBuild({
      frame: { id: 'g1', name: 'Gravel Frame', discipline: 'gravel', builderEligible: true, specs: { category: 'Gravel' } },
      wheels: [{ id: 'w1', specs: { diameter: '26' }, discipline: 'gravel', builderEligible: true }],
      tires: [],
      brakes: { calipers: [], rotors: [] },
      cockpit: {},
    });

    expect(result.issues.some(i => i.message.includes('outside gravel-supported standards'))).toBe(true);
    expect(result.compatible).toBe(false);
  });

  test('adds gravel-assumption warning for very narrow tire', () => {
    const result = validateBuilderBuild({
      frame: { id: 'g1', name: 'Gravel Frame', discipline: 'gravel', builderEligible: true, specs: { category: 'Gravel' } },
      wheels: [{ id: 'w1', specs: { diameter: '700c' }, discipline: 'gravel', builderEligible: true }],
      tires: [{ id: 't1', specs: { width: '32mm' }, discipline: 'gravel', builderEligible: true }],
      brakes: { calipers: [], rotors: [] },
      cockpit: {},
    });

    expect(result.issues.some(i => i.message.includes('narrower than typical gravel fit'))).toBe(true);
  });
});

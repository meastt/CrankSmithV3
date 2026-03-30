import {
  normalizeDiscipline,
  parseDisciplineTags,
  deriveDisciplineFromAttributes,
  validateBuilderEligibility,
} from './discipline';

describe('discipline helpers', () => {
  test('normalizeDiscipline maps known values and falls back to multi', () => {
    expect(normalizeDiscipline('gravel')).toBe('gravel');
    expect(normalizeDiscipline('ROAD')).toBe('road');
    expect(normalizeDiscipline('mountain')).toBe('mtb');
    expect(normalizeDiscipline('unknown')).toBe('multi');
  });

  test('parseDisciplineTags parses JSON and csv tags', () => {
    expect(parseDisciplineTags('["gravel", "road"]')).toEqual(['gravel', 'road']);
    expect(parseDisciplineTags('gravel, mountain,unknown')).toEqual(['gravel', 'mtb']);
    expect(parseDisciplineTags(['road', 'road', 'mtb'])).toEqual(['road', 'mtb']);
  });

  test('deriveDisciplineFromAttributes derives from category when present', () => {
    expect(deriveDisciplineFromAttributes({ category: 'Gravel' })).toBe('gravel');
    expect(deriveDisciplineFromAttributes({ category: 'MTB' })).toBe('mtb');
    expect(deriveDisciplineFromAttributes({})).toBeNull();
  });

  test('validateBuilderEligibility enforces gravel rules', () => {
    expect(validateBuilderEligibility('gravel', [], true).valid).toBe(true);
    expect(validateBuilderEligibility('multi', ['gravel'], true).valid).toBe(true);
    expect(validateBuilderEligibility('road', [], true).valid).toBe(false);
    expect(validateBuilderEligibility('multi', ['road'], true).valid).toBe(false);
    expect(validateBuilderEligibility('mtb', [], false).valid).toBe(true);
  });
});

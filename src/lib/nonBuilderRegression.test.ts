import { calculateTirePressure } from './tirePressureCalculations';
import { calculateWheelCircumference, calculateSpeed, parseCassetteRange } from './gearCalculations';
import { buildComponentWhereClause } from './componentFilters';

describe('non-builder regression coverage (phase 5 complete)', () => {
  test('tire pressure remains multi-discipline: road vs gravel vs mtb outputs are all valid', () => {
    const road = calculateTirePressure({
      riderWeight: 75,
      bikeWeight: 8,
      tireWidth: 28,
      rimWidth: 21,
      surface: 'road-smooth',
      isTubeless: true,
      isWet: false,
      preference: 0,
    });

    const gravel = calculateTirePressure({
      riderWeight: 75,
      bikeWeight: 9,
      tireWidth: 42,
      rimWidth: 25,
      surface: 'gravel-smooth',
      isTubeless: true,
      isWet: false,
      preference: 0,
    });

    const mtb = calculateTirePressure({
      riderWeight: 75,
      bikeWeight: 13,
      tireWidth: 60,
      rimWidth: 30,
      surface: 'mtb-trail',
      isTubeless: true,
      isWet: false,
      preference: 0,
    });

    expect(road.front.recommended).toBeGreaterThan(gravel.front.recommended);
    expect(gravel.front.recommended).toBeGreaterThan(mtb.front.recommended);
    expect(mtb.rear.recommended).toBeGreaterThan(mtb.front.recommended);
  });

  test('gear calculations remain multi-discipline: road and mtb speed ranges are still computable', () => {
    const roadCirc = calculateWheelCircumference(622, 28);
    const mtbCirc = calculateWheelCircumference(622, 60);

    const roadTop = calculateSpeed(50 / 11, roadCirc, 90);
    const roadLow = calculateSpeed(34 / 34, roadCirc, 90);

    const mtbTop = calculateSpeed(32 / 10, mtbCirc, 90);
    const mtbLow = calculateSpeed(32 / 52, mtbCirc, 90);

    expect(roadTop).toBeGreaterThan(roadLow);
    expect(mtbTop).toBeGreaterThan(mtbLow);
    expect(roadTop).toBeGreaterThan(mtbTop);
  });

  test('cassette progression parsing still supports road and wide-range mtb families', () => {
    const road = parseCassetteRange(34, 11);
    const mtb = parseCassetteRange(52, 10);

    expect(road[0]).toBe(11);
    expect(road[road.length - 1]).toBe(34);
    expect(mtb[0]).toBe(10);
    expect(mtb[mtb.length - 1]).toBe(52);
  });

  test('component filter remains non-builder by default unless builder context is explicit', () => {
    const defaultWhere = buildComponentWhereClause({
      type: 'Cassette',
      context: null,
      discipline: null,
      builderEligible: null,
    });

    const roadWhere = buildComponentWhereClause({
      type: 'Cassette',
      context: null,
      discipline: 'road',
      builderEligible: 'false',
    });

    expect(defaultWhere).toEqual({ type: 'Cassette' });
    expect(roadWhere).toEqual({
      type: 'Cassette',
      discipline: 'road',
      builderEligible: false,
    });
  });
});

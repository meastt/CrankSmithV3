import { validateBuilderBuild } from './validationContext';

describe('gravel builder regression coverage', () => {
  test('flags fork/wheel size mismatch for 700c fork with 650b wheel', () => {
    const result = validateBuilderBuild({
      frame: { id: 'f1', discipline: 'gravel', builderEligible: true, specs: { category: 'Gravel', rear_axle: '12x142' } },
      fork: { id: 'fork1', discipline: 'gravel', builderEligible: true, specs: { front_axle: '12x100', max_tire_width: '700c x 50' } },
      wheels: [
        { id: 'wf1', discipline: 'gravel', builderEligible: true, specs: { position: 'Front', axle: '12x100', diameter: '650b' } },
        { id: 'wr1', discipline: 'gravel', builderEligible: true, specs: { position: 'Rear', axle: '12x142', diameter: '650b', freehub_body: 'HG' } },
      ],
      tires: [],
      brakes: { calipers: [], rotors: [] },
      cockpit: {},
    });

    expect(result.issues.some(i => i.message.includes('Fork explicitly designed for 700c'))).toBe(true);
  });

  test('flags cassette/wheel freehub incompatibility for wide-range setup mismatch', () => {
    const result = validateBuilderBuild({
      frame: { id: 'f1', discipline: 'gravel', builderEligible: true, specs: { category: 'Gravel', rear_axle: '12x142' } },
      wheels: [
        { id: 'wr1', discipline: 'gravel', builderEligible: true, specs: { position: 'Rear', axle: '12x142', diameter: '700c', freehub_body: 'HG' } },
      ],
      cassette: { id: 'c1', discipline: 'gravel', builderEligible: true, specs: { freehub_body: 'XDR', speeds: 12, range: '10-44' } },
      tires: [],
      brakes: { calipers: [], rotors: [] },
      cockpit: {},
    });

    expect(result.issues.some(i => i.message.includes('Cassette freehub'))).toBe(true);
  });

  test('flags drivetrain protocol mismatch between shifter and RD', () => {
    const result = validateBuilderBuild({
      frame: { id: 'f1', discipline: 'gravel', builderEligible: true, specs: { category: 'Gravel' } },
      shifter: {
        id: 's1',
        discipline: 'gravel',
        builderEligible: true,
        compatibility_tags: { protocol: ['SRAM_AXS'] },
        specs: { speeds: 12 },
      },
      rearDerailleur: {
        id: 'rd1',
        discipline: 'gravel',
        builderEligible: true,
        compatibility_tags: { protocol: ['Shimano_12s_Mech'] },
        specs: { speeds: 12 },
      },
      wheels: [],
      tires: [],
      brakes: { calipers: [], rotors: [] },
      cockpit: {},
    });

    expect(result.issues.some(i => i.message.includes('Shifter protocol'))).toBe(true);
  });

  test('flags rear axle and rotor mount mismatches', () => {
    const result = validateBuilderBuild({
      frame: { id: 'f1', discipline: 'gravel', builderEligible: true, specs: { category: 'Gravel', rear_axle: '12x142', brake_mount: 'Flat Mount' } },
      fork: { id: 'fork1', discipline: 'gravel', builderEligible: true, specs: { front_axle: '12x100', brake_mount: 'Flat Mount' } },
      wheels: [
        { id: 'wf1', discipline: 'gravel', builderEligible: true, specs: { position: 'Front', axle: '12x100', diameter: '700c', brake_interface: 'Centerlock' } },
        { id: 'wr1', discipline: 'gravel', builderEligible: true, specs: { position: 'Rear', axle: '12x148', diameter: '700c', brake_interface: 'Centerlock' } },
      ],
      brakes: {
        calipers: [
          { id: 'bcf', discipline: 'gravel', builderEligible: true, specs: { position: 'Front', mount: 'Flat Mount', fluid: 'Mineral', actuation: 'hydraulic' } },
          { id: 'bcr', discipline: 'gravel', builderEligible: true, specs: { position: 'Rear', mount: 'Flat Mount', fluid: 'Mineral', actuation: 'hydraulic' } },
        ],
        rotors: [
          { id: 'rf', discipline: 'gravel', builderEligible: true, specs: { position: 'Front', mount: '6-bolt', size: 160 } },
          { id: 'rr', discipline: 'gravel', builderEligible: true, specs: { position: 'Rear', mount: '6-bolt', size: 160 } },
        ],
      },
      tires: [],
      cockpit: {},
    });

    expect(result.issues.some(i => i.message.includes('Rear wheel axle'))).toBe(true);
    expect(result.issues.some(i => i.message.includes('rotor mount'))).toBe(true);
  });
});

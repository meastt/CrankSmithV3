
import { Validator } from '../src/lib/validation';
import { Component } from '../src/lib/types/compatibility';

// Mock Components
const axsShifter: Component = {
    id: 'shifter1', type: 'Shifter', name: 'SRAM Force AXS',
    specs: { speeds: '12', actuation: 'Electronic' },
    compatibility_tags: { protocol: ['AXS'], speed: ['12'] }
} as any;

const axsDerailleur: Component = {
    id: 'rd1', type: 'RearDerailleur', name: 'SRAM X01 Eagle AXS',
    specs: { speeds: '12', max_cog_capacity: '52', actuation: 'Electronic' },
    compatibility_tags: { protocol: ['AXS'], speed: ['12'] }
} as any;

const cassette1052: Component = {
    id: 'cass1', type: 'Cassette', name: 'SRAM XG-1295',
    specs: { speeds: '12', largest_cog: '52', freehub_body: 'XD' },
    compatibility_tags: {}
} as any;

const chain: Component = {
    id: 'chain1', type: 'Chain', name: 'SRAM Eagle Chain',
    specs: { speeds: '12' },
    compatibility_tags: {}
} as any;

const crank: Component = {
    id: 'crank1', type: 'Crankset', name: 'SRAM Force 1',
    specs: { speeds: '12', spindle_type: 'DUB' },
    compatibility_tags: {}
} as any;


console.log('--- Verifying Mullet Drivetrain Fix ---');

const buildData = {
    shifter: axsShifter,
    rearDerailleur: axsDerailleur,
    cassette: cassette1052,
    chain: chain,
    crankset: crank,
    wheels: [],
    tires: [],
    frame: undefined
};

const result = Validator.validateBuild(buildData);

if (result.compatible) {
    console.log('[PASS] Drivetrain is compatible.');
} else {
    console.log('[FAIL] Issues found:');
    result.issues.forEach(i => console.log(` - ${i.message}`));
}


import { validateDrivetrain, Component } from '../src/lib/validation';

// Mock Components
const axsShifter: Component = {
    id: 'axs-shifter',
    type: 'Shifter',
    name: 'SRAM Red AXS Shifter',
    interfaces: { protocol: 'AXS', speeds: 12 },
    attributes: { electronic: true }
};

const di2RD: Component = {
    id: 'di2-rd',
    type: 'RearDerailleur',
    name: 'Shimano Dura-Ace Di2 RD',
    interfaces: { protocol: 'Di2_12s_Wireless', speeds: 12 },
    attributes: { electronic: true }
};

const mechRD: Component = {
    id: 'mech-rd',
    type: 'RearDerailleur',
    name: 'Shimano Ultegra Mechanical RD',
    interfaces: { cable_pull: 'Shimano_Road_11s', speeds: 11 },
    attributes: { electronic: false }
};

const axsRD: Component = {
    id: 'axs-rd',
    type: 'RearDerailleur',
    name: 'SRAM Red AXS RD',
    interfaces: { protocol: 'AXS', speeds: 12 },
    attributes: { electronic: true }
};

// Test Cases
console.log('--- TEST 1: AXS Shifter + Di2 RD (Should FAIL) ---');
const test1 = validateDrivetrain(axsShifter, di2RD, { id: 'cassette', type: 'Cassette', name: 'Cassette', interfaces: { speeds: 12 }, attributes: {} } as Component);
console.log(`Compatible: ${test1.compatible}`);
console.log(`Reasons: ${test1.reasons.join(', ')}`);

console.log('\n--- TEST 2: AXS Shifter + Mechanical RD (Should FAIL) ---');
const test2 = validateDrivetrain(axsShifter, mechRD, { id: 'cassette', type: 'Cassette', name: 'Cassette', interfaces: { speeds: 11 }, attributes: {} } as Component);
console.log(`Compatible: ${test2.compatible}`);
console.log(`Reasons: ${test2.reasons.join(', ')}`);

console.log('\n--- TEST 3: AXS Shifter + AXS RD (Should PASS) ---');
const test3 = validateDrivetrain(axsShifter, axsRD, { id: 'cassette', type: 'Cassette', name: 'Cassette', interfaces: { speeds: 12 }, attributes: {} } as Component);
console.log(`Compatible: ${test3.compatible}`);
console.log(`Reasons: ${test3.reasons.join(', ')}`);

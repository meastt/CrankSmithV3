
import { Validator } from '../src/lib/validation';
import { Component } from '../src/lib/types/compatibility';

// Mock Data Helpers
const createFrame = (id: string, name: string, specs: any): Component => ({
    id, type: 'Frame', name,
    specs: { ...specs },
    compatibility_tags: {}
} as any);

const createFork = (id: string, name: string, specs: any): Component => ({
    id, type: 'Fork', name,
    specs: { ...specs },
    compatibility_tags: {}
} as any);

const createWheel = (id: string, name: string, position: 'Front' | 'Rear', specs: any): Component => ({
    id, type: 'Wheel', name,
    specs: { position, ...specs },
    compatibility_tags: {}
} as any);

function testRollingChassis() {
    console.log('--- Testing Rolling Chassis ---');

    const frame = createFrame('f1', 'Road Frame', {
        headset: 'IS42/IS52',
        front_axle: '12x100mm',
        rear_axle: '12x142mm',
        max_tire_width: '32mm',
        bb_shell: 'BSA'
    });

    const forkCorrect = createFork('fk1', 'Road Fork', {
        steerer_tube: 'Tapered 1 1/8 - 1 1/2',
        front_axle: '12x100mm',
        max_tire_width: '32mm'
    });

    const forkWrongAxle = createFork('fk2', 'MTB Fork', {
        steerer_tube: 'Tapered 1 1/8 - 1 1/2',
        front_axle: '15x110mm',
        max_tire_width: '2.4"'
    });

    const wheelFront = createWheel('wf1', 'Road Wheel Front', 'Front', { axle: '12x100mm', diameter: '700c' });
    const wheelRear = createWheel('wr1', 'Road Wheel Rear', 'Rear', { axle: '12x142mm', diameter: '700c' });

    // Test 1: Compatible Setup
    const res1 = Validator.validateBuild({
        frame, fork: forkCorrect, wheels: [wheelFront, wheelRear], tires: []
    });
    console.log('Test 1 (Compatible):', res1.compatible ? 'PASS' : 'FAIL', res1.issues);

    // Test 2: Incompatible Fork Axle
    const res2 = Validator.validateBuild({
        frame, fork: forkWrongAxle, wheels: [wheelFront, wheelRear], tires: []
    });
    console.log('Test 2 (Wrong Fork Axle):', !res2.compatible ? 'PASS' : 'FAIL', 'Found Issues:', res2.issues.length);
}

function testDrivetrain() {
    console.log('\n--- Testing Drivetrain ---');

    // TODO: Add drivetrain tests
}

testRollingChassis();
testDrivetrain();

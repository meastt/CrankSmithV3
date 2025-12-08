
import { Validator } from '../src/lib/validation';
import { Component, ComponentSpecs, CompatibilityTags } from '../src/lib/types/compatibility';

// --- MOCK DATA FACTORY ---
const createMockPart = (
    type: string,
    id: string,
    name: string,
    specs: ComponentSpecs,
    tags: CompatibilityTags = {}
): any => ({
    id, type, name, specs, compatibility_tags: tags,
    // Add dummy values for required fields
    price: 0, weightGrams: 0, image: '', brand: 'Mock', model: 'Mock'
});

// --- SCENARIOS ---

const scenarios = [
    {
        name: "Perfect Road Build (Shimano 12s)",
        expectedValid: true,
        parts: {
            frame: createMockPart('Frame', 'road-frame', 'Road Frame', {
                headset: 'IS42/IS52', bb_shell: 'BSA_Threaded', rear_axle: '12x142mm', max_tire_width: '32mm', brake_mount: 'Flat Mount'
            }),
            fork: createMockPart('Fork', 'road-fork', 'Road Fork', {
                steerer_tube: '1 1/8 - 1 1/2', front_axle: '12x100mm', max_tire_width: '32mm', brake_mount: 'Flat Mount'
            }),
            wheels: [
                createMockPart('Wheel', 'road-front', 'Road Front', { position: 'Front', diameter: '700c', front_axle: '12x100mm', internal_rim_width: '21mm' }),
                createMockPart('Wheel', 'road-rear', 'Road Rear', { position: 'Rear', diameter: '700c', rear_axle: '12x142mm', internal_rim_width: '21mm', freehub_body: 'HG_11' })
            ],
            tires: [
                createMockPart('Tire', 'road-tire', 'Road Tire', { diameter: '700c', width: '28mm' }),
                createMockPart('Tire', 'road-tire', 'Road Tire', { diameter: '700c', width: '28mm' })
            ],
            bottomBracket: createMockPart('BottomBracket', 'bsa-shimano', 'Shimano BSA', { bb_shell: 'BSA_Threaded', spindle_interface: 'Hollowtech_II_24mm' }),
            crankset: createMockPart('Crankset', 'shimano-crank', 'Shimano Ultegra', { spindle_type: 'Hollowtech_II_24mm', speeds: 12 }),
            cassette: createMockPart('Cassette', 'shimano-cass', 'Shimano 11-30', { freehub_body: 'HG_11', speeds: 12, largest_cog: 30 }),
            rearDerailleur: createMockPart('RearDerailleur', 'shimano-rd', 'Shimano Ultegra RD', { speeds: 12, max_cog_capacity: 34 }, { protocol: ['Shimano_12s_Mech'] }),
            shifter: createMockPart('Shifter', 'shimano-shifter', 'Shimano Ultegra Shifter', { speeds: 12 }, { protocol: ['Shimano_12s_Mech'] })
        }
    },
    {
        name: "Mismatch: Axle Standards (Road Frame vs Boost Wheel)",
        expectedValid: false,
        expectErrorIn: ['road-rear-boost'], // Expect error on the wheel
        parts: {
            frame: createMockPart('Frame', 'road-frame', 'Road Frame', { rear_axle: '12x142mm' }),
            wheels: [
                createMockPart('Wheel', 'road-front', 'Road Front', { position: 'Front', front_axle: '12x100mm' }),
                createMockPart('Wheel', 'road-rear-boost', 'MTB Rear', { position: 'Rear', rear_axle: '12x148mm' }) // Mismatch
            ]
        }
    },
    {
        name: "Mismatch: Tire Clearance (45mm tire in 32mm frame)",
        expectedValid: false,
        expectErrorIn: ['gravel-tire'],
        parts: {
            frame: createMockPart('Frame', 'road-frame', 'Road Frame', { max_tire_width: '32mm', rear_axle: '12x142mm' }),
            wheels: [createMockPart('Wheel', 'road-rear', 'Road Rear', { position: 'Rear', rear_axle: '12x142mm', diameter: '700c' })],
            tires: [createMockPart('Tire', 'gravel-tire', 'Gravel Tire', { diameter: '700c', width: '45mm' })]
        }
    },
    {
        name: "Mismatch: BB Shell (BSA Frame vs PF30 BB)",
        expectedValid: false,
        expectErrorIn: ['pf30-bb'],
        parts: {
            frame: createMockPart('Frame', 'bsa-frame', 'Road Frame', { bb_shell: 'BSA_Threaded' }),
            bottomBracket: createMockPart('BottomBracket', 'pf30-bb', 'PF30 BB', { bb_shell: 'PF30_68mm' })
        }
    },
    {
        name: "Mismatch: Drivetrain Brand (SRAM Shifter vs Shimano RD)",
        expectedValid: false,
        expectErrorIn: ['sram-shifter'],
        parts: {
            shifter: createMockPart('Shifter', 'sram-shifter', 'SRAM Red', { speeds: 12 }, { protocol: ['SRAM_AXS'] }),
            rearDerailleur: createMockPart('RearDerailleur', 'shimano-rd', 'Shimano Ultegra', { speeds: 12 }, { protocol: ['Shimano_12s_Di2'] })
        }
    },
    {
        name: "Mismatch: Cassette Capacity (11-34t Cassette vs Short Cage RD max 30t)",
        expectedValid: false,
        expectErrorIn: ['short-cage-rd'],
        parts: {
            cassette: createMockPart('Cassette', 'wide-cassette', '11-34t', { largest_cog: 34 }),
            rearDerailleur: createMockPart('RearDerailleur', 'short-cage-rd', 'Short Cage RD', { max_cog_capacity: 30 })
        }
    }
];

// --- RUNNER ---

function runTests() {
    console.log("🚲 RUNNING MOCK BUILD SUITE 🚲");
    console.log("=================================");

    let passed = 0;
    let failed = 0;

    scenarios.forEach((scenario, idx) => {
        const buildData = {
            frame: scenario.parts.frame,
            fork: scenario.parts.fork,
            wheels: scenario.parts.wheels || [],
            tires: scenario.parts.tires || [],
            bottomBracket: scenario.parts.bottomBracket,
            crankset: scenario.parts.crankset,
            cassette: scenario.parts.cassette,
            rearDerailleur: scenario.parts.rearDerailleur,
            shifter: scenario.parts.shifter,
            cockpit: {}
        };

        const result = Validator.validateBuild(buildData);
        const { compatible, issues } = result;

        const errors = issues.filter(i => i.severity === 'ERROR');
        const isActuallyValid = errors.length === 0;

        let testPassed = isActuallyValid === scenario.expectedValid;

        // Verify specific error location if expected
        if (!scenario.expectedValid && scenario.expectErrorIn) {
            const foundExpectedErrors = scenario.expectErrorIn.every(id =>
                errors.some(e => e.componentId === id || e.conflictingComponentId === id)
            );
            if (!foundExpectedErrors) testPassed = false;
        }

        if (testPassed) {
            passed++;
            console.log(`✅ [PASS] ${scenario.name}`);
        } else {
            failed++;
            console.log(`❌ [FAIL] ${scenario.name}`);
            console.log(`   Expected Valid: ${scenario.expectedValid}, Got: ${isActuallyValid}`);
            if (errors.length > 0) {
                console.log("   Errors Found:");
                errors.forEach(e => console.log(`     - ${e.message} (ID: ${e.componentId})`));
            } else {
                console.log("   No errors found (but expected failure).");
            }
        }
    });

    console.log("=================================");
    console.log(`SUMMARY: ${passed}/${scenarios.length} Passed`);

    if (failed > 0) process.exit(1);
}

runTests();

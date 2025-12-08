
import { PrismaClient } from '@prisma/client';
import { normalizeComponent } from '../src/lib/normalization';
import { Validator } from '../src/lib/validation';
import { Component } from '../src/lib/types/compatibility';

const prisma = new PrismaClient();

async function simulate() {
    console.log('--- 🚀 STARTING LIVE BUILD SIMULATION ---');

    // 1. Fetch All Data & Normalize
    // In a real app we fetch by type, but here we load all for speed in the script
    const rawComponents = await prisma.component.findMany();
    const db: Record<string, Component[]> = {};

    rawComponents.forEach(raw => {
        const c = normalizeComponent(raw);
        if (!db[c.type]) db[c.type] = [];
        db[c.type].push(c);
    });

    console.log(`Loaded ${rawComponents.length} components from DB.`);

    // --- SCENARIO 1: Specialized Crux Build (Gravel) ---
    console.log('\n🚲 SCENARIO 1: specialized-crux-fact-10r Build');

    const frame = db['Frame'].find(c => c.id === 'specialized-crux-fact-10r');
    if (!frame) throw new Error('Frame not found!');
    console.log(`[Selected Frame] ${frame.name} (Specs: BB=${frame.specs.bb_shell}, RearAxle=${frame.specs.rear_axle})`);

    // Step 2: Wheels
    const allWheels = db['Wheel'] || [];
    const compatibleWheels = allWheels.filter(w => {
        const res = Validator.validateBuild({ frame, wheels: [w], tires: [], bottomBracket: null, crankset: null });
        return res.compatible;
    });
    console.log(`[Step 2] Wheels: Found ${compatibleWheels.length} compatible out of ${allWheels.length}`);

    if (compatibleWheels.length === 0) {
        console.log('   ❌ STOP: No compatible wheels found (Critical Failure)');
        process.exit(1);
    } else {
        console.log(`   ✅ PASS: Valid options exist (e.g., ${compatibleWheels[0].name})`);
    }

    const selectedWheel = compatibleWheels.find(w => w.specs.diameter === '700c') || compatibleWheels[0];
    console.log(`   -> Selected Wheel: ${selectedWheel.name}`);

    // Step 3: Tires
    const allTires = db['Tire'] || [];
    const compatibleTires = allTires.filter(t => {
        const res = Validator.validateBuild({ frame, wheels: [selectedWheel], tires: [t], bottomBracket: null, crankset: null });
        return res.compatible;
    });
    console.log(`[Step 3] Tires: Found ${compatibleTires.length} compatible out of ${allTires.length}`);
    if (compatibleTires.length === 0) {
        console.log('   ❌ STOP: No compatible tires found.');
    } else {
        console.log(`   ✅ PASS: Valid options exist (e.g., ${compatibleTires[0].name})`);
    }

    // Step 4: Bottom Bracket
    const allBBs = db['BottomBracket'] || [];
    const compatibleBBs = allBBs.filter(bb => {
        const res = Validator.validateBuild({ frame, wheels: [selectedWheel], tires: [], bottomBracket: bb, crankset: null });
        // Note: Validator only checks BB <-> Frame if BB is present, but doesn't isolate just that check. 
        // Ideally we want to see if adding THIS component causes an error.
        return res.compatible;
    });
    console.log(`[Step 4] Bottom Brackets: Found ${compatibleBBs.length} compatible out of ${allBBs.length}`);
    if (compatibleBBs.length === 0) {
        console.log('   ❌ STOP: No compatible BBs found.');
    } else {
        console.log(`   ✅ PASS: Valid options exist (e.g., ${compatibleBBs[0].name})`);
    }

    const selectedBB = compatibleBBs.find(bb => bb.name.includes('Shimano')) || compatibleBBs[0];
    console.log(`   -> Selected BB: ${selectedBB?.name}`);

    // Step 5: Crankset
    const allCranks = db['Crankset'] || [];
    const compatibleCranks = allCranks.filter(c => {
        const res = Validator.validateBuild({ frame, bottomBracket: selectedBB, crankset: c, wheels: [], tires: [] });
        return res.compatible;
    });
    console.log(`[Step 5] Cranksets: Found ${compatibleCranks.length} compatible out of ${allCranks.length}`);
    if (compatibleCranks.length === 0) console.log('   ❌ STOP: No compatible Cranksets found.');
    else console.log(`   ✅ PASS: Valid options exist (e.g., ${compatibleCranks[0].name})`);

    console.log('\n--- SIMULATION COMPLETE ---');
}

simulate()
    .catch(console.error)
    .finally(() => prisma.$disconnect());

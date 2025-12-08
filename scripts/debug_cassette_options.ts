
import { PrismaClient } from '@prisma/client';
import { normalizeComponent } from '../src/lib/normalization';
import { Validator } from '../src/lib/validation';
import { Component } from '../src/lib/types/compatibility';

const prisma = new PrismaClient();

async function debug() {
    console.log('--- 🕵️ DEBUGGING CASSETTE FILTERING ---');

    // 1. Load Data
    const rawWheels = await prisma.component.findMany({ where: { type: 'Wheel' }, take: 5 });
    const rawCassettes = await prisma.component.findMany({ where: { type: 'Cassette' } });

    const wheels = rawWheels.map(normalizeComponent);
    const cassettes = rawCassettes.map(normalizeComponent);

    console.log(`Loaded ${wheels.length} wheels and ${cassettes.length} cassettes.`);

    // 2. Setup Scenario
    // User Component: SRAM Apex 1x Crank (Simulated)
    const crank = {
        id: 'sram-apex-1',
        type: 'Crankset',
        name: 'SRAM Apex 1',
        specs: { speeds: 12, spindle_type: 'DUB' },
        compatibility_tags: {}
    };

    // Pick a Wheel that likely caused the issue (Bontrager Aeolus usually lists multiple freehubs)
    const problemWheel = wheels.find(w => w.name.includes('Aeolus') || w.name.includes('Elite'));

    if (!problemWheel) {
        console.log('No suitable test wheel found.');
        return;
    }

    console.log(`\nTesting with Wheel: ${problemWheel.name}`);
    console.log(`Wheel Freehub Spec: "${problemWheel.specs.freehub_body}"`);
    console.log(`(Raw Interfaces: ${JSON.stringify(problemWheel.interfaces)})\n`);

    console.log('Checking Cassettes:');

    cassettes.forEach(c => {
        const build = {
            frame: { id: 'frame', specs: { rear_axle: '12x142mm' } }, // Minimal frame
            wheels: [problemWheel],
            tires: [],
            bottomBracket: null,
            crankset: crank,
            cassette: c,
            rearDerailleur: null
        };

        const res = Validator.validateBuild(build);
        const isCompat = res.compatible;
        const status = isCompat ? '✅ PASS' : '❌ FAIL';

        let reason = '';
        if (!isCompat) {
            const error = res.issues.find(i => i.componentId === c.id);
            reason = error ? error.message : 'Unknown Error';
        }

        console.log(`${status} [${c.name}] (${c.specs.freehub_body}) -> ${reason}`);
    });
}

debug()
    .catch(console.error)
    .finally(() => prisma.$disconnect());

import { PrismaClient } from '@prisma/client';
import { Validator } from './src/lib/validation';
import { Component } from './src/lib/types/compatibility';

const prisma = new PrismaClient();

async function main() {
    // 1. Find ALL 3T Exploro frames
    const frames = await prisma.component.findMany({
        where: {
            name: { contains: 'Exploro' },
            type: 'Frame'
        }
    });

    if (frames.length === 0) {
        console.error('No Exploro frames found!');
        return;
    }

    for (const frame of frames) {
        console.log('\n==========================================');
        console.log(`Checking Frame: ${frame.name}`);
        console.log('==========================================');
        console.log(`ID: ${frame.id}`);

        // 2. Find all wheels
        const wheels = await prisma.component.findMany({
            where: { type: 'Wheelset' }
        });

        console.log(`\nFound ${wheels.length} wheels.`);

        // 3. Check compatibility
        console.log('\n--- COMPATIBILITY CHECK ---');

        const frameObj = {
            ...frame,
            id: frame.id,
            type: frame.type,
            name: frame.name,
            specs: typeof frame.attributes === 'string' ? JSON.parse(frame.attributes) : frame.attributes,
            compatibility_tags: typeof frame.interfaces === 'string' ? JSON.parse(frame.interfaces) : frame.interfaces
        } as unknown as Component;

        let compatibleCount = 0;

        for (const wheel of wheels) {
            const wheelObj = {
                ...wheel,
                id: wheel.id,
                type: wheel.type,
                name: wheel.name,
                specs: typeof wheel.attributes === 'string' ? JSON.parse(wheel.attributes) : wheel.attributes,
                compatibility_tags: typeof wheel.interfaces === 'string' ? JSON.parse(wheel.interfaces) : wheel.interfaces
            } as unknown as Component;

            // Mock position if missing
            if (!wheelObj.specs.position) wheelObj.specs.position = 'Set';

            const buildData = {
                frame: frameObj,
                wheels: [wheelObj],
                tires: []
            };

            const result = Validator.validateBuild(buildData);
            const problems = result.issues.filter(i => i.severity === 'ERROR');

            if (problems.length === 0) {
                compatibleCount++;
                console.log(`[PASS] ${wheel.name}`);
            } else {
                console.log(`[FAIL] ${wheel.name}`);
                problems.forEach(r => console.log(`  - ${r.message}`));
            }
        }
        console.log(`\nTotal Compatible: ${compatibleCount} / ${wheels.length}`);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());


import { PrismaClient } from '@prisma/client';
import { validateFrameWheel } from './src/lib/validation';

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
        console.log('Interfaces:', JSON.stringify(frame.interfaces, null, 2));
        console.log('Attributes:', JSON.stringify(frame.attributes, null, 2));

        // 2. Find all wheels (reuse from before)
        const wheels = await prisma.component.findMany({
            where: { type: 'Wheelset' }
        });

        console.log(`\nFound ${wheels.length} wheels.`);

        // 3. Check compatibility
        console.log('\n--- COMPATIBILITY CHECK ---');

        const frameObj = {
            ...frame,
            interfaces: typeof frame.interfaces === 'string' ? JSON.parse(frame.interfaces) : frame.interfaces,
            attributes: typeof frame.attributes === 'string' ? JSON.parse(frame.attributes) : frame.attributes
        };

        let compatibleCount = 0;

        for (const wheel of wheels) {
            const wheelObj = {
                ...wheel,
                interfaces: typeof wheel.interfaces === 'string' ? JSON.parse(wheel.interfaces) : wheel.interfaces,
                attributes: typeof wheel.attributes === 'string' ? JSON.parse(wheel.attributes) : wheel.attributes
            };

            const result = validateFrameWheel(frameObj, wheelObj);

            if (result.compatible) {
                compatibleCount++;
                console.log(`[PASS] ${wheel.name}`);
            } else {
                console.log(`[FAIL] ${wheel.name}`);
                result.reasons.forEach(r => console.log(`  - ${r}`));
            }
        }
        console.log(`\nTotal Compatible: ${compatibleCount} / ${wheels.length}`);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());

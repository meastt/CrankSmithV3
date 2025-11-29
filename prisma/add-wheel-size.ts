/**
 * Migration script to add wheel_size to all frames in the database
 *
 * Wheel size rules:
 * - Road frames: 700c only
 * - Gravel frames: Check if they explicitly support 650b, otherwise 700c
 *   - Some gravel frames are 700c-only (most modern race-oriented ones)
 *   - Some support both 700c and 650b (adventure/bikepacking oriented)
 * - MTB frames: 29" or 27.5" based on their geometry/purpose
 *
 * Run with: npx ts-node prisma/add-wheel-size.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Frames that explicitly support both 700c and 650b
// These are typically adventure/bikepacking oriented gravel bikes
const DUAL_WHEEL_SIZE_FRAMES = [
    // Specialized Diverge series - known for 650b compatibility
    'specialized-diverge-e5',
    'specialized-diverge-str',
    // Salsa frames - adventure focused
    'salsa-warbird',
    'salsa-cutthroat',
    // Surly - adventure touring
    'surly-midnight-special',
    // 3T - adventure gravel
    '3t-exploro',
    // Open - adventure gravel
    'open-wide',
    'open-up',
    // Bombtrack - adventure
    'bombtrack-hook',
    // Some Trek Checkpoints
    // Cervelo Aspero - race gravel (700c only typically)
    // Scott Addict Gravel - race gravel (700c only typically)
];

// MTB frames that are 27.5" only (typically smaller or DH focused)
const MTB_275_ONLY: string[] = [
    // Most modern XC/Trail MTBs are 29" or mullet
    // Add specific 27.5" only frames here if needed
];

async function main() {
    console.log('Adding wheel_size to all frames...\n');

    // Get all frames
    const frames = await prisma.component.findMany({
        where: { type: 'Frame' }
    });

    console.log(`Found ${frames.length} frames to update\n`);

    let updated = 0;
    let skipped = 0;

    for (const frame of frames) {
        const interfaces = JSON.parse(frame.interfaces as string);
        const attributes = JSON.parse(frame.attributes as string);

        // Skip if already has wheel_size
        if (interfaces.wheel_size) {
            console.log(`Skipped (already has wheel_size): ${frame.name}`);
            skipped++;
            continue;
        }

        let wheelSize: string | string[];

        const category = attributes.category;
        const frameId = frame.id;

        if (category === 'Road') {
            // All road frames are 700c only
            wheelSize = '700c';
        } else if (category === 'Gravel') {
            // Check if this frame supports both sizes
            if (DUAL_WHEEL_SIZE_FRAMES.some(id => frameId.includes(id))) {
                wheelSize = ['700c', '650b'];
            } else {
                // Default gravel frames to 700c only (race-oriented)
                wheelSize = '700c';
            }
        } else if (category === 'MTB') {
            // Check if 27.5" only
            if (MTB_275_ONLY.some(id => frameId.includes(id))) {
                wheelSize = '27.5';
            } else {
                // Modern MTBs are typically 29" (some mullet capable)
                wheelSize = '29';
            }
        } else {
            // Unknown category - skip
            console.log(`Skipped (unknown category): ${frame.name} (${category})`);
            skipped++;
            continue;
        }

        // Update the frame
        interfaces.wheel_size = wheelSize;

        await prisma.component.update({
            where: { id: frame.id },
            data: {
                interfaces: JSON.stringify(interfaces)
            }
        });

        const sizeStr = Array.isArray(wheelSize) ? wheelSize.join('/') : wheelSize;
        console.log(`Updated: ${frame.name} -> ${sizeStr}`);
        updated++;
    }

    console.log(`\n✓ Updated ${updated} frames`);
    console.log(`○ Skipped ${skipped} frames`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

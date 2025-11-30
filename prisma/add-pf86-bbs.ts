/**
 * Add PF86/BB86 bottom brackets to support frames like Scott Addict Gravel
 *
 * PF86 (Press Fit 86) / BB86:
 * - Shell: 86.5mm wide, 41mm ID
 * - Used by: Scott, Giant, many carbon frames
 *
 * Run with: npx ts-node prisma/add-pf86-bbs.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const PF86_BOTTOM_BRACKETS = [
    {
        id: 'shimano-bb-mt800-pf',
        type: 'BottomBracket',
        name: 'Shimano BB-MT800 (PF86/BB86)',
        interfaces: {
            frame_shell: 'PF86_Press-Fit',
            crank_spindle: 'Hollowtech_II_24mm'
        },
        attributes: {
            weight: 77,
            note: 'Press-fit for 86.5mm shell, 24mm spindle'
        }
    },
    {
        id: 'shimano-bb-r9100-pb',
        type: 'BottomBracket',
        name: 'Shimano Dura-Ace BB-R9100-PB (PF86)',
        interfaces: {
            frame_shell: 'PF86_Press-Fit',
            crank_spindle: 'Hollowtech_II_24mm'
        },
        attributes: {
            weight: 53,
            note: 'Press-fit for BB86 shells'
        }
    },
    {
        id: 'sram-dub-pf86',
        type: 'BottomBracket',
        name: 'SRAM DUB PF86 Bottom Bracket',
        interfaces: {
            frame_shell: 'PF86_Press-Fit',
            crank_spindle: 'DUB_28.99mm'
        },
        attributes: {
            weight: 68,
            note: 'Press-fit 86.5mm for DUB cranks'
        }
    },
    {
        id: 'ceramic-speed-bb86-shimano',
        type: 'BottomBracket',
        name: 'CeramicSpeed BB86 Shimano',
        interfaces: {
            frame_shell: 'PF86_Press-Fit',
            crank_spindle: 'Hollowtech_II_24mm'
        },
        attributes: {
            weight: 59,
            note: 'Ceramic bearings, coated races'
        }
    },
    {
        id: 'ceramic-speed-bb86-sram-dub',
        type: 'BottomBracket',
        name: 'CeramicSpeed BB86 SRAM DUB',
        interfaces: {
            frame_shell: 'PF86_Press-Fit',
            crank_spindle: 'DUB_28.99mm'
        },
        attributes: {
            weight: 62,
            note: 'Ceramic bearings, coated races'
        }
    },
    {
        id: 'wheels-mfg-pf86-shimano',
        type: 'BottomBracket',
        name: 'Wheels Manufacturing PF86 Shimano',
        interfaces: {
            frame_shell: 'PF86_Press-Fit',
            crank_spindle: 'Hollowtech_II_24mm'
        },
        attributes: {
            weight: 90,
            note: 'Angular contact bearings'
        }
    },
    {
        id: 'wheels-mfg-pf86-sram-dub',
        type: 'BottomBracket',
        name: 'Wheels Manufacturing PF86 SRAM DUB',
        interfaces: {
            frame_shell: 'PF86_Press-Fit',
            crank_spindle: 'DUB_28.99mm'
        },
        attributes: {
            weight: 95,
            note: 'Angular contact bearings'
        }
    }
];

async function main() {
    console.log('Adding PF86/BB86 bottom brackets...\n');

    for (const bb of PF86_BOTTOM_BRACKETS) {
        const exists = await prisma.component.findUnique({
            where: { id: bb.id }
        });

        if (exists) {
            console.log(`Skipped (exists): ${bb.name}`);
            continue;
        }

        await prisma.component.create({
            data: {
                id: bb.id,
                type: bb.type,
                name: bb.name,
                interfaces: JSON.stringify(bb.interfaces),
                attributes: JSON.stringify(bb.attributes)
            }
        });

        console.log(`Created: ${bb.name}`);
    }

    console.log('\n✓ Done');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

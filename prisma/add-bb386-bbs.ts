/**
 * Add BB386 EVO bottom brackets for Open, Cervelo, and other frames
 *
 * BB386 EVO:
 * - Shell: 86.5mm wide, 46mm ID (larger bore than BB86)
 * - Used by: Open, Cervelo, Argon18, Factor, and others
 * - Requires specific BB386 EVO bottom brackets
 *
 * Run with: npx tsx prisma/add-bb386-bbs.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const BB386_BOTTOM_BRACKETS = [
    {
        id: 'sram-dub-bb386',
        type: 'BottomBracket',
        name: 'SRAM DUB BB386 EVO Bottom Bracket',
        interfaces: {
            frame_shell: 'BB386EVO_Press-Fit',
            crank_spindle: 'DUB_28.99mm'
        },
        attributes: {
            weight: 72,
            note: 'Press-fit for BB386 EVO shells'
        }
    },
    {
        id: 'ceramic-speed-bb386-sram-dub',
        type: 'BottomBracket',
        name: 'CeramicSpeed BB386 SRAM DUB',
        interfaces: {
            frame_shell: 'BB386EVO_Press-Fit',
            crank_spindle: 'DUB_28.99mm'
        },
        attributes: {
            weight: 65,
            note: 'Ceramic bearings, coated races'
        }
    },
    {
        id: 'ceramic-speed-bb386-shimano',
        type: 'BottomBracket',
        name: 'CeramicSpeed BB386 Shimano',
        interfaces: {
            frame_shell: 'BB386EVO_Press-Fit',
            crank_spindle: 'Hollowtech_II_24mm'
        },
        attributes: {
            weight: 62,
            note: 'Ceramic bearings, coated races'
        }
    },
    {
        id: 'wheels-mfg-bb386-shimano',
        type: 'BottomBracket',
        name: 'Wheels Manufacturing BB386 EVO Shimano',
        interfaces: {
            frame_shell: 'BB386EVO_Press-Fit',
            crank_spindle: 'Hollowtech_II_24mm'
        },
        attributes: {
            weight: 98,
            note: 'Angular contact bearings'
        }
    },
    {
        id: 'wheels-mfg-bb386-sram-dub',
        type: 'BottomBracket',
        name: 'Wheels Manufacturing BB386 EVO SRAM DUB',
        interfaces: {
            frame_shell: 'BB386EVO_Press-Fit',
            crank_spindle: 'DUB_28.99mm'
        },
        attributes: {
            weight: 102,
            note: 'Angular contact bearings'
        }
    },
    {
        id: 'praxis-bb386-m30',
        type: 'BottomBracket',
        name: 'Praxis Works BB386 EVO M30',
        interfaces: {
            frame_shell: 'BB386EVO_Press-Fit',
            crank_spindle: 'Praxis_M30'
        },
        attributes: {
            weight: 85,
            note: 'For Praxis M30 cranks'
        }
    },
    {
        id: 'chris-king-bb386-24',
        type: 'BottomBracket',
        name: 'Chris King ThreadFit 30 BB386',
        interfaces: {
            frame_shell: 'BB386EVO_Press-Fit',
            crank_spindle: 'Hollowtech_II_24mm'
        },
        attributes: {
            weight: 95,
            note: 'Threaded cups for press-fit shell, requires fit kit'
        }
    },
    {
        id: 'hope-bb386-24',
        type: 'BottomBracket',
        name: 'Hope BB386 EVO 24mm',
        interfaces: {
            frame_shell: 'BB386EVO_Press-Fit',
            crank_spindle: 'Hollowtech_II_24mm'
        },
        attributes: {
            weight: 88,
            note: 'Stainless steel bearings'
        }
    }
];

async function main() {
    console.log('Adding BB386 EVO bottom brackets...\n');

    for (const bb of BB386_BOTTOM_BRACKETS) {
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

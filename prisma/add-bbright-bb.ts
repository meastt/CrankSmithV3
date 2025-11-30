/**
 * Add BBright bottom brackets for Cervelo and other BBright frames
 *
 * BBright is a Cervelo-specific standard with a 79mm shell width
 * and uses a 46mm bore diameter (like BB30)
 *
 * Run with: npx tsx prisma/add-bbright-bb.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const BBRIGHT_BOTTOM_BRACKETS = [
    // SRAM/Quarq BBright for DUB cranks
    {
        id: 'sram-dub-bbright',
        name: 'SRAM DUB BBright Bottom Bracket',
        interfaces: {
            frame_interface: 'BBright_79mm',
            frame_shell: 'BBright_79mm',
            crank_interface: 'DUB_28.99mm',
            crank_spindle: 'DUB_28.99mm'
        },
        attributes: {
            weight: 85,
            bearing_type: 'Steel'
        }
    },
    // Shimano BBright adapter for Hollowtech II
    {
        id: 'praxis-bbright-shimano',
        name: 'Praxis Works BBright Shimano (24mm)',
        interfaces: {
            frame_interface: 'BBright_79mm',
            frame_shell: 'BBright_79mm',
            crank_interface: 'Hollowtech_II_24mm',
            crank_spindle: 'Hollowtech_II_24mm'
        },
        attributes: {
            weight: 90,
            bearing_type: 'Steel'
        }
    },
    // CeramicSpeed BBright for Shimano
    {
        id: 'ceramicspeed-bbright-shimano',
        name: 'CeramicSpeed BBright Shimano (24mm)',
        interfaces: {
            frame_interface: 'BBright_79mm',
            frame_shell: 'BBright_79mm',
            crank_interface: 'Hollowtech_II_24mm',
            crank_spindle: 'Hollowtech_II_24mm'
        },
        attributes: {
            weight: 78,
            bearing_type: 'Ceramic'
        }
    },
    // CeramicSpeed BBright for SRAM DUB
    {
        id: 'ceramicspeed-bbright-dub',
        name: 'CeramicSpeed BBright SRAM DUB',
        interfaces: {
            frame_interface: 'BBright_79mm',
            frame_shell: 'BBright_79mm',
            crank_interface: 'DUB_28.99mm',
            crank_spindle: 'DUB_28.99mm'
        },
        attributes: {
            weight: 78,
            bearing_type: 'Ceramic'
        }
    },
    // Wheels Manufacturing BBright for 30mm cranks (SRAM/FSA)
    {
        id: 'wheels-mfg-bbright-30',
        name: 'Wheels Manufacturing BBright 30mm',
        interfaces: {
            frame_interface: 'BBright_79mm',
            frame_shell: 'BBright_79mm',
            crank_interface: 'BB30_30mm',
            crank_spindle: 'BB30_30mm'
        },
        attributes: {
            weight: 95,
            bearing_type: 'Steel'
        }
    }
];

async function main() {
    console.log('Adding BBright bottom brackets...\n');

    for (const bb of BBRIGHT_BOTTOM_BRACKETS) {
        const componentData = {
            id: bb.id,
            type: 'BottomBracket',
            name: bb.name,
            interfaces: JSON.stringify(bb.interfaces),
            attributes: JSON.stringify(bb.attributes)
        };

        const exists = await prisma.component.findUnique({ where: { id: bb.id } });
        if (!exists) {
            await prisma.component.create({ data: componentData });
            console.log(`Created: ${bb.name}`);
        } else {
            await prisma.component.update({
                where: { id: bb.id },
                data: componentData
            });
            console.log(`Updated: ${bb.name}`);
        }
    }

    console.log('\nBBright bottom brackets added!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

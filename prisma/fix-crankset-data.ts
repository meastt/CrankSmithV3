/**
 * Fix crankset data issues:
 * 1. GRX RX820 cranksets: add missing speeds=12 and standardize spindle field
 * 2. GRX FC-RX600-2: rename bb_interface → spindle in interfaces
 *
 * Run with: npx tsx prisma/fix-crankset-data.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Fixing crankset data issues...\n');

    // 1. Fix GRX RX820 cranksets (discipline: gravel, missing speeds)
    const grxRx820Ids = [
        'shimano-grx-rx820-165mm',
        'shimano-grx-rx820-170mm',
        'shimano-grx-rx820-172-5mm',
        'shimano-grx-rx820-175mm',
    ];

    for (const id of grxRx820Ids) {
        const crankset = await prisma.component.findUnique({ where: { id } });
        if (!crankset) {
            console.log(`Not found by ID: ${id}, searching by name...`);
            continue;
        }

        const iface = JSON.parse(crankset.interfaces || '{}');
        const attr = JSON.parse(crankset.attributes || '{}');

        // Add speeds: 12 and standardize spindle field
        const updatedInterfaces = {
            ...iface,
            speeds: 12,
            spindle: 'Hollowtech_II_24mm',
        };
        // Remove bb_type from interfaces (move to spindle)
        delete updatedInterfaces.bb_type;

        await prisma.component.update({
            where: { id },
            data: { interfaces: JSON.stringify(updatedInterfaces) }
        });
        console.log(`Fixed GRX RX820: ${crankset.name}`);
    }

    // Also search by name pattern in case IDs differ
    const grxRx820ByName = await prisma.component.findMany({
        where: {
            type: 'Crankset',
            name: { contains: 'GRX RX820', mode: 'insensitive' },
        }
    });

    for (const crankset of grxRx820ByName) {
        const iface = JSON.parse(crankset.interfaces || '{}');
        if (iface.speeds === 12 && iface.spindle) {
            console.log(`Already fixed: ${crankset.name}`);
            continue;
        }
        const updatedInterfaces = {
            ...iface,
            speeds: 12,
            spindle: 'Hollowtech_II_24mm',
        };
        delete updatedInterfaces.bb_type;

        await prisma.component.update({
            where: { id: crankset.id },
            data: { interfaces: JSON.stringify(updatedInterfaces) }
        });
        console.log(`Fixed GRX RX820 (by name): ${crankset.name}`);
    }

    // 2. Fix GRX FC-RX600-2: bb_interface → spindle
    const grxRx600 = await prisma.component.findFirst({
        where: {
            type: 'Crankset',
            name: { contains: 'RX600', mode: 'insensitive' }
        }
    });

    if (grxRx600) {
        const iface = JSON.parse(grxRx600.interfaces || '{}');
        if (iface.bb_interface && !iface.spindle) {
            const updatedInterfaces = {
                ...iface,
                spindle: iface.bb_interface,
            };
            delete updatedInterfaces.bb_interface;
            await prisma.component.update({
                where: { id: grxRx600.id },
                data: { interfaces: JSON.stringify(updatedInterfaces) }
            });
            console.log(`Fixed GRX FC-RX600-2 spindle field: ${grxRx600.name}`);
        } else {
            console.log(`GRX FC-RX600-2 spindle already OK: ${grxRx600.name}`);
        }
    } else {
        console.log('GRX FC-RX600-2 not found');
    }

    console.log('\n✓ Crankset data fixes complete');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

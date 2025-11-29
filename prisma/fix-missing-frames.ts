/**
 * Fix frames that are missing category and wheel_size
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const FIXES = [
    {
        id: 'specialized-tarmac-sl8',
        category: 'Road',
        wheel_size: '700c'
    },
    {
        id: 'cervelo-aspero-5',
        category: 'Gravel',
        wheel_size: '700c'
    },
    {
        id: 'santa-cruz-stigmata',
        category: 'Gravel',
        wheel_size: '700c'
    }
];

async function main() {
    console.log('Fixing frames with missing data...\n');

    for (const fix of FIXES) {
        const frame = await prisma.component.findUnique({
            where: { id: fix.id }
        });

        if (!frame) {
            console.log(`Not found: ${fix.id}`);
            continue;
        }

        const interfaces = JSON.parse(frame.interfaces as string);
        const attributes = JSON.parse(frame.attributes as string);

        interfaces.wheel_size = fix.wheel_size;
        attributes.category = fix.category;

        await prisma.component.update({
            where: { id: fix.id },
            data: {
                interfaces: JSON.stringify(interfaces),
                attributes: JSON.stringify(attributes)
            }
        });

        console.log(`Fixed: ${frame.name} -> ${fix.category}, ${fix.wheel_size}`);
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

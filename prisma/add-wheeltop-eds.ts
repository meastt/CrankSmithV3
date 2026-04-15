/**
 * Add Wheeltop EDS (Electronic Derailleur System) components.
 * Wheeltop EDS is a wireless 12-speed electronic groupset compatible with
 * SRAM Eagle XD cassettes (10-50t, 10-52t). Designed for gravel/mullet builds
 * with drop bar brifters.
 *
 * Run: npx ts-node prisma/add-wheeltop-eds.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const COMPONENTS = [
    // -------------------------------------------------------
    // REAR DERAILLEUR
    // -------------------------------------------------------
    {
        id: 'wheeltop-eds-rd',
        type: 'RearDerailleur',
        name: 'Wheeltop EDS Electronic Rear Derailleur (12s)',
        discipline: 'gravel',
        builderEligible: true,
        interfaces: JSON.stringify({
            attachment: 'Standard_Mount',
            protocol: 'Wheeltop_Wireless',
        }),
        attributes: JSON.stringify({
            brand: 'Wheeltop',
            speeds: 12,
            max_cog: 52,
            weight: 285,
            electronic: true,
            clutch: true,
            price: 349,
        }),
    },

    // -------------------------------------------------------
    // BRIFTERS (Drop Bar Shifters)
    // -------------------------------------------------------
    {
        id: 'wheeltop-eds-brifters-drop',
        type: 'Shifter',
        name: 'Wheeltop EDS Drop Bar Brifters (12s)',
        discipline: 'gravel',
        builderEligible: true,
        interfaces: JSON.stringify({
            protocol: 'Wheeltop_Wireless',
            type: 'Drop Bar',
        }),
        attributes: JSON.stringify({
            brand: 'Wheeltop',
            speeds: 12,
            electronic: true,
            weight: 340,
            price: 249,
        }),
    },
];

async function main() {
    console.log('Adding Wheeltop EDS components...\n');

    for (const component of COMPONENTS) {
        const exists = await prisma.component.findUnique({ where: { id: component.id } });
        if (exists) {
            await prisma.component.update({ where: { id: component.id }, data: component });
            console.log(`Updated: ${component.name}`);
        } else {
            await prisma.component.create({ data: component as any });
            console.log(`Created: ${component.name}`);
        }
    }

    console.log('\nDone. Added Wheeltop EDS RD + brifters.');
}

main()
    .catch(e => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());

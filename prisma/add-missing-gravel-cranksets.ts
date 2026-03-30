/**
 * Add missing gravel-compatible cranksets:
 * - Shimano GRX FC-RX810-1 (11-speed 1x gravel cranksets)
 * - SRAM Force1 (11-speed 1x gravel/CX)
 * - SRAM Rival1 (11-speed 1x gravel/CX)
 *
 * Run with: npx tsx prisma/add-missing-gravel-cranksets.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const CRANKSETS = [
    // ============================================================
    // Shimano GRX FC-RX810-1 — 11-speed 1x gravel (GEN 1 GRX)
    // The original GRX 1x crankset before RX820 replaced it
    // ============================================================
    {
        id: 'shimano-grx-fc-rx810-1-170mm',
        name: 'Shimano GRX FC-RX810-1 170mm',
        interfaces: { spindle: 'Hollowtech_II_24mm', speeds: 11, configuration: '1x' },
        attributes: { brand: 'Shimano', teeth: '40', weight_g: 710, price: 155, category: 'GRAVEL' },
        discipline: 'gravel',
        disciplineTags: 'gravel',
        builderEligible: true,
    },
    {
        id: 'shimano-grx-fc-rx810-1-172-5mm',
        name: 'Shimano GRX FC-RX810-1 172.5mm',
        interfaces: { spindle: 'Hollowtech_II_24mm', speeds: 11, configuration: '1x' },
        attributes: { brand: 'Shimano', teeth: '40', weight_g: 720, price: 155, category: 'GRAVEL' },
        discipline: 'gravel',
        disciplineTags: 'gravel',
        builderEligible: true,
    },
    {
        id: 'shimano-grx-fc-rx810-1-175mm',
        name: 'Shimano GRX FC-RX810-1 175mm',
        interfaces: { spindle: 'Hollowtech_II_24mm', speeds: 11, configuration: '1x' },
        attributes: { brand: 'Shimano', teeth: '40', weight_g: 730, price: 155, category: 'GRAVEL' },
        discipline: 'gravel',
        disciplineTags: 'gravel',
        builderEligible: true,
    },
    {
        id: 'shimano-grx-fc-rx810-1-42t-170mm',
        name: 'Shimano GRX FC-RX810-1 42t 170mm',
        interfaces: { spindle: 'Hollowtech_II_24mm', speeds: 11, configuration: '1x' },
        attributes: { brand: 'Shimano', teeth: '42', weight_g: 715, price: 155, category: 'GRAVEL' },
        discipline: 'gravel',
        disciplineTags: 'gravel',
        builderEligible: true,
    },

    // ============================================================
    // SRAM Force1 — 11-speed 1x (gravel/CX era, BB30/GXP)
    // Dominant setup at major gravel races 2016-2020
    // ============================================================
    {
        id: 'sram-force1-gxp-170mm-40t',
        name: 'SRAM Force1 GXP 170mm 40t',
        interfaces: { spindle: 'GXP', speeds: 11, configuration: '1x' },
        attributes: { brand: 'SRAM', teeth: '40', weight_g: 660, price: 295, category: 'GRAVEL' },
        discipline: 'multi',
        disciplineTags: 'gravel',
        builderEligible: true,
    },
    {
        id: 'sram-force1-gxp-170mm-42t',
        name: 'SRAM Force1 GXP 170mm 42t',
        interfaces: { spindle: 'GXP', speeds: 11, configuration: '1x' },
        attributes: { brand: 'SRAM', teeth: '42', weight_g: 665, price: 295, category: 'GRAVEL' },
        discipline: 'multi',
        disciplineTags: 'gravel',
        builderEligible: true,
    },
    {
        id: 'sram-force1-gxp-172-5mm-40t',
        name: 'SRAM Force1 GXP 172.5mm 40t',
        interfaces: { spindle: 'GXP', speeds: 11, configuration: '1x' },
        attributes: { brand: 'SRAM', teeth: '40', weight_g: 665, price: 295, category: 'GRAVEL' },
        discipline: 'multi',
        disciplineTags: 'gravel',
        builderEligible: true,
    },
    {
        id: 'sram-force1-bb30-170mm-40t',
        name: 'SRAM Force1 BB30 170mm 40t',
        interfaces: { spindle: 'BB30', speeds: 11, configuration: '1x' },
        attributes: { brand: 'SRAM', teeth: '40', weight_g: 640, price: 295, category: 'GRAVEL' },
        discipline: 'multi',
        disciplineTags: 'gravel',
        builderEligible: true,
    },

    // ============================================================
    // SRAM Rival1 — 11-speed 1x (value gravel/CX)
    // ============================================================
    {
        id: 'sram-rival1-gxp-170mm-38t',
        name: 'SRAM Rival1 GXP 170mm 38t',
        interfaces: { spindle: 'GXP', speeds: 11, configuration: '1x' },
        attributes: { brand: 'SRAM', teeth: '38', weight_g: 720, price: 185, category: 'GRAVEL' },
        discipline: 'multi',
        disciplineTags: 'gravel',
        builderEligible: true,
    },
    {
        id: 'sram-rival1-gxp-170mm-40t',
        name: 'SRAM Rival1 GXP 170mm 40t',
        interfaces: { spindle: 'GXP', speeds: 11, configuration: '1x' },
        attributes: { brand: 'SRAM', teeth: '40', weight_g: 725, price: 185, category: 'GRAVEL' },
        discipline: 'multi',
        disciplineTags: 'gravel',
        builderEligible: true,
    },
    {
        id: 'sram-rival1-gxp-172-5mm-40t',
        name: 'SRAM Rival1 GXP 172.5mm 40t',
        interfaces: { spindle: 'GXP', speeds: 11, configuration: '1x' },
        attributes: { brand: 'SRAM', teeth: '40', weight_g: 730, price: 185, category: 'GRAVEL' },
        discipline: 'multi',
        disciplineTags: 'gravel',
        builderEligible: true,
    },
];

async function main() {
    console.log('Adding missing gravel cranksets...\n');

    let created = 0;
    let skipped = 0;

    for (const crank of CRANKSETS) {
        const exists = await prisma.component.findUnique({ where: { id: crank.id } });
        if (exists) {
            console.log(`Skipped (exists): ${crank.name}`);
            skipped++;
            continue;
        }

        await prisma.component.create({
            data: {
                id: crank.id,
                type: 'Crankset',
                name: crank.name,
                interfaces: JSON.stringify(crank.interfaces),
                attributes: JSON.stringify(crank.attributes),
                discipline: crank.discipline,
                disciplineTags: crank.disciplineTags,
                builderEligible: crank.builderEligible,
            }
        });
        console.log(`Created: ${crank.name}`);
        created++;
    }

    console.log(`\n✓ Done: ${created} created, ${skipped} skipped`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

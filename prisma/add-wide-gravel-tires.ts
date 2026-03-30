/**
 * Add wide gravel tires in 650b sizes (2.1" and 2.2")
 * These are popular at events like Unbound, BWR, Leadville, SBTGRVL
 *
 * 650b tire widths in inch sizing:
 *   47mm ≈ 1.85"
 *   53mm ≈ 2.1"
 *   56mm ≈ 2.2"
 *
 * Run with: npx tsx prisma/add-wide-gravel-tires.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const WIDE_GRAVEL_TIRES = [
    // ============================================================
    // 650b x ~2.1" (53mm) tires
    // ============================================================
    {
        brand: 'Panaracer',
        model: 'GravelKing SK+',
        size: '650b x 2.1"',
        diameter: '650b',
        width_mm: 53,
        weight: 550,
        tpi: 60,
        tubeless: true,
        purpose: 'Gravel',
    },
    {
        brand: 'WTB',
        model: 'Sendero',
        size: '650b x 2.1"',
        diameter: '650b',
        width_mm: 53,
        weight: 590,
        tpi: 60,
        tubeless: true,
        purpose: 'Gravel',
    },
    {
        brand: 'Specialized',
        model: 'Pathfinder Pro',
        size: '650b x 2.1"',
        diameter: '650b',
        width_mm: 53,
        weight: 560,
        tpi: 60,
        tubeless: true,
        purpose: 'Gravel',
    },
    {
        brand: 'Maxxis',
        model: 'Ikon EXO/TR',
        size: '650b x 2.1"',
        diameter: '650b',
        width_mm: 53,
        weight: 580,
        tpi: 60,
        tubeless: true,
        purpose: 'Gravel',
    },
    {
        brand: 'Teravail',
        model: 'Washburn',
        size: '650b x 2.1"',
        diameter: '650b',
        width_mm: 53,
        weight: 575,
        tpi: 60,
        tubeless: true,
        purpose: 'Gravel',
    },
    {
        brand: 'Vittoria',
        model: 'Mezcal G2.0',
        size: '650b x 2.1"',
        diameter: '650b',
        width_mm: 53,
        weight: 560,
        tpi: 60,
        tubeless: true,
        purpose: 'Gravel',
    },
    {
        brand: 'Donnelly',
        model: 'EMP',
        size: '650b x 2.1"',
        diameter: '650b',
        width_mm: 53,
        weight: 540,
        tpi: 120,
        tubeless: true,
        purpose: 'Gravel',
    },
    {
        brand: 'Rene Herse',
        model: 'Switchback Hill',
        size: '650b x 2.1"',
        diameter: '650b',
        width_mm: 53,
        weight: 550,
        tpi: 60,
        tubeless: true,
        purpose: 'Gravel',
    },
    {
        brand: 'Challenge',
        model: 'Gravel Grinder',
        size: '650b x 2.1"',
        diameter: '650b',
        width_mm: 53,
        weight: 495,
        tpi: 120,
        tubeless: true,
        purpose: 'Gravel',
    },
    {
        brand: 'Schwalbe',
        model: 'G-One Ultrabite',
        size: '650b x 2.1"',
        diameter: '650b',
        width_mm: 53,
        weight: 600,
        tpi: 67,
        tubeless: true,
        purpose: 'Gravel',
    },

    // ============================================================
    // 650b x ~2.2" (56mm) tires
    // ============================================================
    {
        brand: 'Teravail',
        model: 'Kessel',
        size: '650b x 2.2"',
        diameter: '650b',
        width_mm: 56,
        weight: 635,
        tpi: 60,
        tubeless: true,
        purpose: 'Gravel',
    },
    {
        brand: 'WTB',
        model: 'Ranger',
        size: '650b x 2.2"',
        diameter: '650b',
        width_mm: 56,
        weight: 645,
        tpi: 60,
        tubeless: true,
        purpose: 'Gravel',
    },
    {
        brand: 'Maxxis',
        model: 'Rekon Race',
        size: '650b x 2.2"',
        diameter: '650b',
        width_mm: 56,
        weight: 620,
        tpi: 60,
        tubeless: true,
        purpose: 'Gravel',
    },
    {
        brand: 'Schwalbe',
        model: 'G-One Bite',
        size: '650b x 2.2"',
        diameter: '650b',
        width_mm: 56,
        weight: 630,
        tpi: 67,
        tubeless: true,
        purpose: 'Gravel',
    },
    {
        brand: 'Panaracer',
        model: 'GravelKing SK+',
        size: '650b x 2.2"',
        diameter: '650b',
        width_mm: 56,
        weight: 595,
        tpi: 60,
        tubeless: true,
        purpose: 'Gravel',
    },
];

async function main() {
    console.log('Adding wide gravel tires (650b 2.1" and 2.2")...\n');

    let created = 0;
    let skipped = 0;

    for (const tire of WIDE_GRAVEL_TIRES) {
        const id = `${tire.brand}-${tire.model}-${tire.size}`
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
        const name = `${tire.brand} ${tire.model} ${tire.size}`;

        const exists = await prisma.component.findUnique({ where: { id } });
        if (exists) {
            console.log(`Skipped (exists): ${name}`);
            skipped++;
            continue;
        }

        await prisma.component.create({
            data: {
                id,
                type: 'Tire',
                name,
                interfaces: JSON.stringify({
                    diameter: tire.diameter,
                    width: tire.width_mm,
                    tubeless: tire.tubeless,
                }),
                attributes: JSON.stringify({
                    size_label: tire.size,
                    weight: tire.weight,
                    tpi: tire.tpi,
                    purpose: tire.purpose,
                }),
                discipline: 'multi',
                disciplineTags: 'gravel',
                builderEligible: true,
            }
        });
        console.log(`Created: ${name}`);
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

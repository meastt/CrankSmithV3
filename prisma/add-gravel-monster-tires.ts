/**
 * Add Gravel Monster tires (50-54mm) for wide-clearance gravel frames
 *
 * These are real 700c gravel tires in the 50-54mm range for frames like:
 * - Open WIDE (54mm max)
 * - Specialized Diverge STR (53mm max)
 * - Trek Checkpoint SL7 (54mm max)
 * - 3T Exploro (54mm max)
 *
 * Run with: npx tsx prisma/add-gravel-monster-tires.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const GRAVEL_MONSTER_TIRES = [
    // Rene Herse - premium wide gravel tires
    {
        brand: 'Rene Herse',
        model: 'Antelope Hill',
        size: '700x55c',
        width_mm: 55,
        weight: 495,
        tpi: 60,
        tubeless: true,
        purpose: 'Gravel'
    },
    {
        brand: 'Rene Herse',
        model: 'Juniper Ridge',
        size: '700x55c',
        width_mm: 55,
        weight: 520,
        tpi: 60,
        tubeless: true,
        purpose: 'Gravel'
    },
    // WTB - popular gravel tire brand
    {
        brand: 'WTB',
        model: 'Venture',
        size: '700x50c',
        width_mm: 50,
        weight: 530,
        tpi: 60,
        tubeless: true,
        purpose: 'Gravel'
    },
    {
        brand: 'WTB',
        model: 'Raddler',
        size: '700x50c',
        width_mm: 50,
        weight: 485,
        tpi: 60,
        tubeless: true,
        purpose: 'Gravel'
    },
    {
        brand: 'WTB',
        model: 'Resolute',
        size: '700x50c',
        width_mm: 50,
        weight: 560,
        tpi: 60,
        tubeless: true,
        purpose: 'Gravel'
    },
    // Teravail - quality gravel tires
    {
        brand: 'Teravail',
        model: 'Sparwood',
        size: '700x50c',
        width_mm: 50,
        weight: 560,
        tpi: 60,
        tubeless: true,
        purpose: 'Gravel'
    },
    {
        brand: 'Teravail',
        model: 'Rutland',
        size: '700x50c',
        width_mm: 50,
        weight: 515,
        tpi: 60,
        tubeless: true,
        purpose: 'Gravel'
    },
    {
        brand: 'Teravail',
        model: 'Cannonball',
        size: '700x50c',
        width_mm: 50,
        weight: 490,
        tpi: 60,
        tubeless: true,
        purpose: 'Gravel'
    },
    // Panaracer - Japanese quality
    {
        brand: 'Panaracer',
        model: 'GravelKing SK',
        size: '700x50c',
        width_mm: 50,
        weight: 520,
        tpi: 60,
        tubeless: true,
        purpose: 'Gravel'
    },
    {
        brand: 'Panaracer',
        model: 'GravelKing SS',
        size: '700x50c',
        width_mm: 50,
        weight: 495,
        tpi: 60,
        tubeless: true,
        purpose: 'Gravel'
    },
    // Schwalbe - German engineering
    {
        brand: 'Schwalbe',
        model: 'G-One Allround',
        size: '700x50c',
        width_mm: 50,
        weight: 550,
        tpi: 67,
        tubeless: true,
        purpose: 'Gravel'
    },
    {
        brand: 'Schwalbe',
        model: 'G-One Ultrabite',
        size: '700x50c',
        width_mm: 50,
        weight: 570,
        tpi: 67,
        tubeless: true,
        purpose: 'Gravel'
    },
    // Specialized
    {
        brand: 'Specialized',
        model: 'Pathfinder Pro',
        size: '700x50c',
        width_mm: 50,
        weight: 520,
        tpi: 60,
        tubeless: true,
        purpose: 'Gravel'
    },
    // Maxxis
    {
        brand: 'Maxxis',
        model: 'Receptor',
        size: '700x50c',
        width_mm: 50,
        weight: 540,
        tpi: 60,
        tubeless: true,
        purpose: 'Gravel'
    },
    {
        brand: 'Maxxis',
        model: 'Rambler',
        size: '700x50c',
        width_mm: 50,
        weight: 550,
        tpi: 60,
        tubeless: true,
        purpose: 'Gravel'
    },
    // Continental
    {
        brand: 'Continental',
        model: 'Terra Trail',
        size: '700x50c',
        width_mm: 50,
        weight: 560,
        tpi: 60,
        tubeless: true,
        purpose: 'Gravel'
    },
    // Vittoria
    {
        brand: 'Vittoria',
        model: 'Terreno Dry',
        size: '700x54c',
        width_mm: 54,
        weight: 590,
        tpi: 60,
        tubeless: true,
        purpose: 'Gravel'
    },
    {
        brand: 'Vittoria',
        model: 'Terreno Mix',
        size: '700x54c',
        width_mm: 54,
        weight: 620,
        tpi: 60,
        tubeless: true,
        purpose: 'Gravel'
    },
    // IRC - Japanese brand popular in gravel
    {
        brand: 'IRC',
        model: 'Boken Plus',
        size: '700x50c',
        width_mm: 50,
        weight: 525,
        tpi: 60,
        tubeless: true,
        purpose: 'Gravel'
    },
    // Challenge - handmade Italian
    {
        brand: 'Challenge',
        model: 'Gravel Grinder',
        size: '700x50c',
        width_mm: 50,
        weight: 480,
        tpi: 120,
        tubeless: true,
        purpose: 'Gravel'
    }
];

async function main() {
    console.log('Adding Gravel Monster tires (50-54mm)...\n');

    for (const tire of GRAVEL_MONSTER_TIRES) {
        const id = `${tire.brand}-${tire.model}-${tire.size}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        const name = `${tire.brand} ${tire.model} ${tire.size}`;

        const componentData = {
            id,
            type: 'Tire',
            name,
            interfaces: JSON.stringify({
                diameter: '700c',
                width: tire.width_mm,
                tubeless: tire.tubeless
            }),
            attributes: JSON.stringify({
                size_label: tire.size,
                weight: tire.weight,
                tpi: tire.tpi,
                purpose: tire.purpose
            })
        };

        const exists = await prisma.component.findUnique({ where: { id } });
        if (!exists) {
            await prisma.component.create({ data: componentData });
            console.log(`Created: ${name}`);
        } else {
            console.log(`Skipped (exists): ${name}`);
        }
    }

    console.log('\n✓ Gravel Monster tires added');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

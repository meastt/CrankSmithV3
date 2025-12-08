/**
 * Gravel Suspension Forks Seed Script
 *
 * Popular gravel suspension forks with real specs:
 * - RockShox Rudy XPLR (30mm, 40mm travel)
 * - RockShox Rudy XL (50mm, 60mm travel)
 * - Fox 32 TC (Taper-Cast) (40mm, 50mm travel)
 * - Lauf Grit SL (30mm leaf spring)
 * - MRP Baxter (40mm, 60mm travel)
 * - SR Suntour GVX (30mm budget option)
 *
 * All specs sourced from manufacturer data and reviews.
 * Sources:
 * - https://www.bikeradar.com/advice/buyers-guides/best-gravel-suspension-forks
 * - https://www.sram.com/en/rockshox/models/fs-rudy-xplr-ult
 * - https://www.ridefox.com/family.php?m=bike&family=32tc
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface GravelForkSpec {
    brand: string;
    model: string;
    travel: number;        // mm
    weight: number;        // grams
    price: number;         // USD
    damper: string;        // Damper type
    wheelSize: string;     // 700c, 650b, or both
    maxTire: string;       // Max tire clearance
    axleToC: number;       // Axle-to-crown in mm
    offset: number;        // Rake/offset in mm
    features?: string[];   // Special features
}

const GRAVEL_SUSPENSION_FORKS: GravelForkSpec[] = [
    // ============================================================================
    // ROCKSHOX RUDY XPLR SERIES (Entry to mid-range gravel suspension)
    // ============================================================================
    {
        brand: 'RockShox',
        model: 'Rudy Ultimate XPLR 30mm',
        travel: 30,
        weight: 1200,
        price: 799,
        damper: 'Charger Race Day',
        wheelSize: '700c',
        maxTire: '50mm',
        axleToC: 400,
        offset: 45,
        features: ['SoloAir spring', 'Lockout', 'Rebound adjust']
    },
    {
        brand: 'RockShox',
        model: 'Rudy Ultimate XPLR 40mm',
        travel: 40,
        weight: 1250,
        price: 799,
        damper: 'Charger Race Day',
        wheelSize: '700c',
        maxTire: '50mm',
        axleToC: 410,
        offset: 51,
        features: ['SoloAir spring', 'Lockout', 'Rebound adjust']
    },
    {
        brand: 'RockShox',
        model: 'Rudy XPLR 30mm',
        travel: 30,
        weight: 1280,
        price: 549,
        damper: 'Motion Control',
        wheelSize: '700c',
        maxTire: '50mm',
        axleToC: 400,
        offset: 45,
        features: ['SoloAir spring', 'Lockout']
    },
    {
        brand: 'RockShox',
        model: 'Rudy XPLR 40mm',
        travel: 40,
        weight: 1310,
        price: 549,
        damper: 'Motion Control',
        wheelSize: '700c',
        maxTire: '50mm',
        axleToC: 410,
        offset: 51,
        features: ['SoloAir spring', 'Lockout']
    },

    // ============================================================================
    // ROCKSHOX RUDY XL SERIES (2025 - More travel, more tire clearance)
    // ============================================================================
    {
        brand: 'RockShox',
        model: 'Rudy XL Ultimate 50mm',
        travel: 50,
        weight: 1350,
        price: 929,
        damper: 'Charger Race Day 2',
        wheelSize: '700c/650b',
        maxTire: '55mm / 29x2.25"',
        axleToC: 430,
        offset: 45,
        features: ['SoloAir spring', 'Lockout', 'Rebound adjust', 'Low-speed compression']
    },
    {
        brand: 'RockShox',
        model: 'Rudy XL Ultimate 60mm',
        travel: 60,
        weight: 1380,
        price: 929,
        damper: 'Charger Race Day 2',
        wheelSize: '700c/650b',
        maxTire: '55mm / 29x2.25"',
        axleToC: 445,
        offset: 45,
        features: ['SoloAir spring', 'Lockout', 'Rebound adjust', 'Low-speed compression']
    },
    {
        brand: 'RockShox',
        model: 'Rudy XL 50mm',
        travel: 50,
        weight: 1400,
        price: 649,
        damper: 'Motion Control',
        wheelSize: '700c/650b',
        maxTire: '55mm / 29x2.25"',
        axleToC: 430,
        offset: 45,
        features: ['SoloAir spring', 'Rebound adjust']
    },
    {
        brand: 'RockShox',
        model: 'Rudy XL 60mm',
        travel: 60,
        weight: 1430,
        price: 649,
        damper: 'Motion Control',
        wheelSize: '700c/650b',
        maxTire: '55mm / 29x2.25"',
        axleToC: 445,
        offset: 45,
        features: ['SoloAir spring', 'Rebound adjust']
    },

    // ============================================================================
    // FOX 32 TAPER-CAST (TC) SERIES (Lightest gravel suspension fork)
    // ============================================================================
    {
        brand: 'Fox',
        model: '32 TC Factory 40mm',
        travel: 40,
        weight: 1226,
        price: 949,
        damper: 'FIT4',
        wheelSize: '700c',
        maxTire: '50mm',
        axleToC: 405,
        offset: 44,
        features: ['GRIP2 damper', 'Kashima coating', 'EVOL air spring', 'No lockout']
    },
    {
        brand: 'Fox',
        model: '32 TC Factory 50mm',
        travel: 50,
        weight: 1250,
        price: 949,
        damper: 'FIT4',
        wheelSize: '700c',
        maxTire: '50mm',
        axleToC: 415,
        offset: 44,
        features: ['GRIP2 damper', 'Kashima coating', 'EVOL air spring', 'No lockout']
    },
    {
        brand: 'Fox',
        model: '32 TC Performance Elite 40mm',
        travel: 40,
        weight: 1260,
        price: 849,
        damper: 'FIT4',
        wheelSize: '700c',
        maxTire: '50mm',
        axleToC: 405,
        offset: 44,
        features: ['FIT4 damper', 'EVOL air spring']
    },
    {
        brand: 'Fox',
        model: '32 TC Performance Elite 50mm',
        travel: 50,
        weight: 1285,
        price: 849,
        damper: 'FIT4',
        wheelSize: '700c',
        maxTire: '50mm',
        axleToC: 415,
        offset: 44,
        features: ['FIT4 damper', 'EVOL air spring']
    },
    {
        brand: 'Fox',
        model: '32 TC Performance 40mm',
        travel: 40,
        weight: 1290,
        price: 769,
        damper: 'GRIP',
        wheelSize: '700c',
        maxTire: '50mm',
        axleToC: 405,
        offset: 44,
        features: ['GRIP damper', 'EVOL air spring']
    },
    {
        brand: 'Fox',
        model: '32 TC Performance 50mm',
        travel: 50,
        weight: 1315,
        price: 769,
        damper: 'GRIP',
        wheelSize: '700c',
        maxTire: '50mm',
        axleToC: 415,
        offset: 44,
        features: ['GRIP damper', 'EVOL air spring']
    },

    // ============================================================================
    // LAUF GRIT SL (Leaf spring design - lightest option)
    // ============================================================================
    {
        brand: 'Lauf',
        model: 'Grit SL 30mm',
        travel: 30,
        weight: 850,
        price: 990,
        damper: 'Leaf Spring',
        wheelSize: '700c',
        maxTire: '50mm',
        axleToC: 395,
        offset: 45,
        features: ['Maintenance-free', 'No damping adjustment', 'Ultra-light']
    },
    {
        brand: 'Lauf',
        model: 'Grit SL 650b',
        travel: 30,
        weight: 850,
        price: 990,
        damper: 'Leaf Spring',
        wheelSize: '650b',
        maxTire: '2.1"',
        axleToC: 395,
        offset: 45,
        features: ['Maintenance-free', 'No damping adjustment', 'Ultra-light']
    },

    // ============================================================================
    // MRP BAXTER (Heavy-duty option with more adjustability)
    // ============================================================================
    {
        brand: 'MRP',
        model: 'Baxter 40mm',
        travel: 40,
        weight: 1600,
        price: 699,
        damper: 'Ramp Control',
        wheelSize: '700c/650b',
        maxTire: '50mm',
        axleToC: 435,
        offset: 47,
        features: ['Volume spacers', 'Adjustable travel', 'Rebound adjust']
    },
    {
        brand: 'MRP',
        model: 'Baxter 60mm',
        travel: 60,
        weight: 1680,
        price: 699,
        damper: 'Ramp Control',
        wheelSize: '700c/650b',
        maxTire: '50mm',
        axleToC: 456,
        offset: 47,
        features: ['Volume spacers', 'Adjustable travel', 'Rebound adjust']
    },

    // ============================================================================
    // SR SUNTOUR (Budget option)
    // ============================================================================
    {
        brand: 'SR Suntour',
        model: 'GVX 30mm',
        travel: 30,
        weight: 1550,
        price: 399,
        damper: 'MCU Spring',
        wheelSize: '700c',
        maxTire: '45mm',
        axleToC: 400,
        offset: 45,
        features: ['Budget friendly', 'Lockout']
    },

    // ============================================================================
    // KINEKT (Inline suspension stem alternative - included for comparison)
    // Note: This is technically a suspension stem, but relevant for gravel
    // ============================================================================
];

async function upsertFork(fork: GravelForkSpec) {
    const id = `${fork.brand.toLowerCase().replace(/\s+/g, '-')}-${fork.model.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`;
    const name = `${fork.brand} ${fork.model}`;

    const interfaces = {
        steerer: 'Tapered 1-1/8" to 1-1/2"',
        axle_standard: '12x100mm',
        brake_mount: 'Flat Mount',
        wheel_size: fork.wheelSize,
        suspension_type: fork.damper === 'Leaf Spring' ? 'Leaf Spring' : 'Air',
        category: 'GRAVEL',
        fork_type: 'SUSPENSION'
    };

    const attributes = {
        brand: fork.brand,
        model: fork.model,
        travel: `${fork.travel}mm`,
        weight: fork.weight,
        price: fork.price,
        damper: fork.damper,
        max_tire: fork.maxTire,
        axle_to_crown: `${fork.axleToC}mm`,
        offset: `${fork.offset}mm`,
        features: fork.features || [],
        material: 'Carbon',
        category: 'GRAVEL'
    };

    try {
        await prisma.component.upsert({
            where: { id },
            update: {
                name,
                interfaces: JSON.stringify(interfaces),
                attributes: JSON.stringify(attributes)
            },
            create: {
                id,
                type: 'Fork',
                name,
                interfaces: JSON.stringify(interfaces),
                attributes: JSON.stringify(attributes)
            }
        });
        console.log(`✅ ${name}`);
        return true;
    } catch (err) {
        console.error(`❌ Failed: ${name}`, err);
        return false;
    }
}

async function main() {
    console.log('🚴 Seeding Gravel Suspension Forks...\n');

    let success = 0;
    let failed = 0;

    for (const fork of GRAVEL_SUSPENSION_FORKS) {
        const result = await upsertFork(fork);
        if (result) success++;
        else failed++;
    }

    console.log(`\n📊 Results: ${success} added, ${failed} failed`);
    console.log(`\n✅ Gravel suspension fork seeding complete!`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());

/**
 * Add Specialized MTB frames: Chisel (HT) and Epic (HT & FS)
 *
 * Chisel: Aluminum XC hardtail
 * Epic 8: Carbon XC (available in hardtail and full suspension)
 *
 * Run with: npx tsx prisma/add-specialized-mtb.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SPECIALIZED_MTB_FRAMES = [
    // Specialized Chisel - Aluminum XC Hardtail
    {
        id: 'specialized-chisel-ht',
        name: 'Specialized Chisel Comp',
        attributes: {
            brand: 'Specialized',
            material: 'Aluminum',
            category: 'MTB',
            subcategory: 'XC Hardtail',
            weight_g: 1650, // Aluminum HT frame weight
            max_tire: 57, // 2.25" max
            wheel_size: '29',
        },
        interfaces: {
            bb_shell: 'BSA_73mm',
            brake_type: 'Disc',
            axle_standard: 'Boost_148x12',
            front_axle: 'Boost_110x15',
            headset: 'ZS44/ZS56',
            seatpost: '30.9mm',
        },
    },
    // Specialized Epic 8 Hardtail - Carbon XC Hardtail
    {
        id: 'specialized-epic-ht',
        name: 'Specialized Epic 8 Hardtail',
        attributes: {
            brand: 'Specialized',
            material: 'Carbon',
            category: 'MTB',
            subcategory: 'XC Hardtail',
            weight_g: 980, // Light carbon HT frame
            max_tire: 57, // 2.25" max
            wheel_size: '29',
        },
        interfaces: {
            bb_shell: 'BSA_73mm',
            brake_type: 'Disc',
            axle_standard: 'Boost_148x12',
            front_axle: 'Boost_110x15',
            headset: 'ZS44/ZS56',
            seatpost: '30.9mm',
        },
    },
    // Specialized Epic 8 EVO - Carbon XC Full Suspension
    {
        id: 'specialized-epic-evo-fs',
        name: 'Specialized Epic 8 EVO',
        attributes: {
            brand: 'Specialized',
            material: 'Carbon',
            category: 'MTB',
            subcategory: 'XC Full Suspension',
            weight_g: 2100, // FS frame + shock
            max_tire: 61, // 2.4" max
            wheel_size: '29',
            rear_travel: 110, // mm
        },
        interfaces: {
            bb_shell: 'BSA_73mm',
            brake_type: 'Disc',
            axle_standard: 'Boost_148x12',
            front_axle: 'Boost_110x15',
            headset: 'ZS44/ZS56',
            seatpost: '30.9mm',
            shock: 'Trunnion',
        },
    },
    // Specialized Epic 8 - Carbon XC Full Suspension (Race version, less travel)
    {
        id: 'specialized-epic-fs',
        name: 'Specialized Epic 8',
        attributes: {
            brand: 'Specialized',
            material: 'Carbon',
            category: 'MTB',
            subcategory: 'XC Full Suspension',
            weight_g: 1950, // Lighter race FS frame
            max_tire: 57, // 2.25" max
            wheel_size: '29',
            rear_travel: 100, // mm
        },
        interfaces: {
            bb_shell: 'BSA_73mm',
            brake_type: 'Disc',
            axle_standard: 'Boost_148x12',
            front_axle: 'Boost_110x15',
            headset: 'ZS44/ZS56',
            seatpost: '30.9mm',
            shock: 'Trunnion',
        },
    },
];

async function main() {
    console.log('Adding Specialized MTB frames...\n');

    for (const frame of SPECIALIZED_MTB_FRAMES) {
        const componentData = {
            id: frame.id,
            type: 'Frame',
            name: frame.name,
            interfaces: JSON.stringify(frame.interfaces),
            attributes: JSON.stringify(frame.attributes),
        };

        const exists = await prisma.component.findUnique({ where: { id: frame.id } });
        if (!exists) {
            await prisma.component.create({ data: componentData });
            console.log(`Created: ${frame.name} (${frame.attributes.weight_g}g)`);
        } else {
            await prisma.component.update({
                where: { id: frame.id },
                data: componentData,
            });
            console.log(`Updated: ${frame.name} (${frame.attributes.weight_g}g)`);
        }
    }

    console.log('\nSpecialized MTB frames added!');
    console.log('\nWeight summary:');
    console.log('  - Chisel Comp (Aluminum HT): 1650g');
    console.log('  - Epic 8 Hardtail (Carbon HT): 980g');
    console.log('  - Epic 8 (Carbon FS Race): 1950g');
    console.log('  - Epic 8 EVO (Carbon FS Trail): 2100g');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

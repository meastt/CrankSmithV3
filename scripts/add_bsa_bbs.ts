
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const newBBs = [
    {
        type: 'BottomBracket',
        name: 'Chris King ThreadFit 24 (BSA)',
        interfaces: JSON.stringify({
            frame_shell: 'BSA_Threaded_68mm',
            crank_spindle: 'Hollowtech_II_24mm'
        }),
        attributes: JSON.stringify({
            brand: 'Chris King',
            weight_g: 89,
            note: 'Legendary durability, requires Fit Kit'
        })
    },
    {
        type: 'BottomBracket',
        name: 'Chris King ThreadFit 30 (BSA)',
        interfaces: JSON.stringify({
            frame_shell: 'BSA_Threaded_68mm',
            crank_spindle: '30mm'
        }),
        attributes: JSON.stringify({
            brand: 'Chris King',
            weight_g: 85,
            note: 'For 30mm spindles in BSA shells'
        })
    },
    {
        type: 'BottomBracket',
        name: 'Wheels Mfg BSA 30mm',
        interfaces: JSON.stringify({
            frame_shell: 'BSA_Threaded_68mm',
            crank_spindle: '30mm'
        }),
        attributes: JSON.stringify({
            brand: 'Wheels Manufacturing',
            weight_g: 95,
            note: 'External cup for 30mm spindles'
        })
    },
    {
        type: 'BottomBracket',
        name: 'Wheels Mfg BSA DUB',
        interfaces: JSON.stringify({
            frame_shell: 'BSA_Threaded_68mm',
            crank_spindle: 'DUB_28.99mm'
        }),
        attributes: JSON.stringify({
            brand: 'Wheels Manufacturing',
            weight_g: 98,
            note: 'For SRAM DUB cranks'
        })
    },
    {
        type: 'BottomBracket',
        name: 'Shimano Ultegra BB-R8000 (BSA)',
        interfaces: JSON.stringify({
            frame_shell: 'BSA_Threaded_68mm',
            crank_spindle: 'Hollowtech_II_24mm'
        }),
        attributes: JSON.stringify({
            brand: 'Shimano',
            weight_g: 77,
            price: 25
        })
    },
    {
        type: 'BottomBracket',
        name: 'Hope BSA 30mm',
        interfaces: JSON.stringify({
            frame_shell: 'BSA_Threaded_68mm',
            crank_spindle: '30mm'
        }),
        attributes: JSON.stringify({
            brand: 'Hope',
            weight_g: 95,
            color: 'Various'
        })
    }
];

async function seed() {
    console.log('Seeding BSA Bottom Brackets...');
    for (const bb of newBBs) {
        const exists = await prisma.component.findFirst({
            where: { name: bb.name }
        });

        if (!exists) {
            await prisma.component.create({ data: bb });
            console.log(`Created: ${bb.name}`);
        } else {
            console.log(`Skipped (Exists): ${bb.name}`);
        }
    }
    console.log('Seeding complete.');
}

seed()
    .catch(console.error)
    .finally(() => prisma.$disconnect());

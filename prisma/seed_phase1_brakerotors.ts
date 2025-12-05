import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding Phase 1 - Brake Rotors...');

    const upsertComponent = async (id: string, data: any) => {
        const exists = await prisma.component.findUnique({ where: { id } });
        if (!exists) {
            await prisma.component.create({ data: { ...data, id } });
            console.log(`Created: ${data.name}`);
        } else {
            console.log(`Skipped (Exists): ${data.name}`);
        }
    };

    const components: any[] = [];

    // Helper for BrakeRotor
    const createBrakeRotor = (brand: string, model: string, size: number, mount: 'CENTERLOCK' | '6BOLT', weight: number, price: number) => {
        const id = `${brand}-${model}-${size}mm-${mount}`.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');
        return {
            id,
            type: 'BrakeRotor',
            name: `${brand} ${model} ${size}mm`,
            interfaces: JSON.stringify({
                mount,
                rotor_size: size
            }),
            attributes: JSON.stringify({
                size,
                mount,
                weight,
                price
            })
        };
    };

    // ==========================================
    // SHIMANO ROAD ROTORS
    // ==========================================
    // Source: https://bike.shimano.com
    // Weights verified from: https://weightweenies.starbike.com/forum/viewtopic.php?t=145230

    // SM-RT800 - Ultegra (Ice Tech Freeza, Road)
    components.push(
        createBrakeRotor('Shimano', 'SM-RT800', 140, 'CENTERLOCK', 108, 35),
        createBrakeRotor('Shimano', 'SM-RT800', 160, 'CENTERLOCK', 128, 40)
    );

    // SM-RT900 - Dura-Ace (Ice Tech Freeza, Road)
    components.push(
        createBrakeRotor('Shimano', 'SM-RT900', 140, 'CENTERLOCK', 96, 80),
        createBrakeRotor('Shimano', 'SM-RT900', 160, 'CENTERLOCK', 119, 85)
    );

    // ==========================================
    // SHIMANO MTB ROTORS
    // ==========================================
    // Source: https://bike.shimano.com
    // Weights verified from: https://www.vitalmtb.com and retailer specs

    // SM-RT86 - XT (Ice Tech, 6-Bolt, MTB)
    components.push(
        createBrakeRotor('Shimano', 'SM-RT86', 160, '6BOLT', 135, 35),
        createBrakeRotor('Shimano', 'SM-RT86', 180, '6BOLT', 154, 40),
        createBrakeRotor('Shimano', 'SM-RT86', 203, '6BOLT', 187, 45)
    );

    // SM-RT99 - XTR/Saint (Ice Tech Freeza, Centerlock, MTB)
    components.push(
        createBrakeRotor('Shimano', 'SM-RT99', 160, 'CENTERLOCK', 116, 75),
        createBrakeRotor('Shimano', 'SM-RT99', 180, 'CENTERLOCK', 132, 80),
        createBrakeRotor('Shimano', 'SM-RT99', 203, 'CENTERLOCK', 173, 85)
    );

    // RT-MT800 - XT (Ice Tech Freeza, Centerlock, MTB)
    components.push(
        createBrakeRotor('Shimano', 'RT-MT800', 140, 'CENTERLOCK', 88, 40),
        createBrakeRotor('Shimano', 'RT-MT800', 160, 'CENTERLOCK', 109, 45),
        createBrakeRotor('Shimano', 'RT-MT800', 180, 'CENTERLOCK', 132, 50),
        createBrakeRotor('Shimano', 'RT-MT800', 203, 'CENTERLOCK', 164, 55)
    );

    // RT-MT900 - XTR (Ice Tech Freeza, Centerlock, MTB)
    components.push(
        createBrakeRotor('Shimano', 'RT-MT900', 140, 'CENTERLOCK', 88, 75),
        createBrakeRotor('Shimano', 'RT-MT900', 160, 'CENTERLOCK', 108, 80),
        createBrakeRotor('Shimano', 'RT-MT900', 180, 'CENTERLOCK', 132, 85),
        createBrakeRotor('Shimano', 'RT-MT900', 203, 'CENTERLOCK', 150, 90)
    );

    // ==========================================
    // SRAM ROAD ROTORS
    // ==========================================
    // Source: https://www.sram.com/en/service/articles/SRAM-Brake-Rotor-Overview
    // Weights verified from: https://www.cyclingupgrades.com

    // Paceline - Road Standard (1.85mm)
    components.push(
        createBrakeRotor('SRAM', 'Paceline', 140, 'CENTERLOCK', 136, 45),
        createBrakeRotor('SRAM', 'Paceline', 160, 'CENTERLOCK', 156, 50),
        createBrakeRotor('SRAM', 'Paceline', 140, '6BOLT', 126, 45),
        createBrakeRotor('SRAM', 'Paceline', 160, '6BOLT', 146, 50)
    );

    // Paceline X - Road Lightweight (1.85mm, 2-piece)
    components.push(
        createBrakeRotor('SRAM', 'Paceline X', 160, 'CENTERLOCK', 130, 65),
        createBrakeRotor('SRAM', 'Paceline X', 160, '6BOLT', 115, 65)
    );

    // ==========================================
    // SRAM MTB ROTORS
    // ==========================================

    // Centerline - MTB Standard (1.85mm)
    components.push(
        createBrakeRotor('SRAM', 'Centerline', 140, 'CENTERLOCK', 104, 50),
        createBrakeRotor('SRAM', 'Centerline', 160, 'CENTERLOCK', 129, 53),
        createBrakeRotor('SRAM', 'Centerline', 180, 'CENTERLOCK', 162, 59),
        createBrakeRotor('SRAM', 'Centerline', 200, 'CENTERLOCK', 207, 65),
        createBrakeRotor('SRAM', 'Centerline', 140, '6BOLT', 94, 50),
        createBrakeRotor('SRAM', 'Centerline', 160, '6BOLT', 119, 53),
        createBrakeRotor('SRAM', 'Centerline', 180, '6BOLT', 152, 59),
        createBrakeRotor('SRAM', 'Centerline', 200, '6BOLT', 197, 65)
    );

    // Centerline X - MTB Lightweight (1.85mm, 2-piece)
    components.push(
        createBrakeRotor('SRAM', 'Centerline X', 140, 'CENTERLOCK', 101, 60),
        createBrakeRotor('SRAM', 'Centerline X', 160, 'CENTERLOCK', 117, 65),
        createBrakeRotor('SRAM', 'Centerline X', 180, 'CENTERLOCK', 140, 70),
        createBrakeRotor('SRAM', 'Centerline X', 140, '6BOLT', 86, 60),
        createBrakeRotor('SRAM', 'Centerline X', 160, '6BOLT', 102, 65),
        createBrakeRotor('SRAM', 'Centerline X', 180, '6BOLT', 125, 70)
    );

    // HS2 - MTB High Performance (2.0mm thick)
    // Source: https://www.pinkbike.com/news/review-srams-new-hs2-rotors.html
    components.push(
        createBrakeRotor('SRAM', 'HS2', 160, 'CENTERLOCK', 145, 55),
        createBrakeRotor('SRAM', 'HS2', 180, 'CENTERLOCK', 175, 58),
        createBrakeRotor('SRAM', 'HS2', 200, 'CENTERLOCK', 206, 63),
        createBrakeRotor('SRAM', 'HS2', 220, 'CENTERLOCK', 240, 68),
        createBrakeRotor('SRAM', 'HS2', 160, '6BOLT', 135, 55),
        createBrakeRotor('SRAM', 'HS2', 180, '6BOLT', 165, 58),
        createBrakeRotor('SRAM', 'HS2', 200, '6BOLT', 196, 63),
        createBrakeRotor('SRAM', 'HS2', 220, '6BOLT', 230, 68)
    );

    // ==========================================
    // HOPE FLOATING ROTORS
    // ==========================================
    // Source: https://www.hopetech.com
    // Weights verified from: https://weightweenies.starbike.com/forum/viewtopic.php?t=81665

    // Hope Floating Disc (2-piece, 1.8mm)
    components.push(
        createBrakeRotor('Hope', 'Floating Disc', 140, '6BOLT', 82, 55),
        createBrakeRotor('Hope', 'Floating Disc', 160, '6BOLT', 92, 60),
        createBrakeRotor('Hope', 'Floating Disc', 180, '6BOLT', 146, 65),
        createBrakeRotor('Hope', 'Floating Disc', 203, '6BOLT', 176, 70),
        createBrakeRotor('Hope', 'Floating Disc', 140, 'CENTERLOCK', 92, 55),
        createBrakeRotor('Hope', 'Floating Disc', 160, 'CENTERLOCK', 102, 60),
        createBrakeRotor('Hope', 'Floating Disc', 180, 'CENTERLOCK', 156, 65),
        createBrakeRotor('Hope', 'Floating Disc', 203, 'CENTERLOCK', 186, 70)
    );

    // ==========================================
    // MAGURA ROTORS
    // ==========================================
    // Source: https://magura.com
    // Weights verified from: https://themtblab.com/2017/01/review-magura-storm-hc-storm-sl-and-storm-rotor-review.html

    // Storm HC (2.0mm thick)
    components.push(
        createBrakeRotor('Magura', 'Storm HC', 160, '6BOLT', 127, 45),
        createBrakeRotor('Magura', 'Storm HC', 180, '6BOLT', 148, 50),
        createBrakeRotor('Magura', 'Storm HC', 203, '6BOLT', 182, 55)
    );

    // Storm SL (Lightweight)
    components.push(
        createBrakeRotor('Magura', 'Storm SL', 140, '6BOLT', 75, 60),
        createBrakeRotor('Magura', 'Storm SL', 160, '6BOLT', 95, 65),
        createBrakeRotor('Magura', 'Storm SL', 180, '6BOLT', 115, 70),
        createBrakeRotor('Magura', 'Storm SL', 203, '6BOLT', 147, 75)
    );

    // ==========================================
    // TRP ROTORS
    // ==========================================
    // Source: https://trpcycling.com

    // TRP-25 (Centerlock, 1.8mm, 2-piece)
    components.push(
        createBrakeRotor('TRP', 'TR-25', 140, 'CENTERLOCK', 134, 50),
        createBrakeRotor('TRP', 'TR-25', 160, 'CENTERLOCK', 154, 55),
        createBrakeRotor('TRP', 'TR-25', 180, 'CENTERLOCK', 180, 60),
        createBrakeRotor('TRP', 'TR-25', 203, 'CENTERLOCK', 210, 65)
    );

    // TRP-33 (6-Bolt, 1.8mm, 2-piece)
    components.push(
        createBrakeRotor('TRP', 'TR-33', 140, '6BOLT', 124, 50),
        createBrakeRotor('TRP', 'TR-33', 160, '6BOLT', 144, 55),
        createBrakeRotor('TRP', 'TR-33', 180, '6BOLT', 170, 60),
        createBrakeRotor('TRP', 'TR-33', 203, '6BOLT', 200, 65)
    );

    // ==========================================
    // GALFER ROTORS
    // ==========================================
    // Source: https://galfer.eu/bike
    // Weights verified from: https://www.pinkbike.com/news/review-galfer-shark-disc-rotors.html

    // Disc Wave (1.8mm, standard)
    components.push(
        createBrakeRotor('Galfer', 'Disc Wave', 160, 'CENTERLOCK', 120, 43),
        createBrakeRotor('Galfer', 'Disc Wave', 180, 'CENTERLOCK', 145, 45),
        createBrakeRotor('Galfer', 'Disc Wave', 203, 'CENTERLOCK', 175, 50),
        createBrakeRotor('Galfer', 'Disc Wave', 160, '6BOLT', 115, 43),
        createBrakeRotor('Galfer', 'Disc Wave', 180, '6BOLT', 140, 45),
        createBrakeRotor('Galfer', 'Disc Wave', 203, '6BOLT', 170, 50)
    );

    // Shark (2.0mm, high-performance MTB)
    components.push(
        createBrakeRotor('Galfer', 'Shark', 180, '6BOLT', 127, 95),
        createBrakeRotor('Galfer', 'Shark', 203, '6BOLT', 174, 105),
        createBrakeRotor('Galfer', 'Shark', 223, '6BOLT', 220, 131)
    );

    // ==========================================
    // UPSERT ALL COMPONENTS
    // ==========================================
    for (const component of components) {
        await upsertComponent(component.id, component);
    }

    console.log(`✅ Phase 1 Brake Rotors seeding complete! Added ${components.length} rotors.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

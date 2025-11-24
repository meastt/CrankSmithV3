import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
    const dataPath = path.join(process.env.HOME || '', '.gemini/antigravity/brain/63f1098d-3482-4a0a-b85c-1e6772b94e9c/data_ingestion_wheels.json');

    if (!fs.existsSync(dataPath)) {
        console.error(`Data file not found at: ${dataPath}`);
        process.exit(1);
    }

    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const wheels = JSON.parse(rawData);

    console.log(`Ingesting ${wheels.length} Wheels...`);

    for (const wheel of wheels) {
        const id = `${wheel.brand}-${wheel.model}-${wheel.size}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        const name = `${wheel.brand} ${wheel.model} ${wheel.size}`;

        // Normalize diameter
        let diameter = '700c';
        if (wheel.size === '29') diameter = '29'; // Keeping 29 distinct for now, but might need to map to 700c for road tires if cross-compatible. 
        // Actually, for consistency with tires:
        // Tires: 29 -> 29, 700c -> 700c. 
        // But 29" MTB wheels fit 700c rims (same bead seat diameter 622mm).
        // However, usually "29" implies wider MTB rims/hubs (Boost).
        // So keeping them distinct is probably safer for now to avoid putting road tires on wide MTB rims or vice versa without checking width.
        // But for 650b vs 27.5, they are also same bead seat (584mm).
        if (wheel.size === '27.5') diameter = '650b';
        if (wheel.size === '650b') diameter = '650b';
        if (wheel.size === '700c') diameter = '700c';

        const componentData = {
            id,
            type: 'Wheel',
            name,
            interfaces: JSON.stringify({
                diameter: diameter,
                brake_type: 'Disc', // All inputs are disc
                brake_mount: wheel.brake_interface, // Centerlock or 6-Bolt
                front_axle: wheel.front_axle,
                rear_axle: wheel.rear_axle,
                freehub: wheel.freehub_options // Storing array directly
            }),
            attributes: JSON.stringify({
                material: wheel.material,
                weight: wheel.weight_pair_g,
                rim_depth: wheel.rim_depth_mm,
                internal_width: wheel.internal_width_mm,
                external_width: wheel.external_width_mm
            })
        };

        const exists = await prisma.component.findUnique({ where: { id } });
        if (!exists) {
            await prisma.component.create({ data: componentData });
            console.log(`Created Wheel: ${name}`);
        } else {
            await prisma.component.update({
                where: { id },
                data: componentData
            });
            console.log(`Updated Wheel (Exists): ${name}`);
        }
    }

    console.log('Wheel ingestion finished.');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });

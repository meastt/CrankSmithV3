import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
    const dataPath = path.join(process.env.HOME || '', '.gemini/antigravity/brain/63f1098d-3482-4a0a-b85c-1e6772b94e9c/data_ingestion.json');

    if (!fs.existsSync(dataPath)) {
        console.error(`Data file not found at: ${dataPath}`);
        process.exit(1);
    }

    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const frames = JSON.parse(rawData);

    console.log(`Found ${frames.length} frames to ingest...`);

    for (const frame of frames) {
        // Generate a unique ID based on brand, model, and variant
        const id = `${frame.brand}-${frame.model}-${frame.variant}`
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');

        // Construct the name
        const name = `${frame.brand} ${frame.model} ${frame.variant}`;

        // Prepare attributes
        const attributes = {
            category: frame.category,
            material: frame.material,
            weight: frame.sizes_and_weights[0]?.weight_g || 0, // Use first size weight as default
            max_tire: frame.interfaces.max_tire_width_mm,
            sizes: frame.sizes_and_weights // Store full size/weight data if needed later, or just use it for reference
        };

        // Prepare interfaces
        const interfaces = {
            bottom_bracket_shell: frame.interfaces.bottom_bracket.replace(/ /g, '_'),
            rear_axle: frame.interfaces.rear_axle.replace(/ /g, '_'),
            seatpost_diameter: frame.interfaces.seatpost,
            brake_mount: frame.interfaces.brake_mount.replace(/ /g, '_'),
            udh: frame.interfaces.udh,
            steerer_tube: '1_1/8' // Defaulting for now as it wasn't in the JSON, but most modern are tapered 1-1/8 to 1.5
        };

        const data = {
            id,
            type: 'Frame',
            name,
            interfaces: JSON.stringify(interfaces),
            attributes: JSON.stringify(attributes)
        };

        const exists = await prisma.component.findUnique({ where: { id } });
        if (!exists) {
            await prisma.component.create({ data });
            console.log(`Created: ${name}`);
        } else {
            console.log(`Skipped (Exists): ${name}`);
        }
    }

    console.log('Ingestion finished.');
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

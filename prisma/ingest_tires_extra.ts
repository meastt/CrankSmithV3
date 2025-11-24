import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
    const dataPath = path.join(process.env.HOME || '', '.gemini/antigravity/brain/63f1098d-3482-4a0a-b85c-1e6772b94e9c/data_ingestion_tires_extra.json');

    if (!fs.existsSync(dataPath)) {
        console.error(`Data file not found at: ${dataPath}`);
        process.exit(1);
    }

    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const tires = JSON.parse(rawData);

    console.log(`Ingesting ${tires.length} Extra Tires...`);

    for (const tire of tires) {
        const id = `${tire.brand}-${tire.model}-${tire.size}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        const name = `${tire.brand} ${tire.model} ${tire.size}`;

        // Determine diameter based on size string
        let diameter = '700c';
        if (tire.size.includes('29')) diameter = '29';
        if (tire.size.includes('650')) diameter = '650b';
        if (tire.size.includes('27.5')) diameter = '650b';

        const componentData = {
            id,
            type: 'Tire',
            name,
            interfaces: JSON.stringify({
                diameter: diameter,
                width: tire.width_mm,
                tubeless: tire.tubeless
            }),
            attributes: JSON.stringify({
                size_label: tire.size,
                weight: tire.weight,
                tpi: tire.tpi,
                color: tire.color,
                purpose: tire.purpose
            })
        };

        const exists = await prisma.component.findUnique({ where: { id } });
        if (!exists) {
            await prisma.component.create({ data: componentData });
            console.log(`Created Tire: ${name}`);
        } else {
            // Update existing record if it exists, as this data might be more accurate/detailed
            await prisma.component.update({
                where: { id },
                data: componentData
            });
            console.log(`Updated Tire (Exists): ${name}`);
        }
    }

    console.log('Extra tire ingestion finished.');
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

import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
    const dataPath = path.join(process.env.HOME || '', '.gemini/antigravity/brain/63f1098d-3482-4a0a-b85c-1e6772b94e9c/data_ingestion_cockpit.json');

    if (!fs.existsSync(dataPath)) {
        console.error(`Data file not found at: ${dataPath}`);
        process.exit(1);
    }

    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const data = JSON.parse(rawData);

    // --- HANDLEBARS ---
    if (data.handlebars) {
        console.log(`Ingesting ${data.handlebars.length} Handlebars...`);
        for (const bar of data.handlebars) {
            const id = `${bar.brand}-${bar.model}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
            const name = `${bar.brand} ${bar.model}`;

            const componentData = {
                id,
                type: 'Handlebar',
                name,
                interfaces: JSON.stringify({
                    clamp_diameter: bar.clamp_diameter
                }),
                attributes: JSON.stringify({
                    material: bar.material,
                    width: bar.width,
                    weight: bar.weight_g,
                    type: bar.type
                })
            };

            const exists = await prisma.component.findUnique({ where: { id } });
            if (!exists) {
                await prisma.component.create({ data: componentData });
                console.log(`Created Handlebar: ${name}`);
            } else {
                console.log(`Skipped Handlebar (Exists): ${name}`);
            }
        }
    }

    // --- STEMS ---
    if (data.stems) {
        console.log(`Ingesting ${data.stems.length} Stems...`);
        for (const stem of data.stems) {
            const id = `${stem.brand}-${stem.model}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
            const name = `${stem.brand} ${stem.model}`;

            const componentData = {
                id,
                type: 'Stem',
                name,
                interfaces: JSON.stringify({
                    clamp_diameter: stem.clamp_diameter,
                    steerer_clamp: stem.steerer_clamp.replace('-', '_') // e.g., 1-1/8 -> 1_1/8
                }),
                attributes: JSON.stringify({
                    material: stem.material,
                    length: stem.length,
                    angle: stem.angle,
                    weight: stem.weight_g
                })
            };

            const exists = await prisma.component.findUnique({ where: { id } });
            if (!exists) {
                await prisma.component.create({ data: componentData });
                console.log(`Created Stem: ${name}`);
            } else {
                console.log(`Skipped Stem (Exists): ${name}`);
            }
        }
    }

    // --- INTEGRATED COCKPITS ---
    // Treating these as "Handlebar" type for now, but with stem attributes
    if (data.integrated) {
        console.log(`Ingesting ${data.integrated.length} Integrated Cockpits...`);
        for (const cockpit of data.integrated) {
            const id = `${cockpit.brand}-${cockpit.model}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
            const name = `${cockpit.brand} ${cockpit.model}`;

            const componentData = {
                id,
                type: 'Handlebar', // Storing as Handlebar primarily
                name,
                interfaces: JSON.stringify({
                    clamp_diameter: 'Integrated', // Special flag
                    steerer_clamp: '1_1/8' // Most integrated cockpits clamp to steerer
                }),
                attributes: JSON.stringify({
                    material: cockpit.material,
                    width: cockpit.width,
                    stem_length: cockpit.stem_length,
                    angle: cockpit.angle,
                    weight: cockpit.weight_g,
                    type: cockpit.type,
                    integrated: true
                })
            };

            const exists = await prisma.component.findUnique({ where: { id } });
            if (!exists) {
                await prisma.component.create({ data: componentData });
                console.log(`Created Integrated Cockpit: ${name}`);
            } else {
                console.log(`Skipped Integrated Cockpit (Exists): ${name}`);
            }
        }
    }

    console.log('Cockpit ingestion finished.');
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

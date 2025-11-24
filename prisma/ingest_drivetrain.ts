import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
    const dataPath = path.join(process.env.HOME || '', '.gemini/antigravity/brain/63f1098d-3482-4a0a-b85c-1e6772b94e9c/data_ingestion_drivetrain.json');

    if (!fs.existsSync(dataPath)) {
        console.error(`Data file not found at: ${dataPath}`);
        process.exit(1);
    }

    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const data = JSON.parse(rawData);

    // --- CASSETTES ---
    if (data.cassettes) {
        console.log(`Ingesting ${data.cassettes.length} Cassettes...`);
        for (const cassette of data.cassettes) {
            const id = `${cassette.brand}-${cassette.model}-${cassette.range_label}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
            const name = `${cassette.brand} ${cassette.model} ${cassette.range_label}`;

            const componentData = {
                id,
                type: 'Cassette',
                name,
                interfaces: JSON.stringify({
                    freehub_mount: cassette.freehub_mount,
                    speeds: cassette.speeds
                }),
                attributes: JSON.stringify({
                    range: cassette.range_label,
                    cog_list: cassette.cog_list,
                    weight: cassette.weight_g
                })
            };

            const exists = await prisma.component.findUnique({ where: { id } });
            if (!exists) {
                await prisma.component.create({ data: componentData });
                console.log(`Created Cassette: ${name}`);
            } else {
                await prisma.component.update({
                    where: { id },
                    data: componentData
                });
                console.log(`Updated Cassette (Exists): ${name}`);
            }
        }
    }

    // --- CRANKSETS ---
    if (data.cranksets) {
        console.log(`Ingesting ${data.cranksets.length} Cranksets...`);
        for (const crank of data.cranksets) {
            const id = `${crank.brand}-${crank.model}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
            const name = `${crank.brand} ${crank.model}`;

            const componentData = {
                id,
                type: 'Crankset',
                name,
                interfaces: JSON.stringify({
                    spindle: crank.spindle_type,
                    speeds: crank.speeds,
                    configuration: crank.configuration // 1x or 2x
                }),
                attributes: JSON.stringify({
                    lengths: crank.available_lengths_mm,
                    chainrings: crank.available_chainrings,
                    weight: crank.weight_g
                })
            };

            const exists = await prisma.component.findUnique({ where: { id } });
            if (!exists) {
                await prisma.component.create({ data: componentData });
                console.log(`Created Crankset: ${name}`);
            } else {
                await prisma.component.update({
                    where: { id },
                    data: componentData
                });
                console.log(`Updated Crankset (Exists): ${name}`);
            }
        }
    }

    console.log('Drivetrain ingestion finished.');
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

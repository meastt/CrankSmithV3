import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
    const dataPath = path.join(process.env.HOME || '', '.gemini/antigravity/brain/63f1098d-3482-4a0a-b85c-1e6772b94e9c/data_ingestion_13s_rd.json');

    if (!fs.existsSync(dataPath)) {
        console.error(`Data file not found at: ${dataPath}`);
        process.exit(1);
    }

    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const rds = JSON.parse(rawData);

    console.log(`Ingesting ${rds.length} 13-speed Rear Derailleurs...`);

    for (const rd of rds) {
        const id = `${rd.brand}-${rd.model}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        const name = `${rd.brand} ${rd.model}`;

        const componentData = {
            id,
            type: 'RearDerailleur',
            name,
            interfaces: JSON.stringify({
                protocol: rd.compatibility_protocol.replace(/ /g, '_'),
                attachment: 'Standard_Mount' // Defaulting to standard
            }),
            attributes: JSON.stringify({
                speeds: rd.speeds,
                electronic: rd.electronic,
                max_cog: rd.max_cog_teeth,
                clutch: rd.clutch,
                weight: rd.weight_g
            })
        };

        const exists = await prisma.component.findUnique({ where: { id } });
        if (!exists) {
            await prisma.component.create({ data: componentData });
            console.log(`Created Rear Derailleur: ${name}`);
        } else {
            console.log(`Skipped Rear Derailleur (Exists): ${name}`);
        }
    }

    console.log('13s RD ingestion finished.');
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

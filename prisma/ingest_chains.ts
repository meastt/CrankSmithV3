import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
    const dataPath = path.join(process.env.HOME || '', '.gemini/antigravity/brain/63f1098d-3482-4a0a-b85c-1e6772b94e9c/data_ingestion_chains.json');

    if (!fs.existsSync(dataPath)) {
        console.error(`Data file not found at: ${dataPath}`);
        process.exit(1);
    }

    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const chains = JSON.parse(rawData);

    console.log(`Ingesting ${chains.length} Chains...`);

    for (const chain of chains) {
        const id = `${chain.brand}-${chain.model}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        const name = `${chain.brand} ${chain.model}`;

        const componentData = {
            id,
            type: 'Chain',
            name,
            interfaces: JSON.stringify({
                speeds: chain.speeds, // Critical interface for compatibility
                compatibility: chain.compatibility // e.g., "Road", "MTB"
            }),
            attributes: JSON.stringify({
                weight: chain.weight_g,
                color: chain.color
            })
        };

        const exists = await prisma.component.findUnique({ where: { id } });
        if (!exists) {
            await prisma.component.create({ data: componentData });
            console.log(`Created Chain: ${name}`);
        } else {
            await prisma.component.update({
                where: { id },
                data: componentData
            });
            console.log(`Updated Chain (Exists): ${name}`);
        }
    }

    console.log('Chain ingestion finished.');
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

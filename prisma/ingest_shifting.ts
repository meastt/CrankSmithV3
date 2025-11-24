import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
    const dataPath = path.join(process.env.HOME || '', '.gemini/antigravity/brain/63f1098d-3482-4a0a-b85c-1e6772b94e9c/data_ingestion_shifting.json');

    if (!fs.existsSync(dataPath)) {
        console.error(`Data file not found at: ${dataPath}`);
        process.exit(1);
    }

    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const data = JSON.parse(rawData);

    // --- SHIFTERS ---
    if (data.shifters) {
        console.log(`Ingesting ${data.shifters.length} Shifters...`);
        for (const shifter of data.shifters) {
            const id = `${shifter.brand}-${shifter.model}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
            const name = `${shifter.brand} ${shifter.model}`;

            const componentData = {
                id,
                type: 'Shifter',
                name,
                interfaces: JSON.stringify({
                    protocol: shifter.compatibility_protocol.replace(/ /g, '_'),
                    type: shifter.type // Drop Bar vs Flat Bar
                }),
                attributes: JSON.stringify({
                    speeds: shifter.speeds,
                    electronic: shifter.electronic,
                    weight: shifter.weight_pair_g
                })
            };

            const exists = await prisma.component.findUnique({ where: { id } });
            if (!exists) {
                await prisma.component.create({ data: componentData });
                console.log(`Created Shifter: ${name}`);
            } else {
                console.log(`Skipped Shifter (Exists): ${name}`);
            }
        }
    }

    // --- REAR DERAILLEURS ---
    if (data.rear_derailleurs) {
        console.log(`Ingesting ${data.rear_derailleurs.length} Rear Derailleurs...`);
        for (const rd of data.rear_derailleurs) {
            const id = `${rd.brand}-${rd.model}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
            const name = `${rd.brand} ${rd.model}`;

            const componentData = {
                id,
                type: 'RearDerailleur',
                name,
                interfaces: JSON.stringify({
                    protocol: rd.compatibility_protocol.replace(/ /g, '_'),
                    attachment: 'Standard_Mount' // Defaulting to standard, UDH specific ones usually specify "Direct Mount" but we'll handle that via attributes or specific logic if needed
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
    }

    console.log('Shifting ingestion finished.');
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

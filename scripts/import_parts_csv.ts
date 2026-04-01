import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import { parse } from 'csv-parse';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

async function main() {
    console.log('Reading CSV file...');
    const fileContent = fs.readFileSync('cranksmith_parts_db_NEW_3_30_2026.csv', 'utf-8');

    const records: any[] = await new Promise((resolve, reject) => {
        parse(fileContent, {
            columns: true,
            skip_empty_lines: true,
        }, (err, data) => {
            if (err) reject(err);
            else resolve(data);
        });
    });

    console.log(`Parsed ${records.length} records from CSV.`);

    console.log('Wiping existing Component table...');
    // Wipe all existing components
    const deleteResult = await prisma.component.deleteMany({});
    console.log(`Deleted ${deleteResult.count} existing components.`);

    console.log('Preparing new components for insertion...');
    const newComponents = records.map(record => {
        // Parse builderEligible exactly as boolean
        const isEligible = String(record.builderEligible).trim().toLowerCase() === 'true';

        return {
            id: record.id && record.id.trim() !== '' ? record.id : randomUUID(),
            type: record.type,
            name: record.name,
            discipline: record.discipline || 'multi',
            builderEligible: isEligible,
            interfaces: record.interfaces || '{}',
            attributes: record.attributes || '{}'
        };
    });

    console.log(`Batch inserting ${newComponents.length} components...`);
    
    // Use createMany to insert all mapped rows
    const createResult = await prisma.component.createMany({
        data: newComponents,
        skipDuplicates: true
    });

    console.log(`Successfully inserted ${createResult.count} components!`);
}

main()
    .catch(e => {
        console.error('Error during migration:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

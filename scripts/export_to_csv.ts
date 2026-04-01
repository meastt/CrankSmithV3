import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function main() {
    console.log('Fetching components from database...');
    const components = await prisma.component.findMany();
    
    console.log(`Found ${components.length} components.`);

    // CSV Header
    const headers = ['id', 'type', 'name', 'discipline', 'builderEligible', 'interfaces', 'attributes'];
    let csvContent = headers.join(',') + '\n';

    // Build CSV Rows
    for (const comp of components) {
        const row = [
            comp.id,
            comp.type,
            comp.name,
            comp.discipline,
            comp.builderEligible ? 'true' : 'false',
            // Carefully escape JSON strings for CSV format (wrap in quotes, double up internal quotes)
            comp.interfaces ? `"${comp.interfaces.replace(/"/g, '""')}"` : '""',
            comp.attributes ? `"${comp.attributes.replace(/"/g, '""')}"` : '""'
        ];
        
        // Escape standard fields if they happen to contain commas
        const escapedRow = row.map((field, idx) => {
            if (idx < 5 && String(field).includes(',')) {
                return `"${field}"`;
            }
            return field;
        });

        csvContent += escapedRow.join(',') + '\n';
    }

    const filename = 'cranksmith_parts_export.csv';
    fs.writeFileSync(filename, csvContent);
    console.log(`\nSuccessfully exported to ${filename}!`);
    console.log('You can now open this file in Excel, Numbers, or upload it directly to Google Sheets.');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

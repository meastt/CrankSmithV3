/**
 * Export all parts from database organized by brand
 * Run with: npx tsx prisma/export-parts-inventory.ts
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

function getBrand(name: string): string {
    if (name.startsWith('Santa Cruz')) return 'Santa Cruz';
    if (name.startsWith('S-Works')) return 'Specialized';
    if (name.startsWith('Wheels Manufacturing')) return 'Wheels Manufacturing';
    if (name.startsWith('Chris King')) return 'Chris King';
    if (name.startsWith('White Industries')) return 'White Industries';
    if (name.startsWith('Praxis Works')) return 'Praxis Works';
    if (name.startsWith('Wolf Tooth')) return 'Wolf Tooth';
    if (name.startsWith('Race Face')) return 'Race Face';
    if (name.startsWith('e*thirteen')) return 'e*thirteen';
    if (name.startsWith('Hope Tech')) return 'Hope';
    if (name.toLowerCase().startsWith('cerv')) return 'Cervelo';
    return name.split(' ')[0];
}

async function main() {
    const components = await prisma.component.findMany({
        orderBy: [{ type: 'asc' }, { name: 'asc' }]
    });

    // Group by type, then by brand
    const byType: Record<string, Record<string, string[]>> = {};

    for (const c of components) {
        const type = c.type;
        const brand = getBrand(c.name);

        if (!byType[type]) byType[type] = {};
        if (!byType[type][brand]) byType[type][brand] = [];
        byType[type][brand].push(c.name);
    }

    // Build markdown output
    let output = '# CrankSmith Parts Database\n\n';
    output += `**Generated:** ${new Date().toLocaleDateString()}\n\n`;
    output += '---\n\n';

    // Summary first
    output += '## Summary\n\n';
    output += '| Component Type | Count |\n';
    output += '|----------------|-------|\n';
    for (const type of Object.keys(byType).sort()) {
        const count = Object.values(byType[type]).flat().length;
        output += `| ${type} | ${count} |\n`;
    }
    output += `| **TOTAL** | **${components.length}** |\n`;
    output += '\n---\n\n';

    // Detailed listing by type and brand
    for (const type of Object.keys(byType).sort()) {
        output += `## ${type}\n\n`;
        const brands = byType[type];
        const brandNames = Object.keys(brands).sort();

        for (const brand of brandNames) {
            output += `### ${brand}\n`;
            for (const name of brands[brand].sort()) {
                output += `- ${name}\n`;
            }
            output += '\n';
        }
    }

    // Brands overview
    output += '---\n\n## All Brands\n\n';
    const allBrands = new Set<string>();
    for (const type of Object.keys(byType)) {
        for (const brand of Object.keys(byType[type])) {
            allBrands.add(brand);
        }
    }
    const sortedBrands = Array.from(allBrands).sort();
    output += sortedBrands.map(b => `- ${b}`).join('\n');
    output += '\n';

    // Write to file
    const outputPath = 'PARTS_INVENTORY.md';
    fs.writeFileSync(outputPath, output);
    console.log(`Parts inventory exported to ${outputPath}`);
    console.log(`Total components: ${components.length}`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());


import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

const COMPONENT_TYPES = [
    'Frame', 'Fork', 'Wheel', 'Tire',
    'BottomBracket', 'Crankset', 'Cassette', 'RearDerailleur', 'Shifter', 'Chain',
    'BrakeCaliper', 'BrakeRotor',
    'Stem', 'Handlebar', 'Seatpost'
];

async function audit() {
    const auditResults: Record<string, any> = {};

    console.log('Starting Component Audit...');

    for (const type of COMPONENT_TYPES) {
        console.log(`Sampling ${type}...`);
        // Get up to 5 items of each type to see variety
        const items = await prisma.component.findMany({
            where: { type },
            take: 5
        });

        auditResults[type] = items.map(item => ({
            id: item.id,
            name: item.name,
            raw_attributes: JSON.parse(item.attributes as string),
            raw_interfaces: JSON.parse(item.interfaces as string)
        }));
    }

    // Write to a file for analysis
    fs.writeFileSync('spec_audit.json', JSON.stringify(auditResults, null, 2));
    console.log('Audit complete. Results written to spec_audit.json');
}

audit()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });

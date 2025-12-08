import { PrismaClient } from '@prisma/client';
import { normalizeComponent } from '../src/lib/normalization';

const prisma = new PrismaClient();

// Replicate the filtering logic from PartSelector.tsx
const getTireType = (c: any): string => {
    return (c.interfaces?.tire_type || c.attributes?.tire_type ||
            c.attributes?.purpose || c.specs?.tire_type || '').toUpperCase();
};

const getTireWidth = (c: any): number => {
    const width = c.widthMM || c.specs?.width || c.interfaces?.width || c.attributes?.width || 0;
    if (typeof width === 'number') return width;
    return parseFloat(String(width).replace(/[^0-9.]/g, '')) || 0;
};

async function main() {
    console.log('Testing tire filtering for Crux build (Gravel, 47mm clearance)...\n');

    const frameCategory = 'GRAVEL';
    const maxTireWidth = 47;

    // Get all tires
    const rawTires = await prisma.component.findMany({
        where: { type: 'Tire' }
    });

    // Normalize them
    const tires = rawTires.map(t => normalizeComponent(t));

    console.log(`Total tires in database: ${tires.length}\n`);

    // Apply gravel filtering
    const gravelFiltered = tires.filter(c => {
        const type = getTireType(c);
        const width = getTireWidth(c);

        // Explicit gravel/road type match
        if (type === 'GRAVEL' || type === 'ROAD') return true;

        // Width-based: show tires 28-55mm for gravel
        if (width >= 28 && width <= 55) return true;

        // Also respect max tire clearance if available
        if (maxTireWidth > 0 && width > 0 && width <= maxTireWidth) return true;

        return false;
    });

    console.log(`After gravel filtering: ${gravelFiltered.length} tires\n`);

    if (gravelFiltered.length === 0) {
        console.log('❌ NO TIRES PASS THE FILTER!');
        console.log('\nDebugging: Checking why tires are being filtered out...\n');

        // Check first 10 tires to see why they fail
        tires.slice(0, 10).forEach(tire => {
            const type = getTireType(tire);
            const width = getTireWidth(tire);

            console.log(`\nTire: ${tire.name}`);
            console.log(`  Type: "${type}" (GRAVEL/ROAD? ${type === 'GRAVEL' || type === 'ROAD'})`);
            console.log(`  Width: ${width}mm (28-55? ${width >= 28 && width <= 55}) (<= 47? ${width <= maxTireWidth})`);
            console.log(`  Passes filter? ${(type === 'GRAVEL' || type === 'ROAD') || (width >= 28 && width <= 55) || (width > 0 && width <= maxTireWidth)}`);
        });
    } else {
        console.log('✓ Tires found! Sample:');
        gravelFiltered.slice(0, 5).forEach(tire => {
            const type = getTireType(tire);
            const width = getTireWidth(tire);
            console.log(`  - ${tire.name} (${type}, ${width}mm)`);
        });

        // Also check if there are tires under 47mm
        const under47 = gravelFiltered.filter(t => getTireWidth(t) <= 47);
        console.log(`\nTires under 47mm clearance: ${under47.length}`);
        if (under47.length > 0) {
            console.log('Sample under 47mm:');
            under47.slice(0, 5).forEach(tire => {
                const width = getTireWidth(tire);
                console.log(`  - ${tire.name} (${width}mm)`);
            });
        }
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());

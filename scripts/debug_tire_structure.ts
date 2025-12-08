import { PrismaClient } from '@prisma/client';
import { normalizeComponent } from '../src/lib/normalization';

const prisma = new PrismaClient();

async function main() {
    console.log('Analyzing tire data structure...\n');

    // Get a problematic tire
    const problemTire = await prisma.component.findFirst({
        where: {
            type: 'Tire',
            name: { contains: 'Bontrager' }
        }
    });

    if (problemTire) {
        console.log('PROBLEMATIC TIRE:');
        console.log('Name:', problemTire.name);
        console.log('\nRaw interfaces:', problemTire.interfaces);
        console.log('\nRaw attributes:', problemTire.attributes);

        const normalized = normalizeComponent(problemTire);
        console.log('\nNormalized component:');
        console.log('- widthMM:', (normalized as any).widthMM);
        console.log('- specs.width:', normalized.specs?.width);
        console.log('- interfaces.width:', (normalized.interfaces as any)?.width);
        console.log('- attributes.width:', (normalized.attributes as any)?.width);
        console.log('- interfaces.tire_type:', (normalized.interfaces as any)?.tire_type);
        console.log('- attributes.tire_type:', (normalized.attributes as any)?.tire_type);
    }

    // Get a good tire for comparison
    const goodTire = await prisma.component.findFirst({
        where: {
            type: 'Tire',
            name: { contains: 'Continental GP5000' }
        }
    });

    if (goodTire) {
        console.log('\n\n==========================================');
        console.log('GOOD TIRE (for comparison):');
        console.log('Name:', goodTire.name);
        console.log('\nRaw interfaces:', goodTire.interfaces);
        console.log('\nRaw attributes:', goodTire.attributes);

        const normalized = normalizeComponent(goodTire);
        console.log('\nNormalized component:');
        console.log('- widthMM:', (normalized as any).widthMM);
        console.log('- specs.width:', normalized.specs?.width);
        console.log('- interfaces.width:', (normalized.interfaces as any)?.width);
        console.log('- attributes.width:', (normalized.attributes as any)?.width);
        console.log('- interfaces.tire_type:', (normalized.interfaces as any)?.tire_type);
        console.log('- attributes.tire_type:', (normalized.attributes as any)?.tire_type);
    }

    // Count how many tires have proper width data
    console.log('\n\n==========================================');
    console.log('CHECKING ALL TIRES:\n');

    const allTires = await prisma.component.findMany({
        where: { type: 'Tire' }
    });

    let goodCount = 0;
    let badCount = 0;
    const badTires: string[] = [];

    allTires.forEach(tire => {
        const normalized = normalizeComponent(tire);
        const interfaces = JSON.parse(tire.interfaces as string);
        const attributes = JSON.parse(tire.attributes as string);

        const hasWidth = attributes.width || interfaces.width || normalized.specs?.width;
        const hasType = interfaces.tire_type || attributes.tire_type;

        if (hasWidth && hasType) {
            goodCount++;
        } else {
            badCount++;
            badTires.push(tire.name);
        }
    });

    console.log(`Tires with good data: ${goodCount}`);
    console.log(`Tires with missing data: ${badCount}`);

    if (badTires.length > 0 && badTires.length <= 20) {
        console.log('\nTires missing width or type:');
        badTires.forEach(name => console.log(`  - ${name}`));
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());

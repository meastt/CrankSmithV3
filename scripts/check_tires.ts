import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Checking tire count in database...\n');

    const tireCount = await prisma.component.count({
        where: { type: 'Tire' }
    });

    console.log(`Total tires in database: ${tireCount}`);

    if (tireCount > 0) {
        console.log('\nSample tires:');
        const sampleTires = await prisma.component.findMany({
            where: { type: 'Tire' },
            take: 5
        });

        sampleTires.forEach(tire => {
            const interfaces = JSON.parse(tire.interfaces as string);
            const attributes = JSON.parse(tire.attributes as string);
            console.log(`- ${tire.name}`);
            console.log(`  Width: ${attributes.width}mm`);
            console.log(`  Type: ${interfaces.tire_type}`);
            console.log(`  Diameter: ${interfaces.diameter}`);
            console.log('');
        });
    } else {
        console.log('\n❌ No tires found in database!');
        console.log('\nRun this command to seed tires:');
        console.log('  npx tsx prisma/seed_phase2_tires.ts');
    }

    console.log('\nAll component types and counts:');
    const types = await prisma.component.groupBy({
        by: ['type'],
        _count: true
    });

    types.forEach(t => {
        console.log(`  ${t.type}: ${t._count}`);
    });
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());


import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const wheels = await prisma.component.findMany({
        where: {
            type: 'Wheel',
            // Search by weight in attributes is hard because it's JSON.
            // So we fetch all wheels and filter in JS.
        }
    });

    console.log('Total Wheels:', wheels.length);
    const targetWheels = wheels.filter(w => {
        const attrs = w.attributes ? JSON.parse(w.attributes as string) : {};
        const weight = attrs.weight || 0;
        return weight >= 1390 && weight <= 1410;
    });

    console.log('Found Wheels ~1400g:', targetWheels.length);
    for (const wheel of targetWheels) {
        console.log('------------------------------------------------');
        console.log(`ID: ${wheel.id}`);
        console.log(`Name: ${wheel.name}`);
        console.log(`Type: ${wheel.type}`);
        console.log(`Attributes (Raw): ${wheel.attributes}`);
        console.log(`Interfaces (Raw): ${wheel.interfaces}`);

        // Simulate route.ts logic
        const attributes = wheel.attributes ? JSON.parse(wheel.attributes as string) : {};
        const flattened = { ...wheel, ...attributes };
        const weightGrams = flattened.weightGrams || flattened.weight || 0;
        console.log(`Calculated weightGrams: ${weightGrams}`);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());

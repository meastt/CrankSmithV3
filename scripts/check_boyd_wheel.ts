import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const boydWheels = await prisma.component.findMany({
        where: {
            type: 'Wheel',
            name: { contains: 'Boyd', mode: 'insensitive' }
        }
    });

    console.log(`Found ${boydWheels.length} Boyd wheels:\n`);

    boydWheels.forEach(wheel => {
        console.log(`ID: ${wheel.id}`);
        console.log(`Name: ${wheel.name}`);
        console.log(`Interfaces: ${wheel.interfaces}`);
        console.log(`Attributes: ${wheel.attributes}`);
        console.log('---\n');
    });
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());

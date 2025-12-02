import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const counts = await prisma.component.groupBy({
        by: ['type'],
        _count: {
            id: true
        }
    });

    console.log('Component Counts:');
    counts.forEach(c => {
        console.log(`${c.type}: ${c._count.id}`);
    });
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

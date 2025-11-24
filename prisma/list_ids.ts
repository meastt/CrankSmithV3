import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const components = await prisma.component.findMany({
        select: { id: true, type: true, name: true }
    });

    console.log("--- Component IDs ---");
    components.forEach(c => {
        console.log(`[${c.type}] ${c.id} (${c.name})`);
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

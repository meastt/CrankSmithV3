
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function inspect() {
    console.log('--- FRAME: Specialized Crux ---');
    const frames = await prisma.component.findMany({
        where: {
            type: 'Frame',
            name: { contains: 'Crux', mode: 'insensitive' }
        }
    });

    frames.forEach(f => {
        console.log(`ID: ${f.id}`);
        console.log(`Name: ${f.name}`);
        console.log(`Interfaces: ${f.interfaces}`);
        console.log(`Attributes: ${f.attributes}`);
        console.log('-----------------------------------');
    });

    console.log('\n--- ALL BOTTOM BRACKETS ---');
    const bbs = await prisma.component.findMany({
        where: { type: 'BottomBracket' }
    });

    bbs.forEach(bb => {
        console.log(`ID: ${bb.id}`);
        console.log(`Name: ${bb.name}`);
        console.log(`Interfaces: ${bb.interfaces}`);
        console.log(`Attributes: ${bb.attributes}`);
        console.log('-----------------------------------');
    });
}

inspect()
    .catch(console.error)
    .finally(() => prisma.$disconnect());

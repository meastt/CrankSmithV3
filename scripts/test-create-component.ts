import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Testing component creation...');
    try {
        const component = await prisma.component.create({
            data: {
                type: 'Frame',
                name: 'Test Script Component',
                interfaces: JSON.stringify({}),
                attributes: JSON.stringify({ price: 100, weight_g: 1000 }),
            },
        });
        console.log('Successfully created component:', component);
    } catch (error) {
        console.error('Error creating component:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();

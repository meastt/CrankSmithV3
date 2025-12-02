import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting deduplication process...');

    // 1. Group by name and type to find duplicates
    const duplicates = await prisma.component.groupBy({
        by: ['name', 'type'],
        _count: {
            id: true
        },
        having: {
            id: {
                _count: {
                    gt: 1
                }
            }
        }
    });

    console.log(`Found ${duplicates.length} sets of duplicates.`);

    let removedCount = 0;

    for (const group of duplicates) {
        // 2. For each duplicate group, fetch all records
        const records = await prisma.component.findMany({
            where: {
                name: group.name,
                type: group.type
            },
            orderBy: {
                updatedAt: 'desc' // Keep the most recently updated one
            }
        });

        // 3. Keep the first one (most recent), delete the rest
        const [keep, ...remove] = records;

        if (remove.length > 0) {
            const idsToRemove = remove.map(r => r.id);
            await prisma.component.deleteMany({
                where: {
                    id: {
                        in: idsToRemove
                    }
                }
            });
            console.log(`Kept "${keep.name}" (${keep.id}), removed ${remove.length} duplicates.`);
            removedCount += remove.length;
        }
    }

    console.log(`Deduplication complete. Removed ${removedCount} duplicate records.`);
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

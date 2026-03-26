import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const counts = await prisma.component.groupBy({
    by: ['type'],
    _count: { _all: true },
    orderBy: { type: 'asc' }
  });

  if (counts.length === 0) {
    console.warn('⚠️ Component table is reachable but empty. Run seed scripts to populate inventory.');
    return;
  }

  console.log('Component counts by type:');
  for (const row of counts) {
    console.log(`${row.type}: ${row._count._all}`);
  }
}

main()
  .catch((error) => {
    console.error('Failed to query component counts.');
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

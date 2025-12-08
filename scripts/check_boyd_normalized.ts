import { PrismaClient } from '@prisma/client';
import { normalizeComponent } from '../src/lib/normalization';

const prisma = new PrismaClient();

async function main() {
    const boydWheel = await prisma.component.findFirst({
        where: {
            type: 'Wheel',
            name: { contains: 'Boyd Altamont', mode: 'insensitive' }
        }
    });

    if (!boydWheel) {
        console.log('Boyd wheel not found');
        return;
    }

    console.log('RAW Boyd Wheel:');
    console.log(`  ID: ${boydWheel.id}`);
    console.log(`  Name: ${boydWheel.name}`);
    console.log(`  Interfaces: ${boydWheel.interfaces}`);
    console.log(`  Attributes: ${boydWheel.attributes}`);

    const normalized = normalizeComponent(boydWheel);

    console.log('\nNORMALIZED Boyd Wheel:');
    console.log(`  ID: ${normalized.id}`);
    console.log(`  Name: ${normalized.name}`);
    console.log(`  specs.position: ${normalized.specs?.position}`);
    console.log(`  specs.front_axle: ${normalized.specs?.front_axle}`);
    console.log(`  specs.rear_axle: ${normalized.specs?.rear_axle}`);
    console.log(`  specs.brake_interface: ${normalized.specs?.brake_interface}`);
    console.log(`  specs.freehub_body: ${normalized.specs?.freehub_body}`);
    console.log(`  interfaces.axle: ${(normalized.interfaces as any)?.axle}`);
    console.log(`  interfaces.brake: ${(normalized.interfaces as any)?.brake}`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());

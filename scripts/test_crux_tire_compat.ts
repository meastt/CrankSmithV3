import { PrismaClient } from '@prisma/client';
import { normalizeComponent } from '../src/lib/normalization';
import { Validator } from '../src/lib/validation';

const prisma = new PrismaClient();

async function main() {
    console.log('Testing Crux + Boyd Aftermath + Tire compatibility...\n');

    // Find the Crux frame
    const cruxFrame = await prisma.component.findFirst({
        where: {
            type: 'Frame',
            name: { contains: 'Crux', mode: 'insensitive' }
        }
    });

    if (!cruxFrame) {
        console.log('❌ Crux frame not found in database');
        return;
    }

    console.log(`Found frame: ${cruxFrame.name}`);

    // Find Boyd Aftermath wheels
    const boydWheel = await prisma.component.findFirst({
        where: {
            type: 'Wheel',
            name: { contains: 'Boyd', mode: 'insensitive' }
        }
    });

    if (!boydWheel) {
        console.log('❌ Boyd wheel not found in database');
        return;
    }

    console.log(`Found wheel: ${boydWheel.name}\n`);

    // Normalize
    const frame = normalizeComponent(cruxFrame);
    const wheel = normalizeComponent(boydWheel);

    // Create wheel pair
    const wheelFront = { ...wheel, id: `${wheel.id}-F`, position: 'FRONT', interfaces: { ...wheel.interfaces, position: 'FRONT' } };
    const wheelRear = { ...wheel, id: `${wheel.id}-R`, position: 'REAR', interfaces: { ...wheel.interfaces, position: 'REAR' } };

    // Get a sample tire
    const sampleTire = await prisma.component.findFirst({
        where: {
            type: 'Tire',
            name: { contains: 'Continental GP5000', mode: 'insensitive' }
        }
    });

    if (!sampleTire) {
        console.log('❌ Sample tire not found');
        return;
    }

    const tire = normalizeComponent(sampleTire);
    console.log(`Testing tire: ${tire.name}`);
    console.log(`  Width: ${tire.specs?.width || tire.attributes?.width || 'unknown'}`);
    console.log(`  Frame max tire: ${frame.specs?.max_tire_width}\n`);

    // Build the test data
    const buildData = {
        frame: frame as any,
        fork: undefined,
        wheels: [wheelFront, wheelRear] as any[],
        tires: [tire, tire] as any[],
        bottomBracket: undefined,
        crankset: undefined,
        cassette: undefined,
        rearDerailleur: undefined,
        shifter: undefined,
        brakes: {
            levers: undefined,
            calipers: [],
            rotors: []
        },
        cockpit: {
            stem: undefined,
            handlebar: undefined,
            seatpost: undefined
        }
    };

    console.log('Running validation...');
    const result = Validator.validateBuild(buildData);

    console.log(`\nCompatible: ${result.compatible}`);
    console.log(`Issues (${result.issues.length}):`);

    if (result.issues.length === 0) {
        console.log('  ✓ No issues found!');
    } else {
        result.issues.forEach(issue => {
            const emoji = issue.severity === 'ERROR' ? '❌' : issue.severity === 'WARNING' ? '⚠️' : 'ℹ️';
            console.log(`  ${emoji} [${issue.severity}] ${issue.category}: ${issue.message}`);
        });
    }

    // Now test multiple tires to see which ones fail
    console.log('\n\n==========================================');
    console.log('Testing multiple tires...\n');

    const allTires = await prisma.component.findMany({
        where: { type: 'Tire' },
        take: 20
    });

    const normalizedTires = allTires.map(t => normalizeComponent(t));

    let compatibleCount = 0;
    let incompatibleCount = 0;

    normalizedTires.forEach(tire => {
        const testBuildData = {
            ...buildData,
            tires: [tire, tire] as any[]
        };

        const testResult = Validator.validateBuild(testBuildData);

        if (testResult.compatible) {
            compatibleCount++;
        } else {
            incompatibleCount++;
            console.log(`❌ ${tire.name}`);
            testResult.issues
                .filter(i => i.severity === 'ERROR')
                .forEach(issue => {
                    console.log(`     ${issue.message}`);
                });
        }
    });

    console.log(`\nResults: ${compatibleCount} compatible, ${incompatibleCount} incompatible (out of ${normalizedTires.length} tested)`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());

import { execSync } from 'child_process';

const scripts = [
    'prisma/seed.ts',
    'prisma/seed_phase1_forks.ts',
    'prisma/seed_phase1_brakecalipers.ts',
    'prisma/seed_phase1_brakerotors.ts',
    'prisma/seed_phase1_seatposts.ts',
    'prisma/seed_phase2_frames.ts',
    'prisma/seed_phase2_wheels.ts',
    'prisma/seed_phase2_tires.ts',
    'prisma/seed_phase2_drivetrain.ts',
    'prisma/ingest-missing-parts.ts'
];

console.log('🚀 Starting Master Seed Sequence...');

for (const script of scripts) {
    console.log(`\n---------------------------------------------------------`);
    console.log(`▶️ Running: ${script}`);
    console.log(`---------------------------------------------------------`);

    try {
        execSync(`npx tsx ${script}`, { stdio: 'inherit' });
        console.log(`✅ Completed: ${script}`);
    } catch (error) {
        console.error(`❌ Failed: ${script}`);
        console.error(error);
        process.exit(1);
    }
}

console.log(`\n🎉 All seed scripts completed successfully!`);

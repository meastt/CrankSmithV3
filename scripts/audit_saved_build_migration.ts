import { PrismaClient } from '@prisma/client';
import { assessBuildForBuilderMigration } from '../src/lib/buildMigration';

type Summary = {
    total: number;
    gravelCompatible: number;
    legacyNonGravel: number;
    invalidPayload: number;
    topViolations: Array<{ violation: string; count: number }>;
};

function buildSummary(rows: Array<{ parts: string }>): Summary {
    const violationCounts = new Map<string, number>();
    let gravelCompatible = 0;
    let legacyNonGravel = 0;
    let invalidPayload = 0;

    for (const row of rows) {
        const assessment = assessBuildForBuilderMigration(row.parts);
        if (assessment.status === 'gravel_compatible') gravelCompatible += 1;
        if (assessment.status === 'legacy_non_gravel') legacyNonGravel += 1;
        if (assessment.status === 'invalid_payload') invalidPayload += 1;

        for (const violation of assessment.violations) {
            violationCounts.set(violation, (violationCounts.get(violation) ?? 0) + 1);
        }
    }

    const topViolations = [...violationCounts.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([violation, count]) => ({ violation, count }));

    return {
        total: rows.length,
        gravelCompatible,
        legacyNonGravel,
        invalidPayload,
        topViolations,
    };
}

async function main() {
    const prisma = new PrismaClient();
    const outputJson = process.argv.includes('--json');

    try {
        const rows = await prisma.savedBuild.findMany({
            select: { parts: true },
        });
        const summary = buildSummary(rows);

        if (outputJson) {
            console.log(JSON.stringify(summary, null, 2));
            return;
        }

        console.log('Saved Build Migration Audit');
        console.log('===========================');
        console.log(`Total builds: ${summary.total}`);
        console.log(`Gravel compatible: ${summary.gravelCompatible}`);
        console.log(`Legacy non-gravel: ${summary.legacyNonGravel}`);
        console.log(`Invalid payload: ${summary.invalidPayload}`);
        if (summary.topViolations.length > 0) {
            console.log('\nTop violations:');
            for (const row of summary.topViolations) {
                console.log(`- ${row.violation}: ${row.count}`);
            }
        }
    } finally {
        await prisma.$disconnect();
    }
}

main().catch((error) => {
    console.error('audit_saved_build_migration failed:', error);
    process.exit(1);
});

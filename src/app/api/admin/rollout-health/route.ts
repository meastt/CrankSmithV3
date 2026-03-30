import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';
import { assessBuildForBuilderMigration } from '@/lib/buildMigration';
import { isGravelBuilderEnabled } from '@/lib/featureFlags';

const prisma = new PrismaClient();

function isAdmin(userId: string): boolean {
    const adminIds = (process.env.ADMIN_USER_IDS || '').split(',').map((id) => id.trim()).filter(Boolean);
    return adminIds.includes(userId);
}

export async function GET() {
    const { userId } = await auth();
    if (!userId || !isAdmin(userId)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const builds = await prisma.savedBuild.findMany({
            select: { parts: true },
        });

        let gravelCompatible = 0;
        let legacyNonGravel = 0;
        let invalidPayload = 0;

        for (const build of builds) {
            const assessment = assessBuildForBuilderMigration(build.parts);
            if (assessment.status === 'gravel_compatible') gravelCompatible += 1;
            if (assessment.status === 'legacy_non_gravel') legacyNonGravel += 1;
            if (assessment.status === 'invalid_payload') invalidPayload += 1;
        }

        return NextResponse.json({
            timestamp: new Date().toISOString(),
            builderFeatureEnabled: isGravelBuilderEnabled(),
            totals: {
                totalBuilds: builds.length,
                gravelCompatible,
                legacyNonGravel,
                invalidPayload,
            },
        });
    } catch (error) {
        console.error('[ROLLOUT_HEALTH_GET]', error);
        return NextResponse.json({ error: 'Failed to compute rollout health' }, { status: 500 });
    }
}

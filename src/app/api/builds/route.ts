import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const { userId } = await auth();
        const user = await currentUser();

        if (!userId || !user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await request.json();
        const { name, parts } = body;

        if (!name || !parts) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        // Clean up parts data - only save essential info to avoid circular refs
        const cleanedParts: Record<string, { id: string; name: string; type: string } | null> = {};
        for (const [key, value] of Object.entries(parts)) {
            if (value && typeof value === 'object') {
                const part = value as { id?: string; name?: string; type?: string };
                cleanedParts[key] = part.id ? {
                    id: part.id,
                    name: part.name || '',
                    type: part.type || key
                } : null;
            } else {
                cleanedParts[key] = null;
            }
        }

        // Ensure user exists in our DB
        // We use upsert to create the user if they don't exist yet (first time saving)
        // We use the Clerk ID as the primary key
        const email = user.emailAddresses[0]?.emailAddress || "no-email";

        await prisma.user.upsert({
            where: { id: userId },
            update: { email },
            create: {
                id: userId,
                email,
            }
        });

        const build = await prisma.savedBuild.create({
            data: {
                name,
                parts: JSON.stringify(cleanedParts),
                userId
            }
        });

        return NextResponse.json(build);
    } catch (error) {
        console.error("[BUILDS_POST]", error);
        // Return more detailed error for debugging
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return new NextResponse(`Internal Error: ${errorMessage}`, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const builds = await prisma.savedBuild.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(builds);
    } catch (error) {
        console.error("[BUILDS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { userId } = await auth();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!id) {
            return new NextResponse("Missing build ID", { status: 400 });
        }

        // Verify ownership
        const build = await prisma.savedBuild.findUnique({
            where: { id }
        });

        if (!build || build.userId !== userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        await prisma.savedBuild.delete({
            where: { id }
        });

        return new NextResponse("Deleted", { status: 200 });
    } catch (error) {
        console.error("[BUILDS_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

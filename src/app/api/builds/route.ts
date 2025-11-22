import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, parts } = await request.json();

    if (!name || !parts) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const savedBuild = await prisma.savedBuild.create({
            data: {
                name,
                parts: JSON.stringify(parts),
                userId: user.id,
            },
        });

        return NextResponse.json(savedBuild);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save build' }, { status: 500 });
    }
}

export async function GET(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const builds = await prisma.savedBuild.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' },
        });

        // Parse parts JSON back to object
        const parsedBuilds = builds.map(build => ({
            ...build,
            parts: JSON.parse(build.parts),
        }));

        return NextResponse.json(parsedBuilds);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch builds' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'Missing build ID' }, { status: 400 });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Verify ownership before deleting
        const build = await prisma.savedBuild.findUnique({
            where: { id },
        });

        if (!build) {
            return NextResponse.json({ error: 'Build not found' }, { status: 404 });
        }

        if (build.userId !== user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await prisma.savedBuild.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete build' }, { status: 500 });
    }
}

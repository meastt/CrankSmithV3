import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    try {
        const body = await request.json();
        const { type, name, interfaces, attributes } = body;

        const component = await prisma.component.update({
            where: { id },
            data: {
                type,
                name,
                interfaces: JSON.stringify(interfaces),
                attributes: JSON.stringify(attributes),
            },
        });

        return NextResponse.json(component);
    } catch (error) {
        console.error('Error updating component:', error);
        return NextResponse.json({ error: 'Failed to update component' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    try {
        await prisma.component.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting component:', error);
        return NextResponse.json({ error: 'Failed to delete component' }, { status: 500 });
    }
}

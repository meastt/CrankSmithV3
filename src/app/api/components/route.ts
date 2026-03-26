import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Component } from '@/lib/types/compatibility';
import { normalizeComponent } from '@/lib/normalization';
import { auth } from '@clerk/nextjs/server';

function isAdmin(userId: string): boolean {
    const adminIds = (process.env.ADMIN_USER_IDS || '').split(',').map(id => id.trim()).filter(Boolean);
    return adminIds.includes(userId);
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    try {
        const components = await prisma.component.findMany({
            where: type ? { type } : undefined,
        });

        // Parse JSON and map to new structure
        const parsedComponents: Component[] = components.map(c => normalizeComponent(c));

        return NextResponse.json(parsedComponents);
    } catch (error) {
        console.error('Error fetching components:', error);
        return NextResponse.json({ error: 'Failed to fetch components' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const { userId } = await auth();

    if (!userId || !isAdmin(userId)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        console.log('Received POST request body:', body);
        const { type, name, interfaces, attributes } = body;

        console.log('Creating component with:', { type, name });

        const component = await prisma.component.create({
            data: {
                type,
                name,
                interfaces: JSON.stringify(interfaces),
                attributes: JSON.stringify(attributes),
            },
        });

        console.log('Component created successfully:', component.id);
        return NextResponse.json(component);
    } catch (error) {
        console.error('Error creating component:', error);
        return NextResponse.json({ error: 'Failed to create component' }, { status: 500 });
    }
}

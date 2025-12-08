import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Component } from '@/lib/types/compatibility';
import { normalizeComponent } from '@/lib/normalization';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

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
    const session = await getServerSession(authOptions);

    // TODO: Strict Admin Check
    // For now, we allow any authenticated user to create parts to facilitate testing
    // In production: if (!session || session.user.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!session) {
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

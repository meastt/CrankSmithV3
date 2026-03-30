import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Component } from '@/lib/types/compatibility';
import { normalizeComponent } from '@/lib/normalization';
import { auth } from '@clerk/nextjs/server';
import {
    deriveDisciplineFromAttributes,
    normalizeDiscipline,
    parseDisciplineTags,
    validateBuilderEligibility
} from '@/lib/discipline';
import { buildComponentWhereClause } from '@/lib/componentFilters';

function isAdmin(userId: string): boolean {
    const adminIds = (process.env.ADMIN_USER_IDS || '').split(',').map(id => id.trim()).filter(Boolean);
    return adminIds.includes(userId);
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const context = searchParams.get('context');
    const discipline = searchParams.get('discipline');
    const builderEligible = searchParams.get('builderEligible');

    try {
        const componentModel: any = prisma.component;
        const components = await componentModel.findMany({
            where: buildComponentWhereClause({ type, context, discipline, builderEligible }),
        });

        // Parse JSON and map to new structure
        const parsedComponents: Component[] = components.map((c: any) => normalizeComponent(c));

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

        const derivedDiscipline = deriveDisciplineFromAttributes(attributes);
        const discipline = normalizeDiscipline(body.discipline || derivedDiscipline || 'multi');
        const disciplineTags = parseDisciplineTags(body.disciplineTags);
        const builderEligible = Boolean(body.builderEligible ?? (discipline === 'gravel'));

        const eligibilityCheck = validateBuilderEligibility(discipline, disciplineTags, builderEligible);
        if (!eligibilityCheck.valid) {
            return NextResponse.json(
                { error: eligibilityCheck.message || 'Invalid builder eligibility combination' },
                { status: 400 }
            );
        }

        console.log('Creating component with:', { type, name });

        const componentModel: any = prisma.component;
        const component = await componentModel.create({
            data: {
                type,
                name,
                discipline,
                disciplineTags: disciplineTags.length > 0 ? JSON.stringify(disciplineTags) : null,
                builderEligible,
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

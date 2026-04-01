import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
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
import { getComponentsFromCSV } from '@/lib/csvLoader';

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
    const refresh = searchParams.get('refresh') === 'true';

    // Check for forced local mode or use if DB connection fails in development
    const useLocalCSV = process.env.USE_LOCAL_CSV === 'true' || 
                       (process.env.NODE_ENV === 'development' && !process.env.POSTGRES_URL);

    if (useLocalCSV) {
        console.log('Using local CSV data fallback (Dev Mode)');
        const components = await getComponentsFromCSV(refresh);

        const isBuilderContext = context?.trim().toLowerCase() === 'builder';

        let filtered = components;
        if (type) filtered = filtered.filter(c => c.type === type);

        if (isBuilderContext) {
            // Include gravel + multi-discipline parts that are builder-eligible.
            // PartSelector handles fine-grained gravel scoping per component type.
            filtered = filtered.filter(c => {
                if (!c.builderEligible) return false;
                return c.discipline === 'gravel' || c.discipline === 'multi';
            });
        } else {
            if (discipline) filtered = filtered.filter(c => c.discipline === discipline || c.discipline === 'multi');
            const parsedBuilderEligible = builderEligible === 'true' ? true : builderEligible === 'false' ? false : undefined;
            if (parsedBuilderEligible !== undefined) filtered = filtered.filter(c => c.builderEligible === parsedBuilderEligible);
        }

        return NextResponse.json(filtered);
    }

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
        
        // Final fallback for local development if the DB connection times out/fails
        if (process.env.NODE_ENV === 'development') {
            console.warn('DB connection failed. Falling back to local CSV mode...');
            const allComponents = await getComponentsFromCSV(refresh);
            const isBuilderContext = context?.trim().toLowerCase() === 'builder';

            let filtered = allComponents;
            if (type) filtered = filtered.filter(c => c.type === type);

            if (isBuilderContext) {
                filtered = filtered.filter(c => {
                    if (!c.builderEligible) return false;
                    return c.discipline === 'gravel' || c.discipline === 'multi';
                });
            } else {
                if (discipline) filtered = filtered.filter(c => c.discipline === discipline || c.discipline === 'multi');
                const parsedBuilderEligible = builderEligible === 'true' ? true : builderEligible === 'false' ? false : undefined;
                if (parsedBuilderEligible !== undefined) filtered = filtered.filter(c => c.builderEligible === parsedBuilderEligible);
            }

            return NextResponse.json(filtered);
        }
        
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

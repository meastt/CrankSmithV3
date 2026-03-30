import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import {
    deriveDisciplineFromAttributes,
    normalizeDiscipline,
    parseDisciplineTags,
    validateBuilderEligibility
} from '@/lib/discipline';

function isAdmin(userId: string): boolean {
    const adminIds = (process.env.ADMIN_USER_IDS || '').split(',').map(id => id.trim()).filter(Boolean);
    return adminIds.includes(userId);
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { userId } = await auth();
    if (!userId || !isAdmin(userId)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    try {
        const body = await request.json();
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

        const componentModel: any = prisma.component;
        const component = await componentModel.update({
            where: { id },
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
    const { userId } = await auth();
    if (!userId || !isAdmin(userId)) {
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

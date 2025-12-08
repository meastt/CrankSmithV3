import React from 'react';
import { PrismaClient } from '@prisma/client';
import ComponentForm from '@/components/admin/ComponentForm';

const prisma = new PrismaClient();

import { normalizeComponent } from '@/lib/normalization';

export default async function EditComponentPage({ params }: { params: { id: string } }) {
    const component = await prisma.component.findUnique({
        where: { id: params.id },
    });

    if (!component) {
        return <div>Component not found</div>;
    }

    const normalizedComponent = normalizeComponent(component);

    return <ComponentForm initialData={normalizedComponent} />;
}

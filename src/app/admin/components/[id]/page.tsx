import React from 'react';
import { PrismaClient } from '@prisma/client';
import ComponentForm from '@/components/admin/ComponentForm';

const prisma = new PrismaClient();

export default async function EditComponentPage({ params }: { params: { id: string } }) {
    const component = await prisma.component.findUnique({
        where: { id: params.id },
    });

    if (!component) {
        return <div>Component not found</div>;
    }

    // Parse JSON fields for the form
    const parsedComponent = {
        ...component,
        interfaces: JSON.parse(component.interfaces as string),
        attributes: JSON.parse(component.attributes as string),
    };

    return <ComponentForm initialData={parsedComponent} />;
}

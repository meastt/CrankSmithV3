import React, { Suspense } from 'react';
import { PartSelector } from '@/components/builder/PartSelector';
import { BuilderSkeleton } from '@/components/builder/BuilderSkeleton';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Gravel Bike Builder Tool | Gravel Parts Compatibility | CrankSmith",
    description: "Build your gravel bike with real-time gravel parts compatibility validation, gear ratio insights, and weight tracking.",
    keywords: ["gravel bike builder", "gravel bike compatibility tool", "gravel parts compatibility", "gear ratio calculator", "bike weight calculator"],
    openGraph: {
        title: "Gravel Bike Builder Tool | CrankSmith",
        description: "Configure your gravel bike with real-time compatibility validation and performance calculations.",
        type: "website"
    }
};

export default function BuilderPage() {
    return (
        <div className="h-full flex flex-col overflow-hidden">
            <Suspense fallback={<BuilderSkeleton />}>
                <PartSelector />
            </Suspense>
        </div>
    );
}

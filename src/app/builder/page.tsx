import React from 'react';
import { PartSelector } from '@/components/builder/PartSelector';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Bike Builder Tool | Configure Your Dream Build | CrankSmith",
    description: "Professional bicycle configuration tool. Build your custom bike with real-time compatibility validation, gear ratio calculations, and weight tracking for road, gravel, and MTB builds.",
    keywords: ["bike builder", "custom bike configurator", "bike compatibility tool", "gear ratio calculator", "bike weight calculator", "bicycle configuration tool"],
    openGraph: {
        title: "Bike Builder Tool | CrankSmith",
        description: "Configure your dream bike with real-time compatibility validation and performance calculations.",
        type: "website"
    }
};

export default function BuilderPage() {
    return (
        <div className="h-full flex flex-col overflow-hidden">
            <PartSelector />
        </div>
    );
}

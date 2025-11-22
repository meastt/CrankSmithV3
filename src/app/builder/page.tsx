import React from 'react';
import { PartSelector } from '@/components/builder/PartSelector';

export default function BuilderPage() {
    return (
        <div className="h-full">
            <div className="p-6 border-b border-white/10 bg-gray-900">
                <h1 className="text-2xl font-bold text-white tracking-tight">Part Selector</h1>
                <p className="text-gray-400 text-sm mt-1">Choose premium components for your dream build.</p>
            </div>
            <PartSelector />
        </div>
    );
}

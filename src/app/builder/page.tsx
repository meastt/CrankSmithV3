import React from 'react';
import { PartSelector } from '@/components/builder/PartSelector';

import { BuildRadar } from '@/components/builder/BuildRadar';

export default function BuilderPage() {
    return (
        <div className="h-full flex flex-col md:flex-row">
            <div className="flex-1 h-full overflow-y-auto">
                <div className="p-6 border-b border-white/10 bg-gray-900">
                    <h1 className="text-2xl font-bold text-white tracking-tight">Part Selector</h1>
                    <p className="text-gray-400 text-sm mt-1">Choose premium components for your dream build.</p>
                </div>
                <PartSelector />
            </div>

            {/* Right Panel: Analysis */}
            <div className="w-full md:w-80 lg:w-96 bg-gray-950 border-l border-white/10 p-6 hidden md:block">
                <h2 className="text-xl font-bold text-white mb-6">Build Analysis</h2>
                <BuildRadar />

                <div className="mt-8 p-4 bg-blue-900/20 border border-blue-500/30 rounded-xl">
                    <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-2">Pro Tip</h3>
                    <p className="text-sm text-gray-300">
                        Your build is optimized for <strong>Climbing</strong>. Consider a larger chainring if you want more top-end speed.
                    </p>
                </div>
            </div>
        </div>
    );
}

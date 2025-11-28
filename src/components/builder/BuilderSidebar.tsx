'use client';

import React from 'react';
import { BuildSummary } from './BuildSummary';
import { PerformancePanel } from './PerformancePanel';

interface BuilderSidebarProps {
    side: 'left' | 'right';
}

export const BuilderSidebar: React.FC<BuilderSidebarProps> = ({ side }) => {
    return (
        <aside className="hidden lg:flex flex-col w-80 xl:w-[340px] border-white/5 bg-stone-950/50 backdrop-blur-sm overflow-hidden shrink-0"
            style={{ borderRightWidth: side === 'left' ? 1 : 0, borderLeftWidth: side === 'right' ? 1 : 0 }}
        >
            <div className="flex-1 overflow-y-auto">
                {side === 'left' ? <BuildSummary /> : <PerformancePanel />}
            </div>
        </aside>
    );
};

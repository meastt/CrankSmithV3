import React from 'react';
import { BuildSummary } from '@/components/builder/BuildSummary';
import { PerformancePanel } from '@/components/builder/PerformancePanel';
import { BuilderMobileNav } from '@/components/builder/BuilderMobileNav';

export default function BuilderLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col lg:flex-row h-screen overflow-hidden bg-gray-950">
            {/* Mobile Navigation & Modals */}
            <BuilderMobileNav />

            {/* Desktop Sidebar */}
            <div className="hidden lg:block h-full">
                <BuildSummary />
            </div>

            <main className="flex-1 overflow-y-auto relative z-0 scroll-smooth">
                {children}
            </main>

            <div className="hidden lg:block">
                <PerformancePanel />
            </div>
        </div>
    );
}

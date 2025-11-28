import React from 'react';
import { BuilderMobileNav } from '@/components/builder/BuilderMobileNav';
import { BuilderSidebar } from '@/components/builder/BuilderSidebar';

export default function BuilderLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col lg:flex-row min-h-[calc(100svh-4rem)] bg-stone-950">
            {/* Desktop Left Sidebar - Build Summary */}
            <BuilderSidebar side="left" />

            {/* Main Content */}
            <main className="flex-1 min-w-0 overflow-hidden">
                {children}
            </main>

            {/* Desktop Right Sidebar - Performance */}
            <BuilderSidebar side="right" />

            {/* Mobile Bottom Navigation */}
            <BuilderMobileNav />
        </div>
    );
}

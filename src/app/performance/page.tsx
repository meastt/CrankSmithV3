'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { DrivetrainLabSkeleton } from '@/components/tools/DrivetrainLabSkeleton';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Dynamically import DrivetrainLab to reduce initial bundle (includes recharts)
const DrivetrainLab = dynamic(() => import('@/components/tools/DrivetrainLab').then(mod => ({ default: mod.DrivetrainLab })), {
    ssr: false,
    loading: () => <DrivetrainLabSkeleton />
});

export default function PerformancePage() {
    return (
        <div className="min-h-screen bg-stone-950 text-white pb-20">
            {/* Header */}
            <header className="relative z-40 bg-stone-950/80 backdrop-blur-xl border-b border-white/5 pt-safe">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-stone-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="text-sm font-medium">Back to Dashboard</span>
                    </Link>
                    <div className="text-sm font-bold text-cyan-500 uppercase tracking-wider">
                        The Drivetrain Lab
                    </div>
                </div>
            </header>

            <main className="px-4 py-12">
                <div className="max-w-6xl mx-auto mb-12 text-center">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4">Gear Metrics</h1>
                    <p className="text-stone-400 max-w-2xl mx-auto">
                        Compare setups side-by-side. Analyze speed, cadence, and climbing capability.
                    </p>
                </div>

                <DrivetrainLab />
            </main>
        </div>
    );
}

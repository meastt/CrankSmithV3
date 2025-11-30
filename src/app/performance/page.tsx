'use client';

import React, { Suspense } from 'react';
import { DrivetrainLab } from '@/components/tools/DrivetrainLab';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function DrivetrainLabLoader() {
    return (
        <div className="w-full max-w-6xl mx-auto animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
                <div className="lg:col-span-4 space-y-4">
                    <div className="bg-stone-900/50 border border-white/5 rounded-xl h-64" />
                    <div className="bg-stone-900/50 border border-white/5 rounded-xl h-64" />
                </div>
                <div className="lg:col-span-8">
                    <div className="bg-stone-900/50 border border-white/5 rounded-xl h-80" />
                </div>
            </div>
        </div>
    );
}

export default function PerformancePage() {
    return (
        <div className="min-h-screen bg-stone-950 text-white pb-20">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-stone-950/80 backdrop-blur-xl border-b border-white/5">
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

                <Suspense fallback={<DrivetrainLabLoader />}>
                    <DrivetrainLab />
                </Suspense>
            </main>
        </div>
    );
}

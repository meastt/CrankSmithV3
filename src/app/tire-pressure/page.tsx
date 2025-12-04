'use client';

import React from 'react';
import { TirePressureCalculator } from '@/components/tools/TirePressureCalculator';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function TirePressurePage() {
    return (
        <div className="min-h-screen bg-stone-950 text-white pb-20">
            {/* Header */}
            <header className="relative z-40 bg-stone-950/80 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-stone-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="text-sm font-medium">Back to Dashboard</span>
                    </Link>
                    <div className="text-sm font-bold text-rose-500 uppercase tracking-wider">
                        The Contact Patch
                    </div>
                </div>
            </header>

            <main className="px-4 py-12">
                <div className="max-w-5xl mx-auto mb-12 text-center">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4">Tire Pressure Calculator</h1>
                    <p className="text-stone-400 max-w-2xl mx-auto">
                        Don't guess. Calculate the optimal pressure for your specific rim width, casing, and terrain.
                    </p>
                </div>

                <TirePressureCalculator />
            </main>
        </div>
    );
}

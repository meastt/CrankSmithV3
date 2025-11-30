'use client';

import React from 'react';
import { Scale, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useWeightStore } from '@/store/weightStore';
import { useBuildStore } from '@/store/buildStore';
import { builderPartsToBaselineBuild } from '@/lib/weightConversion';
import { BaselineDisplay } from '@/components/weight/BaselineDisplay';
import { UpgradeSimulator } from '@/components/weight/UpgradeSimulator';
import { TerrorDisplay } from '@/components/weight/TerrorDisplay';
import { ManualEntryModal } from '@/components/weight/ManualEntryModal';
import { QuickWins } from '@/components/weight/QuickWins';
import { haptic } from '@/lib/haptics';
import type { WeightComponent } from '@/types/weight';

export default function WeightPage() {
    const { viewMode, baseline, target, setBaseline, setViewMode, clearUpgrades } = useWeightStore();
    const builderParts = useBuildStore((state) => state.parts);
    const [isManualEntryOpen, setIsManualEntryOpen] = React.useState(false);

    const handleImportFromBuilder = () => {
        haptic('medium');

        const baselineBuild = builderPartsToBaselineBuild(builderParts, 'Imported Build');

        if (!baselineBuild) {
            alert('No build found in builder. Please build a bike first!');
            return;
        }

        setBaseline(baselineBuild);
    };

    const handleManualEntry = () => {
        haptic('medium');
        setIsManualEntryOpen(true);
    };

    const handleSaveManualBuild = (components: WeightComponent[]) => {
        const totalWeight = components.reduce((sum, c) => sum + c.weight, 0);
        const totalCost = components.reduce((sum, c) => sum + (c.cost || 0), 0);

        const baselineBuild = {
            id: `manual-build-${Date.now()}`,
            name: 'Manual Build',
            components,
            total_weight: totalWeight,
            total_cost: totalCost,
        };

        setBaseline(baselineBuild);
        setIsManualEntryOpen(false);
    };

    return (
        <div className="min-h-screen bg-stone-950 text-white">
            {/* Manual Entry Modal */}
            <ManualEntryModal
                isOpen={isManualEntryOpen}
                onClose={() => setIsManualEntryOpen(false)}
                onSave={handleSaveManualBuild}
            />

            {/* Header */}
            <header className="sticky top-0 z-40 bg-stone-950/80 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-stone-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="text-sm font-medium">Back to Dashboard</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <Scale className="w-5 h-5 text-emerald-500" />
                        <span className="text-sm font-bold text-emerald-500 uppercase tracking-wider">
                            The Scale
                        </span>
                    </div>
                </div>
            </header>

            {/* Terror Display - Shows when upgrades are active */}
            {target && baseline && (
                <TerrorDisplay
                    baseline={baseline}
                    target={target}
                    onReset={clearUpgrades}
                    onSave={() => {
                        haptic('medium');
                        alert('Save functionality coming soon!');
                    }}
                />
            )}

            <main className="px-4 py-12">
                {viewMode === 'landing' && (
                    <LandingView
                        onImport={handleImportFromBuilder}
                        onManual={handleManualEntry}
                    />
                )}

                {viewMode === 'baseline' && baseline && (
                    <BaselineDisplay
                        build={baseline}
                        onStartUpgrading={() => setViewMode('upgrading')}
                        onQuickWins={() => setViewMode('quickwins')}
                    />
                )}

                {viewMode === 'upgrading' && baseline && (
                    <div className="max-w-7xl mx-auto">
                        <UpgradeSimulator
                            baseline={baseline}
                            onBack={() => setViewMode('baseline')}
                        />
                    </div>
                )}

                {viewMode === 'quickwins' && baseline && (
                    <QuickWins
                        baseline={baseline}
                        onBack={() => setViewMode('baseline')}
                    />
                )}
            </main>
        </div>
    );
}

function LandingView({ onImport, onManual }: { onImport: () => void; onManual: () => void }) {
    return (
        <div className="max-w-2xl mx-auto text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Scale Icon */}
                <div className="mb-8 flex justify-center">
                    <motion.div
                        animate={{
                            y: [0, -10, 0],
                            rotate: [0, -2, 2, 0]
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="w-32 h-32 rounded-full bg-emerald-500/10 border-2 border-emerald-500/20 flex items-center justify-center"
                    >
                        <Scale className="w-16 h-16 text-emerald-500" />
                    </motion.div>
                </div>

                {/* Title */}
                <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
                    The <span className="text-emerald-500">Scale</span>
                </h1>

                {/* Subtitle */}
                <p className="text-xl text-stone-400 mb-8 max-w-xl mx-auto">
                    How heavy is your bike?
                </p>

                <p className="text-sm text-stone-500 mb-12 max-w-lg mx-auto leading-relaxed">
                    Discover how much lighter your bike could be—and what it'll cost you.
                    The brutal truth about cost per gram saved.
                </p>

                {/* Entry Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                    {/* Import from Builder */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onImport}
                        className="group relative p-8 rounded-2xl bg-stone-900/50 border border-white/10 hover:border-emerald-500/50 transition-all text-left"
                    >
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="relative">
                            <div className="text-3xl mb-4">🚴</div>
                            <h3 className="text-lg font-bold mb-2 text-white group-hover:text-emerald-400 transition-colors">
                                Import from Builder
                            </h3>
                            <p className="text-sm text-stone-400">
                                Already built a bike? Import it with one click.
                            </p>
                        </div>
                    </motion.button>

                    {/* Manual Entry */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onManual}
                        className="group relative p-8 rounded-2xl bg-stone-900/50 border border-white/10 hover:border-emerald-500/50 transition-all text-left"
                    >
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="relative">
                            <div className="text-3xl mb-4">⚙️</div>
                            <h3 className="text-lg font-bold mb-2 text-white group-hover:text-emerald-400 transition-colors">
                                Enter Manually
                            </h3>
                            <p className="text-sm text-stone-400">
                                Input your existing bike component by component.
                            </p>
                        </div>
                    </motion.button>
                </div>

                {/* Feature Highlights */}
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                    <div className="p-6 rounded-xl bg-stone-900/30 border border-white/5">
                        <div className="text-2xl mb-3">💰</div>
                        <h4 className="font-semibold text-emerald-400 mb-2">Cost Per Gram</h4>
                        <p className="text-xs text-stone-400">
                            See exactly how much each upgrade costs per gram saved. The sacred metric.
                        </p>
                    </div>

                    <div className="p-6 rounded-xl bg-stone-900/30 border border-white/5">
                        <div className="text-2xl mb-3">⚡</div>
                        <h4 className="font-semibold text-emerald-400 mb-2">Rotating Weight</h4>
                        <p className="text-xs text-stone-400">
                            Special focus on wheels, tires, and cassettes—where it matters most.
                        </p>
                    </div>

                    <div className="p-6 rounded-xl bg-stone-900/30 border border-white/5">
                        <div className="text-2xl mb-3">🎯</div>
                        <h4 className="font-semibold text-emerald-400 mb-2">Quick Wins</h4>
                        <p className="text-xs text-stone-400">
                            Smart suggestions for easy, affordable weight savings.
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

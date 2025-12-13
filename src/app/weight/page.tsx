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
import { LandingView } from '@/components/weight/LandingView';
import { haptic } from '@/lib/haptics';
import { useToast } from '@/components/ui/Toast';
import type { WeightComponent } from '@/types/weight';

export default function WeightPage() {
    const { viewMode, baseline, target, setBaseline, setViewMode, clearUpgrades } = useWeightStore();
    const builderParts = useBuildStore((state) => state.parts);
    const [isManualEntryOpen, setIsManualEntryOpen] = React.useState(false);
    const { toast } = useToast();

    const handleImportFromBuilder = () => {
        haptic('medium');

        const baselineBuild = builderPartsToBaselineBuild(builderParts, 'Imported Build');

        if (!baselineBuild) {
            toast({
                type: 'error',
                title: 'No Build Found',
                message: 'Please build a bike in the builder first!',
            });
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
        toast({
            type: 'success',
            title: 'Build Created',
            message: 'Manual build created successfully',
        });
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
            <header className="relative z-40 bg-stone-950/80 backdrop-blur-xl border-b border-white/5">
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
                        <h1 className="text-sm font-bold text-emerald-500 uppercase tracking-wider margin-0">
                            The Scale
                        </h1>
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
                        toast({
                            type: 'info',
                            title: 'Coming Soon',
                            message: 'Save functionality will be available in the next update!',
                        });
                    }}
                />
            )}

            <div className="px-4 py-12">
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
            </div>
        </div>
    );
}


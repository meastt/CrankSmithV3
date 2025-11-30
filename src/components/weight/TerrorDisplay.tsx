import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingDown, DollarSign, Target, RotateCcw, Save } from 'lucide-react';
import type { BaselineBuild, TargetBuild } from '@/types/weight';
import { getCostPerGramRating, getCostPerGramColor } from '@/types/weight';

interface TerrorDisplayProps {
    baseline: BaselineBuild;
    target: TargetBuild | null;
    onReset?: () => void;
    onSave?: () => void;
}

export function TerrorDisplay({ baseline, target, onReset, onSave }: TerrorDisplayProps) {
    const hasUpgrades = target && target.upgrades.length > 0;

    return (
        <div className="sticky top-20 z-30 bg-stone-900/95 backdrop-blur-xl border-b border-white/10 shadow-2xl">
            <div className="max-w-7xl mx-auto px-4 py-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Baseline Weight */}
                    <div className="flex items-center gap-3">
                        <div className="text-sm text-stone-500 uppercase tracking-wider font-medium">
                            Baseline
                        </div>
                        <div className="text-2xl md:text-3xl font-mono font-bold text-stone-400">
                            {formatWeight(baseline.total_weight)}g
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {hasUpgrades ? (
                            <UpgradesActive key="active" baseline={baseline} target={target!} onReset={onReset} onSave={onSave} />
                        ) : (
                            <NoUpgrades key="none" />
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

function NoUpgrades() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex items-center gap-2 text-stone-500"
        >
            <Target className="w-5 h-5" />
            <span className="text-sm">Select components to upgrade</span>
        </motion.div>
    );
}

function UpgradesActive({
    baseline,
    target,
    onReset,
    onSave,
}: {
    baseline: BaselineBuild;
    target: TargetBuild;
    onReset?: () => void;
    onSave?: () => void;
}) {
    const rating = getCostPerGramRating(target.avg_cost_per_gram);
    const ratingColor = getCostPerGramColor(rating);

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex-1 flex flex-wrap items-center justify-center md:justify-between gap-4 md:gap-6"
        >
            {/* Arrow */}
            <div className="hidden md:block text-stone-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
            </div>

            {/* Target Weight */}
            <div className="flex items-center gap-3">
                <div className="text-sm text-emerald-500 uppercase tracking-wider font-medium">
                    Target
                </div>
                <motion.div
                    key={target.new_total_weight}
                    initial={{ scale: 1.2, color: '#10b981' }}
                    animate={{ scale: 1, color: '#10b981' }}
                    className="text-2xl md:text-3xl font-mono font-bold text-emerald-500"
                >
                    {formatWeight(target.new_total_weight)}g
                </motion.div>
            </div>

            {/* Stats Grid */}
            <div className="flex items-center gap-4 md:gap-6">
                {/* Weight Saved */}
                <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1.5 text-emerald-400">
                        <motion.div
                            key={`icon-${target.total_weight_saved}`}
                            initial={{ rotate: -90, scale: 0.5 }}
                            animate={{ rotate: 0, scale: 1 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                        >
                            <TrendingDown className="w-4 h-4" />
                        </motion.div>
                        <motion.span
                            key={target.total_weight_saved}
                            initial={{ scale: 1.3, y: -10 }}
                            animate={{ scale: 1, y: 0 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                            className="text-xl font-mono font-bold"
                        >
                            -{formatWeight(target.total_weight_saved)}g
                        </motion.span>
                    </div>
                    <span className="text-xs text-stone-500 mt-0.5">saved</span>
                </div>

                {/* Cost Added - THE TERROR! */}
                <div className="flex flex-col items-center">
                    <motion.div
                        key={`terror-${target.total_cost_added}`}
                        initial={{ scale: 1 }}
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 0.5, times: [0, 0.5, 1] }}
                        className="flex items-center gap-1.5 text-red-400"
                    >
                        <motion.div
                            initial={{ rotate: 0, scale: 1 }}
                            animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.5 }}
                        >
                            <DollarSign className="w-4 h-4" />
                        </motion.div>
                        <motion.span
                            key={target.total_cost_added}
                            initial={{ scale: 1.5, color: '#ff0000' }}
                            animate={{
                                scale: [1.5, 1.2, 1],
                                color: ['#ff0000', '#ff4444', '#f87171']
                            }}
                            transition={{
                                scale: { type: 'spring', stiffness: 500, damping: 15 },
                                color: { duration: 0.6 }
                            }}
                            className="text-xl font-mono font-bold"
                        >
                            +${formatCost(target.total_cost_added)}
                        </motion.span>
                    </motion.div>
                    <span className="text-xs text-stone-500 mt-0.5">cost</span>
                </div>

                {/* Cost Per Gram - THE SACRED METRIC */}
                <div className="flex flex-col items-center">
                    <motion.div
                        key={target.avg_cost_per_gram}
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                        className={`px-3 py-1.5 rounded-lg border ${ratingColor}`}
                    >
                        <span className="text-sm font-mono font-bold">
                            ${target.avg_cost_per_gram.toFixed(2)}/g
                        </span>
                    </motion.div>
                    <span className="text-xs text-stone-500 mt-0.5">avg</span>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
                {onReset && (
                    <button
                        onClick={onReset}
                        className="p-2 text-stone-400 hover:text-stone-200 hover:bg-stone-800 rounded-lg transition-colors"
                        title="Reset upgrades"
                    >
                        <RotateCcw className="w-4 h-4" />
                    </button>
                )}

                {onSave && (
                    <button
                        onClick={onSave}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors font-medium text-sm"
                    >
                        <Save className="w-4 h-4" />
                        <span className="hidden md:inline">Save</span>
                    </button>
                )}
            </div>
        </motion.div>
    );
}

// Helper functions
function formatWeight(grams: number): string {
    return Math.round(grams).toLocaleString();
}

function formatCost(dollars: number): string {
    return Math.round(dollars).toLocaleString();
}

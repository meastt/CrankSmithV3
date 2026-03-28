import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Target, TrendingDown } from 'lucide-react';
import type { BaselineBuild, CategoryBreakdown, ComponentCategory } from '@/types/weight';
import { CATEGORY_GROUPS, ROTATING_WEIGHT_CATEGORIES } from '@/types/weight';

interface BaselineDisplayProps {
    build: BaselineBuild;
    onStartUpgrading: () => void;
    onQuickWins: () => void;
}

export function BaselineDisplay({ build, onStartUpgrading, onQuickWins }: BaselineDisplayProps) {
    const categoryBreakdowns = getCategoryBreakdowns(build);
    const rotatingWeightTotal = getRotatingWeightTotal(build);
    const rotatingWeightPercent = (rotatingWeightTotal / build.total_weight) * 100;
    const reconciliation = getWeightReconciliation(build);

    return (
        <div className="max-w-7xl mx-auto">
            {/* Big Weight Display - Digital Scale Aesthetic */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-12 text-center"
            >
                <div className="inline-block relative">
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full"></div>

                    {/* Weight number */}
                    <div className="relative bg-stone-900/50 border-2 border-emerald-500/30 rounded-3xl px-12 py-8">
                        <div className="text-4xl sm:text-6xl md:text-8xl font-mono font-bold text-emerald-500 tracking-tight flex items-baseline justify-center gap-4">
                            <span>
                                {formatWeightImperial(build.total_weight).lbs}
                                <span className="text-2xl md:text-4xl ml-2 text-emerald-500/60">lbs</span>
                            </span>
                            <span>
                                {formatWeightImperial(build.total_weight).oz}
                                <span className="text-2xl md:text-4xl ml-2 text-emerald-500/60">oz</span>
                            </span>
                        </div>
                        <div className="text-sm md:text-base font-mono text-emerald-500/40 mt-2">
                            ({formatWeight(build.total_weight)} g)
                        </div>
                    </div>
                </div>

                <p className="text-stone-400 mt-6 text-lg">
                    {build.name || 'Your Baseline Build'}
                </p>
            </motion.div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 justify-center mb-12">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onQuickWins}
                    className="flex items-center gap-2 px-6 py-3 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-xl hover:bg-cyan-500/20 transition-colors font-medium"
                >
                    <Target className="w-5 h-5" />
                    🎯 Show Quick Wins
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onStartUpgrading}
                    className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors font-medium shadow-lg shadow-emerald-500/20"
                >
                    <TrendingDown className="w-5 h-5" />
                    🔧 Start Upgrading
                </motion.button>
            </div>

            {/* Rotating Weight Callout */}
            {rotatingWeightTotal > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-8 p-6 bg-amber-500/10 border border-amber-500/20 rounded-2xl"
                >
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                            <Zap className="w-8 h-8 text-amber-400" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-amber-400 mb-2">
                                ⚡ Rotating Weight Components
                            </h3>
                            <p className="text-sm text-stone-300 mb-3">
                                These components matter ~2x for acceleration and climbing.
                                Focus upgrades here first!
                            </p>
                            <div className="flex items-baseline gap-4">
                                <div>
                                    <span className="text-3xl font-mono font-bold text-amber-400">
                                        {formatWeight(rotatingWeightTotal)}g
                                    </span>
                                    <span className="text-stone-400 ml-2">
                                        ({rotatingWeightPercent.toFixed(1)}% of bike)
                                    </span>
                                </div>
                                <div className="text-sm text-stone-400">
                                    Effective penalty: ~{formatWeight(rotatingWeightTotal * 2)}g
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Category Breakdown */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-3"
            >
                <h3 className="text-lg font-semibold text-stone-300 mb-4">Weight Breakdown</h3>

                {categoryBreakdowns.map((category, index) => (
                    <CategoryRow key={category.display_name} category={category} index={index} />
                ))}
            </motion.div>

            {/* Reconciliation Panel */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="mt-6 p-4 rounded-2xl border border-white/10 bg-stone-900/40"
            >
                <h3 className="text-sm uppercase tracking-wider font-semibold text-stone-300 mb-3">
                    Baseline Reconciliation
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    <div className="rounded-lg border border-white/10 bg-black/20 p-3">
                        <div className="text-stone-500 text-xs">Measured baseline</div>
                        <div className="font-mono text-emerald-300">{formatWeight(build.total_weight)}g</div>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-black/20 p-3">
                        <div className="text-stone-500 text-xs">Estimated missing coverage</div>
                        <div className="font-mono text-amber-300">+{formatWeight(reconciliation.estimatedMissingWeight)}g</div>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-black/20 p-3">
                        <div className="text-stone-500 text-xs">Confidence</div>
                        <div className={`font-mono ${
                            reconciliation.confidence === 'High'
                                ? 'text-emerald-300'
                                : reconciliation.confidence === 'Medium'
                                    ? 'text-amber-300'
                                    : 'text-red-300'
                        }`}>
                            {reconciliation.confidence} ({reconciliation.coveragePct}% coverage)
                        </div>
                    </div>
                </div>
                {reconciliation.missingCategories.length > 0 && (
                    <p className="text-xs text-stone-400 mt-3">
                        Missing categories: {reconciliation.missingCategories.slice(0, 6).join(', ')}
                        {reconciliation.missingCategories.length > 6 ? ` +${reconciliation.missingCategories.length - 6} more` : ''}.
                    </p>
                )}
            </motion.div>

            {/* Total */}
            <div className="mt-6 pt-6 border-t border-white/10 flex justify-between items-center">
                <span className="text-stone-400 font-medium">Total Weight</span>
                <span className="text-2xl font-mono font-bold text-emerald-500">
                    {formatWeightImperial(build.total_weight).lbs} lbs {formatWeightImperial(build.total_weight).oz} oz
                    <span className="text-base text-emerald-500/50 ml-2">({formatWeight(build.total_weight)}g)</span>
                </span>
            </div>
        </div>
    );
}

function CategoryRow({ category, index }: { category: CategoryBreakdown; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.05 }}
            className="flex items-center gap-4 p-4 bg-stone-900/30 border border-white/5 rounded-xl hover:border-white/10 transition-colors"
        >
            {/* Category Name */}
            <div className="flex-1 flex items-center gap-2">
                {category.is_rotating && <Zap className="w-4 h-4 text-amber-400" />}
                <span className="font-medium text-stone-200">{category.display_name}</span>
            </div>

            {/* Weight */}
            <div className="flex items-center gap-4">
                <span className="text-2xl font-mono font-bold text-emerald-500 min-w-[100px] text-right">
                    {formatWeight(category.weight)}g
                </span>

                {/* Percentage Bar */}
                <div className="w-32 h-2 bg-stone-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${category.percentage}%` }}
                    />
                </div>

                <span className="text-sm text-stone-400 min-w-[50px]">
                    {category.percentage.toFixed(1)}%
                </span>
            </div>
        </motion.div>
    );
}

// Helper functions
function formatWeight(grams: number): string {
    return grams.toLocaleString();
}

function formatWeightImperial(grams: number): { lbs: number; oz: number } {
    const totalOz = grams * 0.035274;
    const lbs = Math.floor(totalOz / 16);
    const oz = Math.round(totalOz % 16);
    return { lbs, oz };
}

function getCategoryBreakdowns(build: BaselineBuild): CategoryBreakdown[] {
    const breakdowns: CategoryBreakdown[] = [];

    for (const [groupName, categories] of Object.entries(CATEGORY_GROUPS)) {
        const components = build.components.filter((c) =>
            categories.includes(c.category)
        );

        if (components.length === 0) continue;

        const weight = components.reduce((sum, c) => sum + c.weight, 0);
        const isRotating = components.some((c) => c.is_rotating);

        breakdowns.push({
            category: components[0].category,
            display_name: groupName,
            weight,
            percentage: (weight / build.total_weight) * 100,
            is_rotating: isRotating,
            components,
        });
    }

    // Sort by weight descending
    return breakdowns.sort((a, b) => b.weight - a.weight);
}

function getRotatingWeightTotal(build: BaselineBuild): number {
    return build.components
        .filter((c) => ROTATING_WEIGHT_CATEGORIES.includes(c.category))
        .reduce((sum, c) => sum + c.weight, 0);
}

const BASELINE_EXPECTED_CATEGORIES: ComponentCategory[] = [
    'frame',
    'fork',
    'wheels',
    'tires',
    'crankset',
    'bottom_bracket',
    'cassette',
    'chain',
    'derailleur',
    'shifter',
    'brakes',
    'rotors',
    'handlebars',
    'stem',
    'seatpost',
    'saddle',
    'pedals',
];

const MISSING_WEIGHT_ESTIMATE: Record<ComponentCategory, number> = {
    frame: 1200,
    fork: 450,
    wheels: 1700,
    tires: 900,
    cassette: 350,
    chain: 260,
    crankset: 650,
    bottom_bracket: 95,
    derailleur: 280,
    shifter: 430,
    brakes: 320,
    rotors: 260,
    handlebars: 260,
    stem: 140,
    seatpost: 220,
    saddle: 220,
    pedals: 300,
    tubes: 220,
    accessories: 250,
};

function getWeightReconciliation(build: BaselineBuild): {
    missingCategories: string[];
    estimatedMissingWeight: number;
    confidence: 'High' | 'Medium' | 'Low';
    coveragePct: number;
} {
    const present = new Set(build.components.map((c) => c.category));
    const missing = BASELINE_EXPECTED_CATEGORIES.filter((category) => !present.has(category));
    const estimatedMissingWeight = missing.reduce((sum, category) => sum + (MISSING_WEIGHT_ESTIMATE[category] || 0), 0);
    const coverageRatio = (BASELINE_EXPECTED_CATEGORIES.length - missing.length) / BASELINE_EXPECTED_CATEGORIES.length;
    const coveragePct = Math.round(coverageRatio * 100);

    const confidence: 'High' | 'Medium' | 'Low' = coveragePct >= 90
        ? 'High'
        : coveragePct >= 75
            ? 'Medium'
            : 'Low';

    return {
        missingCategories: missing.map((category) => category.replace('_', ' ')),
        estimatedMissingWeight,
        confidence,
        coveragePct,
    };
}

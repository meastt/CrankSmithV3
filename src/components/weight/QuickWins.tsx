'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, TrendingDown, DollarSign, Plus, Loader2, ArrowLeft } from 'lucide-react';
import type { BaselineBuild } from '@/types/weight';
import { Component } from '@/lib/types/compatibility';
import { getCostPerGramRating, getCostPerGramColor } from '@/types/weight';
import { findQuickWins, optimizeQuickWinsForBudget, type QuickWin } from '@/lib/quickWins';
import { upgradeOptionToUpgrade } from '@/lib/upgradeSearch';
import { useWeightStore } from '@/store/weightStore';
import { useBuildStore } from '@/store/buildStore';
import { haptic } from '@/lib/haptics';
import { categoryToType } from '@/lib/upgradeSearch';
import { computeUnifiedWhatIf } from '@/lib/whatIfEngine';

interface QuickWinsProps {
    baseline: BaselineBuild;
    onBack: () => void;
}

const SEQUENCE_BUDGETS: Array<500 | 1000 | 2000> = [500, 1000, 2000];

export function QuickWins({ baseline, onBack }: QuickWinsProps) {
    const [quickWins, setQuickWins] = useState<QuickWin[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedFilter, setSelectedFilter] = useState<'all' | 'rotating' | 'unicorn'>('all');
    const [budgetTarget, setBudgetTarget] = useState<500 | 1000 | 2000>(1000);

    const { addUpgrade } = useWeightStore();
    const { parts } = useBuildStore();

    const loadQuickWins = React.useCallback(async () => {
        setLoading(true);

        try {
            // Load all component types for baseline components
            const componentTypes = new Set(
                baseline.components.map((c) => categoryToType(c.category)).filter(Boolean)
            );

            const promises = Array.from(componentTypes).map(async (type) => {
                const res = await fetch(`/api/components?type=${type}`);
                if (res.ok) {
                    const data = await res.json();
                    return { type, data };
                }
                return { type, data: [] };
            });

            const results = await Promise.all(promises);
            const componentsMap: Record<string, Component[]> = {};
            results.forEach(({ type, data }) => {
                if (type) componentsMap[type] = data;
            });

            // Find quick wins
            const wins = await findQuickWins(baseline, componentsMap);
            setQuickWins(wins);
        } catch (error) {
            console.error('Error loading quick wins:', error);
        } finally {
            setLoading(false);
        }
    }, [baseline]);

    useEffect(() => {
        loadQuickWins();
    }, [loadQuickWins]);

    const handleAddUpgrade = (quickWin: QuickWin) => {
        haptic('medium');
        const upgrade = upgradeOptionToUpgrade(quickWin.upgrade, quickWin.component);
        addUpgrade(upgrade);
    };

    // Filter quick wins based on selected filter
    const filteredWins = quickWins.filter((qw) => {
        if (selectedFilter === 'rotating') {
            return qw.component.is_rotating;
        }
        if (selectedFilter === 'unicorn') {
            return qw.upgrade.cost_per_gram < 1;
        }
        return true;
    });

    // Calculate totals if all quick wins applied
    const totalWeightSaved = filteredWins.reduce((sum, qw) => sum + qw.upgrade.weight_saved, 0);
    const totalCostAdded = filteredWins.reduce((sum, qw) => sum + qw.upgrade.cost_added, 0);
    const avgCostPerGram = totalWeightSaved > 0 ? totalCostAdded / totalWeightSaved : 0;
    const budgetPlan = optimizeQuickWinsForBudget(filteredWins, budgetTarget);
    const upgradeSequence = React.useMemo(() => {
        const seenUpgradeKeys = new Set<string>();

        return SEQUENCE_BUDGETS.map((budget) => {
            const plan = optimizeQuickWinsForBudget(filteredWins, budget);
            const newlyUnlocked = plan.selected.filter((selection) => {
                const key = `${selection.component.id}:${selection.upgrade.component.id}`;
                if (seenUpgradeKeys.has(key)) return false;
                seenUpgradeKeys.add(key);
                return true;
            });

            return {
                budget,
                totalWeightSaved: plan.totalWeightSaved,
                totalCost: plan.totalCost,
                newlyUnlocked,
            };
        });
    }, [filteredWins]);

    const crossToolDelta = React.useMemo(() => {
        const tireQuickWin = filteredWins.find((w) => w.component.category === 'tires');
        if (!tireQuickWin) return null;

        const extractMm = (label: string): number | null => {
            const m = label.match(/(\d{2})\s?mm/i);
            return m ? Number(m[1]) : null;
        };
        const baseWidth = extractMm(tireQuickWin.component.name);
        const newWidth = extractMm(tireQuickWin.upgrade.component.name);
        const crank = parts.Crankset as { specs?: { chainrings?: unknown[] } } | undefined;
        const cassette = parts.Cassette as { specs?: { range?: string }, attributes?: { range?: string } } | undefined;
        const wheelRear = parts.WheelRear as { specs?: { diameter?: string } } | undefined;
        if (!baseWidth || !newWidth || !crank || !cassette) return null;

        const chainrings: number[] = Array.isArray(crank.specs?.chainrings)
            ? crank.specs.chainrings.map((n) => Number(n)).filter((n: number) => !isNaN(n))
            : [50, 34];
        const cassetteRange = String(cassette.specs?.range || cassette.attributes?.range || '11-34');
        const wheelSize = String(wheelRear?.specs?.diameter || '').includes('650') ? 584 : 622;

        return computeUnifiedWhatIf({
            baseline: { chainrings, cassetteRange, tireSize: baseWidth, wheelSize },
            candidate: { chainrings, cassetteRange, tireSize: newWidth, wheelSize },
            ftp: 250,
            riderWeightKg: 75
        });
    }, [filteredWins, parts]);

    return (
        <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-stone-400 hover:text-white transition-colors mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Baseline
                </button>

                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-cyan-500/10 border-2 border-cyan-500/20 flex items-center justify-center">
                        <Zap className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">Quick Wins</h1>
                        <p className="text-stone-400">
                            The best value weight savings for your build
                        </p>
                    </div>
                </div>

                {/* Potential Savings Summary */}
                {filteredWins.length > 0 && !loading && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                            <div className="text-sm text-emerald-400 mb-1">Potential Savings</div>
                            <div className="text-2xl font-mono font-bold text-emerald-500">
                                -{totalWeightSaved.toLocaleString()}g
                            </div>
                        </div>
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                            <div className="text-sm text-red-400 mb-1">Total Investment</div>
                            <div className="text-2xl font-mono font-bold text-red-400">
                                ${totalCostAdded.toLocaleString()}
                            </div>
                        </div>
                        <div className="p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-xl">
                            <div className="text-sm text-cyan-400 mb-1">Average $/gram</div>
                            <div className="text-2xl font-mono font-bold text-cyan-400">
                                ${avgCostPerGram.toFixed(2)}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setSelectedFilter('all')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedFilter === 'all'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-stone-900 text-stone-400 hover:text-white'
                        }`}
                >
                    All ({quickWins.length})
                </button>
                <button
                    onClick={() => setSelectedFilter('rotating')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${selectedFilter === 'rotating'
                        ? 'bg-amber-500 text-white'
                        : 'bg-stone-900 text-stone-400 hover:text-white'
                        }`}
                >
                    <Zap className="w-4 h-4" />
                    Rotating Weight
                </button>
                <button
                    onClick={() => setSelectedFilter('unicorn')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedFilter === 'unicorn'
                        ? 'bg-purple-500 text-white'
                        : 'bg-stone-900 text-stone-400 hover:text-white'
                        }`}
                >
                    🦄 Unicorn Deals
                </button>
            </div>

            {/* Budget Optimizer */}
            {!loading && filteredWins.length > 0 && (
                <div className="mb-6 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                        <h2 className="text-base font-semibold text-cyan-300">Budget Optimizer</h2>
                        <div className="flex gap-2">
                            {[500, 1000, 2000].map((budget) => (
                                <button
                                    key={budget}
                                    onClick={() => setBudgetTarget(budget as 500 | 1000 | 2000)}
                                    className={`px-3 py-1.5 text-xs rounded-md border transition-colors ${
                                        budgetTarget === budget
                                            ? 'bg-cyan-500/20 border-cyan-400/40 text-cyan-200'
                                            : 'bg-stone-900/60 border-white/10 text-stone-300 hover:text-white'
                                    }`}
                                >
                                    ${budget.toLocaleString()}
                                </button>
                            ))}
                        </div>
                    </div>
                    <p className="text-xs text-stone-400 mb-3">
                        Best projected grams saved within budget using current quick-win options.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="rounded-lg bg-black/20 border border-white/10 p-3">
                            <div className="text-xs text-stone-500">Projected Savings</div>
                            <div className="text-lg font-mono text-emerald-400">-{budgetPlan.totalWeightSaved.toLocaleString()}g</div>
                        </div>
                        <div className="rounded-lg bg-black/20 border border-white/10 p-3">
                            <div className="text-xs text-stone-500">Projected Spend</div>
                            <div className="text-lg font-mono text-red-400">${Math.round(budgetPlan.totalCost).toLocaleString()}</div>
                        </div>
                        <div className="rounded-lg bg-black/20 border border-white/10 p-3">
                            <div className="text-xs text-stone-500">Mix Efficiency</div>
                            <div className="text-lg font-mono text-cyan-300">${budgetPlan.avgCostPerGram.toFixed(2)}/g</div>
                        </div>
                    </div>
                    {crossToolDelta && (
                        <div className="mt-3 text-[11px] text-stone-300">
                            Cross-tool delta from tire quick-win: {crossToolDelta.topSpeedDeltaKph >= 0 ? '+' : ''}{crossToolDelta.topSpeedDeltaKph.toFixed(1)} km/h top speed,
                            {' '}{crossToolDelta.cadenceDeltaRpmAtGrade >= 0 ? '+' : ''}{crossToolDelta.cadenceDeltaRpmAtGrade.toFixed(0)} rpm @8%, pressure hint {crossToolDelta.pressureHintDeltaPct.toFixed(1)}%.
                        </div>
                    )}
                </div>
            )}

            {/* Upgrade Sequence Planner */}
            {!loading && filteredWins.length > 0 && (
                <div className="mb-6 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                    <h2 className="text-base font-semibold text-emerald-300 mb-2">Upgrade Sequence Planner</h2>
                    <p className="text-xs text-stone-400 mb-3">
                        Suggested upgrade order by budget windows so each spend tier adds clear value.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {upgradeSequence.map((step) => (
                            <div key={step.budget} className="rounded-lg border border-white/10 bg-black/20 p-3">
                                <div className="text-xs text-stone-500">Under ${step.budget.toLocaleString()}</div>
                                <div className="text-sm font-mono text-emerald-300">-{Math.round(step.totalWeightSaved).toLocaleString()}g</div>
                                <div className="text-xs text-stone-500 mb-2">${Math.round(step.totalCost).toLocaleString()} planned</div>
                                {step.newlyUnlocked.length === 0 ? (
                                    <p className="text-[11px] text-stone-500">No new upgrades unlocked at this tier.</p>
                                ) : (
                                    <ul className="space-y-1">
                                        {step.newlyUnlocked.slice(0, 3).map((selection, idx) => (
                                            <li key={`${selection.component.id}-${idx}`} className="text-[11px] text-stone-300">
                                                • {selection.component.category}: {selection.upgrade.component.name}
                                            </li>
                                        ))}
                                        {step.newlyUnlocked.length > 3 && (
                                            <li className="text-[11px] text-stone-500">+{step.newlyUnlocked.length - 3} more</li>
                                        )}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Quick Wins List */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-4" />
                    <p className="text-stone-400">Analyzing upgrade opportunities...</p>
                </div>
            ) : filteredWins.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <p className="text-stone-400 mb-2">No quick wins found</p>
                    <p className="text-sm text-stone-600">
                        {selectedFilter === 'unicorn'
                            ? 'No unicorn deals available'
                            : selectedFilter === 'rotating'
                                ? 'No rotating weight upgrades found'
                                : 'Your build may already be optimized!'}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredWins.map((quickWin, index) => {
                        const rating = getCostPerGramRating(quickWin.upgrade.cost_per_gram);
                        const ratingColor = getCostPerGramColor(rating);

                        return (
                            <motion.div
                                key={`${quickWin.component.id}-${index}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="p-6 bg-stone-900/50 border border-white/10 rounded-xl hover:border-white/20 transition-all"
                            >
                                <div className="flex items-start justify-between gap-6">
                                    <div className="flex-1">
                                        {/* Rank Badge */}
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                                                #{index + 1}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {quickWin.component.is_rotating && (
                                                    <Zap className="w-4 h-4 text-amber-400" />
                                                )}
                                                <span className="text-xs text-stone-500 uppercase tracking-wide">
                                                    {quickWin.component.category}
                                                </span>
                                            </div>
                                            <span className="text-sm text-cyan-400">
                                                {quickWin.reason}
                                            </span>
                                        </div>

                                        {/* Current → Upgrade */}
                                        <div className="mb-4">
                                            <div className="text-sm text-stone-500 mb-1">Current</div>
                                            <div className="text-white font-medium mb-3">
                                                {quickWin.component.name}
                                                <span className="text-stone-500 ml-2">
                                                    {quickWin.component.weight.toLocaleString()}g
                                                </span>
                                            </div>

                                            <div className="text-sm text-emerald-400 mb-1">
                                                Upgrade to
                                            </div>
                                            <div className="text-white font-medium">
                                                {quickWin.upgrade.component.name}
                                                <span className="text-emerald-500 ml-2">
                                                    {(
                                                        quickWin.component.weight -
                                                        quickWin.upgrade.weight_saved
                                                    ).toLocaleString()}
                                                    g
                                                </span>
                                            </div>
                                        </div>

                                        {/* Stats */}
                                        <div className="flex flex-wrap items-center gap-4">
                                            <div className="flex items-center gap-2 px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
                                                <span className="text-[11px] text-cyan-300 uppercase tracking-wide">Smart Value</span>
                                                <span className="text-sm font-mono font-bold text-cyan-200">
                                                    {quickWin.marginalGainScore.toFixed(0)}/100
                                                </span>
                                            </div>
                                            {/* Weight Saved */}
                                            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                                                <TrendingDown className="w-4 h-4 text-emerald-400" />
                                                <span className="text-sm font-mono font-bold text-emerald-400">
                                                    -{quickWin.upgrade.weight_saved.toLocaleString()}g
                                                </span>
                                            </div>

                                            {/* Cost Added */}
                                            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-lg">
                                                <DollarSign className="w-4 h-4 text-red-400" />
                                                <span className="text-sm font-mono font-bold text-red-400">
                                                    +${quickWin.upgrade.cost_added.toLocaleString()}
                                                </span>
                                            </div>

                                            {/* Cost per gram */}
                                            <div
                                                className={`px-3 py-1.5 rounded-lg text-sm font-mono font-bold border ${ratingColor}`}
                                            >
                                                ${quickWin.upgrade.cost_per_gram.toFixed(2)}/g
                                            </div>
                                        </div>
                                    </div>

                                    {/* Add Button */}
                                    <button
                                        onClick={() => handleAddUpgrade(quickWin)}
                                        className="flex-shrink-0 p-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
                                        title="Add to target build"
                                    >
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

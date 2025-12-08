'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Plus, ArrowRight, Loader2, ArrowLeft } from 'lucide-react';
import type { BaselineBuild, WeightComponent, ComponentCategory } from '@/types/weight';
import { Component } from '@/lib/types/compatibility';
import { getCostPerGramRating, getCostPerGramColor } from '@/types/weight';
import {
    findUpgradeOptions,
    upgradeOptionToUpgrade,
    categoryToType,
    type UpgradeOption,
} from '@/lib/upgradeSearch';
import { useWeightStore } from '@/store/weightStore';
import { haptic } from '@/lib/haptics';

interface UpgradeSimulatorProps {
    baseline: BaselineBuild;
    onBack: () => void;
}

export function UpgradeSimulator({ baseline, onBack }: UpgradeSimulatorProps) {
    const [selectedCategory, setSelectedCategory] = useState<ComponentCategory | null>(null);
    const [upgradeOptions, setUpgradeOptions] = useState<UpgradeOption[]>([]);
    const [loading, setLoading] = useState(false);
    const [allComponents, setAllComponents] = useState<Record<string, Component[]>>({});

    const { target, addUpgrade } = useWeightStore();

    // Preload all component types for faster switching
    useEffect(() => {
        const loadAllComponents = async () => {
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

            setAllComponents(componentsMap);
        };

        loadAllComponents();
    }, [baseline]);

    const handleSelectComponent = async (component: WeightComponent) => {
        haptic('light');
        setSelectedCategory(component.category);
        setLoading(true);

        try {
            const type = categoryToType(component.category);
            if (!type) {
                console.error('Unknown category:', component.category);
                setLoading(false);
                return;
            }

            // Use cached components if available
            const components = allComponents[type] || [];
            const options = await findUpgradeOptions(component, components);

            setUpgradeOptions(options);
        } catch (error) {
            console.error('Error finding upgrade options:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddUpgrade = (option: UpgradeOption) => {
        haptic('medium');

        const baselineComponent = baseline.components.find(
            (c) => c.category === selectedCategory
        );

        if (!baselineComponent) return;

        const upgrade = upgradeOptionToUpgrade(option, baselineComponent);
        addUpgrade(upgrade);
    };

    // Check if a category has an upgrade applied
    const hasUpgrade = (category: ComponentCategory) => {
        return target?.upgrades.some((u) => u.category === category);
    };

    return (
        <div className="space-y-6">
            {/* Back Button */}
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-stone-400 hover:text-white transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Baseline
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left: Current Build */}
                <div className="space-y-3">
                    <h2 className="text-xl font-bold text-stone-200 mb-4">Your Current Build</h2>

                    {baseline.components.map((component) => {
                        const isSelected = selectedCategory === component.category;
                        const upgraded = hasUpgrade(component.category);

                        return (
                            <motion.button
                                key={component.id}
                                onClick={() => handleSelectComponent(component)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`
                                w-full text-left p-4 rounded-xl border transition-all
                                ${isSelected
                                        ? 'bg-emerald-500/10 border-emerald-500/50'
                                        : upgraded
                                            ? 'bg-stone-900/50 border-emerald-500/30'
                                            : 'bg-stone-900/30 border-white/10 hover:border-white/20'
                                    }
                            `}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            {component.is_rotating && (
                                                <Zap className="w-4 h-4 text-amber-400" />
                                            )}
                                            <span className="text-sm text-stone-500 uppercase tracking-wide">
                                                {component.category}
                                            </span>
                                            {upgraded && (
                                                <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">
                                                    Upgraded
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="font-medium text-white mb-1">{component.name}</h3>
                                        <div className="flex items-center gap-3 text-sm">
                                            <span className="text-stone-400">
                                                {component.weight.toLocaleString()}g
                                            </span>
                                            {component.cost && (
                                                <span className="text-stone-500">
                                                    ${component.cost.toLocaleString()}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {isSelected && (
                                        <div className="flex-shrink-0">
                                            <ArrowRight className="w-5 h-5 text-emerald-500" />
                                        </div>
                                    )}
                                </div>
                            </motion.button>
                        );
                    })}
                </div>

                {/* Right: Upgrade Options */}
                <div className="space-y-3">
                    <h2 className="text-xl font-bold text-stone-200 mb-4">Upgrade Options</h2>

                    <AnimatePresence mode="wait">
                        {!selectedCategory ? (
                            <motion.div
                                key="placeholder"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center h-64 text-center text-stone-500"
                            >
                                <ArrowRight className="w-12 h-12 mb-4 opacity-30" />
                                <p>Select a component to see upgrade options</p>
                            </motion.div>
                        ) : loading ? (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center h-64"
                            >
                                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-4" />
                                <p className="text-stone-400">Finding upgrades...</p>
                            </motion.div>
                        ) : upgradeOptions.length === 0 ? (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center h-64 text-center"
                            >
                                <p className="text-stone-400 mb-2">
                                    No lighter options found for this component
                                </p>
                                <p className="text-sm text-stone-600">
                                    You may already have one of the lightest options!
                                </p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="options"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-2"
                            >
                                {upgradeOptions.map((option, index) => {
                                    const rating = getCostPerGramRating(option.cost_per_gram);
                                    const ratingColor = getCostPerGramColor(rating);

                                    return (
                                        <motion.div
                                            key={option.component.id}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="p-4 bg-stone-900/50 border border-white/10 rounded-xl hover:border-white/20 transition-all"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <h3 className="font-medium text-white mb-2">
                                                        {option.component.name}
                                                    </h3>

                                                    <div className="flex flex-wrap items-center gap-3 mb-3">
                                                        {/* Weight Saved */}
                                                        <div className="flex items-center gap-1 text-emerald-400">
                                                            <span className="text-sm">
                                                                -{option.weight_saved.toLocaleString()}g
                                                            </span>
                                                        </div>

                                                        {/* Cost Added */}
                                                        <div className="flex items-center gap-1 text-red-400">
                                                            <span className="text-sm">
                                                                +${option.cost_added.toLocaleString()}
                                                            </span>
                                                        </div>

                                                        {/* Cost per gram */}
                                                        <div
                                                            className={`px-2 py-1 rounded text-xs font-mono font-bold border ${ratingColor}`}
                                                        >
                                                            ${option.cost_per_gram.toFixed(2)}/g
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Add Button */}
                                                <button
                                                    onClick={() => handleAddUpgrade(option)}
                                                    className="flex-shrink-0 p-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
                                                    title="Add to target build"
                                                >
                                                    <Plus className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, Zap, Save } from 'lucide-react';
import type { WeightComponent, ComponentCategory } from '@/types/weight';
import { ROTATING_WEIGHT_CATEGORIES, CATEGORY_GROUPS } from '@/types/weight';
import { createEmptyBaselineBuild, addComponentToBaseline } from '@/lib/weightConversion';
import { haptic } from '@/lib/haptics';

interface ManualEntryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (components: WeightComponent[]) => void;
}

export function ManualEntryModal({ isOpen, onClose, onSave }: ManualEntryModalProps) {
    const [components, setComponents] = useState<WeightComponent[]>([]);
    const [formData, setFormData] = useState({
        category: '' as ComponentCategory | '',
        name: '',
        brand: '',
        weight: '',
        cost: '',
    });

    // Get flat list of categories from CATEGORY_GROUPS
    const allCategories = Object.entries(CATEGORY_GROUPS).map(([displayName, categories]) => ({
        displayName,
        category: categories[0], // Use first category from group
    }));

    const handleAddComponent = () => {
        if (!formData.category || !formData.name || !formData.weight) {
            alert('Please fill in category, name, and weight');
            return;
        }

        haptic('light');

        const weight = parseFloat(formData.weight);
        const cost = formData.cost ? parseFloat(formData.cost) : undefined;

        if (isNaN(weight) || weight <= 0) {
            alert('Please enter a valid weight');
            return;
        }

        if (formData.cost && (isNaN(cost!) || cost! < 0)) {
            alert('Please enter a valid cost');
            return;
        }

        const isRotating = ROTATING_WEIGHT_CATEGORIES.includes(formData.category);

        const newComponent: WeightComponent = {
            id: `manual-${Date.now()}-${Math.random()}`,
            category: formData.category,
            name: formData.name,
            brand: formData.brand || 'Unknown',
            weight,
            cost,
            is_rotating: isRotating,
        };

        setComponents([...components, newComponent]);

        // Reset form
        setFormData({
            category: formData.category, // Keep category selected
            name: '',
            brand: '',
            weight: '',
            cost: '',
        });
    };

    const handleRemoveComponent = (id: string) => {
        haptic('light');
        setComponents(components.filter((c) => c.id !== id));
    };

    const handleSave = () => {
        if (components.length === 0) {
            alert('Please add at least one component');
            return;
        }

        haptic('medium');
        onSave(components);
        setComponents([]);
        setFormData({
            category: '',
            name: '',
            brand: '',
            weight: '',
            cost: '',
        });
    };

    const totalWeight = components.reduce((sum, c) => sum + c.weight, 0);
    const totalCost = components.reduce((sum, c) => sum + (c.cost || 0), 0);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full max-w-4xl max-h-[90vh] overflow-hidden bg-stone-900 border border-white/10 rounded-2xl shadow-2xl flex flex-col"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                        <h2 className="text-2xl font-bold text-white">Manual Entry</h2>
                        <button
                            onClick={onClose}
                            className="p-2 text-stone-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content - Scrollable */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {/* Add Component Form */}
                        <div className="bg-stone-950/50 border border-white/10 rounded-xl p-6 space-y-4">
                            <h3 className="text-lg font-semibold text-emerald-400 mb-4">
                                Add Component
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Category */}
                                <div>
                                    <label className="block text-sm font-medium text-stone-400 mb-2">
                                        Category *
                                    </label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                category: e.target.value as ComponentCategory,
                                            })
                                        }
                                        className="w-full px-4 py-2 bg-stone-900 border border-white/10 rounded-lg text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                                    >
                                        <option value="">Select category...</option>
                                        {allCategories.map(({ displayName, category }) => (
                                            <option key={category} value={category}>
                                                {displayName}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Name */}
                                <div>
                                    <label className="block text-sm font-medium text-stone-400 mb-2">
                                        Component Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) =>
                                            setFormData({ ...formData, name: e.target.value })
                                        }
                                        placeholder="e.g., Dura-Ace R9270 Crankset"
                                        className="w-full px-4 py-2 bg-stone-900 border border-white/10 rounded-lg text-white placeholder:text-stone-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                                    />
                                </div>

                                {/* Brand */}
                                <div>
                                    <label className="block text-sm font-medium text-stone-400 mb-2">
                                        Brand
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.brand}
                                        onChange={(e) =>
                                            setFormData({ ...formData, brand: e.target.value })
                                        }
                                        placeholder="e.g., Shimano"
                                        className="w-full px-4 py-2 bg-stone-900 border border-white/10 rounded-lg text-white placeholder:text-stone-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                                    />
                                </div>

                                {/* Weight */}
                                <div>
                                    <label className="block text-sm font-medium text-stone-400 mb-2">
                                        Weight (grams) *
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.weight}
                                        onChange={(e) =>
                                            setFormData({ ...formData, weight: e.target.value })
                                        }
                                        placeholder="e.g., 612"
                                        className="w-full px-4 py-2 bg-stone-900 border border-white/10 rounded-lg text-white placeholder:text-stone-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                                    />
                                </div>

                                {/* Cost */}
                                <div>
                                    <label className="block text-sm font-medium text-stone-400 mb-2">
                                        Cost (USD)
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.cost}
                                        onChange={(e) =>
                                            setFormData({ ...formData, cost: e.target.value })
                                        }
                                        placeholder="e.g., 850"
                                        className="w-full px-4 py-2 bg-stone-900 border border-white/10 rounded-lg text-white placeholder:text-stone-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleAddComponent}
                                className="w-full md:w-auto px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Add Component
                            </button>
                        </div>

                        {/* Components List */}
                        {components.length > 0 && (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-white">
                                        Your Build ({components.length} components)
                                    </h3>
                                    <div className="text-sm text-stone-400">
                                        {totalWeight.toLocaleString()}g
                                        {totalCost > 0 && ` • $${totalCost.toLocaleString()}`}
                                    </div>
                                </div>

                                {components.map((component) => (
                                    <motion.div
                                        key={component.id}
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="flex items-center justify-between p-4 bg-stone-950/50 border border-white/10 rounded-xl"
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                {component.is_rotating && (
                                                    <Zap className="w-4 h-4 text-amber-400" />
                                                )}
                                                <span className="text-xs text-stone-500 uppercase tracking-wide">
                                                    {component.category}
                                                </span>
                                            </div>
                                            <h4 className="font-medium text-white mb-1">
                                                {component.name}
                                            </h4>
                                            <div className="flex items-center gap-3 text-sm">
                                                <span className="text-emerald-400">
                                                    {component.weight.toLocaleString()}g
                                                </span>
                                                {component.cost && (
                                                    <span className="text-stone-500">
                                                        ${component.cost.toLocaleString()}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveComponent(component.id)}
                                            className="p-2 text-stone-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-stone-950/50">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 text-stone-400 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={components.length === 0}
                            className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-stone-800 disabled:text-stone-600 text-white rounded-lg transition-colors font-medium flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            Save Build
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

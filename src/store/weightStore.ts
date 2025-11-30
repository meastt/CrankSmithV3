import { create } from 'zustand';
import type { BaselineBuild, TargetBuild, Upgrade, WeightComponent, ComponentCategory } from '@/types/weight';

type ViewMode = 'landing' | 'baseline' | 'upgrading' | 'quickwins';

interface WeightState {
    // Current view
    viewMode: ViewMode;

    // Baseline build
    baseline: BaselineBuild | null;

    // Target build (with upgrades)
    target: TargetBuild | null;

    // Actions
    setViewMode: (mode: ViewMode) => void;
    setBaseline: (build: BaselineBuild) => void;
    addUpgrade: (upgrade: Upgrade) => void;
    removeUpgrade: (category: ComponentCategory) => void;
    clearUpgrades: () => void;
    reset: () => void;
}

export const useWeightStore = create<WeightState>((set, get) => ({
    viewMode: 'landing',
    baseline: null,
    target: null,

    setViewMode: (mode) => set({ viewMode: mode }),

    setBaseline: (build) => {
        set({
            baseline: build,
            target: null, // Clear any existing target when baseline changes
            viewMode: 'baseline',
        });
    },

    addUpgrade: (upgrade) => {
        const { baseline, target } = get();
        if (!baseline) return;

        // If no target exists, create one
        if (!target) {
            const newTarget: TargetBuild = {
                baseline_id: baseline.id,
                upgrades: [upgrade],
                new_total_weight: baseline.total_weight - upgrade.weight_saved,
                total_weight_saved: upgrade.weight_saved,
                total_cost_added: upgrade.cost_added,
                avg_cost_per_gram: upgrade.cost_per_gram,
            };
            set({ target: newTarget });
            return;
        }

        // Remove any existing upgrade for same category
        const filteredUpgrades = target.upgrades.filter(
            (u) => u.category !== upgrade.category
        );

        // Add new upgrade
        const newUpgrades = [...filteredUpgrades, upgrade];

        // Recalculate totals
        const total_weight_saved = newUpgrades.reduce((sum, u) => sum + u.weight_saved, 0);
        const total_cost_added = newUpgrades.reduce((sum, u) => sum + u.cost_added, 0);
        const avg_cost_per_gram = total_cost_added / total_weight_saved;

        const newTarget: TargetBuild = {
            ...target,
            upgrades: newUpgrades,
            new_total_weight: baseline.total_weight - total_weight_saved,
            total_weight_saved,
            total_cost_added,
            avg_cost_per_gram: isFinite(avg_cost_per_gram) ? avg_cost_per_gram : 0,
        };

        set({ target: newTarget });
    },

    removeUpgrade: (category) => {
        const { baseline, target } = get();
        if (!baseline || !target) return;

        // Remove upgrade for this category
        const newUpgrades = target.upgrades.filter((u) => u.category !== category);

        // If no upgrades left, clear target
        if (newUpgrades.length === 0) {
            set({ target: null });
            return;
        }

        // Recalculate totals
        const total_weight_saved = newUpgrades.reduce((sum, u) => sum + u.weight_saved, 0);
        const total_cost_added = newUpgrades.reduce((sum, u) => sum + u.cost_added, 0);
        const avg_cost_per_gram = total_cost_added / total_weight_saved;

        const newTarget: TargetBuild = {
            ...target,
            upgrades: newUpgrades,
            new_total_weight: baseline.total_weight - total_weight_saved,
            total_weight_saved,
            total_cost_added,
            avg_cost_per_gram: isFinite(avg_cost_per_gram) ? avg_cost_per_gram : 0,
        };

        set({ target: newTarget });
    },

    clearUpgrades: () => {
        set({ target: null });
    },

    reset: () => {
        set({
            viewMode: 'landing',
            baseline: null,
            target: null,
        });
    },
}));

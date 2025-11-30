/**
 * Quick Wins Algorithm - Find the best value weight savings
 */

import type { BaselineBuild, WeightComponent } from '@/types/weight';
import type { Component } from '@/lib/validation';
import { COST_PER_GRAM_THRESHOLDS } from '@/types/weight';
import { findUpgradeOptions, type UpgradeOption } from './upgradeSearch';

export interface QuickWin {
    component: WeightComponent; // Current baseline component
    upgrade: UpgradeOption; // Best upgrade option
    score: number; // Quick win score (higher is better)
    reason: string; // Why this is a quick win
}

/**
 * Calculate a "quick win score" for an upgrade
 * Higher score = better quick win
 *
 * Factors:
 * - Cost per gram (lower is better)
 * - Total weight saved (more is better)
 * - Rotating weight (2x multiplier)
 */
function calculateQuickWinScore(
    upgrade: UpgradeOption,
    isRotating: boolean
): number {
    // Base score: weight saved (in grams)
    let score = upgrade.weight_saved;

    // Double score for rotating weight
    if (isRotating) {
        score *= 2;
    }

    // Penalize high cost per gram
    // Unicorn deals (<$1/g) get a bonus
    // Reasonable deals ($1-5/g) are neutral
    // Expensive deals ($5-10/g) get penalized
    // Madness ($10+/g) get heavily penalized
    if (upgrade.cost_per_gram < COST_PER_GRAM_THRESHOLDS.UNICORN) {
        score *= 1.5; // 50% bonus for unicorn deals
    } else if (upgrade.cost_per_gram > COST_PER_GRAM_THRESHOLDS.EXPENSIVE) {
        score *= 0.3; // Heavy penalty for expensive upgrades
    } else if (upgrade.cost_per_gram > COST_PER_GRAM_THRESHOLDS.REASONABLE) {
        score *= 0.6; // Moderate penalty for somewhat expensive
    }

    return score;
}

/**
 * Generate a reason string for why this is a quick win
 */
function generateReason(upgrade: UpgradeOption, isRotating: boolean): string {
    const costPerGram = upgrade.cost_per_gram;

    if (costPerGram < COST_PER_GRAM_THRESHOLDS.UNICORN) {
        return isRotating
            ? '🦄 Unicorn deal on rotating weight!'
            : '🦄 Unicorn deal - exceptional value';
    }

    if (isRotating && costPerGram < COST_PER_GRAM_THRESHOLDS.REASONABLE) {
        return '⚡ Great value on rotating weight';
    }

    if (upgrade.weight_saved > 200) {
        return costPerGram < COST_PER_GRAM_THRESHOLDS.REASONABLE
            ? '💪 Big weight savings at good value'
            : '💪 Massive weight savings';
    }

    if (costPerGram < COST_PER_GRAM_THRESHOLDS.REASONABLE) {
        return '💰 Great value upgrade';
    }

    if (upgrade.cost_added < 100) {
        return '💵 Low cost upgrade';
    }

    return '✅ Solid upgrade option';
}

/**
 * Find quick win upgrade opportunities for a baseline build
 */
export async function findQuickWins(
    baseline: BaselineBuild,
    allComponentsMap: Record<string, Component[]>
): Promise<QuickWin[]> {
    const quickWins: QuickWin[] = [];

    // For each component in the baseline
    for (const component of baseline.components) {
        // Get the component type to fetch alternatives
        const type = Object.entries(allComponentsMap).find(([_, comps]) =>
            comps.some((c) => c.id === component.id)
        )?.[0];

        if (!type) continue;

        const alternatives = allComponentsMap[type] || [];

        // Find all upgrade options
        const upgradeOptions = await findUpgradeOptions(component, alternatives);

        // Get the best option (already sorted by cost per gram)
        const bestUpgrade = upgradeOptions[0];

        if (!bestUpgrade) continue;

        // Calculate quick win score
        const score = calculateQuickWinScore(bestUpgrade, component.is_rotating);

        // Generate reason
        const reason = generateReason(bestUpgrade, component.is_rotating);

        quickWins.push({
            component,
            upgrade: bestUpgrade,
            score,
            reason,
        });
    }

    // Sort by score (best quick wins first)
    return quickWins.sort((a, b) => b.score - a.score);
}

/**
 * Get top N quick wins
 */
export async function getTopQuickWins(
    baseline: BaselineBuild,
    allComponentsMap: Record<string, Component[]>,
    limit: number = 5
): Promise<QuickWin[]> {
    const allWins = await findQuickWins(baseline, allComponentsMap);
    return allWins.slice(0, limit);
}

/**
 * Filter quick wins by criteria
 */
export function filterQuickWins(
    quickWins: QuickWin[],
    options: {
        maxCostPerGram?: number;
        minWeightSaved?: number;
        rotatingOnly?: boolean;
    }
): QuickWin[] {
    let filtered = quickWins;

    if (options.maxCostPerGram !== undefined) {
        filtered = filtered.filter(
            (qw) => qw.upgrade.cost_per_gram <= options.maxCostPerGram!
        );
    }

    if (options.minWeightSaved !== undefined) {
        filtered = filtered.filter(
            (qw) => qw.upgrade.weight_saved >= options.minWeightSaved!
        );
    }

    if (options.rotatingOnly) {
        filtered = filtered.filter((qw) => qw.component.is_rotating);
    }

    return filtered;
}

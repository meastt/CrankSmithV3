/**
 * Quick Wins Algorithm - Find the best value weight savings
 */

import type { BaselineBuild, WeightComponent } from '@/types/weight';
import type { Component } from '@/lib/types/compatibility';
import { COST_PER_GRAM_THRESHOLDS } from '@/types/weight';
import { categoryToType, findUpgradeOptions, type UpgradeOption } from './upgradeSearch';

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
        // Use canonical category mapping instead of ID lookup inference.
        const type = categoryToType(component.category);

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

/**
 * Budget optimizer: maximize grams saved under a budget cap.
 * Uses 0/1 knapsack over quick-win items (one item per category in current quick-wins list).
 */
export function optimizeQuickWinsForBudget(
    quickWins: QuickWin[],
    budgetDollars: number
): {
    selected: QuickWin[];
    totalCost: number;
    totalWeightSaved: number;
    avgCostPerGram: number;
} {
    const budget = Math.max(0, Math.round(budgetDollars));
    if (budget === 0 || quickWins.length === 0) {
        return { selected: [], totalCost: 0, totalWeightSaved: 0, avgCostPerGram: 0 };
    }

    // Safety: ensure at most one option per category reaches the optimizer.
    const byCategory = new Map<string, QuickWin>();
    for (const win of quickWins) {
        const key = win.component.category;
        const existing = byCategory.get(key);
        if (!existing || win.score > existing.score) {
            byCategory.set(key, win);
        }
    }
    const candidates = Array.from(byCategory.values());

    const n = candidates.length;
    const dp: number[][] = Array.from({ length: n + 1 }, () => Array(budget + 1).fill(0));
    const keep: boolean[][] = Array.from({ length: n + 1 }, () => Array(budget + 1).fill(false));

    for (let i = 1; i <= n; i += 1) {
        const item = candidates[i - 1];
        const cost = Math.max(0, Math.round(item.upgrade.cost_added));
        const value = Math.max(0, Math.round(item.upgrade.weight_saved));

        for (let b = 0; b <= budget; b += 1) {
            const skip = dp[i - 1][b];
            let take = -1;

            if (cost <= b) {
                take = dp[i - 1][b - cost] + value;
            }

            if (take > skip) {
                dp[i][b] = take;
                keep[i][b] = true;
            } else {
                dp[i][b] = skip;
            }
        }
    }

    const selected: QuickWin[] = [];
    let b = budget;
    for (let i = n; i >= 1; i -= 1) {
        if (!keep[i][b]) continue;
        const item = candidates[i - 1];
        selected.push(item);
        b -= Math.max(0, Math.round(item.upgrade.cost_added));
    }

    selected.reverse();
    const totalCost = selected.reduce((sum, qw) => sum + Math.max(0, qw.upgrade.cost_added), 0);
    const totalWeightSaved = selected.reduce((sum, qw) => sum + Math.max(0, qw.upgrade.weight_saved), 0);
    const avgCostPerGram = totalWeightSaved > 0 ? totalCost / totalWeightSaved : 0;

    return { selected, totalCost, totalWeightSaved, avgCostPerGram };
}

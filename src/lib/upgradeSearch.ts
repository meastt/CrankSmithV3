/**
 * Utilities for finding upgrade options and calculating cost per gram
 */

import type { Component } from '@/lib/types/compatibility';
import type { WeightComponent, ComponentCategory, Upgrade } from '@/types/weight';
import { TYPE_TO_CATEGORY_MAP } from './weightConversion';

export interface UpgradeOption {
    component: Component;
    weight_saved: number;
    cost_added: number;
    cost_per_gram: number;
    is_upgrade: boolean; // true if lighter, false if heavier
}

/**
 * Fetch all components of a given type from the API
 */
export async function fetchComponentsByType(type: string): Promise<Component[]> {
    try {
        const res = await fetch(`/api/components?type=${type}`);
        if (!res.ok) throw new Error('Failed to fetch components');
        return await res.json();
    } catch (error) {
        console.error(`Error fetching components of type ${type}:`, error);
        return [];
    }
}

/**
 * Convert component type to category (inverse of TYPE_TO_CATEGORY_MAP)
 */
export function categoryToType(category: ComponentCategory): string | null {
    // Find the type that maps to this category
    for (const [type, cat] of Object.entries(TYPE_TO_CATEGORY_MAP)) {
        if (cat === category) return type;
    }
    return null;
}

/**
 * Find upgrade options for a baseline component
 */
export async function findUpgradeOptions(
    baselineComponent: WeightComponent,
    allComponents: Component[]
): Promise<UpgradeOption[]> {
    const baselineCost = baselineComponent.cost || 0;
    const options: UpgradeOption[] = [];

    for (const component of allComponents) {
        // Skip the baseline component itself
        if (component.id === baselineComponent.id) continue;

        // Extract weight and cost
        const weight = component.attributes.weight_g || component.attributes.weight || 0;
        const cost = component.attributes.price_msrp || component.attributes.price || 0;

        // Skip components without weight data
        if (weight === 0) continue;

        // Calculate differences
        const weight_saved = baselineComponent.weight - weight;
        const cost_added = cost - baselineCost;

        // Only show options that save weight
        if (weight_saved <= 0) continue;

        // Calculate cost per gram (handle edge cases)
        const cost_per_gram = cost_added > 0 ? cost_added / weight_saved : 0;

        options.push({
            component,
            weight_saved,
            cost_added,
            cost_per_gram,
            is_upgrade: weight_saved > 0,
        });
    }

    // Sort by cost per gram (best value first)
    return options.sort((a, b) => a.cost_per_gram - b.cost_per_gram);
}

/**
 * Convert an UpgradeOption to an Upgrade for the store
 */
export function upgradeOptionToUpgrade(
    option: UpgradeOption,
    baselineComponent: WeightComponent
): Upgrade {
    const component = option.component;
    const weight = component.attributes.weight_g || component.attributes.weight || 0;
    const cost = component.attributes.price_msrp || component.attributes.price || 0;

    // Extract brand from name
    const nameParts = component.name.split(' ');
    const brand = nameParts.length > 1 ? nameParts[0] : 'Unknown';

    const newComponent: WeightComponent = {
        id: component.id,
        category: baselineComponent.category,
        name: component.name,
        brand,
        weight,
        cost,
        is_rotating: baselineComponent.is_rotating,
    };

    return {
        category: baselineComponent.category,
        old_component: baselineComponent,
        new_component: newComponent,
        weight_saved: option.weight_saved,
        cost_added: option.cost_added,
        cost_per_gram: option.cost_per_gram,
        is_rotating: baselineComponent.is_rotating,
    };
}

export { TYPE_TO_CATEGORY_MAP };

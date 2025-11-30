/**
 * Utilities to convert between Builder components and Weight Weenies types
 */

import type { Component } from '@/lib/validation';
import type { BaselineBuild, WeightComponent, ComponentCategory } from '@/types/weight';
import { ROTATING_WEIGHT_CATEGORIES } from '@/types/weight';

// Map Builder component types to Weight category types
export const TYPE_TO_CATEGORY_MAP: Record<string, ComponentCategory> = {
    'Frame': 'frame',
    'Fork': 'fork',
    'Wheel': 'wheels',
    'Tire': 'tires',
    'Tubes': 'tubes',
    'BottomBracket': 'bottom_bracket',
    'Crankset': 'crankset',
    'Cassette': 'cassette',
    'Chain': 'chain',
    'RearDerailleur': 'derailleur',
    'Derailleur': 'derailleur',
    'Shifter': 'shifter',
    'Brakes': 'brakes',
    'Rotors': 'rotors',
    'Handlebars': 'handlebars',
    'Stem': 'stem',
    'Seatpost': 'seatpost',
    'Saddle': 'saddle',
    'Pedals': 'pedals',
};

/**
 * Convert a Builder Component to a Weight Component
 */
export function builderComponentToWeightComponent(
    component: Component,
    type: string
): WeightComponent | null {
    const category = TYPE_TO_CATEGORY_MAP[type];
    if (!category) {
        console.warn(`Unknown component type: ${type}`);
        return null;
    }

    // Extract weight from attributes
    const weight = component.attributes.weight_g || component.attributes.weight || 0;
    if (weight === 0) {
        console.warn(`Component ${component.name} has no weight`);
    }

    // Extract brand from name (if available)
    const nameParts = component.name.split(' ');
    const brand = nameParts.length > 1 ? nameParts[0] : 'Unknown';

    // Determine if this is rotating weight
    const isRotating = ROTATING_WEIGHT_CATEGORIES.includes(category);

    // Cost might not be available yet - that's okay
    const cost = component.attributes.price_msrp || component.attributes.cost || undefined;

    return {
        id: component.id,
        category,
        name: component.name,
        brand,
        weight: Number(weight),
        cost: cost ? Number(cost) : undefined,
        is_rotating: isRotating,
    };
}

/**
 * Convert a Builder build (from buildStore) to a BaselineBuild
 */
export function builderPartsToBaselineBuild(
    parts: Record<string, Component | null>,
    buildName?: string
): BaselineBuild | null {
    const components: WeightComponent[] = [];

    // Convert all non-null parts
    for (const [type, component] of Object.entries(parts)) {
        if (component) {
            const weightComp = builderComponentToWeightComponent(component, type);
            if (weightComp) {
                components.push(weightComp);
            }
        }
    }

    // Need at least some components
    if (components.length === 0) {
        return null;
    }

    // Calculate totals
    const total_weight = components.reduce((sum, c) => sum + c.weight, 0);
    const total_cost = components.reduce((sum, c) => sum + (c.cost || 0), 0);

    return {
        id: `build-${Date.now()}`,
        name: buildName || 'Imported Build',
        components,
        total_weight,
        total_cost,
    };
}

/**
 * Get a default empty baseline build structure
 */
export function createEmptyBaselineBuild(name: string = 'My Build'): BaselineBuild {
    return {
        id: `build-${Date.now()}`,
        name,
        components: [],
        total_weight: 0,
        total_cost: 0,
    };
}

/**
 * Add a component to a baseline build
 */
export function addComponentToBaseline(
    baseline: BaselineBuild,
    component: WeightComponent
): BaselineBuild {
    // Remove any existing component of same category
    const filtered = baseline.components.filter((c) => c.category !== component.category);

    const newComponents = [...filtered, component];
    const total_weight = newComponents.reduce((sum, c) => sum + c.weight, 0);
    const total_cost = newComponents.reduce((sum, c) => sum + (c.cost || 0), 0);

    return {
        ...baseline,
        components: newComponents,
        total_weight,
        total_cost,
    };
}

/**
 * Remove a component from a baseline build
 */
export function removeComponentFromBaseline(
    baseline: BaselineBuild,
    category: ComponentCategory
): BaselineBuild {
    const newComponents = baseline.components.filter((c) => c.category !== category);
    const total_weight = newComponents.reduce((sum, c) => sum + c.weight, 0);
    const total_cost = newComponents.reduce((sum, c) => sum + (c.cost || 0), 0);

    return {
        ...baseline,
        components: newComponents,
        total_weight,
        total_cost,
    };
}

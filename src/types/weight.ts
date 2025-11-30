/**
 * Types for Weight Weenies (The Scale) feature
 */

export interface WeightComponent {
    id: string;
    category: ComponentCategory;
    name: string;
    brand: string;
    weight: number; // in grams
    cost?: number; // in dollars
    is_rotating: boolean;
}

export type ComponentCategory =
    | 'frame'
    | 'fork'
    | 'wheels'
    | 'tires'
    | 'cassette'
    | 'chain'
    | 'crankset'
    | 'bottom_bracket'
    | 'derailleur'
    | 'shifter'
    | 'brakes'
    | 'rotors'
    | 'handlebars'
    | 'stem'
    | 'seatpost'
    | 'saddle'
    | 'pedals'
    | 'tubes'
    | 'accessories';

export interface BaselineBuild {
    id: string;
    name: string;
    discipline?: 'road' | 'gravel' | 'mtb';
    components: WeightComponent[];
    total_weight: number;
    total_cost: number;
}

export interface Upgrade {
    category: ComponentCategory;
    old_component: WeightComponent;
    new_component: WeightComponent;
    weight_saved: number;
    cost_added: number;
    cost_per_gram: number;
    is_rotating: boolean;
}

export interface TargetBuild {
    baseline_id: string;
    upgrades: Upgrade[];
    new_total_weight: number;
    total_weight_saved: number;
    total_cost_added: number;
    avg_cost_per_gram: number;
}

export interface CategoryBreakdown {
    category: ComponentCategory;
    display_name: string;
    weight: number;
    percentage: number;
    is_rotating: boolean;
    components: WeightComponent[];
}

// Cost per gram rating thresholds
export const COST_PER_GRAM_THRESHOLDS = {
    UNICORN: 1, // Under $1/gram
    REASONABLE: 5, // $1-5/gram
    EXPENSIVE: 10, // $5-10/gram
    MADNESS: Infinity, // $10+/gram
} as const;

export type CostPerGramRating = 'unicorn' | 'reasonable' | 'expensive' | 'madness';

export function getCostPerGramRating(costPerGram: number): CostPerGramRating {
    if (costPerGram < COST_PER_GRAM_THRESHOLDS.UNICORN) return 'unicorn';
    if (costPerGram < COST_PER_GRAM_THRESHOLDS.REASONABLE) return 'reasonable';
    if (costPerGram < COST_PER_GRAM_THRESHOLDS.EXPENSIVE) return 'expensive';
    return 'madness';
}

export function getCostPerGramColor(rating: CostPerGramRating): string {
    const colors = {
        unicorn: 'text-green-400 bg-green-500/10 border-green-500/20',
        reasonable: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
        expensive: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
        madness: 'text-red-400 bg-red-500/10 border-red-500/20',
    };
    return colors[rating];
}

// Category display names and groupings
export const CATEGORY_GROUPS: Record<string, ComponentCategory[]> = {
    'Frame & Fork': ['frame', 'fork'],
    'Wheels & Tires': ['wheels', 'tires', 'tubes'],
    'Drivetrain': ['crankset', 'bottom_bracket', 'chain', 'cassette', 'derailleur', 'shifter'],
    'Cockpit': ['handlebars', 'stem'],
    'Finishing Kit': ['seatpost', 'saddle', 'pedals', 'brakes', 'rotors'],
    'Accessories': ['accessories'],
};

export const ROTATING_WEIGHT_CATEGORIES: ComponentCategory[] = [
    'wheels',
    'tires',
    'tubes',
    'cassette',
    'rotors',
    'chain',
];

/**
 * Weight calculation utilities for bike builds
 *
 * Provides realistic estimated total weight by:
 * 1. Counting wheels and tires x2 (bikes have two)
 * 2. Adding category-specific "finishing kit" weights for parts not in the builder
 */

import type { Component } from './types/compatibility';

// Finishing kit weights by category (in grams)
// These represent typical weights for parts not included in the builder
// Using realistic odd numbers for more natural weight totals
export const FINISHING_KIT_WEIGHTS = {
    Road: {
        stem: 118,
        handlebars: 223,
        barTape: 58,
        seatpost: 197,
        saddle: 205,
        seatClamp: 18,
        chain: 252,
        brakeCalipers: 278, // rim or disc
        rotors: 0, // rim brake has none
        brakePads: 28,
        cables: 76,
        total: 1453, // Sum of above
    },
    'Road Disc': {
        stem: 118,
        handlebars: 223,
        barTape: 58,
        seatpost: 197,
        saddle: 205,
        seatClamp: 18,
        chain: 252,
        brakeCalipers: 298,
        rotors: 218, // 160mm front + 140mm rear
        brakePads: 38,
        cables: 97, // hydraulic hoses
        total: 1722,
    },
    Gravel: {
        stem: 127,
        handlebars: 278,
        barTape: 76,
        seatpost: 218,
        saddle: 223,
        seatClamp: 23,
        chain: 258,
        brakeCalipers: 318,
        rotors: 256, // larger rotors
        brakePads: 48,
        cables: 97,
        total: 1922,
    },
    MTB: {
        stem: 148,
        handlebars: 318,
        grips: 127,
        seatpost: 347, // dropper post
        saddle: 278,
        seatClamp: 33,
        chain: 278,
        brakeCalipers: 418, // 4-piston
        rotors: 297, // 180mm/200mm
        brakePads: 58,
        cables: 127,
        total: 2429,
    },
} as const;

export type BikeCategory = keyof typeof FINISHING_KIT_WEIGHTS;

/**
 * Determine the bike category from the frame
 */
export function getBikeCategory(frame: Component | null): BikeCategory {
    if (!frame) return 'Gravel'; // Default

    const category = frame.attributes?.category as string;
    const brakeType = frame.interfaces?.brake_type as string;

    if (category === 'MTB') return 'MTB';
    if (category === 'Gravel') return 'Gravel';
    if (category === 'Road') {
        // Check if disc or rim brake
        if (brakeType?.toLowerCase().includes('disc')) {
            return 'Road Disc';
        }
        return 'Road';
    }

    return 'Gravel'; // Default fallback
}

/**
 * Calculate the total estimated weight for a build
 */
export function calculateBuildWeight(
    parts: Record<string, Component | null>,
    category?: BikeCategory
): {
    partsWeight: number;      // Weight of selected parts
    wheelsetWeight: number;   // Wheels + tires x2
    finishingKitWeight: number; // Estimated finishing kit
    totalWeight: number;      // Grand total
    breakdown: {
        label: string;
        weight: number;
        note?: string;
    }[];
} {
    const frame = parts.Frame;
    const bikeCategory = category || getBikeCategory(frame);
    const finishingKit = FINISHING_KIT_WEIGHTS[bikeCategory];

    let partsWeight = 0;
    let wheelsetWeight = 0;
    const breakdown: { label: string; weight: number; note?: string }[] = [];

    // Calculate weight for each part
    for (const [type, part] of Object.entries(parts)) {
        if (!part) continue;

        const weight = (part.attributes?.weight_g || part.attributes?.weight || 0) as number;

        if (type === 'Wheel') {
            // Wheels come in pairs
            wheelsetWeight += weight * 2;
            breakdown.push({ label: 'Wheels (x2)', weight: weight * 2 });
        } else if (type === 'Tire') {
            // Tires come in pairs
            wheelsetWeight += weight * 2;
            breakdown.push({ label: 'Tires (x2)', weight: weight * 2 });
        } else {
            partsWeight += weight;
            breakdown.push({ label: type, weight });
        }
    }

    // Add finishing kit
    const finishingKitWeight = finishingKit?.total || FINISHING_KIT_WEIGHTS.Gravel.total;
    breakdown.push({
        label: 'Finishing Kit',
        weight: finishingKitWeight,
        note: 'Stem, bars, seatpost, saddle, brakes, chain, etc.'
    });

    const totalWeight = partsWeight + wheelsetWeight + finishingKitWeight;

    return {
        partsWeight,
        wheelsetWeight,
        finishingKitWeight,
        totalWeight,
        breakdown,
    };
}

/**
 * Format weight for display
 */
export function formatWeight(
    grams: number,
    unitSystem: 'imperial' | 'metric'
): { value: string; unit: string } {
    if (unitSystem === 'imperial') {
        const lbs = grams / 453.592;
        return { value: lbs.toFixed(1), unit: 'lbs' };
    } else {
        const kg = grams / 1000;
        return { value: kg.toFixed(2), unit: 'kg' };
    }
}

/**
 * Get finishing kit breakdown for a category
 */
export function getFinishingKitBreakdown(category: BikeCategory): {
    item: string;
    weight: number;
}[] {
    const kit = FINISHING_KIT_WEIGHTS[category];

    // Handle the grips vs barTape difference between MTB and other categories
    const gripOrTapeWeight = category === 'MTB'
        ? FINISHING_KIT_WEIGHTS.MTB.grips
        : (kit as typeof FINISHING_KIT_WEIGHTS.Road).barTape;

    return [
        { item: 'Stem', weight: kit.stem },
        { item: 'Handlebars', weight: kit.handlebars },
        { item: category === 'MTB' ? 'Grips' : 'Bar tape', weight: gripOrTapeWeight },
        { item: 'Seatpost', weight: kit.seatpost },
        { item: 'Saddle', weight: kit.saddle },
        { item: 'Seat clamp', weight: kit.seatClamp },
        { item: 'Chain', weight: kit.chain },
        { item: 'Brake calipers', weight: kit.brakeCalipers },
        ...(kit.rotors > 0 ? [{ item: 'Rotors', weight: kit.rotors }] : []),
        { item: 'Brake pads', weight: kit.brakePads },
        { item: 'Cables/housing', weight: kit.cables },
    ];
}

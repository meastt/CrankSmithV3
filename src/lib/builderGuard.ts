import { deriveDisciplineFromAttributes, normalizeDiscipline } from './discipline';

type PartLike = {
    id?: string;
    name?: string;
    discipline?: string;
    disciplineTags?: unknown;
    builderEligible?: boolean;
    attributes?: Record<string, unknown>;
    specs?: Record<string, unknown>;
};

function isBuilderCompatible(component: PartLike): boolean {
    const discipline = normalizeDiscipline(
        component.discipline ||
        component.attributes?.discipline ||
        component.specs?.category ||
        deriveDisciplineFromAttributes(component.attributes)
    );
    const builderEligible = Boolean(component.builderEligible ?? (discipline === 'gravel'));

    if (!builderEligible) return false;
    if (discipline === 'gravel') return true;
    // Accept all multi-discipline components that are builderEligible.
    // Per-type filters in PartSelector (width gates, category checks, etc.)
    // handle fine-grained gravel scoping.
    if (discipline === 'multi') return true;
    return false;
}

export function validateBuilderPartsPayload(parts: unknown): { valid: boolean; violations: string[] } {
    if (!parts || typeof parts !== 'object') {
        return { valid: false, violations: ['Invalid parts payload format'] };
    }

    const entries = Object.entries(parts as Record<string, unknown>);
    const violations: string[] = [];

    for (const [slot, value] of entries) {
        if (!value || typeof value !== 'object') continue;
        const component = value as PartLike;

        if (!isBuilderCompatible(component)) {
            const displayName = component.name || component.id || 'unknown component';
            violations.push(`${slot}: ${displayName}`);
        }
    }

    return {
        valid: violations.length === 0,
        violations
    };
}

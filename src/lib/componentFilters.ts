import { isGravelBuilderEnabled } from './featureFlags';

export interface ComponentFilterParams {
    type: string | null;
    context: string | null;
    discipline: string | null;
    builderEligible: string | null;
}

function parseBooleanQuery(value: string | null): boolean | undefined {
    if (value === null) return undefined;
    const normalized = value.trim().toLowerCase();
    if (normalized === 'true') return true;
    if (normalized === 'false') return false;
    return undefined;
}

export function buildComponentWhereClause(params: ComponentFilterParams): Record<string, unknown> {
    const { type, context, discipline, builderEligible } = params;
    const where: Record<string, unknown> = {};
    const normalizedContext = context?.trim().toLowerCase() ?? null;
    const isBuilderContext = normalizedContext === 'builder' && isGravelBuilderEnabled();

    if (type) where.type = type;
    if (!isBuilderContext && discipline) where.discipline = discipline.trim().toLowerCase();

    const explicitBuilderEligible = parseBooleanQuery(builderEligible);
    if (!isBuilderContext && explicitBuilderEligible !== undefined) {
        where.builderEligible = explicitBuilderEligible;
    }

    if (isBuilderContext) {
        where.builderEligible = true;
        // Include gravel + all multi-discipline parts.
        // Per-type filters in PartSelector (width gates, category checks, etc.)
        // already handle fine-grained gravel scoping — no need to double-gate here.
        where.discipline = { in: ['gravel', 'multi'] };
    }

    return where;
}

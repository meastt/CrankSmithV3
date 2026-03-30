export type Discipline = 'gravel' | 'road' | 'mtb' | 'multi';
export type DisciplineTag = 'gravel' | 'road' | 'mtb';

const ALLOWED_DISCIPLINES: Discipline[] = ['gravel', 'road', 'mtb', 'multi'];
const ALLOWED_TAGS: DisciplineTag[] = ['gravel', 'road', 'mtb'];

function normalizeToken(value: unknown): string {
    const token = String(value || '').trim().toLowerCase();
    if (token === 'mountain') return 'mtb';
    return token;
}

export function normalizeDiscipline(value: unknown): Discipline {
    const normalized = normalizeToken(value);
    if (ALLOWED_DISCIPLINES.includes(normalized as Discipline)) {
        return normalized as Discipline;
    }
    return 'multi';
}

export function parseDisciplineTags(value: unknown): DisciplineTag[] {
    if (!value) return [];

    let parsed: unknown = value;
    if (typeof value === 'string') {
        try {
            parsed = JSON.parse(value);
        } catch {
            parsed = value.split(',').map(v => v.trim()).filter(Boolean);
        }
    }

    if (!Array.isArray(parsed)) return [];

    const unique = new Set<DisciplineTag>();
    for (const raw of parsed) {
        const normalized = normalizeToken(raw);
        if (ALLOWED_TAGS.includes(normalized as DisciplineTag)) {
            unique.add(normalized as DisciplineTag);
        }
    }
    return Array.from(unique);
}

export function deriveDisciplineFromAttributes(attributes: unknown): Discipline | null {
    if (!attributes || typeof attributes !== 'object') return null;
    const category = (attributes as Record<string, unknown>).category;
    if (!category) return null;
    return normalizeDiscipline(category);
}

export function validateBuilderEligibility(
    discipline: Discipline,
    disciplineTags: DisciplineTag[],
    requestedBuilderEligible: boolean
): { valid: boolean; message?: string } {
    if (!requestedBuilderEligible) return { valid: true };
    if (discipline === 'gravel') return { valid: true };
    if (discipline === 'multi' && disciplineTags.includes('gravel')) return { valid: true };
    return { valid: false, message: 'builderEligible=true requires gravel discipline or multi+gravel tag' };
}

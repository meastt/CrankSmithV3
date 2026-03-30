import { validateBuilderPartsPayload } from './builderGuard';

export type BuilderMigrationStatus = 'gravel_compatible' | 'legacy_non_gravel' | 'invalid_payload';

export interface BuildMigrationAssessment {
    status: BuilderMigrationStatus;
    violations: string[];
    parts: unknown;
}

export function assessBuildForBuilderMigration(partsInput: unknown): BuildMigrationAssessment {
    if (typeof partsInput === 'string') {
        try {
            return assessBuildForBuilderMigration(JSON.parse(partsInput));
        } catch {
            return {
                status: 'invalid_payload',
                violations: ['Invalid build payload'],
                parts: null,
            };
        }
    }

    const guard = validateBuilderPartsPayload(partsInput);
    if (!guard.valid) {
        return {
            status: 'legacy_non_gravel',
            violations: guard.violations,
            parts: partsInput,
        };
    }

    return {
        status: 'gravel_compatible',
        violations: [],
        parts: partsInput,
    };
}

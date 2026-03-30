import { Validator } from './validation';
import { CompatibilityResult, ValidationIssue } from './types/compatibility';
import { validateBuilderPartsPayload } from './builderGuard';

function buildDataToParts(buildData: any): Record<string, any> {
    return {
        Frame: buildData.frame || null,
        Fork: buildData.fork || null,
        WheelFront: (buildData.wheels || [])[0] || null,
        WheelRear: (buildData.wheels || [])[1] || null,
        TireFront: (buildData.tires || [])[0] || null,
        TireRear: (buildData.tires || [])[1] || null,
        BottomBracket: buildData.bottomBracket || null,
        Crankset: buildData.crankset || null,
        Cassette: buildData.cassette || null,
        RearDerailleur: buildData.rearDerailleur || null,
        Shifter: buildData.shifter || null,
        BrakeCaliperFront: (buildData.brakes?.calipers || [])[0] || null,
        BrakeCaliperRear: (buildData.brakes?.calipers || [])[1] || null,
        BrakeRotorFront: (buildData.brakes?.rotors || [])[0] || null,
        BrakeRotorRear: (buildData.brakes?.rotors || [])[1] || null,
        Stem: buildData.cockpit?.stem || null,
        Handlebar: buildData.cockpit?.handlebar || null,
        Seatpost: buildData.cockpit?.seatpost || null
    };
}

export function validateBuilderBuild(buildData: any): CompatibilityResult {
    const baseResult = Validator.validateBuild(buildData);
    const parts = buildDataToParts(buildData);
    const builderGuard = validateBuilderPartsPayload(parts);
    const gravelAssumptionIssues = collectGravelAssumptionIssues(parts);

    if (builderGuard.valid && gravelAssumptionIssues.length === 0) return baseResult;

    const guardIssues: ValidationIssue[] = builderGuard.violations.map((violation, idx) => ({
        componentId: `builder-guard-${idx}`,
        severity: 'ERROR',
        message: `Builder gravel scope violation: ${violation}`
    }));

    const issues = [...baseResult.issues, ...guardIssues, ...gravelAssumptionIssues];
    return {
        compatible: issues.filter(i => i.severity === 'ERROR').length === 0,
        issues
    };
}

function collectGravelAssumptionIssues(parts: Record<string, any>): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    const parseWidth = (value: unknown): number | null => {
        if (value === null || value === undefined) return null;
        const parsed = parseFloat(String(value).replace(/[^0-9.]/g, ''));
        return Number.isFinite(parsed) ? parsed : null;
    };

    const normalizeWheel = (value: unknown): string => {
        const raw = String(value || '').toLowerCase();
        if (raw.includes('700') || raw === '29') return '700c';
        if (raw.includes('650') || raw.includes('27.5')) return '650b';
        return raw;
    };

    const frame = parts.Frame;
    if (frame) {
        const category = String(frame.specs?.category || frame.attributes?.category || '').toLowerCase();
        if (category && category !== 'gravel') {
            issues.push({
                componentId: frame.id || 'frame',
                severity: 'ERROR',
                message: `Builder gravel scope violation: frame category "${category}" is not supported in gravel mode`
            });
        }
    }

    const wheelFront = parts.WheelFront;
    const wheelRear = parts.WheelRear;
    [wheelFront, wheelRear].forEach((wheel, index) => {
        if (!wheel) return;
        const size = normalizeWheel(wheel.specs?.diameter || wheel.specs?.wheel_size || wheel.attributes?.wheel_size);
        if (size && !['700c', '650b'].includes(size)) {
            issues.push({
                componentId: wheel.id || `wheel-${index}`,
                severity: 'ERROR',
                message: `Builder gravel scope violation: wheel size "${size}" is outside gravel-supported standards (700c/650b)`
            });
        }
    });

    const tireFront = parts.TireFront;
    const tireRear = parts.TireRear;
    [tireFront, tireRear].forEach((tire, index) => {
        if (!tire) return;
        const width = parseWidth(tire.specs?.width || tire.attributes?.width || tire.widthMM);
        if (width !== null && width < 38) {
            issues.push({
                componentId: tire.id || `tire-${index}`,
                severity: 'WARNING',
                message: `Builder gravel assumption: tire width ${width}mm is narrower than typical gravel fit (38mm minimum recommended)`
            });
        }
    });

    return issues;
}

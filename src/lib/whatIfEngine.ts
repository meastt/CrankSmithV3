import { calculateSpeed, calculateWheelCircumference } from './gearCalculations';

export interface WhatIfSetup {
    chainrings: number[];
    cassetteRange: string;
    tireSize: number;
    wheelSize: number;
}

export interface WhatIfInput {
    baseline: WhatIfSetup;
    candidate: WhatIfSetup;
    ftp: number;
    riderWeightKg: number;
    cadenceRpm?: number;
    climbGradePercent?: number;
}

export interface WhatIfDelta {
    topSpeedDeltaKph: number;
    cadenceDeltaRpmAtGrade: number;
    pressureHintDeltaPct: number;
}

function finiteOrDefault(value: number | undefined, fallback: number): number {
    if (typeof value !== 'number' || !Number.isFinite(value)) return fallback;
    return value;
}

function sanitizeChainrings(chainrings: number[]): number[] {
    const valid = chainrings.filter((ring) => Number.isFinite(ring) && ring > 0);
    return valid.length > 0 ? valid : [1];
}

function sanitizeSetup(setup: WhatIfSetup): WhatIfSetup {
    return {
        ...setup,
        chainrings: sanitizeChainrings(setup.chainrings),
        tireSize: Math.max(1, finiteOrDefault(setup.tireSize, 1)),
        wheelSize: Math.max(1, finiteOrDefault(setup.wheelSize, 622)),
    };
}

function smallestCog(cassetteRange: string): number {
    const [min, max] = cassetteRange.split('-').map((n) => parseInt(n));
    if (!isNaN(min) && !isNaN(max)) return Math.min(min, max);
    return 11;
}

function cadenceAtGrade(setup: WhatIfSetup, ftp: number, riderWeightKg: number, gradePercent: number): number {
    const [, maxCog] = setup.cassetteRange.split('-').map(n => parseInt(n));
    if (!maxCog || gradePercent <= 0 || riderWeightKg <= 0 || ftp <= 0) return 0;

    const easiestRatio = Math.min(...setup.chainrings) / maxCog;
    const circMeters = calculateWheelCircumference(setup.wheelSize, setup.tireSize) / 1000;
    if (easiestRatio <= 0 || circMeters <= 0) return 0;

    const wKg = ftp / riderWeightKg;
    const gradeDecimal = gradePercent / 100;
    const speedMs = wKg / (9.81 * gradeDecimal);
    return Math.max(0, (speedMs / (easiestRatio * circMeters)) * 60);
}

function topSpeed(setup: WhatIfSetup, cadenceRpm: number): number {
    const cog = smallestCog(setup.cassetteRange);
    const ratio = Math.max(...setup.chainrings) / cog;
    const circumference = calculateWheelCircumference(setup.wheelSize, setup.tireSize);
    return calculateSpeed(ratio, circumference, cadenceRpm);
}

export function computeUnifiedWhatIf(input: WhatIfInput): WhatIfDelta {
    const cadence = Math.max(1, finiteOrDefault(input.cadenceRpm, 90));
    const climbGrade = Math.max(0, finiteOrDefault(input.climbGradePercent, 8));
    const ftp = Math.max(0, finiteOrDefault(input.ftp, 0));
    const riderWeightKg = Math.max(0, finiteOrDefault(input.riderWeightKg, 0));
    const baseline = sanitizeSetup(input.baseline);
    const candidate = sanitizeSetup(input.candidate);

    const topA = topSpeed(baseline, cadence);
    const topB = topSpeed(candidate, cadence);
    const cadA = cadenceAtGrade(baseline, ftp, riderWeightKg, climbGrade);
    const cadB = cadenceAtGrade(candidate, ftp, riderWeightKg, climbGrade);
    const pressureHint = ((baseline.tireSize - candidate.tireSize) / Math.max(1, baseline.tireSize)) * 100;

    return {
        topSpeedDeltaKph: topB - topA,
        cadenceDeltaRpmAtGrade: cadB - cadA,
        pressureHintDeltaPct: pressureHint
    };
}

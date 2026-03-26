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
    const cadence = input.cadenceRpm ?? 90;
    const climbGrade = input.climbGradePercent ?? 8;

    const topA = topSpeed(input.baseline, cadence);
    const topB = topSpeed(input.candidate, cadence);
    const cadA = cadenceAtGrade(input.baseline, input.ftp, input.riderWeightKg, climbGrade);
    const cadB = cadenceAtGrade(input.candidate, input.ftp, input.riderWeightKg, climbGrade);
    const pressureHint = ((input.baseline.tireSize - input.candidate.tireSize) / Math.max(1, input.baseline.tireSize)) * 100;

    return {
        topSpeedDeltaKph: topB - topA,
        cadenceDeltaRpmAtGrade: cadB - cadA,
        pressureHintDeltaPct: pressureHint
    };
}

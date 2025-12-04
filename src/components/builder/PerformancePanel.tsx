'use client';

import React from 'react';
import { useBuildStore } from '@/store/buildStore';
import { useSettingsStore } from '@/store/settingsStore';
import { Scale, Gauge, Mountain, Settings2, Zap } from 'lucide-react';
import {
    getAllGearRatios,
    getSpeedRange,
    calculateClimbingIndex,
    parseCassetteRange,
} from '@/lib/gearCalculations';
import { toSpeed, speedUnit, toWeight, weightUnit } from '@/lib/unitConversions';

export const PerformancePanel: React.FC = () => {
    const { parts, cadence, totalWeight, setCadence } = useBuildStore();
    const { unitSystem, toggleUnitSystem } = useSettingsStore();

    const crank = parts.Crankset;
    const cassette = parts.Cassette;

    const chainrings =
        (crank as any)?.attributes?.chainring_small && (crank as any).attributes.chainring_small !== 0
            ? [(crank as any).attributes.chainring_large as number, (crank as any).attributes.chainring_small as number]
            : (crank as any)?.attributes?.chainring_large
                ? [(crank as any).attributes.chainring_large as number]
                : [];

    const cassetteCogs =
        (cassette as any)?.attributes?.largest_cog && (cassette as any).attributes.diff
            ? parseCassetteRange(
                (cassette as any).attributes.largest_cog as number,
                ((cassette as any).attributes.largest_cog as number) - ((cassette as any).attributes.diff as number)
            )
            : [];

    const hasGears = chainrings.length > 0 && cassetteCogs.length > 0;

    let gears: ReturnType<typeof getAllGearRatios> = [];
    let speedRange: ReturnType<typeof getSpeedRange> | null = null;
    let climbingIndex = 0;

    if (hasGears) {
        gears = getAllGearRatios(chainrings, cassetteCogs);
        speedRange = getSpeedRange(chainrings, cassetteCogs, cadence);
        climbingIndex = calculateClimbingIndex(gears[0].ratio);
    }

    const weightDisplay = toWeight(totalWeight / 1000, unitSystem).toFixed(2);
    const weightLabel = weightUnit(unitSystem);

    const speedLabel = speedUnit(unitSystem);

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-5 border-b border-white/5 flex justify-between items-start">
                <div>
                    <h2 className="text-lg font-semibold text-stone-100">Performance</h2>
                    <p className="text-xs text-stone-500 mt-0.5">Real-time build metrics</p>
                </div>
                <button
                    onClick={toggleUnitSystem}
                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-medium text-stone-400 hover:text-stone-200 transition-colors border border-white/5"
                >
                    {unitSystem === 'imperial' ? 'US' : 'METRIC'}
                </button>
            </div>

            {/* Metrics */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Weight Card */}
                <div className="bg-white/[0.02] rounded-xl p-4 border border-white/5">
                    <div className="flex items-center gap-2 text-stone-500 mb-3">
                        <Scale className="w-4 h-4" />
                        <span className="text-xs font-semibold uppercase tracking-wider">Total Weight</span>
                    </div>
                    <div className="text-3xl font-bold text-stone-100 font-mono">
                        {totalWeight > 0 ? (
                            <>
                                {weightDisplay}
                                <span className="text-base text-stone-500 font-medium ml-1">{weightLabel}</span>
                            </>
                        ) : (
                            <span className="text-lg text-stone-600">--</span>
                        )}
                    </div>
                </div>

                {/* Cadence Slider */}
                <div className="bg-white/[0.02] rounded-xl p-4 border border-white/5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-stone-500">
                            <Gauge className="w-4 h-4" />
                            <span className="text-xs font-semibold uppercase tracking-wider">Cadence</span>
                        </div>
                        <span className="text-lg font-bold text-primary font-mono">
                            {cadence} <span className="text-xs text-stone-500 font-normal">RPM</span>
                        </span>
                    </div>
                    <input
                        type="range"
                        min="60"
                        max="120"
                        value={cadence}
                        onChange={(e) => setCadence(Number(e.target.value))}
                        className="w-full"
                    />
                    <div className="flex justify-between text-[10px] text-stone-600 mt-2 font-mono">
                        <span>60</span>
                        <span>90</span>
                        <span>120</span>
                    </div>
                </div>

                {hasGears ? (
                    <>
                        {/* Gearing Stats */}
                        <div className="bg-white/[0.02] rounded-xl p-4 border border-white/5">
                            <div className="flex items-center gap-2 text-stone-500 mb-4">
                                <Settings2 className="w-4 h-4" />
                                <span className="text-xs font-semibold uppercase tracking-wider">Gearing</span>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-stone-500">Lowest Gear</span>
                                    <span className="font-mono text-sm font-medium text-stone-200 bg-white/5 px-2 py-1 rounded-lg">
                                        {gears[0].chainring}/{gears[0].cog}
                                        <span className="text-stone-500 text-xs ml-1">({gears[0].ratio.toFixed(2)})</span>
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-stone-500">Highest Gear</span>
                                    <span className="font-mono text-sm font-medium text-stone-200 bg-white/5 px-2 py-1 rounded-lg">
                                        {gears[gears.length - 1].chainring}/{gears[gears.length - 1].cog}
                                        <span className="text-stone-500 text-xs ml-1">({gears[gears.length - 1].ratio.toFixed(2)})</span>
                                    </span>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-white/5">
                                    <span className="text-xs text-stone-500">Total Gears</span>
                                    <span className="text-base font-bold text-stone-100">{gears.length}</span>
                                </div>
                            </div>
                        </div>

                        {/* Speed Range */}
                        {speedRange && (
                            <div className="bg-white/[0.02] rounded-xl p-4 border border-white/5">
                                <div className="flex items-center gap-2 text-stone-500 mb-4">
                                    <Zap className="w-4 h-4" />
                                    <span className="text-xs font-semibold uppercase tracking-wider">
                                        Speed @ {cadence} RPM
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-stone-500 mb-1">Min</p>
                                        <p className="text-xl font-bold text-stone-100 font-mono">
                                            {toSpeed(speedRange.min, unitSystem).toFixed(1)}
                                            <span className="text-xs text-stone-500 font-normal ml-1">{speedLabel}</span>
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-stone-500 mb-1">Max</p>
                                        <p className="text-xl font-bold text-stone-100 font-mono">
                                            {toSpeed(speedRange.max, unitSystem).toFixed(1)}
                                            <span className="text-xs text-stone-500 font-normal ml-1">{speedLabel}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Climbing Index */}
                        <div className="bg-white/[0.02] rounded-xl p-4 border border-white/5">
                            <div className="flex items-center gap-2 text-stone-500 mb-3">
                                <Mountain className="w-4 h-4" />
                                <span className="text-xs font-semibold uppercase tracking-wider">Climbing Ease</span>
                            </div>
                            <div className="flex items-end gap-3 mb-3">
                                <span className="text-3xl font-bold text-emerald-400 font-mono">
                                    {(climbingIndex * 100).toFixed(0)}
                                </span>
                                <span className="text-sm text-stone-500 mb-1">/ 100</span>
                            </div>
                            <div className="relative">
                                <div className="w-full bg-stone-800 rounded-full h-2 overflow-hidden">
                                    <div
                                        className="bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                                        style={{ width: `${Math.min((climbingIndex * 100) / 1.2, 100)}%` }}
                                    />
                                </div>
                                <div className="flex justify-between text-[10px] text-stone-600 mt-1">
                                    <span>Hard</span>
                                    <span>Easy</span>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="bg-white/[0.02] border border-dashed border-white/10 rounded-xl p-8 text-center">
                        <Settings2 className="w-10 h-10 mx-auto text-stone-700 mb-3" />
                        <p className="text-sm text-stone-500">
                            Select a crank and cassette to see performance metrics
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

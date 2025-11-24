'use client';

import React from 'react';
import { useBuildStore } from '@/store/buildStore';
import { Weight, Gauge, Mountain, Settings2 } from 'lucide-react';
import {
    getAllGearRatios,
    getSpeedRange,
    calculateClimbingIndex,
    parseCassetteRange,
} from '@/lib/gearCalculations';
import { GearChart } from './GearChart';

export const PerformancePanel: React.FC = () => {
    const { parts, cadence, totalWeight, unitSystem, setCadence, toggleUnits } = useBuildStore();

    const crank = parts.Crank;
    const cassette = parts.Cassette;

    // Extract chainrings from crank
    const chainrings =
        crank?.attributes.chainring_small && crank.attributes.chainring_small !== 0
            ? [crank.attributes.chainring_large as number, crank.attributes.chainring_small as number]
            : crank?.attributes.chainring_large
                ? [crank.attributes.chainring_large as number]
                : [];

    // Extract cassette cogs
    const cassetteCogs =
        cassette?.attributes.largest_cog && cassette.attributes.diff
            ? parseCassetteRange(
                cassette.attributes.largest_cog as number,
                (cassette.attributes.largest_cog as number) - (cassette.attributes.diff as number)
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

    // Convert units
    const weightDisplay = unitSystem === 'imperial'
        ? (totalWeight / 453.592).toFixed(2) // grams to lbs
        : (totalWeight / 1000).toFixed(2); // grams to kg
    const weightUnit = unitSystem === 'imperial' ? 'lbs' : 'kg';

    const convertSpeed = (kmh: number) => {
        return unitSystem === 'imperial' ? kmh * 0.621371 : kmh; // km/h to mph
    };
    const speedUnit = unitSystem === 'imperial' ? 'mph' : 'km/h';

    return (
        <div className="w-80 bg-gray-900/95 backdrop-blur-xl border-l border-white/10 h-screen overflow-y-auto flex flex-col shadow-2xl z-20">
            <div className="p-6 border-b border-white/10 flex justify-between items-start">
                <div>
                    <h2 className="text-xl font-bold text-white tracking-tight">Performance</h2>
                    <p className="text-xs text-gray-500 mt-1">Real-time build metrics</p>
                </div>
                <button
                    onClick={toggleUnits}
                    className="px-2 py-1 bg-white/5 hover:bg-white/10 rounded text-[10px] font-semibold text-gray-400 hover:text-white transition-colors border border-white/5"
                >
                    {unitSystem === 'imperial' ? 'US' : 'METRIC'}
                </button>
            </div>

            <div className="p-4 space-y-4">
                {/* Weight */}
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <div className="flex items-center mb-2 text-gray-400">
                        <Weight className="w-4 h-4 mr-2" />
                        <span className="text-xs font-bold uppercase tracking-wider">Total Weight</span>
                    </div>
                    <div className="text-3xl font-bold text-white tracking-tight">
                        {totalWeight > 0 ? (
                            <>
                                {weightDisplay} <span className="text-sm text-gray-500 font-medium">{weightUnit}</span>
                            </>
                        ) : (
                            <span className="text-lg text-gray-600">--</span>
                        )}
                    </div>
                </div>

                {/* Cadence Slider */}
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center text-gray-400">
                            <Gauge className="w-4 h-4 mr-2" />
                            <span className="text-xs font-bold uppercase tracking-wider">Cadence</span>
                        </div>
                        <span className="text-lg font-bold text-blue-400">{cadence} <span className="text-xs text-gray-500">RPM</span></span>
                    </div>
                    <input
                        type="range"
                        min="60"
                        max="120"
                        value={cadence}
                        onChange={(e) => setCadence(Number(e.target.value))}
                        className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-all"
                    />
                    <div className="flex justify-between text-[10px] text-gray-600 mt-2 font-mono">
                        <span>60</span>
                        <span>90</span>
                        <span>120</span>
                    </div>
                </div>

                {/* Gearing Info */}
                {hasGears ? (
                    <>
                        <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                            <div className="flex items-center mb-3 text-gray-400">
                                <Settings2 className="w-4 h-4 mr-2" />
                                <span className="text-xs font-bold uppercase tracking-wider">Gearing Stats</span>
                            </div>

                            <div className="space-y-2.5">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-500">Lowest Gear</span>
                                    <span className="font-mono text-sm font-medium text-gray-200 bg-white/5 px-1.5 py-0.5 rounded">
                                        {gears[0].chainring}/{gears[0].cog} <span className="text-gray-500 text-xs">({gears[0].ratio.toFixed(2)})</span>
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-500">Highest Gear</span>
                                    <span className="font-mono text-sm font-medium text-gray-200 bg-white/5 px-1.5 py-0.5 rounded">
                                        {gears[gears.length - 1].chainring}/{gears[gears.length - 1].cog} <span className="text-gray-500 text-xs">({gears[gears.length - 1].ratio.toFixed(2)})</span>
                                    </span>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-white/5">
                                    <span className="text-xs text-gray-500">Total Gears</span>
                                    <span className="text-sm font-bold text-white">{gears.length}</span>
                                </div>
                            </div>
                        </div>

                        {/* Speed Range */}
                        {speedRange && (
                            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Speed @ {cadence} RPM</div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-xs text-gray-500">Min Speed</span>
                                        <span className="text-lg font-bold text-white">{convertSpeed(speedRange.min).toFixed(1)} <span className="text-xs text-gray-500 font-normal">{speedUnit}</span></span>
                                    </div>
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-xs text-gray-500">Max Speed</span>
                                        <span className="text-lg font-bold text-white">{convertSpeed(speedRange.max).toFixed(1)} <span className="text-xs text-gray-500 font-normal">{speedUnit}</span></span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Climbing Index */}
                        <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                            <div className="flex items-center mb-2 text-gray-400">
                                <Mountain className="w-4 h-4 mr-2" />
                                <span className="text-xs font-bold uppercase tracking-wider">Climbing Ease</span>
                            </div>
                            <div className="text-3xl font-bold text-emerald-400 mb-3">
                                {(climbingIndex * 100).toFixed(1)}
                            </div>
                            <div className="space-y-1.5">
                                <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                                    <div
                                        className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                                        style={{ width: `${Math.min((climbingIndex * 100) / 1.5, 100)}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between text-[10px] text-gray-500 pt-1">
                                    <span>Hard</span>
                                    <span>Easy</span>
                                </div>
                            </div>
                        </div>

                        {/* Gear Chart */}
                        <div className="pt-2">
                            <GearChart chainrings={chainrings} cassetteCogs={cassetteCogs} />
                        </div>
                    </>
                ) : (
                    <div className="bg-white/5 border border-white/5 border-dashed p-6 rounded-xl text-center">
                        <Settings2 className="w-8 h-8 mx-auto text-gray-600 mb-2" />
                        <p className="text-sm text-gray-400">Select a crank and cassette to see performance metrics</p>
                    </div>
                )}
            </div>

            {/* Save Build Button */}
            <div className="p-4 border-t border-white/10 mt-auto bg-gray-900/95 backdrop-blur-xl sticky bottom-0">
                <button
                    onClick={async () => {
                        const name = prompt("Name your build:");
                        if (!name) return;

                        try {
                            const res = await fetch('/api/builds', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ name, parts }),
                            });
                            if (res.ok) {
                                alert("Build saved!");
                            } else {
                                alert("Failed to save. Please sign in.");
                            }
                        } catch (e) {
                            console.error(e);
                            alert("Error saving build.");
                        }
                    }}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold transition-colors flex items-center justify-center"
                >
                    Save to Garage
                </button>
            </div>
        </div>
    );
};

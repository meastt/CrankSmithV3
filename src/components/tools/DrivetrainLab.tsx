'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Activity, ArrowRight, TrendingUp, Settings2, Zap, Mountain, ChevronDown } from 'lucide-react';
import {
    getAllGearRatios,
    calculateSpeed,
    calculateClimbingIndex,
    parseCassetteRange,
    calculateWheelCircumference
} from '@/lib/gearCalculations';
import { toSpeed, speedUnit } from '@/lib/unitConversions';
import { useSettingsStore } from '@/store/settingsStore';

// --- Types ---

interface Setup {
    id: string;
    name: string;
    chainrings: number[];
    cassetteRange: string; // e.g. "10-33"
    tireSize: number; // mm, e.g. 28
    wheelSize: number; // mm diameter, e.g. 622
}

const PRESETS: Record<string, Omit<Setup, 'id'>> = {
    'road-compact': {
        name: 'Road Compact (Endurance)',
        chainrings: [50, 34],
        cassetteRange: '11-34',
        tireSize: 28,
        wheelSize: 622
    },
    'road-semi': {
        name: 'Road Semi-Compact (Race)',
        chainrings: [52, 36],
        cassetteRange: '11-30',
        tireSize: 28,
        wheelSize: 622
    },
    'road-pro': {
        name: 'Road Pro (Speed)',
        chainrings: [54, 40],
        cassetteRange: '11-28',
        tireSize: 25,
        wheelSize: 622
    },
    'gravel-2x': {
        name: 'Gravel 2x (Adventure)',
        chainrings: [48, 31],
        cassetteRange: '11-34',
        tireSize: 40,
        wheelSize: 622
    },
    'gravel-1x': {
        name: 'Gravel 1x (Simplicity)',
        chainrings: [40],
        cassetteRange: '10-44',
        tireSize: 42,
        wheelSize: 622
    },
    'gravel-mullet': {
        name: 'Gravel Mullet (Climbing)',
        chainrings: [42],
        cassetteRange: '10-52',
        tireSize: 45,
        wheelSize: 622
    },
};

// --- Helper Components ---

const SetupSelector = ({ label, setup, onChange, color }: { label: string, setup: Setup, onChange: (s: Setup) => void, color: string }) => {
    const [isOpen, setIsOpen] = useState(false);

    const applyPreset = (key: string) => {
        onChange({ ...setup, ...PRESETS[key], name: PRESETS[key].name });
        setIsOpen(false);
    };

    return (
        <div className="bg-stone-900/50 border border-white/5 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
                <span className={`text-xs font-bold uppercase tracking-wider ${color}`}>{label}</span>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="text-xs text-stone-500 hover:text-white flex items-center gap-1"
                >
                    Load Preset <ChevronDown className="w-3 h-3" />
                </button>
            </div>

            {isOpen && (
                <div className="mb-4 grid grid-cols-2 gap-2">
                    {Object.entries(PRESETS).map(([key, preset]) => (
                        <button
                            key={key}
                            onClick={() => applyPreset(key)}
                            className="text-left text-xs p-2 rounded bg-white/5 hover:bg-white/10 text-stone-300 truncate"
                        >
                            {preset.name}
                        </button>
                    ))}
                </div>
            )}

            <div className="space-y-3">
                <div>
                    <label className="text-[10px] text-stone-500 uppercase">Chainrings</label>
                    <input
                        type="text"
                        value={setup.chainrings.join('/')}
                        onChange={(e) => {
                            const val = e.target.value;
                            const rings = val.split('/').map(n => parseInt(n)).filter(n => !isNaN(n));
                            if (rings.length > 0) onChange({ ...setup, chainrings: rings });
                        }}
                        className="w-full bg-black/30 border border-white/10 rounded px-2 py-1 text-sm font-mono text-white"
                    />
                </div>
                <div>
                    <label className="text-[10px] text-stone-500 uppercase">Cassette Range</label>
                    <input
                        type="text"
                        value={setup.cassetteRange}
                        onChange={(e) => onChange({ ...setup, cassetteRange: e.target.value })}
                        className="w-full bg-black/30 border border-white/10 rounded px-2 py-1 text-sm font-mono text-white"
                    />
                </div>
                <div>
                    <label className="text-[10px] text-stone-500 uppercase">Tire Width (mm)</label>
                    <input
                        type="number"
                        value={setup.tireSize}
                        onChange={(e) => onChange({ ...setup, tireSize: parseInt(e.target.value) || 28 })}
                        className="w-full bg-black/30 border border-white/10 rounded px-2 py-1 text-sm font-mono text-white"
                    />
                </div>
            </div>
        </div>
    );
};

// --- Chart Component ---

const SpeedChart = ({ setupA, setupB, cadence }: { setupA: Setup, setupB: Setup, cadence: number }) => {
    const { unitSystem } = useSettingsStore();

    // Generate data points
    const getData = (setup: Setup) => {
        const [minCog, maxCog] = setup.cassetteRange.split('-').map(n => parseInt(n));
        const cogs = parseCassetteRange(maxCog, minCog);

        // Use the updated calculateWheelCircumference which takes rim diameter and tire width
        const circ = calculateWheelCircumference(setup.wheelSize, setup.tireSize);

        const gears = getAllGearRatios(setup.chainrings, cogs);
        return gears.map(g => ({
            ratio: g.ratio,
            speed: toSpeed(calculateSpeed(g.ratio, circ, cadence), unitSystem),
            gearInches: g.gearInches
        }));
    };

    const dataA = getData(setupA);
    const dataB = getData(setupB);

    // Find max speed for scaling
    const maxSpeed = Math.max(
        ...dataA.map(d => d.speed),
        ...dataB.map(d => d.speed)
    ) * 1.1;

    return (
        <div className="relative h-64 w-full bg-stone-900/30 rounded-xl border border-white/5 p-4 overflow-hidden">
            {/* Grid Lines */}
            <div className="absolute inset-0 p-4 flex flex-col justify-between pointer-events-none">
                {[0, 1, 2, 3, 4].map(i => (
                    <div key={i} className="w-full h-px bg-white/5" />
                ))}
            </div>

            {/* Bars for Setup A */}
            <div className="absolute inset-0 p-4 flex items-end gap-1 opacity-50">
                {dataA.map((d, i) => (
                    <div
                        key={`a-${i}`}
                        className="flex-1 bg-cyan-500/30 rounded-t-sm hover:bg-cyan-500 transition-colors group relative"
                        style={{ height: `${(d.speed / maxSpeed) * 100}%` }}
                    >
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-stone-900 text-cyan-400 text-xs px-2 py-1 rounded border border-cyan-500/30 opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10">
                            {d.speed.toFixed(1)} {speedUnit(unitSystem)}
                        </div>
                    </div>
                ))}
            </div>

            {/* Bars for Setup B (Overlay) */}
            <div className="absolute inset-0 p-4 flex items-end gap-1 pointer-events-none">
                {dataB.map((d, i) => (
                    <div
                        key={`b-${i}`}
                        className="flex-1 border-t-2 border-rose-500/50"
                        style={{
                            height: `${(d.speed / maxSpeed) * 100}%`,
                            marginBottom: '-1px' // Align with bottom
                        }}
                    />
                ))}
            </div>

            {/* Legend */}
            <div className="absolute top-4 right-4 flex gap-4 text-xs font-mono">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-cyan-500/30 rounded-sm" />
                    <span className="text-stone-400">Setup A</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-0.5 bg-rose-500" />
                    <span className="text-stone-400">Setup B</span>
                </div>
            </div>
        </div>
    );
};

// --- Main Component ---

export const DrivetrainLab = () => {
    const { unitSystem } = useSettingsStore();
    const [setupA, setSetupA] = useState<Setup>({ ...PRESETS['road-compact'], id: 'setup-a', name: 'Road Compact' });
    const [setupB, setSetupB] = useState<Setup>({ ...PRESETS['road-semi'], id: 'setup-b', name: 'Road Semi-Compact' });
    const [cadence, setCadence] = useState(90);
    const [ftp, setFtp] = useState(250); // Watts
    const [weight, setWeight] = useState(75); // kg

    // Climbing Calc
    const calculateMaxGrade = (setup: Setup) => {
        // Physics: Power = Speed * (Gravity + Rolling + Drag)
        // Simplified for climbing: Power ≈ Speed * Gravity
        // Gravity Force = Mass * g * sin(slope)
        // Speed = (Cadence * GearRatio * Circ)
        // This is complex to invert. 
        // Let's use: Watts / kg = Speed (m/s) * 9.81 * Grade(%)
        // Speed = (Cadence/60) * (Development in meters)

        const [minCog, maxCog] = setup.cassetteRange.split('-').map(n => parseInt(n));
        const lowestRatio = Math.min(...setup.chainrings) / maxCog;
        const circ = calculateWheelCircumference(setup.wheelSize, setup.tireSize) / 1000; // meters

        const speedMs = (60 / 60) * (lowestRatio * circ); // Speed at 60rpm (grinding)

        // W/kg = Speed * 9.81 * Grade
        // Grade = (W/kg) / (Speed * 9.81)
        const wKg = ftp / weight;
        const maxGrade = wKg / (speedMs * 9.81);

        return maxGrade * 100; // Percentage
    };

    const gradeA = calculateMaxGrade(setupA);
    const gradeB = calculateMaxGrade(setupB);

    return (
        <div className="w-full max-w-6xl mx-auto">
            {/* Control Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
                <div className="lg:col-span-4 space-y-4">
                    <SetupSelector
                        label="Setup A (Baseline)"
                        setup={setupA}
                        onChange={setSetupA}
                        color="text-cyan-400"
                    />
                    <SetupSelector
                        label="Setup B (Challenger)"
                        setup={setupB}
                        onChange={setSetupB}
                        color="text-rose-400"
                    />
                </div>

                <div className="lg:col-span-8">
                    <div className="bg-stone-900/50 border border-white/5 rounded-xl p-6 h-full">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <Activity className="w-5 h-5 text-primary" />
                                Speed Analysis
                            </h3>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-stone-500 uppercase">Cadence</span>
                                <input
                                    type="range"
                                    min="60" max="120"
                                    value={cadence}
                                    onChange={(e) => setCadence(parseInt(e.target.value))}
                                    className="w-32 accent-primary"
                                />
                                <span className="text-sm font-mono text-white w-8">{cadence}</span>
                            </div>
                        </div>

                        <SpeedChart setupA={setupA} setupB={setupB} cadence={cadence} />
                    </div>
                </div>
            </div>

            {/* The Wall (Climbing Analysis) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-stone-900/50 border border-white/5 rounded-xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Mountain className="w-32 h-32 text-white" />
                    </div>

                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-emerald-400" />
                        The Climbing Wall
                    </h3>

                    <div className="flex gap-4 mb-6 text-sm">
                        <div>
                            <label className="block text-xs text-stone-500 mb-1">FTP (Watts)</label>
                            <input
                                type="number" value={ftp} onChange={(e) => setFtp(parseInt(e.target.value))}
                                className="bg-black/30 border border-white/10 rounded px-2 py-1 w-20 text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-stone-500 mb-1">Weight (kg)</label>
                            <input
                                type="number" value={weight} onChange={(e) => setWeight(parseInt(e.target.value))}
                                className="bg-black/30 border border-white/10 rounded px-2 py-1 w-20 text-white"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-cyan-400">Setup A Limit</span>
                                <span className="text-white font-mono">{gradeA.toFixed(1)}%</span>
                            </div>
                            <div className="h-2 bg-stone-800 rounded-full overflow-hidden">
                                <div className="h-full bg-cyan-500" style={{ width: `${Math.min(gradeA * 4, 100)}%` }} />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-rose-400">Setup B Limit</span>
                                <span className="text-white font-mono">{gradeB.toFixed(1)}%</span>
                            </div>
                            <div className="h-2 bg-stone-800 rounded-full overflow-hidden">
                                <div className="h-full bg-rose-500" style={{ width: `${Math.min(gradeB * 4, 100)}%` }} />
                            </div>
                        </div>
                        <p className="text-xs text-stone-500 mt-2">
                            Max sustainable gradient at 60rpm (grinding threshold).
                        </p>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-stone-900/50 border border-white/5 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-amber-400" />
                        Quick Stats
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-black/20 rounded-lg">
                            <div className="text-xs text-stone-500 mb-1">Top Speed (110rpm)</div>
                            <div className="text-xl font-mono text-white">
                                {toSpeed(calculateSpeed(Math.max(...setupA.chainrings) / 11, 2100, 110), unitSystem).toFixed(1)} <span className="text-xs text-stone-600">{speedUnit(unitSystem)}</span>
                            </div>
                            <div className="text-xs text-cyan-400 mt-1">Setup A</div>
                        </div>
                        <div className="p-4 bg-black/20 rounded-lg">
                            <div className="text-xs text-stone-500 mb-1">Top Speed (110rpm)</div>
                            <div className="text-xl font-mono text-white">
                                {toSpeed(calculateSpeed(Math.max(...setupB.chainrings) / 11, 2100, 110), unitSystem).toFixed(1)} <span className="text-xs text-stone-600">{speedUnit(unitSystem)}</span>
                            </div>
                            <div className="text-xs text-rose-400 mt-1">Setup B</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

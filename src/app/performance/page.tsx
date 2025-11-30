'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useBuildStore } from '@/store/buildStore';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Scale,
    Gauge,
    Zap,
    Mountain,
    Settings2,
    AlertCircle,
    Save,
    RotateCcw,
    Share2,
    Info,
} from 'lucide-react';
import { ShareCard } from '@/components/builder/ShareCard';
import {
    getAllGearRatios,
    getSpeedRange,
    calculateClimbingIndex,
    parseCassetteRange,
    calculateSpeed,
    calculateWheelCircumference,
} from '@/lib/gearCalculations';
import {
    calculateBuildWeight,
    formatWeight,
    getBikeCategory,
    getFinishingKitBreakdown,
} from '@/lib/weightCalculations';

// Arc Gauge Component
const SpeedArcGauge: React.FC<{
    value: number;
    min: number;
    max: number;
    unit: string;
    label: string;
}> = ({ value, min, max, unit, label }) => {
    const percentage = Math.min(Math.max((value - min) / (max - min), 0), 1);
    const angle = percentage * 180;

    // SVG arc path
    const radius = 80;
    const strokeWidth = 12;
    const cx = 100;
    const cy = 100;

    const polarToCartesian = (centerX: number, centerY: number, r: number, angleInDegrees: number) => {
        const angleInRadians = ((angleInDegrees - 180) * Math.PI) / 180;
        return {
            x: centerX + r * Math.cos(angleInRadians),
            y: centerY + r * Math.sin(angleInRadians),
        };
    };

    const describeArc = (startAngle: number, endAngle: number) => {
        const start = polarToCartesian(cx, cy, radius, endAngle);
        const end = polarToCartesian(cx, cy, radius, startAngle);
        const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
        return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
    };

    return (
        <div className="relative">
            <svg viewBox="0 0 200 120" className="w-full max-w-xs mx-auto">
                {/* Background arc */}
                <path
                    d={describeArc(0, 180)}
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                />

                {/* Gradient definition */}
                <defs>
                    <linearGradient id="speedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="50%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Active arc */}
                <motion.path
                    d={describeArc(0, angle)}
                    fill="none"
                    stroke="url(#speedGradient)"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    filter="url(#glow)"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                />

                {/* Tick marks */}
                {[0, 45, 90, 135, 180].map((tickAngle, i) => {
                    const pos = polarToCartesian(cx, cy, radius + 15, tickAngle);
                    return (
                        <circle
                            key={i}
                            cx={pos.x}
                            cy={pos.y}
                            r={2}
                            fill="rgba(255,255,255,0.3)"
                        />
                    );
                })}
            </svg>

            {/* Center display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pt-4">
                <motion.div
                    className="text-5xl font-bold font-mono text-white"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    {value.toFixed(1)}
                </motion.div>
                <div className="text-sm text-stone-400 font-medium">{unit}</div>
                <div className="text-xs text-stone-600 mt-1">{label}</div>
            </div>

            {/* Min/Max labels */}
            <div className="flex justify-between px-4 -mt-2">
                <span className="text-xs text-stone-600 font-mono">{min.toFixed(0)}</span>
                <span className="text-xs text-stone-600 font-mono">{max.toFixed(0)}</span>
            </div>
        </div>
    );
};

// Cadence Dial Component
const CadenceDial: React.FC<{
    value: number;
    onChange: (value: number) => void;
}> = ({ value, onChange }) => {
    const minVal = 60;
    const maxVal = 120;
    const percentage = (value - minVal) / (maxVal - minVal);

    const segments = 12;
    const activeSegments = Math.floor(percentage * segments);

    return (
        <div className="relative">
            {/* Circular segments */}
            <div className="relative w-48 h-48 mx-auto">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    {Array.from({ length: segments }).map((_, i) => {
                        const startAngle = (i / segments) * 360;
                        const endAngle = ((i + 0.8) / segments) * 360;
                        const isActive = i < activeSegments;

                        const r = 42;
                        const cx = 50;
                        const cy = 50;

                        const x1 = cx + r * Math.cos((startAngle * Math.PI) / 180);
                        const y1 = cy + r * Math.sin((startAngle * Math.PI) / 180);
                        const x2 = cx + r * Math.cos((endAngle * Math.PI) / 180);
                        const y2 = cy + r * Math.sin((endAngle * Math.PI) / 180);

                        return (
                            <motion.path
                                key={i}
                                d={`M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`}
                                fill="none"
                                stroke={isActive ? '#06b6d4' : 'rgba(255,255,255,0.1)'}
                                strokeWidth={8}
                                strokeLinecap="round"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: i * 0.05 }}
                                style={{
                                    filter: isActive ? 'drop-shadow(0 0 6px rgba(6, 182, 212, 0.5))' : 'none',
                                }}
                            />
                        );
                    })}
                </svg>

                {/* Center display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.div
                        className="text-4xl font-bold font-mono text-cyan-400"
                        key={value}
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 500 }}
                    >
                        {value}
                    </motion.div>
                    <div className="text-xs text-stone-500 uppercase tracking-wider">RPM</div>
                </div>
            </div>

            {/* Slider */}
            <div className="mt-4 px-4">
                <div className="relative">
                    {/* Track background with gradient */}
                    <div className="absolute inset-0 h-2 top-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-stone-700 via-cyan-900/50 to-cyan-700/30 border border-white/10" />
                    {/* Active track fill */}
                    <div
                        className="absolute h-2 top-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-cyan-600 to-cyan-400"
                        style={{ width: `${percentage * 100}%` }}
                    />
                    <input
                        type="range"
                        min={minVal}
                        max={maxVal}
                        value={value}
                        onChange={(e) => onChange(Number(e.target.value))}
                        className="relative w-full h-2 bg-transparent rounded-full appearance-none cursor-pointer z-10
                            [&::-webkit-slider-thumb]:appearance-none
                            [&::-webkit-slider-thumb]:w-6
                            [&::-webkit-slider-thumb]:h-6
                            [&::-webkit-slider-thumb]:rounded-full
                            [&::-webkit-slider-thumb]:bg-cyan-400
                            [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(6,182,212,0.5)]
                            [&::-webkit-slider-thumb]:cursor-pointer
                            [&::-webkit-slider-thumb]:transition-transform
                            [&::-webkit-slider-thumb]:hover:scale-110
                            [&::-webkit-slider-thumb]:border-2
                            [&::-webkit-slider-thumb]:border-white/30"
                    />
                </div>
                <div className="flex justify-between text-xs text-stone-600 mt-3 font-mono">
                    <span>60</span>
                    <span>90</span>
                    <span>120</span>
                </div>
            </div>
        </div>
    );
};

// Climbing Gauge Component
const ClimbingGauge: React.FC<{
    index: number;
    grade: number;
    onGradeChange: (grade: number) => void;
}> = ({ index, grade, onGradeChange }) => {
    // Calculate score based on climbing index and grade
    // Higher index = easier climbing, lower grade = easier
    // Score represents how well this gearing handles the selected grade
    const baseScore = index * 100;
    const gradeAdjustment = Math.max(0, 1 - (grade / 20)); // Penalty for steeper grades
    const adjustedScore = Math.min(baseScore * gradeAdjustment + (baseScore * 0.3), 100);
    const percentage = Math.max(0, Math.min(adjustedScore, 100));

    // Determine score label and color
    const getScoreLabel = (score: number) => {
        if (score >= 80) return { label: 'Excellent', color: 'text-emerald-400' };
        if (score >= 60) return { label: 'Good', color: 'text-lime-400' };
        if (score >= 40) return { label: 'Fair', color: 'text-amber-400' };
        if (score >= 20) return { label: 'Challenging', color: 'text-orange-400' };
        return { label: 'Difficult', color: 'text-red-400' };
    };

    const scoreInfo = getScoreLabel(percentage);

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="relative h-32 w-full flex items-center justify-center">
                {/* Mountain icon at top */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <Mountain className="w-6 h-6 text-emerald-400" />
                </div>

                {/* Main content row */}
                <div className="flex items-center gap-6">
                    {/* Grade indicator - left side */}
                    <div className="text-center w-16">
                        <div className="text-2xl font-bold font-mono text-stone-300">
                            {grade}%
                        </div>
                        <div className="text-xs text-stone-500">grade</div>
                    </div>

                    {/* Vertical bar */}
                    <div className="relative h-28 w-8 bg-stone-800 rounded-full overflow-hidden mt-4">
                        {/* Gradient fill */}
                        <motion.div
                            className="absolute bottom-0 left-0 right-0 rounded-full"
                            style={{
                                background: 'linear-gradient(to top, #ef4444, #f59e0b, #22c55e)',
                            }}
                            initial={{ height: 0 }}
                            animate={{ height: `${percentage}%` }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                        />
                    </div>

                    {/* Score display - right side */}
                    <div className="text-center w-16">
                        <div className={`text-2xl font-bold font-mono ${scoreInfo.color}`}>
                            {percentage.toFixed(0)}
                        </div>
                        <div className="text-xs text-stone-500">/ 100</div>
                    </div>
                </div>
            </div>

            {/* Score interpretation */}
            <div className={`text-sm font-semibold ${scoreInfo.color}`}>
                {scoreInfo.label}
            </div>

            {/* Grade slider */}
            <div className="w-full px-2">
                <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                    <span>Flat</span>
                    <span className="text-stone-400">Adjust Grade</span>
                    <span>Steep</span>
                </div>
                <div className="relative">
                    {/* Track background */}
                    <div className="absolute inset-0 h-2 top-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-emerald-900/50 via-amber-900/50 to-red-900/50 border border-white/10" />
                    {/* Active track */}
                    <div
                        className="absolute h-2 top-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-emerald-500 to-amber-500"
                        style={{ width: `${(grade / 20) * 100}%` }}
                    />
                    <input
                        type="range"
                        min={0}
                        max={20}
                        value={grade}
                        onChange={(e) => onGradeChange(Number(e.target.value))}
                        className="relative w-full h-2 bg-transparent rounded-full appearance-none cursor-pointer z-10
                            [&::-webkit-slider-thumb]:appearance-none
                            [&::-webkit-slider-thumb]:w-5
                            [&::-webkit-slider-thumb]:h-5
                            [&::-webkit-slider-thumb]:rounded-full
                            [&::-webkit-slider-thumb]:bg-emerald-400
                            [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(16,185,129,0.5)]
                            [&::-webkit-slider-thumb]:cursor-pointer
                            [&::-webkit-slider-thumb]:transition-transform
                            [&::-webkit-slider-thumb]:hover:scale-110
                            [&::-webkit-slider-thumb]:border-2
                            [&::-webkit-slider-thumb]:border-white/30"
                    />
                </div>
                <div className="flex justify-between text-xs text-stone-600 mt-2 font-mono">
                    <span>0%</span>
                    <span>10%</span>
                    <span>20%</span>
                </div>
            </div>

            {/* Explanation tooltip */}
            <div className="text-xs text-stone-500 text-center px-4 mt-2">
                Score shows how well your gearing handles this grade. Higher = easier climbing.
            </div>
        </div>
    );
};

// Digital Weight Display
const DigitalWeightDisplay: React.FC<{
    weight: number;
    unit: string;
    breakdown?: { label: string; weight: number; note?: string }[];
    category?: string;
}> = ({ weight, unit, breakdown, category }) => {
    const [displayWeight, setDisplayWeight] = useState(0);
    const [showBreakdown, setShowBreakdown] = useState(false);

    useEffect(() => {
        const duration = 1000;
        const steps = 30;
        const increment = weight / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= weight) {
                setDisplayWeight(weight);
                clearInterval(timer);
            } else {
                setDisplayWeight(current);
            }
        }, duration / steps);

        return () => clearInterval(timer);
    }, [weight]);

    return (
        <div className="bg-stone-900 rounded-xl p-6 border border-stone-800">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-stone-500">
                    <Scale className="w-5 h-5" />
                    <span className="text-xs font-semibold uppercase tracking-wider">Estimated Weight</span>
                </div>
                {breakdown && (
                    <button
                        onClick={() => setShowBreakdown(!showBreakdown)}
                        className={`flex items-center gap-1 text-xs transition-colors px-2 py-1 rounded-md ${
                            showBreakdown
                                ? 'bg-cyan-500/20 text-cyan-400'
                                : 'text-stone-500 hover:text-stone-300 hover:bg-white/5'
                        }`}
                    >
                        <Info className="w-3.5 h-3.5" />
                        <span>Details</span>
                    </button>
                )}
            </div>

            {/* Digital display */}
            <div className="bg-black rounded-lg p-4 font-mono">
                <div className="text-4xl font-bold text-cyan-400 tracking-wider">
                    {displayWeight.toFixed(1)}
                    <span className="text-xl text-cyan-600 ml-2">{unit}</span>
                </div>
            </div>

            {/* Breakdown */}
            {showBreakdown && breakdown && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 bg-black/30 rounded-lg p-3"
                >
                    <div className="text-[10px] text-stone-500 uppercase tracking-wider mb-2">Weight Breakdown</div>
                    <div className="space-y-1">
                        {breakdown.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-xs py-1 border-b border-white/5 last:border-0">
                                <span className="text-stone-400">
                                    {item.label}
                                    {item.note && (
                                        <span className="text-stone-600 ml-1 text-[10px]">({item.note})</span>
                                    )}
                                </span>
                                <span className="text-stone-300 font-mono">{(item.weight / 1000).toFixed(2)} kg</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Disclaimer */}
            <div className="mt-3 flex items-start gap-2 text-xs text-stone-600">
                <AlertCircle className="w-3 h-3 mt-0.5 shrink-0" />
                <span>
                    Includes {category || 'standard'} finishing kit estimate (stem, bars, post, saddle, brakes, chain).
                    Excludes pedals & tire sealant.
                </span>
            </div>
        </div>
    );
};

// Gear Grid Heat Map
const GearHeatMap: React.FC<{
    gears: Array<{ chainring: number; cog: number; ratio: number; gearInches: number }>;
    chainrings: number[];
    cogs: number[];
    cadence: number;
    unitSystem: 'metric' | 'imperial';
    onGearSelect?: (gear: { chainring: number; cog: number; ratio: number }) => void;
}> = ({ gears, chainrings, cogs, cadence, unitSystem, onGearSelect }) => {
    const [selectedGear, setSelectedGear] = useState<{ chainring: number; cog: number } | null>(null);

    const minRatio = Math.min(...gears.map(g => g.ratio));
    const maxRatio = Math.max(...gears.map(g => g.ratio));

    const getColor = (ratio: number) => {
        const normalized = (ratio - minRatio) / (maxRatio - minRatio);
        if (normalized < 0.33) return 'bg-emerald-500/60';
        if (normalized < 0.66) return 'bg-amber-500/60';
        return 'bg-rose-500/60';
    };

    const getGear = (chainring: number, cog: number) => {
        return gears.find(g => g.chainring === chainring && g.cog === cog);
    };

    const wheelCirc = calculateWheelCircumference();

    return (
        <div className="overflow-x-auto">
            <div className="min-w-fit">
                {/* Header row - cogs */}
                <div className="flex gap-1 mb-1 ml-12">
                    {cogs.slice().reverse().map(cog => (
                        <div
                            key={cog}
                            className="w-10 h-8 flex items-center justify-center text-xs font-mono text-stone-500"
                        >
                            {cog}t
                        </div>
                    ))}
                </div>

                {/* Gear rows */}
                {chainrings.map(chainring => (
                    <div key={chainring} className="flex gap-1 mb-1">
                        <div className="w-12 h-10 flex items-center justify-center text-xs font-mono text-stone-500">
                            {chainring}t
                        </div>
                        {cogs.slice().reverse().map(cog => {
                            const gear = getGear(chainring, cog);
                            if (!gear) return <div key={cog} className="w-10 h-10" />;

                            const isSelected = selectedGear?.chainring === chainring && selectedGear?.cog === cog;
                            const speed = calculateSpeed(gear.ratio, wheelCirc, cadence);

                            return (
                                <motion.button
                                    key={cog}
                                    onClick={() => {
                                        setSelectedGear({ chainring, cog });
                                        onGearSelect?.(gear);
                                    }}
                                    className={`w-10 h-10 rounded-lg ${getColor(gear.ratio)}
                                        flex items-center justify-center text-xs font-mono font-bold
                                        transition-all hover:scale-110 hover:z-10
                                        ${isSelected ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-stone-950' : ''}`}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {gear.ratio.toFixed(1)}
                                </motion.button>
                            );
                        })}
                    </div>
                ))}

                {/* Selected gear info */}
                {selectedGear && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-lg"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-stone-400">
                                {selectedGear.chainring}t × {selectedGear.cog}t
                            </span>
                            <span className="text-lg font-bold font-mono text-cyan-400">
                                {(unitSystem === 'imperial'
                                    ? calculateSpeed(
                                        getGear(selectedGear.chainring, selectedGear.cog)!.ratio,
                                        wheelCirc,
                                        cadence
                                    ) * 0.621371
                                    : calculateSpeed(
                                        getGear(selectedGear.chainring, selectedGear.cog)!.ratio,
                                        wheelCirc,
                                        cadence
                                    )
                                ).toFixed(1)} {unitSystem === 'imperial' ? 'mph' : 'km/h'}
                            </span>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

// Main Performance Page
export default function PerformancePage() {
    const router = useRouter();
    const { parts, cadence, setCadence, unitSystem, toggleUnits } = useBuildStore();
    const [climbingGrade, setClimbingGrade] = useState(5); // Default 5% grade
    const [showShareCard, setShowShareCard] = useState(false);

    const crank = parts.Crankset;
    const cassette = parts.Cassette;
    const frame = parts.Frame;

    // Parse drivetrain data
    const chainrings = useMemo(() => {
        if (!crank) return [];

        // Check for explicit chainring_large/chainring_small first
        const large = crank.attributes.chainring_large as number;
        const small = crank.attributes.chainring_small as number;
        if (large) {
            if (small && small !== 0) return [large, small];
            return [large];
        }

        // Parse teeth string (e.g., "52/36" or "34")
        const teeth = crank.attributes.teeth as string;
        if (teeth && typeof teeth === 'string') {
            if (teeth.includes('/')) {
                // Double chainring: "52/36" -> [52, 36]
                const teethParts = teeth.split('/').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
                return teethParts.length > 0 ? teethParts : [];
            } else {
                // Single chainring: "34" -> [34]
                const single = parseInt(teeth, 10);
                return !isNaN(single) ? [single] : [];
            }
        }

        return [];
    }, [crank]);

    const cassetteCogs = useMemo(() => {
        if (!cassette) return [];

        // Check for explicit largest_cog and diff first
        const largest = cassette.attributes.largest_cog as number;
        const diff = cassette.attributes.diff as number;
        if (largest && diff) {
            return parseCassetteRange(largest, largest - diff);
        }

        // Parse range string (e.g., "10-52" or "11-34")
        const range = cassette.attributes.range as string;
        if (range && typeof range === 'string') {
            const match = range.match(/(\d+)-(\d+)/);
            if (match) {
                const smallest = parseInt(match[1], 10);
                const largestCog = parseInt(match[2], 10);
                if (!isNaN(smallest) && !isNaN(largestCog)) {
                    return parseCassetteRange(largestCog, smallest);
                }
            }
        }

        return [];
    }, [cassette]);

    const hasGears = chainrings.length > 0 && cassetteCogs.length > 0;

    const gears = useMemo(() => {
        if (!hasGears) return [];
        return getAllGearRatios(chainrings, cassetteCogs);
    }, [hasGears, chainrings, cassetteCogs]);

    const speedRange = useMemo(() => {
        if (!hasGears) return null;
        return getSpeedRange(chainrings, cassetteCogs, cadence);
    }, [hasGears, chainrings, cassetteCogs, cadence]);

    const climbingIndex = useMemo(() => {
        if (gears.length === 0) return 0;
        return calculateClimbingIndex(gears[0].ratio);
    }, [gears]);

    // Calculate total weight using realistic estimation
    const weightData = useMemo(() => {
        return calculateBuildWeight(parts);
    }, [parts]);

    const bikeCategory = useMemo(() => {
        return getBikeCategory(frame);
    }, [frame]);

    const weightFormatted = formatWeight(weightData.totalWeight, unitSystem);
    const weightDisplay = parseFloat(weightFormatted.value);
    const weightUnit = weightFormatted.unit;

    const convertSpeed = (kmh: number) => {
        return unitSystem === 'imperial' ? kmh * 0.621371 : kmh;
    };
    const speedUnit = unitSystem === 'imperial' ? 'mph' : 'km/h';

    // Redirect if no build
    useEffect(() => {
        if (!frame) {
            router.push('/builder');
        }
    }, [frame, router]);

    if (!frame) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-stone-950 via-stone-950 to-stone-900">
            {/* Header */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="sticky top-0 z-40 bg-stone-950/80 backdrop-blur-xl border-b border-white/5"
            >
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <button
                        onClick={() => router.push('/builder')}
                        className="flex items-center gap-2 text-stone-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="text-sm font-medium">Back to Build</span>
                    </button>

                    <button
                        onClick={toggleUnits}
                        className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-medium text-stone-400 hover:text-stone-200 transition-colors border border-white/5"
                    >
                        {unitSystem === 'imperial' ? 'US' : 'METRIC'}
                    </button>
                </div>
            </motion.header>

            <main className="max-w-4xl mx-auto px-4 py-8 pb-24">
                {/* Build Title */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                        {frame.name}
                    </h1>
                    <p className="text-stone-500 text-sm">Performance Analysis</p>
                </motion.div>

                {hasGears ? (
                    <div className="space-y-8">
                        {/* Speed Gauge */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-stone-900/50 rounded-2xl p-6 border border-white/5"
                        >
                            <div className="flex items-center gap-2 text-stone-500 mb-6">
                                <Zap className="w-5 h-5" />
                                <span className="text-xs font-semibold uppercase tracking-wider">
                                    Speed @ {cadence} RPM
                                </span>
                            </div>

                            {speedRange && (
                                <SpeedArcGauge
                                    value={convertSpeed((speedRange.min + speedRange.max) / 2)}
                                    min={convertSpeed(speedRange.min)}
                                    max={convertSpeed(speedRange.max)}
                                    unit={speedUnit}
                                    label="Mid-range gear"
                                />
                            )}

                            {/* Speed range display */}
                            {speedRange && (
                                <div className="grid grid-cols-2 gap-4 mt-6">
                                    <div className="text-center p-3 bg-stone-800/50 rounded-xl">
                                        <div className="text-xs text-stone-500 mb-1">Low Gear</div>
                                        <div className="text-xl font-bold font-mono text-stone-300">
                                            {convertSpeed(speedRange.min).toFixed(1)}
                                            <span className="text-sm text-stone-500 ml-1">{speedUnit}</span>
                                        </div>
                                        <div className="text-[10px] text-stone-600 mt-1">Climbing speed</div>
                                    </div>
                                    <div className="text-center p-3 bg-stone-800/50 rounded-xl">
                                        <div className="text-xs text-stone-500 mb-1">Top Gear</div>
                                        <div className="text-xl font-bold font-mono text-cyan-400">
                                            {convertSpeed(speedRange.max).toFixed(1)}
                                            <span className="text-sm text-stone-500 ml-1">{speedUnit}</span>
                                        </div>
                                        <div className="text-[10px] text-stone-600 mt-1">Max speed</div>
                                    </div>
                                </div>
                            )}
                        </motion.section>

                        {/* Cadence Controller */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-stone-900/50 rounded-2xl p-6 border border-white/5"
                        >
                            <div className="flex items-center gap-2 text-stone-500 mb-6">
                                <Gauge className="w-5 h-5" />
                                <span className="text-xs font-semibold uppercase tracking-wider">Cadence</span>
                            </div>

                            <CadenceDial value={cadence} onChange={setCadence} />
                        </motion.section>

                        {/* Gear Heat Map */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-stone-900/50 rounded-2xl p-6 border border-white/5"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2 text-stone-500">
                                    <Settings2 className="w-5 h-5" />
                                    <span className="text-xs font-semibold uppercase tracking-wider">
                                        Gear Ratios
                                    </span>
                                </div>
                                <div className="text-sm text-stone-400">
                                    {gears.length} gears
                                </div>
                            </div>

                            <GearHeatMap
                                gears={gears}
                                chainrings={chainrings}
                                cogs={cassetteCogs}
                                cadence={cadence}
                                unitSystem={unitSystem}
                            />

                            {/* Legend */}
                            <div className="flex items-center justify-center gap-4 mt-6 text-xs">
                                <div className="flex items-center gap-1">
                                    <div className="w-3 h-3 rounded bg-emerald-500/60" />
                                    <span className="text-stone-500">Easy</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-3 h-3 rounded bg-amber-500/60" />
                                    <span className="text-stone-500">Medium</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-3 h-3 rounded bg-rose-500/60" />
                                    <span className="text-stone-500">Hard</span>
                                </div>
                            </div>
                        </motion.section>

                        {/* Two column layout for weight and climbing */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Weight Display */}
                            <motion.section
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <DigitalWeightDisplay
                                        weight={weightDisplay}
                                        unit={weightUnit}
                                        breakdown={weightData.breakdown}
                                        category={bikeCategory}
                                    />
                            </motion.section>

                            {/* Climbing Index */}
                            <motion.section
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="bg-stone-900/50 rounded-2xl p-6 border border-white/5"
                            >
                                <div className="flex items-center gap-2 text-stone-500 mb-6">
                                    <Mountain className="w-5 h-5" />
                                    <span className="text-xs font-semibold uppercase tracking-wider">Climbing Ease</span>
                                </div>

                                <div className="flex justify-center">
                                    <ClimbingGauge
                                        index={climbingIndex}
                                        grade={climbingGrade}
                                        onGradeChange={setClimbingGrade}
                                    />
                                </div>
                            </motion.section>
                        </div>

                        {/* Gearing Summary */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="bg-gradient-to-r from-cyan-500/10 to-violet-500/10 rounded-2xl p-6 border border-cyan-500/20"
                        >
                            <h3 className="text-lg font-semibold text-white mb-4">Drivetrain Summary</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                <div>
                                    <div className="text-2xl font-bold font-mono text-white">
                                        {chainrings.length === 1 ? '1x' : '2x'}
                                    </div>
                                    <div className="text-xs text-stone-500">Setup</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold font-mono text-white">
                                        {chainrings.join('/')}
                                    </div>
                                    <div className="text-xs text-stone-500">Chainring</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold font-mono text-white">
                                        {cassetteCogs[cassetteCogs.length - 1]}-{cassetteCogs[0]}
                                    </div>
                                    <div className="text-xs text-stone-500">Cassette</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold font-mono text-white">
                                        {gears.length}
                                    </div>
                                    <div className="text-xs text-stone-500">Total Gears</div>
                                </div>
                            </div>
                        </motion.section>

                        {/* Share Your Build */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            className="bg-gradient-to-r from-pink-500/10 to-violet-500/10 rounded-2xl p-6 border border-pink-500/20"
                        >
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="text-center sm:text-left">
                                    <h3 className="text-lg font-semibold text-white flex items-center gap-2 justify-center sm:justify-start">
                                        <Share2 className="w-5 h-5 text-pink-400" />
                                        Share Your Build
                                    </h3>
                                    <p className="text-sm text-stone-400 mt-1">
                                        Create a beautiful card to share on social media
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowShareCard(true)}
                                    className="px-6 py-3 bg-gradient-to-r from-pink-500 to-violet-500 text-white font-medium rounded-xl hover:from-pink-600 hover:to-violet-600 transition-all shadow-lg shadow-pink-500/25 flex items-center gap-2"
                                >
                                    <Share2 className="w-4 h-4" />
                                    Create Share Card
                                </button>
                            </div>
                        </motion.section>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <Settings2 className="w-16 h-16 mx-auto text-stone-700 mb-4" />
                        <h2 className="text-xl font-semibold text-stone-400 mb-2">
                            Incomplete Drivetrain
                        </h2>
                        <p className="text-stone-600 mb-6">
                            Select a crankset and cassette to see performance metrics
                        </p>
                        <button
                            onClick={() => router.push('/builder')}
                            className="px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 transition-colors"
                        >
                            Complete Your Build
                        </button>
                    </motion.div>
                )}
            </main>

            {/* Bottom Actions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="fixed bottom-0 left-0 right-0 bg-stone-950/90 backdrop-blur-xl border-t border-white/5 p-4"
            >
                <div className="max-w-4xl mx-auto flex gap-3">
                    <button
                        onClick={() => router.push('/builder')}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/5 text-stone-300 font-medium rounded-xl hover:bg-white/10 transition-colors"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Modify Build
                    </button>
                    <button
                        onClick={() => {
                            const name = window.prompt('Name your build:');
                            if (name) {
                                fetch('/api/builds', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ name, parts }),
                                }).then(res => {
                                    if (res.ok) {
                                        router.push('/garage');
                                    } else {
                                        alert('Please sign in to save builds');
                                    }
                                });
                            }
                        }}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 transition-colors"
                    >
                        <Save className="w-4 h-4" />
                        Save Build
                    </button>
                </div>
            </motion.div>

            {/* Share Card Modal */}
            {showShareCard && frame && (
                <ShareCard
                    isModal={true}
                    frameName={frame.name}
                    parts={parts}
                    chainrings={chainrings}
                    cassetteCogs={cassetteCogs}
                    totalWeight={weightData.totalWeight}
                    climbingScore={Math.min(climbingIndex * 100, 100)}
                    speedRange={speedRange || undefined}
                    unitSystem={unitSystem}
                    onClose={() => setShowShareCard(false)}
                />
            )}
        </div>
    );
}

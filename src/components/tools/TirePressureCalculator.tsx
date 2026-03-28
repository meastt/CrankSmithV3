'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gauge, Info, Droplets, Mountain, Zap } from 'lucide-react';
import { useSettingsStore } from '@/store/settingsStore';
import { useBuildStore } from '@/store/buildStore';
import { toWeight, weightUnit, fromWeight, toPressure, pressureUnit } from '@/lib/unitConversions';
import { calculateTirePressure, type SurfaceType, type PressureResult } from '@/lib/tirePressureCalculations';
import { computeUnifiedWhatIf } from '@/lib/whatIfEngine';
import {
    addSetupFeedback,
    getSetupFeedbackForProfile,
    verifySetupFeedback,
    type FeedbackOutcome,
    type SetupFeedbackEntry
} from '@/lib/verifiedFeedback';

// --- Helper Components ---

interface InputFieldProps {
    label: string;
    value: number;
    onChange: (value: number) => void;
    unit: string;
    min: number;
    max: number;
    step?: number;
}

const InputField = ({ label, value, onChange, unit, min, max, step = 1 }: InputFieldProps) => (
    <div className="group">
        <label className="block text-xs font-medium text-stone-500 mb-1.5 uppercase tracking-wider group-hover:text-stone-400 transition-colors">
            {label}
        </label>
        <div className="relative">
            <input
                type="number"
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                min={min}
                max={max}
                step={step}
                className="w-full bg-stone-900/50 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-lg focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 transition-all"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-600 text-sm font-medium">
                {unit}
            </span>
        </div>
    </div>
);

interface ToggleProps {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    icon?: React.ComponentType<{ className?: string }>;
}

const Toggle = ({ label, checked, onChange, icon: Icon }: ToggleProps) => (
    <button
        onClick={() => onChange(!checked)}
        className={`
            w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-300
            ${checked
                ? 'bg-rose-500/10 border-rose-500/30 text-white'
                : 'bg-stone-900/30 border-white/5 text-stone-400 hover:bg-stone-900/50 hover:border-white/10'}
        `}
    >
        <div className="flex items-center gap-3">
            {Icon && <Icon className={`w-5 h-5 ${checked ? 'text-rose-400' : 'text-stone-600'}`} />}
            <span className="font-medium">{label}</span>
        </div>
        <div className={`
            w-10 h-5 rounded-full relative transition-colors duration-300
            ${checked ? 'bg-rose-500' : 'bg-stone-700'}
        `}>
            <div className={`
                absolute top-1 w-3 h-3 rounded-full bg-white transition-transform duration-300
                ${checked ? 'left-6' : 'left-1'}
            `} />
        </div>
    </button>
);

interface PressureBarProps {
    label: string;
    value: number;
    min: number;
    max: number;
    color: string;
    unit: string;
}

const PressureBar = ({ label, value, min, max, color, unit }: PressureBarProps) => {
    // Calculate position of the "recommended" dot within the min-max range
    // But actually, we want to show the range relative to a fixed scale (e.g. 0-100 psi)
    // Let's assume a dynamic scale based on context (Road vs MTB)

    // For visualization, we'll just show the recommended value and the "safe range" (min/max)
    // relative to a reasonable display range (value +/- 15psi)

    const displayMin = Math.max(0, value - 15);
    const displayMax = value + 15;
    const range = displayMax - displayMin;

    const getPercent = (val: number) => ((val - displayMin) / range) * 100;

    return (
        <div className="mb-6 last:mb-0">
            <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-medium text-stone-400">{label}</span>
                <div className="text-right">
                    <span className={`text-3xl font-bold font-mono ${color}`}>{value.toFixed(1)}</span>
                    <span className="text-sm text-stone-600 ml-1">{unit}</span>
                </div>
            </div>

            <div className="relative h-8 bg-stone-900/50 rounded-full overflow-hidden border border-white/5">
                {/* Safe Range Bar */}
                <div
                    className="absolute top-0 bottom-0 bg-white/5"
                    style={{
                        left: `${getPercent(min)}%`,
                        right: `${100 - getPercent(max)}%`
                    }}
                />

                {/* Gradient Track for "Sweet Spot" */}
                <div
                    className="absolute top-2 bottom-2 rounded-full opacity-30"
                    style={{
                        left: `${getPercent(min)}%`,
                        right: `${100 - getPercent(max)}%`,
                        background: `linear-gradient(90deg, transparent, ${color.replace('text-', 'bg-').replace('-400', '-500')}, transparent)`
                    }}
                />

                {/* Marker */}
                <motion.div
                    className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                    initial={{ left: '50%' }}
                    animate={{ left: `${getPercent(value)}%` }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />

                {/* Ticks */}
                <div className="absolute inset-0 flex justify-between px-2 items-center text-[10px] text-stone-700 font-mono pointer-events-none">
                    <span>{displayMin.toFixed(0)}</span>
                    <span>{displayMax.toFixed(0)}</span>
                </div>
            </div>

            <div className="flex justify-between text-xs text-stone-600 mt-1">
                <span>Min: {min.toFixed(1)}</span>
                <span>Max: {max.toFixed(1)}</span>
            </div>
        </div>
    );
};

// --- Main Component ---

export const TirePressureCalculator = () => {
    // Inputs
    const [riderWeight, setRiderWeight] = useState(75);
    const [bikeWeight, setBikeWeight] = useState(8);
    const [tireWidth, setTireWidth] = useState(28);
    const [rimWidth, setRimWidth] = useState(21);
    const [surface, setSurface] = useState<SurfaceType>('road-smooth');
    const [isTubeless, setIsTubeless] = useState(true);
    const [isWet, setIsWet] = useState(false);
    const [preference, setPreference] = useState(0); // -1 (Grip) to 1 (Speed)
    const [buildSeedApplied, setBuildSeedApplied] = useState(false);
    const [showAssumptions, setShowAssumptions] = useState(false);
    const [feedbackOutcome, setFeedbackOutcome] = useState<FeedbackOutcome>('balanced');
    const [feedbackSavedCount, setFeedbackSavedCount] = useState(0);
    const [feedbackEntries, setFeedbackEntries] = useState<SetupFeedbackEntry[]>([]);
    const [whatIfTireWidth, setWhatIfTireWidth] = useState(32);
    const [showEventPlan, setShowEventPlan] = useState(false);
    const { unitSystem } = useSettingsStore();
    const { parts } = useBuildStore();
    const measuredWidth = tireWidth + (rimWidth - 19) * 0.4;

    useEffect(() => {
        if (buildSeedApplied) return;

        const tireRear = parts.TireRear as { specs?: { width?: number | string }, attributes?: { width?: number | string }, interfaces?: { width?: number | string } } | undefined;
        const wheelRear = parts.WheelRear as {
            specs?: { internal_width?: number | string, diameter?: string },
            attributes?: { internal_width?: number | string, inner_width?: number | string },
            interfaces?: { internal_width?: number | string }
        } | undefined;
        const frame = parts.Frame as { category?: string, attributes?: { category?: string } } | undefined;
        const frameCategory = String(frame?.category || frame?.attributes?.category || '').toUpperCase();

        const parsedTireWidth = Number(tireRear?.specs?.width || tireRear?.attributes?.width || tireRear?.interfaces?.width || 0);
        const parsedRimWidth = Number(
            wheelRear?.specs?.internal_width ||
            wheelRear?.attributes?.internal_width ||
            wheelRear?.interfaces?.internal_width ||
            wheelRear?.attributes?.inner_width ||
            0
        );

        if (parsedTireWidth > 0) setTireWidth(Math.round(parsedTireWidth));
        if (parsedRimWidth > 0) setRimWidth(Math.round(parsedRimWidth));

        if (frameCategory === 'ROAD') setSurface('road-smooth');
        if (frameCategory === 'GRAVEL') setSurface('gravel-smooth');
        if (frameCategory === 'MTB') setSurface('mtb-trail');

        if (parsedTireWidth > 0 || parsedRimWidth > 0 || frameCategory) {
            setBuildSeedApplied(true);
        }
    }, [parts, buildSeedApplied]);

    // Calculation Logic
    const result = useMemo((): PressureResult => {
        return calculateTirePressure({
            riderWeight, bikeWeight, tireWidth, rimWidth,
            surface, isTubeless, isWet, preference,
        });
    }, [riderWeight, bikeWeight, tireWidth, rimWidth, surface, isTubeless, isWet, preference]);

    const confidenceLabel = surface.startsWith('road')
        ? 'Higher confidence on smoother surfaces'
        : surface.startsWith('gravel')
            ? 'Medium confidence on variable gravel surfaces'
            : 'Medium-to-lower confidence on aggressive MTB terrain';
    const outOfDistribution = measuredWidth < 22 || measuredWidth > 75;
    const profileKey = `${surface}:${Math.round(measuredWidth)}:${isTubeless ? 'tubeless' : 'tube'}`;

    useEffect(() => {
        setWhatIfTireWidth(Math.max(20, Math.round(tireWidth + 4)));
    }, [tireWidth]);

    useEffect(() => {
        const entries = getSetupFeedbackForProfile(profileKey);
        setFeedbackEntries(entries);
        setFeedbackSavedCount(entries.length);
    }, [profileKey]);

    const saveRideFeedback = () => {
        addSetupFeedback(
            profileKey,
            {
                riderWeight,
                bikeWeight,
                tireWidth,
                rimWidth,
                measuredWidth: Math.round(measuredWidth),
                surface,
                isTubeless,
                isWet,
                recommendedFrontPsi: Number(result.front.recommended.toFixed(1)),
                recommendedRearPsi: Number(result.rear.recommended.toFixed(1))
            },
            feedbackOutcome
        );
        const entries = getSetupFeedbackForProfile(profileKey);
        setFeedbackEntries(entries);
        setFeedbackSavedCount(entries.length);
    };

    const buildWhatIfDelta = useMemo(() => {
        const crank = parts.Crankset as { specs?: { chainrings?: unknown[] }, attributes?: { teeth?: string } } | undefined;
        const cassette = parts.Cassette as { specs?: { range?: string }, attributes?: { range?: string } } | undefined;
        const wheelRear = parts.WheelRear as { specs?: { diameter?: string } } | undefined;
        if (!crank || !cassette) return null;

        const chainrings: number[] = Array.isArray(crank.specs?.chainrings)
            ? crank.specs.chainrings.map((n) => Number(n)).filter((n: number) => !isNaN(n))
            : String(crank.attributes?.teeth || '')
                .replace(/[^0-9,/]/g, '')
                .replace('/', ',')
                .split(',')
                .map((n: string) => parseInt(n))
                .filter((n: number) => !isNaN(n));

        if (chainrings.length === 0) return null;

        const cassetteRange = String(cassette.specs?.range || cassette.attributes?.range || '11-34');
        const wheelSize = String(wheelRear?.specs?.diameter || '').includes('650') ? 584 : 622;

        return computeUnifiedWhatIf({
            baseline: { chainrings, cassetteRange, tireSize: tireWidth, wheelSize },
            candidate: { chainrings, cassetteRange, tireSize: whatIfTireWidth, wheelSize },
            ftp: 250,
            riderWeightKg: riderWeight + bikeWeight,
            cadenceRpm: 90,
            climbGradePercent: 8
        });
    }, [parts, tireWidth, whatIfTireWidth, riderWeight, bikeWeight]);

    const markFeedbackVerified = (entryId: string) => {
        verifySetupFeedback(entryId, 'Verified after ride check');
        const entries = getSetupFeedbackForProfile(profileKey);
        setFeedbackEntries(entries);
        setFeedbackSavedCount(entries.length);
    };

    const eventPressurePlan = useMemo(() => {
        const qualifyingAdjust = surface.startsWith('road') ? 1.5 : 1.0;
        const raceAdjust = isWet ? -1.5 : -0.5;

        return {
            qualifying: {
                front: Math.max(10, result.front.recommended + qualifyingAdjust),
                rear: Math.max(10, result.rear.recommended + qualifyingAdjust),
            },
            dayBefore: {
                front: result.front.recommended,
                rear: result.rear.recommended,
            },
            raceDay: {
                front: Math.max(10, result.front.recommended + raceAdjust),
                rear: Math.max(10, result.rear.recommended + raceAdjust),
            }
        };
    }, [result, surface, isWet]);

    return (
        <div className="w-full max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Left Column: Inputs */}
                <div className="lg:col-span-5 space-y-8">
                    <section className="space-y-4">
                        <h3 className="text-sm font-semibold text-stone-400 uppercase tracking-wider flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            System Details
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <InputField
                                label="Rider Weight"
                                value={Number(toWeight(riderWeight, unitSystem).toFixed(1))}
                                onChange={(val: number) => setRiderWeight(fromWeight(val, unitSystem))}
                                unit={weightUnit(unitSystem)}
                                min={Number(toWeight(40, unitSystem).toFixed(0))}
                                max={Number(toWeight(150, unitSystem).toFixed(0))}
                            />
                            <InputField
                                label="Bike Weight"
                                value={Number(toWeight(bikeWeight, unitSystem).toFixed(1))}
                                onChange={(val: number) => setBikeWeight(fromWeight(val, unitSystem))}
                                unit={weightUnit(unitSystem)}
                                min={Number(toWeight(5, unitSystem).toFixed(0))}
                                max={Number(toWeight(30, unitSystem).toFixed(0))}
                                step={0.1}
                            />
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h3 className="text-sm font-semibold text-stone-400 uppercase tracking-wider flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            Tire & Rim
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <InputField
                                label="Tire Width"
                                value={tireWidth}
                                onChange={setTireWidth}
                                unit="mm"
                                min={20} max={60}
                            />
                            <InputField
                                label="Inner Rim Width"
                                value={rimWidth}
                                onChange={setRimWidth}
                                unit="mm"
                                min={13} max={40}
                            />
                        </div>
                        <Toggle
                            label="Tubeless Setup"
                            checked={isTubeless}
                            onChange={setIsTubeless}
                            icon={Zap}
                        />
                    </section>

                    <section className="space-y-4">
                        <h3 className="text-sm font-semibold text-stone-400 uppercase tracking-wider flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            Conditions
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <select
                                value={surface}
                                onChange={(e) => setSurface(e.target.value as SurfaceType)}
                                className="col-span-2 bg-stone-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                            >
                                <option value="road-smooth">Smooth Tarmac</option>
                                <option value="road-poor">Rough Road / Chip Seal</option>
                                <option value="gravel-smooth">Smooth Gravel</option>
                                <option value="gravel-chunky">Chunky Gravel</option>
                                <option value="mtb-trail">MTB Trail</option>
                                <option value="mtb-enduro">MTB Enduro/DH</option>
                            </select>
                        </div>
                        <Toggle
                            label="Wet Conditions"
                            checked={isWet}
                            onChange={setIsWet}
                            icon={Droplets}
                        />
                    </section>
                </div>

                {/* Right Column: Results */}
                <div className="lg:col-span-7">
                    <div className="sticky top-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-stone-900/80 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden"
                        >
                            {/* Background Glow */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 blur-[100px] rounded-full pointer-events-none" />

                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400">
                                        <Gauge className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">Recommended Pressure</h2>
                                        <p className="text-stone-500 text-sm">Optimized for speed & grip balance</p>
                                    </div>
                                </div>

                                {buildSeedApplied && (
                                    <div className="mb-6 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                        <p className="text-xs text-emerald-200">
                                            Pre-filled from your current Workshop build (rear tire, rim width, and discipline). Adjust for conditions and ride feel.
                                        </p>
                                    </div>
                                )}

                                <div className="mb-6 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                                    <p className="text-xs text-blue-200">
                                        <span className="font-semibold">Model confidence:</span> {confidenceLabel}. Start here, then fine-tune from ride feedback.
                                    </p>
                                    <button
                                        onClick={() => setShowAssumptions((v) => !v)}
                                        className="mt-2 text-[11px] text-blue-300 hover:text-blue-100 underline underline-offset-2"
                                    >
                                        {showAssumptions ? 'Hide model assumptions' : 'Show model assumptions'}
                                    </button>
                                </div>

                                {showAssumptions && (
                                    <div className="mb-6 p-3 rounded-xl bg-white/5 border border-white/10">
                                        <ul className="text-xs text-stone-300 space-y-1.5 list-disc pl-4">
                                            <li>Load split uses 45% front / 55% rear.</li>
                                            <li>Measured tire width is estimated from tire+rims (rim effect adjustment).</li>
                                            <li>Tubeless applies a pressure reduction before terrain and preference modifiers.</li>
                                            <li>Surface and preference sliders are comparative multipliers, not lab-calibrated absolutes.</li>
                                        </ul>
                                    </div>
                                )}

                                {outOfDistribution && (
                                    <div className="mb-6 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                                        <p className="text-xs text-amber-200">
                                            This tire/rim combo is outside common ranges. Verify tire and rim manufacturer pressure limits before riding.
                                        </p>
                                    </div>
                                )}

                                <div className="space-y-8">
                                    <PressureBar
                                        label="Front Tire"
                                        value={toPressure(result.front.recommended, unitSystem)}
                                        min={toPressure(result.front.min, unitSystem)}
                                        max={toPressure(result.front.max, unitSystem)}
                                        color="text-rose-400"
                                        unit={pressureUnit(unitSystem)}
                                    />
                                    <PressureBar
                                        label="Rear Tire"
                                        value={toPressure(result.rear.recommended, unitSystem)}
                                        min={toPressure(result.rear.min, unitSystem)}
                                        max={toPressure(result.rear.max, unitSystem)}
                                        color="text-rose-400"
                                        unit={pressureUnit(unitSystem)}
                                    />
                                </div>

                                <div className="mt-6 p-3 rounded-xl bg-white/5 border border-white/10">
                                    <div className="text-xs text-stone-400 mb-2">Ride feedback loop (verification pending)</div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <select
                                            value={feedbackOutcome}
                                            onChange={(e) => setFeedbackOutcome(e.target.value as FeedbackOutcome)}
                                            className="bg-stone-900 border border-white/10 rounded px-2 py-1 text-xs text-white"
                                        >
                                            <option value="balanced">Felt balanced</option>
                                            <option value="too_harsh">Too harsh</option>
                                            <option value="burped">Burped / too low</option>
                                            <option value="sluggish">Sluggish / too high drag</option>
                                        </select>
                                        <button
                                            onClick={saveRideFeedback}
                                            className="text-xs px-2 py-1 rounded bg-rose-500/20 border border-rose-500/30 text-rose-200 hover:bg-rose-500/30"
                                        >
                                            Save feedback
                                        </button>
                                        <span className="text-[11px] text-stone-500">
                                            {feedbackSavedCount} entries for this profile
                                        </span>
                                    </div>
                                    {feedbackEntries.length > 0 && (
                                        <div className="mt-3 space-y-1">
                                            {feedbackEntries.slice(0, 3).map((entry) => (
                                                <div key={entry.id} className="flex items-center justify-between text-[11px] text-stone-400">
                                                    <span>
                                                        {entry.outcome.replace('_', ' ')} • {entry.verificationStatus}
                                                    </span>
                                                    {entry.verificationStatus === 'pending' ? (
                                                        <button
                                                            onClick={() => markFeedbackVerified(entry.id)}
                                                            className="text-emerald-300 hover:text-emerald-200 underline"
                                                        >
                                                            Mark verified
                                                        </button>
                                                    ) : (
                                                        <span className="text-emerald-400">✓ verified</span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="mt-3 p-3 rounded-xl bg-white/5 border border-white/10">
                                    <div className="flex items-center justify-between">
                                        <div className="text-xs text-stone-400">Event mode pressure sets</div>
                                        <button
                                            onClick={() => setShowEventPlan((v) => !v)}
                                            className="text-[11px] text-cyan-300 hover:text-cyan-100 underline underline-offset-2"
                                        >
                                            {showEventPlan ? 'Hide event plan' : 'Show event plan'}
                                        </button>
                                    </div>
                                    {showEventPlan && (
                                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                                            <div className="rounded-lg border border-white/10 bg-black/20 p-2">
                                                <div className="text-stone-500 mb-1">Qualifying</div>
                                                <div className="font-mono text-stone-200">
                                                    F {toPressure(eventPressurePlan.qualifying.front, unitSystem).toFixed(1)} / R {toPressure(eventPressurePlan.qualifying.rear, unitSystem).toFixed(1)} {pressureUnit(unitSystem)}
                                                </div>
                                            </div>
                                            <div className="rounded-lg border border-white/10 bg-black/20 p-2">
                                                <div className="text-stone-500 mb-1">Day before</div>
                                                <div className="font-mono text-stone-200">
                                                    F {toPressure(eventPressurePlan.dayBefore.front, unitSystem).toFixed(1)} / R {toPressure(eventPressurePlan.dayBefore.rear, unitSystem).toFixed(1)} {pressureUnit(unitSystem)}
                                                </div>
                                            </div>
                                            <div className="rounded-lg border border-white/10 bg-black/20 p-2">
                                                <div className="text-stone-500 mb-1">Race day</div>
                                                <div className="font-mono text-stone-200">
                                                    F {toPressure(eventPressurePlan.raceDay.front, unitSystem).toFixed(1)} / R {toPressure(eventPressurePlan.raceDay.rear, unitSystem).toFixed(1)} {pressureUnit(unitSystem)}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {buildWhatIfDelta && (
                                    <div className="mt-3 p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                                        <div className="text-xs text-cyan-200 mb-2">Cross-tool what-if (tire {tireWidth}mm → {whatIfTireWidth}mm)</div>
                                        <div className="grid grid-cols-3 gap-2 text-[11px] text-stone-300">
                                            <div>
                                                <div className="text-stone-500">Top speed @90</div>
                                                <div>{buildWhatIfDelta.topSpeedDeltaKph >= 0 ? '+' : ''}{buildWhatIfDelta.topSpeedDeltaKph.toFixed(1)} km/h</div>
                                            </div>
                                            <div>
                                                <div className="text-stone-500">Cadence @8%</div>
                                                <div>{buildWhatIfDelta.cadenceDeltaRpmAtGrade >= 0 ? '+' : ''}{buildWhatIfDelta.cadenceDeltaRpmAtGrade.toFixed(0)} rpm</div>
                                            </div>
                                            <div>
                                                <div className="text-stone-500">Pressure hint</div>
                                                <div>{buildWhatIfDelta.pressureHintDeltaPct >= 0 ? '+' : ''}{buildWhatIfDelta.pressureHintDeltaPct.toFixed(1)}%</div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Range Slider Visual */}
                                <div className="mt-10 pt-8 border-t border-white/5">
                                    <div className="flex justify-between text-xs font-bold text-stone-500 uppercase tracking-wider mb-4">
                                        <span>Max Grip</span>
                                        <span>Balanced</span>
                                        <span>Max Speed</span>
                                    </div>

                                    <div className="relative h-8 flex items-center">
                                        {/* Track Background */}
                                        <div className="absolute inset-x-0 h-2 bg-stone-800 rounded-full overflow-hidden">
                                            <div className="absolute left-1/4 right-1/4 top-0 bottom-0 bg-gradient-to-r from-rose-900/50 via-rose-500/50 to-rose-900/50 rounded-full opacity-50" />
                                        </div>

                                        {/* Interactive Slider */}
                                        <input
                                            type="range"
                                            min="-1"
                                            max="1"
                                            step="0.1"
                                            value={preference}
                                            onChange={(e) => setPreference(parseFloat(e.target.value))}
                                            className="relative w-full h-8 opacity-0 z-20 cursor-pointer"
                                            aria-label="Pressure Preference"
                                        />

                                        {/* Custom Thumb Visual (follows the hidden input) */}
                                        <div
                                            className="absolute h-4 w-4 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)] border-2 border-stone-900 pointer-events-none z-10 transition-all duration-75"
                                            style={{
                                                left: `calc(${((preference + 1) / 2) * 100}% - 8px)`
                                            }}
                                        />
                                    </div>

                                    <p className="text-center text-xs text-stone-500 mt-3">
                                        {preference === 0
                                            ? "Balanced setup for mixed riding."
                                            : preference < 0
                                                ? `Prioritizing grip (${Math.round(Math.abs(preference) * 100)}%). Lower pressure.`
                                                : `Prioritizing speed (${Math.round(preference * 100)}%). Higher pressure.`}
                                    </p>
                                    <p className="text-center text-[11px] text-stone-600 mt-2">
                                        Confidence drops as terrain gets rougher or setup gets more extreme.
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Quick Tips */}
                        <div className="mt-6 grid grid-cols-2 gap-4">
                            <div className="bg-stone-900/40 rounded-xl p-4 border border-white/5">
                                <div className="text-rose-400 mb-2"><Info className="w-4 h-4" /></div>
                                <h4 className="text-sm font-bold text-stone-300 mb-1">Rim Width Matters</h4>
                                <p className="text-xs text-stone-500 leading-relaxed">
                                    Your {rimWidth}mm rims make your {tireWidth}mm tires behave like {Math.round(measuredWidth)}mm tires. We&apos;ve adjusted for this.
                                </p>
                            </div>
                            <div className="bg-stone-900/40 rounded-xl p-4 border border-white/5">
                                <div className="text-rose-400 mb-2"><Mountain className="w-4 h-4" /></div>
                                <h4 className="text-sm font-bold text-stone-300 mb-1">Temperature</h4>
                                <p className="text-xs text-stone-500 leading-relaxed">
                                    Tires gain ~1 psi (0.07 bar) per 10°F (5°C) increase. Check pressures before riding in the ambient temp you&apos;ll ride in.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

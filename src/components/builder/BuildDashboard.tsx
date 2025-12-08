'use client';

import React, { useState } from 'react';
import { useBuildStore } from '@/store/buildStore';
import { AlertTriangle, CheckCircle, XCircle, Scale, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { formatWeight } from '@/lib/weightCalculations';
import { useSettingsStore } from '@/store/settingsStore';

export const BuildDashboard: React.FC = () => {
    const { validationResult, totalWeight, parts, factoryFork } = useBuildStore();
    const { unitSystem } = useSettingsStore();
    const [showWeightBreakdown, setShowWeightBreakdown] = useState(false);

    const issues = validationResult?.issues || [];
    const errors = issues.filter(r => r.severity === 'ERROR');
    const warnings = issues.filter(r => r.severity === 'WARNING');
    const isCompatible = validationResult?.compatible ?? true;

    // Calculate Score (Simple heuristic for now)
    // 100 = Perfect
    // -20 per error
    // -5 per warning
    const score = Math.max(0, 100 - (errors.length * 20) - (warnings.length * 5));

    let statusColor = 'text-emerald-500';
    let StatusIcon = CheckCircle;
    let statusText = 'Build is Compatible';

    if (errors.length > 0) {
        statusColor = 'text-red-500';
        StatusIcon = XCircle;
        statusText = 'Incompatible Parts Detected';
    } else if (warnings.length > 0) {
        statusColor = 'text-amber-500';
        StatusIcon = AlertTriangle;
        statusText = 'Compatibility Warnings';
    }

    return (
        <div className="bg-stone-900/50 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-stone-100">Build Health</h2>
                <div className={`flex items-center gap-2 ${statusColor}`}>
                    <StatusIcon className="w-5 h-5" />
                    <span className="font-medium">{score}%</span>
                </div>
            </div>

            {/* Status Banner */}
            <div className={`p-3 rounded-lg mb-4 flex items-center gap-3 ${errors.length > 0 ? 'bg-red-500/10 border border-red-500/20' :
                warnings.length > 0 ? 'bg-amber-500/10 border border-amber-500/20' :
                    'bg-emerald-500/10 border border-emerald-500/20'
                }`}>
                <StatusIcon className={`w-5 h-5 ${statusColor}`} />
                <span className={`text-sm font-medium ${statusColor}`}>{statusText}</span>
            </div>

            {/* Issues List */}
            <div className="space-y-2 mb-4">
                {errors.map((err, idx) => (
                    <div key={`err-${idx}`} className="flex items-start gap-2 text-sm text-red-400 bg-red-500/5 p-2 rounded">
                        <XCircle className="w-4 h-4 mt-0.5 shrink-0" />
                        <span>{err.message}</span>
                    </div>
                ))}
                {warnings.map((warn, idx) => (
                    <div key={`warn-${idx}`} className="flex items-start gap-2 text-sm text-amber-400 bg-amber-500/5 p-2 rounded">
                        <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                        <span>{warn.message}</span>
                    </div>
                ))}
                {isCompatible && warnings.length === 0 && (
                    <div className="text-sm text-stone-500 text-center py-2">
                        No compatibility issues found.
                    </div>
                )}
            </div>

            {/* Weight */}
            <div className="border-t border-white/10 pt-4">
                <button
                    onClick={() => setShowWeightBreakdown(!showWeightBreakdown)}
                    className="w-full flex items-center justify-between hover:bg-white/5 -mx-2 px-2 py-1 rounded transition-colors"
                >
                    <div className="flex items-center gap-2 text-stone-400">
                        <Scale className="w-4 h-4" />
                        <span className="text-sm">Est. Weight</span>
                        {showWeightBreakdown ? (
                            <ChevronUp className="w-3 h-3" />
                        ) : (
                            <ChevronDown className="w-3 h-3" />
                        )}
                    </div>
                    <span className="text-lg font-mono text-stone-200">
                        {formatWeight(totalWeight, unitSystem).value} <span className="text-sm text-stone-500">{formatWeight(totalWeight, unitSystem).unit}</span>
                    </span>
                </button>

                {/* Weight Breakdown */}
                {showWeightBreakdown && (
                    <div className="mt-3 space-y-2 text-sm">
                        {/* Factory Fork Note */}
                        {factoryFork.usingFactoryFork && parts.Frame && (
                            <div className="flex items-start gap-2 p-2 rounded bg-blue-500/5 border border-blue-500/10">
                                <Info className="w-3.5 h-3.5 text-blue-400 mt-0.5 shrink-0" />
                                <span className="text-blue-300 text-xs">
                                    Frameset weight includes factory fork
                                    {factoryFork.factoryForkName && ` (${factoryFork.factoryForkName})`}
                                </span>
                            </div>
                        )}

                        {/* Deduction Note */}
                        {!factoryFork.usingFactoryFork && factoryFork.factoryForkWeight > 0 && (
                            <div className="flex items-start gap-2 p-2 rounded bg-amber-500/5 border border-amber-500/10">
                                <Info className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                                <span className="text-amber-300 text-xs">
                                    Factory fork ({factoryFork.factoryForkWeight}g) deducted from frameset
                                </span>
                            </div>
                        )}

                        {/* Component Weights */}
                        <div className="space-y-1 pt-2">
                            {parts.Frame && (
                                <WeightRow
                                    label={factoryFork.usingFactoryFork ? "Frameset (incl. fork)" : "Frame"}
                                    weight={(parts.Frame as any).weightGrams}
                                    unitSystem={unitSystem}
                                />
                            )}
                            {!factoryFork.usingFactoryFork && parts.Fork && (
                                <WeightRow label="Fork" weight={(parts.Fork as any).weightGrams} unitSystem={unitSystem} />
                            )}
                            {(parts.WheelFront || parts.WheelRear) && (
                                <WeightRow
                                    label="Wheels"
                                    weight={((parts.WheelFront as any)?.weightGrams || 0) + ((parts.WheelRear as any)?.weightGrams || 0)}
                                    unitSystem={unitSystem}
                                />
                            )}
                            {(parts.TireFront || parts.TireRear) && (
                                <WeightRow
                                    label="Tires"
                                    weight={((parts.TireFront as any)?.weightGrams || 0) + ((parts.TireRear as any)?.weightGrams || 0)}
                                    unitSystem={unitSystem}
                                />
                            )}
                            {parts.Crankset && (
                                <WeightRow label="Crankset" weight={(parts.Crankset as any).weightGrams} unitSystem={unitSystem} />
                            )}
                            {parts.BottomBracket && (
                                <WeightRow label="Bottom Bracket" weight={(parts.BottomBracket as any).weightGrams} unitSystem={unitSystem} />
                            )}
                            {parts.Cassette && (
                                <WeightRow label="Cassette" weight={(parts.Cassette as any).weightGrams} unitSystem={unitSystem} />
                            )}
                            {parts.RearDerailleur && (
                                <WeightRow label="Rear Derailleur" weight={(parts.RearDerailleur as any).weightGrams} unitSystem={unitSystem} />
                            )}
                            {parts.Shifter && (
                                <WeightRow label="Shifters" weight={(parts.Shifter as any).weightGrams} unitSystem={unitSystem} />
                            )}
                            {(parts.BrakeCaliperFront || parts.BrakeCaliperRear) && (
                                <WeightRow
                                    label="Brake Calipers"
                                    weight={((parts.BrakeCaliperFront as any)?.weightGrams || 0) + ((parts.BrakeCaliperRear as any)?.weightGrams || 0)}
                                    unitSystem={unitSystem}
                                />
                            )}
                            {(parts.BrakeRotorFront || parts.BrakeRotorRear) && (
                                <WeightRow
                                    label="Brake Rotors"
                                    weight={((parts.BrakeRotorFront as any)?.weightGrams || 0) + ((parts.BrakeRotorRear as any)?.weightGrams || 0)}
                                    unitSystem={unitSystem}
                                />
                            )}
                            {parts.Stem && (
                                <WeightRow label="Stem" weight={(parts.Stem as any).weightGrams} unitSystem={unitSystem} />
                            )}
                            {parts.Handlebar && (
                                <WeightRow label="Handlebar" weight={(parts.Handlebar as any).weightGrams} unitSystem={unitSystem} />
                            )}
                            {parts.Seatpost && (
                                <WeightRow label="Seatpost" weight={(parts.Seatpost as any).weightGrams} unitSystem={unitSystem} />
                            )}
                        </div>

                        {/* Factory Fork Deduction Line */}
                        {!factoryFork.usingFactoryFork && factoryFork.factoryForkWeight > 0 && (
                            <div className="pt-2 border-t border-white/5">
                                <div className="flex justify-between text-amber-400">
                                    <span>Factory fork deduction</span>
                                    <span className="font-mono">-{formatWeight(factoryFork.factoryForkWeight, unitSystem).value}{formatWeight(factoryFork.factoryForkWeight, unitSystem).unit}</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

// Helper component for weight rows
const WeightRow: React.FC<{ label: string; weight: number; unitSystem: 'metric' | 'imperial' }> = ({ label, weight, unitSystem }) => {
    if (!weight || weight <= 0) return null;
    const formatted = formatWeight(weight, unitSystem);
    return (
        <div className="flex justify-between text-stone-400">
            <span>{label}</span>
            <span className="font-mono text-stone-300">{formatted.value}{formatted.unit}</span>
        </div>
    );
};

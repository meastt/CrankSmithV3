'use client';

import React from 'react';
import { useBuildStore } from '@/store/buildStore';
import { AlertTriangle, CheckCircle, XCircle, Scale } from 'lucide-react';
import { formatWeight } from '@/lib/weightCalculations';
import { useSettingsStore } from '@/store/settingsStore';

export const BuildDashboard: React.FC = () => {
    const { validationResults, totalWeight } = useBuildStore();
    const { unitSystem } = useSettingsStore();

    const errors = validationResults.filter(r => r.status === 'INCOMPATIBLE');
    const warnings = validationResults.filter(r => r.status === 'WARNING');
    const isCompatible = errors.length === 0;

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
            <div className="border-t border-white/10 pt-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-stone-400">
                    <Scale className="w-4 h-4" />
                    <span className="text-sm">Est. Weight</span>
                </div>
                <span className="text-lg font-mono text-stone-200">
                    {formatWeight(totalWeight, unitSystem).value} <span className="text-sm text-stone-500">{formatWeight(totalWeight, unitSystem).unit}</span>
                </span>
            </div>
        </div>
    );
};

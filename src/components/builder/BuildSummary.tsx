'use client';

import React from 'react';
import { useBuildStore } from '@/store/buildStore';
import { AlertTriangle, Trash2, Save, Download, Package } from 'lucide-react';

export const BuildSummary: React.FC = () => {
    const { parts, removePart, validationErrors } = useBuildStore();

    const totalWeight = Object.values(parts).reduce((sum, part) => sum + (part?.attributes?.weight_g || 0), 0);
    const partsCount = Object.values(parts).filter(Boolean).length;

    const handleSave = async () => {
        const name = window.prompt('Name your build:');
        if (!name) return;

        try {
            const res = await fetch('/api/builds', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, parts }),
            });

            if (res.ok) {
                alert('Build saved to Garage!');
            } else {
                if (res.status === 401) {
                    alert('Please sign in to save builds.');
                    window.location.href = '/api/auth/signin';
                } else {
                    alert('Failed to save build.');
                }
            }
        } catch (err) {
            console.error(err);
            alert('An error occurred.');
        }
    };

    const handleExport = () => {
        const headers = ['Type', 'Component', 'Weight (g)'];
        const rows = Object.entries(parts).map(([type, part]) => [
            type,
            part?.name || 'Not Selected',
            part?.attributes?.weight_g || '0'
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'cranksmith-build.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    // Get extras
    const getExtras = () => {
        const extras: string[] = [];
        if (parts.Frame && ['Road', 'Gravel'].includes(parts.Frame.attributes.category as string)) {
            extras.push('Handlebar Tape');
        }
        if (parts.Wheel?.attributes?.tubeless_ready && parts.Tire?.attributes?.tubeless_ready) {
            extras.push('Tubeless Valves (x2)');
            extras.push('Tire Sealant');
        }
        if (parts.Frame?.interfaces?.brake_type === 'Disc' || parts.Wheel?.interfaces?.brake_type === 'Disc') {
            extras.push('Disc Rotors (x2)');
        }
        if (parts.Shifter?.interfaces?.protocol) {
            const proto = (parts.Shifter.interfaces.protocol as string).toLowerCase();
            if (proto.includes('wireless') || proto.includes('axs') || proto.includes('di2')) {
                extras.push('Batteries / Charger');
            } else if (proto.includes('hydraulic')) {
                extras.push('Hydraulic Hoses & Fluid');
            } else {
                extras.push('Shift Cables & Housing');
            }
        }
        return extras;
    };

    const extras = getExtras();

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-5 border-b border-white/5">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-lg font-semibold text-stone-100">Current Build</h2>
                        <p className="text-xs text-stone-500 mt-0.5">{partsCount} parts selected</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-stone-600" />
                    </div>
                </div>

                {/* Weight display */}
                <div className="flex items-baseline justify-between bg-white/[0.02] rounded-xl p-4 border border-white/5">
                    <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">Total Weight</span>
                    <div className="text-right">
                        <span className="text-2xl font-bold text-stone-100 font-mono">{totalWeight.toLocaleString()}</span>
                        <span className="text-sm text-stone-500 ml-1">g</span>
                    </div>
                </div>
            </div>

            {/* Parts List */}
            <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-2">
                    {Object.entries(parts).map(([type, component]) => (
                        <div
                            key={type}
                            className={`group rounded-xl border transition-all ${
                                component
                                    ? 'bg-white/[0.02] border-white/5 hover:border-white/10'
                                    : 'border-dashed border-white/5'
                            } p-3`}
                        >
                            <div className="flex justify-between items-start gap-2">
                                <div className="min-w-0 flex-1">
                                    <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">
                                        {type.replace('BottomBracket', 'BB')}
                                    </span>
                                    {component ? (
                                        <p className="text-sm font-medium text-stone-200 truncate mt-0.5">
                                            {component.name}
                                        </p>
                                    ) : (
                                        <p className="text-sm text-stone-600 italic mt-0.5">Not selected</p>
                                    )}
                                </div>
                                {component && (
                                    <button
                                        onClick={() => removePart(type)}
                                        className="opacity-0 group-hover:opacity-100 p-1.5 text-stone-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                        title="Remove part"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Validation Errors */}
                {validationErrors.length > 0 && (
                    <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                        <div className="flex items-center gap-2 text-red-400 mb-2">
                            <AlertTriangle className="w-4 h-4" />
                            <span className="font-semibold text-sm">Compatibility Issues</span>
                        </div>
                        <ul className="space-y-1.5">
                            {validationErrors.map((error, idx) => (
                                <li key={idx} className="text-xs text-red-300/80 flex items-start gap-2">
                                    <span className="w-1 h-1 bg-red-400 rounded-full mt-1.5 shrink-0" />
                                    {error}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Required Extras */}
                {extras.length > 0 && (
                    <div className="mt-4 bg-primary/5 border border-primary/10 rounded-xl p-4">
                        <h3 className="text-[10px] font-semibold text-primary uppercase tracking-wider mb-2">
                            Required Extras
                        </h3>
                        <ul className="space-y-1.5">
                            {extras.map((item, idx) => (
                                <li key={idx} className="text-xs text-stone-400 flex items-center gap-2">
                                    <span className="w-1 h-1 bg-primary rounded-full" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-white/5 space-y-2">
                <button
                    onClick={handleSave}
                    className="w-full btn-ghost py-3 px-4 rounded-xl text-stone-300 font-medium text-sm flex items-center justify-center gap-2"
                >
                    <Save className="w-4 h-4" />
                    Save to Garage
                </button>
                <button
                    onClick={handleExport}
                    className="w-full btn-primary py-3 px-4 rounded-xl text-white font-medium text-sm flex items-center justify-center gap-2"
                >
                    <Download className="w-4 h-4" />
                    Export Build
                </button>
            </div>
        </div>
    );
};

'use client';

import React, { useState } from 'react';
import { useBuildStore } from '@/store/buildStore';
import { useToast } from '@/components/ui/Toast';
import { AlertTriangle, Trash2, Save, Download, Package, X } from 'lucide-react';

export const BuildSummary: React.FC = () => {
    const { parts, removePart, validationResult, totalWeight } = useBuildStore();
    const { toast } = useToast();
    const [showSaveInput, setShowSaveInput] = useState(false);
    const [buildName, setBuildName] = useState('');
    const [saving, setSaving] = useState(false);

    const partsCount = Object.values(parts).filter(Boolean).length;

    const handleSave = async () => {
        if (!buildName.trim()) return;
        setSaving(true);

        try {
            const res = await fetch('/api/builds', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: buildName.trim(), parts }),
            });

            if (res.ok) {
                toast({ type: 'success', title: 'Saved!', message: `"${buildName.trim()}" added to your Garage.` });
                setShowSaveInput(false);
                setBuildName('');
            } else if (res.status === 401) {
                toast({ type: 'error', title: 'Sign in required', message: 'Please sign in to save builds.' });
                window.location.href = '/sign-in';
            } else {
                toast({ type: 'error', title: 'Save failed', message: 'Something went wrong. Please try again.' });
            }
        } catch (err) {
            console.error(err);
            toast({ type: 'error', title: 'Error', message: 'Could not connect to server.' });
        } finally {
            setSaving(false);
        }
    };

    const handleExport = () => {
        const headers = ['Type', 'Component', 'Weight (g)'];
        const rows = Object.entries(parts).map(([type, part]) => [
            type,
            (part as any)?.name || 'Not Selected',
            (part as any)?.weightGrams || '0'
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
        if (parts.Frame && (parts.Frame.type === 'ROAD' || parts.Frame.type === 'GRAVEL')) {
            extras.push('Handlebar Tape');
        }
        if ((parts.WheelFront?.attributes?.tubeless_ready || parts.WheelRear?.attributes?.tubeless_ready) &&
            (parts.TireFront?.specs?.tubeless_ready || parts.TireRear?.specs?.tubeless_ready)) {
            extras.push('Tubeless Valves (x2)');
            extras.push('Tire Sealant');
        }
        if (parts.Frame?.specs?.brake_mount?.includes('FLAT') || parts.WheelFront?.specs?.brake_interface?.includes('DISC')) {
            extras.push('Disc Rotors (x2)');
        }
        if (parts.Shifter) {
            const shifterName = (parts.Shifter.name || '').toUpperCase();
            const isElectronic = shifterName.includes('DI2') || shifterName.includes('AXS') || shifterName.includes('EPS') || shifterName.includes('ETAP');
            const isHydraulic = parts.Shifter.attributes?.brake_fluid || parts.Shifter.attributes?.type === 'Hydraulic';
            if (isElectronic) {
                extras.push('Batteries / Charger');
            } else if (isHydraulic) {
                extras.push('Hydraulic Hoses & Fluid');
            } else {
                extras.push('Shift Cables & Housing');
            }
        }
        return extras;
    };

    const extras = getExtras();
    const issues = validationResult?.issues || [];
    const errors = issues.filter(r => r.severity === 'ERROR');

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
            </div>

            {/* Parts List */}
            <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-2">
                    {(Object.entries(parts) as [keyof typeof parts, typeof parts[keyof typeof parts]][]).map(([type, component]) => (
                        <div
                            key={type}
                            className={`group rounded-xl border transition-all ${component
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
                                            {(component as any).name}
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
                {errors.length > 0 && (
                    <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                        <div className="flex items-center gap-2 text-red-400 mb-2">
                            <AlertTriangle className="w-4 h-4" />
                            <span className="font-semibold text-sm">Compatibility Issues</span>
                        </div>
                        <ul className="space-y-1.5">
                            {errors.map((result, idx) => (
                                <li key={idx} className="text-xs text-red-300/80 flex items-start gap-2">
                                    <span className="w-1 h-1 bg-red-400 rounded-full mt-1.5 shrink-0" />
                                    {result.message}
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
                {showSaveInput ? (
                    <div className="space-y-2">
                        <input
                            type="text"
                            value={buildName}
                            onChange={(e) => setBuildName(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') setShowSaveInput(false); }}
                            placeholder="Name your build..."
                            autoFocus
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-stone-200 placeholder-stone-600 focus:outline-none focus:border-primary/50 transition-colors"
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={handleSave}
                                disabled={!buildName.trim() || saving}
                                className="flex-1 btn-primary py-2.5 px-4 rounded-xl text-white font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? 'Saving…' : 'Save'}
                            </button>
                            <button
                                onClick={() => { setShowSaveInput(false); setBuildName(''); }}
                                className="p-2.5 text-stone-500 hover:text-stone-300 hover:bg-white/5 rounded-xl transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => setShowSaveInput(true)}
                        className="w-full btn-ghost py-3 px-4 rounded-xl text-stone-300 font-medium text-sm flex items-center justify-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        Save to Garage
                    </button>
                )}
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

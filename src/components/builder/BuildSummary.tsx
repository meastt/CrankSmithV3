'use client';

import React from 'react';
import { useBuildStore } from '@/store/buildStore';
import { AlertTriangle, Trash2, Save, Download } from 'lucide-react';

export const BuildSummary: React.FC = () => {
    const { parts, removePart, validationErrors } = useBuildStore();

    const totalWeight = Object.values(parts).reduce((sum, part) => sum + (part?.attributes?.weight_g || 0), 0);

    return (
        <div className="w-full lg:w-80 bg-gray-900/95 backdrop-blur-xl border-r border-white/10 h-full flex flex-col shadow-2xl z-20">
            <div className="p-6 border-b border-white/10">
                <h2 className="text-xl font-bold text-white tracking-tight">Current Build</h2>
                <p className="text-xs text-gray-500 mt-1">Manage your selected components</p>
                <div className="mt-4 flex justify-between items-baseline">
                    <span className="text-xs text-gray-400 uppercase tracking-wider">Total Weight</span>
                    <span className="text-lg font-bold text-white font-mono">{totalWeight}g</span>
                </div>
            </div>

            <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                {Object.entries(parts).map(([type, component]) => (
                    <div key={type} className="group bg-white/5 hover:bg-white/10 transition-colors rounded-lg border border-white/5 p-3">
                        <div className="flex justify-between items-start">
                            <div className="flex-1 min-w-0 mr-2">
                                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-0.5 block">{type}</span>
                                {component ? (
                                    <p className="text-sm font-medium text-white truncate leading-tight">{component.name}</p>
                                ) : (
                                    <p className="text-sm text-gray-600 italic">Not selected</p>
                                )}
                            </div>
                            {component && (
                                <button
                                    onClick={() => removePart(type)}
                                    className="text-gray-500 hover:text-red-400 transition-colors p-1 rounded-md hover:bg-white/5"
                                    title="Remove part"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>
                    </div>
                ))}

                {validationErrors.length > 0 && (
                    <div className="mt-6 bg-red-500/10 border border-red-500/20 rounded-lg p-4 animate-in fade-in slide-in-from-bottom-2">
                        <div className="flex items-center text-red-400 mb-2">
                            <AlertTriangle className="w-4 h-4 mr-2" />
                            <span className="font-semibold text-sm">Incompatible Build</span>
                        </div>
                        <ul className="list-disc list-inside text-xs text-red-300 space-y-1 ml-1">
                            {validationErrors.map((error, idx) => (
                                <li key={idx}>{error}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Small Parts Logic */}
                {(() => {
                    const extras = [];

                    // Handlebar Tape (Road/Gravel)
                    if (parts.Frame && ['Road', 'Gravel'].includes(parts.Frame.attributes.category)) {
                        extras.push('Handlebar Tape');
                    }

                    // Tubeless Setup
                    if (parts.Wheel?.attributes?.tubeless_ready && parts.Tire?.attributes?.tubeless_ready) {
                        extras.push('Tubeless Valves (x2)');
                        extras.push('Tire Sealant');
                    }

                    // Disc Rotors
                    if (parts.Frame?.interfaces?.brake_type === 'Disc' || parts.Wheel?.interfaces?.brake_type === 'Disc') {
                        extras.push('Disc Rotors (x2)');
                    }

                    // Shifting & Braking Consumables
                    if (parts.Shifter?.interfaces?.protocol) {
                        const proto = parts.Shifter.interfaces.protocol.toLowerCase();
                        if (proto.includes('wireless') || proto.includes('axs') || proto.includes('di2')) {
                            extras.push('Batteries / Charger');
                        } else if (proto.includes('hydraulic')) {
                            extras.push('Hydraulic Hoses & Fluid');
                        } else {
                            extras.push('Shift Cables & Housing');
                        }
                    }

                    if (extras.length === 0) return null;

                    return (
                        <div className="mt-4 bg-blue-500/5 rounded-lg p-3 border border-blue-500/10">
                            <h3 className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-2">Required Extras</h3>
                            <ul className="space-y-1.5">
                                {extras.map((item, idx) => (
                                    <li key={idx} className="text-xs text-gray-400 flex items-center">
                                        <span className="w-1 h-1 bg-blue-500 rounded-full mr-2"></span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    );
                })()}
            </div>

            <div className="p-4 border-t border-white/10 bg-gray-900/50 space-y-3">
                <button
                    onClick={async () => {
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
                    }}
                    className="w-full bg-white/5 hover:bg-white/10 text-white font-medium py-2.5 px-4 rounded-lg transition-all border border-white/10 flex items-center justify-center text-sm group"
                >
                    <Save className="w-4 h-4 mr-2 text-gray-400 group-hover:text-white transition-colors" />
                    Save to Garage
                </button>

                <button
                    onClick={() => {
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
                    }}
                    className="w-full bg-primary hover:bg-blue-600 text-white font-medium py-2.5 px-4 rounded-lg shadow-lg shadow-primary/20 transition-all flex items-center justify-center text-sm"
                >
                    <Download className="w-4 h-4 mr-2" />
                    Export Build
                </button>
            </div>
        </div>
    );
};

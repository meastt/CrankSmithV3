'use client';

import React, { useState } from 'react';
import { Component } from '@/lib/validation';
import { Save, Plus, AlertCircle, CheckCircle2 } from 'lucide-react';

const COMPONENT_TYPES = [
    'Frame', 'Wheel', 'Tire', 'BottomBracket', 'Crankset',
    'Cassette', 'RearDerailleur', 'Shifter', 'Chain', 'Brake'
];

const TEMPLATES: Record<string, { attributes: any, interfaces: any }> = {
    Frame: {
        attributes: {
            material: "Carbon",
            weight_g: 900,
            category: "Road",
            max_tire: 32,
            shop_url: "",
            affiliate_partner: ""
        },
        interfaces: {
            bottom_bracket: "BSA",
            rear_axle: "TA_12x142",
            brake_mount: "Flat Mount",
            seatpost: "27.2mm"
        }
    },
    Wheel: {
        attributes: {
            weight_g: 1400,
            internal_width: 21,
            external_width: 28,
            depth: 45,
            material: "Carbon"
        },
        interfaces: {
            diameter: 622,
            front_axle: "TA_12x100",
            rear_axle: "TA_12x142",
            brake_mount: "Centerlock",
            freehub: ["Shimano HG", "SRAM XDR"],
            tire_type: ["Clincher", "Tubeless"]
        }
    },
    Tire: {
        attributes: {
            weight_g: 280,
            width: 28,
            tpi: 120,
            compound: "BlackChili"
        },
        interfaces: {
            diameter: 622,
            type: "Tubeless"
        }
    },
    Crankset: {
        attributes: {
            weight_g: 600,
            teeth: "50/34",
            crank_length: 172.5,
            speeds: 12
        },
        interfaces: {
            spindle: "DUB",
            chainline: 45
        }
    },
    Cassette: {
        attributes: {
            weight_g: 250,
            speeds: 12,
            range: "11-34",
            cogs: [11, 12, 13, 14, 15, 17, 19, 21, 24, 27, 30, 34]
        },
        interfaces: {
            freehub_mount: "Shimano HG"
        }
    }
};

export default function AdminPage() {
    const [type, setType] = useState(COMPONENT_TYPES[0]);
    const [name, setName] = useState('');
    const [attributes, setAttributes] = useState(JSON.stringify(TEMPLATES.Frame.attributes, null, 2));
    const [interfaces, setInterfaces] = useState(JSON.stringify(TEMPLATES.Frame.interfaces, null, 2));
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const handleTypeChange = (newType: string) => {
        setType(newType);
        const template = TEMPLATES[newType] || { attributes: {}, interfaces: {} };
        setAttributes(JSON.stringify(template.attributes, null, 2));
        setInterfaces(JSON.stringify(template.interfaces, null, 2));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        try {
            // Validate JSON
            const parsedAttr = JSON.parse(attributes);
            const parsedInter = JSON.parse(interfaces);

            const res = await fetch('/api/components', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type,
                    name,
                    attributes: parsedAttr,
                    interfaces: parsedInter
                })
            });

            if (!res.ok) throw new Error(await res.text());

            setStatus({ type: 'success', message: 'Component created successfully!' });
            setName(''); // Clear name only, keep type/templates for rapid entry
        } catch (err: any) {
            setStatus({ type: 'error', message: err.message || 'Failed to create component' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-stone-950 pt-24 pb-12 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Component Manager</h1>
                    <p className="text-stone-400">Add new components to the database.</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-stone-900/50 border border-white/5 rounded-xl p-6 space-y-6">
                    {status && (
                        <div className={`p-4 rounded-lg flex items-center gap-3 ${status.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                            }`}>
                            {status.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                            {status.message}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-stone-300 mb-2">Component Type</label>
                            <select
                                value={type}
                                onChange={(e) => handleTypeChange(e.target.value)}
                                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-primary/50 outline-none"
                            >
                                {COMPONENT_TYPES.map(t => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-stone-300 mb-2">Component Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Specialized S-Works Aethos"
                                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-primary/50 outline-none"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-stone-300 mb-2">
                                Attributes (JSON)
                                <span className="text-xs text-stone-500 ml-2 font-normal">Specs, weight, etc.</span>
                            </label>
                            <textarea
                                value={attributes}
                                onChange={(e) => setAttributes(e.target.value)}
                                className="w-full h-64 bg-black/30 border border-white/10 rounded-lg p-4 text-sm font-mono text-stone-300 focus:ring-2 focus:ring-primary/50 outline-none"
                                spellCheck={false}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-stone-300 mb-2">
                                Interfaces (JSON)
                                <span className="text-xs text-stone-500 ml-2 font-normal">Compatibility standards</span>
                            </label>
                            <textarea
                                value={interfaces}
                                onChange={(e) => setInterfaces(e.target.value)}
                                className="w-full h-64 bg-black/30 border border-white/10 rounded-lg p-4 text-sm font-mono text-stone-300 focus:ring-2 focus:ring-primary/50 outline-none"
                                spellCheck={false}
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-white/5 flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
                        >
                            {loading ? (
                                <span className="animate-pulse">Saving...</span>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Save Component
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

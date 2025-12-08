'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Component } from '@/lib/types/compatibility';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const PART_TYPES = ['Frame', 'Wheel', 'Tire', 'BottomBracket', 'Crank', 'Shifter', 'Derailleur', 'Cassette'];

// Default schemas for attributes/interfaces could be defined here or imported
// For simplicity, we'll use a basic dynamic JSON editor approach for now, 
// or just text areas for the JSON fields to get started quickly, 
// then refine into structured inputs.
// Given the complexity, let's start with structured inputs for common fields and JSON text areas for the complex objects.

export default function ComponentForm({ initialData }: { initialData?: Component }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        type: initialData?.type || 'Frame',
        name: initialData?.name || '',
        interfaces: initialData ? JSON.stringify(initialData.interfaces, null, 2) : '{}',
        attributes: initialData ? JSON.stringify(initialData.attributes, null, 2) : '{\n  "price": 0,\n  "weight_g": 0\n}',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Validate JSON
            const interfaces = JSON.parse(formData.interfaces);
            const attributes = JSON.parse(formData.attributes);

            const payload = {
                type: formData.type,
                name: formData.name,
                interfaces,
                attributes,
            };

            const url = initialData ? `/api/components/${initialData.id}` : '/api/components';
            const method = initialData ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                router.push('/admin/components');
                router.refresh();
            } else {
                alert('Failed to save component');
            }
        } catch (error) {
            console.error(error);
            alert('Invalid JSON in interfaces or attributes');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-6">
                <Link href="/admin/components" className="text-gray-400 hover:text-white mr-4 transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-2xl font-bold">{initialData ? 'Edit Component' : 'New Component'}</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-gray-900 p-8 rounded-xl border border-white/10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-400 mb-2">Type</label>
                        <select
                            id="type"
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            {PART_TYPES.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                        <input
                            id="name"
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="attributes" className="block text-sm font-medium text-gray-400 mb-2">
                        Attributes (JSON)
                        <span className="text-xs text-gray-500 ml-2">Must include price and weight_g</span>
                    </label>
                    <textarea
                        id="attributes"
                        value={formData.attributes}
                        onChange={(e) => setFormData({ ...formData, attributes: e.target.value })}
                        className="w-full h-48 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="interfaces" className="block text-sm font-medium text-gray-400 mb-2">
                        Interfaces (JSON)
                        <span className="text-xs text-gray-500 ml-2">Defines compatibility points</span>
                    </label>
                    <textarea
                        id="interfaces"
                        value={formData.interfaces}
                        onChange={(e) => setFormData({ ...formData, interfaces: e.target.value })}
                        className="w-full h-48 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        required
                    />
                </div>

                <div className="flex justify-end pt-4 border-t border-white/10">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-lg font-medium flex items-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Save className="w-5 h-5 mr-2" />
                        {loading ? 'Saving...' : 'Save Component'}
                    </button>
                </div>
            </form>
        </div>
    );
}

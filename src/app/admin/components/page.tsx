'use client';

import React, { useEffect, useState } from 'react';
import { Component } from '@/lib/validation';
import { Plus, Trash2, Edit, Search } from 'lucide-react';
import Link from 'next/link';

export default function AdminComponentsPage() {
    const [components, setComponents] = useState<Component[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All');

    useEffect(() => {
        fetchComponents();
    }, []);

    const fetchComponents = async () => {
        try {
            const res = await fetch('/api/components');
            const data = await res.json();
            setComponents(data);
        } catch (error) {
            console.error('Failed to fetch components', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this component?')) return;

        try {
            const res = await fetch(`/api/components/${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                setComponents(components.filter(c => c.id !== id));
            } else {
                alert('Failed to delete component');
            }
        } catch (error) {
            console.error('Error deleting component', error);
        }
    };

    const filteredComponents = components.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'All' || c.type === filterType;
        return matchesSearch && matchesType;
    });

    const uniqueTypes = ['All', ...Array.from(new Set(components.map(c => c.type)))];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Components</h1>
                <Link
                    href="/admin/components/new"
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Component
                </Link>
            </div>

            {/* Filters */}
            <div className="flex space-x-4 bg-gray-900 p-4 rounded-xl border border-white/10">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search components..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                </div>
                <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                    {uniqueTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
            </div>

            {/* Table */}
            <div className="bg-gray-900 rounded-xl border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-800 text-gray-400 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 font-medium">Name</th>
                                <th className="px-6 py-4 font-medium">Type</th>
                                <th className="px-6 py-4 font-medium">Weight</th>
                                <th className="px-6 py-4 font-medium">Price</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">Loading...</td>
                                </tr>
                            ) : filteredComponents.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No components found</td>
                                </tr>
                            ) : (
                                filteredComponents.map(component => (
                                    <tr key={component.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 font-medium text-white">{component.name}</td>
                                        <td className="px-6 py-4 text-gray-400">
                                            <span className="bg-gray-800 px-2 py-1 rounded text-xs border border-gray-700">
                                                {component.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-300">{component.attributes.weight_g}g</td>
                                        <td className="px-6 py-4 text-gray-300">${component.attributes.price}</td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <Link
                                                href={`/admin/components/${component.id}`}
                                                className="inline-block p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(component.id)}
                                                className="inline-block p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

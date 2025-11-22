'use client';

import React, { useEffect, useState } from 'react';
import { useBuildStore } from '@/store/buildStore';
import { useRouter } from 'next/navigation';
import { Component } from '@/lib/validation';
import { Loader2, Bike, Calendar } from 'lucide-react';

interface SavedBuild {
    id: string;
    name: string;
    parts: Record<string, Component | null>;
    createdAt: string;
}

export const Garage: React.FC = () => {
    const [builds, setBuilds] = useState<SavedBuild[]>([]);
    const [loading, setLoading] = useState(true);
    const { setBuild } = useBuildStore();
    const router = useRouter();

    useEffect(() => {
        fetch('/api/builds')
            .then(res => {
                if (res.ok) return res.json();
                throw new Error('Failed to fetch');
            })
            .then(data => {
                setBuilds(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const loadBuild = (build: SavedBuild) => {
        setBuild(build.parts);
        router.push('/builder');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {builds.length === 0 ? (
                <div className="col-span-full text-center py-16 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                    <Bike className="w-16 h-16 mx-auto text-gray-600 mb-4" />
                    <h3 className="text-xl font-bold text-white">No saved builds yet</h3>
                    <p className="text-gray-400 mt-2 mb-8">Go to the Builder to create and save your first bike.</p>
                    <button
                        onClick={() => router.push('/builder')}
                        className="px-6 py-3 bg-primary hover:bg-blue-600 text-white font-semibold rounded-lg transition-all shadow-lg shadow-primary/20"
                    >
                        Go to Builder
                    </button>
                </div>
            ) : (
                builds.map(build => (
                    <div key={build.id} className="group bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl p-6 rounded-2xl border border-white/[0.08] hover:border-primary/30 hover:from-white/[0.1] hover:to-white/[0.05] hover:shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.05)] transition-all duration-300">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors tracking-tight">{build.name}</h3>
                                <div className="flex items-center text-xs text-gray-500 mt-1">
                                    <Calendar className="w-3 h-3 mr-1.5" />
                                    {new Date(build.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                            <div className="bg-white/5 p-2 rounded-lg">
                                <Bike className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                            </div>
                        </div>

                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-sm items-center">
                                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Frame</span>
                                <span className="text-gray-200 font-medium truncate max-w-[150px]">{build.parts.Frame?.name || 'None'}</span>
                            </div>
                            <div className="flex justify-between text-sm items-center">
                                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Groupset</span>
                                <span className="text-gray-200 font-medium truncate max-w-[150px]">
                                    {build.parts.Derailleur?.name || 'None'}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm items-center">
                                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Wheels</span>
                                <span className="text-gray-200 font-medium truncate max-w-[150px]">{build.parts.Wheel?.name || 'None'}</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-white/10">
                            <button
                                onClick={async (e) => {
                                    e.stopPropagation();
                                    if (!confirm('Are you sure you want to delete this build?')) return;

                                    try {
                                        const res = await fetch(`/api/builds?id=${build.id}`, {
                                            method: 'DELETE',
                                        });

                                        if (res.ok) {
                                            setBuilds(builds.filter(b => b.id !== build.id));
                                        } else {
                                            alert('Failed to delete build');
                                        }
                                    } catch (err) {
                                        console.error(err);
                                        alert('Error deleting build');
                                    }
                                }}
                                className="px-3 py-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 text-xs font-medium rounded-lg transition-colors"
                            >
                                Delete
                            </button>
                            <button
                                onClick={() => loadBuild(build)}
                                className="px-4 py-2 bg-white/10 hover:bg-primary text-white text-sm font-medium rounded-lg transition-all hover:shadow-lg hover:shadow-primary/20"
                            >
                                Load Build
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

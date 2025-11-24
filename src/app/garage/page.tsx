'use client';

import React, { useEffect, useState } from 'react';
import { useBuildStore } from '@/store/buildStore';
import { useRouter } from 'next/navigation';
import { Trash2, Edit3, Bike, ArrowRight } from 'lucide-react';
import { useUser } from '@clerk/nextjs';

interface SavedBuild {
    id: string;
    name: string;
    parts: string; // JSON string
    createdAt: string;
}

export default function GaragePage() {
    const [builds, setBuilds] = useState<SavedBuild[]>([]);
    const [loading, setLoading] = useState(true);
    const { setBuild } = useBuildStore();
    const router = useRouter();
    const { user, isLoaded } = useUser();

    useEffect(() => {
        if (isLoaded && user) {
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
        } else if (isLoaded && !user) {
            setLoading(false);
        }
    }, [isLoaded, user]);

    const loadBuild = (build: SavedBuild) => {
        try {
            const parts = JSON.parse(build.parts);
            setBuild(parts);
            router.push('/builder');
        } catch (e) {
            console.error("Failed to parse build parts", e);
        }
    };

    const deleteBuild = async (id: string) => {
        if (!confirm('Are you sure you want to delete this build?')) return;

        try {
            const res = await fetch(`/api/builds?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setBuilds(prev => prev.filter(b => b.id !== id));
            }
        } catch (e) {
            console.error(e);
        }
    };

    if (!isLoaded || loading) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4">
                <Bike className="w-16 h-16 text-gray-700 mb-4" />
                <h1 className="text-2xl font-bold text-white mb-2">Sign in to view your Garage</h1>
                <p className="text-gray-400 mb-6">Save your dream builds and access them anywhere.</p>
                {/* Clerk's SignInButton would be here, usually handled by layout/header */}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 p-6 md:p-12">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">My Garage</h1>
                        <p className="text-gray-400 mt-2">Manage your saved builds and projects.</p>
                    </div>
                    <button
                        onClick={() => router.push('/builder')}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors flex items-center"
                    >
                        New Build <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                </div>

                {builds.length === 0 ? (
                    <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/5 border-dashed">
                        <Bike className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">Your garage is empty</h3>
                        <p className="text-gray-400 mb-6">Start building your dream bike today.</p>
                        <button
                            onClick={() => router.push('/builder')}
                            className="text-blue-400 hover:text-blue-300 font-medium"
                        >
                            Go to Builder &rarr;
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {builds.map(build => (
                            <div key={build.id} className="group bg-gray-900 border border-white/10 rounded-xl overflow-hidden hover:border-blue-500/50 transition-all duration-300">
                                <div className="h-32 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative">
                                    <Bike className="w-12 h-12 text-gray-700 group-hover:text-blue-500/50 transition-colors" />
                                    <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div className="p-5">
                                    <h3 className="text-lg font-bold text-white mb-1">{build.name}</h3>
                                    <p className="text-xs text-gray-500 mb-4">Created {new Date(build.createdAt).toLocaleDateString()}</p>

                                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                        <button
                                            onClick={() => loadBuild(build)}
                                            className="text-sm font-medium text-blue-400 hover:text-blue-300 flex items-center"
                                        >
                                            <Edit3 className="w-3 h-3 mr-1.5" /> Load
                                        </button>
                                        <button
                                            onClick={() => deleteBuild(build.id)}
                                            className="text-sm font-medium text-gray-500 hover:text-red-400 flex items-center transition-colors"
                                        >
                                            <Trash2 className="w-3 h-3 mr-1.5" /> Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

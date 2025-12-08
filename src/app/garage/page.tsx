'use client';

import React, { useEffect, useState } from 'react';

export const dynamic = 'force-dynamic';
import { useBuildStore } from '@/store/buildStore';
import { useRouter } from 'next/navigation';
import { Trash2, Edit3, Bike, ArrowRight, Settings } from 'lucide-react';
import { useUser, SignInButton } from '@clerk/nextjs';
import templates from '@/data/templates.json';
import { Component } from '@/lib/types/compatibility';

interface SavedBuild {
    id: string;
    name: string;
    parts: string; // JSON string
    createdAt: string;
}

export default function GaragePage() {
    // Default to guest view initially to prevent blocking
    const { user, isLoaded } = useUser();
    const [builds, setBuilds] = useState<SavedBuild[]>([]);
    const [isLoadingBuilds, setIsLoadingBuilds] = useState(false);
    const router = useRouter();
    const { setBuild, loadTemplate } = useBuildStore();

    // Only fetch builds if we are definitely logged in
    useEffect(() => {
        if (isLoaded && user) {
            setIsLoadingBuilds(true);
            fetch('/api/builds')
                .then(res => {
                    if (res.ok) return res.json();
                    throw new Error('Failed to fetch');
                })
                .then(data => {
                    setBuilds(data);
                })
                .catch(err => {
                    console.error("Error fetching builds:", err);
                })
                .finally(() => {
                    setIsLoadingBuilds(false);
                });
        }
    }, [isLoaded, user]);

    // If Clerk is loading, we can show a subtle indicator or just the guest view
    // We do NOT block the entire UI on isLoaded anymore
    const showUserContent = isLoaded && !!user;

    const loadBuild = (build: SavedBuild) => {
        try {
            const parts = JSON.parse(build.parts);
            setBuild(parts as any);
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

    // Normalize templates just in case of import issues
    const templateList = Array.isArray(templates) ? templates : (templates as any).default || [];

    if (isLoadingBuilds) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => router.push('/settings')}
                            className="p-2 text-stone-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                            title="Settings"
                        >
                            <Settings className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => router.push('/builder')}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors flex items-center"
                        >
                            New Build <ArrowRight className="w-4 h-4 ml-2" />
                        </button>
                    </div>
                </div>

                {!showUserContent ? (
                    <div className="space-y-12">
                        <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/5 border-dashed">
                            <Bike className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-2">Guest Mode</h3>
                            <p className="text-gray-400 mb-6">Sign in to save your custom builds and access them anywhere.</p>
                            <SignInButton mode="modal">
                                <button className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors">
                                    Sign In to Garage
                                </button>
                            </SignInButton>
                        </div>

                        <div>
                            <h2 className="text-xl font-bold text-white mb-6">Starter Templates</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {templateList.map((template: any) => (
                                    <div key={template.id} className="group bg-gray-900 border border-white/10 rounded-xl overflow-hidden hover:border-blue-500/50 transition-all duration-300">
                                        <div className="h-32 bg-gradient-to-br from-blue-900/20 to-purple-900/20 flex items-center justify-center relative">
                                            <Bike className="w-12 h-12 text-blue-400/50 group-hover:text-blue-400 transition-colors" />
                                        </div>
                                        <div className="p-5">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-lg font-bold text-white">{template.name}</h3>
                                                <span className="px-2 py-1 rounded-full bg-white/10 text-xs text-gray-300">{template.category}</span>
                                            </div>
                                            <p className="text-sm text-gray-400 mb-4 line-clamp-2">{template.description}</p>
                                            <button
                                                onClick={() => {
                                                    // @ts-ignore - JSON import typing
                                                    const parts = template.parts;
                                                    loadTemplate(parts as any);
                                                    router.push('/builder');
                                                }}
                                                className="w-full py-2 bg-white/5 hover:bg-blue-600 hover:text-white text-blue-400 rounded-lg font-medium transition-colors flex items-center justify-center"
                                            >
                                                Use Template <ArrowRight className="w-4 h-4 ml-2" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : builds.length === 0 ? (
                    <div className="space-y-12">
                        <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/5 border-dashed">
                            <Bike className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-2">Your garage is empty</h3>
                            <p className="text-gray-400 mb-6">Start from scratch or choose a template below.</p>
                            <button
                                onClick={() => router.push('/builder')}
                                className="text-blue-400 hover:text-blue-300 font-medium"
                            >
                                Start Empty Build &rarr;
                            </button>
                        </div>

                        <div>
                            <h2 className="text-xl font-bold text-white mb-6">Starter Templates</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {templateList.map((template: any) => (
                                    <div key={template.id} className="group bg-gray-900 border border-white/10 rounded-xl overflow-hidden hover:border-blue-500/50 transition-all duration-300">
                                        <div className="h-32 bg-gradient-to-br from-blue-900/20 to-purple-900/20 flex items-center justify-center relative">
                                            <Bike className="w-12 h-12 text-blue-400/50 group-hover:text-blue-400 transition-colors" />
                                        </div>
                                        <div className="p-5">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-lg font-bold text-white">{template.name}</h3>
                                                <span className="px-2 py-1 rounded-full bg-white/10 text-xs text-gray-300">{template.category}</span>
                                            </div>
                                            <p className="text-sm text-gray-400 mb-4 line-clamp-2">{template.description}</p>
                                            <button
                                                onClick={() => {
                                                    // @ts-ignore - JSON import typing
                                                    const parts = template.parts as Record<string, Component>;
                                                    loadTemplate(parts);
                                                    router.push('/builder');
                                                }}
                                                className="w-full py-2 bg-white/5 hover:bg-blue-600 hover:text-white text-blue-400 rounded-lg font-medium transition-colors flex items-center justify-center"
                                            >
                                                Use Template <ArrowRight className="w-4 h-4 ml-2" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-12">
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

                        <div className="pt-8 border-t border-white/10">
                            <h2 className="text-xl font-bold text-white mb-6">Start New from Template</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {templateList.map((template: any) => (
                                    <div key={template.id} className="group bg-gray-900 border border-white/10 rounded-xl overflow-hidden hover:border-blue-500/50 transition-all duration-300">
                                        <div className="p-5">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-lg font-bold text-white">{template.name}</h3>
                                                <span className="px-2 py-1 rounded-full bg-white/10 text-xs text-gray-300">{template.category}</span>
                                            </div>
                                            <p className="text-sm text-gray-400 mb-4 line-clamp-2">{template.description}</p>
                                            <button
                                                onClick={() => {
                                                    // @ts-ignore - JSON import typing
                                                    const parts = template.parts;
                                                    loadTemplate(parts as any);
                                                    router.push('/builder');
                                                }}
                                                className="w-full py-2 bg-white/5 hover:bg-blue-600 hover:text-white text-blue-400 rounded-lg font-medium transition-colors flex items-center justify-center"
                                            >
                                                Use Template <ArrowRight className="w-4 h-4 ml-2" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

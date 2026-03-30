'use client';

import React, { useEffect, useState, useCallback } from 'react';

export const dynamic = 'force-dynamic';
import { useBuildStore } from '@/store/buildStore';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Trash2, Edit3, Bike, ArrowRight, Settings, WifiOff, Loader2 } from 'lucide-react';
import { useUser, SignInButton } from '@clerk/nextjs';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import templates from '@/data/templates.json';
import { Component } from '@/lib/types/compatibility';
import { LoadingState } from '@/components/ui/StateDisplays';
import { validateBuilderPartsPayload } from '@/lib/builderGuard';

interface SavedBuild {
    id: string;
    name: string;
    parts: string; // JSON string
    createdAt: string;
    builderStatus?: 'gravel_compatible' | 'legacy_non_gravel' | 'invalid_payload';
    builderViolations?: string[];
}

export default function GaragePage() {
    // Default to guest view initially to prevent blocking
    const { user, isLoaded } = useUser();
    const [builds, setBuilds] = useState<SavedBuild[] | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
    const [loadWarning, setLoadWarning] = useState<string | null>(null);
    const [fetchError, setFetchError] = useState(false);
    const router = useRouter();
    const { setBuild, loadTemplate } = useBuildStore();
    const isOnline = useOnlineStatus();

    const fetchBuilds = useCallback(async () => {
        if (!user) return;
        const res = await fetch('/api/builds');
        if (res.ok) {
            const data = await res.json();
            setBuilds(data);
            setFetchError(false);
        }
    }, [user]);

    const { isRefreshing, pullDistance, threshold } = usePullToRefresh({
        onRefresh: fetchBuilds,
    });

    // Only fetch builds if we are definitely logged in
    // Re-fetch when coming back online after a fetch error
    useEffect(() => {
        if (isLoaded && user) {
            if (!isOnline) {
                if (builds === null) setBuilds([]);
                setFetchError(true);
                return;
            }
            fetch('/api/builds')
                .then(res => {
                    if (res.ok) return res.json();
                    throw new Error('Failed to fetch');
                })
                .then(data => {
                    setBuilds(data);
                    setFetchError(false);
                })
                .catch(err => {
                    console.error("Error fetching builds:", err);
                    setFetchError(true);
                    if (builds === null) setBuilds([]);
                });
        } else if (isLoaded && !user) {
            setBuilds([]);
        }
    }, [isLoaded, user, isOnline]);

    // If Clerk is loading, we can show a subtle indicator or just the guest view
    // We do NOT block the entire UI on isLoaded anymore
    const showUserContent = isLoaded && !!user;

    const loadBuild = (build: SavedBuild) => {
        try {
            const parts = JSON.parse(build.parts);
            const violations = build.builderViolations ?? validateBuilderPartsPayload(parts).violations;
            if (violations.length > 0) {
                setLoadWarning(`"${build.name}" is a legacy non-gravel build and cannot be loaded into the gravel-only builder yet.`);
                return;
            }
            setBuild(parts as any);
            router.push('/builder');
        } catch (e) {
            console.error("Failed to parse build parts", e);
        }
    };

    const deleteBuild = async (id: string) => {
        try {
            const res = await fetch(`/api/builds?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setBuilds(prev => (prev ?? []).filter(b => b.id !== id));
            }
        } catch (e) {
            console.error(e);
        }
        setDeleteTarget(null);
    };

    // Normalize templates just in case of import issues
    const templateList = Array.isArray(templates) ? templates : (templates as any).default || [];

    const isLoadingBuilds = isLoaded && !!user && builds === null;

    if (isLoadingBuilds) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <LoadingState message="Loading your builds..." />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 p-4 pt-safe pb-safe md:p-12">
            {/* Pull-to-refresh indicator */}
            {(pullDistance > 0 || isRefreshing) && (
                <div
                    className="flex justify-center items-center overflow-hidden transition-all"
                    style={{ height: isRefreshing ? 48 : pullDistance }}
                >
                    <Loader2
                        className={`w-6 h-6 text-blue-400 ${isRefreshing ? 'animate-spin' : ''}`}
                        style={{
                            opacity: Math.min(pullDistance / threshold, 1),
                            transform: `rotate(${(pullDistance / threshold) * 360}deg)`,
                        }}
                    />
                </div>
            )}
            <ConfirmDialog
                isOpen={deleteTarget !== null}
                title="Delete Build"
                message="Are you sure you want to delete this build? This action cannot be undone."
                confirmLabel="Delete"
                variant="danger"
                onConfirm={() => deleteTarget && deleteBuild(deleteTarget)}
                onCancel={() => setDeleteTarget(null)}
            />
            <div className="max-w-6xl mx-auto">
                {(!isOnline || fetchError) && (
                    <div className="mb-6 flex items-center gap-3 px-4 py-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
                        <WifiOff className="w-5 h-5 flex-shrink-0" />
                        <p className="text-sm">
                            {!isOnline
                                ? "You're offline. Your saved builds will load when you reconnect."
                                : "Couldn't load your builds. They'll refresh automatically when the connection is restored."}
                        </p>
                    </div>
                )}
                {loadWarning && (
                    <div className="mb-6 flex items-center gap-3 px-4 py-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-300">
                        <Edit3 className="w-5 h-5 flex-shrink-0" />
                        <p className="text-sm">{loadWarning}</p>
                    </div>
                )}
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

                        <TemplateGrid templateList={templateList} loadTemplate={loadTemplate} router={router} />
                    </div>
                ) : (builds ?? []).length === 0 ? (
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

                        <TemplateGrid templateList={templateList} loadTemplate={loadTemplate} router={router} />
                    </div>
                ) : (
                    <div className="space-y-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {(builds ?? []).map(build => (
                                (() => {
                                    let violations: string[] = build.builderViolations ?? [];
                                    try {
                                        if (violations.length === 0 && !build.builderStatus) {
                                            const parsed = JSON.parse(build.parts);
                                            violations = validateBuilderPartsPayload(parsed).violations;
                                        }
                                    } catch {
                                        violations = ['Invalid build payload'];
                                    }
                                    const isLegacyBuild = violations.length > 0;
                                    return (
                                <div key={build.id} className="group bg-gray-900 border border-white/10 rounded-xl overflow-hidden hover:border-blue-500/50 transition-all duration-300">
                                    <div className="h-32 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative">
                                        <Bike className="w-12 h-12 text-gray-700 group-hover:text-blue-500/50 transition-colors" />
                                        <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <div className="p-5">
                                        <h3 className="text-lg font-bold text-white mb-1">{build.name}</h3>
                                        <p className="text-xs text-gray-500 mb-4">Created {new Date(build.createdAt).toLocaleDateString()}</p>
                                        {isLegacyBuild && (
                                            <p className="text-xs text-amber-300 mb-3">
                                                Legacy non-gravel build (read-only in gravel builder)
                                            </p>
                                        )}

                                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                            <button
                                                onClick={() => loadBuild(build)}
                                                disabled={isLegacyBuild}
                                                className="text-sm font-medium text-blue-400 hover:text-blue-300 flex items-center disabled:text-stone-600 disabled:cursor-not-allowed"
                                            >
                                                <Edit3 className="w-3 h-3 mr-1.5" /> {isLegacyBuild ? 'Legacy Build' : 'Load'}
                                            </button>
                                            <button
                                                onClick={() => setDeleteTarget(build.id)}
                                                disabled={!isOnline}
                                                className="text-sm font-medium text-gray-500 hover:text-red-400 flex items-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-gray-500"
                                            >
                                                <Trash2 className="w-3 h-3 mr-1.5" /> Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                    );
                                })()
                            ))}
                        </div>

                        <div className="pt-8 border-t border-white/10">
                            <TemplateGrid title="Start New from Template" templateList={templateList} loadTemplate={loadTemplate} router={router} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function TemplateGrid({ title = 'Starter Templates', templateList, loadTemplate, router }: {
    title?: string;
    templateList: any[];
    loadTemplate: (parts: any) => void;
    router: ReturnType<typeof useRouter>;
}) {
    return (
        <div>
            <h2 className="text-xl font-bold text-white mb-6">{title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {templateList.map((template: any) => (
                    <div key={template.id} className="group bg-gray-900 border border-white/10 rounded-xl overflow-hidden hover:border-blue-500/50 transition-all duration-300">
                        <div className="h-40 relative overflow-hidden">
                            {template.image ? (
                                <Image
                                    src={template.image}
                                    alt={template.name}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-blue-900/20 to-purple-900/20 flex items-center justify-center">
                                    <Bike className="w-12 h-12 text-blue-400/50" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
                        </div>
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-bold text-white">{template.name}</h3>
                                <span className="px-2 py-1 rounded-full bg-white/10 text-xs text-gray-300">{template.category}</span>
                            </div>
                            <p className="text-sm text-gray-400 mb-4 line-clamp-2">{template.description}</p>
                            <button
                                onClick={() => {
                                    loadTemplate(template.parts as any);
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
    );
}

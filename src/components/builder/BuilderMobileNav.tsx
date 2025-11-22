'use client';

import React, { useState } from 'react';
import { useBuildStore } from '@/store/buildStore';
import { BuildSummary } from './BuildSummary';
import { PerformancePanel } from './PerformancePanel';
import { Layers, Activity, Save, X } from 'lucide-react';

export const BuilderMobileNav: React.FC = () => {
    const { parts } = useBuildStore();
    const [activeModal, setActiveModal] = useState<'summary' | 'performance' | null>(null);

    const totalWeight = Object.values(parts).reduce((sum, part) => sum + (part?.attributes?.weight_g || 0), 0);

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

    return (
        <>
            {/* Sticky Footer */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-xl border-t border-white/10 p-4 pb-safe">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Total Weight</p>
                        <p className="text-xl font-bold text-white font-mono">{totalWeight}g</p>
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setActiveModal('summary')}
                            className={`p-2 rounded-lg transition-colors ${activeModal === 'summary' ? 'bg-primary text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}
                            title="View Build"
                        >
                            <Layers className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setActiveModal('performance')}
                            className={`p-2 rounded-lg transition-colors ${activeModal === 'performance' ? 'bg-primary text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}
                            title="Performance Stats"
                        >
                            <Activity className="w-5 h-5" />
                        </button>
                        <button
                            onClick={handleSave}
                            className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg shadow-primary/20 flex items-center"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            Save
                        </button>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {activeModal && (
                <div className="lg:hidden fixed inset-0 z-[60] bg-gray-950/95 backdrop-blur-md flex flex-col animate-in slide-in-from-bottom-full duration-300">
                    <div className="flex justify-between items-center p-4 border-b border-white/10 bg-gray-900">
                        <h2 className="text-lg font-bold text-white">
                            {activeModal === 'summary' ? 'Build Summary' : 'Performance Analysis'}
                        </h2>
                        <button
                            onClick={() => setActiveModal(null)}
                            className="p-2 text-gray-400 hover:text-white bg-white/5 rounded-full"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {activeModal === 'summary' ? (
                            // We render BuildSummary but we need to ensure it fits nicely.
                            // Since BuildSummary has its own container styles (w-80, h-screen), we might need to override them
                            // or wrap it in a way that forces it to behave.
                            // Actually, BuildSummary is designed as a sidebar. 
                            // We might need to adjust BuildSummary to accept a 'mobile' prop or just rely on CSS overrides.
                            // For now, let's try rendering it and see if we can strip the width constraint via a wrapper or if we need to refactor BuildSummary.
                            <div className="h-full [&>div]:w-full [&>div]:h-full [&>div]:shadow-none [&>div]:border-none">
                                <BuildSummary />
                            </div>
                        ) : (
                            <div className="p-4">
                                <PerformancePanel />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

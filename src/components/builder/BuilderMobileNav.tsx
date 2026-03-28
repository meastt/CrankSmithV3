'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBuildStore } from '@/store/buildStore';
import { BuildSummary } from './BuildSummary';
import { PerformancePanel } from './PerformancePanel';
import { Layers, Activity, Save, X, Scale } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { InputDialog } from '@/components/ui/InputDialog';
import { useToast } from '@/components/ui/Toast';
import { haptic } from '@/lib/haptics';

export const BuilderMobileNav: React.FC = () => {
    const { parts } = useBuildStore();
    const router = useRouter();
    const [activeModal, setActiveModal] = useState<'summary' | 'performance' | null>(null);
    const [showNameDialog, setShowNameDialog] = useState(false);
    const { toast } = useToast();

    const totalWeight = Object.values(parts).reduce((sum, part) => sum + ((part as any)?.attributes?.weight_g || 0), 0);
    const partsCount = Object.values(parts).filter(Boolean).length;

    const handleSave = () => {
        setShowNameDialog(true);
    };

    const handleSaveConfirm = async (name: string) => {
        setShowNameDialog(false);

        try {
            const res = await fetch('/api/builds', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, parts }),
            });

            if (res.ok) {
                haptic('success');
                toast({ type: 'success', title: 'Build Saved', message: 'Your build has been saved to the Garage.' });
            } else {
                haptic('error');
                if (res.status === 401) {
                    toast({ type: 'error', title: 'Sign In Required', message: 'Please sign in to save builds.' });
                    setTimeout(() => { router.push('/sign-in'); }, 1500);
                } else {
                    toast({ type: 'error', title: 'Save Failed', message: 'Failed to save build. Please try again.' });
                }
            }
        } catch (err) {
            console.error(err);
            haptic('error');
            toast({ type: 'error', title: 'Error', message: 'An error occurred. Check your connection.' });
        }
    };

    return (
        <>
            {/* Build Name Dialog */}
            <InputDialog
                isOpen={showNameDialog}
                title="Name Your Build"
                message="Give your build a name so you can find it later in the Garage."
                placeholder="e.g. Sunday Race Rig"
                confirmLabel="Save Build"
                onConfirm={handleSaveConfirm}
                onCancel={() => setShowNameDialog(false)}
            />

            {/* Bottom Navigation Bar - Mobile Only */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-stone-950/95 backdrop-blur-xl border-t border-white/5 pb-safe">
                <div className="flex items-center justify-between px-4 py-3">
                    {/* Weight Display */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                            <Scale className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                                {partsCount} parts
                            </p>
                            <p className="text-lg font-bold text-stone-100 font-mono leading-tight">
                                {totalWeight.toLocaleString()}g
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setActiveModal('summary')}
                            className={`p-3 rounded-xl transition-all ${
                                activeModal === 'summary'
                                    ? 'bg-primary text-white'
                                    : 'bg-white/5 text-stone-400 hover:bg-white/10'
                            }`}
                            aria-label="View Build"
                        >
                            <Layers className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setActiveModal('performance')}
                            className={`p-3 rounded-xl transition-all ${
                                activeModal === 'performance'
                                    ? 'bg-primary text-white'
                                    : 'bg-white/5 text-stone-400 hover:bg-white/10'
                            }`}
                            aria-label="Performance Stats"
                        >
                            <Activity className="w-5 h-5" />
                        </button>
                        <button
                            onClick={handleSave}
                            className="btn-primary px-4 py-3 rounded-xl text-white font-medium text-sm flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            Save
                        </button>
                    </div>
                </div>
            </div>

            {/* Full-screen Modals */}
            <AnimatePresence>
                {activeModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="lg:hidden fixed inset-0 z-[60]"
                    >
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-stone-950/95 backdrop-blur-xl"
                            onClick={() => setActiveModal(null)}
                        />

                        {/* Modal Content */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.3 }}
                            className="relative h-full flex flex-col"
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between px-4 py-4 border-b border-white/5 bg-stone-950">
                                <h2 className="text-lg font-semibold text-stone-100">
                                    {activeModal === 'summary' ? 'Build Summary' : 'Performance'}
                                </h2>
                                <button
                                    onClick={() => setActiveModal(null)}
                                    className="p-2 text-stone-400 hover:text-stone-100 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="flex-1 overflow-y-auto pb-20">
                                {activeModal === 'summary' ? (
                                    <BuildSummary />
                                ) : (
                                    <PerformancePanel />
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

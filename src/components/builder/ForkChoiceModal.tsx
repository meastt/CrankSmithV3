'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight, Info, Scale } from 'lucide-react';

interface ForkChoiceModalProps {
    isOpen: boolean;
    frameName: string;
    factoryForkName: string | null;
    factoryForkWeight: number | null;
    onKeepFactory: () => void;
    onChooseDifferent: () => void;
}

export const ForkChoiceModal: React.FC<ForkChoiceModalProps> = ({
    isOpen,
    frameName,
    factoryForkName,
    factoryForkWeight,
    onKeepFactory,
    onChooseDifferent
}) => {
    if (!isOpen) return null;

    const forkDisplayName = factoryForkName || 'Factory Fork';
    const hasWeightInfo = factoryForkWeight && factoryForkWeight > 0;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="bg-stone-900 border border-white/10 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/10">
                            <h2 className="text-xl font-semibold text-stone-100 mb-2">
                                Frameset Includes Fork
                            </h2>
                            <p className="text-stone-400 text-sm">
                                The <span className="text-stone-200 font-medium">{frameName}</span> frameset comes with an included fork. Would you like to keep it or choose a different one?
                            </p>
                        </div>

                        {/* Info Box */}
                        <div className="px-6 py-4 bg-blue-500/5 border-b border-white/5">
                            <div className="flex items-start gap-3">
                                <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                                <div className="text-sm">
                                    <p className="text-blue-300 font-medium mb-1">Why does this matter?</p>
                                    <p className="text-stone-400">
                                        The frameset weight already includes the factory fork. If you choose a different fork,
                                        we'll calculate the weight difference so your build total stays accurate.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Factory Fork Info */}
                        {(factoryForkName || hasWeightInfo) && (
                            <div className="px-6 py-4 border-b border-white/5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-stone-500 uppercase tracking-wider mb-1">Included Fork</p>
                                        <p className="text-stone-200 font-medium">{forkDisplayName}</p>
                                    </div>
                                    {hasWeightInfo && (
                                        <div className="flex items-center gap-2 text-stone-400">
                                            <Scale className="w-4 h-4" />
                                            <span className="font-mono">{factoryForkWeight}g</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Options */}
                        <div className="p-6 space-y-3">
                            {/* Keep Factory Fork */}
                            <button
                                onClick={onKeepFactory}
                                className="w-full p-4 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all group text-left"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                                            <Check className="w-5 h-5 text-emerald-400" />
                                        </div>
                                        <div>
                                            <p className="text-stone-100 font-medium">Keep Factory Fork</p>
                                            <p className="text-stone-500 text-sm">Weight stays the same, skip to wheels</p>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-stone-600 group-hover:text-emerald-400 transition-colors" />
                                </div>
                            </button>

                            {/* Choose Different Fork */}
                            <button
                                onClick={onChooseDifferent}
                                className="w-full p-4 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-primary/10 hover:border-primary/30 transition-all group text-left"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                            <ArrowRight className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-stone-100 font-medium">Choose Different Fork</p>
                                            <p className="text-stone-500 text-sm">
                                                {hasWeightInfo
                                                    ? `Factory fork weight (${factoryForkWeight}g) will be deducted`
                                                    : 'Browse aftermarket forks'}
                                            </p>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-stone-600 group-hover:text-primary transition-colors" />
                                </div>
                            </button>
                        </div>

                        {/* Footer Note */}
                        <div className="px-6 pb-6">
                            <p className="text-xs text-stone-600 text-center">
                                You can change this later by going back to the fork step
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

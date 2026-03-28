'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { haptic } from '@/lib/haptics';

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'danger' | 'default';
    onConfirm: () => void;
    onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen,
    title,
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    variant = 'default',
    onConfirm,
    onCancel,
}) => {
    const handleConfirm = () => {
        haptic(variant === 'danger' ? 'warning' : 'success');
        onConfirm();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) onCancel();
                    }}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="bg-stone-900 border border-white/10 rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl"
                    >
                        <div className="p-5">
                            {variant === 'danger' && (
                                <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                                    <AlertTriangle className="w-5 h-5 text-red-400" />
                                </div>
                            )}
                            <h2 className="text-lg font-semibold text-stone-100 mb-2">{title}</h2>
                            <p className="text-stone-400 text-sm leading-relaxed">{message}</p>
                        </div>

                        <div className="flex items-center justify-end gap-3 px-5 pb-5">
                            <button
                                onClick={onCancel}
                                className="btn-ghost px-4 py-2.5 rounded-xl text-stone-400 text-sm font-medium"
                            >
                                {cancelLabel}
                            </button>
                            <button
                                onClick={handleConfirm}
                                className={`px-5 py-2.5 rounded-xl text-white text-sm font-medium transition-all ${
                                    variant === 'danger'
                                        ? 'bg-red-600 hover:bg-red-500 shadow-lg shadow-red-500/20'
                                        : 'btn-primary'
                                }`}
                            >
                                {confirmLabel}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

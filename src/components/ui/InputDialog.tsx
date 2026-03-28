'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { haptic } from '@/lib/haptics';

interface InputDialogProps {
    isOpen: boolean;
    title: string;
    message?: string;
    defaultValue?: string;
    placeholder?: string;
    confirmLabel?: string;
    onConfirm: (value: string) => void;
    onCancel: () => void;
}

export const InputDialog: React.FC<InputDialogProps> = ({
    isOpen,
    title,
    message,
    defaultValue = '',
    placeholder,
    confirmLabel = 'Save',
    onConfirm,
    onCancel,
}) => {
    const [value, setValue] = useState(defaultValue);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setValue(defaultValue);
            haptic('light');
            // Delay focus slightly for animation to start
            const timer = setTimeout(() => inputRef.current?.focus(), 100);
            return () => clearTimeout(timer);
        }
    }, [isOpen, defaultValue]);

    const handleConfirm = () => {
        if (!value.trim()) return;
        haptic('success');
        onConfirm(value.trim());
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleConfirm();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            onCancel();
        }
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
                        className="bg-stone-900 border border-white/10 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-5 pb-3">
                            <h2 className="text-lg font-semibold text-stone-100">{title}</h2>
                            <button
                                onClick={onCancel}
                                className="p-1.5 text-stone-500 hover:text-white transition-colors rounded-lg hover:bg-white/10"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="px-5 pb-5">
                            {message && (
                                <p className="text-stone-400 text-sm mb-4">{message}</p>
                            )}
                            <input
                                ref={inputRef}
                                type="text"
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder={placeholder}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-stone-100 placeholder-stone-600 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-3 px-5 pb-5">
                            <button
                                onClick={onCancel}
                                className="btn-ghost px-4 py-2.5 rounded-xl text-stone-400 text-sm font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirm}
                                disabled={!value.trim()}
                                className="btn-primary px-5 py-2.5 rounded-xl text-white text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
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

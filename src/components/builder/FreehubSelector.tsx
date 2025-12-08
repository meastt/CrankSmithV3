
'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, HelpCircle } from 'lucide-react';
import Image from 'next/image';

interface FreehubSelectorProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (standard: string) => void;
    availableStandards?: string[]; // Optional: if we want to restrict based on wheel capability
}

export const FreehubSelector: React.FC<FreehubSelectorProps> = ({
    isOpen,
    onClose,
    onSelect,
    availableStandards
}) => {
    // Definitive list of standards with descriptions and cassette implications
    const standards = [
        {
            id: 'HG',
            label: 'Shimano HG (HyperGlide)',
            desc: 'Universal 8-12 speed. The most common standard.',
            cassettes: 'Shimano road (105, Ultegra, Dura-Ace), gravel (GRX), and MTB (Deore, SLX, XT, XTR 11s)',
            color: 'blue'
        },
        {
            id: 'XDR',
            label: 'SRAM XDR',
            desc: 'Road/Gravel 12-speed. Enables 10t smallest cog.',
            cassettes: 'SRAM AXS road & gravel (Red, Force, Rival, Apex)',
            color: 'red'
        },
        {
            id: 'XD',
            label: 'SRAM XD',
            desc: 'MTB 11/12-speed. Popular for gravel "mullet" builds with wide-range cassettes.',
            cassettes: 'SRAM Eagle MTB (10-50t, 10-52t) — great for drop-bar bikes wanting massive range',
            color: 'orange'
        },
        {
            id: 'MICROSPLINE',
            label: 'Shimano MicroSpline',
            desc: 'Shimano 12-speed MTB. Also used in gravel mullet builds.',
            cassettes: 'Shimano 12s MTB (Deore, SLX, XT, XTR) — 10-51t wide range options',
            color: 'green'
        },
        {
            id: 'N3W',
            label: 'Campagnolo N3W',
            desc: 'Campagnolo 12/13-speed. Required for all modern Campy groupsets.',
            cassettes: 'Campagnolo road (Super Record, Record, Chorus, Potenza) and gravel (Ekar)',
            color: 'purple'
        }
    ];

    // Show all standards regardless of wheel specs, as requested for safety/completeness
    const visibleStandards = standards;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    {/* Backdrop click to close */}
                    <div className="absolute inset-0" onClick={onClose} />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-2xl bg-stone-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/5 flex items-start justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-white mb-1">Select Freehub Body</h2>
                                <p className="text-stone-400 text-sm">
                                    Your wheels support multiple cassette types. <span className="text-amber-400">This choice determines which cassettes you'll see later.</span>
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors -mr-2 -mt-2"
                            >
                                <X className="w-5 h-5 text-stone-400" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Diagram Column */}
                            <div className="md:border-r border-white/5 md:pr-6">
                                <div className="aspect-[4/3] bg-black/20 rounded-xl overflow-hidden mb-3 relative">
                                    <Image
                                        src="/images/freehub-guide.webp"
                                        alt="Freehub Standards Guide"
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                                <div className="flex items-start gap-2 text-xs text-stone-500 bg-white/5 p-3 rounded-lg">
                                    <HelpCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                    <p>
                                        The freehub body is the splined interface on your rear wheel where the cassette slides on.
                                        It must match your cassette choice.
                                    </p>
                                </div>
                            </div>

                            {/* Selection Column */}
                            <div className="space-y-3 flex flex-col justify-center">
                                {visibleStandards.map(std => (
                                    <button
                                        key={std.id}
                                        onClick={() => onSelect(std.id)}
                                        className="w-full text-left p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-primary/50 transition-all group"
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="font-semibold text-white group-hover:text-primary transition-colors">
                                                {std.label}
                                            </span>
                                            <Check className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <p className="text-xs text-stone-400 leading-relaxed mb-2">
                                            {std.desc}
                                        </p>
                                        <p className="text-[10px] text-emerald-400/80 bg-emerald-500/10 px-2 py-1 rounded inline-block">
                                            → {std.cassettes}
                                        </p>
                                    </button>
                                ))}

                                <button
                                    onClick={() => onSelect('UNKNOWN')}
                                    className="w-full text-center text-xs text-stone-500 hover:text-stone-300 py-2 mt-2"
                                >
                                    I don't know / Skip for now (show all cassettes)
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

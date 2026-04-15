'use client';

import React from 'react';
import { Check, HelpCircle, AlertCircle } from 'lucide-react';
import Image from 'next/image';

interface FreehubBodyStepProps {
    wheelFreehubHint: string | null;
    currentSelection: string | null;
    onSelect: (standard: string) => void;
    onSkip: () => void;
}

const STANDARDS = [
    {
        id: 'HG',
        label: 'Shimano HG (HyperGlide)',
        desc: 'Universal 8-12 speed. The most common standard.',
        cassettes: 'Shimano road (105, Ultegra, Dura-Ace), gravel (GRX), and MTB (Deore, SLX, XT, XTR 11s)',
    },
    {
        id: 'XDR',
        label: 'SRAM XDR',
        desc: 'Road/Gravel 12-speed. Enables 10t smallest cog.',
        cassettes: 'SRAM AXS road & gravel (Red, Force, Rival, Apex)',
    },
    {
        id: 'XD',
        label: 'SRAM XD',
        desc: 'MTB 11/12-speed. Popular for gravel "mullet" builds with wide-range cassettes.',
        cassettes: 'SRAM Eagle MTB (10-50t, 10-52t) — great for drop-bar bikes wanting massive range',
    },
    {
        id: 'MICROSPLINE',
        label: 'Shimano MicroSpline',
        desc: 'Shimano 12-speed MTB. Also used in gravel mullet builds.',
        cassettes: 'Shimano 12s MTB (Deore, SLX, XT, XTR) — 10-51t wide range options',
    },
    {
        id: 'N3W',
        label: 'Campagnolo N3W',
        desc: 'Campagnolo 12/13-speed. Required for all modern Campy groupsets.',
        cassettes: 'Campagnolo road (Super Record, Record, Chorus, Potenza) and gravel (Ekar)',
    },
];

const FREEHUB_LABELS: Record<string, string> = {
    HG: 'Shimano HG',
    HG11: 'Shimano HG',
    XDR: 'SRAM XDR',
    XD: 'SRAM XD',
    MICROSPLINE: 'Shimano MicroSpline',
    N3W: 'Campagnolo N3W',
};

export const FreehubBodyStep: React.FC<FreehubBodyStepProps> = ({
    wheelFreehubHint,
    currentSelection,
    onSelect,
    onSkip,
}) => {
    const hintNormalized = wheelFreehubHint?.toUpperCase().trim() ?? null;
    const hintLabel = hintNormalized ? (FREEHUB_LABELS[hintNormalized] ?? hintNormalized) : null;

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="mb-2">
                <h2 className="text-xl font-bold text-white mb-1">Choose Your Freehub Body</h2>
                <p className="text-stone-400 text-sm">
                    Choose the freehub body you&apos;ll actually install. Most quality wheels (ENVE, DT Swiss, Zipp, Hunt) support swappable bodies — your choice here is independent of what the wheel ships with.
                </p>
            </div>

            {/* Hint Banner */}
            {hintLabel && (
                <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-200 leading-relaxed">
                        Your selected wheel ships with a <strong>{hintLabel}</strong> body by default. You can run any standard below — selecting a different one means purchasing a swap body separately ($40–120).
                    </p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Diagram */}
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
                            The freehub body is the splined interface on your rear wheel where the cassette slides on. It must match your cassette.
                        </p>
                    </div>
                </div>

                {/* Standards */}
                <div className="space-y-3 flex flex-col justify-center">
                    {STANDARDS.map(std => {
                        const isSelected = currentSelection === std.id;
                        const isHint = hintNormalized === std.id;
                        return (
                            <button
                                key={std.id}
                                onClick={() => onSelect(std.id)}
                                className={`w-full text-left p-4 rounded-xl border transition-all group ${
                                    isSelected
                                        ? 'border-primary/70 bg-primary/10'
                                        : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-primary/50'
                                }`}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span className={`font-semibold transition-colors ${isSelected ? 'text-primary' : 'text-white group-hover:text-primary'}`}>
                                        {std.label}
                                        {isHint && (
                                            <span className="ml-2 text-[10px] font-normal text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                                                ships with wheel
                                            </span>
                                        )}
                                    </span>
                                    <Check className={`w-4 h-4 text-primary transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                                </div>
                                <p className="text-xs text-stone-400 leading-relaxed mb-2">{std.desc}</p>
                                <p className="text-[10px] text-emerald-400/80 bg-emerald-500/10 px-2 py-1 rounded inline-block">
                                    → {std.cassettes}
                                </p>
                            </button>
                        );
                    })}

                    <button
                        onClick={onSkip}
                        className="w-full text-center text-xs text-stone-500 hover:text-stone-300 py-2 mt-2 transition-colors"
                    >
                        I don&apos;t know / Skip for now (show all cassettes)
                    </button>
                </div>
            </div>
        </div>
    );
};

'use client';

import React from 'react';
import { Component } from '@/lib/validation';
import { Plus, Check, Scale, ExternalLink } from 'lucide-react';

interface PartCardProps {
    component: Component;
    onSelect: (component: Component) => void;
    isSelected: boolean;
}

export const PartCard: React.FC<PartCardProps> = ({ component, onSelect, isSelected }) => {
    const formatKey = (key: string) => key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    const formatValue = (key: string, value: unknown) => {
        if (value === null || value === undefined) return '--';
        const str = String(value);
        if (key.includes('weight')) return `${str}g`;
        if (key.includes('tooth') || key.includes('capacity') || key.includes('diff') || key.includes('cog')) return `${str}t`;
        return str;
    };

    // Get the most important specs (max 4)
    const importantKeys = ['weight_g', 'speeds', 'teeth', 'chainring_large', 'wheel_size', 'width', 'length'];
    const specs = Object.entries(component.attributes)
        .filter(([key]) => importantKeys.includes(key))
        .slice(0, 4);

    return (
        <div
            className={`group relative rounded-2xl border transition-all duration-200 overflow-hidden ${
                isSelected
                    ? 'bg-primary/10 border-primary/40 shadow-lg shadow-primary/10'
                    : 'bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.04]'
            }`}
        >
            {/* Main content - tappable area */}
            <button
                onClick={() => onSelect(component)}
                className="w-full text-left p-4 sm:p-5 focus:outline-none"
            >
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="min-w-0 flex-1">
                        <h3 className={`font-semibold text-base sm:text-lg leading-tight mb-1.5 transition-colors ${
                            isSelected ? 'text-primary' : 'text-stone-100 group-hover:text-primary'
                        }`}>
                            {component.name}
                        </h3>
                        <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-medium bg-white/5 text-stone-500 uppercase tracking-wider">
                            {component.type}
                        </span>
                    </div>

                    {/* Selection indicator */}
                    <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                        isSelected
                            ? 'bg-primary text-white'
                            : 'bg-white/5 text-stone-600 group-hover:bg-white/10'
                    }`}>
                        {isSelected ? (
                            <Check className="w-4 h-4" />
                        ) : (
                            <Plus className="w-4 h-4" />
                        )}
                    </div>
                </div>

                {/* Specs Grid */}
                {specs.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mb-3">
                        {specs.map(([key, value]) => (
                            <div key={key} className="bg-white/[0.03] rounded-lg p-2.5 border border-white/5">
                                <p className="text-[10px] text-stone-500 uppercase tracking-wider mb-0.5">
                                    {formatKey(key)}
                                </p>
                                <p className="text-sm font-medium text-stone-200 font-mono">
                                    {formatValue(key, value)}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Compatibility Tags */}
                {Object.keys(component.interfaces).length > 0 && (
                    <div className="pt-3 border-t border-white/5">
                        <div className="flex flex-wrap gap-1.5">
                            {Object.entries(component.interfaces).slice(0, 4).map(([key, value]) => (
                                <span
                                    key={key}
                                    className="px-2 py-1 rounded-md text-[10px] bg-white/5 text-stone-400 border border-white/5"
                                >
                                    {String(value)}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </button>

            {/* Buy Link - separate touch target */}
            <div className="px-4 sm:px-5 pb-4 sm:pb-5">
                <a
                    href={`https://competitivecyclist.g39l.net/GK5G32?u=${encodeURIComponent(`https://www.competitivecyclist.com/search?q=${encodeURIComponent(component.name)}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 hover:border-emerald-500/30 transition-all active:scale-[0.98]"
                >
                    <ExternalLink className="w-4 h-4" />
                    Buy Now
                </a>
            </div>
        </div>
    );
};

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
        if (key.includes('width') && !key.includes('internal')) return `${str}mm`;
        return str;
    };

    // Get type-specific important specs
    const getTypeSpecs = (): Array<{ label: string; value: string }> => {
        const result: Array<{ label: string; value: string }> = [];
        const attrs = component.attributes;
        const ifaces = component.interfaces;

        switch (component.type) {
            case 'Frame':
                if (attrs.category) result.push({ label: 'Category', value: String(attrs.category) });
                if (attrs.weight) result.push({ label: 'Weight', value: `${attrs.weight}g` });
                if (ifaces.rear_axle) result.push({ label: 'Rear Axle', value: String(ifaces.rear_axle).replace('TA_', '') });
                if (attrs.max_tire) result.push({ label: 'Max Tire', value: `${attrs.max_tire}mm` });
                break;

            case 'Wheel':
                if (ifaces.diameter) result.push({ label: 'Size', value: String(ifaces.diameter) });
                if (attrs.internal_width) result.push({ label: 'Inner Width', value: `${attrs.internal_width}mm` });
                if (ifaces.rear_axle) result.push({ label: 'Rear Axle', value: String(ifaces.rear_axle) });
                if (attrs.weight) result.push({ label: 'Weight', value: `${attrs.weight}g` });
                break;

            case 'Tire':
                if (ifaces.diameter) result.push({ label: 'Size', value: String(ifaces.diameter) });
                if (attrs.width) result.push({ label: 'Width', value: `${attrs.width}mm` });
                if (attrs.weight) result.push({ label: 'Weight', value: `${attrs.weight}g` });
                if (attrs.tpi) result.push({ label: 'TPI', value: String(attrs.tpi) });
                break;

            case 'Cassette':
                if (attrs.speeds) result.push({ label: 'Speed', value: `${attrs.speeds}s` });
                if (attrs.range) result.push({ label: 'Range', value: String(attrs.range) });
                if (ifaces.freehub_mount) result.push({ label: 'Freehub', value: String(ifaces.freehub_mount).replace(/_/g, ' ') });
                if (attrs.weight) result.push({ label: 'Weight', value: `${attrs.weight}g` });
                break;

            case 'RearDerailleur':
            case 'Derailleur':
                if (attrs.speeds) result.push({ label: 'Speed', value: `${attrs.speeds}s` });
                if (attrs.max_cog) result.push({ label: 'Max Cog', value: `${attrs.max_cog}t` });
                if (attrs.capacity) result.push({ label: 'Capacity', value: `${attrs.capacity}t` });
                if (attrs.weight) result.push({ label: 'Weight', value: `${attrs.weight}g` });
                break;

            case 'Shifter':
                if (attrs.speeds) result.push({ label: 'Speed', value: `${attrs.speeds}s` });
                if (ifaces.protocol) result.push({ label: 'Protocol', value: String(ifaces.protocol).replace(/_/g, ' ') });
                if (attrs.weight) result.push({ label: 'Weight', value: `${attrs.weight}g` });
                break;

            case 'Crankset':
            case 'Crank':
                if (attrs.teeth) result.push({ label: 'Chainring', value: String(attrs.teeth) });
                if (attrs.crank_length) result.push({ label: 'Length', value: `${attrs.crank_length}mm` });
                if (ifaces.spindle) result.push({ label: 'Spindle', value: String(ifaces.spindle).replace(/_/g, ' ') });
                if (attrs.weight) result.push({ label: 'Weight', value: `${attrs.weight}g` });
                break;

            case 'BottomBracket':
                if (ifaces.frame_interface || ifaces.frame_shell) result.push({ label: 'Shell', value: String(ifaces.frame_interface || ifaces.frame_shell).replace(/_/g, ' ') });
                if (ifaces.crank_interface || ifaces.crank_spindle) result.push({ label: 'Spindle', value: String(ifaces.crank_interface || ifaces.crank_spindle).replace(/_/g, ' ') });
                if (attrs.weight) result.push({ label: 'Weight', value: `${attrs.weight}g` });
                break;

            default:
                // Fallback: show weight and first few attributes
                if (attrs.weight) result.push({ label: 'Weight', value: `${attrs.weight}g` });
                Object.entries(attrs).slice(0, 3).forEach(([key, value]) => {
                    if (key !== 'weight' && value) {
                        result.push({ label: formatKey(key), value: formatValue(key, value) });
                    }
                });
        }

        return result.slice(0, 4);
    };

    const specs = getTypeSpecs();

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
                        {specs.map((spec) => (
                            <div key={spec.label} className="bg-white/[0.03] rounded-lg p-2.5 border border-white/5">
                                <p className="text-[10px] text-stone-500 uppercase tracking-wider mb-0.5">
                                    {spec.label}
                                </p>
                                <p className="text-sm font-medium text-stone-200 font-mono">
                                    {spec.value}
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

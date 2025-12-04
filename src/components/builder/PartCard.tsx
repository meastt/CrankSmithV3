'use client';

import React from 'react';
import { AnyComponent } from '@/store/buildStore';
import { Plus, Check, ExternalLink } from 'lucide-react';
// import { haptic } from '@/lib/haptics'; // Assuming haptics might not be set up or needs adjustment, keeping it if it works
// Actually, let's keep haptic if it exists, or comment it out if unsure. The user didn't mention it.
// I'll assume it exists.

interface PartCardProps {
    component: AnyComponent;
    onSelect: (component: AnyComponent) => void;
    isSelected: boolean;
}

export const PartCard: React.FC<PartCardProps> = ({ component, onSelect, isSelected }) => {
    const handleSelect = () => {
        // haptic('medium');
        onSelect(component);
    };

    // Helper to check if a property exists (type guard style)
    const hasProp = <K extends string>(obj: any, key: K): boolean => key in obj;

    // Get type-specific important specs
    const getTypeSpecs = (): Array<{ label: string; value: string }> => {
        const result: Array<{ label: string; value: string }> = [];

        // Common specs
        if (component.weightGrams) result.push({ label: 'Weight', value: `${component.weightGrams}g` });

        // Type specific
        if ('type' in component && (component as any).type) { // Frame
            // FrameType is an enum, so we can display it directly or map it
            if (hasProp(component, 'type')) result.push({ label: 'Type', value: (component as any).type });
            if (hasProp(component, 'rearAxle')) result.push({ label: 'Axle', value: (component as any).rearAxle.replace('AXLE_R_', '').replace('TA_', '') });
            if (hasProp(component, 'maxTireWidthMM')) result.push({ label: 'Max Tire', value: `${(component as any).maxTireWidthMM}mm` });
        }

        if ('axle' in component) { // Fork or Wheel
            if (hasProp(component, 'axle')) result.push({ label: 'Axle', value: (component as any).axle.replace('AXLE_', '').replace('TA_', '') });
        }

        if ('internalWidth' in component) { // Wheel
            result.push({ label: 'Inner Width', value: `${component.internalWidth}mm` });
            if (component.diameter) result.push({ label: 'Size', value: component.diameter });
        }

        if ('widthMM' in component) { // Tire
            result.push({ label: 'Width', value: `${component.widthMM}mm` });
            if (component.diameter) result.push({ label: 'Size', value: component.diameter });
        }

        if ('speeds' in component) { // Drivetrain
            result.push({ label: 'Speed', value: `${component.speeds}s` });
        }

        if ('range' in component) { // Cassette
            result.push({ label: 'Range', value: `${component.range[0]}-${component.range[1]}t` });
        }

        if ('chainrings' in component) { // Crank
            result.push({ label: 'Chainrings', value: component.chainrings.join('/') + 't' });
            if ('chainline' in component) result.push({ label: 'Chainline', value: `${component.chainline}mm` });
        }

        if ('clampDia' in component) { // Stem/Handlebar
            result.push({ label: 'Clamp', value: `${component.clampDia}mm` });
        }

        if ('length' in component) { // Stem
            result.push({ label: 'Length', value: `${(component as any).length}mm` });
        }

        if ('width' in component) { // Handlebar
            result.push({ label: 'Width', value: `${(component as any).width}mm` });
        }

        return result.slice(0, 4);
    };

    const specs = getTypeSpecs();
    const displayName = `${component.brand} ${component.model}`;

    // Determine component type label (simplistic)
    const typeLabel = 'type' in component ? (component as any).type :
        'position' in component ? (component as any).position :
            'Part';

    return (
        <div
            className={`group relative rounded-2xl border transition-all duration-200 overflow-hidden ${isSelected
                ? 'bg-primary/10 border-primary/40 shadow-lg shadow-primary/10'
                : 'bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.04]'
                }`}
        >
            {/* Main content - tappable area */}
            <button
                onClick={handleSelect}
                className="w-full text-left p-4 sm:p-5 focus:outline-none"
            >
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="min-w-0 flex-1">
                        <h3 className={`font-semibold text-base sm:text-lg leading-tight mb-1.5 transition-colors ${isSelected ? 'text-primary' : 'text-stone-100 group-hover:text-primary'
                            }`}>
                            {displayName}
                        </h3>
                        <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-medium bg-white/5 text-stone-500 uppercase tracking-wider">
                            {component.brand}
                        </span>
                    </div>

                    {/* Selection indicator */}
                    <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all ${isSelected
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
            </button>

            {/* Buy Link - separate touch target */}
            <div className="px-4 sm:px-5 pb-4 sm:pb-5">
                <a
                    href={`https://www.competitivecyclist.com/search?q=${encodeURIComponent(displayName)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 hover:border-emerald-500/30 transition-all active:scale-[0.98]"
                >
                    <ExternalLink className="w-4 h-4" />
                    Find Online
                </a>
            </div>
        </div>
    );
};

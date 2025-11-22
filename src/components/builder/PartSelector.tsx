'use client';

import React, { useEffect, useState } from 'react';
import { Component, validateFrameWheel, validateFrameBBCrank, validateDrivetrain } from '@/lib/validation';
import { PartCard } from './PartCard';
import { useBuildStore } from '@/store/buildStore';
import { Eye, EyeOff } from 'lucide-react';

const PART_TYPES = ['Frame', 'Wheel', 'Tire', 'BottomBracket', 'Crank', 'Shifter', 'Derailleur', 'Cassette'];
const FRAME_CATEGORIES = ['Road', 'Gravel', 'MTB'];

export const PartSelector: React.FC = () => {
    const [activeType, setActiveType] = useState('Frame');
    const [frameCategory, setFrameCategory] = useState<string | null>(null);
    const [components, setComponents] = useState<Component[]>([]);
    const [showIncompatible, setShowIncompatible] = useState(false);
    const { parts, setPart } = useBuildStore();

    useEffect(() => {
        fetch(`/api/components?type=${activeType}`)
            .then(res => res.json())
            .then(data => setComponents(data));
    }, [activeType]);

    const isCompatible = (component: Component): boolean => {
        // If no parts selected, everything is compatible
        if (Object.keys(parts).length === 0) return true;

        switch (activeType) {
            case 'Wheel':
                if (parts.Frame) {
                    return validateFrameWheel(parts.Frame, component).compatible;
                }
                break;
            case 'Tire':
                if (parts.Frame && parts.Wheel) {
                    return validateFrameWheel(parts.Frame, parts.Wheel, component).compatible;
                }
                break;
            case 'BottomBracket':
                if (parts.Frame) {
                    // Check Frame -> BB
                    const frameCheck = validateFrameBBCrank(parts.Frame, component, parts.Crank || component); // Hack: pass self if missing to skip check
                    if (!frameCheck.compatible && frameCheck.reasons.some(r => r.includes('Frame'))) return false;
                }
                if (parts.Crank) {
                    // Check BB -> Crank
                    const crankCheck = validateFrameBBCrank(parts.Frame || component, component, parts.Crank);
                    if (!crankCheck.compatible && crankCheck.reasons.some(r => r.includes('Crank'))) return false;
                }
                break;
            case 'Crank':
                if (parts.BottomBracket) {
                    const bbCheck = validateFrameBBCrank(parts.Frame || component, parts.BottomBracket, component);
                    if (!bbCheck.compatible) return false;
                }
                break;
            case 'Derailleur':
                if (parts.Shifter) {
                    const shiftCheck = validateDrivetrain(parts.Shifter, component, parts.Cassette || component);
                    if (!shiftCheck.compatible && shiftCheck.reasons.some(r => r.includes('Shifter'))) return false;
                }
                if (parts.Cassette) {
                    const cassCheck = validateDrivetrain(parts.Shifter || component, component, parts.Cassette);
                    if (!cassCheck.compatible && cassCheck.reasons.some(r => r.includes('Cassette'))) return false;
                }
                break;
            case 'Cassette':
                if (parts.Derailleur) {
                    const rdCheck = validateDrivetrain(parts.Shifter || component, parts.Derailleur, component);
                    if (!rdCheck.compatible) return false;
                }
                // Check Freehub Body if Wheel is selected
                if (parts.Wheel) {
                    if (parts.Wheel.interfaces.freehub_body !== component.interfaces.cassette_mount) return false;
                }
                break;
            case 'Shifter':
                if (parts.Derailleur) {
                    const rdCheck = validateDrivetrain(component, parts.Derailleur, parts.Cassette || component);
                    if (!rdCheck.compatible) return false;
                }
                break;
        }
        return true;
    };

    // Filter frames by category
    let filteredComponents = activeType === 'Frame' && frameCategory
        ? components.filter(c => c.attributes.category === frameCategory)
        : components;

    // Apply compatibility filter
    if (!showIncompatible) {
        filteredComponents = filteredComponents.filter(c => isCompatible(c));
    }

    return (
        <div className="flex-1 flex flex-col h-full bg-gradient-to-br from-gray-900 via-black to-gray-950">
            {/* Navigation Header */}
            <div className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur-xl border-b border-white/10 px-6 py-4 shadow-lg">
                <div className="flex flex-col space-y-4">
                    <div className="flex justify-between items-center">
                        <div className="flex space-x-1 overflow-x-auto no-scrollbar py-1 mask-linear-fade">
                            {PART_TYPES.map(type => (
                                <button
                                    key={type}
                                    onClick={() => {
                                        setActiveType(type);
                                        setFrameCategory(null);
                                    }}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${activeType === type
                                        ? 'bg-primary text-white shadow-lg shadow-primary/25 scale-105'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center pl-4 border-l border-white/10 ml-4">
                            <button
                                onClick={() => setShowIncompatible(!showIncompatible)}
                                className={`flex items-center px-3 py-1.5 rounded-md text-xs font-medium transition-all border ${showIncompatible
                                    ? 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20'
                                    : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                                    }`}
                            >
                                {showIncompatible ? <Eye className="w-3.5 h-3.5 mr-1.5" /> : <EyeOff className="w-3.5 h-3.5 mr-1.5" />}
                                {showIncompatible ? 'Showing All' : 'Hide Incompatible'}
                            </button>
                        </div>
                    </div>

                    {/* Sub-filters (Frames) */}
                    {activeType === 'Frame' && (
                        <div className="flex items-center space-x-2 animate-in fade-in slide-in-from-top-2 duration-200">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mr-2">Category:</span>
                            <button
                                onClick={() => setFrameCategory(null)}
                                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${frameCategory === null
                                    ? 'bg-white text-gray-900 border-white'
                                    : 'bg-transparent text-gray-400 border-gray-700 hover:border-gray-500'
                                    }`}
                            >
                                All
                            </button>
                            {FRAME_CATEGORIES.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setFrameCategory(cat)}
                                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${frameCategory === cat
                                        ? 'bg-white text-gray-900 border-white'
                                        : 'bg-transparent text-gray-400 border-gray-700 hover:border-gray-500'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Content Grid */}
            <div className="flex-1 overflow-y-auto p-6">

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredComponents.map(component => {
                        const compatible = isCompatible(component);
                        return (
                            <div key={component.id} className={!compatible ? 'opacity-50 grayscale' : ''}>
                                <PartCard
                                    component={component}
                                    onSelect={c => setPart(activeType, c)}
                                    isSelected={parts[activeType]?.id === component.id}
                                />
                                {!compatible && showIncompatible && (
                                    <div className="text-xs text-red-400 mt-1 text-center font-semibold">
                                        Incompatible
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

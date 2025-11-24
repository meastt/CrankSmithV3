'use client';

import React, { useEffect, useState } from 'react';
import { Component, validateFrameWheel, validateFrameBBCrank, validateDrivetrain } from '@/lib/validation';
import { PartCard } from './PartCard';
import { useBuildStore } from '@/store/buildStore';
import { Eye, EyeOff } from 'lucide-react';

const PART_TYPES = ['Frame', 'Wheel', 'Tire', 'BottomBracket', 'Crank', 'Shifter', 'Derailleur', 'Cassette', 'Handlebar', 'Stem'];
const FRAME_CATEGORIES = ['Road', 'Gravel', 'MTB'];

export const PartSelector: React.FC = () => {
    const [activeType, setActiveType] = useState('Frame');
    const [frameCategory, setFrameCategory] = useState<string | null>(null);
    const [components, setComponents] = useState<Component[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showIncompatible, setShowIncompatible] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
    const [crankConfiguration, setCrankConfiguration] = useState<'1x' | '2x' | null>(null);
    const { parts, setPart } = useBuildStore();

    useEffect(() => {
        setLoading(true);
        setError(null);
        // Reset selections when switching types
        setSelectedBrand(null);
        setCrankConfiguration(null);

        fetch(`/api/components?type=${activeType}`)
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch components');
                return res.json();
            })
            .then(data => {
                if (Array.isArray(data)) {
                    setComponents(data);
                } else {
                    console.error('Received non-array data:', data);
                    setComponents([]);
                    // If the API returns an error object, use it
                    if (data.error) {
                        setError(data.error);
                    } else {
                        setError('Invalid data received from server');
                    }
                }
            })
            .catch(err => {
                console.error('Error loading components:', err);
                setComponents([]);
                setError('Failed to load components. Please try again later.');
            })
            .finally(() => {
                setLoading(false);
            });
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
            case 'Stem':
                if (parts.Handlebar) {
                    if (parts.Handlebar.interfaces.clamp_diameter !== component.interfaces.clamp_diameter) return false;
                }
                if (parts.Frame) {
                    // Ideally check steerer tube diameter, but Frame data might need update. 
                    // Assuming standard 1 1/8" for now or checking if data exists.
                    if (parts.Frame.interfaces.steerer_tube && component.interfaces.steerer_clamp) {
                        if (parts.Frame.interfaces.steerer_tube !== component.interfaces.steerer_clamp) return false;
                    }
                }
                break;
            case 'Handlebar':
                if (parts.Stem) {
                    if (parts.Stem.interfaces.clamp_diameter !== component.interfaces.clamp_diameter) return false;
                }
                break;
        }
        return true;
    };

    // Helper to extract brand from name
    const getBrand = (name: string) => {
        if (name.startsWith('Santa Cruz')) return 'Santa Cruz';
        return name.split(' ')[0];
    };

    // Helper to check if crank is 1x
    const is1x = (component: Component) => {
        const teeth = component.attributes.teeth;
        return typeof teeth === 'string' && !teeth.includes('/');
    };

    // Get unique brands for current components
    const uniqueBrands = Array.from(new Set(components.map(c => getBrand(c.name)))).sort();

    // Filter components
    let filteredComponents = components;

    // 1. Filter by Frame Category
    if (activeType === 'Frame' && frameCategory) {
        filteredComponents = filteredComponents.filter(c => c.attributes.category === frameCategory);
    }

    // 2. Filter by Brand (if selected)
    if (selectedBrand) {
        filteredComponents = filteredComponents.filter(c => getBrand(c.name) === selectedBrand);
    }

    // 3. Filter by Crank Configuration (if selected)
    if (activeType === 'Crank' && crankConfiguration) {
        filteredComponents = filteredComponents.filter(c => {
            const isSingle = is1x(c);
            return crankConfiguration === '1x' ? isSingle : !isSingle;
        });
    }

    // Apply compatibility filter
    if (!showIncompatible) {
        filteredComponents = filteredComponents.filter(c => isCompatible(c));
    }

    // Determine view state
    const showBrandSelection = !selectedBrand && ['Frame', 'Tire', 'Crank', 'Shifter', 'Derailleur', 'Cassette'].includes(activeType);
    const showCrankConfigSelection = activeType === 'Crank' && selectedBrand && !crankConfiguration;
    const showComponentList = !showBrandSelection && !showCrankConfigSelection;

    const handleBack = () => {
        if (activeType === 'Crank' && crankConfiguration) {
            setCrankConfiguration(null);
        } else if (selectedBrand) {
            setSelectedBrand(null);
        }
    };

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

                    {/* Sub-filters / Back Button */}
                    <div className="flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-200 min-h-[24px]">
                        {activeType === 'Frame' && !selectedBrand ? (
                            <div className="flex items-center space-x-2">
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
                        ) : (selectedBrand || crankConfiguration) ? (
                            <button
                                onClick={handleBack}
                                className="text-xs text-primary hover:text-primary-400 font-medium flex items-center"
                            >
                                <span className="mr-1">←</span> Back
                            </button>
                        ) : <div />}
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="flex-1 overflow-y-auto p-6">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                        <div className="text-red-400 mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <h3 className="text-lg font-medium">Error Loading Components</h3>
                        </div>
                        <p className="text-gray-500 max-w-md">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-sm text-white transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                ) : showBrandSelection ? (
                    // BRAND SELECTION GRID
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {uniqueBrands.map(brand => (
                            <button
                                key={brand}
                                onClick={() => setSelectedBrand(brand)}
                                className="group relative aspect-video flex flex-col items-center justify-center bg-gray-900 border border-white/10 rounded-xl hover:border-primary/50 hover:bg-gray-800 transition-all duration-300 overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <h3 className="text-xl font-bold text-white group-hover:scale-110 transition-transform duration-300">{brand}</h3>
                                <span className="text-xs text-gray-500 mt-2 group-hover:text-gray-400">
                                    {components.filter(c => getBrand(c.name) === brand).length} Models
                                </span>
                            </button>
                        ))}
                    </div>
                ) : showCrankConfigSelection ? (
                    // CRANK CONFIGURATION SELECTION
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                        <button
                            onClick={() => setCrankConfiguration('1x')}
                            className="group relative aspect-[2/1] flex flex-col items-center justify-center bg-gray-900 border border-white/10 rounded-xl hover:border-primary/50 hover:bg-gray-800 transition-all duration-300 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <h3 className="text-2xl font-bold text-white mb-2">1x System</h3>
                            <p className="text-sm text-gray-400">Single Chainring</p>
                            <p className="text-xs text-gray-500 mt-2">Simplicity & Retention</p>
                        </button>
                        <button
                            onClick={() => setCrankConfiguration('2x')}
                            className="group relative aspect-[2/1] flex flex-col items-center justify-center bg-gray-900 border border-white/10 rounded-xl hover:border-primary/50 hover:bg-gray-800 transition-all duration-300 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <h3 className="text-2xl font-bold text-white mb-2">2x System</h3>
                            <p className="text-sm text-gray-400">Double Chainring</p>
                            <p className="text-xs text-gray-500 mt-2">Wider Range & Closer Steps</p>
                        </button>
                    </div>
                ) : filteredComponents.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                        <p>No components found for this selection.</p>
                        <button
                            onClick={handleBack}
                            className="mt-2 text-primary hover:underline"
                        >
                            Go Back
                        </button>
                    </div>
                ) : (
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
                )}
            </div>
        </div>
    );
};

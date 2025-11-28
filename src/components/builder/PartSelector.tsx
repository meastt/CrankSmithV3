'use client';

import React, { useEffect, useState } from 'react';
import { Component, validateFrameWheel, validateFrameBBCrank, validateDrivetrain } from '@/lib/validation';
import { PartCard } from './PartCard';
import { useBuildStore } from '@/store/buildStore';
import { Eye, EyeOff, ChevronLeft, ChevronRight } from 'lucide-react';

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
    const [selectedSpeed, setSelectedSpeed] = useState<string | null>(null);
    const [selectedWheelSize, setSelectedWheelSize] = useState<string | null>(null);
    const [selectedHubSpacing, setSelectedHubSpacing] = useState<string | null>(null);
    const [crankConfiguration, setCrankConfiguration] = useState<'1x' | '2x' | null>(null);
    const { parts, setPart } = useBuildStore();

    useEffect(() => {
        setLoading(true);
        setError(null);
        setSelectedBrand(null);
        setCrankConfiguration(null);
        setSelectedSpeed(null);
        setSelectedWheelSize(null);
        setSelectedHubSpacing(null);

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
                    const frameCheck = validateFrameBBCrank(parts.Frame, component, parts.Crank || component);
                    if (!frameCheck.compatible && frameCheck.reasons.some(r => r.includes('Frame'))) return false;
                }
                if (parts.Crank) {
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

    const getBrand = (name: string) => {
        if (name.startsWith('Santa Cruz')) return 'Santa Cruz';
        return name.split(' ')[0];
    };

    const is1x = (component: Component) => {
        const teeth = component.attributes.teeth;
        return typeof teeth === 'string' && !teeth.includes('/');
    };

    const uniqueBrands = Array.from(new Set(components.map(c => getBrand(c.name)))).sort();
    const uniqueSpeeds = Array.from(new Set(components.filter(c => c.attributes.speeds).map(c => c.attributes.speeds?.toString()))).sort();
    const uniqueWheelSizes = Array.from(new Set(components.filter(c => c.attributes.wheel_size).map(c => c.attributes.wheel_size))).sort();
    const uniqueHubSpacings = Array.from(new Set(components.filter(c => c.interfaces.axle_standard).map(c => c.interfaces.axle_standard))).sort();

    let filteredComponents = components;

    if (activeType === 'Frame' && frameCategory) {
        filteredComponents = filteredComponents.filter(c => c.attributes.category === frameCategory);
    }

    if (selectedBrand) {
        filteredComponents = filteredComponents.filter(c => getBrand(c.name) === selectedBrand);
    }

    if (activeType === 'Crank' && crankConfiguration) {
        filteredComponents = filteredComponents.filter(c => {
            const isSingle = is1x(c);
            return crankConfiguration === '1x' ? isSingle : !isSingle;
        });
    }

    if (selectedSpeed) {
        filteredComponents = filteredComponents.filter(c => c.attributes.speeds?.toString() === selectedSpeed);
    }

    if (selectedWheelSize) {
        filteredComponents = filteredComponents.filter(c => c.attributes.wheel_size === selectedWheelSize);
    }

    if (selectedHubSpacing) {
        filteredComponents = filteredComponents.filter(c => c.interfaces.axle_standard === selectedHubSpacing);
    }

    if (!showIncompatible) {
        filteredComponents = filteredComponents.filter(c => isCompatible(c));
    }

    const showCategorySelection = activeType === 'Frame' && !frameCategory;
    const showSpeedSelection = ['Cassette', 'Derailleur', 'Shifter'].includes(activeType) && !selectedSpeed;
    const showWheelSizeSelection = activeType === 'Wheel' && !selectedWheelSize;
    const showHubSpacingSelection = activeType === 'Wheel' && selectedWheelSize && !selectedHubSpacing;
    const showBrandSelection = !selectedBrand && ['Frame', 'Tire', 'Crank', 'Shifter', 'Derailleur', 'Cassette'].includes(activeType) && !(activeType === 'Frame' && !frameCategory) && !showSpeedSelection;
    const showCrankConfigSelection = activeType === 'Crank' && selectedBrand && !crankConfiguration;
    const showComponentList = !showCategorySelection && !showSpeedSelection && !showWheelSizeSelection && !showHubSpacingSelection && !showBrandSelection && !showCrankConfigSelection;

    const handleBack = () => {
        if (activeType === 'Crank' && crankConfiguration) {
            setCrankConfiguration(null);
        } else if (activeType === 'Wheel' && selectedHubSpacing) {
            setSelectedHubSpacing(null);
        } else if (activeType === 'Wheel' && selectedWheelSize) {
            setSelectedWheelSize(null);
        } else if (selectedSpeed) {
            setSelectedSpeed(null);
        } else if (selectedBrand) {
            setSelectedBrand(null);
        } else if (frameCategory) {
            setFrameCategory(null);
        }
    };

    // Get breadcrumb items
    const breadcrumbs = [];
    if (frameCategory) breadcrumbs.push(frameCategory);
    if (selectedSpeed) breadcrumbs.push(`${selectedSpeed}-speed`);
    if (selectedWheelSize) breadcrumbs.push(selectedWheelSize);
    if (selectedHubSpacing) breadcrumbs.push(selectedHubSpacing);
    if (selectedBrand) breadcrumbs.push(selectedBrand);
    if (crankConfiguration) breadcrumbs.push(crankConfiguration);

    return (
        <div className="flex-1 flex flex-col h-full bg-stone-950 overflow-hidden">
            {/* Header */}
            <div className="sticky top-0 z-20 bg-stone-950/95 backdrop-blur-xl border-b border-white/5">
                {/* Part Type Tabs - Horizontally scrollable on mobile */}
                <div className="relative">
                    <div className="flex overflow-x-auto no-scrollbar px-4 py-3 gap-1.5 mask-fade-x">
                        {PART_TYPES.map(type => {
                            const isSelected = parts[type];
                            const isActive = activeType === type;
                            return (
                                <button
                                    key={type}
                                    onClick={() => {
                                        setActiveType(type);
                                        setFrameCategory(null);
                                    }}
                                    className={`relative px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap shrink-0 ${
                                        isActive
                                            ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                            : isSelected
                                            ? 'bg-white/10 text-stone-200 ring-1 ring-white/20'
                                            : 'text-stone-500 hover:text-stone-300 hover:bg-white/5'
                                    }`}
                                >
                                    {type.replace('BottomBracket', 'BB')}
                                    {isSelected && !isActive && (
                                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Filters Row */}
                <div className="flex items-center justify-between px-4 py-2.5 border-t border-white/5">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                        {breadcrumbs.length > 0 ? (
                            <div className="flex items-center gap-2 overflow-hidden">
                                <button
                                    onClick={handleBack}
                                    className="flex items-center gap-1 text-sm text-primary hover:text-primary-light transition-colors shrink-0"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    <span className="hidden sm:inline">Back</span>
                                </button>
                                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                                    {breadcrumbs.map((crumb, idx) => (
                                        <span
                                            key={idx}
                                            className="px-2 py-1 bg-white/5 rounded-md text-xs text-stone-400 whitespace-nowrap"
                                        >
                                            {crumb}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <span className="text-sm text-stone-500">Select {activeType.toLowerCase()}</span>
                        )}
                    </div>

                    <button
                        onClick={() => setShowIncompatible(!showIncompatible)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ml-2 ${
                            showIncompatible
                                ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}
                    >
                        {showIncompatible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        <span className="hidden sm:inline">{showIncompatible ? 'All' : 'Compatible'}</span>
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto pb-24 lg:pb-6">
                <div className="p-4 md:p-6">
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center h-64 text-center px-4">
                            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-stone-200 mb-2">Error Loading Components</h3>
                            <p className="text-stone-500 text-sm mb-4">{error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="btn-primary px-6 py-2.5 text-white rounded-lg text-sm font-medium"
                            >
                                Retry
                            </button>
                        </div>
                    ) : showCategorySelection ? (
                        <SelectionGrid
                            title="Choose Your Riding Style"
                            items={FRAME_CATEGORIES.map(cat => ({
                                id: cat,
                                title: cat,
                                subtitle: cat === 'Road' ? 'Speed & Efficiency' : cat === 'Gravel' ? 'All-Road Adventure' : 'Off-Road Performance',
                                count: components.filter(c => c.attributes.category === cat).length,
                                countLabel: 'Frames'
                            }))}
                            onSelect={(id) => setFrameCategory(id)}
                            columns={3}
                        />
                    ) : showSpeedSelection ? (
                        <SelectionGrid
                            title="Select Drivetrain Speed"
                            items={uniqueSpeeds.map(speed => ({
                                id: speed || '',
                                title: speed || '',
                                subtitle: 'Speed',
                                count: components.filter(c => c.attributes.speeds?.toString() === speed).length,
                                countLabel: 'Options'
                            }))}
                            onSelect={(id) => setSelectedSpeed(id)}
                            columns={3}
                        />
                    ) : showWheelSizeSelection ? (
                        <SelectionGrid
                            title="Select Wheel Size"
                            items={uniqueWheelSizes.map(size => ({
                                id: size || '',
                                title: size || '',
                                count: components.filter(c => c.attributes.wheel_size === size).length,
                                countLabel: 'Wheels'
                            }))}
                            onSelect={(id) => setSelectedWheelSize(id)}
                            columns={4}
                        />
                    ) : showHubSpacingSelection ? (
                        <SelectionGrid
                            title="Select Hub Spacing"
                            items={uniqueHubSpacings.map(spacing => ({
                                id: spacing || '',
                                title: spacing || '',
                                count: components.filter(c => c.interfaces.axle_standard === spacing).length,
                                countLabel: 'Wheels'
                            }))}
                            onSelect={(id) => setSelectedHubSpacing(id)}
                            columns={3}
                        />
                    ) : showBrandSelection ? (
                        <SelectionGrid
                            title="Choose a Brand"
                            items={uniqueBrands.map(brand => ({
                                id: brand,
                                title: brand,
                                count: filteredComponents.filter(c => getBrand(c.name) === brand).length,
                                countLabel: 'Models'
                            }))}
                            onSelect={(id) => setSelectedBrand(id)}
                            columns={4}
                        />
                    ) : showCrankConfigSelection ? (
                        <SelectionGrid
                            title="Select Configuration"
                            items={[
                                { id: '1x', title: '1x System', subtitle: 'Single Chainring', count: 0, countLabel: 'Simplicity & Retention' },
                                { id: '2x', title: '2x System', subtitle: 'Double Chainring', count: 0, countLabel: 'Wider Range' }
                            ]}
                            onSelect={(id) => setCrankConfiguration(id as '1x' | '2x')}
                            columns={2}
                            showCount={false}
                        />
                    ) : filteredComponents.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-stone-500">
                            <p className="mb-3">No components found for this selection.</p>
                            <button onClick={handleBack} className="text-primary hover:underline text-sm">
                                Go Back
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
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
                                            <div className="text-xs text-red-400 mt-2 text-center font-medium">
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
        </div>
    );
};

// Selection Grid Component
interface SelectionItem {
    id: string;
    title: string;
    subtitle?: string;
    count?: number;
    countLabel?: string;
}

interface SelectionGridProps {
    title: string;
    items: SelectionItem[];
    onSelect: (id: string) => void;
    columns?: 2 | 3 | 4;
    showCount?: boolean;
}

const SelectionGrid: React.FC<SelectionGridProps> = ({ title, items, onSelect, columns = 3, showCount = true }) => {
    const gridCols = {
        2: 'grid-cols-1 sm:grid-cols-2',
        3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
        4: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4'
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-xl md:text-2xl font-bold text-stone-100 mb-6 text-center">{title}</h2>
            <div className={`grid ${gridCols[columns]} gap-3 md:gap-4`}>
                {items.map(item => (
                    <button
                        key={item.id}
                        onClick={() => onSelect(item.id)}
                        className="group relative aspect-[4/3] sm:aspect-[3/2] flex flex-col items-center justify-center bg-white/[0.02] border border-white/5 rounded-2xl hover:border-primary/30 hover:bg-white/[0.04] transition-all duration-300 p-4"
                    >
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <h3 className="text-xl md:text-2xl font-bold text-stone-100 mb-1 group-hover:text-primary transition-colors">
                            {item.title}
                        </h3>
                        {item.subtitle && (
                            <p className="text-sm text-stone-500">{item.subtitle}</p>
                        )}
                        {showCount && item.count !== undefined && (
                            <span className="text-xs text-stone-600 mt-2">
                                {item.count} {item.countLabel}
                            </span>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Component, validateFrameWheel, validateFrameBBCrank, validateDrivetrain } from '@/lib/validation';
import { PartCard } from './PartCard';
import { useBuildStore } from '@/store/buildStore';
import {
    Eye, EyeOff, ChevronLeft, ChevronRight, Check,
    Circle, Bike, CircleDot, Disc, Settings,
    Gauge, Cog, Layers, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Build sequence - the logical order for building a bike
const BUILD_SEQUENCE = [
    { type: 'Frame', label: 'Frame', icon: Bike, description: 'Start with your foundation' },
    { type: 'Wheel', label: 'Wheels', icon: CircleDot, description: 'Choose your rolling stock' },
    { type: 'Tire', label: 'Tires', icon: Circle, description: 'Rubber meets road' },
    { type: 'BottomBracket', label: 'BB', icon: Disc, description: 'The heart of power transfer' },
    { type: 'Crank', label: 'Crank', icon: Settings, description: 'Your power input' },
    { type: 'Cassette', label: 'Cassette', icon: Cog, description: 'Gear range selection' },
    { type: 'Derailleur', label: 'Derailleur', icon: Layers, description: 'Shifting precision' },
    { type: 'Shifter', label: 'Shifter', icon: Gauge, description: 'Control at your fingertips' },
];

const FRAME_CATEGORIES = ['Road', 'Gravel', 'MTB'];

export const PartSelector: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(0);
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

    const activeType = BUILD_SEQUENCE[currentStep]?.type || 'Frame';

    // Reset filters when changing steps
    const resetFilters = useCallback(() => {
        setSelectedBrand(null);
        setCrankConfiguration(null);
        setSelectedSpeed(null);
        setSelectedWheelSize(null);
        setSelectedHubSpacing(null);
    }, []);

    // Fetch components when step changes
    useEffect(() => {
        setLoading(true);
        setError(null);
        resetFilters();

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
                    setError(data.error || 'Invalid data received from server');
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
    }, [activeType, resetFilters]);

    // Auto-advance to next step when a part is selected
    const handleSelectPart = useCallback((component: Component) => {
        setPart(activeType, component);

        // Auto-advance to next step after a short delay
        setTimeout(() => {
            if (currentStep < BUILD_SEQUENCE.length - 1) {
                setCurrentStep(prev => prev + 1);
                resetFilters();
                if (activeType === 'Frame') {
                    setFrameCategory(null);
                }
            }
        }, 300);
    }, [activeType, currentStep, setPart, resetFilters]);

    // Navigate to specific step
    const goToStep = (stepIndex: number) => {
        setCurrentStep(stepIndex);
        resetFilters();
    };

    // Compatibility checking
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
        }
        return true;
    };

    // Helper functions
    const getBrand = (name: string) => {
        if (name.startsWith('Santa Cruz')) return 'Santa Cruz';
        return name.split(' ')[0];
    };

    const is1x = (component: Component) => {
        const teeth = component.attributes.teeth;
        return typeof teeth === 'string' && !teeth.includes('/');
    };

    // Get unique filter values
    const uniqueBrands = Array.from(new Set(components.map(c => getBrand(c.name)))).sort();
    const uniqueSpeeds = Array.from(new Set(components.filter(c => c.attributes.speeds).map(c => String(c.attributes.speeds)))).sort((a, b) => Number(b) - Number(a));
    const uniqueWheelSizes = Array.from(new Set(components.filter(c => c.attributes.wheel_size).map(c => String(c.attributes.wheel_size)))).filter(Boolean).sort();
    const uniqueHubSpacings = Array.from(new Set(components.filter(c => c.interfaces.axle_standard).map(c => String(c.interfaces.axle_standard)))).filter(Boolean).sort();

    // Apply filters
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
        filteredComponents = filteredComponents.filter(c => String(c.attributes.speeds) === selectedSpeed);
    }

    if (selectedWheelSize) {
        filteredComponents = filteredComponents.filter(c => String(c.attributes.wheel_size) === selectedWheelSize);
    }

    if (selectedHubSpacing) {
        filteredComponents = filteredComponents.filter(c => String(c.interfaces.axle_standard) === selectedHubSpacing);
    }

    if (!showIncompatible) {
        filteredComponents = filteredComponents.filter(c => isCompatible(c));
    }

    // Determine what selection UI to show
    const showCategorySelection = activeType === 'Frame' && !frameCategory;
    const showWheelSizeSelection = activeType === 'Wheel' && uniqueWheelSizes.length > 0 && !selectedWheelSize;
    const showHubSpacingSelection = activeType === 'Wheel' && selectedWheelSize && uniqueHubSpacings.length > 1 && !selectedHubSpacing;
    const showSpeedSelection = ['Cassette', 'Derailleur', 'Shifter'].includes(activeType) && uniqueSpeeds.length > 0 && !selectedSpeed;
    const showBrandSelection = !selectedBrand &&
        ['Frame', 'Tire', 'Crank'].includes(activeType) &&
        !(activeType === 'Frame' && !frameCategory) &&
        !showSpeedSelection &&
        uniqueBrands.length > 1;
    const showCrankConfigSelection = activeType === 'Crank' && selectedBrand && !crankConfiguration;

    // Handle back navigation
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
        } else if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    // Breadcrumbs
    const breadcrumbs: string[] = [];
    if (frameCategory) breadcrumbs.push(frameCategory);
    if (selectedWheelSize) breadcrumbs.push(selectedWheelSize);
    if (selectedHubSpacing) breadcrumbs.push(selectedHubSpacing);
    if (selectedSpeed) breadcrumbs.push(`${selectedSpeed}-speed`);
    if (selectedBrand) breadcrumbs.push(selectedBrand);
    if (crankConfiguration) breadcrumbs.push(crankConfiguration);

    const currentStepInfo = BUILD_SEQUENCE[currentStep];

    return (
        <div className="flex-1 flex flex-col h-full bg-gray-950 overflow-hidden">
            {/* Progress Steps - Horizontal scrollable */}
            <div className="border-b border-white/5 bg-gray-950/80 backdrop-blur-xl">
                <div className="flex overflow-x-auto no-scrollbar px-2 py-3 gap-1">
                    {BUILD_SEQUENCE.map((step, idx) => {
                        const isComplete = parts[step.type];
                        const isCurrent = idx === currentStep;
                        const isPast = idx < currentStep;
                        const StepIcon = step.icon;

                        return (
                            <button
                                key={step.type}
                                onClick={() => goToStep(idx)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap shrink-0 ${
                                    isCurrent
                                        ? 'bg-primary text-white shadow-lg shadow-primary/25'
                                        : isComplete
                                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                                        : isPast
                                        ? 'bg-white/5 text-stone-400'
                                        : 'text-stone-600 hover:text-stone-400 hover:bg-white/5'
                                }`}
                            >
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                                    isComplete && !isCurrent ? 'bg-emerald-500/20' : ''
                                }`}>
                                    {isComplete && !isCurrent ? (
                                        <Check className="w-3 h-3" />
                                    ) : (
                                        <StepIcon className="w-3.5 h-3.5" />
                                    )}
                                </div>
                                <span className="hidden sm:inline">{step.label}</span>
                                {idx < BUILD_SEQUENCE.length - 1 && (
                                    <ChevronRight className="w-3 h-3 text-stone-700 hidden md:block" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Current Step Header */}
            <div className="px-4 py-4 border-b border-white/5 bg-gradient-to-r from-gray-950 to-gray-900">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {(breadcrumbs.length > 0 || currentStep > 0) && (
                            <button
                                onClick={handleBack}
                                className="p-2 -ml-2 text-stone-400 hover:text-primary transition-colors rounded-lg hover:bg-white/5"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                        )}
                        <div>
                            <h1 className="text-lg font-semibold text-stone-100">
                                {currentStepInfo?.label}
                            </h1>
                            <p className="text-xs text-stone-500 mt-0.5">
                                {breadcrumbs.length > 0
                                    ? breadcrumbs.join(' → ')
                                    : currentStepInfo?.description
                                }
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowIncompatible(!showIncompatible)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                            showIncompatible
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}
                    >
                        {showIncompatible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        <span className="hidden sm:inline">{showIncompatible ? 'Showing All' : 'Compatible Only'}</span>
                    </button>
                </div>

                {/* Selected part indicator */}
                {parts[activeType] && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3 flex items-center gap-2 px-3 py-2 bg-primary/10 border border-primary/20 rounded-lg"
                    >
                        <Check className="w-4 h-4 text-primary" />
                        <span className="text-sm text-primary font-medium">{parts[activeType]?.name}</span>
                        <button
                            onClick={() => {
                                if (currentStep < BUILD_SEQUENCE.length - 1) {
                                    setCurrentStep(prev => prev + 1);
                                    resetFilters();
                                }
                            }}
                            className="ml-auto flex items-center gap-1 text-xs text-primary hover:text-primary-light"
                        >
                            Next <ArrowRight className="w-3 h-3" />
                        </button>
                    </motion.div>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto pb-28 lg:pb-6">
                <div className="p-4 md:p-6">
                    <AnimatePresence mode="wait">
                        {loading ? (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center h-64 gap-4"
                            >
                                <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                <p className="text-sm text-stone-500">Loading {currentStepInfo?.label}...</p>
                            </motion.div>
                        ) : error ? (
                            <motion.div
                                key="error"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center h-64 text-center px-4"
                            >
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
                            </motion.div>
                        ) : showCategorySelection ? (
                            <SelectionGrid
                                key="category"
                                title="Choose Your Discipline"
                                subtitle="This determines compatible frame geometry and standards"
                                items={FRAME_CATEGORIES.map(cat => ({
                                    id: cat,
                                    title: cat,
                                    subtitle: cat === 'Road' ? 'Speed & efficiency on pavement' : cat === 'Gravel' ? 'Mixed terrain adventure' : 'Technical off-road',
                                    count: components.filter(c => c.attributes.category === cat).length,
                                    countLabel: 'frames'
                                }))}
                                onSelect={(id) => setFrameCategory(id)}
                                columns={3}
                            />
                        ) : showWheelSizeSelection ? (
                            <SelectionGrid
                                key="wheelsize"
                                title="Select Wheel Size"
                                subtitle="Match your frame's wheel compatibility"
                                items={uniqueWheelSizes.map(size => ({
                                    id: size,
                                    title: size,
                                    subtitle: size === '700c' ? 'Road standard' : size === '650b' ? 'Gravel/smaller' : size === '29"' ? 'MTB large' : size === '27.5"' ? 'MTB agile' : '',
                                    count: components.filter(c => String(c.attributes.wheel_size) === size).length,
                                    countLabel: 'wheels'
                                }))}
                                onSelect={(id) => setSelectedWheelSize(id)}
                                columns={uniqueWheelSizes.length <= 2 ? 2 : 3}
                            />
                        ) : showHubSpacingSelection ? (
                            <SelectionGrid
                                key="hubspacing"
                                title="Select Hub Spacing"
                                subtitle="Must match your frame's dropout width"
                                items={uniqueHubSpacings.map(spacing => ({
                                    id: spacing,
                                    title: spacing,
                                    count: components.filter(c => String(c.interfaces.axle_standard) === spacing).length,
                                    countLabel: 'wheels'
                                }))}
                                onSelect={(id) => setSelectedHubSpacing(id)}
                                columns={uniqueHubSpacings.length <= 2 ? 2 : 3}
                            />
                        ) : showSpeedSelection ? (
                            <SelectionGrid
                                key="speed"
                                title="Select Speed Count"
                                subtitle="Number of rear cogs - must match across drivetrain"
                                items={uniqueSpeeds.map(speed => ({
                                    id: speed,
                                    title: `${speed}-speed`,
                                    subtitle: Number(speed) >= 12 ? 'Modern groupset' : Number(speed) >= 11 ? 'Standard modern' : 'Legacy',
                                    count: components.filter(c => String(c.attributes.speeds) === speed).length,
                                    countLabel: 'options'
                                }))}
                                onSelect={(id) => setSelectedSpeed(id)}
                                columns={uniqueSpeeds.length <= 2 ? 2 : 3}
                            />
                        ) : showBrandSelection ? (
                            <SelectionGrid
                                key="brand"
                                title="Choose Brand"
                                subtitle="Filter by manufacturer"
                                items={uniqueBrands.map(brand => ({
                                    id: brand,
                                    title: brand,
                                    count: filteredComponents.filter(c => getBrand(c.name) === brand).length,
                                    countLabel: 'models'
                                }))}
                                onSelect={(id) => setSelectedBrand(id)}
                                columns={4}
                            />
                        ) : showCrankConfigSelection ? (
                            <SelectionGrid
                                key="crankconfig"
                                title="Chainring Configuration"
                                subtitle="Single or double chainring setup"
                                items={[
                                    { id: '1x', title: '1x', subtitle: 'Single chainring - Simple & light', count: filteredComponents.filter(c => is1x(c)).length, countLabel: 'cranks' },
                                    { id: '2x', title: '2x', subtitle: 'Double chainring - Wider range', count: filteredComponents.filter(c => !is1x(c)).length, countLabel: 'cranks' }
                                ]}
                                onSelect={(id) => setCrankConfiguration(id as '1x' | '2x')}
                                columns={2}
                            />
                        ) : filteredComponents.length === 0 ? (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center h-64 text-center"
                            >
                                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                                    <currentStepInfo.icon className="w-8 h-8 text-stone-600" />
                                </div>
                                <h3 className="text-lg font-medium text-stone-300 mb-2">No Compatible Parts</h3>
                                <p className="text-stone-500 text-sm mb-4 max-w-xs">
                                    No {currentStepInfo?.label.toLowerCase()} match your current selection.
                                </p>
                                <div className="flex gap-2">
                                    <button onClick={handleBack} className="px-4 py-2 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors">
                                        Go Back
                                    </button>
                                    <button
                                        onClick={() => setShowIncompatible(true)}
                                        className="px-4 py-2 text-sm text-stone-400 hover:bg-white/5 rounded-lg transition-colors"
                                    >
                                        Show All
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="components"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
                            >
                                {filteredComponents.map((component, idx) => {
                                    const compatible = isCompatible(component);
                                    return (
                                        <motion.div
                                            key={component.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.03 }}
                                            className={!compatible ? 'opacity-50 grayscale' : ''}
                                        >
                                            <PartCard
                                                component={component}
                                                onSelect={handleSelectPart}
                                                isSelected={parts[activeType]?.id === component.id}
                                            />
                                            {!compatible && showIncompatible && (
                                                <div className="text-xs text-red-400 mt-2 text-center font-medium">
                                                    Incompatible with current build
                                                </div>
                                            )}
                                        </motion.div>
                                    );
                                })}
                            </motion.div>
                        )}
                    </AnimatePresence>
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
    subtitle?: string;
    items: SelectionItem[];
    onSelect: (id: string) => void;
    columns?: 2 | 3 | 4;
    showCount?: boolean;
}

const SelectionGrid: React.FC<SelectionGridProps> = ({
    title,
    subtitle,
    items,
    onSelect,
    columns = 3,
    showCount = true
}) => {
    const gridCols = {
        2: 'grid-cols-1 sm:grid-cols-2 max-w-2xl',
        3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 max-w-4xl',
        4: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 max-w-5xl'
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mx-auto"
        >
            <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-stone-100 mb-2">{title}</h2>
                {subtitle && <p className="text-stone-500 text-sm">{subtitle}</p>}
            </div>
            <div className={`grid ${gridCols[columns]} gap-3 md:gap-4 mx-auto`}>
                {items.map((item, idx) => (
                    <motion.button
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => onSelect(item.id)}
                        className="group relative aspect-[4/3] sm:aspect-[3/2] flex flex-col items-center justify-center bg-white/[0.02] border border-white/5 rounded-2xl hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 p-4 overflow-hidden"
                    >
                        {/* Hover gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Content */}
                        <div className="relative z-10 text-center">
                            <h3 className="text-xl md:text-2xl font-bold text-stone-100 mb-1 group-hover:text-primary transition-colors">
                                {item.title}
                            </h3>
                            {item.subtitle && (
                                <p className="text-xs sm:text-sm text-stone-500 mb-2 line-clamp-2">{item.subtitle}</p>
                            )}
                            {showCount && item.count !== undefined && (
                                <span className="inline-block px-2 py-0.5 bg-white/5 rounded text-xs text-stone-600">
                                    {item.count} {item.countLabel}
                                </span>
                            )}
                        </div>

                        {/* Arrow indicator */}
                        <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0 translate-x-2">
                            <ArrowRight className="w-4 h-4 text-primary" />
                        </div>
                    </motion.button>
                ))}
            </div>
        </motion.div>
    );
};

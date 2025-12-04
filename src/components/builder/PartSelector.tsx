'use client';

import { BuildDashboard } from './BuildDashboard';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Validator } from '@/engine/Validator';
import { PartCard } from './PartCard';
import { useBuildStore, AnyComponent } from '@/store/buildStore';
import { useClerk, useUser } from '@clerk/nextjs';
import { useSettingsStore } from '@/store/settingsStore';
import {
    Eye, EyeOff, ChevronLeft, ChevronRight, Check,
    Circle, Bike, CircleDot, Disc, Settings,
    Gauge, Cog, Layers, ArrowRight, Activity
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FrameType } from '@/constants/standards';

// Build sequence - the logical order for building a bike
const BUILD_SEQUENCE = [
    { type: 'Frame', label: 'Frame', icon: Bike, description: 'Start with your foundation' },
    { type: 'Wheel', label: 'Wheels', icon: CircleDot, description: 'Choose your rolling stock' },
    { type: 'Tire', label: 'Tires', icon: Circle, description: 'Rubber meets road' },
    { type: 'BottomBracket', label: 'BB', icon: Disc, description: 'The heart of power transfer' },
    { type: 'Crankset', label: 'Crankset', icon: Settings, description: 'Your power input' },
    { type: 'Cassette', label: 'Cassette', icon: Cog, description: 'Gear range selection' },
    { type: 'RearDerailleur', label: 'Derailleur', icon: Layers, description: 'Shifting precision' },
    { type: 'Shifter', label: 'Shifter', icon: Gauge, description: 'Control at your fingertips' },
    { type: 'BrakeCaliper', label: 'Brakes', icon: Disc, description: 'Stopping power' },
    { type: 'BrakeRotor', label: 'Rotors', icon: Disc, description: 'Brake rotors' },
    { type: 'Stem', label: 'Stem', icon: Settings, description: 'Cockpit fit' },
    { type: 'Handlebar', label: 'Bars', icon: Settings, description: 'Control interface' },
    { type: 'Seatpost', label: 'Seatpost', icon: Settings, description: 'Seating' },
];

const FRAME_CATEGORIES = [FrameType.ROAD, FrameType.GRAVEL, FrameType.MTB];

export const PartSelector: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [frameCategory, setFrameCategory] = useState<string | null>(null);
    const [components, setComponents] = useState<AnyComponent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showIncompatible, setShowIncompatible] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
    const [showDashboard, setShowDashboard] = useState(false);

    const { parts, setPart, clearBuild } = useBuildStore();
    const { unitSystem } = useSettingsStore();
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const searchParams = useSearchParams();

    const activeType = BUILD_SEQUENCE[currentStep]?.type || 'Frame';

    // Clear build when starting fresh
    useEffect(() => {
        if (searchParams.get('new') === 'true') {
            clearBuild();
            setCurrentStep(0);
            setFrameCategory(null);
            window.history.replaceState({}, '', '/builder');
        }
    }, [searchParams, clearBuild]);

    // Reset filters when changing steps
    const resetFilters = useCallback(() => {
        setSelectedBrand(null);
    }, []);

    // Scroll to top when step changes
    const scrollToTop = useCallback((immediate = false) => {
        scrollContainerRef.current?.scrollTo({
            top: 0,
            behavior: immediate ? 'instant' : 'smooth'
        });
    }, []);

    useEffect(() => {
        scrollToTop(true);
        window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    }, [currentStep, scrollToTop]);

    // Fetch components when step changes
    useEffect(() => {
        setLoading(true);
        setError(null);
        resetFilters();

        fetch(`/api/components/mock?type=${activeType}`)
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch components');
                return res.json();
            })
            .then(data => {
                if (Array.isArray(data)) {
                    setComponents(data);
                } else {
                    setComponents([]);
                    setError('Invalid data received');
                }
            })
            .catch(err => {
                console.error('Error loading components:', err);
                setComponents([]);
                setError('Failed to load components');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [activeType, resetFilters]);

    // Auto-advance
    const handleSelectPart = useCallback((component: AnyComponent) => {
        // Special handling for Wheels (Set Front and Rear)
        if (activeType === 'Wheel') {
            if ('position' in component) {
                if (component.position === 'FRONT') setPart('WheelFront', component);
                if (component.position === 'REAR') setPart('WheelRear', component);
            }
        } else if (activeType === 'Tire') {
            setPart('TireFront', component);
            setPart('TireRear', component);
        } else if (activeType === 'BrakeCaliper') {
            setPart('BrakeCaliperFront', component);
            setPart('BrakeCaliperRear', component);
        } else if (activeType === 'BrakeRotor') {
            setPart('BrakeRotorFront', component);
            setPart('BrakeRotorRear', component);
        } else {
            setPart(activeType as any, component);
        }

        // Auto-advance
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

    const goToStep = (stepIndex: number) => {
        setCurrentStep(stepIndex);
        resetFilters();
    };

    // COMPATIBILITY CHECKING
    const isCompatible = (component: AnyComponent): boolean => {
        if (activeType === 'Frame') return true;

        // Construct a temporary build object
        const tempParts = { ...parts };

        // Add the candidate component
        if (activeType === 'Wheel' && 'position' in component) {
            if (component.position === 'FRONT') tempParts.WheelFront = component as any;
            if (component.position === 'REAR') tempParts.WheelRear = component as any;
        } else if (activeType === 'Tire') {
            tempParts.TireFront = component as any;
            tempParts.TireRear = component as any;
        } else {
            (tempParts as any)[activeType] = component;
        }

        // Map to Validator structure
        const buildData = {
            frame: tempParts.Frame || undefined,
            fork: tempParts.Fork || undefined,
            wheels: [tempParts.WheelFront, tempParts.WheelRear].filter(Boolean) as any[],
            tires: [tempParts.TireFront, tempParts.TireRear].filter(Boolean) as any[],
            bottomBracket: tempParts.BottomBracket || undefined,
            crankset: tempParts.Crankset || undefined,
            cassette: tempParts.Cassette || undefined,
            rearDerailleur: tempParts.RearDerailleur || undefined,
            shifter: tempParts.Shifter || undefined,
            brakes: {
                levers: tempParts.Shifter || undefined,
                calipers: [tempParts.BrakeCaliperFront, tempParts.BrakeCaliperRear].filter(Boolean) as any[],
                rotors: [tempParts.BrakeRotorFront, tempParts.BrakeRotorRear].filter(Boolean) as any[],
            },
            cockpit: {
                stem: tempParts.Stem || undefined,
                handlebar: tempParts.Handlebar || undefined,
                seatpost: tempParts.Seatpost || undefined
            }
        };

        const results = Validator.validateBuild(buildData);

        // If any result is INCOMPATIBLE, return false
        return !results.some(r => r.status === 'INCOMPATIBLE');
    };

    // FILTERS
    let filteredComponents = components;

    // Frame Category
    if (activeType === 'Frame' && frameCategory) {
        filteredComponents = filteredComponents.filter(c => 'type' in c && c.type === frameCategory);
    }

    // Compatibility
    if (!showIncompatible) {
        filteredComponents = filteredComponents.filter(c => isCompatible(c));
    }

    // Brand
    if (selectedBrand) {
        filteredComponents = filteredComponents.filter(c => c.brand === selectedBrand);
    }

    const uniqueBrands = Array.from(new Set(components.map(c => c.brand))).sort();
    const showCategorySelection = activeType === 'Frame' && !frameCategory;

    const currentStepInfo = BUILD_SEQUENCE[currentStep];

    // Handle back navigation
    const handleBack = () => {
        if (selectedBrand) {
            setSelectedBrand(null);
        } else if (frameCategory) {
            setFrameCategory(null);
        } else if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-gray-950 overflow-hidden relative">
            {/* Dashboard Overlay */}
            <AnimatePresence>
                {showDashboard && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowDashboard(false)}
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm z-40"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-stone-900 border-l border-white/10 z-50 p-4 shadow-2xl overflow-y-auto"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-white">Build Status</h2>
                                <button
                                    onClick={() => setShowDashboard(false)}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                >
                                    <ChevronRight className="w-6 h-6 text-stone-400" />
                                </button>
                            </div>
                            <BuildDashboard />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Progress Steps */}
            <div className="sticky top-[calc(4rem+env(safe-area-inset-top))] md:top-[calc(4.5rem+env(safe-area-inset-top))] z-30 bg-stone-950/95 backdrop-blur border-b border-white/5">
                <div className="px-4 py-3 flex items-center justify-between gap-4">
                    <div className="overflow-x-auto no-scrollbar flex items-center gap-2 flex-1">
                        {BUILD_SEQUENCE.map((step, idx) => {
                            const isCurrent = idx === currentStep;
                            const StepIcon = step.icon;
                            return (
                                <button
                                    key={step.type}
                                    onClick={() => goToStep(idx)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap shrink-0 ${isCurrent
                                        ? 'bg-primary text-white shadow-lg shadow-primary/25'
                                        : 'text-stone-600 hover:text-stone-400 hover:bg-white/5'
                                        }`}
                                >
                                    <StepIcon className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">{step.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Dashboard Toggle */}
                    <button
                        onClick={() => setShowDashboard(true)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-stone-800 text-stone-200 hover:bg-stone-700 transition-colors border border-white/5 shrink-0"
                    >
                        <Activity className="w-4 h-4" />
                        <span className="hidden sm:inline">Status</span>
                    </button>
                </div>
            </div>

            {/* Header & Filters */}
            <div className="px-4 py-4 border-b border-white/5 bg-gradient-to-r from-gray-950 to-gray-900">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {(currentStep > 0 || frameCategory || selectedBrand) && (
                            <button
                                onClick={handleBack}
                                className="p-2 -ml-2 text-stone-400 hover:text-primary transition-colors rounded-lg hover:bg-white/5"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                        )}
                        <h1 className="text-lg font-semibold text-stone-100">{currentStepInfo?.label}</h1>
                    </div>
                    <button
                        onClick={() => setShowIncompatible(!showIncompatible)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${showIncompatible
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            }`}
                    >
                        {showIncompatible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        <span className="hidden sm:inline">{showIncompatible ? 'Showing All' : 'Compatible Only'}</span>
                    </button>
                </div>

                {/* Brand Filter */}
                {uniqueBrands.length > 1 && !showCategorySelection && (
                    <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar">
                        <button
                            onClick={() => setSelectedBrand(null)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${!selectedBrand
                                ? 'bg-white text-black border-white'
                                : 'bg-transparent text-stone-400 border-stone-800 hover:border-stone-600'
                                }`}
                        >
                            All Brands
                        </button>
                        {uniqueBrands.map(brand => (
                            <button
                                key={brand}
                                onClick={() => setSelectedBrand(brand)}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${selectedBrand === brand
                                    ? 'bg-white text-black border-white'
                                    : 'bg-transparent text-stone-400 border-stone-800 hover:border-stone-600'
                                    }`}
                            >
                                {brand}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Content */}
            <div ref={scrollContainerRef} className="flex-1 overflow-y-auto pb-40 lg:pb-6">
                <div className="p-4 md:p-6">
                    <AnimatePresence mode="wait">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-64 gap-4">
                                <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                <p className="text-sm text-stone-500">Loading...</p>
                            </div>
                        ) : showCategorySelection ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {FRAME_CATEGORIES.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setFrameCategory(cat)}
                                        className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-primary/50 transition-all text-left group"
                                    >
                                        <h3 className="text-xl font-bold text-stone-100 group-hover:text-primary mb-2">{cat}</h3>
                                        <p className="text-sm text-stone-500">Select to see {cat} frames</p>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredComponents.map((comp) => (
                                    <PartCard
                                        key={comp.id}
                                        component={comp}
                                        isSelected={false} // Simplify for now
                                        onSelect={handleSelectPart}
                                    />
                                ))}
                                {filteredComponents.length === 0 && (
                                    <div className="col-span-full text-center py-12 text-stone-500">
                                        No compatible components found. Try showing incompatible parts.
                                    </div>
                                )}
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

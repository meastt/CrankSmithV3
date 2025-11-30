'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Component, validateComponent } from '@/lib/validation';
import { PartCard } from './PartCard';
import { useBuildStore } from '@/store/buildStore';
import { useSettingsStore } from '@/store/settingsStore';
import {
    Eye, EyeOff, ChevronLeft, ChevronRight, Check,
    Circle, Bike, CircleDot, Disc, Settings,
    Gauge, Cog, Layers, ArrowRight, HelpCircle, X,
    PartyPopper, Save, BarChart3, Home, RotateCcw, Share2
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllGearRatios, getSpeedRange, calculateClimbingIndex, parseCassetteRange } from '@/lib/gearCalculations';
import { calculateBuildWeight, formatWeight, getBikeCategory } from '@/lib/weightCalculations';

// Dynamically import ShareCard to reduce initial bundle size
const ShareCard = dynamic(() => import('./ShareCard').then(mod => ({ default: mod.ShareCard })), {
    ssr: false,
    loading: () => <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="animate-pulse text-stone-400">Loading...</div>
    </div>
});

// Build sequence - the logical order for building a bike
// Note: types must match database values (Crankset, RearDerailleur)
const BUILD_SEQUENCE = [
    { type: 'Frame', label: 'Frame', icon: Bike, description: 'Start with your foundation' },
    { type: 'Wheel', label: 'Wheels', icon: CircleDot, description: 'Choose your rolling stock' },
    { type: 'Tire', label: 'Tires', icon: Circle, description: 'Rubber meets road' },
    { type: 'BottomBracket', label: 'BB', icon: Disc, description: 'The heart of power transfer' },
    { type: 'Crankset', label: 'Crankset', icon: Settings, description: 'Your power input' },
    { type: 'Cassette', label: 'Cassette', icon: Cog, description: 'Gear range selection' },
    { type: 'RearDerailleur', label: 'Derailleur', icon: Layers, description: 'Shifting precision' },
    { type: 'Shifter', label: 'Shifter', icon: Gauge, description: 'Control at your fingertips' },
];

const FRAME_CATEGORIES = ['Road', 'Gravel', 'MTB'];

// Tire width categories by bike type
const TIRE_WIDTH_RANGES_BY_CATEGORY: Record<string, { id: string; label: string; subtitle: string; min: number; max: number }[]> = {
    Road: [
        { id: 'race', label: '23-25mm', subtitle: 'Race', min: 23, max: 25 },
        { id: 'standard', label: '26-28mm', subtitle: 'Standard', min: 26, max: 28 },
        { id: 'endurance', label: '30-32mm', subtitle: 'Endurance', min: 30, max: 32 },
    ],
    Gravel: [
        { id: 'fast', label: '35-40mm', subtitle: 'Fast gravel', min: 35, max: 40 },
        { id: 'allround', label: '40-45mm', subtitle: 'All-around', min: 40, max: 45 },
        { id: 'adventure', label: '45-50mm', subtitle: 'Adventure', min: 45, max: 50 },
        { id: 'monster', label: '50mm+', subtitle: 'Monster gravel', min: 50, max: 70 },
    ],
    MTB: [
        { id: 'xc', label: '2.0-2.25"', subtitle: 'XC Racing', min: 50, max: 57 },
        { id: 'trail', label: '2.3-2.4"', subtitle: 'Trail', min: 58, max: 61 },
        { id: 'enduro', label: '2.4-2.6"', subtitle: 'Enduro/AM', min: 61, max: 66 },
        { id: 'dh', label: '2.5"+', subtitle: 'DH/Gravity', min: 64, max: 999 },
    ],
};

// Wheel inner width categories by bike type
const WHEEL_WIDTH_RANGES_BY_CATEGORY: Record<string, { id: string; label: string; subtitle: string; min: number; max: number }[]> = {
    Road: [
        { id: 'aero', label: '17-19mm', subtitle: 'Aero/Race', min: 17, max: 19 },
        { id: 'standard', label: '19-21mm', subtitle: 'Standard', min: 19, max: 21 },
        { id: 'wide', label: '21-25mm', subtitle: 'Wide/Endurance', min: 21, max: 25 },
    ],
    Gravel: [
        { id: 'light', label: '21-24mm', subtitle: 'Light gravel', min: 21, max: 24 },
        { id: 'allround', label: '24-28mm', subtitle: 'All-around', min: 24, max: 28 },
        { id: 'wide', label: '28-32mm', subtitle: 'Wide/Adventure', min: 28, max: 32 },
    ],
    MTB: [
        { id: 'xc', label: '25-28mm', subtitle: 'XC', min: 25, max: 28 },
        { id: 'trail', label: '28-32mm', subtitle: 'Trail', min: 28, max: 32 },
        { id: 'enduro', label: '32-35mm', subtitle: 'Enduro', min: 32, max: 35 },
        { id: 'dh', label: '35mm+', subtitle: 'DH/Plus', min: 35, max: 999 },
    ],
};

// Freehub types for cassette filtering
const FREEHUB_OPTIONS = [
    { id: 'shimano', label: 'Shimano HG', subtitle: '11s road / 11-12s MTB', patterns: ['shimano', 'hg'] },
    { id: 'sram-xdr', label: 'SRAM XDR', subtitle: '12s road', patterns: ['xdr'] },
    { id: 'sram-xd', label: 'SRAM XD', subtitle: '12s MTB', patterns: ['xd'] },
    { id: 'campagnolo', label: 'Campagnolo', subtitle: 'N3W / older', patterns: ['campagnolo', 'n3w', 'campy'] },
];

export const PartSelector: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [frameCategory, setFrameCategory] = useState<string | null>(null);
    const [components, setComponents] = useState<Component[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showIncompatible, setShowIncompatible] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
    const [crankConfiguration, setCrankConfiguration] = useState<'1x' | '2x' | null>(null);
    const [selectedTireWidth, setSelectedTireWidth] = useState<string | null>(null);
    const [selectedWheelWidth, setSelectedWheelWidth] = useState<string | null>(null);
    const [selectedFreehub, setSelectedFreehub] = useState<string | null>(null);
    const [showFreehubGuide, setShowFreehubGuide] = useState(false);
    const [showBuildComplete, setShowBuildComplete] = useState(false);
    const [showShareCard, setShowShareCard] = useState(false);
    const [savingBuild, setSavingBuild] = useState(false);
    const [electronicFilter, setElectronicFilter] = useState<boolean | null>(null); // null = all, true = electronic, false = mechanical
    const [drivetrainBrandFilter, setDrivetrainBrandFilter] = useState<string | null>(null);
    const [frameMaterialFilter, setFrameMaterialFilter] = useState<string | null>(null); // null = all, 'Carbon', 'Aluminum'
    const [frameMtbTypeFilter, setFrameMtbTypeFilter] = useState<string | null>(null); // null = all, 'XC', 'Trail', 'Enduro'
    const { parts, setPart, clearBuild } = useBuildStore();
    const { unitSystem } = useSettingsStore();
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const searchParams = useSearchParams();

    // Check if build is complete (all parts selected)
    const isBuildComplete = BUILD_SEQUENCE.every(step => parts[step.type] !== null);

    // Calculate total weight with finishing kit estimates
    const weightData = calculateBuildWeight(parts);
    const bikeCategory = getBikeCategory(parts.Frame);
    const weightFormatted = formatWeight(weightData.totalWeight, unitSystem);

    const activeType = BUILD_SEQUENCE[currentStep]?.type || 'Frame';

    // Clear build when starting fresh (from homepage with ?new=true)
    useEffect(() => {
        if (searchParams.get('new') === 'true') {
            clearBuild();
            setCurrentStep(0);
            setFrameCategory(null);
            // Remove the ?new param from URL without navigation
            window.history.replaceState({}, '', '/builder');
        }
    }, [searchParams, clearBuild]);

    // Reset filters when changing steps
    const resetFilters = useCallback(() => {
        setSelectedBrand(null);
        setCrankConfiguration(null);
        setSelectedTireWidth(null);
        setSelectedWheelWidth(null);
        setSelectedFreehub(null);
        setElectronicFilter(null);
        setDrivetrainBrandFilter(null);
        setFrameMaterialFilter(null);
        setFrameMtbTypeFilter(null);
    }, []);

    // Scroll to top when step changes
    const scrollToTop = useCallback((immediate = false) => {
        scrollContainerRef.current?.scrollTo({
            top: 0,
            behavior: immediate ? 'instant' : 'smooth'
        });
    }, []);

    // Scroll to top whenever currentStep changes - use multiple methods for reliability
    useEffect(() => {
        // Immediate scroll
        scrollToTop(true);

        // Also scroll the window in case the container isn't the scrolling element
        window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });

        // Delayed scroll to handle any async rendering
        const timer = setTimeout(() => {
            scrollToTop(true);
            window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
        }, 50);

        return () => clearTimeout(timer);
    }, [currentStep, scrollToTop]);

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
                // Scroll after loading - use multiple methods and timing
                scrollToTop(true);
                window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
                setTimeout(() => {
                    scrollToTop(true);
                    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
                }, 100);
            });
    }, [activeType, resetFilters, scrollToTop]);

    // Show build complete modal when all parts are selected
    useEffect(() => {
        if (isBuildComplete && currentStep === BUILD_SEQUENCE.length - 1) {
            // Small delay so the user sees their selection before the modal
            const timer = setTimeout(() => {
                setShowBuildComplete(true);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [isBuildComplete, currentStep]);

    // Save build function
    const handleSaveBuild = async () => {
        const name = window.prompt('Name your build:');
        if (!name) return;

        setSavingBuild(true);
        try {
            const res = await fetch('/api/builds', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, parts }),
            });

            if (res.ok) {
                setShowBuildComplete(false);
                router.push('/garage');
            } else {
                if (res.status === 401) {
                    alert('Please sign in to save builds.');
                } else {
                    const errorText = await res.text();
                    console.error('Save failed:', errorText);
                    alert('Failed to save build. Please try again.');
                }
            }
        } catch (err) {
            console.error('Save error:', err);
            alert('An error occurred while saving.');
        } finally {
            setSavingBuild(false);
        }
    };

    // Reset build function
    const handleResetBuild = () => {
        BUILD_SEQUENCE.forEach(step => {
            useBuildStore.getState().removePart(step.type);
        });
        setCurrentStep(0);
        setFrameCategory(null);
        resetFilters();
        setShowBuildComplete(false);
    };

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

    // Compatibility checking using the master validation function
    const isCompatible = (component: Component): boolean => {
        // Frame is always compatible (first step, no dependencies)
        if (activeType === 'Frame') return true;

        // If no parts selected yet, everything is compatible
        if (Object.keys(parts).length === 0) return true;

        // Filter out null parts for validation
        const currentBuild: Record<string, Component> = {};
        for (const [key, value] of Object.entries(parts)) {
            if (value !== null) {
                currentBuild[key] = value;
            }
        }

        // If no valid parts in build, everything is compatible
        if (Object.keys(currentBuild).length === 0) return true;

        // Use the master validateComponent function
        const result = validateComponent(activeType, component, currentBuild);
        return result.compatible;
    };

    // Helper functions
    const getBrand = (name: string) => {
        if (name.startsWith('Santa Cruz')) return 'Santa Cruz';
        if (name.startsWith('S-Works')) return 'Specialized';
        const firstWord = name.split(' ')[0];
        // Normalize Cervélo variants (with/without accent)
        if (firstWord.toLowerCase().startsWith('cerv') && firstWord.toLowerCase().includes('lo')) {
            return 'Cervelo';
        }
        return firstWord;
    };

    // Get the tire/wheel width ranges based on selected frame category
    const tireWidthRanges = TIRE_WIDTH_RANGES_BY_CATEGORY[frameCategory || 'Gravel'] || TIRE_WIDTH_RANGES_BY_CATEGORY.Gravel;
    const wheelWidthRanges = WHEEL_WIDTH_RANGES_BY_CATEGORY[frameCategory || 'Gravel'] || WHEEL_WIDTH_RANGES_BY_CATEGORY.Gravel;

    const is1x = (component: Component) => {
        const teeth = component.attributes.teeth;
        return typeof teeth === 'string' && !teeth.includes('/');
    };

    // Get unique filter values (only for brand/crank config - compatibility handles the rest)
    const uniqueBrands = Array.from(new Set(components.map(c => getBrand(c.name)))).sort();

    // Apply filters - smart compatibility filtering first, then optional user filters
    let filteredComponents = components;

    // 1. Frame category filter (user choice)
    if (activeType === 'Frame' && frameCategory) {
        filteredComponents = filteredComponents.filter(c => c.attributes.category === frameCategory);
    }

    // 2. Smart compatibility filtering - auto-filters based on current build
    if (!showIncompatible) {
        filteredComponents = filteredComponents.filter(c => isCompatible(c));
    }

    // 3. Optional brand filter (user refinement)
    if (selectedBrand) {
        filteredComponents = filteredComponents.filter(c => getBrand(c.name) === selectedBrand);
    }

    // 4. Crank configuration filter (user preference)
    if (activeType === 'Crankset' && crankConfiguration) {
        filteredComponents = filteredComponents.filter(c => {
            const isSingle = is1x(c);
            return crankConfiguration === '1x' ? isSingle : !isSingle;
        });
    }

    // 5. Tire width filter (user preference)
    if (activeType === 'Tire' && selectedTireWidth) {
        const range = tireWidthRanges.find(r => r.id === selectedTireWidth);
        if (range) {
            filteredComponents = filteredComponents.filter(c => {
                const width = c.interfaces?.width || c.attributes?.width;
                if (!width) return true;
                const w = Number(width);
                return w >= range.min && w <= range.max;
            });
        }
    }

    // 6. Wheel inner width filter (user preference)
    if (activeType === 'Wheel' && selectedWheelWidth) {
        const range = wheelWidthRanges.find(r => r.id === selectedWheelWidth);
        if (range) {
            filteredComponents = filteredComponents.filter(c => {
                const width = c.attributes?.internal_width || c.attributes?.inner_width;
                if (!width) return true;
                const w = Number(width);
                return w >= range.min && w <= range.max;
            });
        }
    }

    // 7. Freehub filter for cassettes (user selection based on their wheel)
    if (activeType === 'Cassette' && selectedFreehub) {
        const option = FREEHUB_OPTIONS.find(o => o.id === selectedFreehub);
        if (option) {
            filteredComponents = filteredComponents.filter(c => {
                const freehub = c.interfaces?.freehub_mount || c.interfaces?.freehub || '';
                const freehubLower = String(freehub).toLowerCase();
                return option.patterns.some(p => freehubLower.includes(p));
            });
        }
    }

    // 8. Electronic/Mechanical filter for shifters and derailleurs
    if ((activeType === 'Shifter' || activeType === 'RearDerailleur') && electronicFilter !== null) {
        filteredComponents = filteredComponents.filter(c => {
            const isElectronic = c.attributes?.electronic === true;
            return electronicFilter ? isElectronic : !isElectronic;
        });
    }

    // 9. Drivetrain brand filter for shifters and derailleurs
    if ((activeType === 'Shifter' || activeType === 'RearDerailleur') && drivetrainBrandFilter) {
        filteredComponents = filteredComponents.filter(c => getBrand(c.name) === drivetrainBrandFilter);
    }

    // 10. Frame material filter (Carbon vs Aluminum)
    if (activeType === 'Frame' && frameCategory && frameMaterialFilter) {
        filteredComponents = filteredComponents.filter(c => {
            const material = c.attributes?.material || '';
            return material.toLowerCase().includes(frameMaterialFilter.toLowerCase());
        });
    }

    // 11. MTB subcategory filter (XC, Trail, Enduro)
    if (activeType === 'Frame' && frameCategory === 'MTB' && frameMtbTypeFilter) {
        filteredComponents = filteredComponents.filter(c => {
            const subcategory = c.attributes?.subcategory || '';
            return subcategory.toLowerCase() === frameMtbTypeFilter.toLowerCase();
        });
    }

    // Get available drivetrain brands (for shifters/derailleurs)
    const drivetrainBrands = (activeType === 'Shifter' || activeType === 'RearDerailleur')
        ? Array.from(new Set(components.filter(c => isCompatible(c)).map(c => getBrand(c.name)))).sort()
        : [];

    // Check if electronic/mechanical options exist for shifters/derailleurs
    const hasElectronicOptions = (activeType === 'Shifter' || activeType === 'RearDerailleur')
        ? components.filter(c => isCompatible(c)).some(c => c.attributes?.electronic === true)
        : false;
    const hasMechanicalOptions = (activeType === 'Shifter' || activeType === 'RearDerailleur')
        ? components.filter(c => isCompatible(c)).some(c => c.attributes?.electronic !== true)
        : false;

    // Get available frame materials for current category
    const frameMaterials = (activeType === 'Frame' && frameCategory)
        ? Array.from(new Set(
            components
                .filter(c => c.attributes.category === frameCategory)
                .map(c => {
                    const mat = String(c.attributes?.material || '').toLowerCase();
                    if (mat.includes('carbon')) return 'Carbon';
                    if (mat.includes('alum') || mat.includes('alloy')) return 'Aluminum';
                    return null;
                })
                .filter(Boolean)
        )).sort() as string[]
        : [];

    // Get available MTB subcategories
    const mtbSubcategories = (activeType === 'Frame' && frameCategory === 'MTB')
        ? Array.from(new Set(
            components
                .filter(c => c.attributes.category === 'MTB')
                .map(c => c.attributes?.subcategory as string)
                .filter(Boolean)
        )).sort()
        : [];

    // Should show frame filters (material or MTB type)?
    const showFrameFilters = activeType === 'Frame' && frameCategory && (frameMaterials.length > 1 || mtbSubcategories.length > 1);

    // Get available tire width ranges based on compatible tires
    const availableTireRanges = activeType === 'Tire'
        ? tireWidthRanges.filter(range => {
            return filteredComponents.some(c => {
                const width = c.interfaces?.width || c.attributes?.width;
                if (!width) return false;
                const w = Number(width);
                return w >= range.min && w <= range.max;
            });
        })
        : [];

    // Get available wheel width ranges
    const availableWheelWidths = activeType === 'Wheel'
        ? wheelWidthRanges.filter(range => {
            return filteredComponents.some(c => {
                const width = c.attributes?.internal_width || c.attributes?.inner_width;
                if (!width) return false;
                const w = Number(width);
                return w >= range.min && w <= range.max;
            });
        })
        : [];

    // Get available freehub options based on selected wheel and cassettes
    const availableFreehubs = activeType === 'Cassette'
        ? FREEHUB_OPTIONS.filter(option => {
            // Check if wheel supports this freehub
            const wheelFreehub = parts.Wheel?.interfaces?.freehub;
            const wheelSupports = !wheelFreehub || (Array.isArray(wheelFreehub)
                ? wheelFreehub.some((f: string) => option.patterns.some(p => f.toLowerCase().includes(p)))
                : option.patterns.some(p => String(wheelFreehub).toLowerCase().includes(p)));

            if (!wheelSupports) return false;

            // Check if any cassettes match this freehub
            return filteredComponents.some(c => {
                const freehub = c.interfaces?.freehub_mount || c.interfaces?.freehub || '';
                const freehubLower = String(freehub).toLowerCase();
                return option.patterns.some(p => freehubLower.includes(p));
            });
        })
        : [];

    // Determine what selection UI to show - simplified to only meaningful choices
    // Only Gravel needs tire/wheel width filters due to its wide range of options
    // Road and MTB have more predictable sizing, so skip straight to component selection
    const showCategorySelection = activeType === 'Frame' && !frameCategory;
    const showTireWidthSelection = activeType === 'Tire' && !selectedTireWidth && availableTireRanges.length > 1 && frameCategory === 'Gravel';
    const showWheelWidthSelection = activeType === 'Wheel' && !selectedWheelWidth && availableWheelWidths.length > 1 && frameCategory === 'Gravel';
    const showFreehubSelection = activeType === 'Cassette' && !selectedFreehub && availableFreehubs.length > 1;
    const showBrandSelection = !selectedBrand &&
        ['Frame', 'Tire', 'Crankset', 'Wheel'].includes(activeType) &&
        !(activeType === 'Frame' && !frameCategory) &&
        !(activeType === 'Tire' && !selectedTireWidth && availableTireRanges.length > 1) &&
        !(activeType === 'Wheel' && !selectedWheelWidth && availableWheelWidths.length > 1) &&
        !(activeType === 'Cassette' && !selectedFreehub && availableFreehubs.length > 1) &&
        filteredComponents.length > 6 && // Only show brand filter if there are many options
        uniqueBrands.length > 1;
    const showCrankConfigSelection = activeType === 'Crankset' && selectedBrand && !crankConfiguration;

    // Handle back navigation
    const handleBack = () => {
        if (activeType === 'Crankset' && crankConfiguration) {
            setCrankConfiguration(null);
        } else if (selectedBrand) {
            setSelectedBrand(null);
        } else if (selectedFreehub) {
            setSelectedFreehub(null);
        } else if (selectedWheelWidth) {
            setSelectedWheelWidth(null);
        } else if (selectedTireWidth) {
            setSelectedTireWidth(null);
        } else if (frameCategory) {
            setFrameCategory(null);
        } else if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    // Breadcrumbs
    const breadcrumbs: string[] = [];
    if (frameCategory) breadcrumbs.push(frameCategory);
    if (selectedWheelWidth) {
        const range = wheelWidthRanges.find(r => r.id === selectedWheelWidth);
        if (range) breadcrumbs.push(range.label);
    }
    if (selectedTireWidth) {
        const range = tireWidthRanges.find(r => r.id === selectedTireWidth);
        if (range) breadcrumbs.push(range.label);
    }
    if (selectedFreehub) {
        const option = FREEHUB_OPTIONS.find(o => o.id === selectedFreehub);
        if (option) breadcrumbs.push(option.label);
    }
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
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap shrink-0 ${isCurrent
                                    ? 'bg-primary text-white shadow-lg shadow-primary/25'
                                    : isComplete
                                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                                        : isPast
                                            ? 'bg-white/5 text-stone-400'
                                            : 'text-stone-600 hover:text-stone-400 hover:bg-white/5'
                                    }`}
                            >
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${isComplete && !isCurrent ? 'bg-emerald-500/20' : ''
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
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${showIncompatible
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
            <div ref={scrollContainerRef} className="flex-1 overflow-y-auto pb-28 lg:pb-6">
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
                                })).filter(item => item.count > 0)}
                                onSelect={(id) => setFrameCategory(id)}
                                columns={3}
                            />
                        ) : showTireWidthSelection ? (
                            <SelectionGrid
                                key="tirewidth"
                                title="Select Tire Width"
                                subtitle="Choose your preferred tire size range"
                                items={availableTireRanges.map(range => {
                                    const count = filteredComponents.filter(c => {
                                        const width = c.interfaces?.width || c.attributes?.width;
                                        if (!width) return false;
                                        const w = Number(width);
                                        return w >= range.min && w <= range.max;
                                    }).length;
                                    return {
                                        id: range.id,
                                        title: range.label,
                                        subtitle: range.subtitle,
                                        count,
                                        countLabel: 'tires'
                                    };
                                }).filter(item => item.count > 0)}
                                onSelect={(id) => setSelectedTireWidth(id)}
                                columns={availableTireRanges.length <= 3 ? availableTireRanges.length as 2 | 3 : 3}
                            />
                        ) : showWheelWidthSelection ? (
                            <SelectionGrid
                                key="wheelwidth"
                                title="Select Inner Width"
                                subtitle="Wider rims = better tire support for wider tires"
                                items={availableWheelWidths.map(range => {
                                    const count = filteredComponents.filter(c => {
                                        const width = c.attributes?.internal_width || c.attributes?.inner_width;
                                        if (!width) return false;
                                        const w = Number(width);
                                        return w >= range.min && w <= range.max;
                                    }).length;
                                    return {
                                        id: range.id,
                                        title: range.label,
                                        subtitle: range.subtitle,
                                        count,
                                        countLabel: 'wheels'
                                    };
                                }).filter(item => item.count > 0)}
                                onSelect={(id) => setSelectedWheelWidth(id)}
                                columns={availableWheelWidths.length <= 4 ? availableWheelWidths.length as 2 | 3 | 4 : 4}
                            />
                        ) : showFreehubSelection ? (
                            <SelectionGrid
                                key="freehub"
                                title="Select Your Freehub"
                                subtitle="Match your wheel's freehub body"
                                helpAction={() => setShowFreehubGuide(true)}
                                helpText="I don't know what freehub I have"
                                items={availableFreehubs.map(option => {
                                    const count = filteredComponents.filter(c => {
                                        const freehub = c.interfaces?.freehub_mount || c.interfaces?.freehub || '';
                                        const freehubLower = String(freehub).toLowerCase();
                                        return option.patterns.some(p => freehubLower.includes(p));
                                    }).length;
                                    return {
                                        id: option.id,
                                        title: option.label,
                                        subtitle: option.subtitle,
                                        count,
                                        countLabel: 'cassettes'
                                    };
                                }).filter(item => item.count > 0)}
                                onSelect={(id) => setSelectedFreehub(id)}
                                columns={availableFreehubs.length <= 4 ? availableFreehubs.length as 2 | 3 | 4 : 2}
                            />
                        ) : showBrandSelection ? (
                            <SelectionGrid
                                key="brand"
                                title="Choose Brand"
                                subtitle="Filter by manufacturer"
                                items={uniqueBrands
                                    .map(brand => ({
                                        id: brand,
                                        title: brand,
                                        count: filteredComponents.filter(c => getBrand(c.name) === brand).length,
                                        countLabel: 'models'
                                    }))
                                    .filter(item => item.count > 0)}
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
                                ].filter(item => item.count > 0)}
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
                            >
                                {/* Filter Chips for Shifters and Derailleurs */}
                                {(activeType === 'Shifter' || activeType === 'RearDerailleur') && (drivetrainBrands.length > 1 || (hasElectronicOptions && hasMechanicalOptions)) && (
                                    <div className="mb-4 flex flex-wrap gap-2">
                                        {/* Electronic/Mechanical Toggle */}
                                        {hasElectronicOptions && hasMechanicalOptions && (
                                            <div className="flex gap-1 p-1 bg-white/5 rounded-lg">
                                                <button
                                                    onClick={() => setElectronicFilter(null)}
                                                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${electronicFilter === null
                                                        ? 'bg-primary text-white'
                                                        : 'text-stone-400 hover:text-stone-200'
                                                        }`}
                                                >
                                                    All
                                                </button>
                                                <button
                                                    onClick={() => setElectronicFilter(true)}
                                                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${electronicFilter === true
                                                        ? 'bg-cyan-500 text-white'
                                                        : 'text-stone-400 hover:text-stone-200'
                                                        }`}
                                                >
                                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                    </svg>
                                                    Electronic
                                                </button>
                                                <button
                                                    onClick={() => setElectronicFilter(false)}
                                                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${electronicFilter === false
                                                        ? 'bg-amber-500 text-white'
                                                        : 'text-stone-400 hover:text-stone-200'
                                                        }`}
                                                >
                                                    <Settings className="w-3 h-3" />
                                                    Mechanical
                                                </button>
                                            </div>
                                        )}

                                        {/* Brand Filter Pills */}
                                        {drivetrainBrands.length > 1 && (
                                            <div className="flex gap-1 flex-wrap">
                                                {drivetrainBrands.map(brand => (
                                                    <button
                                                        key={brand}
                                                        onClick={() => setDrivetrainBrandFilter(drivetrainBrandFilter === brand ? null : brand)}
                                                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${drivetrainBrandFilter === brand
                                                            ? 'bg-primary text-white'
                                                            : 'bg-white/5 text-stone-400 hover:text-stone-200 hover:bg-white/10'
                                                            }`}
                                                    >
                                                        {brand}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Filter Chips for Frames */}
                                {showFrameFilters && (
                                    <div className="mb-4 flex flex-wrap gap-2">
                                        {/* Material Toggle (Carbon / Aluminum) */}
                                        {frameMaterials.length > 1 && (
                                            <div className="flex gap-1 p-1 bg-white/5 rounded-lg">
                                                <button
                                                    onClick={() => setFrameMaterialFilter(null)}
                                                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${frameMaterialFilter === null
                                                        ? 'bg-primary text-white'
                                                        : 'text-stone-400 hover:text-stone-200'
                                                        }`}
                                                >
                                                    All
                                                </button>
                                                {frameMaterials.includes('Carbon') && (
                                                    <button
                                                        onClick={() => setFrameMaterialFilter(frameMaterialFilter === 'Carbon' ? null : 'Carbon')}
                                                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${frameMaterialFilter === 'Carbon'
                                                            ? 'bg-violet-500 text-white'
                                                            : 'text-stone-400 hover:text-stone-200'
                                                            }`}
                                                    >
                                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                                        </svg>
                                                        Carbon
                                                    </button>
                                                )}
                                                {frameMaterials.includes('Aluminum') && (
                                                    <button
                                                        onClick={() => setFrameMaterialFilter(frameMaterialFilter === 'Aluminum' ? null : 'Aluminum')}
                                                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${frameMaterialFilter === 'Aluminum'
                                                            ? 'bg-amber-500 text-white'
                                                            : 'text-stone-400 hover:text-stone-200'
                                                            }`}
                                                    >
                                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                        </svg>
                                                        Aluminum
                                                    </button>
                                                )}
                                            </div>
                                        )}

                                        {/* MTB Type Filter (XC, Trail, Enduro) */}
                                        {frameCategory === 'MTB' && mtbSubcategories.length > 1 && (
                                            <div className="flex gap-1 flex-wrap">
                                                {mtbSubcategories.map(subcat => (
                                                    <button
                                                        key={subcat}
                                                        onClick={() => setFrameMtbTypeFilter(frameMtbTypeFilter === subcat ? null : subcat)}
                                                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${frameMtbTypeFilter === subcat
                                                            ? 'bg-emerald-500 text-white'
                                                            : 'bg-white/5 text-stone-400 hover:text-stone-200 hover:bg-white/10'
                                                            }`}
                                                    >
                                                        {subcat}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Parts Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
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
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Freehub Guide Modal - Mobile-first */}
            <AnimatePresence>
                {showFreehubGuide && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm"
                        onClick={() => setShowFreehubGuide(false)}
                    >
                        <motion.div
                            initial={{ y: '100%', opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: '100%', opacity: 0 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="relative w-full sm:max-w-lg sm:mx-4 bg-gray-900 rounded-t-2xl sm:rounded-2xl overflow-hidden border-t sm:border border-white/10 shadow-2xl max-h-[90vh] flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Drag handle for mobile */}
                            <div className="sm:hidden flex justify-center pt-3 pb-1">
                                <div className="w-10 h-1 rounded-full bg-white/20" />
                            </div>

                            {/* Header */}
                            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                                <h3 className="text-lg font-semibold text-stone-100">Freehub Guide</h3>
                                <button
                                    onClick={() => setShowFreehubGuide(false)}
                                    className="p-2 -mr-2 text-stone-400 hover:text-white transition-colors rounded-lg hover:bg-white/10"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Image - scrollable on small screens */}
                            <div className="flex-1 overflow-auto">
                                <div className="relative w-full aspect-[4/3]">
                                    <Image
                                        src="/images/freehub-guide.jpeg"
                                        alt="Freehub identification guide showing Shimano HG, SRAM XDR, SRAM XD, and Campagnolo freehub bodies"
                                        fill
                                        className="object-contain"
                                        priority
                                    />
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="p-4 border-t border-white/10 bg-gray-950/50">
                                <p className="text-xs sm:text-sm text-stone-400 text-center">
                                    Still unsure? Check your wheel&apos;s product page or hub documentation.
                                </p>
                                <button
                                    onClick={() => setShowFreehubGuide(false)}
                                    className="mt-3 w-full py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 transition-colors sm:hidden"
                                >
                                    Got it
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Build Complete Modal */}
            <AnimatePresence>
                {showBuildComplete && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                        onClick={() => setShowBuildComplete(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="relative w-full max-w-md bg-gray-900 rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Success Header */}
                            <div className="pt-8 pb-4 px-6 text-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.1, type: 'spring', damping: 15 }}
                                    className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-primary mx-auto flex items-center justify-center mb-4"
                                >
                                    <PartyPopper className="w-10 h-10 text-white" />
                                </motion.div>
                                <motion.h2
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-2xl font-bold text-stone-100 mb-2"
                                >
                                    Build Complete!
                                </motion.h2>
                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-stone-400 text-sm"
                                >
                                    You&apos;ve selected all {BUILD_SEQUENCE.length} components
                                    {weightData.totalWeight > 0 && (
                                        <span className="block mt-1">
                                            <span className="text-stone-300 font-medium">
                                                Est. weight: {weightFormatted.value} {weightFormatted.unit}
                                            </span>
                                            <span className="block text-[10px] text-stone-500 mt-0.5">
                                                Includes {bikeCategory} finishing kit estimate
                                            </span>
                                        </span>
                                    )}
                                </motion.p>
                            </div>

                            {/* Next Steps */}
                            <div className="px-6 pb-6">
                                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">
                                    What&apos;s next?
                                </p>
                                <div className="space-y-2">
                                    <button
                                        onClick={handleSaveBuild}
                                        disabled={savingBuild}
                                        className="w-full flex items-center gap-3 p-4 rounded-xl bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-colors text-left group"
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                                            <Save className="w-5 h-5 text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-stone-100">Save to Garage</p>
                                            <p className="text-xs text-stone-500">Keep this build for later</p>
                                        </div>
                                        <ArrowRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </button>

                                    <button
                                        onClick={() => {
                                            setShowBuildComplete(false);
                                            setShowShareCard(true);
                                        }}
                                        className="w-full flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-pink-500/10 to-violet-500/10 border border-pink-500/20 hover:from-pink-500/20 hover:to-violet-500/20 transition-colors text-left group"
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500/30 to-violet-500/30 flex items-center justify-center shrink-0">
                                            <Share2 className="w-5 h-5 text-pink-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-stone-100">Share Your Build</p>
                                            <p className="text-xs text-stone-400">Create a shareable card</p>
                                        </div>
                                        <ArrowRight className="w-5 h-5 text-pink-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </button>

                                    <button
                                        onClick={() => {
                                            setShowBuildComplete(false);

                                            // Extract build data
                                            const crank = parts.Crankset;
                                            const cassette = parts.Cassette;
                                            const tire = parts.Tire;
                                            const wheel = parts.Wheel;

                                            if (!crank || !cassette) {
                                                router.push('/performance');
                                                return;
                                            }

                                            // Chainrings
                                            let chainringsStr = '';
                                            if (crank.attributes.chainring_large) {
                                                chainringsStr = `${crank.attributes.chainring_large}`;
                                                if (crank.attributes.chainring_small) {
                                                    chainringsStr += `,${crank.attributes.chainring_small}`;
                                                }
                                            } else if (crank.attributes.teeth) {
                                                chainringsStr = String(crank.attributes.teeth).replace('/', ',');
                                            }

                                            // Cassette Range
                                            let cassetteRange = '';
                                            if (cassette.attributes.range) {
                                                cassetteRange = String(cassette.attributes.range);
                                            } else if (cassette.attributes.largest_cog && cassette.attributes.diff) {
                                                const largest = Number(cassette.attributes.largest_cog);
                                                const diff = Number(cassette.attributes.diff);
                                                cassetteRange = `${largest - diff}-${largest}`;
                                            }

                                            // Tire Width
                                            let tireWidth = '28';
                                            if (tire) {
                                                tireWidth = String(tire.attributes.width || tire.interfaces?.width || '28');
                                            }

                                            // Wheel Size
                                            let wheelSize = '622';
                                            if (wheel) {
                                                const name = String(wheel.name).toLowerCase();
                                                const size = String(wheel.attributes?.size || '').toLowerCase();
                                                if (name.includes('650') || size.includes('650') || size.includes('27.5')) {
                                                    wheelSize = '584';
                                                }
                                            }

                                            const params = new URLSearchParams({
                                                mode: 'build',
                                                chainrings: chainringsStr,
                                                cassette: cassetteRange,
                                                tire: tireWidth,
                                                wheel: wheelSize
                                            });

                                            router.push(`/performance?${params.toString()}`);
                                        }}
                                        className="w-full flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-violet-500/10 to-cyan-500/10 border border-violet-500/20 hover:from-violet-500/20 hover:to-cyan-500/20 transition-colors text-left group"
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500/30 to-cyan-500/30 flex items-center justify-center shrink-0">
                                            <BarChart3 className="w-5 h-5 text-cyan-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-stone-100">Analyze Performance</p>
                                            <p className="text-xs text-stone-400">Gear ratios, speed charts & more</p>
                                        </div>
                                        <ArrowRight className="w-5 h-5 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </button>

                                    <button
                                        onClick={handleResetBuild}
                                        className="w-full flex items-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-colors text-left group"
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                                            <RotateCcw className="w-5 h-5 text-stone-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-stone-100">Start New Build</p>
                                            <p className="text-xs text-stone-500">Clear & begin fresh</p>
                                        </div>
                                        <ArrowRight className="w-5 h-5 text-stone-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </button>

                                    <button
                                        onClick={() => router.push('/')}
                                        className="w-full flex items-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-colors text-left group"
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                                            <Home className="w-5 h-5 text-stone-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-stone-100">Go Home</p>
                                            <p className="text-xs text-stone-500">Back to homepage</p>
                                        </div>
                                        <ArrowRight className="w-5 h-5 text-stone-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </button>
                                </div>
                            </div>

                            {/* Close button */}
                            <button
                                onClick={() => setShowBuildComplete(false)}
                                className="absolute top-4 right-4 p-2 text-stone-400 hover:text-white transition-colors rounded-lg hover:bg-white/10"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Share Card Modal */}
            <AnimatePresence>
                {showShareCard && parts.Frame && (() => {
                    // Calculate data for share card
                    const crank = parts.Crankset;
                    const cassette = parts.Cassette;

                    // Parse chainrings
                    let chainrings: number[] = [];
                    if (crank) {
                        const large = crank.attributes.chainring_large as number;
                        const small = crank.attributes.chainring_small as number;
                        if (large) {
                            if (small && small !== 0) chainrings = [large, small];
                            else chainrings = [large];
                        } else {
                            const teeth = crank.attributes.teeth as string;
                            if (teeth && typeof teeth === 'string') {
                                if (teeth.includes('/')) {
                                    chainrings = teeth.split('/').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
                                } else {
                                    const single = parseInt(teeth, 10);
                                    if (!isNaN(single)) chainrings = [single];
                                }
                            }
                        }
                    }

                    // Parse cassette cogs
                    let cassetteCogs: number[] = [];
                    if (cassette) {
                        const largest = cassette.attributes.largest_cog as number;
                        const diff = cassette.attributes.diff as number;
                        if (largest && diff) {
                            cassetteCogs = parseCassetteRange(largest, largest - diff);
                        } else {
                            const range = cassette.attributes.range as string;
                            if (range && typeof range === 'string') {
                                const match = range.match(/(\d+)-(\d+)/);
                                if (match) {
                                    const smallest = parseInt(match[1], 10);
                                    const largestCog = parseInt(match[2], 10);
                                    if (!isNaN(smallest) && !isNaN(largestCog)) {
                                        cassetteCogs = parseCassetteRange(largestCog, smallest);
                                    }
                                }
                            }
                        }
                    }

                    // Calculate metrics
                    const gears = chainrings.length > 0 && cassetteCogs.length > 0
                        ? getAllGearRatios(chainrings, cassetteCogs)
                        : [];
                    const speedRange = chainrings.length > 0 && cassetteCogs.length > 0
                        ? getSpeedRange(chainrings, cassetteCogs, 90)
                        : undefined;
                    const climbingScore = gears.length > 0
                        ? Math.min(calculateClimbingIndex(gears[0].ratio) * 100, 100)
                        : 0;

                    return (
                        <ShareCard
                            isModal={true}
                            frameName={parts.Frame.name}
                            parts={parts}
                            chainrings={chainrings}
                            cassetteCogs={cassetteCogs}
                            totalWeight={weightData.totalWeight}
                            climbingScore={climbingScore}
                            speedRange={speedRange}
                            unitSystem={unitSystem}
                            onClose={() => setShowShareCard(false)}
                        />
                    );
                })()}
            </AnimatePresence>
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
    helpAction?: () => void;
    helpText?: string;
    items: SelectionItem[];
    onSelect: (id: string) => void;
    columns?: 2 | 3 | 4;
    showCount?: boolean;
}

const SelectionGrid: React.FC<SelectionGridProps> = ({
    title,
    subtitle,
    helpAction,
    helpText,
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
                {helpAction && helpText && (
                    <button
                        onClick={helpAction}
                        className="mt-2 inline-flex items-center gap-1.5 text-sm text-stone-400 hover:text-primary transition-colors"
                    >
                        <HelpCircle className="w-4 h-4" />
                        {helpText}
                    </button>
                )}
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

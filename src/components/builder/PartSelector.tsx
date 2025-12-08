'use client';

import { BuildDashboard } from './BuildDashboard';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Validator } from '@/lib/validation';
import { PartCard } from './PartCard';
import { ShareCard } from './ShareCard';
import { BuildSummary } from './BuildSummary';
import { useBuildStore, AnyComponent } from '@/store/buildStore';
import { useClerk, useUser } from '@clerk/nextjs';
import { useSettingsStore } from '@/store/settingsStore';
import { FreehubSelector } from './FreehubSelector';
import { ForkChoiceModal } from './ForkChoiceModal';
import { InfoBox, BUILD_STEP_INFO } from './InfoBox';
import {
    Eye, EyeOff, ChevronLeft, ChevronRight, Check,
    Circle, Bike, CircleDot, Disc, Settings,
    Gauge, Cog, Layers, ArrowRight, Activity, Info, AlertTriangle, Save, Loader2,
    GitBranch, X
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FrameType } from '@/constants/standards';

// Build sequence - the logical order for building a bike
const BUILD_SEQUENCE = [
    { type: 'Frame', label: 'Frame', icon: Bike, description: 'Start with your foundation' },
    { type: 'Fork', label: 'Fork', icon: GitBranch, description: 'Steering and front suspension' },
    { type: 'Wheel', label: 'Wheels', icon: CircleDot, description: 'Choose your rolling stock' },
    { type: 'Tire', label: 'Tires', icon: Circle, description: 'Rubber meets road' },
    { type: 'Crankset', label: 'Crankset', icon: Settings, description: 'Your power input' },
    { type: 'BottomBracket', label: 'BB', icon: Disc, description: 'Matches frame & crank' },
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

// Helper to generate human-readable constraint messages
function getActiveConstraints(parts: any, activeType: string, selectedFreehubStandard: string | null): string[] {
    const constraints: string[] = [];

    if (activeType === 'Cassette') {
        if (selectedFreehubStandard) {
            const freehubLabels: Record<string, string> = {
                'HG': 'Shimano HG',
                'XDR': 'SRAM XDR',
                'XD': 'SRAM XD',
                'MICROSPLINE': 'Shimano Microspline',
                'N3W': 'Campagnolo N3W'
            };
            constraints.push(`Freehub: ${freehubLabels[selectedFreehubStandard] || selectedFreehubStandard}`);
        } else if (parts.WheelRear) {
            const wheelFreehub = parts.WheelRear.specs?.freehub_body || parts.WheelRear.interfaces?.freehub;
            if (wheelFreehub) {
                constraints.push(`Wheel freehub: ${wheelFreehub}`);
            }
        }
    }

    if (activeType === 'RearDerailleur' || activeType === 'Shifter') {
        // Show drivetrain ecosystem constraint
        if (parts.Crankset) {
            const crankName = parts.Crankset.name || parts.Crankset.brand;
            if (crankName) {
                const brand = crankName.toUpperCase().includes('SHIMANO') ? 'Shimano' :
                             crankName.toUpperCase().includes('SRAM') ? 'SRAM' :
                             crankName.toUpperCase().includes('CAMPAGNOLO') ? 'Campagnolo' : null;
                if (brand) constraints.push(`Crankset: ${brand}`);
            }
        }
    }

    if (activeType === 'BottomBracket') {
        if (parts.Frame) {
            const bbShell = parts.Frame.specs?.bb_shell || parts.Frame.attributes?.bottom_bracket_shell;
            if (bbShell) constraints.push(`BB Shell: ${bbShell}`);
        }
        // Also show spindle constraint if crankset is already selected
        if (parts.Crankset) {
            const crankSpindle = (parts.Crankset as any).specs?.spindle_type ||
                                 (parts.Crankset as any).attributes?.spindle_type ||
                                 (parts.Crankset as any).interfaces?.spindle_type;
            if (crankSpindle) {
                const spindleLabels: Record<string, string> = {
                    'DUB': 'SRAM DUB (28.99mm)',
                    '24mm': 'Shimano 24mm',
                    '30mm': '30mm (BB30/PF30)',
                    'GXP': 'SRAM GXP (24/22mm)',
                    'BSA30': 'BSA 30mm'
                };
                constraints.push(`Spindle: ${spindleLabels[crankSpindle.toUpperCase()] || crankSpindle}`);
            }
        }
    }

    if (activeType === 'Fork' && parts.Frame) {
        const headset = parts.Frame.specs?.headset || parts.Frame.attributes?.headset;
        if (headset) constraints.push(`Headset: ${headset}`);
        const wheelSize = parts.Frame.specs?.wheel_size || parts.Frame.wheelSize || parts.Frame.attributes?.wheel_size;
        if (wheelSize) constraints.push(`Wheel Size: ${wheelSize}`);
    }

    if (activeType === 'Wheel' && parts.Frame) {
        const rearAxle = parts.Frame.specs?.rear_axle || parts.Frame.attributes?.rear_axle;
        if (rearAxle) constraints.push(`Rear Axle: ${rearAxle}`);
        // Also show fork front axle if fork is selected
        if (parts.Fork) {
            const frontAxle = parts.Fork.specs?.front_axle || parts.Fork.attributes?.axle_standard;
            if (frontAxle) constraints.push(`Front Axle: ${frontAxle}`);
        }
    }

    if (activeType === 'Tire' && parts.Frame) {
        const maxTire = parts.Frame.specs?.max_tire_width || parts.Frame.attributes?.max_tire;
        if (maxTire) constraints.push(`Max Tire: ${maxTire}`);
    }

    return constraints;
}

// Helper to get incompatibility reason for a component
function getIncompatibilityReason(component: AnyComponent, parts: any, activeType: string, selectedFreehubStandard: string | null): string | null {
    // Cassette freehub mismatch
    if (activeType === 'Cassette') {
        const cassetteFreehub = (component as any).specs?.freehub_body ||
                                (component as any).interfaces?.freehub_mount ||
                                (component as any).attributes?.freehub_mount || '';

        if (selectedFreehubStandard) {
            if (!cassetteFreehub.toUpperCase().includes(selectedFreehubStandard.toUpperCase())) {
                return `Requires ${cassetteFreehub} freehub`;
            }
        }
    }

    // RD/Shifter protocol mismatch
    if ((activeType === 'RearDerailleur' || activeType === 'Shifter') && parts.Crankset) {
        const crankName = (parts.Crankset.name || '').toUpperCase();
        const compName = (component.name || '').toUpperCase();

        // Simple brand check
        const crankBrand = crankName.includes('SHIMANO') ? 'SHIMANO' :
                          crankName.includes('SRAM') ? 'SRAM' :
                          crankName.includes('CAMPAGNOLO') ? 'CAMPAGNOLO' : null;
        const compBrand = compName.includes('SHIMANO') || compName.includes('ULTEGRA') || compName.includes('DURA-ACE') || compName.includes('105') || compName.includes('GRX') ? 'SHIMANO' :
                         compName.includes('SRAM') || compName.includes('RED') || compName.includes('FORCE') || compName.includes('RIVAL') || compName.includes('EAGLE') ? 'SRAM' :
                         compName.includes('CAMPAGNOLO') || compName.includes('RECORD') || compName.includes('CHORUS') ? 'CAMPAGNOLO' : null;

        if (crankBrand && compBrand && crankBrand !== compBrand) {
            return `Different brand than ${crankBrand.charAt(0) + crankBrand.slice(1).toLowerCase()} crankset`;
        }
    }

    // BB shell mismatch
    if (activeType === 'BottomBracket' && parts.Frame) {
        const frameBB = (parts.Frame.specs?.bb_shell || parts.Frame.attributes?.bottom_bracket_shell || '').toUpperCase();
        const compBB = ((component as any).specs?.bb_shell || (component as any).attributes?.frame_shell || '').toUpperCase();

        if (frameBB && compBB && !frameBB.includes(compBB) && !compBB.includes(frameBB)) {
            return `Frame uses ${parts.Frame.specs?.bb_shell || parts.Frame.attributes?.bottom_bracket_shell}`;
        }
    }

    // BB spindle interface mismatch (when crankset already selected)
    if (activeType === 'BottomBracket' && parts.Crankset) {
        const crankSpindle = ((parts.Crankset as any).specs?.spindle_type ||
                             (parts.Crankset as any).attributes?.spindle_type ||
                             (parts.Crankset as any).interfaces?.spindle_type || '').toUpperCase();
        const bbSpindle = ((component as any).specs?.spindle_interface ||
                          (component as any).specs?.spindle_type ||
                          (component as any).attributes?.spindle_interface ||
                          (component as any).attributes?.spindle_type || '').toUpperCase();

        if (crankSpindle && bbSpindle) {
            // Normalize spindle names for comparison
            const normalizeSpindle = (s: string): string => {
                const upper = s.toUpperCase().replace(/[^A-Z0-9]/g, '');
                if (upper.includes('DUB') || upper === '2899' || upper === '2899MM') return 'DUB';
                if (upper === '24' || upper === '24MM') return '24MM';
                if (upper === '30' || upper === '30MM' || upper.includes('BB30') || upper.includes('PF30')) return '30MM';
                if (upper.includes('GXP')) return 'GXP';
                return upper;
            };

            const crankNorm = normalizeSpindle(crankSpindle);
            const bbNorm = normalizeSpindle(bbSpindle);

            if (crankNorm !== bbNorm) {
                const spindleLabels: Record<string, string> = {
                    'DUB': 'DUB (28.99mm)',
                    '24MM': '24mm',
                    '30MM': '30mm',
                    'GXP': 'GXP'
                };
                return `Crankset needs ${spindleLabels[crankNorm] || crankNorm} spindle`;
            }
        }
    }

    // Fork steerer/wheel size mismatch
    if (activeType === 'Fork' && parts.Frame) {
        const frameHeadset = (parts.Frame.specs?.headset || parts.Frame.attributes?.headset || '').toUpperCase();
        const forkSteerer = ((component as any).specs?.steerer_tube || (component as any).specs?.steerer ||
                            (component as any).attributes?.steerer || '').toUpperCase();

        // Tapered frame needs tapered fork
        if (frameHeadset && forkSteerer) {
            const frameTapered = frameHeadset.includes('IS42') || frameHeadset.includes('IS52') ||
                                 frameHeadset.includes('ZS44') && frameHeadset.includes('ZS56') ||
                                 frameHeadset.includes('TAPERED');
            const forkStraight = forkSteerer.includes('STRAIGHT') && !forkSteerer.includes('TAPERED');

            if (frameTapered && forkStraight) {
                return `Frame has tapered headset, fork has straight steerer`;
            }
        }

        // Wheel size mismatch
        const frameWheelSize = (parts.Frame.wheelSize || parts.Frame.specs?.wheel_size || parts.Frame.attributes?.wheel_size || '').toUpperCase();
        const forkWheelSize = ((component as any).specs?.wheel_size || (component as any).wheelSize ||
                              (component as any).attributes?.wheel_size || '').toUpperCase();

        if (frameWheelSize && forkWheelSize) {
            // 700c and 29 are equivalent
            const normalize = (s: string) => {
                if (s.includes('700') || s === '29') return '700C';
                if (s.includes('650') || s === '27.5') return '650B';
                return s;
            };
            if (normalize(frameWheelSize) !== normalize(forkWheelSize)) {
                return `Fork (${forkWheelSize}) doesn't match frame wheel size (${frameWheelSize})`;
            }
        }
    }

    return null;
}

export const PartSelector: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [frameCategory, setFrameCategory] = useState<string | null>(null);
    const [components, setComponents] = useState<AnyComponent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showIncompatible, setShowIncompatible] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

    const [showDashboard, setShowDashboard] = useState(false);

    // Freehub Selection State
    const [showFreehubSelector, setShowFreehubSelector] = useState(false);
    const [pendingWheel, setPendingWheel] = useState<AnyComponent | null>(null);

    // Fork Choice State (for Road/Gravel framesets that include a fork)
    const [showForkChoiceModal, setShowForkChoiceModal] = useState(false);
    const [pendingFrame, setPendingFrame] = useState<AnyComponent | null>(null);

    // Dismissed info boxes (persisted in localStorage)
    const [dismissedInfoBoxes, setDismissedInfoBoxes] = useState<Set<string>>(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('dismissedInfoBoxes');
            return stored ? new Set(JSON.parse(stored)) : new Set();
        }
        return new Set();
    });

    const dismissInfoBox = useCallback((type: string) => {
        setDismissedInfoBoxes(prev => {
            const newSet = new Set(prev);
            newSet.add(type);
            if (typeof window !== 'undefined') {
                localStorage.setItem('dismissedInfoBoxes', JSON.stringify([...newSet]));
            }
            return newSet;
        });
    }, []);

    // Also track if freehub reminder is dismissed for current session
    const [freehubReminderDismissed, setFreehubReminderDismissed] = useState(false);

    const {
        parts, setPart, setBuild, clearBuild, totalWeight,
        selectedFreehubStandard, setFreehubStandard,
        factoryFork, setFactoryForkChoice, setFactoryForkInfo
    } = useBuildStore();
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

        fetch(`/api/components?type=${activeType}`)
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
            if ('position' in component || (component as any).type === 'Wheel') {
                // Default to SET if position is missing but it is a Wheel
                const pos = (component as any).position || 'SET';

                if (pos === 'FRONT') setPart('WheelFront', component);
                else if (pos === 'REAR') setPart('WheelRear', component);
                else if (pos === 'SET') {
                    // Check if we need to ask for freehub standard
                    const freehub = (component as any).specs?.freehub_body || (component as any).freehub || (component as any).interfaces?.freehub;

                    // If multiple freehubs are supported (comma separated or array), ask user
                    const isAmbiguous = typeof freehub === 'string' && freehub.includes(',');

                    if (isAmbiguous) {
                        setPendingWheel(component);
                        setShowFreehubSelector(true);
                        return; // Stop here, wait for user selection
                    }

                    // Otherwise proceed normally
                    const halfWeight = component.weightGrams ? Math.round(component.weightGrams / 2) : 0;

                    // Create Front Wheel
                    const frontWheel = {
                        ...component,
                        id: `${component.id}-F`,
                        name: `${component.name} (Front)`,
                        weightGrams: halfWeight,
                        interfaces: { ...component.interfaces, position: 'FRONT' }
                    };

                    // Create Rear Wheel
                    const rearWheel = {
                        ...component,
                        id: `${component.id}-R`,
                        name: `${component.name} (Rear)`,
                        weightGrams: halfWeight,
                        interfaces: { ...component.interfaces, position: 'REAR' }
                    };

                    // Use setBuild to update both atomically and trigger validation once
                    setBuild({
                        WheelFront: frontWheel as any,
                        WheelRear: rearWheel as any
                    });
                }
            }
        } else if (activeType === 'Tire') {
            setPart('TireFront', component);
            setPart('TireRear', component);
        } else if (activeType === 'BrakeCaliper') {
            // Handle Brake Caliper Sets (PAIR)
            const pos = (component as any).position || 'PAIR';
            if (pos === 'PAIR' || pos === 'SET') {
                // Create Front Caliper
                const frontCaliper = {
                    ...component,
                    id: `${component.id}-F`,
                    name: `${component.name} (Front)`,
                    interfaces: { ...component.interfaces, position: 'FRONT' }
                };
                // Create Rear Caliper
                const rearCaliper = {
                    ...component,
                    id: `${component.id}-R`,
                    name: `${component.name} (Rear)`,
                    interfaces: { ...component.interfaces, position: 'REAR' }
                };

                setPart('BrakeCaliperFront', frontCaliper as any);
                setPart('BrakeCaliperRear', rearCaliper as any);
            } else {
                setPart('BrakeCaliperFront', component);
                setPart('BrakeCaliperRear', component);
            }
        } else if (activeType === 'BrakeRotor') {
            setPart('BrakeRotorFront', component);
            setPart('BrakeRotorRear', component);
        } else if (activeType === 'Frame') {
            // Check if this is a Road/Gravel frameset that includes a fork
            const category = ((component as any).specs?.category ||
                             (component as any).attributes?.category || '').toUpperCase();
            const includesFork = (component as any).specs?.includes_fork ??
                                (category === 'ROAD' || category === 'GRAVEL');
            const factoryForkWeight = (component as any).specs?.factory_fork_weight || 0;
            const factoryForkName = (component as any).specs?.factory_fork_name || null;

            if (includesFork && category !== 'MTB') {
                // Store the frame and show fork choice modal
                setPendingFrame(component);
                setFactoryForkInfo(factoryForkWeight, factoryForkName);
                setShowForkChoiceModal(true);
                return; // Stop here, wait for user selection
            }

            // MTB or frame without fork - proceed normally
            setPart('Frame', component);
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
    }, [activeType, currentStep, setPart, resetFilters, setBuild, setFactoryForkInfo]);

    // Fork Choice Handlers
    const handleKeepFactoryFork = useCallback(() => {
        if (!pendingFrame) return;

        // Set the frame
        setPart('Frame', pendingFrame);
        setFactoryForkChoice(true);
        setShowForkChoiceModal(false);
        setPendingFrame(null);

        // Skip Fork step and go directly to Wheels (step 2)
        // Fork is at index 1, Wheels at index 2
        setTimeout(() => {
            setCurrentStep(2); // Jump to Wheels step
            resetFilters();
            setFrameCategory(null);
        }, 300);
    }, [pendingFrame, setPart, setFactoryForkChoice, resetFilters]);

    const handleChooseDifferentFork = useCallback(() => {
        if (!pendingFrame) return;

        // Set the frame
        setPart('Frame', pendingFrame);
        setFactoryForkChoice(false);
        setShowForkChoiceModal(false);
        setPendingFrame(null);

        // Advance to Fork step (step 1)
        setTimeout(() => {
            setCurrentStep(1); // Go to Fork step
            resetFilters();
            setFrameCategory(null);
        }, 300);
    }, [pendingFrame, setPart, setFactoryForkChoice, resetFilters]);

    const [showComplete, setShowComplete] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [saveError, setSaveError] = useState<string | null>(null);
    const { isSignedIn } = useUser();

    useEffect(() => {
        if (currentStep === BUILD_SEQUENCE.length - 1 && parts.Seatpost) {
            setTimeout(() => setShowComplete(true), 500);
        }
    }, [currentStep, parts.Seatpost]);

    // Save build handler
    const handleSaveBuild = async () => {
        if (!isSignedIn) {
            setSaveError('Please sign in to save builds');
            setSaveStatus('error');
            return;
        }

        const name = window.prompt('Name your build:', parts.Frame?.name || 'My Build');
        if (!name) return;

        setIsSaving(true);
        setSaveStatus('idle');
        setSaveError(null);

        try {
            const res = await fetch('/api/builds', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, parts }),
            });

            if (res.ok) {
                setSaveStatus('success');
                setTimeout(() => setSaveStatus('idle'), 3000);
            } else if (res.status === 401) {
                setSaveError('Please sign in to save builds');
                setSaveStatus('error');
            } else {
                const text = await res.text();
                setSaveError(text || 'Failed to save build');
                setSaveStatus('error');
            }
        } catch (err) {
            console.error(err);
            setSaveError('Network error - check your connection');
            setSaveStatus('error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleFreehubSelect = (standard: string) => {
        setFreehubStandard(standard === 'UNKNOWN' ? null : standard);
        setShowFreehubSelector(false);

        if (pendingWheel) {
            const component = pendingWheel;
            setPendingWheel(null);

            // Proceed with setting the wheel
            const halfWeight = component.weightGrams ? Math.round(component.weightGrams / 2) : 0;

            const frontWheel = {
                ...component,
                id: `${component.id}-F`,
                name: `${component.name} (Front)`,
                weightGrams: halfWeight,
                interfaces: { ...component.interfaces, position: 'FRONT' }
            };

            const rearWheel = {
                ...component,
                id: `${component.id}-R`,
                name: `${component.name} (Rear)`,
                weightGrams: halfWeight,
                interfaces: { ...component.interfaces, position: 'REAR' }
            };

            setBuild({
                WheelFront: frontWheel as any,
                WheelRear: rearWheel as any
            });

            // Auto-advance
            setTimeout(() => {
                if (currentStep < BUILD_SEQUENCE.length - 1) {
                    setCurrentStep(prev => prev + 1);
                    resetFilters();
                }
            }, 300);
        }
    };

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
            else if (component.position === 'REAR') tempParts.WheelRear = component as any;
            else if (component.position === 'SET') {
                tempParts.WheelFront = { ...component, position: 'FRONT' } as any;
                tempParts.WheelRear = { ...component, position: 'REAR' } as any;
            }
        } else if (activeType === 'Tire') {
            tempParts.TireFront = component as any;
            tempParts.TireRear = component as any;
        } else if (activeType === 'BrakeCaliper') {
            const pos = (component as any).position || 'PAIR';
            if (pos === 'PAIR' || pos === 'SET') {
                tempParts.BrakeCaliperFront = { ...component, position: 'FRONT' } as any;
                tempParts.BrakeCaliperRear = { ...component, position: 'REAR' } as any;
            } else {
                tempParts.BrakeCaliperFront = component as any;
                tempParts.BrakeCaliperRear = component as any;
            }
        } else if (activeType === 'BrakeRotor') {
            tempParts.BrakeRotorFront = component as any;
            tempParts.BrakeRotorRear = component as any;
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

        const result = Validator.validateBuild(buildData);

        // Check if there are any ERROR severity issues
        return result.compatible;
    };

    // FILTERS
    let filteredComponents = components;

    // Debug Logging
    // console.log('DEBUG: ActiveType:', activeType);
    // console.log('DEBUG: Parts:', parts);
    // console.log('DEBUG: Frame Category:', parts.Frame ? ((parts.Frame as any).category || (parts.Frame as any).attributes?.category) : 'N/A');

    // Frame Category
    if (activeType === 'Frame' && frameCategory) {
        filteredComponents = filteredComponents.filter(c => {
            // Check flattened category or attributes.category
            const category = (c as any).category || (c as any).attributes?.category;
            return category && category.toUpperCase() === frameCategory.toUpperCase();
        });
    }

    // Fork Category Filtering (Based on Frame category)
    if (activeType === 'Fork' && parts.Frame) {
        const frameCategory = ((parts.Frame as any).category ||
                              (parts.Frame as any).attributes?.category ||
                              (parts.Frame as any).specs?.category || '').toUpperCase();

        // Helper to get fork category
        const getForkCategory = (c: any): string => {
            const raw = c.interfaces?.category || c.attributes?.category || c.specs?.category || '';
            return (Array.isArray(raw) ? raw[0] : String(raw)).toUpperCase();
        };

        // Helper to check if fork is MTB (by category, travel, or wheel size)
        const isMTBFork = (c: any): boolean => {
            const cat = getForkCategory(c);
            if (['MTB', 'XC', 'TRAIL', 'ENDURO', 'DH', 'DOWNHILL'].includes(cat)) return true;

            // Check travel - MTB forks typically have 80mm+ travel
            const travelStr = String(c.attributes?.travel || c.interfaces?.travel || '0');
            const travel = parseInt(travelStr.replace(/[^0-9]/g, ''));
            if (travel >= 80) return true;

            // Check wheel size - 29" or 27.5" without 700c indicates MTB
            const wheelSizeRaw = c.interfaces?.wheel_size || c.attributes?.wheel_size || '';
            const wheelSize = (Array.isArray(wheelSizeRaw) ? wheelSizeRaw.join(' ') : String(wheelSizeRaw)).toUpperCase();
            if ((wheelSize.includes('29') || wheelSize.includes('27.5')) &&
                !wheelSize.includes('700')) return true;

            // Check name for MTB indicators
            const name = String(c.name || '').toUpperCase();
            if (name.includes('MTB') || name.includes('ENDURO') || name.includes('TRAIL') ||
                name.includes('DOWNHILL') || name.includes('DH ')) return true;

            return false;
        };

        // Helper to check if fork is suspension
        const isSuspensionFork = (c: any): boolean => {
            const forkTypeRaw = c.interfaces?.fork_type || c.attributes?.fork_type || '';
            const forkType = String(Array.isArray(forkTypeRaw) ? forkTypeRaw[0] : forkTypeRaw).toUpperCase();
            const suspTypeRaw = c.interfaces?.suspension_type || c.attributes?.suspension_type || '';
            const suspType = String(Array.isArray(suspTypeRaw) ? suspTypeRaw[0] : suspTypeRaw).toUpperCase();
            const travelStr = String(c.attributes?.travel || '0');
            const travel = parseInt(travelStr.replace(/[^0-9]/g, ''));
            return forkType === 'SUSPENSION' || suspType !== '' || travel > 0;
        };

        if (frameCategory === 'ROAD') {
            // Road bikes: Show rigid forks only (no suspension), exclude MTB forks
            filteredComponents = filteredComponents.filter(c => {
                if (isMTBFork(c)) return false;
                return !isSuspensionFork(c);
            });
        } else if (frameCategory === 'GRAVEL') {
            // Gravel bikes: Show gravel forks (rigid and suspension), road forks, but NOT MTB
            filteredComponents = filteredComponents.filter(c => {
                // Explicitly exclude MTB forks
                if (isMTBFork(c)) return false;

                const cat = getForkCategory(c);
                // Show gravel or road forks (both rigid and suspension for gravel)
                // Also show forks with no category if they're not MTB
                return cat === 'GRAVEL' || cat === 'ROAD' || cat === '';
            });
        } else if (frameCategory === 'MTB') {
            // MTB: Show MTB forks only
            filteredComponents = filteredComponents.filter(c => isMTBFork(c));
        }
    }

    // Tire Category Filtering (Based on Frame)
    if (activeType === 'Tire' && parts.Frame) {
        const frameCategory = ((parts.Frame as any).category || (parts.Frame as any).attributes?.category || '').toUpperCase();
        const maxTireWidth = parseFloat(String((parts.Frame as any).specs?.max_tire_width || (parts.Frame as any).attributes?.max_tire || '0').replace(/[^0-9.]/g, ''));

        // Helper to get tire type from multiple possible fields
        const getTireType = (c: any): string => {
            return (c.interfaces?.tire_type || c.attributes?.tire_type ||
                    c.attributes?.purpose || c.specs?.tire_type || '').toUpperCase();
        };

        // Helper to get tire width
        const getTireWidth = (c: any): number => {
            const width = c.widthMM || c.specs?.width || c.interfaces?.width || c.attributes?.width || 0;
            if (typeof width === 'number') return width;
            return parseFloat(String(width).replace(/[^0-9.]/g, '')) || 0;
        };

        if (frameCategory === 'ROAD') {
            // Show Road tires (width <= 35mm usually, or explicit road type)
            filteredComponents = filteredComponents.filter(c => {
                const type = getTireType(c);
                const width = getTireWidth(c);
                return type === 'ROAD' || (width > 0 && width <= 35);
            });
        } else if (frameCategory === 'GRAVEL') {
            // Show Gravel and Road tires - check type OR width-based filtering
            filteredComponents = filteredComponents.filter(c => {
                const type = getTireType(c);
                const width = getTireWidth(c);

                // Explicit gravel/road type match
                if (type === 'GRAVEL' || type === 'ROAD') return true;

                // Width-based: show tires 28-55mm for gravel
                if (width >= 28 && width <= 55) return true;

                // Also respect max tire clearance if available
                if (maxTireWidth > 0 && width > 0 && width <= maxTireWidth) return true;

                return false;
            });
        } else if (frameCategory === 'MTB') {
            // Show MTB tires - check type OR larger widths
            filteredComponents = filteredComponents.filter(c => {
                const type = getTireType(c);
                const width = getTireWidth(c);

                // Explicit MTB types
                if (['MTB', 'XC', 'TRAIL', 'ENDURO', 'DH', 'DOWNHILL'].includes(type)) return true;

                // Width-based: MTB tires are typically 50mm+ (2.0"+)
                if (width >= 50) return true;

                return false;
            });
        }
    }

    // Compatibility
    if (!showIncompatible) {
        filteredComponents = filteredComponents.filter(c => isCompatible(c));
    }

    // Explicit Freehub Filtering for Cassettes
    if (activeType === 'Cassette' && selectedFreehubStandard) {
        filteredComponents = filteredComponents.filter(c => {
            // "SRAM XDR" vs "XDR" - simple check
            const freehub = ((c as any).specs?.freehub_body || (c as any).freehub_mount || '').toUpperCase();
            // Allow loose matching (e.g. if user picked XDR, show SRAM XDR)
            return freehub.includes(selectedFreehubStandard);
        });
    }

    // Explicit Spindle Filtering for Bottom Brackets (when crankset already selected)
    if (activeType === 'BottomBracket' && parts.Crankset) {
        const crankSpindle = ((parts.Crankset as any).specs?.spindle_type ||
                             (parts.Crankset as any).attributes?.spindle_type ||
                             (parts.Crankset as any).interfaces?.spindle_type || '').toUpperCase();

        if (crankSpindle) {
            // Normalize spindle names for comparison
            const normalizeSpindle = (s: string): string => {
                const upper = s.toUpperCase().replace(/[^A-Z0-9]/g, '');
                if (upper.includes('DUB') || upper === '2899' || upper === '2899MM') return 'DUB';
                if (upper === '24' || upper === '24MM' || upper.includes('HOLLOWTECH')) return '24MM';
                if (upper === '30' || upper === '30MM' || upper.includes('BB30') || upper.includes('PF30')) return '30MM';
                if (upper.includes('GXP')) return 'GXP';
                return upper;
            };

            const crankNorm = normalizeSpindle(crankSpindle);

            filteredComponents = filteredComponents.filter(c => {
                const bbSpindle = ((c as any).specs?.spindle_interface ||
                                  (c as any).specs?.spindle_type ||
                                  (c as any).attributes?.spindle_interface ||
                                  (c as any).attributes?.spindle_type || '').toUpperCase();

                if (!bbSpindle) return true; // If no spindle info, show it (let validation catch it)

                const bbNorm = normalizeSpindle(bbSpindle);
                return crankNorm === bbNorm;
            });
        }
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

            {/* Freehub Selector Modal */}
            <FreehubSelector
                isOpen={showFreehubSelector}
                onClose={() => setShowFreehubSelector(false)}
                onSelect={handleFreehubSelect}
                availableStandards={
                    pendingWheel && (pendingWheel as any).specs?.freehub_body
                        ? (pendingWheel as any).specs.freehub_body.split(',').map((s: string) => s.trim())
                        : undefined
                }
            />

            {/* Fork Choice Modal (for Road/Gravel framesets) */}
            <ForkChoiceModal
                isOpen={showForkChoiceModal}
                frameName={pendingFrame?.name || 'Frameset'}
                factoryForkName={factoryFork.factoryForkName}
                factoryForkWeight={factoryFork.factoryForkWeight}
                onKeepFactory={handleKeepFactoryFork}
                onChooseDifferent={handleChooseDifferentFork}
            />

            {/* Build Complete Modal */}
            <AnimatePresence>
                {showComplete && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                        onClick={() => setShowComplete(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="relative w-full max-w-md max-h-[90vh] overflow-y-auto no-scrollbar"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="bg-stone-900/90 border border-white/10 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
                                <div className="text-center mb-6">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mb-4 ring-1 ring-emerald-500/40">
                                        <Check className="w-8 h-8" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-white mb-2">Build Complete!</h2>
                                    <p className="text-stone-400">Your dream bike is ready to roll.</p>
                                </div>

                                {/* Rich Share Card */}
                                <div className="mb-6 transform scale-95 origin-top">
                                    <ShareCard
                                        frameName={parts.Frame?.name || 'Custom Build'}
                                        parts={parts as unknown as Record<string, any>}
                                        chainrings={(parts.Crankset?.attributes as any)?.chainrings || [48, 35]}
                                        cassetteCogs={(parts.Cassette?.attributes as any)?.range || [10, 33]}
                                        totalWeight={totalWeight}
                                        climbingScore={85} // TODO: Calculate real score
                                        speedRange={{ min: 8, max: 45 }} // TODO: Calculate real range
                                        unitSystem={unitSystem}
                                        isModal={false}
                                    />
                                </div>

                                {/* Save Status Messages */}
                                {saveStatus === 'success' && (
                                    <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
                                        <Check className="w-4 h-4 text-emerald-400" />
                                        <span className="text-sm text-emerald-300">Build saved to Garage!</span>
                                    </div>
                                )}
                                {saveStatus === 'error' && saveError && (
                                    <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-2">
                                        <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                                        <div className="flex-1">
                                            <span className="text-sm text-red-300">{saveError}</span>
                                            {!isSignedIn && (
                                                <button
                                                    onClick={() => router.push('/sign-in')}
                                                    className="block mt-2 text-xs text-red-400 hover:text-red-300 underline"
                                                >
                                                    Sign in now
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-3">
                                    {/* Primary Save Button */}
                                    <button
                                        onClick={handleSaveBuild}
                                        disabled={isSaving || saveStatus === 'success'}
                                        className={`col-span-2 py-3 px-4 rounded-xl font-medium transition-colors shadow-lg flex items-center justify-center gap-2 ${
                                            saveStatus === 'success'
                                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                                : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-500/20'
                                        }`}
                                    >
                                        {isSaving ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Saving...
                                            </>
                                        ) : saveStatus === 'success' ? (
                                            <>
                                                <Check className="w-4 h-4" />
                                                Saved!
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4" />
                                                Save to Garage
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => setShowDashboard(true)}
                                        className="col-span-2 py-3 px-4 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                                    >
                                        View Full Specs
                                    </button>
                                    <button
                                        onClick={() => {
                                            window.location.href = '/builder?new=true';
                                        }}
                                        className="py-3 px-4 bg-white/5 text-stone-300 rounded-xl font-medium hover:bg-white/10 transition-colors border border-white/10"
                                    >
                                        New Build
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowComplete(false);
                                            router.push('/garage');
                                        }}
                                        className="py-3 px-4 bg-white/5 text-stone-300 rounded-xl font-medium hover:bg-white/10 transition-colors border border-white/10"
                                    >
                                        Go to Garage
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Progress Steps */}
            <div className="relative z-30 bg-stone-950/95 backdrop-blur border-b border-white/5">
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
            </div>

            {/* Content */}
            <div ref={scrollContainerRef} className="flex-1 overflow-y-auto pb-40 lg:pb-6">
                <div className="p-4 md:p-6">
                    {/* Contextual Constraints Banner */}
                    {!loading && !showCategorySelection && (() => {
                        const constraints = getActiveConstraints(parts, activeType, selectedFreehubStandard);
                        if (constraints.length === 0) return null;
                        return (
                            <div className="mb-4 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-start gap-3">
                                <Info className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                                <div className="flex-1">
                                    <p className="text-sm text-blue-200">
                                        <span className="font-medium">Filtering based on your build:</span>{' '}
                                        <span className="text-blue-300">{constraints.join(' • ')}</span>
                                    </p>
                                </div>
                            </div>
                        );
                    })()}

                    {/* Freehub/Ecosystem Reminder Banner (green accent) - dismissible */}
                    {!loading && !showCategorySelection && selectedFreehubStandard && !freehubReminderDismissed &&
                     ['BottomBracket', 'Crankset', 'Cassette', 'RearDerailleur', 'Shifter'].includes(activeType) && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3 relative group"
                        >
                            <Cog className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                            <div className="flex-1 pr-6">
                                <p className="text-sm text-emerald-200">
                                    <span className="font-medium">Your drivetrain ecosystem:</span>{' '}
                                    <span className="text-emerald-300">
                                        {selectedFreehubStandard === 'HG' && 'Shimano HG (11s road/MTB compatible)'}
                                        {selectedFreehubStandard === 'XDR' && 'SRAM XDR (SRAM road/gravel 12s)'}
                                        {selectedFreehubStandard === 'XD' && 'SRAM XD (SRAM MTB, 10T capable)'}
                                        {selectedFreehubStandard === 'MICROSPLINE' && 'Shimano Microspline (Shimano 12s)'}
                                        {selectedFreehubStandard === 'N3W' && 'Campagnolo N3W (Campagnolo 13s)'}
                                        {!['HG', 'XDR', 'XD', 'MICROSPLINE', 'N3W'].includes(selectedFreehubStandard) && selectedFreehubStandard}
                                    </span>
                                </p>
                                <p className="text-xs text-emerald-400/70 mt-1">
                                    {selectedFreehubStandard === 'XDR' && 'Choose SRAM groupset components (Red, Force, Rival, Apex)'}
                                    {selectedFreehubStandard === 'XD' && 'Choose SRAM Eagle groupset components (XX, X0, GX, NX)'}
                                    {selectedFreehubStandard === 'HG' && 'Choose Shimano groupset components (Dura-Ace, Ultegra, 105, GRX, Deore, etc.)'}
                                    {selectedFreehubStandard === 'MICROSPLINE' && 'Choose Shimano 12-speed components (Deore, SLX, XT, XTR)'}
                                    {selectedFreehubStandard === 'N3W' && 'Choose Campagnolo components (Super Record, Record, Chorus, Ekar)'}
                                </p>
                            </div>
                            <button
                                onClick={() => setFreehubReminderDismissed(true)}
                                className="absolute top-2 right-2 p-1 rounded-full text-emerald-400/50 hover:text-emerald-300 hover:bg-emerald-500/20 transition-colors"
                                title="Dismiss for this session"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </motion.div>
                    )}

                    {/* Step-specific Info Box - dismissible */}
                    {!loading && !showCategorySelection && BUILD_STEP_INFO[activeType] && !dismissedInfoBoxes.has(activeType) && (
                        <div className="mb-4 relative group">
                            <InfoBox
                                type={BUILD_STEP_INFO[activeType].type}
                                title={BUILD_STEP_INFO[activeType].title}
                            >
                                {BUILD_STEP_INFO[activeType].content}
                                {/* Additional context for factory fork */}
                                {activeType === 'Fork' && !factoryFork.usingFactoryFork && factoryFork.factoryForkWeight > 0 && (
                                    <p className="mt-2 text-amber-300">
                                        Factory fork weight ({factoryFork.factoryForkWeight}g) has been deducted from your build total.
                                        Your new fork weight will be added when selected.
                                    </p>
                                )}
                            </InfoBox>
                            <button
                                onClick={() => dismissInfoBox(activeType)}
                                className="absolute top-2 right-2 p-1 rounded-full text-stone-500 hover:text-stone-300 hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100"
                                title="Don't show this tip again"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    )}

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
                                {/* Compatible parts first */}
                                {filteredComponents.map((comp) => (
                                    <PartCard
                                        key={comp.id}
                                        component={comp}
                                        isSelected={false}
                                        onSelect={handleSelectPart}
                                    />
                                ))}
                                {/* Incompatible parts (grayed out) when showIncompatible is true */}
                                {showIncompatible && components
                                    .filter(c => !filteredComponents.some(fc => fc.id === c.id))
                                    .map((comp) => {
                                        const reason = getIncompatibilityReason(comp, parts, activeType, selectedFreehubStandard) || 'Not compatible with current build';
                                        return (
                                            <PartCard
                                                key={comp.id}
                                                component={comp}
                                                isSelected={false}
                                                onSelect={handleSelectPart}
                                                isIncompatible={true}
                                                incompatibilityReason={reason}
                                            />
                                        );
                                    })}
                                {filteredComponents.length === 0 && !showIncompatible && (
                                    <div className="col-span-full text-center py-12 text-stone-500">
                                        <AlertTriangle className="w-8 h-8 mx-auto mb-3 text-amber-500/50" />
                                        <p className="mb-2">No compatible components found.</p>
                                        <button
                                            onClick={() => setShowIncompatible(true)}
                                            className="text-primary hover:underline"
                                        >
                                            Show all parts to see why
                                        </button>
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

'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { BuildDashboard } from './BuildDashboard';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import { validateBuilderBuild } from '@/lib/validationContext';
import { PartCard } from './PartCard';
import { ShareCard } from './ShareCard';
import { BuildSummary } from './BuildSummary';
import { useBuildStore, AnyComponent } from '@/store/buildStore';
import { useSafeClerk, useSafeUser } from "@/components/ClerkProviderWrapper"
import { useSettingsStore } from '@/store/settingsStore';
import { FreehubBodyStep } from './FreehubBodyStep';
import { ComponentPreFilter } from './ComponentPreFilter';
import { ForkChoiceModal } from './ForkChoiceModal';
import { InputDialog } from '@/components/ui/InputDialog';
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
import { parseCassetteRange, getAllGearRatios, calculateSpeed, calculateWheelCircumference } from '@/lib/gearCalculations';
import { computeUnifiedWhatIf } from '@/lib/whatIfEngine';

// Build sequence - the logical order for building a bike
const BUILD_SEQUENCE = [
    { type: 'Frame', label: 'Frame', icon: Bike, description: 'Start with your foundation' },
    { type: 'Fork', label: 'Fork', icon: GitBranch, description: 'Steering and front suspension' },
    { type: 'Wheel', label: 'Wheels', icon: CircleDot, description: 'Choose your rolling stock' },
    { type: 'FreehubBody', label: 'Freehub', icon: Cog, description: 'Choose your freehub body standard' },
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

const FRAME_CATEGORIES = [FrameType.GRAVEL];

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
                                (component as any).interfaces?.freehub ||
                                (component as any).interfaces?.freehub_mount ||
                                (component as any).interfaces?.freehub_standard ||
                                (component as any).attributes?.freehub_standard ||
                                '';

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

function getCompatibilitySignal(
    component: AnyComponent,
    parts: any,
    activeType: string
): { confidence: 'High' | 'Medium' | 'Low'; reason: string } {
    const c = component as any;
    if (activeType === 'Cassette') {
        const wheelFreehub = String(parts.WheelRear?.specs?.freehub_body || parts.WheelRear?.interfaces?.freehub || '').trim();
        const cassetteFreehub = String(
            c.specs?.freehub_body ||
            c.interfaces?.freehub ||
            c.interfaces?.freehub_mount ||
            c.interfaces?.freehub_standard ||
            c.attributes?.freehub_standard ||
            ''
        ).trim();
        if (wheelFreehub && cassetteFreehub) {
            return { confidence: 'High', reason: 'Direct freehub spec available on wheel and cassette.' };
        }
        if (wheelFreehub || cassetteFreehub) {
            return { confidence: 'Medium', reason: 'Partial freehub data found; confirm exact cassette standard.' };
        }
        return { confidence: 'Low', reason: 'Missing freehub specs. Manual fit verification recommended.' };
    }
    if (activeType === 'BottomBracket') {
        const frameShell = String(parts.Frame?.specs?.bb_shell || parts.Frame?.attributes?.bottom_bracket_shell || '').trim();
        const bbShell = String(c.specs?.bb_shell || c.attributes?.frame_shell || '').trim();
        const spindle = String(c.specs?.spindle_interface || c.specs?.spindle_type || c.attributes?.spindle_interface || '').trim();
        if (frameShell && bbShell && spindle) {
            return { confidence: 'High', reason: 'Frame shell and spindle interfaces are explicitly defined.' };
        }
        if (frameShell || bbShell || spindle) {
            return { confidence: 'Medium', reason: 'Some shell/spindle specs are missing; validate manufacturer chart.' };
        }
        return { confidence: 'Low', reason: 'Insufficient shell/spindle detail to trust auto-match alone.' };
    }
    if (activeType === 'Tire') {
        const tireWidth = c.specs?.width || c.attributes?.width || c.interfaces?.width;
        const tireSize = String(c.specs?.diameter || c.attributes?.diameter || c.specs?.size_label || '');
        if (tireWidth && tireSize) {
            return { confidence: 'High', reason: 'Tire width and diameter are both specified.' };
        }
        if (tireWidth || tireSize) {
            return { confidence: 'Medium', reason: 'Partial tire sizing data; re-check diameter/clearance manually.' };
        }
        return { confidence: 'Low', reason: 'Limited tire metadata; fit may vary by casing and rim.' };
    }
    if (activeType === 'Fork' || activeType === 'Wheel') {
        const size = String(c.specs?.wheel_size || c.interfaces?.wheel_size || c.attributes?.wheel_size || c.specs?.diameter || '');
        const axle = String(c.specs?.front_axle || c.attributes?.axle_standard || c.interfaces?.axle_standard || '');
        if (size && axle) {
            return { confidence: 'High', reason: 'Wheel size and axle standard are both explicitly defined.' };
        }
        if (size || axle) {
            return { confidence: 'Medium', reason: 'Partial size/axle data found; double-check standard details.' };
        }
        return { confidence: 'Low', reason: 'Missing size and axle specs; manual verification required.' };
    }
    return { confidence: 'Medium', reason: 'Compatibility inferred from available metadata.' };
}

export const PartSelector: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [frameCategory, setFrameCategory] = useState<string | null>(FrameType.GRAVEL);
    const [components, setComponents] = useState<AnyComponent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showIncompatible, setShowIncompatible] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

    const [showDashboard, setShowDashboard] = useState(false);

    // Crankset Pre-filter State
    const [drivetrainType, setDrivetrainType] = useState<'1x' | '2x' | null>(null);
    const [drivetrainSpeed, setDrivetrainSpeed] = useState<number | null>(null);
    const [cranksetSkipped, setCranksetSkipped] = useState(false);

    // Per-step Pre-filter State
    const [frameMaterial, setFrameMaterial] = useState<string | null>(null);
    const [frameTireClearance, setFrameTireClearance] = useState<string | null>(null);
    const [wheelMaterial, setWheelMaterial] = useState<string | null>(null);
    const [tireSizeRange, setTireSizeRange] = useState<string | null>(null);
    const [drivetrainElectronic, setDrivetrainElectronic] = useState<string | null>(null);
    const [rotorSize, setRotorSize] = useState<string | null>(null);
    const [seatpostType, setSeatpostType] = useState<string | null>(null);
    const [selectedCranksetBrand, setSelectedCranksetBrand] = useState<string | null>(null);
    const [selectedTireBrand, setSelectedTireBrand] = useState<string | null>(null);
    const [selectedStemBrand, setSelectedStemBrand] = useState<string | null>(null);
    const [selectedHandlebarBrand, setSelectedHandlebarBrand] = useState<string | null>(null);
    const [selectedSeatpostBrand, setSelectedSeatpostBrand] = useState<string | null>(null);
    const [selectedBrakeCaliperBrand, setSelectedBrakeCaliperBrand] = useState<string | null>(null);
    const [selectedCassetteBrand, setSelectedCassetteBrand] = useState<string | null>(null);
    const [selectedWheelBrand, setSelectedWheelBrand] = useState<string | null>(null);
    const [selectedRearDerailleurBrand, setSelectedRearDerailleurBrand] = useState<string | null>(null);
    const [selectedBrakeRotorBrand, setSelectedBrakeRotorBrand] = useState<string | null>(null);

    // Fork Choice State (for Gravel framesets that include a fork)
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
    const crankset = parts.Crankset as any;
    const cassette = parts.Cassette as any;
    const wheelRear = parts.WheelRear as any;
    const tireRear = parts.TireRear as any;

    const shareChainrings = React.useMemo(() => {
        if (!crankset) return [48, 35];
        if (Array.isArray(crankset.specs?.chainrings) && crankset.specs.chainrings.length > 0) {
            return crankset.specs.chainrings.map((n: any) => Number(n)).filter((n: number) => !isNaN(n));
        }
        const teethSource = String(crankset.attributes?.teeth || crankset.attributes?.chainrings || '');
        const parsed = teethSource
            .replace(/[^0-9,/]/g, '')
            .replace('/', ',')
            .split(',')
            .map((n: string) => parseInt(n))
            .filter((n: number) => !isNaN(n));
        return parsed.length > 0 ? parsed : [48, 35];
    }, [crankset]);

    const shareCassetteCogs = React.useMemo(() => {
        if (!cassette) return parseCassetteRange(33, 10);
        if (Array.isArray(cassette.specs?.cog_list) && cassette.specs.cog_list.length > 0) {
            const parsed = cassette.specs.cog_list.map((n: any) => Number(n)).filter((n: number) => !isNaN(n));
            if (parsed.length > 0) return parsed;
        }
        const range = String(cassette.specs?.range || cassette.attributes?.range || '10-33');
        const match = range.match(/(\d+)-(\d+)/);
        if (match) {
            return parseCassetteRange(parseInt(match[2]), parseInt(match[1]));
        }
        return parseCassetteRange(33, 10);
    }, [cassette]);

    const shareWheelSize = React.useMemo(() => {
        const raw = String(wheelRear?.specs?.diameter || wheelRear?.interfaces?.diameter || '700c').toLowerCase();
        return raw.includes('650') || raw.includes('27.5') ? 584 : 622;
    }, [wheelRear]);

    const shareTireWidth = React.useMemo(() => {
        const raw = tireRear?.specs?.width || tireRear?.attributes?.width || '28';
        const parsed = parseFloat(String(raw).replace(/[^0-9.]/g, ''));
        return !isNaN(parsed) && parsed > 0 ? parsed : 28;
    }, [tireRear]);

    const shareSpeedRange = React.useMemo(() => {
        const gears = getAllGearRatios(shareChainrings, shareCassetteCogs);
        if (gears.length === 0) return { min: 0, max: 0 };
        const circumference = calculateWheelCircumference(shareWheelSize, shareTireWidth);
        const speeds = gears.map((g) => calculateSpeed(g.ratio, circumference, 90));
        return { min: Math.min(...speeds), max: Math.max(...speeds) };
    }, [shareChainrings, shareCassetteCogs, shareWheelSize, shareTireWidth]);

    const shareClimbingScore = React.useMemo(() => {
        if (shareChainrings.length === 0 || shareCassetteCogs.length === 0) return 0;
        const lowestRatio = Math.min(...shareChainrings) / Math.max(...shareCassetteCogs);
        // Lower ratios are better for climbing; convert to intuitive 0-100 score.
        const rawScore = 100 - (lowestRatio - 0.7) * 60;
        return Math.max(0, Math.min(100, rawScore));
    }, [shareChainrings, shareCassetteCogs]);

    const shareWhatIfDelta = React.useMemo(() => {
        if (shareChainrings.length === 0 || shareCassetteCogs.length === 0) return null;
        const smallest = Math.min(...shareCassetteCogs);
        const largest = Math.max(...shareCassetteCogs);
        const cassetteRange = `${smallest}-${largest}`;
        const baselineTire = Number(tireRear?.specs?.width || tireRear?.attributes?.width || 32);
        const wheelSize = String(wheelRear?.specs?.diameter || '').includes('650') ? 584 : 622;

        return computeUnifiedWhatIf({
            baseline: { chainrings: shareChainrings, cassetteRange, tireSize: baselineTire, wheelSize },
            candidate: { chainrings: shareChainrings, cassetteRange, tireSize: baselineTire + 4, wheelSize },
            ftp: 250,
            riderWeightKg: 75
        });
    }, [shareChainrings, shareCassetteCogs, tireRear, wheelRear]);

    // Clear build when starting fresh
    useEffect(() => {
        if (searchParams.get('new') === 'true') {
            clearBuild();
            setCurrentStep(0);
            setFrameCategory(FrameType.GRAVEL);
            window.history.replaceState({}, '', '/builder');
        }
    }, [searchParams, clearBuild]);

    // Reset filters when changing steps
    const resetFilters = useCallback(() => {
        setSelectedBrand(null);
        setDrivetrainType(null);
        setDrivetrainSpeed(null);
        setCranksetSkipped(false);
        setFrameMaterial(null);
        setFrameTireClearance(null);
        setWheelMaterial(null);
        setTireSizeRange(null);
        setDrivetrainElectronic(null);
        setRotorSize(null);
        setSeatpostType(null);
        setSelectedCranksetBrand(null);
        setSelectedTireBrand(null);
        setSelectedStemBrand(null);
        setSelectedHandlebarBrand(null);
        setSelectedSeatpostBrand(null);
        setSelectedBrakeCaliperBrand(null);
        setSelectedCassetteBrand(null);
        setSelectedWheelBrand(null);
        setSelectedRearDerailleurBrand(null);
        setSelectedBrakeRotorBrand(null);
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
        if (activeType === 'FreehubBody') {
            setLoading(false);
            setComponents([]);
            return;
        }

        setLoading(true);
        setError(null);
        resetFilters();

        fetch(`/api/components?type=${activeType}&context=builder`)
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch components');
                return res.json();
            })
            .then(data => {
                if (Array.isArray(data)) {
                    setComponents(data);

                    // Surface a clearer troubleshooting message when the API is reachable
                    // but the database returns no components for the selected type.
                    if (data.length === 0) {
                        setError(`No ${activeType} components were returned by the API. Check database connection and seed data.`);
                    }
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
                    // Clear freehub selection so user re-confirms in the FreehubBody step
                    setFreehubStandard(null);

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
            // Check if this is a Gravel frameset that includes a fork
            const category = ((component as any).specs?.category ||
                             (component as any).attributes?.category || '').toUpperCase();
            const includesFork = (component as any).specs?.includes_fork ??
                                (category === 'GRAVEL');
            const factoryForkWeight = (component as any).specs?.factory_fork_weight || 0;
            const factoryForkName = (component as any).specs?.factory_fork_name || null;

            if (includesFork) {
                // Store the frame and show fork choice modal
                setPendingFrame(component);
                setFactoryForkInfo(factoryForkWeight, factoryForkName);
                setShowForkChoiceModal(true);
                return; // Stop here, wait for user selection
            }

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
                    setFrameCategory(FrameType.GRAVEL);
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
            setFrameCategory(FrameType.GRAVEL);
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
            setFrameCategory(FrameType.GRAVEL);
        }, 300);
    }, [pendingFrame, setPart, setFactoryForkChoice, resetFilters]);

    const [showComplete, setShowComplete] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [saveError, setSaveError] = useState<string | null>(null);
    const [showNameDialog, setShowNameDialog] = useState(false);
    const { isSignedIn } = useSafeUser();

    useEffect(() => {
        if (currentStep === BUILD_SEQUENCE.length - 1 && parts.Seatpost) {
            setTimeout(() => setShowComplete(true), 500);
        }
    }, [currentStep, parts.Seatpost]);

    // Save build handler
    const handleSaveBuild = () => {
        if (!isSignedIn) {
            setSaveError('Please sign in to save builds');
            setSaveStatus('error');
            return;
        }
        setShowNameDialog(true);
    };

    const handleSaveConfirm = async (name: string) => {
        setShowNameDialog(false);
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
                let message = 'Failed to save build';
                try {
                    const payload = await res.json();
                    if (Array.isArray(payload?.violations) && payload.violations.length > 0) {
                        message = `This build includes non-gravel/legacy parts: ${payload.violations.slice(0, 3).join(', ')}`;
                    } else if (payload?.error) {
                        message = payload.error;
                    }
                } catch {
                    const text = await res.text();
                    if (text) message = text;
                }
                setSaveError(message);
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

    const goToStep = (stepIndex: number) => {
        setCurrentStep(stepIndex);
        resetFilters();
    };

    // COMPATIBILITY CHECKING
    const isCompatible = (component: AnyComponent): boolean => {
        if (activeType === 'Frame') return true;

        // Create a baseline build without the candidate component
        const baseBuildData = {
            frame: parts.Frame || undefined,
            fork: parts.Fork || undefined,
            wheels: [parts.WheelFront, parts.WheelRear].filter(Boolean) as any[],
            tires: [parts.TireFront, parts.TireRear].filter(Boolean) as any[],
            bottomBracket: parts.BottomBracket || undefined,
            crankset: parts.Crankset || undefined,
            cassette: parts.Cassette || undefined,
            rearDerailleur: parts.RearDerailleur || undefined,
            shifter: parts.Shifter || undefined,
            brakes: {
                levers: parts.Shifter || undefined,
                calipers: [parts.BrakeCaliperFront, parts.BrakeCaliperRear].filter(Boolean) as any[],
                rotors: [parts.BrakeRotorFront, parts.BrakeRotorRear].filter(Boolean) as any[],
            },
            cockpit: {
                stem: parts.Stem || undefined,
                handlebar: parts.Handlebar || undefined,
                seatpost: parts.Seatpost || undefined
            }
        };

        // Construct a temporary build object with the candidate component
        const tempParts = { ...parts };

        // Add the candidate component
        if (activeType === 'Wheel') {
            // position lives in specs.position (not top-level). Normaliser defaults it to 'Set'.
            const wheelPos = ((component as any).specs?.position || '').toUpperCase();
            if (wheelPos === 'FRONT') {
                tempParts.WheelFront = component as any;
            } else if (wheelPos === 'REAR') {
                tempParts.WheelRear = component as any;
            } else {
                // SET or unknown — treat as a full wheelset for validation
                tempParts.WheelFront = { ...component, specs: { ...(component as any).specs, position: 'Front' } } as any;
                tempParts.WheelRear  = { ...component, specs: { ...(component as any).specs, position: 'Rear'  } } as any;
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

        // Map candidate build to Validator structure
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

        const baseResult = validateBuilderBuild(baseBuildData);
        const result = validateBuilderBuild(buildData);

        const baseErrorMessages = new Set(baseResult.issues.filter(i => i.severity === 'ERROR').map(i => i.message));
        const newErrorMessages = result.issues.filter(i => i.severity === 'ERROR').map(i => i.message);

        // It is compatible if NO NEW errors are introduced by adding this component
        const newlyIntroducedErrors = newErrorMessages.filter(msg => !baseErrorMessages.has(msg));

        return newlyIntroducedErrors.length === 0;
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
            const category = (c as any).category || (c as any).attributes?.category || (c as any).specs?.category;
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

        // Gravel: show gravel forks (rigid and suspension), uncategorised forks — no MTB
        filteredComponents = filteredComponents.filter(c => {
            if (isMTBFork(c)) return false;
            const cat = getForkCategory(c);
            return cat === 'GRAVEL' || cat === '';
        });
    }

    // Tire Category Filtering (Based on Frame)
    if (activeType === 'Tire' && parts.Frame) {

        // Helper to get tire type from multiple possible fields
        const getTireType = (c: any): string => {
            return (c.interfaces?.tire_type || c.attributes?.tire_type ||
                    c.attributes?.purpose || c.specs?.tire_type || '').toUpperCase();
        };

        // Helper to get tire width (returns mm value, or 0 if unparseable)
        const getTireWidth = (c: any): number => {
            const width = c.widthMM || c.specs?.width || c.interfaces?.width || c.attributes?.width || 0;
            if (typeof width === 'number') return width;
            return parseFloat(String(width).replace(/[^0-9.]/g, '')) || 0;
        };

        // Gravel: width is the primary gate (38–60mm).
        // Type tags are only used to block clearly non-gravel tires with unknown width.
        // ROAD-tagged wide tires (e.g. 700×47 gravel/road crossovers) are kept — width decides.
        filteredComponents = filteredComponents.filter(c => {
            const width = getTireWidth(c);

            // Width known — let it through only if in gravel range (38–60mm)
            if (width > 0) return width >= 38 && width <= 60;

            // Width unknown — block only aggressively non-gravel types (Enduro/DH)
            const type = getTireType(c);
            if (['ENDURO', 'DH', 'DOWNHILL'].includes(type)) return false;

            return true;
        });
    }

    // Tire Diameter Filtering (hard filter based on selected wheel)
    if (activeType === 'Tire' && (parts.WheelFront || parts.WheelRear)) {
        const wheel = (parts.WheelFront || parts.WheelRear) as any;

        const normDiam = (v: any): string | null => {
            if (!v) return null;
            const s = String(v).toLowerCase().trim();
            if (!s || s === 'undefined' || s === 'null') return null;
            if (s.includes('700') || s === '29' || s === '29er') return '700c';
            if (s.includes('650') || s.includes('27.5')) return '650b';
            return s;
        };

        const wheelDiam = normDiam(
            wheel.specs?.diameter ||
            wheel.interfaces?.diameter ||
            wheel.attributes?.diameter ||
            wheel.attributes?.wheel_size ||
            wheel.interfaces?.wheel_size
        );

        if (wheelDiam) {
            filteredComponents = filteredComponents.filter(c => {
                const tireDiam = normDiam(
                    (c as any).specs?.diameter ||
                    (c as any).attributes?.diameter ||
                    (c as any).interfaces?.diameter
                );
                // Unknown tire diameter — let through (will show as data-quality warning)
                if (!tireDiam) return true;
                return tireDiam === wheelDiam;
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
            // specs.freehub_body is now populated from raw.freehub | raw.freehub_mount | raw.freehub_standard
            // Fall back through all known storage locations in case normalization is incomplete
            const freehub = (
                (c as any).specs?.freehub_body ||
                (c as any).interfaces?.freehub ||
                (c as any).interfaces?.freehub_mount ||
                (c as any).interfaces?.freehub_standard ||
                (c as any).attributes?.freehub_standard ||
                ''
            ).toUpperCase();
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

    // Crankset drivetrain type + speed pre-filtering
    if (activeType === 'Crankset' && drivetrainType && !cranksetSkipped) {
        filteredComponents = filteredComponents.filter(c => {
            const chainrings = (c as any).specs?.chainrings || (c as any).attributes?.chainrings;
            const name = ((c as any).name || '').toUpperCase();

            if (drivetrainType === '1x') {
                if (Array.isArray(chainrings) && chainrings.length === 1) return true;
                if (name.includes('1X')) return true;
                if (Array.isArray(chainrings) && chainrings.length <= 1) return true;
                if (!chainrings && !name.includes('2X') && !name.match(/\d{2}\/\d{2}/)) return true;
                return false;
            } else {
                if (Array.isArray(chainrings) && chainrings.length >= 2) return true;
                if (name.includes('2X') || name.match(/\d{2}\/\d{2}/)) return true;
                if (name.includes('1X')) return false;
                if (Array.isArray(chainrings) && chainrings.length === 1) return false;
                return true;
            }
        });
    }

    if (activeType === 'Crankset' && drivetrainSpeed && !cranksetSkipped) {
        filteredComponents = filteredComponents.filter(c => {
            const speeds = (c as any).specs?.speeds || (c as any).attributes?.speeds;
            if (speeds && Number(speeds) === drivetrainSpeed) return true;
            if (!speeds) return true;
            return false;
        });
    }

    // Frame tire clearance pre-filter
    // Buckets are "up to Xmm" — we show frames whose max_tire_width is AT LEAST the
    // minimum for that bucket. This way a frame spec'd at 48mm shows for both the
    // "45" and "50" buckets (it can run both). Frames with no clearance data pass through.
    if (activeType === 'Frame' && frameTireClearance && frameTireClearance !== 'all') {
        filteredComponents = filteredComponents.filter(c => {
            const maxTire = (c as any).specs?.max_tire_width || (c as any).specs?.tire_clearance || (c as any).attributes?.max_tire || '';
            const num = parseFloat(String(maxTire).replace(/[^0-9.]/g, ''));
            if (isNaN(num) || num === 0) return true; // No data — let through
            switch (frameTireClearance) {
                case '40':  return num >= 38;          // "Up to 40mm" — frame clears 38mm+
                case '45':  return num >= 40;          // "Up to 45mm" — frame clears 40mm+
                case '50':  return num >= 46;          // "Up to 50mm" — frame clears 46mm+
                case '51+': return num >= 50;          // "51mm+" — frame clears 50mm+
                default:    return true;
            }
        });
    }

    // Frame brand pre-filter
    if (activeType === 'Frame' && selectedBrand) {
        filteredComponents = filteredComponents.filter(c => {
            const brand = c.brand || '';
            return brand.toLowerCase() === selectedBrand.toLowerCase();
        });
    }

    // Frame material pre-filter
    if (activeType === 'Frame' && frameMaterial && frameMaterial !== 'all') {
        console.log('[DEBUG Frame Material] filter active:', frameMaterial, '| before:', filteredComponents.length);
        filteredComponents = filteredComponents.filter(c => {
            const mat = ((c as any).attributes?.material || '').toUpperCase();
            const target = frameMaterial.toUpperCase();
            if (target === 'ALUMINUM') return mat.includes('ALUMINUM') || mat.includes('ALLOY') || mat === 'AL';
            if (target === 'TITANIUM') return mat.includes('TITANIUM') || mat === 'TI';
            const match = mat.includes(target);
            if (!match && mat) console.log('[DEBUG Frame Material]   excluded:', c.name, '| material:', mat);
            if (!mat) console.log('[DEBUG Frame Material]   NO MATERIAL DATA:', c.name);
            return match;
        });
        console.log('[DEBUG Frame Material] after:', filteredComponents.length);
    }

    // Wheel material pre-filter
    if (activeType === 'Wheel' && wheelMaterial && wheelMaterial !== 'all') {
        filteredComponents = filteredComponents.filter(c => {
            const mat = ((c as any).attributes?.material || '').toUpperCase();
            if (wheelMaterial === 'Carbon') return mat.includes('CARBON');
            return !mat.includes('CARBON'); // Alloy
        });
    }

    // Tire size range pre-filter
    if (activeType === 'Tire' && tireSizeRange && tireSizeRange !== 'all') {
        const getTireWidthLocal = (c: any): number => {
            const width = c.widthMM || c.specs?.width || c.interfaces?.width || c.attributes?.width || 0;
            if (typeof width === 'number') return width;
            return parseFloat(String(width).replace(/[^0-9.]/g, '')) || 0;
        };
        filteredComponents = filteredComponents.filter(c => {
            const width = getTireWidthLocal(c as any);
            if (width === 0) return true; // no width data — let compatibility check handle it
            switch (tireSizeRange) {
                case '38-40': return width >= 38 && width <= 40;
                case '41-45': return width >= 41 && width <= 45;
                case '46-50': return width >= 46 && width <= 50;
                case '51+':   return width >= 51;
                default:      return true;
            }
        });
    }

    // Electronic / mechanical pre-filter (RearDerailleur + auto-applies to Shifter)
    if ((activeType === 'RearDerailleur' || activeType === 'Shifter') && drivetrainElectronic && drivetrainElectronic !== 'all') {
        filteredComponents = filteredComponents.filter(c => {
            // DB stores electronic signal in multiple fields depending on which seed file was used:
            // seed.ts:                interfaces.protocol = 'AXS' | cable_pull = 'Di2_12s_Wireless'
            // ingest-missing-parts:   attributes.electronic = true, interfaces.actuation = 'Wireless Electronic'
            const protocol  = String((c as any).interfaces?.protocol  || '').toUpperCase();
            const cablePull = String((c as any).interfaces?.cable_pull || '').toUpperCase();
            const actuation = String((c as any).interfaces?.actuation  || '').toUpperCase();
            const attrElec  = (c as any).attributes?.electronic;
            const isElectronic =
                ['AXS', 'DI2', 'EPS', 'ELECTRONIC', 'WIRELESS'].some(p => protocol.includes(p)) ||
                cablePull.includes('WIRELESS') || cablePull.includes('DI2') ||
                actuation.includes('WIRELESS') || actuation.includes('ELECTRONIC') ||
                attrElec === true || attrElec === 'true' || attrElec === 1 || attrElec === '1';
            return drivetrainElectronic === 'electronic' ? isElectronic : !isElectronic;
        });
    }

    // Brake rotor size pre-filter
    if (activeType === 'BrakeRotor' && rotorSize && rotorSize !== 'all') {
        filteredComponents = filteredComponents.filter(c => {
            // DB stores rotor size in attributes.size (not attributes.rotor_size)
            const size = parseInt(String((c as any).attributes?.size || (c as any).attributes?.rotor_size || (c as any).specs?.rotor_size || 0));
            switch (rotorSize) {
                case '140':  return size === 140;
                case '160':  return size === 160;
                case '180':  return size === 180;
                case '200+': return size >= 200;
                default:     return true;
            }
        });
    }

    // Seatpost type pre-filter
    if (activeType === 'Seatpost' && seatpostType && seatpostType !== 'all') {
        filteredComponents = filteredComponents.filter(c => {
            const isDropper =
                (c as any).interfaces?.dropper === true ||
                (c as any).attributes?.dropper === true;
            return seatpostType === 'dropper' ? isDropper : !isDropper;
        });
    }

    // Crankset brand pre-filter
    if (activeType === 'Crankset' && selectedCranksetBrand && selectedCranksetBrand !== 'all') {
        filteredComponents = filteredComponents.filter(c => {
            const brand = c.brand || '';
            return brand.toLowerCase() === selectedCranksetBrand.toLowerCase();
        });
    }

    // Tire brand pre-filter
    if (activeType === 'Tire' && selectedTireBrand && selectedTireBrand !== 'all') {
        filteredComponents = filteredComponents.filter(c => {
            const brand = c.brand || '';
            return brand.toLowerCase() === selectedTireBrand.toLowerCase();
        });
    }

    // Wheel brand pre-filter
    if (activeType === 'Wheel' && selectedWheelBrand && selectedWheelBrand !== 'all') {
        filteredComponents = filteredComponents.filter(c => {
            const brand = c.brand || '';
            return brand.toLowerCase() === selectedWheelBrand.toLowerCase();
        });
    }

    // RearDerailleur brand pre-filter
    if (activeType === 'RearDerailleur' && selectedRearDerailleurBrand && selectedRearDerailleurBrand !== 'all') {
        filteredComponents = filteredComponents.filter(c => {
            const brand = c.brand || '';
            return brand.toLowerCase() === selectedRearDerailleurBrand.toLowerCase();
        });
    }

    // BrakeRotor brand pre-filter
    if (activeType === 'BrakeRotor' && selectedBrakeRotorBrand && selectedBrakeRotorBrand !== 'all') {
        filteredComponents = filteredComponents.filter(c => {
            const brand = c.brand || '';
            return brand.toLowerCase() === selectedBrakeRotorBrand.toLowerCase();
        });
    }

    // Seatpost brand pre-filter
    if (activeType === 'Seatpost' && selectedSeatpostBrand && selectedSeatpostBrand !== 'all') {
        filteredComponents = filteredComponents.filter(c => {
            const brand = c.brand || '';
            return brand.toLowerCase() === selectedSeatpostBrand.toLowerCase();
        });
    }

    // Stem brand pre-filter
    if (activeType === 'Stem' && selectedStemBrand && selectedStemBrand !== 'all') {
        filteredComponents = filteredComponents.filter(c => {
            const brand = c.brand || '';
            return brand.toLowerCase() === selectedStemBrand.toLowerCase();
        });
    }

    // Handlebar brand pre-filter
    if (activeType === 'Handlebar' && selectedHandlebarBrand && selectedHandlebarBrand !== 'all') {
        filteredComponents = filteredComponents.filter(c => {
            const brand = c.brand || '';
            return brand.toLowerCase() === selectedHandlebarBrand.toLowerCase();
        });
    }

    // BrakeCaliper brand pre-filter
    if (activeType === 'BrakeCaliper' && selectedBrakeCaliperBrand && selectedBrakeCaliperBrand !== 'all') {
        filteredComponents = filteredComponents.filter(c => {
            const brand = c.brand || '';
            return brand.toLowerCase() === selectedBrakeCaliperBrand.toLowerCase();
        });
    }

    // Cassette brand pre-filter
    if (activeType === 'Cassette' && selectedCassetteBrand && selectedCassetteBrand !== 'all') {
        filteredComponents = filteredComponents.filter(c => {
            const brand = c.brand || '';
            return brand.toLowerCase() === selectedCassetteBrand.toLowerCase();
        });
    }

    // Generic brand filter (for parts not handled above)
    if (selectedBrand && !['Frame', 'Crankset', 'Tire', 'Wheel', 'RearDerailleur', 'BrakeRotor', 'Seatpost', 'Stem', 'Handlebar', 'BrakeCaliper', 'Cassette'].includes(activeType)) {
        filteredComponents = filteredComponents.filter(c => c.brand === selectedBrand);
    }

    const uniqueBrands = Array.from(new Set(filteredComponents.map(c => c.brand).filter(Boolean) as string[])).sort();
    const showCategorySelection = activeType === 'Frame' && !frameCategory;
    const showFreehubBodyStep = activeType === 'FreehubBody';

    // Multi-step pre-filter tracker
    const getPreFilterStep = (): number => {
        switch (activeType) {
            case 'Frame':
                if (frameMaterial === null) return 0;
                if (frameTireClearance === null) return 1;
                if (selectedBrand === null) return 2;
                return -1;
            case 'Crankset':
                if (!cranksetSkipped) {
                    if (!drivetrainType) return 0;
                    if (!drivetrainSpeed) return 1;
                }
                if (selectedCranksetBrand === null) return 2;
                return -1;
            case 'Tire':
                if (tireSizeRange === null) return 0;
                if (selectedTireBrand === null) return 1;
                return -1;
            case 'Wheel':
                if (wheelMaterial === null) return 0;
                if (selectedWheelBrand === null) return 1;
                return -1;
            case 'RearDerailleur':
                if (drivetrainElectronic === null) return 0;
                if (selectedRearDerailleurBrand === null) return 1;
                return -1;
            case 'BrakeRotor':
                if (rotorSize === null) return 0;
                if (selectedBrakeRotorBrand === null) return 1;
                return -1;
            case 'Seatpost':
                if (seatpostType === null) return 0;
                if (selectedSeatpostBrand === null) return 1;
                return -1;
            case 'Stem':
                if (selectedStemBrand === null) return 0;
                return -1;
            case 'Handlebar':
                if (selectedHandlebarBrand === null) return 0;
                return -1;
            case 'BrakeCaliper':
                if (selectedBrakeCaliperBrand === null) return 0;
                return -1;
            case 'Cassette':
                if (selectedCassetteBrand === null) return 0;
                return -1;
            default:               return -1;
        }
    };
    const showPreFilter = getPreFilterStep() >= 0;

    // Determine whether the current pre-filter step is the brand step for this type
    const isBrandStep = (): boolean => {
        const step = getPreFilterStep();
        switch (activeType) {
            case 'Frame':           return step === 2;
            case 'Crankset':        return step === 2;
            case 'Tire':            return step === 1;
            case 'Wheel':           return step === 1;
            case 'RearDerailleur':  return step === 1;
            case 'BrakeRotor':      return step === 1;
            case 'Seatpost':        return step === 1;
            case 'Stem':            return step === 0;
            case 'Handlebar':       return step === 0;
            case 'BrakeCaliper':    return step === 0;
            case 'Cassette':        return step === 0;
            default:                return false;
        }
    };

    // Handler called when user picks a filter card option
    const handlePreFilterSelect = (value: string) => {
        const step = getPreFilterStep();
        switch (activeType) {
            case 'Frame':
                if (step === 0) setFrameMaterial(value);
                else if (step === 1) setFrameTireClearance(value);
                else setSelectedBrand(value); break;
            case 'Crankset':
                if (step === 0) setDrivetrainType(value as '1x' | '2x');
                else if (step === 1) setDrivetrainSpeed(Number(value));
                else setSelectedCranksetBrand(value); break;
            case 'Tire':
                if (step === 0) setTireSizeRange(value);
                else setSelectedTireBrand(value); break;
            case 'Wheel':
                if (step === 0) setWheelMaterial(value);
                else setSelectedWheelBrand(value); break;
            case 'RearDerailleur':
                if (step === 0) setDrivetrainElectronic(value);
                else setSelectedRearDerailleurBrand(value); break;
            case 'BrakeRotor':
                if (step === 0) setRotorSize(value);
                else setSelectedBrakeRotorBrand(value); break;
            case 'Seatpost':
                if (step === 0) setSeatpostType(value);
                else setSelectedSeatpostBrand(value); break;
            case 'Stem':         setSelectedStemBrand(value); break;
            case 'Handlebar':    setSelectedHandlebarBrand(value); break;
            case 'BrakeCaliper': setSelectedBrakeCaliperBrand(value); break;
            case 'Cassette':     setSelectedCassetteBrand(value); break;
        }
    };

    // Handler called when user skips the pre-filter
    const handlePreFilterSkip = () => {
        const step = getPreFilterStep();
        switch (activeType) {
            case 'Frame':
                if (step === 0) setFrameMaterial('all');
                else if (step === 1) setFrameTireClearance('all');
                else setSelectedBrand('all'); break;
            case 'Crankset':
                if (step <= 1) setCranksetSkipped(true);
                else setSelectedCranksetBrand('all'); break;
            case 'Tire':
                if (step === 0) setTireSizeRange('all');
                else setSelectedTireBrand('all'); break;
            case 'Wheel':
                if (step === 0) setWheelMaterial('all');
                else setSelectedWheelBrand('all'); break;
            case 'RearDerailleur':
                if (step === 0) setDrivetrainElectronic('all');
                else setSelectedRearDerailleurBrand('all'); break;
            case 'BrakeRotor':
                if (step === 0) setRotorSize('all');
                else setSelectedBrakeRotorBrand('all'); break;
            case 'Seatpost':
                if (step === 0) setSeatpostType('all');
                else setSelectedSeatpostBrand('all'); break;
            case 'Stem':         setSelectedStemBrand('all'); break;
            case 'Handlebar':    setSelectedHandlebarBrand('all'); break;
            case 'BrakeCaliper': setSelectedBrakeCaliperBrand('all'); break;
            case 'Cassette':     setSelectedCassetteBrand('all'); break;
        }
    };

    // Keep legacy compat variable so nothing else in this file breaks
    const showCranksetPreFilter = false;

    const currentStepInfo = BUILD_SEQUENCE[currentStep];

    // Handle back navigation — reverse the multi-step pre-filter
    const handleBack = () => {
        const step = getPreFilterStep();
        if (step < 0) {
            // Not in pre-filter — reverse through filter states, most recent first.
            // For multi-step types: brand → middle steps → first step.

            // Frame: brand → tire clearance → material
            if (activeType === 'Frame' && selectedBrand) {
                setSelectedBrand(null);
            } else if (activeType === 'Frame' && frameTireClearance) {
                setFrameTireClearance(null);
            } else if (activeType === 'Frame' && frameMaterial) {
                setFrameMaterial(null);
            }
            // Crankset: brand → speed → type
            else if (activeType === 'Crankset' && selectedCranksetBrand) {
                setSelectedCranksetBrand(null);
            } else if (activeType === 'Crankset' && drivetrainSpeed && !cranksetSkipped) {
                setDrivetrainSpeed(null);
            } else if (activeType === 'Crankset' && (drivetrainType || cranksetSkipped)) {
                setDrivetrainType(null);
                setCranksetSkipped(false);
            }
            // Tire: brand → size range
            else if (activeType === 'Tire' && selectedTireBrand) {
                setSelectedTireBrand(null);
            } else if (activeType === 'Tire' && tireSizeRange) {
                setTireSizeRange(null);
            }
            // Wheel: brand → material
            else if (activeType === 'Wheel' && selectedWheelBrand) {
                setSelectedWheelBrand(null);
            } else if (activeType === 'Wheel' && wheelMaterial) {
                setWheelMaterial(null);
            }
            // RearDerailleur: brand → electronic/mechanical
            else if (activeType === 'RearDerailleur' && selectedRearDerailleurBrand) {
                setSelectedRearDerailleurBrand(null);
            } else if (activeType === 'RearDerailleur' && drivetrainElectronic) {
                setDrivetrainElectronic(null);
            }
            // BrakeRotor: brand → size
            else if (activeType === 'BrakeRotor' && selectedBrakeRotorBrand) {
                setSelectedBrakeRotorBrand(null);
            } else if (activeType === 'BrakeRotor' && rotorSize) {
                setRotorSize(null);
            }
            // Seatpost: brand → type
            else if (activeType === 'Seatpost' && selectedSeatpostBrand) {
                setSelectedSeatpostBrand(null);
            } else if (activeType === 'Seatpost' && seatpostType) {
                setSeatpostType(null);
            }
            // Single-step types: brand only
            else if (activeType === 'Stem' && selectedStemBrand) {
                setSelectedStemBrand(null);
            } else if (activeType === 'Handlebar' && selectedHandlebarBrand) {
                setSelectedHandlebarBrand(null);
            } else if (activeType === 'BrakeCaliper' && selectedBrakeCaliperBrand) {
                setSelectedBrakeCaliperBrand(null);
            } else if (activeType === 'Cassette' && selectedCassetteBrand) {
                setSelectedCassetteBrand(null);
            }
            // Fallbacks
            else if (frameCategory) {
                setFrameCategory(FrameType.GRAVEL);
            } else if (currentStep > 0) {
                setCurrentStep(prev => prev - 1);
            }
        } else {
            // In pre-filter — go back one sub-step.
            // When AT step N (about to select N), going back means undoing step N-1's selection.
            // At step 0 (nothing selected yet), go to the previous build step.
            switch (activeType) {
                case 'Frame':
                    if (step === 2) { setFrameTireClearance(null); }      // undo clearance, back to step 1
                    else if (step === 1) { setFrameMaterial(null); }       // undo material, back to step 0
                    else { setCurrentStep(prev => prev - 1); }             // step 0: previous build step
                    break;
                case 'Crankset':
                    if (step === 2) { setDrivetrainSpeed(null); }          // undo speed, back to step 1
                    else if (step === 1) { setDrivetrainType(null); setCranksetSkipped(false); } // undo type
                    else { setCurrentStep(prev => prev - 1); }
                    break;
                case 'Tire':
                    if (step === 1) { setTireSizeRange(null); }            // undo size range, back to step 0
                    else { setCurrentStep(prev => prev - 1); }
                    break;
                case 'Wheel':
                    if (step === 1) { setWheelMaterial(null); }            // undo material, back to step 0
                    else { setCurrentStep(prev => prev - 1); }
                    break;
                case 'RearDerailleur':
                    if (step === 1) { setDrivetrainElectronic(null); }     // undo electronic, back to step 0
                    else { setCurrentStep(prev => prev - 1); }
                    break;
                case 'BrakeRotor':
                    if (step === 1) { setRotorSize(null); }                // undo size, back to step 0
                    else { setCurrentStep(prev => prev - 1); }
                    break;
                case 'Seatpost':
                    if (step === 1) { setSeatpostType(null); }             // undo type, back to step 0
                    else { setCurrentStep(prev => prev - 1); }
                    break;
                default:
                    if (currentStep > 0) { setCurrentStep(prev => prev - 1); }
            }
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-gray-950 overflow-hidden relative">
            {/* Build Name Dialog */}
            <InputDialog
                isOpen={showNameDialog}
                title="Name Your Build"
                message="Give your build a name so you can find it later in the Garage."
                defaultValue={parts.Frame?.name || 'My Build'}
                placeholder="e.g. Sunday Race Rig"
                confirmLabel="Save Build"
                onConfirm={handleSaveConfirm}
                onCancel={() => setShowNameDialog(false)}
            />

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
                                        chainrings={shareChainrings}
                                        cassetteCogs={shareCassetteCogs}
                                        totalWeight={totalWeight}
                                        climbingScore={shareClimbingScore}
                                        speedRange={shareSpeedRange}
                                        unitSystem={unitSystem}
                                        isModal={false}
                                    />
                                    {shareWhatIfDelta && (
                                        <p className="mt-3 text-[11px] text-stone-400">
                                            Cross-tool what-if (rear tire +4mm): top speed {shareWhatIfDelta.topSpeedDeltaKph >= 0 ? '+' : ''}{shareWhatIfDelta.topSpeedDeltaKph.toFixed(1)} km/h,
                                            cadence {shareWhatIfDelta.cadenceDeltaRpmAtGrade >= 0 ? '+' : ''}{shareWhatIfDelta.cadenceDeltaRpmAtGrade.toFixed(0)} rpm @8%, pressure hint {shareWhatIfDelta.pressureHintDeltaPct.toFixed(1)}%.
                                        </p>
                                    )}
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
                    {!loading && !showCategorySelection && !showCranksetPreFilter && !showFreehubBodyStep && (() => {
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
                    {!loading && !showCategorySelection && !showCranksetPreFilter && !showFreehubBodyStep && (
                        <div className="mb-4 p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                            <p className="text-xs text-cyan-200">
                                <span className="font-semibold">Gravel-only Builder Mode:</span> this builder surfaces only gravel-eligible components.
                            </p>
                        </div>
                    )}

                    {/* Freehub/Ecosystem Reminder Banner (green accent) - dismissible */}
                    {!loading && !showCategorySelection && !showCranksetPreFilter && !showFreehubBodyStep && selectedFreehubStandard && !freehubReminderDismissed &&
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
                                        {selectedFreehubStandard === 'HG' && 'Shimano HG (common gravel-compatible standard)'}
                                        {selectedFreehubStandard === 'XDR' && 'SRAM XDR (modern gravel/road 12s)'}
                                        {selectedFreehubStandard === 'XD' && 'SRAM XD (wide-range compatible, 10T capable)'}
                                        {selectedFreehubStandard === 'MICROSPLINE' && 'Shimano Microspline (Shimano 12s)'}
                                        {selectedFreehubStandard === 'N3W' && 'Campagnolo N3W (Campagnolo 13s)'}
                                        {!['HG', 'XDR', 'XD', 'MICROSPLINE', 'N3W'].includes(selectedFreehubStandard) && selectedFreehubStandard}
                                    </span>
                                </p>
                                <p className="text-xs text-emerald-400/70 mt-1">
                                    {selectedFreehubStandard === 'XDR' && 'Choose SRAM gravel-friendly groupset components (Red, Force, Rival, Apex, XPLR)'}
                                    {selectedFreehubStandard === 'XD' && 'Choose wide-range compatible drivetrain components for steep gravel gearing'}
                                    {selectedFreehubStandard === 'HG' && 'Choose Shimano-compatible groupset components (especially GRX and compatible HG cassettes)'}
                                    {selectedFreehubStandard === 'MICROSPLINE' && 'Choose Shimano 12-speed compatible components where Microspline is required'}
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
                    {!loading && !showCategorySelection && !showCranksetPreFilter && !showFreehubBodyStep && BUILD_STEP_INFO[activeType] && !dismissedInfoBoxes.has(activeType) && (
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
                        ) : showFreehubBodyStep ? (
                            <FreehubBodyStep
                                wheelFreehubHint={
                                    (parts.WheelRear as any)?.specs?.freehub_body ||
                                    (parts.WheelRear as any)?.interfaces?.freehub ||
                                    null
                                }
                                currentSelection={selectedFreehubStandard}
                                onSelect={(standard) => {
                                    setFreehubStandard(standard);
                                    setTimeout(() => {
                                        if (currentStep < BUILD_SEQUENCE.length - 1) {
                                            setCurrentStep(prev => prev + 1);
                                            resetFilters();
                                        }
                                    }, 300);
                                }}
                                onSkip={() => {
                                    setFreehubStandard(null);
                                    setTimeout(() => {
                                        if (currentStep < BUILD_SEQUENCE.length - 1) {
                                            setCurrentStep(prev => prev + 1);
                                            resetFilters();
                                        }
                                    }, 300);
                                }}
                            />
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
                        ) : showPreFilter ? (
                            <ComponentPreFilter
                                activeType={activeType}
                                drivetrainType={drivetrainType}
                                step={getPreFilterStep()}
                                brands={isBrandStep() ? uniqueBrands : undefined}
                                onSelect={handlePreFilterSelect}
                                onSkip={handlePreFilterSkip}
                            />
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {/* Compatible parts first */}
                                {filteredComponents.map((comp) => {
                                    const signal = getCompatibilitySignal(comp, parts, activeType);
                                    return (
                                    <PartCard
                                        key={comp.id}
                                        component={comp}
                                        isSelected={false}
                                        onSelect={handleSelectPart}
                                        compatibilityConfidence={signal.confidence}
                                        compatibilityReason={signal.reason}
                                    />
                                    );
                                })}
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
                                        <p className="mb-2">No gravel-compatible components found for this step.</p>
                                        <p className="text-xs text-stone-600 mb-3">
                                            Try adjusting earlier selections, or verify gravel entries are marked builder-eligible in the catalog.
                                        </p>
                                        <button
                                            onClick={() => setShowIncompatible(true)}
                                            className="text-primary hover:underline"
                                        >
                                            Show all loaded parts to diagnose
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

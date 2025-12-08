'use client';

import React from 'react';
import { AnyComponent } from '@/store/buildStore';
import { Plus, Check, ExternalLink, Ban } from 'lucide-react';

interface PartCardProps {
    component: AnyComponent;
    onSelect: (component: AnyComponent) => void;
    isSelected: boolean;
    isIncompatible?: boolean;
    incompatibilityReason?: string;
}

export const PartCard: React.FC<PartCardProps> = ({
    component,
    onSelect,
    isSelected,
    isIncompatible = false,
    incompatibilityReason
}) => {
    const handleSelect = () => {
        // haptic('medium');
        onSelect(component);
    };

    // Helper to check if a property exists (type guard style)
    const hasProp = <K extends string>(obj: any, key: K): boolean => key in obj;

    // Get type-specific important specs
    const getTypeSpecs = (): Array<{ label: string; value: string }> => {
        const result: Array<{ label: string; value: string }> = [];
        const c = component as any;

        // Helper to find value from multiple possible locations
        const get = (...keys: string[]): any => {
            for (const key of keys) {
                // Check direct, specs, attributes, interfaces
                if (c[key] !== undefined && c[key] !== null && c[key] !== '') return c[key];
                if (c.specs?.[key] !== undefined && c.specs?.[key] !== null && c.specs?.[key] !== '') return c.specs[key];
                if (c.attributes?.[key] !== undefined && c.attributes?.[key] !== null && c.attributes?.[key] !== '') return c.attributes[key];
                if (c.interfaces?.[key] !== undefined && c.interfaces?.[key] !== null && c.interfaces?.[key] !== '') return c.interfaces[key];
            }
            return null;
        };

        const type = c.type;

        // ==================== FRAME ====================
        if (type === 'Frame') {
            const category = get('category');
            if (category) result.push({ label: 'Type', value: category });

            const bb = get('bb_shell', 'bottom_bracket_shell');
            if (bb) result.push({ label: 'BB Shell', value: bb });

            const axle = get('rear_axle', 'axle_standard');
            if (axle) result.push({ label: 'Rear Axle', value: axle });

            const maxTire = get('max_tire', 'max_tire_width');
            if (maxTire) result.push({ label: 'Max Tire', value: typeof maxTire === 'number' ? `${maxTire}mm` : maxTire });
        }

        // ==================== FORK ====================
        else if (type === 'Fork') {
            const steerer = get('steerer', 'steerer_tube');
            if (steerer) result.push({ label: 'Steerer', value: steerer });

            const axle = get('axle', 'axle_standard', 'front_axle');
            if (axle) result.push({ label: 'Axle', value: axle });

            const maxTire = get('max_tire', 'max_tire_width');
            if (maxTire) result.push({ label: 'Max Tire', value: typeof maxTire === 'number' ? `${maxTire}mm` : maxTire });

            if (component.weightGrams) result.push({ label: 'Weight', value: `${component.weightGrams}g` });
        }

        // ==================== WHEEL ====================
        else if (type === 'Wheel') {
            const diameter = get('diameter', 'size', 'wheel_size');
            if (diameter) result.push({ label: 'Size', value: diameter });

            const freehub = get('freehub', 'freehub_body');
            if (freehub) {
                const display = Array.isArray(freehub) ? freehub.join(', ') : freehub;
                result.push({ label: 'Freehub', value: display.replace(/Shimano /g, '').replace(/SRAM /g, '') });
            }

            const innerWidth = get('internal_width', 'internalWidth', 'inner_width');
            if (innerWidth) result.push({ label: 'Inner Width', value: `${innerWidth}mm` });

            if (component.weightGrams) result.push({ label: 'Weight', value: `${component.weightGrams}g` });
        }

        // ==================== TIRE ====================
        else if (type === 'Tire') {
            const width = get('width', 'widthMM', 'width_mm');
            if (width) result.push({ label: 'Width', value: typeof width === 'number' ? `${width}mm` : width });

            const diameter = get('diameter', 'size_label');
            if (diameter) result.push({ label: 'Size', value: diameter });

            const tubeless = get('tubeless', 'tubeless_ready');
            if (tubeless !== null) result.push({ label: 'Tubeless', value: tubeless ? 'Ready' : 'No' });

            if (component.weightGrams) result.push({ label: 'Weight', value: `${component.weightGrams}g` });
        }

        // ==================== BOTTOM BRACKET ====================
        else if (type === 'BottomBracket') {
            const shell = get('frame_shell', 'frame_interface', 'bb_shell', 'shell');
            if (shell) result.push({ label: 'Shell', value: shell });

            const spindle = get('crank_spindle', 'crank_interface', 'spindle_interface');
            if (spindle) result.push({ label: 'Spindle', value: spindle });

            const width = get('shell_width', 'width');
            if (width) result.push({ label: 'Width', value: typeof width === 'number' ? `${width}mm` : width });

            if (component.weightGrams) result.push({ label: 'Weight', value: `${component.weightGrams}g` });
        }

        // ==================== CRANKSET ====================
        else if (type === 'Crankset') {
            // Chainrings - CRITICAL for users
            const teeth = get('teeth', 'chainrings');
            if (teeth) {
                const rings = Array.isArray(teeth) ? teeth : String(teeth).split(/[,\/]/).map(t => t.trim());
                const setup = rings.length === 1 ? '1x' : '2x';
                result.push({ label: 'Gearing', value: `${setup} ${rings.join('/')}t` });
            }

            const spindle = get('spindle', 'spindle_type');
            if (spindle) result.push({ label: 'Spindle', value: spindle });

            const length = get('crank_length', 'arm_length', 'length');
            if (length) result.push({ label: 'Length', value: typeof length === 'number' ? `${length}mm` : length });

            if (component.weightGrams) result.push({ label: 'Weight', value: `${component.weightGrams}g` });
        }

        // ==================== CASSETTE ====================
        else if (type === 'Cassette') {
            const speeds = get('speeds', 'speed');
            if (speeds) result.push({ label: 'Speed', value: `${speeds}s` });

            const range = get('range');
            if (range) {
                const display = Array.isArray(range) ? `${range[0]}-${range[1]}t` : range;
                result.push({ label: 'Range', value: display });
            }

            const freehub = get('freehub_mount', 'freehub_standard', 'freehub_body', 'freehub');
            if (freehub) {
                const map: Record<string, string> = {
                    'Shimano Micro Spline': 'MicroSpline', 'Shimano HG': 'HG',
                    'SRAM XDR': 'XDR', 'SRAM XD': 'XD', 'Campagnolo N3W': 'N3W'
                };
                result.push({ label: 'Freehub', value: map[freehub] || freehub.replace(/Shimano |SRAM /g, '') });
            }

            if (component.weightGrams) result.push({ label: 'Weight', value: `${component.weightGrams}g` });
        }

        // ==================== REAR DERAILLEUR ====================
        else if (type === 'RearDerailleur') {
            const speeds = get('speeds', 'speed');
            if (speeds) result.push({ label: 'Speed', value: `${speeds}s` });

            const maxCog = get('max_cog', 'max_cog_capacity');
            if (maxCog) result.push({ label: 'Max Cog', value: `${maxCog}t` });

            // Electronic vs Mechanical
            const electronic = get('electronic');
            const actuation = get('actuation');
            if (electronic !== null) {
                result.push({ label: 'Type', value: electronic ? 'Electronic' : 'Mechanical' });
            } else if (actuation) {
                result.push({ label: 'Type', value: actuation.toLowerCase().includes('electronic') ? 'Electronic' : 'Mechanical' });
            }

            const cage = get('cage_length', 'cage');
            if (cage) result.push({ label: 'Cage', value: cage });
        }

        // ==================== SHIFTER ====================
        else if (type === 'Shifter') {
            const speeds = get('speeds', 'speed');
            if (speeds) result.push({ label: 'Speed', value: `${speeds}s` });

            const barType = get('bar_type', 'type');
            if (barType) {
                const display = barType.toLowerCase().includes('drop') ? 'Drop Bar' :
                               barType.toLowerCase().includes('flat') ? 'Flat Bar' : barType;
                result.push({ label: 'Bar Type', value: display });
            }

            // Electronic vs Mechanical
            const electronic = get('electronic');
            const actuation = get('actuation');
            if (electronic !== null) {
                result.push({ label: 'Shifting', value: electronic ? 'Electronic' : 'Mechanical' });
            } else if (actuation) {
                result.push({ label: 'Shifting', value: actuation.toLowerCase().includes('electronic') ? 'Electronic' : 'Mechanical' });
            }

            if (component.weightGrams) result.push({ label: 'Weight', value: `${component.weightGrams}g` });
        }

        // ==================== BRAKE CALIPER ====================
        else if (type === 'BrakeCaliper') {
            const actuation = get('actuation', 'type');
            if (actuation) {
                const display = actuation.toLowerCase().includes('hydraulic') ? 'Hydraulic' :
                               actuation.toLowerCase().includes('mechanical') ? 'Mechanical' : actuation;
                result.push({ label: 'Type', value: display });
            }

            const mount = get('mount_type', 'mount', 'brake_mount');
            if (mount) result.push({ label: 'Mount', value: mount });

            if (component.weightGrams) result.push({ label: 'Weight', value: `${component.weightGrams}g` });
        }

        // ==================== BRAKE ROTOR ====================
        else if (type === 'BrakeRotor') {
            const size = get('size', 'diameter', 'rotor_size');
            if (size) result.push({ label: 'Size', value: typeof size === 'number' ? `${size}mm` : size });

            const mount = get('mount', 'mount_type', 'interface');
            if (mount) result.push({ label: 'Mount', value: mount });

            if (component.weightGrams) result.push({ label: 'Weight', value: `${component.weightGrams}g` });
        }

        // ==================== STEM ====================
        else if (type === 'Stem') {
            const length = get('length');
            if (length) result.push({ label: 'Length', value: typeof length === 'number' ? `${length}mm` : length });

            const angle = get('angle', 'rise');
            if (angle !== null) result.push({ label: 'Angle', value: `${angle}°` });

            const clamp = get('clamp', 'clamp_dia', 'bar_clamp');
            if (clamp) result.push({ label: 'Clamp', value: typeof clamp === 'number' ? `${clamp}mm` : clamp });

            if (component.weightGrams) result.push({ label: 'Weight', value: `${component.weightGrams}g` });
        }

        // ==================== HANDLEBAR ====================
        else if (type === 'Handlebar') {
            const width = get('width');
            if (width) result.push({ label: 'Width', value: typeof width === 'number' ? `${width}mm` : width });

            const barType = get('bar_type', 'type');
            if (barType) result.push({ label: 'Type', value: barType });

            const drop = get('drop');
            if (drop) result.push({ label: 'Drop', value: typeof drop === 'number' ? `${drop}mm` : drop });

            const reach = get('reach');
            if (reach) result.push({ label: 'Reach', value: typeof reach === 'number' ? `${reach}mm` : reach });
        }

        // ==================== SEATPOST ====================
        else if (type === 'Seatpost') {
            const diameter = get('diameter', 'size');
            if (diameter) result.push({ label: 'Diameter', value: typeof diameter === 'number' ? `${diameter}mm` : diameter });

            const length = get('length');
            if (length) result.push({ label: 'Length', value: typeof length === 'number' ? `${length}mm` : length });

            const travel = get('travel');
            if (travel) result.push({ label: 'Travel', value: typeof travel === 'number' ? `${travel}mm` : travel });

            if (component.weightGrams) result.push({ label: 'Weight', value: `${component.weightGrams}g` });
        }

        // ==================== CHAIN ====================
        else if (type === 'Chain') {
            const speeds = get('speeds', 'speed');
            if (speeds) result.push({ label: 'Speed', value: `${speeds}s` });

            const links = get('links', 'length');
            if (links) result.push({ label: 'Links', value: `${links}` });

            if (component.weightGrams) result.push({ label: 'Weight', value: `${component.weightGrams}g` });
        }

        return result.slice(0, 4);
    };

    const specs = getTypeSpecs();
    const c = component as any;
    let displayName = `${component.brand} ${component.model}`;

    // Universal cleanup - remove common redundant words
    const removeRedundantWords = (name: string, type: string): string => {
        let cleaned = name
            .replace(/\(.*?\)/gi, '') // Remove all parentheses content
            .replace(/\s+/g, ' ') // Normalize whitespace
            .trim();

        // Remove category words that are already shown in the UI context
        const categoryWords: Record<string, RegExp[]> = {
            'Crankset': [/crankset/gi, /crank\s*set/gi, /crank/gi],
            'Cassette': [/cassette/gi],
            'RearDerailleur': [/rear\s*derailleur/gi, /derailleur/gi, /rear\s*mech/gi, /rd[-\s]/gi],
            'Shifter': [/shifters?/gi, /levers?/gi, /sti\s*levers?/gi],
            'BottomBracket': [/bottom\s*bracket/gi, /bb\s/gi],
            'BrakeCaliper': [/brake\s*calipers?/gi, /calipers?/gi, /disc\s*brakes?/gi, /brakes?/gi],
            'BrakeRotor': [/brake\s*rotors?/gi, /rotors?/gi, /disc/gi],
            'Handlebar': [/handlebars?/gi, /bars?$/gi],
            'Seatpost': [/seatposts?/gi, /seat\s*posts?/gi],
            'Stem': [/stems?$/gi],
            'Fork': [/forks?$/gi, /suspension\s*fork/gi],
            'Wheel': [/wheels?$/gi, /wheelsets?/gi],
            'Tire': [/tires?$/gi, /tyres?$/gi],
        };

        if (categoryWords[type]) {
            categoryWords[type].forEach(regex => {
                cleaned = cleaned.replace(regex, '');
            });
        }

        return cleaned.replace(/\s+/g, ' ').trim();
    };

    // Type-specific cleanup
    const type = c.type;
    displayName = removeRedundantWords(displayName, type);

    // Seatpost: remove sizing info
    if (type === 'Seatpost') {
        displayName = displayName
            .replace(/\s\d+(\.\d+)?mm/gi, '') // Remove "27.2mm", "30.9mm"
            .replace(/\s\d+(\.\d+)?x\d+(\.\d+)?mm/gi, '') // Remove "27.2x350mm"
            .replace(/\s\d+mm\sOffset/gi, '') // Remove "20mm Offset"
            .trim();
    }

    // Crankset: remove teeth/length info (shown in specs)
    if (type === 'Crankset') {
        displayName = displayName
            .replace(/\s\d+x\s*/gi, ' ') // Remove "1x", "2x"
            .replace(/\s\d+\/\d+t?/gi, '') // Remove "52/36", "52/36t"
            .replace(/\s\d+t\b/gi, '') // Remove "40t"
            .replace(/\s\d+(.\d+)?mm/gi, '') // Remove "172.5mm" (length)
            .trim();
    }

    // Cassette: remove speed/range info (shown in specs)
    if (type === 'Cassette') {
        displayName = displayName
            .replace(/\s\d+-\d+t?/gi, '') // Remove "10-52t", "11-34"
            .replace(/\s\d+s(peed)?/gi, '') // Remove "12s", "12speed"
            .trim();
    }

    // Rear Derailleur: clean model codes
    if (type === 'RearDerailleur') {
        displayName = displayName
            .replace(/RD-[A-Z0-9-]+/gi, '') // Remove model codes like RD-M8120-SGS
            .replace(/\s\d+s(peed)?/gi, '') // Remove "12s", "12-speed" (shown in specs)
            .trim();
    }

    // Shifter: remove speed info (shown in specs)
    if (type === 'Shifter') {
        displayName = displayName
            .replace(/\s\d+sp(eed)?/gi, '') // Remove "12sp", "11sp", "12speed"
            .replace(/\s(mechanical|electronic)/gi, '') // Remove type (shown in specs)
            .replace(/\sTrigger/gi, '')
            .trim();
    }

    // Brake Caliper: remove position info
    if (type === 'BrakeCaliper') {
        displayName = displayName
            .replace(/\s(FRONT|REAR|Set|Pair)/gi, '')
            .trim();
    }

    // Final cleanup - remove double spaces and trim
    displayName = displayName.replace(/\s+/g, ' ').trim();

    // If name got too short, fall back to brand + model
    if (displayName.length < 5) {
        displayName = `${component.brand} ${component.model}`.replace(/\s+/g, ' ').trim();
    }

    // Determine component type label (simplistic)
    const typeLabel = 'type' in component ? (component as any).type :
        'position' in component ? (component as any).position :
            'Part';

    return (
        <div
            className={`group relative rounded-2xl border transition-all duration-200 overflow-hidden ${
                isIncompatible
                    ? 'bg-white/[0.01] border-white/5 opacity-60'
                    : isSelected
                        ? 'bg-primary/10 border-primary/40 shadow-lg shadow-primary/10'
                        : 'bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.04]'
            }`}
        >
            {/* Incompatibility badge */}
            {isIncompatible && incompatibilityReason && (
                <div className="absolute top-2 right-2 z-10 px-2 py-1 rounded-md bg-amber-500/20 border border-amber-500/30 flex items-center gap-1.5">
                    <Ban className="w-3 h-3 text-amber-400" />
                    <span className="text-[10px] font-medium text-amber-300 max-w-[140px] truncate" title={incompatibilityReason}>
                        {incompatibilityReason}
                    </span>
                </div>
            )}

            {/* Main content - tappable area */}
            <button
                onClick={handleSelect}
                disabled={isIncompatible}
                className={`w-full text-left p-4 sm:p-5 focus:outline-none ${isIncompatible ? 'cursor-not-allowed' : ''}`}
            >
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="min-w-0 flex-1">
                        <h3 className={`font-semibold text-base sm:text-lg leading-tight mb-1.5 transition-colors ${
                            isIncompatible
                                ? 'text-stone-500'
                                : isSelected
                                    ? 'text-primary'
                                    : 'text-stone-100 group-hover:text-primary'
                        }`}>
                            {displayName}
                        </h3>
                        <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-medium bg-white/5 uppercase tracking-wider max-w-[120px] truncate ${
                            isIncompatible ? 'text-stone-600' : 'text-stone-500'
                        }`}>
                            {component.brand}
                        </span>
                    </div>

                    {/* Selection indicator */}
                    {!isIncompatible && (
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
                    )}
                </div>

                {/* Specs Grid */}
                {specs.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mb-3">
                        {specs.map((spec) => (
                            <div key={spec.label} className={`rounded-lg p-2.5 border overflow-hidden ${
                                isIncompatible
                                    ? 'bg-white/[0.01] border-white/[0.03]'
                                    : 'bg-white/[0.03] border-white/5'
                            }`}>
                                <p className="text-[10px] text-stone-500 uppercase tracking-wider mb-0.5 truncate">
                                    {spec.label}
                                </p>
                                <p className={`text-sm font-medium font-mono truncate ${
                                    isIncompatible ? 'text-stone-500' : 'text-stone-200'
                                }`} title={spec.value}>
                                    {spec.value}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </button>
        </div>
    );
};


'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

interface FilterCard {
    value: string;
    label: string;
    description: string;
    imagePath: string;
    emoji: string;
}

function FilterCardButton({
    card,
    onSelect,
    index,
}: {
    card: FilterCard;
    onSelect: (v: string) => void;
    index: number;
}) {
    const [imgError, setImgError] = useState(false);

    return (
        <motion.button
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.07, type: 'spring', stiffness: 300, damping: 24 }}
            onClick={() => onSelect(card.value)}
            className="group relative rounded-2xl bg-stone-900 border border-white/8 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 transition-all duration-200 overflow-hidden text-left hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
            {/* Image / fallback area */}
            <div className="relative w-full aspect-video bg-stone-800 overflow-hidden">
                {!imgError ? (
                    <img
                        src={card.imagePath}
                        alt={card.label}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-stone-800 via-stone-900 to-gray-950">
                        <span className="text-5xl select-none">{card.emoji}</span>
                    </div>
                )}
                {/* Bottom fade so text area blends */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/20 to-transparent pointer-events-none" />
            </div>

            {/* Text */}
            <div className="p-4">
                <h3 className="text-sm font-bold text-stone-100 group-hover:text-primary transition-colors mb-1">
                    {card.label}
                </h3>
                <p className="text-xs text-stone-500 leading-relaxed">{card.description}</p>
            </div>

            {/* Hover arrow badge */}
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="p-1 rounded-full bg-primary/20 backdrop-blur-sm">
                    <ChevronRight className="w-3.5 h-3.5 text-primary" />
                </div>
            </div>
        </motion.button>
    );
}

interface PreFilterScreenProps {
    question: string;
    subtitle?: string;
    cards: FilterCard[];
    onSelect: (value: string) => void;
    onSkip: () => void;
    columns?: 2 | 4;
}

function PreFilterScreen({ question, subtitle, cards, onSelect, onSkip, columns = 2 }: PreFilterScreenProps) {
    const gridClass =
        columns === 4
            ? 'grid grid-cols-2 lg:grid-cols-4 gap-3'
            : 'grid grid-cols-1 sm:grid-cols-2 gap-4';

    return (
        <motion.div
            key={question}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            className="space-y-5"
        >
            <div>
                <motion.h2
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xl font-bold text-stone-100 mb-1"
                >
                    {question}
                </motion.h2>
                {subtitle && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-sm text-stone-500"
                    >
                        {subtitle}
                    </motion.p>
                )}
            </div>

            <div className={gridClass}>
                {cards.map((card, i) => (
                    <FilterCardButton key={card.value} card={card} onSelect={onSelect} index={i} />
                ))}
            </div>

            <div className="text-center pt-1">
                <button
                    onClick={onSkip}
                    className="text-xs text-stone-600 hover:text-stone-400 transition-colors underline underline-offset-2"
                >
                    Skip filter — show all options
                </button>
            </div>
        </motion.div>
    );
}

// ─── Main export ─────────────────────────────────────────────────────────────

export interface ComponentPreFilterProps {
    activeType: string;
    /** Only needed for crankset sub-step routing */
    drivetrainType: '1x' | '2x' | null;
    /** Current pre-filter step for this activeType (0 = first filter screen) */
    step: number;
    /** All available brand names for brand-filter screens */
    brands?: string[];
    onSelect: (value: string) => void;
    onSkip: () => void;
}

export function ComponentPreFilter({
    activeType,
    drivetrainType,
    step,
    brands,
    onSelect,
    onSkip,
}: ComponentPreFilterProps) {
    const base = '/filter-cards';

    // ── FRAME — Tire Clearance (step 1, after material) ──────────────────────
    if (activeType === 'Frame' && step === 1) {
        return (
            <PreFilterScreen
                question="What tire clearance do you need?"
                subtitle="Measured in mm — check your terrain and riding style"
                columns={2}
                onSelect={onSelect}
                onSkip={onSkip}
                cards={[
                    {
                        value: '40',
                        label: 'Up to 40mm',
                        description: 'Road-biased gravel — fast, efficient, smooth terrain',
                        imagePath: `${base}/tire-38-40.webp`,
                        emoji: '🏎️',
                    },
                    {
                        value: '45',
                        label: 'Up to 45mm',
                        description: 'The new sweet spot — mixed surfaces, daily riders',
                        imagePath: `${base}/tire-41-45.webp`,
                        emoji: '🌄',
                    },
                    {
                        value: '50',
                        label: 'Up to 50mm',
                        description: 'Adventure-ready — chunky gravel, bikepacking, loaded builds',
                        imagePath: `${base}/tire-46-50.webp`,
                        emoji: '🏔️',
                    },
                    {
                        value: '57+',
                        label: '57mm +',
                        description: 'Monster clearance — mountain gravel, technical singletrack',
                        imagePath: `${base}/tire-51plus.webp`,
                        emoji: '🦏',
                    },
                ]}
            />
        );
    }

    // ── FRAME — Brand (step 2, after clearance) ─────────────────────────────
    if (activeType === 'Frame' && step === 2 && brands && brands.length > 0) {
        return (
            <PreFilterScreen
                question="What brand are you looking for?"
                subtitle="Narrow your frame search by manufacturer"
                columns={2}
                onSelect={onSelect}
                onSkip={onSkip}
                cards={brands.map(brand => ({
                    value: brand,
                    label: brand,
                    description: `Gravel frames from ${brand}`,
                    imagePath: `${base}/brand-${brand.toLowerCase().replace(/\s+/g, '-')}.webp`,
                    emoji: '🚲',
                }))}
            />
        );
    }

    // ── CRANKSET — Brand (step 2, after speed) ───────────────────────────────
    if (activeType === 'Crankset' && step === 2 && brands && brands.length > 0) {
        return (
            <PreFilterScreen
                question="What crankset brand?"
                subtitle="Pick your drivetrain ecosystem"
                columns={2}
                onSelect={onSelect}
                onSkip={onSkip}
                cards={brands.map(brand => ({
                    value: brand,
                    label: brand,
                    description: `${brand} cranksets — ${(brand.includes('SRAM') || brand.includes('sram')) ? 'wide-range XD/XDR compatible' : (brand.includes('Shimano') || brand.includes('shimano') ? 'HG compatibility' : 'premium drivetrain components')}`,
                    imagePath: `${base}/brand-${brand.toLowerCase().replace(/\s+/g, '-')}.webp`,
                    emoji: '⚙️',
                }))}
            />
        );
    }

    // ── TIRE — Brand (step 1, after size range) ──────────────────────────────
    if (activeType === 'Tire' && step === 1 && brands && brands.length > 0) {
        return (
            <PreFilterScreen
                question="What tire brand?"
                subtitle="Choose your preferred tire manufacturer"
                columns={2}
                onSelect={onSelect}
                onSkip={onSkip}
                cards={brands.map((brand, i) => ({
                    value: brand,
                    label: brand,
                    description: `${brand} gravel tires — ${(brand.includes('WTB') || brand.includes('Panaracer')) ? 'proven gravel specialists' : (brand.includes('Schwalbe') || brand.includes('Pirelli') ? 'European engineering, tubeless experts' : 'performance tires')}`,
                    imagePath: `${base}/brand-${brand.toLowerCase().replace(/\s+/g, '-')}.webp`,
                    emoji: ['🔵','🟢','🔴','🟡','🟠','⚪'][i % 6],
                }))}
            />
        );
    }

    // ── FRAME ────────────────────────────────────────────────────────────────
    if (activeType === 'Frame') {
        return (
            <PreFilterScreen
                question="What's your frame material?"
                subtitle="Shapes weight, ride feel, and price — pick what matters most to you"
                columns={2}
                onSelect={onSelect}
                onSkip={onSkip}
                cards={[
                    {
                        value: 'Carbon',
                        label: 'Carbon',
                        description: 'Lightest weight, vibration damping, race-ready performance',
                        imagePath: `${base}/frame-carbon.webp`,
                        emoji: '🏆',
                    },
                    {
                        value: 'Steel',
                        label: 'Steel',
                        description: 'Legendary compliance, smooth ride, repairable anywhere on earth',
                        imagePath: `${base}/frame-steel.webp`,
                        emoji: '🔧',
                    },
                    {
                        value: 'Aluminum',
                        label: 'Aluminum',
                        description: 'Stiff, responsive, great value — the proven everyday choice',
                        imagePath: `${base}/frame-alloy.webp`,
                        emoji: '⚡',
                    },
                    {
                        value: 'Titanium',
                        label: 'Titanium',
                        description: 'Light, corrosion-proof, lifetime frames with a silky ride',
                        imagePath: `${base}/frame-titanium.webp`,
                        emoji: '✨',
                    },
                ]}
            />
        );
    }

    // ── WHEEL — Material (step 0 only) ────────────────────────────────────
    if (activeType === 'Wheel' && step === 0) {
        return (
            <PreFilterScreen
                question="Carbon or alloy wheels?"
                subtitle="Choose your wheelset construction"
                columns={2}
                onSelect={onSelect}
                onSkip={onSkip}
                cards={[
                    {
                        value: 'Carbon',
                        label: 'Carbon',
                        description: 'Stiff, aero, and light — the premium choice for fast gravel',
                        imagePath: `${base}/wheel-carbon.webp`,
                        emoji: '🏁',
                    },
                    {
                        value: 'Alloy',
                        label: 'Alloy',
                        description: 'Durable, reliable, easy to repair — built for adventure',
                        imagePath: `${base}/wheel-alloy.webp`,
                        emoji: '🛞',
                    },
                ]}
            />
        );
    }

    // ── TIRE ─────────────────────────────────────────────────────────────────
    if (activeType === 'Tire') {
        return (
            <PreFilterScreen
                question="What tire width range?"
                subtitle="Match your frame's clearance and riding style"
                columns={2}
                onSelect={onSelect}
                onSkip={onSkip}
                cards={[
                    {
                        value: '38-40',
                        label: '38 – 40mm',
                        description: 'Fast & efficient — race day, smooth gravel, gravel crits',
                        imagePath: `${base}/tire-38-40.webp`,
                        emoji: '🏎️',
                    },
                    {
                        value: '41-45',
                        label: '41 – 45mm',
                        description: 'All-rounder — mixed terrain, bikepacking, everyday gravel',
                        imagePath: `${base}/tire-41-45.webp`,
                        emoji: '🌄',
                    },
                    {
                        value: '46-50',
                        label: '46 – 50mm',
                        description: 'Chunky comfort — rough gravel, two-track, loaded adventure',
                        imagePath: `${base}/tire-46-50.webp`,
                        emoji: '🏔️',
                    },
                    {
                        value: '51+',
                        label: '51mm +',
                        description: 'Monster volume — 650b wide or 700c max, technical singletrack',
                        imagePath: `${base}/tire-51plus.webp`,
                        emoji: '🦏',
                    },
                ]}
            />
        );
    }

    // ── CRANKSET — step 1: 1x or 2x ─────────────────────────────────────────
    if (activeType === 'Crankset' && !drivetrainType) {
        return (
            <PreFilterScreen
                question="1x or 2x drivetrain?"
                subtitle="How many chainrings are you running?"
                columns={2}
                onSelect={onSelect}
                onSkip={onSkip}
                cards={[
                    {
                        value: '1x',
                        label: '1× Single',
                        description: 'Clean, simple, reliable — no front derailleur needed',
                        imagePath: `${base}/drivetrain-1x.webp`,
                        emoji: '🔄',
                    },
                    {
                        value: '2x',
                        label: '2× Double',
                        description: 'Wider range, tighter gear steps — precise shifting at any cadence',
                        imagePath: `${base}/drivetrain-2x.webp`,
                        emoji: '⚙️',
                    },
                ]}
            />
        );
    }

    // ── CRANKSET — step 2: speed count ───────────────────────────────────────
    if (activeType === 'Crankset' && drivetrainType) {
        return (
            <PreFilterScreen
                question="How many speeds?"
                subtitle={`Rear cog count for your ${drivetrainType} setup`}
                columns={4}
                onSelect={onSelect}
                onSkip={onSkip}
                cards={[
                    {
                        value: '10',
                        label: '10-speed',
                        description: 'Proven & compatible with older systems',
                        imagePath: `${base}/speed-10.webp`,
                        emoji: '🔟',
                    },
                    {
                        value: '11',
                        label: '11-speed',
                        description: 'The most common standard — huge parts availability',
                        imagePath: `${base}/speed-11.webp`,
                        emoji: '1️⃣1️⃣',
                    },
                    {
                        value: '12',
                        label: '12-speed',
                        description: 'Modern wide-range — top pick for current drivetrains',
                        imagePath: `${base}/speed-12.webp`,
                        emoji: '1️⃣2️⃣',
                    },
                    {
                        value: '13',
                        label: '13-speed',
                        description: 'Campagnolo Ekar — the finest gravel-specific groupset',
                        imagePath: `${base}/speed-13.webp`,
                        emoji: '1️⃣3️⃣',
                    },
                ]}
            />
        );
    }

    // ── REAR DERAILLEUR — Electronic/Mechanical (step 0 only) ──────────────
    if (activeType === 'RearDerailleur' && step === 0) {
        return (
            <PreFilterScreen
                question="Electronic or mechanical shifting?"
                subtitle="Defines your groupset ecosystem"
                columns={2}
                onSelect={onSelect}
                onSkip={onSkip}
                cards={[
                    {
                        value: 'electronic',
                        label: 'Electronic',
                        description: 'Di2, AXS, EPS — precise, wireless, self-trimming shifts',
                        imagePath: `${base}/drivetrain-electronic.webp`,
                        emoji: '⚡',
                    },
                    {
                        value: 'mechanical',
                        label: 'Mechanical',
                        description: 'Cable-actuated — field-serviceable, no batteries ever',
                        imagePath: `${base}/drivetrain-mechanical.webp`,
                        emoji: '🔩',
                    },
                ]}
            />
        );
    }

    // ── BRAKE ROTOR — Rotor size (step 0 only) ─────────────────────────────
    if (activeType === 'BrakeRotor' && step === 0) {
        return (
            <PreFilterScreen
                question="What rotor size?"
                subtitle="Larger rotors = more stopping power and heat dissipation"
                columns={2}
                onSelect={onSelect}
                onSkip={onSkip}
                cards={[
                    {
                        value: '140',
                        label: '140mm',
                        description: 'Lightweight option — flat terrain, lighter riders',
                        imagePath: `${base}/rotor-140.webp`,
                        emoji: '🪶',
                    },
                    {
                        value: '160',
                        label: '160mm',
                        description: 'The gravel sweet spot — great power, light weight',
                        imagePath: `${base}/rotor-160.webp`,
                        emoji: '⭕',
                    },
                    {
                        value: '180',
                        label: '180mm',
                        description: 'Extra bite — hilly terrain, loaded bikes, bigger riders',
                        imagePath: `${base}/rotor-180.webp`,
                        emoji: '🛑',
                    },
                    {
                        value: '200+',
                        label: '200mm +',
                        description: 'Maximum stopping power — enduro or very steep descents',
                        imagePath: `${base}/rotor-200plus.webp`,
                        emoji: '🚨',
                    },
                ]}
            />
        );
    }

    // ── SEATPOST — Standard/Dropper (step 0 only) ──────────────────────────
    if (activeType === 'Seatpost' && step === 0) {
        return (
            <PreFilterScreen
                question="Standard or dropper post?"
                subtitle="Droppers transform technical descending on gravel"
                columns={2}
                onSelect={onSelect}
                onSkip={onSkip}
                cards={[
                    {
                        value: 'standard',
                        label: 'Standard',
                        description: 'Fixed height — lighter, simpler, great for road-biased gravel',
                        imagePath: `${base}/seatpost-standard.webp`,
                        emoji: '📏',
                    },
                    {
                        value: 'dropper',
                        label: 'Dropper',
                        description: 'Remote-actuated height — game-changer on technical terrain',
                        imagePath: `${base}/seatpost-dropper.webp`,
                        emoji: '📉',
                    },
                ]}
            />
        );
    }

    // ── GENERIC BRAND FALLBACK ─────────────────────────────────────────────
    // Covers any component type that reaches this point with a populated
    // brands array (Wheel step 1, RearDerailleur step 1, BrakeRotor step 1,
    // Seatpost step 1, Stem step 0, Handlebar step 0, BrakeCaliper step 0,
    // Cassette step 0).
    if (brands && brands.length > 0) {
        const typeLabel = activeType
            .replace(/([a-z])([A-Z])/g, '$1 $2')
            .toLowerCase();

        return (
            <PreFilterScreen
                question={`What brand of ${typeLabel}?`}
                subtitle={`Narrow your ${typeLabel} search by manufacturer`}
                columns={2}
                onSelect={onSelect}
                onSkip={onSkip}
                cards={brands.map(brand => ({
                    value: brand,
                    label: brand,
                    description: `${brand} ${typeLabel} components`,
                    imagePath: `${base}/brand-${brand.toLowerCase().replace(/\s+/g, '-')}.webp`,
                    emoji: '\u2699\uFE0F',
                }))}
            />
        );
    }

    return null;
}

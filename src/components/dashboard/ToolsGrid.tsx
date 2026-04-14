'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { haptic } from '@/lib/haptics';
import { trackEvent } from '@/lib/analytics';

const tools = [
    {
        id: 'builder',
        title: 'The Workshop',
        subtitle: 'Start a New Build',
        description: 'The core builder. Validate compatibility across thousands of parts and standards.',
        href: '/builder?new=true',
        image: '/images/workshop.webp',
        gradient: 'from-amber-500/20 to-orange-500/20',
        border: 'group-hover:border-amber-500/50',
        text: 'group-hover:text-amber-400',
    },
    {
        id: 'gear-metrics',
        title: 'Gear Metrics',
        subtitle: 'The Drivetrain Lab',
        description: 'Analyze ratios, speed, and climbing capability. The ultimate reality check for your drivetrain.',
        href: '/performance',
        image: '/images/gears.webp',
        gradient: 'from-cyan-500/20 to-blue-500/20',
        border: 'group-hover:border-cyan-500/50',
        text: 'group-hover:text-cyan-400',
    },
    {
        id: 'tire-pressure',
        title: 'Tire Pressure',
        subtitle: 'The Contact Patch',
        description: 'Optimize for speed or grip. Advanced calculations for rim width and casing suppleness.',
        href: '/tire-pressure',
        image: '/images/tirepressure.webp',
        gradient: 'from-rose-500/20 to-pink-500/20',
        border: 'group-hover:border-rose-500/50',
        text: 'group-hover:text-rose-400',
    },
    {
        id: 'weight-weenies',
        title: 'Weight Weenies',
        subtitle: 'The Scale',
        description: 'Gamify your gram obsession. Calculate cost-per-gram saved and simulate upgrades.',
        href: '/weight',
        image: '/images/scale.webp',
        gradient: 'from-emerald-500/20 to-lime-500/20',
        border: 'group-hover:border-emerald-500/50',
        text: 'group-hover:text-emerald-400',
    },
];

export function ToolsGrid() {
    return (
        <section id="tools-section" className="px-4 pb-16 md:pb-24">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    className="text-center mb-8 md:mb-12"
                >
                    <p className="text-xs md:text-sm font-mono font-medium text-cyan-400/70 uppercase tracking-[0.2em] mb-2">
                        Your Toolkit
                    </p>
                    <h2 className="text-2xl md:text-4xl font-bold text-white tracking-tight">
                        Precision Tools
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-6">
                    {tools.map((tool, i) => (
                        <Link
                            key={tool.id}
                            href={tool.href}
                            className="block group relative"
                            onClick={() => {
                                haptic('light');
                                trackEvent('tool_entry_click', { tool_id: tool.id, destination: tool.href });
                            }}
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-50px' }}
                                transition={{ delay: i * 0.1 }}
                                className={`
                                    relative h-full rounded-3xl bg-stone-900/40 backdrop-blur-md border border-white/5
                                    transition-all duration-500 ease-out overflow-hidden
                                    ${tool.border} hover:bg-stone-900/60 hover:scale-[1.02] hover:shadow-2xl
                                `}
                            >
                                {/* Full-bleed background image */}
                                <div className="absolute inset-0">
                                    <Image
                                        src={tool.image}
                                        alt={`${tool.title} preview`}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 45vw, 560px"
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/75 to-stone-950/40" />
                                </div>

                                {/* Hover gradient */}
                                <div className={`
                                    absolute inset-0 bg-gradient-to-br ${tool.gradient}
                                    opacity-0 group-hover:opacity-20 transition-opacity duration-500
                                `} />

                                <div className="relative z-10 flex flex-col justify-end h-full p-4 md:p-8 min-h-[220px] md:min-h-[280px]">
                                    <div className="flex justify-between items-end gap-3">
                                        <div>
                                            <h3 className="text-xs md:text-sm font-mono font-medium text-stone-400 mb-1 md:mb-2 uppercase tracking-wider truncate">
                                                {tool.subtitle}
                                            </h3>
                                            <h2 className={`text-xl md:text-3xl font-bold text-white mb-2 md:mb-3 ${tool.text} transition-colors tracking-tight truncate`}>
                                                {tool.title}
                                            </h2>
                                            <p className="text-stone-300 text-xs md:text-base leading-relaxed group-hover:text-stone-200 transition-colors line-clamp-2 md:line-clamp-none">
                                                {tool.description}
                                            </p>
                                        </div>
                                        <div className={`
                                            p-2 rounded-full border border-white/5 text-stone-500
                                            group-hover:border-white/20 group-hover:text-white transition-all
                                            group-hover:translate-x-1 hidden sm:block shrink-0
                                        `}>
                                            <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { haptic } from '@/lib/haptics';
import { trackEvent } from '@/lib/analytics';

export function HeroSection() {
    const scrollToTools = () => {
        document.getElementById('tools-section')?.scrollIntoView({ behavior: 'smooth' });
        haptic('light');
        trackEvent('hero_cta_click', { cta: 'explore_tools' });
    };

    return (
        <section className="relative min-h-[85vh] flex flex-col items-center justify-center py-24 md:py-32 px-4 overflow-hidden">
            {/* Animated gradient backdrop */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-stone-950" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,_rgba(6,182,212,0.08)_0%,_transparent_70%)] blur-3xl" />
                <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,_rgba(6,182,212,0.04)_0%,_transparent_70%)] blur-2xl" />
            </div>

            {/* Subtle grid */}
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.5) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}
            />

            <div className="max-w-4xl mx-auto w-full relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                    <p className="text-xs md:text-sm font-mono font-medium text-cyan-400/70 uppercase tracking-[0.25em] mb-4 md:mb-6">
                        Precision Cycling Engineering
                    </p>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-3 md:mb-4 tracking-tight">
                        Crank<span className="text-cyan-400">Smith</span>
                    </h1>

                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium text-stone-300 mb-6 md:mb-8 tracking-wide">
                        <span className="text-cyan-400">Forge</span> The Perfect Ride
                    </h2>

                    <p className="text-stone-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-10 md:mb-12">
                        The ultimate toolbox for the modern cyclist. Validate compatibility across thousands of parts, optimize gear ratios, and engineer your dream build.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Link
                        href="/builder?new=true"
                        onClick={() => {
                            haptic('medium');
                            trackEvent('hero_cta_click', { cta: 'start_building' });
                        }}
                        className="btn-primary px-8 py-3.5 text-white rounded-xl font-semibold text-lg hover:scale-105 transition-transform flex items-center gap-2"
                    >
                        Start Building
                        <ArrowRight className="w-5 h-5" />
                    </Link>

                    <button
                        onClick={scrollToTools}
                        className="px-8 py-3.5 rounded-xl font-semibold text-lg text-stone-300 border border-white/10 hover:border-white/25 hover:text-white hover:bg-white/5 transition-all flex items-center gap-2"
                    >
                        Explore Tools
                        <ChevronDown className="w-5 h-5" />
                    </button>
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
            >
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-6 h-10 rounded-full border-2 border-white/10 flex items-start justify-center p-1.5"
                >
                    <div className="w-1.5 h-2.5 rounded-full bg-cyan-400/50" />
                </motion.div>
            </motion.div>
        </section>
    );
}

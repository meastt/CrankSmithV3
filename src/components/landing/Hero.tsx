'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Cpu, Gauge } from 'lucide-react';
import Link from 'next/link';

export const Hero = () => {
    return (
        <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden px-4 py-20 md:py-0">
            {/* Ambient Background */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Gradient orb */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] rounded-full bg-primary/10 blur-[120px] opacity-60" />

                {/* Grid pattern */}
                <div
                    className="absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255, 255, 255, 0.5) 1px, transparent 1px)
                        `,
                        backgroundSize: '60px 60px'
                    }}
                />

                {/* Radial fade */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-stone-950" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto text-center">
                {/* Version badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6 md:mb-8"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                    </span>
                    <span className="text-xs md:text-sm font-medium text-stone-400 font-mono">
                        v3.0 — Precision Engineering
                    </span>
                </motion.div>

                {/* Main heading */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-stone-100 mb-6 tracking-tight leading-[1.1]"
                >
                    Forge The
                    <br />
                    <span className="text-gradient">Perfect Ride.</span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-base sm:text-lg md:text-xl text-stone-400 mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed px-4"
                >
                    Professional cyclicng gear configurator tool for performance cyclists.
                    Validate compatibility, calculate physics, and engineer your dream build.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4"
                >
                    <Link
                        href="/builder?new=true"
                        className="group btn-primary px-6 sm:px-8 py-3.5 sm:py-4 text-white font-semibold rounded-xl flex items-center justify-center gap-2 text-base sm:text-lg"
                    >
                        Start Configuration
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                        href="/garage"
                        className="btn-ghost px-6 sm:px-8 py-3.5 sm:py-4 text-stone-300 font-semibold rounded-xl flex items-center justify-center text-base sm:text-lg"
                    >
                        View Saved Builds
                    </Link>
                </motion.div>

                {/* Trust indicators */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="mt-16 md:mt-24 pt-8 md:pt-12 border-t border-white/5"
                >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-12 max-w-3xl mx-auto">
                        <div className="flex flex-col items-center text-center group">
                            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-3 group-hover:border-primary/30 transition-colors">
                                <Shield className="w-5 h-5 text-primary" />
                            </div>
                            <h3 className="font-semibold text-stone-200 mb-1">Strict Validation</h3>
                            <p className="text-sm text-stone-500">Axle, Drivetrain & Geo Gates</p>
                        </div>

                        <div className="flex flex-col items-center text-center group">
                            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-3 group-hover:border-primary/30 transition-colors">
                                <Cpu className="w-5 h-5 text-primary" />
                            </div>
                            <h3 className="font-semibold text-stone-200 mb-1">Real-time Physics</h3>
                            <p className="text-sm text-stone-500">Weight, Speed & Ratio Calc</p>
                        </div>

                        <div className="flex flex-col items-center text-center group">
                            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-3 group-hover:border-primary/30 transition-colors">
                                <Gauge className="w-5 h-5 text-primary" />
                            </div>
                            <h3 className="font-semibold text-stone-200 mb-1">Deep Compatibility</h3>
                            <p className="text-sm text-stone-500">Cross-brand "Mullet" Support</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Cpu, ShieldCheck, Zap } from 'lucide-react';
import Link from 'next/link';

export const Hero = () => {
    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Schematic Images */}
            <div
                className="absolute left-[-200px] md:left-[-600px] top-[40%] -translate-y-1/2 w-[800px] md:w-[1600px] h-[800px] md:h-[1600px] pointer-events-none select-none opacity-5 mix-blend-screen"
                style={{
                    maskImage: 'radial-gradient(50% 35% at center, black 20%, transparent 100%)',
                    WebkitMaskImage: 'radial-gradient(50% 35% at center, black 20%, transparent 100%)'
                }}
            >
                <img
                    src="/images/schematic-rear.jpg"
                    alt="Rear Triangle Schematic"
                    className="w-full h-full object-contain"
                />
            </div>

            <div
                className="absolute right-[-200px] md:right-[-600px] top-[60%] -translate-y-1/2 w-[800px] md:w-[1600px] h-[800px] md:h-[1600px] pointer-events-none select-none opacity-5 mix-blend-screen"
                style={{
                    maskImage: 'radial-gradient(50% 35% at center, black 20%, transparent 100%)',
                    WebkitMaskImage: 'radial-gradient(50% 35% at center, black 20%, transparent 100%)'
                }}
            >
                <img
                    src="/images/schematic-front.jpg"
                    alt="Front End Schematic"
                    className="w-full h-full object-contain"
                />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-mono mb-8">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            CrankSmith Pro v3.0
                        </div>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight"
                    >
                        The Mechanic's <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Logic Engine</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-xl text-gray-400 mb-10 max-w-2xl leading-relaxed"
                    >
                        Not a toy. A professional configuration tool for performance cyclists.
                        Validate compatibility, calculate physics, and engineer your dream build with precision.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex flex-col sm:flex-row gap-4"
                    >
                        <Link href="/builder" className="group relative px-8 py-4 bg-primary hover:bg-blue-600 text-white font-bold rounded-lg transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] flex items-center justify-center">
                            Start Configuration
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link href="/garage" className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-lg border border-white/10 transition-all flex items-center justify-center">
                            View Saved Builds
                        </Link>
                    </motion.div>

                    {/* Stats / Trust Indicators */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 border-t border-white/5 pt-10 w-full"
                    >
                        <div className="flex flex-col items-center">
                            <div className="flex items-center text-blue-400 mb-2">
                                <ShieldCheck className="w-5 h-5 mr-2" />
                                <span className="font-bold">Strict Validation</span>
                            </div>
                            <p className="text-sm text-gray-500">Axle, Drivetrain, & Geo Gates</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="flex items-center text-cyan-400 mb-2">
                                <Cpu className="w-5 h-5 mr-2" />
                                <span className="font-bold">Real-time Physics</span>
                            </div>
                            <p className="text-sm text-gray-500">Weight, Speed & Ratio Calc</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="flex items-center text-emerald-400 mb-2">
                                <Zap className="w-5 h-5 mr-2" />
                                <span className="font-bold">Deep Compatibility</span>
                            </div>
                            <p className="text-sm text-gray-500">Cross-brand "Mullet" Support</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

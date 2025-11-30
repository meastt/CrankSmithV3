'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Scale, AlertTriangle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const features = [
    {
        icon: Layers,
        title: "The Axle Gate",
        description: "We match interfaces, not names. Boost 148 vs 142, Thru-Axle vs QR—if the hub spacing doesn't align, the build fails.",
        color: "text-primary"
    },
    {
        icon: Scale,
        title: "Weight Weenie Logic",
        description: "Every bolt counts. Our database tracks gram-level weight for every component, giving you a live running total.",
        color: "text-emerald-400"
    },
    {
        icon: AlertTriangle,
        title: "Capacity Guardrails",
        description: "Exceeding derailleur capacity? Mixing electronic and mechanical? The engine flags it with detailed conflict reports.",
        color: "text-amber-400"
    }
];

export const Features = () => {
    return (
        <section className="relative py-16 md:py-24 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12 md:mb-16"
                >
                    <h2 className="text-2xl md:text-3xl font-bold text-stone-100 mb-4">
                        Built Different
                    </h2>
                    <p className="text-stone-500 max-w-xl mx-auto">
                        Not another generic bike builder. CrankSmith understands the intricate compatibility rules that make or break a build.
                    </p>
                </motion.div>

                {/* Feature cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group relative bg-white/[0.02] backdrop-blur-sm border border-white/5 rounded-2xl p-6 md:p-8 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300"
                        >
                            {/* Icon */}
                            <div className={`w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-5 ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                                <feature.icon className="w-5 h-5" />
                            </div>

                            {/* Content */}
                            <h3 className="text-lg md:text-xl font-semibold text-stone-100 mb-3">
                                {feature.title}
                            </h3>
                            <p className="text-stone-400 text-sm md:text-base leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="text-center mt-12 md:mt-16"
                >
                    <Link
                        href="/builder?new=true"
                        className="group inline-flex items-center gap-2 text-primary hover:text-primary-light font-medium transition-colors"
                    >
                        Try the builder
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Scale, AlertTriangle } from 'lucide-react';

const features = [
    {
        icon: <Layers className="w-8 h-8 text-blue-400" />,
        title: "The Axle Gate",
        description: "We don't just match names. We match interfaces. Boost 148 vs 142, Thru-Axle vs QR. If the hub spacing doesn't align, the build fails."
    },
    {
        icon: <Scale className="w-8 h-8 text-cyan-400" />,
        title: "Weight Weenie Logic",
        description: "Every bolt counts. Our database tracks gram-level weight for every component, giving you a live running total as you swap parts."
    },
    {
        icon: <AlertTriangle className="w-8 h-8 text-amber-400" />,
        title: "Capacity Guardrails",
        description: "Exceeding your derailleur's tooth capacity? Mixing electronic and mechanical? The engine flags it immediately with detailed conflict reports."
    }
];

export const Features = () => {
    return (
        <div className="relative py-24 overflow-hidden">
            {/* Background Hub Accent */}
            <div
                className="absolute top-[80%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1400px] h-[1000px] hidden xl:block pointer-events-none select-none opacity-5 mix-blend-screen"
                style={{
                    maskImage: 'radial-gradient(50% 50% at center, black 20%, transparent 100%)',
                    WebkitMaskImage: 'radial-gradient(50% 50% at center, black 20%, transparent 100%)'
                }}
            >
                <img
                    src="/images/schematic-hub.jpg"
                    alt="Hub Mechanism Schematic"
                    className="w-full h-full object-contain"
                />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-white/5 p-8 rounded-2xl border border-white/5 hover:border-white/10 transition-colors"
                        >
                            <div className="bg-white/5 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                            <p className="text-gray-400 leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

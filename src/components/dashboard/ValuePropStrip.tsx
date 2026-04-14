'use client';

import { motion } from 'framer-motion';
import { Database, ShieldCheck, Zap } from 'lucide-react';

const props = [
    {
        icon: Database,
        stat: '5,000+',
        label: 'Parts in Database',
        delay: 0,
    },
    {
        icon: ShieldCheck,
        stat: 'Real-Time',
        label: 'Compatibility Validation',
        delay: 0.1,
    },
    {
        icon: Zap,
        stat: 'Free',
        label: 'Forever. No Catch.',
        delay: 0.2,
    },
];

export function ValuePropStrip() {
    return (
        <section className="px-4 pb-16 md:pb-24 mt-4 md:mt-8">
            <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                    {props.map((prop) => (
                        <motion.div
                            key={prop.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-50px' }}
                            transition={{ delay: prop.delay, duration: 0.5 }}
                            className="flex items-center gap-4 p-5 md:p-6 rounded-2xl bg-stone-900/40 backdrop-blur-md border border-white/5"
                        >
                            <div className="p-2.5 rounded-xl bg-cyan-400/10 text-cyan-400 shrink-0">
                                <prop.icon className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-lg md:text-xl font-bold text-white leading-tight">
                                    {prop.stat}
                                </p>
                                <p className="text-xs md:text-sm text-stone-400 font-medium">
                                    {prop.label}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

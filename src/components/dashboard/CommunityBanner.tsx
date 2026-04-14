'use client';

import { motion } from 'framer-motion';
import { Heart, Bug, Mail } from 'lucide-react';

export function CommunityBanner() {
    return (
        <section className="px-4 pb-16 md:pb-20">
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="max-w-3xl mx-auto relative overflow-hidden rounded-2xl bg-stone-900/50 backdrop-blur-md border border-white/[0.06]"
            >
                {/* Subtle gradient accent along the top */}
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />

                <div className="px-6 py-8 md:px-10 md:py-10 text-center">
                    {/* Icon cluster */}
                    <div className="flex items-center justify-center gap-3 mb-5">
                        <div className="p-2 rounded-xl bg-cyan-400/10 text-cyan-400">
                            <Heart className="w-5 h-5" />
                        </div>
                        <div className="p-2 rounded-xl bg-amber-400/10 text-amber-400">
                            <Bug className="w-5 h-5" />
                        </div>
                    </div>

                    {/* Heading */}
                    <h3 className="text-lg md:text-xl font-bold text-white mb-3">
                        Thanks for Using{' '}
                        <span className="text-gradient">CrankSmith</span>
                    </h3>

                    {/* Body */}
                    <p className="text-sm md:text-base text-stone-400 leading-relaxed max-w-xl mx-auto mb-6">
                        CrankSmith is a one-man project — I&apos;m always working to make these
                        tools better. If you run into a bug, a logic issue, or just have a
                        suggestion, I&apos;d genuinely love to hear about it.
                    </p>

                    {/* CTA */}
                    <a
                        href="mailto:mike@cranksmith.com"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm font-semibold text-cyan-400 hover:bg-cyan-400/10 hover:border-cyan-400/20 transition-all duration-200"
                    >
                        <Mail className="w-4 h-4" />
                        mike@cranksmith.com
                    </a>
                </div>
            </motion.div>
        </section>
    );
}

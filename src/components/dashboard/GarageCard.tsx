'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

export function GarageCard() {
    return (
        <section className="px-4 pb-16 md:pb-24">
            <div className="max-w-6xl mx-auto">
                <Link
                    href="/garage"
                    className="block group relative"
                    onClick={() => trackEvent('tool_entry_click', { tool_id: 'garage', destination: '/garage' })}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-50px' }}
                        className="relative overflow-hidden p-8 rounded-3xl bg-stone-900/40 backdrop-blur-md border border-white/5 transition-all duration-500 ease-out group-hover:border-violet-500/50 hover:bg-stone-900/60 hover:scale-[1.01] hover:shadow-2xl"
                    >
                        {/* Hover gradient */}
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-violet-500/20 via-purple-500/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        {/* Full-bleed background image */}
                        <div className="absolute inset-0 rounded-3xl overflow-hidden">
                            <Image
                                src="/images/garage.webp"
                                alt="Garage tool preview"
                                fill
                                sizes="(max-width: 768px) 100vw, 1152px"
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/50 to-stone-950/30" />
                        </div>

                        <div className="relative z-10 flex flex-col items-center text-center gap-2 py-8 md:py-12">
                            <h3 className="text-sm font-mono font-medium text-stone-400 mb-1 uppercase tracking-wider">
                                Your Collection
                            </h3>
                            <h2 className="text-3xl font-bold text-white group-hover:text-violet-400 transition-colors">
                                My Garage
                            </h2>
                            <p className="text-stone-300 mt-1 group-hover:text-stone-200 transition-colors max-w-lg mx-auto">
                                Manage your saved builds, projects, and dream bikes.
                            </p>

                            <div className="absolute right-8 top-1/2 -translate-y-1/2 p-3 rounded-full border border-white/5 text-stone-500 group-hover:border-white/20 group-hover:text-white transition-all group-hover:translate-x-1 hidden md:block">
                                <ArrowRight className="w-6 h-6" />
                            </div>
                        </div>
                    </motion.div>
                </Link>
            </div>
        </section>
    );
}

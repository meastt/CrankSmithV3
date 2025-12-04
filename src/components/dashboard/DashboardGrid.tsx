'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Activity, Scale, Wrench, Gauge, ArrowRight, Bike } from 'lucide-react';
import { useClerk, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { haptic } from '@/lib/haptics';

const tools = [
    {
        id: 'gear-metrics',
        title: 'Gear Metrics',
        subtitle: 'The Drivetrain Lab',
        description: 'Analyze ratios, speed, and climbing capability. The ultimate reality check for your drivetrain.',
        icon: Activity,
        href: '/performance',
        gradient: 'from-cyan-500/20 to-blue-500/20',
        border: 'group-hover:border-cyan-500/50',
        text: 'group-hover:text-cyan-400',
        iconColor: 'text-cyan-400',
        delay: 0.1
    },
    {
        id: 'weight-weenies',
        title: 'Weight Weenies',
        subtitle: 'The Scale',
        description: 'Gamify your gram obsession. Calculate cost-per-gram saved and simulate upgrades.',
        icon: Scale,
        href: '/weight',
        gradient: 'from-emerald-500/20 to-lime-500/20',
        border: 'group-hover:border-emerald-500/50',
        text: 'group-hover:text-emerald-400',
        iconColor: 'text-emerald-400',
        delay: 0.2
    },
    {
        id: 'builder',
        title: 'The Workshop',
        subtitle: 'Start a New Build',
        description: 'The core builder. Validate compatibility across thousands of parts and standards.',
        icon: Wrench,
        href: '/builder?new=true',
        gradient: 'from-amber-500/20 to-orange-500/20',
        border: 'group-hover:border-amber-500/50',
        text: 'group-hover:text-amber-400',
        iconColor: 'text-amber-400',
        delay: 0.3
    },
    {
        id: 'tire-pressure',
        title: 'Tire Pressure',
        subtitle: 'The Contact Patch',
        description: 'Optimize for speed or grip. Advanced calculations for rim width and casing suppleness.',
        icon: Gauge,
        href: '/tire-pressure',
        gradient: 'from-rose-500/20 to-pink-500/20',
        border: 'group-hover:border-rose-500/50',
        text: 'group-hover:text-rose-400',
        iconColor: 'text-rose-400',
        delay: 0.4
    }
];

export const DashboardGrid = () => {
    const { openSignIn } = useClerk();
    const { isLoaded, isSignedIn } = useUser();
    const router = useRouter();
    return (
        <section className="min-h-screen flex flex-col justify-center py-20 px-4 relative overflow-hidden bg-stone-950">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-stone-900 via-stone-950 to-stone-950 -z-10" />

            {/* Subtle Grid */}
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.5) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}
            />

            <div className="max-w-6xl mx-auto w-full relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
                        Crank<span className="text-cyan-400">Smith</span>
                    </h1>
                    <p className="text-stone-400 text-lg max-w-2xl mx-auto mb-12">
                        The ultimate toolbox for the modern cyclist. Optimize your build with our professional bicycle compatibility checker, gear ratio calculator, and weight analysis tools.
                    </p>

                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-wide">
                        <span className="text-cyan-400">Forge</span> The Perfect Ride
                    </h2>
                    <p className="text-stone-500 text-base max-w-3xl mx-auto leading-relaxed">
                        Whether you're dialing in tire pressure for gravel, calculating gear inches for a mullet drivetrain, or shaving grams for a hill climb, CrankSmith provides the precision engineering data you need to build with confidence.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {tools.map((tool) => (
                        <Link
                            key={tool.id}
                            href={tool.href}
                            className="block group relative"
                            onClick={() => haptic('light')}
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: tool.delay }}
                                className={`
                                h-full p-8 rounded-3xl bg-stone-900/40 backdrop-blur-md border border-white/5
                                transition-all duration-500 ease-out
                                ${tool.border} hover:bg-stone-900/60 hover:scale-[1.02] hover:shadow-2xl
                            `}
                            >
                                {/* Hover Gradient Background */}
                                <div className={`
                                absolute inset-0 rounded-3xl bg-gradient-to-br ${tool.gradient}
                                opacity-0 group-hover:opacity-10 transition-opacity duration-500
                            `} />

                                <div className="relative z-10 flex flex-col h-full">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 ${tool.iconColor} group-hover:bg-white/10 transition-colors`}>
                                            <tool.icon className="w-8 h-8" />
                                        </div>
                                        <div className={`
                                        p-2 rounded-full border border-white/5 text-stone-500
                                        group-hover:border-white/20 group-hover:text-white transition-all
                                        group-hover:translate-x-1
                                    `}>
                                            <ArrowRight className="w-5 h-5" />
                                        </div>
                                    </div>

                                    <div className="mt-auto">
                                        <h3 className="text-sm font-mono font-medium text-stone-400 mb-2 uppercase tracking-wider">
                                            {tool.subtitle}
                                        </h3>
                                        <h2 className={`text-3xl font-bold text-white mb-3 ${tool.text} transition-colors`}>
                                            {tool.title}
                                        </h2>
                                        <p className="text-stone-300 leading-relaxed group-hover:text-stone-200 transition-colors">
                                            {tool.description}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>

                {/* My Garage Card */}
                <Link
                    href="/garage"
                    className="block group relative mt-6 z-20"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="relative overflow-hidden p-8 rounded-3xl bg-stone-900/40 backdrop-blur-md border border-white/5 transition-all duration-500 ease-out group-hover:border-violet-500/50 hover:bg-stone-900/60 hover:scale-[1.01] hover:shadow-2xl"
                    >
                        {/* Hover Gradient Background */}
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-violet-500/20 via-purple-500/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="relative z-10 flex flex-col items-center text-center gap-4">
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-violet-400 group-hover:bg-white/10 transition-colors mb-2">
                                <Bike className="w-8 h-8" />
                            </div>

                            <div>
                                <h3 className="text-sm font-mono font-medium text-stone-500 mb-1 uppercase tracking-wider">
                                    Your Collection
                                </h3>
                                <h2 className="text-3xl font-bold text-white group-hover:text-violet-400 transition-colors">
                                    My Garage
                                </h2>
                                <p className="text-stone-400 mt-1 group-hover:text-stone-300 transition-colors max-w-lg mx-auto">
                                    Manage your saved builds, projects, and dream bikes.
                                </p>
                            </div>

                            <div className="absolute right-8 top-1/2 -translate-y-1/2 p-3 rounded-full border border-white/5 text-stone-500 group-hover:border-white/20 group-hover:text-white transition-all group-hover:translate-x-1 hidden md:block">
                                <ArrowRight className="w-6 h-6" />
                            </div>
                        </div>
                    </motion.div>
                </Link>

                {/* Sign In CTA - Show if not signed in OR if Clerk is still loading (fallback) */}
                {(!isLoaded || !isSignedIn) && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="mt-8 text-center"
                    >
                        <p className="text-stone-500 mb-4">Already have an account?</p>
                        <button
                            onClick={() => router.push('/sign-in')}
                            className="btn-primary px-8 py-3 text-white rounded-xl font-semibold text-lg hover:scale-105 transition-transform"
                        >
                            Sign In to CrankSmith
                        </button>
                    </motion.div>
                )}
            </div>
        </section>
    );
};

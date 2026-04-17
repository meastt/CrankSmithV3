'use client';

import React from 'react';
import { TirePressureCalculator } from '@/components/tools/TirePressureCalculator';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function TirePressurePage() {
    return (
        <div className="min-h-screen bg-stone-950 text-white pb-20">
            {/* Header */}
            <header className="relative z-40 bg-stone-950/80 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-stone-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="text-sm font-medium hidden sm:inline">Back to Dashboard</span>
                    </Link>
                    <div className="text-sm font-bold text-rose-500 uppercase tracking-wider">
                        The Contact Patch
                    </div>
                </div>
            </header>

            <main className="px-4 py-12">
                <div className="max-w-5xl mx-auto mb-12 text-center">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4">Tire Pressure Calculator</h1>
                    <p className="text-stone-400 max-w-2xl mx-auto">
                        Don't guess. Calculate the optimal pressure for your specific rim width, casing, and terrain.
                    </p>
                </div>

                {/* Next-step CTAs (for builder + drivetrain flow) */}
                <section className="max-w-3xl mx-auto mb-10">
                    <div className="rounded-3xl p-6 sm:p-8 bg-stone-900/60 border border-white/10 shadow-2xl">
                        <h2 className="text-xl font-bold mb-2">Next step: build the right bike setup</h2>
                        <p className="text-stone-400 mb-5">
                            Use the calculator to set comfortable/fast pressure for your tire + terrain—then lock in compatible wheels and drivetrain choices.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <Link
                                href="/builder"
                                className="flex-1 inline-flex items-center justify-center px-5 py-3 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/25 transition-all text-white font-semibold"
                            >
                                Build your bike
                            </Link>

                            <Link
                                href="/hubs/gravel-drivetrain-bible"
                                className="flex-1 inline-flex items-center justify-center px-5 py-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/15 border border-rose-500/20 transition-all text-white font-semibold"
                            >
                                Match drivetrain (Gravel Bible)
                            </Link>

                            <Link
                                href="/hubs/gravel-standards-master"
                                className="flex-1 inline-flex items-center justify-center px-5 py-3 rounded-xl bg-stone-800/60 hover:bg-stone-800/80 border border-white/10 transition-all text-white font-semibold"
                            >
                                Check standards
                            </Link>
                        </div>
                    </div>
                </section>

                <TirePressureCalculator />

                {/* Crawlable intent + FAQ for CTR improvements */}
                <section className="max-w-3xl mx-auto mt-12">
                    <h2 className="text-2xl font-bold mb-3">Find your PSI—then build the setup</h2>
                    <p className="text-stone-400 mb-6">
                        If you searched for a tire pressure calculator, start here: enter your tire + rim width, choose your terrain, and get a front/rear PSI starting point.
                        Then validate compatibility and drivetrain choices so your pressure actually works with your wheels, tires, and gearing.
                    </p>

                    <div className="rounded-3xl p-6 bg-stone-900/40 border border-white/10 mb-8">
                        <h3 className="text-lg font-semibold mb-3">Quick navigation (for builders)</h3>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Link
                                href="/builder"
                                className="flex-1 inline-flex items-center justify-center px-5 py-3 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/25 transition-all text-white font-semibold"
                            >
                                Build your setup
                            </Link>
                            <Link
                                href="/hubs/gravel-standards-master"
                                className="flex-1 inline-flex items-center justify-center px-5 py-3 rounded-xl bg-stone-800/60 hover:bg-stone-800/80 border border-white/10 transition-all text-white font-semibold"
                            >
                                Match standards
                            </Link>
                            <Link
                                href="/hubs/gravel-drivetrain-bible"
                                className="flex-1 inline-flex items-center justify-center px-5 py-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/15 border border-rose-500/20 transition-all text-white font-semibold"
                            >
                                Tune drivetrain
                            </Link>
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold mb-3">Gravel tire pressure (what this calculator optimizes)</h2>
                    <p className="text-stone-400 mb-6">
                        Gravel riding blends comfort and control. This tool recommends front/rear PSI using your rider weight, tire width, rim (inner) width, terrain type, and whether you’re running tubeless.
                        If you’re deciding your starting point, use it to dial in grip on rough sections while keeping efficiency on smoother lines.
                    </p>

                    <div className="rounded-3xl p-6 bg-stone-900/40 border border-white/10">
                        <h3 className="text-lg font-semibold mb-4">Frequently asked questions</h3>

                        <div className="space-y-4">
                            <div>
                                <h4 className="font-semibold">What PSI should I run for gravel?</h4>
                                <p className="text-stone-400">
                                    Start by selecting gravel conditions, your tire width, and rim width. Heavier riders and chunkier gravel typically benefit from slightly higher pressure for support, while smoother gravel and lighter loads usually allow lower PSI for grip and comfort.
                                    <span className="block mt-2">
                                        Then dial in your setup with <Link href="/hubs/gravel-standards-master" className="text-cyan-300 hover:text-cyan-200 underline underline-offset-4">Gravel Standards</Link>.
                                    </span>
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold">Bike tire pressure calculator: what inputs matter most?</h4>
                                <p className="text-stone-400">
                                    The biggest drivers are tire width + rim inner width (how your tire supports), rider (and bike) weight (load), and terrain/conditions (surface firmness). Tubeless vs tube changes how you can safely run pressure.
                                    <span className="block mt-2">
                                        Use those numbers to <Link href="/builder" className="text-cyan-300 hover:text-cyan-200 underline underline-offset-4">build the right bike</Link>.
                                    </span>
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold">Tubeless gravel: what pressure should I start with?</h4>
                                <p className="text-stone-400">
                                    Use your tire width, rim width, and gravel conditions to get a first-pass recommendation—then adjust based on traction feel. If you’re getting harsh impacts or losing stability, increase pressure a small amount; if traction is great and the ride feels harsh, you can decrease slightly.
                                    <span className="block mt-2">
                                        Confirm compatibility with your components in <Link href="/hubs/gravel-drivetrain-bible" className="text-cyan-300 hover:text-cyan-200 underline underline-offset-4">Gravel Bible</Link>.
                                    </span>
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold">How does tire width change PSI recommendations?</h4>
                                <p className="text-stone-400">
                                    Wider tires generally support more volume at lower PSI, improving comfort and grip on gravel. Narrower tires typically need higher pressure to avoid excessive squirm and bottoming.
                                    <span className="block mt-2">
                                        Pair your tire choice with the right setup using <Link href="/hubs/gravel-standards-master" className="text-cyan-300 hover:text-cyan-200 underline underline-offset-4">Gravel Standards</Link>.
                                    </span>
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold">Front vs rear tire pressure on gravel—same or different?</h4>
                                <p className="text-stone-400">
                                    Usually not identical. Rider weight distribution often means the rear tire sees more load, so recommended pressure can be slightly different front vs rear for best comfort + control.
                                    <span className="block mt-2">
                                        Match your drivetrain + component choices with <Link href="/hubs/gravel-drivetrain-bible" className="text-cyan-300 hover:text-cyan-200 underline underline-offset-4">Gravel Bible</Link>.
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Related tools (high-intent internal linking for CTR → builder flow) */}
                <section className="max-w-3xl mx-auto mt-10 mb-8">
                    <div className="rounded-3xl p-6 bg-stone-900/30 border border-white/10">
                        <h3 className="text-lg font-semibold mb-3">Keep building your setup</h3>
                        <p className="text-stone-400 mb-5">
                            Pressure is one piece. Lock in wheel/tire compatibility and matching drivetrain choices next.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Link
                                href="/builder"
                                className="flex-1 inline-flex items-center justify-center px-5 py-3 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/25 transition-all text-white font-semibold"
                            >
                                Build with your tire specs
                            </Link>

                            <Link
                                href="/hubs/gravel-drivetrain-bible"
                                className="flex-1 inline-flex items-center justify-center px-5 py-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/15 border border-rose-500/20 transition-all text-white font-semibold"
                            >
                                Match drivetrain (Gravel Bible)
                            </Link>
                        </div>
                    </div>
                </section>

                {/* JSON-LD (FAQPage) */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'FAQPage',
                            mainEntity: [
                                {
                                    '@type': 'Question',
                                    name: 'What PSI should I run for gravel?',
                                    acceptedAnswer: {
                                        '@type': 'Answer',
                                        text: 'Start by selecting gravel conditions, your tire width, and rim width. Heavier riders and chunkier gravel typically benefit from slightly higher pressure for support, while smoother gravel and lighter loads usually allow lower PSI for grip and comfort. Then dial in your setup with Gravel Standards.'
                                    }
                                },
                                {
                                    '@type': 'Question',
                                    name: 'Bike tire pressure calculator: what inputs matter most?',
                                    acceptedAnswer: {
                                        '@type': 'Answer',
                                        text: 'The biggest drivers are tire width + rim inner width, rider (and bike) weight, and terrain/conditions. Tubeless vs tube changes how you can safely run pressure. Use those numbers to build the right bike.'
                                    }
                                },
                                {
                                    '@type': 'Question',
                                    name: 'Tubeless gravel: what pressure should I start with?',
                                    acceptedAnswer: {
                                        '@type': 'Answer',
                                        text: 'Use your tire width, rim width, and gravel conditions to get a first-pass recommendation—then adjust based on traction feel. If the ride feels harsh or unstable, increase pressure slightly; if traction is great, you can decrease slightly. Confirm compatibility in Gravel Bible.'
                                    }
                                },
                                {
                                    '@type': 'Question',
                                    name: 'How does tire width change PSI recommendations?',
                                    acceptedAnswer: {
                                        '@type': 'Answer',
                                        text: 'Wider tires generally support more volume at lower PSI for comfort and grip. Narrower tires typically need higher pressure to avoid excessive squirm and bottoming. Pair your tire choice with Gravel Standards.'
                                    }
                                },
                                {
                                    '@type': 'Question',
                                    name: 'Front vs rear tire pressure on gravel—same or different?',
                                    acceptedAnswer: {
                                        '@type': 'Answer',
                                        text: 'Often not identical. Rider weight distribution means the rear tire usually sees more load, so front vs rear recommendations can differ for best comfort and control. Match your component choices in Gravel Bible.'
                                    }
                                }
                            ]
                        })
                    }}
                />
            </main>
        </div>
    );
}

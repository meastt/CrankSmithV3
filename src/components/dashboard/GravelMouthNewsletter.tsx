'use client';

import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Mail, Check, Loader2 } from 'lucide-react';
import { haptic } from '@/lib/haptics';
import { trackEvent } from '@/lib/analytics';

type Status = 'idle' | 'loading' | 'success' | 'error';

export function GravelMouthNewsletter() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<Status>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!email || status === 'loading') return;

        haptic('light');
        trackEvent('newsletter_subscribe_attempt', { source: 'homepage' });
        setStatus('loading');
        setErrorMessage('');

        try {
            const res = await fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (res.ok) {
                setStatus('success');
                setEmail('');
                haptic('success');
                trackEvent('newsletter_subscribe_success', { source: 'homepage' });
            } else {
                setStatus('error');
                setErrorMessage(data.error || 'Something went wrong. Try again.');
            }
        } catch {
            setStatus('error');
            setErrorMessage('Network error. Please try again.');
        }
    };

    return (
        <section className="px-4 pb-16 md:pb-24">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    className="relative overflow-hidden rounded-3xl bg-stone-900/50 backdrop-blur-md border border-white/5"
                >
                    {/* Warm gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-orange-500/5 pointer-events-none" />

                    <div className="relative z-10 p-8 md:p-12 lg:p-16">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-12">
                            {/* Left: Brand + Description */}
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2 rounded-xl bg-amber-400/10">
                                        <Mail className="w-5 h-5 text-amber-400" />
                                    </div>
                                    <p className="text-xs font-mono font-medium text-amber-400/70 uppercase tracking-[0.2em]">
                                        Newsletter
                                    </p>
                                </div>

                                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight leading-snug">
                                    Keeping Up With The Gravel Scene?
                                </h2>
                                <p className="text-lg md:text-xl font-semibold text-stone-200 mb-3">
                                    Get the latest from <span className="text-amber-400">Gravel Mouth</span>.
                                </p>

                                <p className="text-stone-300 text-base md:text-lg leading-relaxed max-w-md">
                                    The dirt on gravel culture, gear, and racing. From the latest LTGP drama to new tech drops — delivered to your inbox.
                                </p>
                            </div>

                            {/* Right: Form */}
                            <div className="w-full md:w-auto md:min-w-[340px]">
                                {status === 'success' ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex items-center gap-3 p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20"
                                    >
                                        <div className="p-1.5 rounded-full bg-emerald-500/20">
                                            <Check className="w-5 h-5 text-emerald-400" />
                                        </div>
                                        <div>
                                            <p className="text-white font-semibold">You&apos;re in!</p>
                                            <p className="text-stone-400 text-sm">Check your inbox to confirm.</p>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-3">
                                        <div className="flex flex-col sm:flex-row gap-3">
                                            <input
                                                type="email"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="your@email.com"
                                                disabled={status === 'loading'}
                                                className="flex-1 px-4 py-3 rounded-xl bg-stone-800 border border-white/10 text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/30 transition-all disabled:opacity-50"
                                            />
                                            <button
                                                type="submit"
                                                disabled={status === 'loading'}
                                                className="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 transition-all hover:scale-105 hover:shadow-lg hover:shadow-amber-500/20 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2 whitespace-nowrap"
                                            >
                                                {status === 'loading' ? (
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                ) : (
                                                    'Subscribe'
                                                )}
                                            </button>
                                        </div>

                                        {status === 'error' && (
                                            <motion.p
                                                initial={{ opacity: 0, y: -5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="text-red-400 text-sm"
                                            >
                                                {errorMessage}
                                            </motion.p>
                                        )}

                                        <p className="text-stone-600 text-xs">
                                            No spam. Unsubscribe anytime.
                                        </p>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

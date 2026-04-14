'use client';

import { SafeUserButton, SafeSignedIn, SafeSignedOut, useSafeClerk } from '@/components/ClerkProviderWrapper';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Wrench, Activity, Gauge, Scale, Bike } from 'lucide-react';
import { useSettingsStore } from '@/store/settingsStore';
import { DevBanner } from './DevBanner';

const navLinks = [
    { href: '/builder?new=true', label: 'Builder', icon: Wrench },
    { href: '/garage', label: 'Garage', icon: Bike },
    { href: '/performance', label: 'Drivetrain', icon: Activity },
    { href: '/tire-pressure', label: 'Tire Pressure', icon: Gauge },
    { href: '/weight', label: 'Scale', icon: Scale },
];

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { unitSystem, toggleUnitSystem } = useSettingsStore();
    const { openSignIn } = useSafeClerk();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMenuOpen]);

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 pt-safe ${scrolled
                    ? 'bg-stone-950/80 backdrop-blur-2xl border-b border-white/[0.06] shadow-lg shadow-black/20'
                    : 'bg-transparent'
                    }`}
            >
                <DevBanner />
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex justify-between items-center h-16 md:h-18">
                        {/* Logo */}
                        <Link
                            href="/"
                            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <img
                                src="/images/logo.webp"
                                alt="CrankSmith Logo"
                                className="h-8 md:h-9 w-auto"
                            />
                            <span className="hidden sm:block text-sm font-bold text-white tracking-tight">
                                Crank<span className="text-cyan-400">Smith</span>
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-0.5">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="relative px-3.5 py-2 text-[13px] font-medium text-stone-400 hover:text-white rounded-lg transition-all group"
                                >
                                    <span className="relative z-10">{link.label}</span>
                                    <span className="absolute inset-0 bg-white/0 group-hover:bg-white/[0.06] rounded-lg transition-colors" />
                                </Link>
                            ))}

                            <div className="ml-3 pl-3 border-l border-white/[0.08] flex items-center gap-2.5">
                                <button
                                    onClick={toggleUnitSystem}
                                    className="px-2.5 py-1.5 text-[11px] font-mono font-bold text-stone-500 hover:text-cyan-400 border border-white/[0.08] hover:border-cyan-400/30 rounded-md uppercase transition-all"
                                >
                                    {unitSystem === 'metric' ? 'KM/H' : 'MPH'}
                                </button>
                                <SafeSignedIn>
                                    <SafeUserButton
                                        appearance={{
                                            elements: {
                                                avatarBox: "w-8 h-8 ring-2 ring-white/10 ring-offset-2 ring-offset-stone-950"
                                            }
                                        }}
                                    />
                                </SafeSignedIn>
                                <SafeSignedOut>
                                    <Link href="/sign-in">
                                        <button className="px-4 py-2 text-sm font-semibold text-white bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/20 hover:border-cyan-400/40 rounded-lg transition-all">
                                            Sign In
                                        </button>
                                    </Link>
                                </SafeSignedOut>
                            </div>
                        </nav>

                        {/* Mobile Menu Button */}
                        <div className="flex md:hidden items-center gap-2.5">
                            <SafeSignedIn>
                                <SafeUserButton
                                    appearance={{
                                        elements: {
                                            avatarBox: "w-8 h-8"
                                        }
                                    }}
                                />
                            </SafeSignedIn>
                            <SafeSignedOut>
                                <Link
                                    href="/sign-in"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="px-3.5 py-1.5 text-xs font-semibold text-white bg-cyan-500/15 border border-cyan-400/20 rounded-lg transition-all"
                                >
                                    Sign In
                                </Link>
                            </SafeSignedOut>
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="p-2 -mr-2 text-stone-400 hover:text-stone-100 transition-colors"
                                aria-label="Toggle menu"
                            >
                                {isMenuOpen ? (
                                    <X className="w-5 h-5" />
                                ) : (
                                    <Menu className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-40 md:hidden"
                    >
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-stone-950/98 backdrop-blur-2xl"
                            onClick={() => setIsMenuOpen(false)}
                        />

                        {/* Menu Content */}
                        <motion.nav
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.25, delay: 0.05 }}
                            className="relative h-full flex flex-col pt-28 px-6"
                        >
                            <div className="space-y-0.5">
                                {navLinks.map((link, index) => (
                                    <motion.div
                                        key={link.href}
                                        initial={{ opacity: 0, x: -15 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.08 + index * 0.04 }}
                                    >
                                        <Link
                                            href={link.href}
                                            onClick={() => setIsMenuOpen(false)}
                                            className="flex items-center gap-4 px-4 py-4 text-lg font-medium text-stone-300 hover:text-white hover:bg-white/[0.04] rounded-xl transition-all active:scale-[0.98]"
                                        >
                                            <link.icon className="w-5 h-5 text-cyan-400/70" />
                                            {link.label}
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="mt-6 px-4"
                            >
                                <div className="border-t border-white/[0.06] pt-5">
                                    <button
                                        onClick={toggleUnitSystem}
                                        className="w-full flex items-center justify-between px-4 py-3.5 text-sm font-medium text-stone-400 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] rounded-xl transition-all"
                                    >
                                        <span>Unit System</span>
                                        <span className="font-mono font-bold text-cyan-400 text-xs">
                                            {unitSystem === 'metric' ? 'METRIC' : 'IMPERIAL'}
                                        </span>
                                    </button>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="mt-auto pb-12 px-4"
                            >
                                <SafeSignedOut>
                                    <Link href="/sign-in" onClick={() => setIsMenuOpen(false)}>
                                        <button className="w-full py-3.5 text-white rounded-xl font-semibold text-base bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 transition-all shadow-lg shadow-cyan-500/20">
                                            Sign In to CrankSmith
                                        </button>
                                    </Link>
                                </SafeSignedOut>

                                <p className="text-center text-stone-700 text-xs mt-5 font-medium tracking-wide uppercase">
                                    Precision cycling engineering
                                </p>
                            </motion.div>
                        </motion.nav>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Spacer to prevent content from going under fixed header */}
            <div className="pt-safe">
                <div className="h-16 md:h-18" />
            </div>
        </>
    );
}

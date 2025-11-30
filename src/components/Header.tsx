'use client';

import { UserButton, SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Wrench, Activity, Gauge, Scale } from 'lucide-react';
import { useSettingsStore } from '@/store/settingsStore';

const navLinks = [
    { href: '/builder', label: 'Builder', icon: Wrench },
    { href: '/performance', label: 'Drivetrain', icon: Activity },
    { href: '/tire-pressure', label: 'Tire Pressure', icon: Gauge },
    { href: '/weight', label: 'Scale', icon: Scale },
];

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { unitSystem, toggleUnitSystem } = useSettingsStore();

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
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                    ? 'bg-stone-950/90 backdrop-blur-xl border-b border-white/5'
                    : 'bg-transparent'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex justify-between items-center h-16 md:h-18">
                        {/* Logo */}
                        <Link
                            href="/"
                            className="flex items-center gap-2 text-stone-100 hover:text-primary transition-colors group"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    className="w-5 h-5 text-white"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <circle cx="12" cy="12" r="10" />
                                    <circle cx="12" cy="12" r="4" />
                                    <line x1="12" y1="2" x2="12" y2="4" />
                                    <line x1="12" y1="20" x2="12" y2="22" />
                                    <line x1="2" y1="12" x2="4" y2="12" />
                                    <line x1="20" y1="12" x2="22" y2="12" />
                                </svg>
                            </div>
                            <span className="font-semibold text-lg tracking-tight">
                                CrankSmith
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="px-4 py-2 text-sm font-medium text-stone-400 hover:text-stone-100 hover:bg-white/5 rounded-lg transition-all"
                                >
                                    {link.label}
                                </Link>
                            ))}

                            <div className="ml-4 pl-4 border-l border-white/10 flex items-center gap-3">
                                <button
                                    onClick={toggleUnitSystem}
                                    className="px-3 py-1.5 text-xs font-mono font-bold text-stone-500 hover:text-white border border-white/10 rounded uppercase transition-colors"
                                >
                                    {unitSystem === 'metric' ? 'KM/H' : 'MPH'}
                                </button>
                                <SignedIn>
                                    <UserButton
                                        appearance={{
                                            elements: {
                                                avatarBox: "w-8 h-8 ring-2 ring-white/10 ring-offset-2 ring-offset-stone-950"
                                            }
                                        }}
                                    />
                                </SignedIn>
                                <SignedOut>
                                    <SignInButton mode="modal">
                                        <button className="btn-primary px-5 py-2 text-white rounded-lg font-medium text-sm">
                                            Sign In
                                        </button>
                                    </SignInButton>
                                </SignedOut>
                            </div>
                        </nav>

                        {/* Mobile Menu Button */}
                        <div className="flex md:hidden items-center gap-3">
                            <SignedIn>
                                <UserButton
                                    appearance={{
                                        elements: {
                                            avatarBox: "w-8 h-8"
                                        }
                                    }}
                                />
                            </SignedIn>
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="p-2 -mr-2 text-stone-400 hover:text-stone-100 transition-colors"
                                aria-label="Toggle menu"
                            >
                                {isMenuOpen ? (
                                    <X className="w-6 h-6" />
                                ) : (
                                    <Menu className="w-6 h-6" />
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
                            className="absolute inset-0 bg-stone-950/95 backdrop-blur-xl"
                            onClick={() => setIsMenuOpen(false)}
                        />

                        {/* Menu Content */}
                        <motion.nav
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                            className="relative h-full flex flex-col pt-20 px-6"
                        >
                            <div className="space-y-1">
                                {navLinks.map((link, index) => (
                                    <motion.div
                                        key={link.href}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 + index * 0.05 }}
                                    >
                                        <Link
                                            href={link.href}
                                            onClick={() => setIsMenuOpen(false)}
                                            className="flex items-center gap-4 px-4 py-4 text-xl font-medium text-stone-300 hover:text-stone-100 hover:bg-white/5 rounded-xl transition-all active:scale-[0.98]"
                                        >
                                            <link.icon className="w-6 h-6 text-primary" />
                                            {link.label}
                                        </Link>
                                    </motion.div>
                                ))}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="px-4 py-4"
                                >
                                    <button
                                        onClick={toggleUnitSystem}
                                        className="w-full flex items-center justify-between px-4 py-3 text-lg font-medium text-stone-300 hover:text-stone-100 bg-white/5 rounded-xl transition-all"
                                    >
                                        <span>Units</span>
                                        <span className="font-mono font-bold text-primary">
                                            {unitSystem === 'metric' ? 'Metric (KM/H)' : 'Imperial (MPH)'}
                                        </span>
                                    </button>
                                </motion.div>
                            </div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="mt-auto pb-12"
                            >
                                <SignedOut>
                                    <SignInButton mode="modal">
                                        <button
                                            onClick={() => setIsMenuOpen(false)}
                                            className="w-full btn-primary py-4 text-white rounded-xl font-semibold text-lg"
                                        >
                                            Sign In
                                        </button>
                                    </SignInButton>
                                </SignedOut>

                                <p className="text-center text-stone-600 text-sm mt-6">
                                    Precision engineering for cyclists
                                </p>
                            </motion.div>
                        </motion.nav>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Spacer to prevent content from going under fixed header */}
            <div className="h-16 md:h-18" />
        </>
    );
}

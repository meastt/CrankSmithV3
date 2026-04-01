'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Wrench, Activity, Gauge, Scale, Bike } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
    { href: '/builder', label: 'Builder', icon: Wrench },
    { href: '/garage', label: 'Garage', icon: Bike },
    { href: '/performance', label: 'Drivetrain', icon: Activity },
    { href: '/tire-pressure', label: 'Pressure', icon: Gauge },
    { href: '/weight', label: 'Scale', icon: Scale },
];

export function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-stone-950/80 backdrop-blur-xl border-t border-white/5 pb-safe">
            <div className="flex items-center justify-around h-16 px-2">
                {navLinks.map((link) => {
                    const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));
                    const Icon = link.icon;

                    return (
                        <Link
                            key={link.href}
                            href={link.href === '/builder' ? '/builder?new=true' : link.href}
                            className="relative flex flex-col items-center justify-center w-full h-full gap-1 group"
                        >
                            <div className={cn(
                                "relative p-1.5 rounded-xl transition-all duration-300",
                                isActive ? "text-primary bg-primary/10" : "text-stone-500 group-hover:text-stone-300"
                            )}>
                                <Icon className={cn(
                                    "w-5 h-5 transition-transform duration-300",
                                    isActive ? "scale-110" : "group-active:scale-90"
                                )} />
                                
                                {isActive && (
                                    <motion.div
                                        layoutId="bottom-nav-active"
                                        className="absolute -inset-1 bg-primary/20 blur-md rounded-full -z-10"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                )}
                            </div>
                            
                            <span className={cn(
                                "text-[10px] font-medium transition-colors duration-300",
                                isActive ? "text-primary" : "text-stone-500 group-hover:text-stone-300"
                            )}>
                                {link.label}
                            </span>

                            {isActive && (
                                <motion.div
                                    layoutId="bottom-nav-dot"
                                    className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]"
                                />
                            )}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}

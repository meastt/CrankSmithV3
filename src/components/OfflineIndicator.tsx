'use client';

import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { WifiOff, Wifi } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export function OfflineIndicator() {
    const isOnline = useOnlineStatus();
    const [showReconnected, setShowReconnected] = useState(false);
    const [wasOffline, setWasOffline] = useState(false);

    useEffect(() => {
        if (!isOnline) {
            setWasOffline(true);
        } else if (wasOffline && isOnline) {
            // Show "reconnected" message briefly
            setShowReconnected(true);
            const timer = setTimeout(() => {
                setShowReconnected(false);
                setWasOffline(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isOnline, wasOffline]);

    return (
        <AnimatePresence mode="wait">
            {!isOnline && (
                <motion.div
                    key="offline"
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="fixed top-0 left-0 right-0 z-[100] bg-amber-500/95 backdrop-blur-sm border-b border-amber-600/50 shadow-lg"
                >
                    <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-center gap-3">
                        <WifiOff className="w-5 h-5 text-amber-950" />
                        <p className="text-sm font-medium text-amber-950">
                            You&apos;re offline. Some features may be limited.
                        </p>
                    </div>
                </motion.div>
            )}

            {showReconnected && isOnline && (
                <motion.div
                    key="reconnected"
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="fixed top-0 left-0 right-0 z-[100] bg-emerald-500/95 backdrop-blur-sm border-b border-emerald-600/50 shadow-lg"
                >
                    <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-center gap-3">
                        <Wifi className="w-5 h-5 text-emerald-950" />
                        <p className="text-sm font-medium text-emerald-950">
                            Back online! Connection restored.
                        </p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

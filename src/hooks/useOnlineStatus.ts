'use client';

import { useState, useEffect } from 'react';

export function useOnlineStatus(): boolean {
    const [isOnline, setIsOnline] = useState(() => {
        if (typeof navigator === 'undefined') return true;
        return navigator.onLine;
    });

    useEffect(() => {
        const handleOnline = () => {
            console.log('[Online] Connection restored');
            setIsOnline(true);
        };

        const handleOffline = () => {
            console.log('[Offline] Connection lost');
            setIsOnline(false);
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return isOnline;
}

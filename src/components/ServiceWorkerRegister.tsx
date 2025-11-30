'use client';

import { useEffect } from 'react';
import { syncQueue } from '@/lib/syncQueue';

export function ServiceWorkerRegister() {
    useEffect(() => {
        if ('serviceWorker' in navigator && window.location.hostname !== 'localhost') {
            navigator.serviceWorker
                .register('/sw.js')
                .then((registration) => {
                    console.log('Service Worker registered with scope:', registration.scope);
                })
                .catch((error) => {
                    console.error('Service Worker registration failed:', error);
                });

            // Listen for messages from service worker
            navigator.serviceWorker.addEventListener('message', (event) => {
                if (event.data && event.data.type === 'PROCESS_SYNC_QUEUE') {
                    console.log('[SW Message] Processing sync queue');
                    syncQueue.processQueue().catch(console.error);
                }
            });
        }
    }, []);

    return null;
}

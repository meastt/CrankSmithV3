'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function CapacitorInit() {
    const router = useRouter();

    useEffect(() => {
        const initCapacitor = async () => {
            // Only run on native platforms
            const { Capacitor } = await import('@capacitor/core');
            if (!Capacitor.isNativePlatform()) return;

            // Status Bar — light text on dark background
            try {
                const { StatusBar, Style } = await import('@capacitor/status-bar');
                await StatusBar.setStyle({ style: Style.Dark });
                await StatusBar.setBackgroundColor({ color: '#030712' });
            } catch (e) {
                // StatusBar not available on this platform
            }

            // Android Back Button — navigate back instead of closing app
            try {
                const { App } = await import('@capacitor/app');
                App.addListener('backButton', ({ canGoBack }) => {
                    if (canGoBack) {
                        router.back();
                    } else {
                        App.minimizeApp();
                    }
                });
            } catch (e) {
                // App plugin not available
            }

            // Keyboard — scroll focused input into view
            try {
                const { Keyboard } = await import('@capacitor/keyboard');
                Keyboard.addListener('keyboardWillShow', () => {
                    document.body.classList.add('keyboard-open');
                });
                Keyboard.addListener('keyboardWillHide', () => {
                    document.body.classList.remove('keyboard-open');
                });
            } catch (e) {
                // Keyboard plugin not available
            }
        };

        initCapacitor();
    }, [router]);

    return null;
}

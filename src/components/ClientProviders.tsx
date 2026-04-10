'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { ToastProvider } from '@/components/ui/Toast';

const SKIP_CLERK = !process.env.CLERK_SECRET_KEY || process.env.CLERK_SECRET_KEY?.startsWith('sk_test_DUMMY');

export function ClientProviders({ children }: { children: React.ReactNode }) {
    if (SKIP_CLERK) {
        return <ToastProvider>{children}</ToastProvider>;
    }
    return (
        <ClerkProvider>
            <ToastProvider>{children}</ToastProvider>
        </ClerkProvider>
    );
}

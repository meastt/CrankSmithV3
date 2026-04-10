import { ToastProvider } from '@/components/ui/Toast';
import dynamic from 'next/dynamic';

const ClerkProvider = dynamic(
    () => import('./ClerkProviderWrapper').then(m => m.ClerkProviderWrapper),
    { ssr: false }
);

// Skip Clerk during static build (no real keys available)
const isBuild = typeof window === 'undefined' && (!process.env.CLERK_SECRET_KEY || process.env.CLERK_SECRET_KEY?.startsWith('sk_test_DUMMY'));

export function Providers({ children }: { children: React.ReactNode }) {
    if (isBuild) {
        return <ToastProvider>{children}</ToastProvider>;
    }
    return (
        <ClerkProvider>
            <ToastProvider>{children}</ToastProvider>
        </ClerkProvider>
    );
}

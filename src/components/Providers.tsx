import { ClerkProvider } from '@clerk/nextjs';
import { ToastProvider } from '@/components/ui/Toast';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ClerkProvider>
            <ToastProvider>{children}</ToastProvider>
        </ClerkProvider>
    );
}

import { ToastProvider } from '@/components/ui/Toast';

// Clerk is not yet configured — skip it. When ready, create
// src/components/ClerkProviderWrapper.tsx and restore the import.
const hasClerk = false;

export function Providers({ children }: { children: React.ReactNode }) {
    return <ToastProvider>{children}</ToastProvider>;
}

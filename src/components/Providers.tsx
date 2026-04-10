'use client';

import { ToastProvider } from '@/components/ui/Toast';
import { ClerkProviderWrapper } from '@/components/ClerkProviderWrapper';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProviderWrapper>
      <ToastProvider>{children}</ToastProvider>
    </ClerkProviderWrapper>
  );
}

'use client';

import React, { createContext, useContext, type ReactNode } from 'react';

interface MockUser {
  imageUrl: string;
  fullName: string | null;
  primaryEmailAddress: { emailAddress: string } | null;
}

interface ClerkState {
  user: MockUser | null;
  isLoaded: boolean;
  isSignedIn: boolean;
  session: null;
  openSignIn: () => void;
  openSignUp: () => void;
  signOut: () => Promise<void>;
}

const defaultState: ClerkState = {
  user: null,
  isLoaded: true,
  isSignedIn: false,
  session: null,
  openSignIn: () => { if (typeof window !== 'undefined') window.location.href = '/sign-in'; },
  openSignUp: () => { if (typeof window !== 'undefined') window.location.href = '/sign-up'; },
  signOut: async () => {},
};

const ClerkCtx = createContext<ClerkState>(defaultState);

export function useSafeClerk() { return useContext(ClerkCtx); }

export function useSafeUser() {
  const { user, isLoaded, isSignedIn } = useContext(ClerkCtx);
  return { user, isLoaded, isSignedIn };
}

export function useSafeSession() {
  const { session, isLoaded, isSignedIn } = useContext(ClerkCtx);
  return { session, isLoaded, isSignedIn };
}

export function SafeSignedIn({ children }: { children: ReactNode }) {
  const { isSignedIn } = useContext(ClerkCtx);
  return isSignedIn ? <>{children}</> : null;
}

export function SafeSignedOut({ children }: { children: ReactNode }) {
  const { isSignedIn } = useContext(ClerkCtx);
  return !isSignedIn ? <>{children}</> : null;
}

// Accept any props so existing JSX with appearance/signUpUrl/etc compiles cleanly.
// When real Clerk keys are added, swap these for real @clerk/nextjs components.
export function SafeUserButton(_props: Record<string, unknown>) { return null; }
export function SafeSignInButton({ children, ..._ }: { children?: ReactNode; [key: string]: unknown }) {
  return <>{children}</>;
}
export function SafeSignIn(_props: Record<string, unknown>) { return null; }
export function SafeSignUp(_props: Record<string, unknown>) { return null; }

export function ClerkProviderWrapper({ children }: { children: ReactNode }) {
  return <ClerkCtx.Provider value={defaultState}>{children}</ClerkCtx.Provider>;
}

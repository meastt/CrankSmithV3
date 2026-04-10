/**
 * Clerk stub — used when CLERK_SECRET_KEY is not configured.
 * Allows the app to build and render without ClerkProvider.
 * Replace with real @clerk/nextjs imports when Clerk is configured.
 */
'use client';

export const useUser = () => ({
    isLoaded: true as const,
    isSignedIn: false as const,
    user: null as { id?: string; fullName?: string | null; imageUrl?: string; primaryEmailAddress?: { emailAddress?: string } | null } | null,
});

export const useClerk = () => ({
    openSignIn: () => {},
    openSignUp: () => {},
    signOut: () => {},
});

export const useAuth = () => ({
    isLoaded: true,
    isSignedIn: false,
    userId: null,
    sessionId: null,
    getToken: () => null,
});

export const SignedIn = ({ children }: { children?: React.ReactNode }) => null;
export const SignedOut = ({ children }: { children?: React.ReactNode }) => children ?? null;
export const SignInButton = ({ children, mode, ...rest }: Record<string, any>) => children;
export const UserButton = (_props: { appearance?: { elements?: Record<string, string> } }) => null;
export const UserResource = {} as any;

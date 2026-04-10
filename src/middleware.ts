import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([]);

// Skip Clerk entirely during static build (no real keys available)
const SKIP_CLERK = !process.env.CLERK_SECRET_KEY || process.env.CLERK_SECRET_KEY.startsWith("sk_test_DUMMY");

const middleware = SKIP_CLERK
    ? async () => NextResponse.next()
    : clerkMiddleware(async (auth, req) => {
        if (isProtectedRoute(req)) await auth.protect()
      });

export default middleware;

export const config = {
    matcher: [
        // Skip Next.js internals, static files, and Clerk webhook endpoint
        '/((?!_next|api/webhooks|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes except webhooks
        '/(api(?!/webhooks)|trpc)(.*)',
    ],
};

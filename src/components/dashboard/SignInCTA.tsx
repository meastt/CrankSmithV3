'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface SignInCTAProps {
    isLoaded: boolean;
    isSignedIn: boolean;
}

export function SignInCTA({ isLoaded, isSignedIn }: SignInCTAProps) {
    const router = useRouter();

    if (isLoaded && isSignedIn) return null;

    return (
        <section className="px-4 pb-20 md:pb-24">
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-center"
            >
                <p className="text-stone-500 mb-2">Already have an account?</p>
                <p className="text-stone-600 text-sm mb-5">
                    Save your builds, track changes, sync across devices.
                </p>
                <button
                    onClick={() => router.push('/sign-in')}
                    className="btn-primary px-8 py-3 text-white rounded-xl font-semibold text-lg hover:scale-105 transition-transform"
                >
                    Sign In to CrankSmith
                </button>
            </motion.div>
        </section>
    );
}

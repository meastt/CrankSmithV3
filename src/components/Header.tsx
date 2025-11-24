'use client';

import { UserButton, SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import Link from 'next/link';
import { Bike } from 'lucide-react';

export function Header() {
    return (
        <header className="bg-gray-900 border-b border-white/10 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link href="/" className="flex items-center space-x-2 text-white hover:text-blue-400 transition-colors">
                        <Bike className="w-6 h-6" />
                        <span className="font-bold text-lg">CrankSmith Pro</span>
                    </Link>

                    <nav className="flex items-center space-x-6">
                        <Link href="/builder" className="text-gray-300 hover:text-white transition-colors">
                            Builder
                        </Link>
                        <Link href="/garage" className="text-gray-300 hover:text-white transition-colors">
                            Garage
                        </Link>
                        <Link href="/compatibility" className="text-gray-300 hover:text-white transition-colors">
                            Compatibility
                        </Link>

                        <SignedIn>
                            <UserButton
                                appearance={{
                                    elements: {
                                        avatarBox: "w-8 h-8"
                                    }
                                }}
                            />
                        </SignedIn>
                        <SignedOut>
                            <SignInButton mode="modal">
                                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors text-sm">
                                    Sign In
                                </button>
                            </SignInButton>
                        </SignedOut>
                    </nav>
                </div>
            </div>
        </header>
    );
}

'use client';

import { WifiOff } from 'lucide-react';

export default function OfflinePage() {
    return (
        <div className="min-h-screen bg-stone-950 flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                <div className="mb-8 flex justify-center">
                    <div className="w-24 h-24 rounded-full bg-stone-900/50 border border-white/10 flex items-center justify-center">
                        <WifiOff className="w-12 h-12 text-stone-500" />
                    </div>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    You&apos;re Offline
                </h1>

                <p className="text-stone-400 text-lg mb-8">
                    It looks like you&apos;ve lost your connection. Some features may be limited until you&apos;re back online.
                </p>

                <div className="bg-stone-900/30 border border-white/5 rounded-xl p-6 text-left">
                    <h2 className="text-sm font-semibold text-stone-300 mb-3 uppercase tracking-wide">
                        What you can still do:
                    </h2>
                    <ul className="space-y-2 text-stone-400">
                        <li className="flex items-start">
                            <span className="text-cyan-500 mr-2">•</span>
                            <span>View previously loaded pages</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-cyan-500 mr-2">•</span>
                            <span>Access cached build data</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-cyan-500 mr-2">•</span>
                            <span>Use tools with local calculations</span>
                        </li>
                    </ul>
                </div>

                <button
                    onClick={() => window.location.reload()}
                    className="mt-8 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-lg transition-colors"
                >
                    Try Again
                </button>
            </div>
        </div>
    );
}

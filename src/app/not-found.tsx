'use client';

import { notFound } from 'next/navigation';

export default function NotFoundPage() {
    return (
        <div className="min-h-screen bg-gray-950 pt-24 pb-12 px-4 flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-white mb-4">404</h1>
                <p className="text-gray-400 mb-8">Page not found</p>
                <a href="/" className="text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-2">← Back to Home</a>
            </div>
        </div>
    );
}

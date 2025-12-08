'use client';

import { AlertTriangle } from 'lucide-react';

export function DevBanner() {
    return (
        <div className="bg-yellow-900/40 border-b border-yellow-500/20 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 py-2 sm:px-6 flex items-center justify-center gap-2 text-xs sm:text-sm font-medium text-yellow-200/90 text-center">
                <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0" />
                <p>
                    In Development & Testing Phase — Platform is continuously updated, expect occasional processing errors.
                </p>
            </div>
        </div>
    );
}

'use client';

import React from 'react';
import { Loader2, AlertTriangle, Inbox } from 'lucide-react';

interface LoadingStateProps {
    message?: string;
    className?: string;
}

export function LoadingState({ message = 'Loading...', className = '' }: LoadingStateProps) {
    return (
        <div className={`flex flex-col items-center justify-center py-16 ${className}`}>
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
            <p className="text-sm text-stone-400">{message}</p>
        </div>
    );
}

interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    message?: string;
    action?: React.ReactNode;
    className?: string;
}

export function EmptyState({ icon, title, message, action, className = '' }: EmptyStateProps) {
    return (
        <div className={`flex flex-col items-center justify-center py-16 text-center ${className}`}>
            <div className="mb-4 text-stone-600">
                {icon || <Inbox className="w-12 h-12" />}
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
            {message && <p className="text-sm text-stone-400 max-w-md mb-6">{message}</p>}
            {action}
        </div>
    );
}

interface ErrorStateProps {
    title?: string;
    message?: string;
    onRetry?: () => void;
    className?: string;
}

export function ErrorState({
    title = 'Something went wrong',
    message = 'An error occurred. Please try again.',
    onRetry,
    className = '',
}: ErrorStateProps) {
    return (
        <div className={`flex flex-col items-center justify-center py-16 text-center ${className}`}>
            <AlertTriangle className="w-10 h-10 text-red-400 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
            <p className="text-sm text-stone-400 max-w-md mb-6">{message}</p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white rounded-lg text-sm font-medium transition-colors"
                >
                    Try Again
                </button>
            )}
        </div>
    );
}

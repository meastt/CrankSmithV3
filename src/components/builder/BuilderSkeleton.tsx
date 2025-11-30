import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';

export const BuilderSkeleton: React.FC = () => {
    return (
        <div className="h-full flex flex-col bg-stone-950">
            {/* Mobile Navigation Skeleton */}
            <div className="md:hidden border-b border-white/5 bg-stone-900/50 p-4">
                <div className="flex items-center justify-between">
                    <Skeleton width={120} height={24} />
                    <div className="flex gap-2">
                        <Skeleton variant="circular" width={40} height={40} />
                        <Skeleton variant="circular" width={40} height={40} />
                    </div>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Desktop Sidebar Skeleton */}
                <div className="hidden md:flex w-80 border-r border-white/5 bg-stone-900/30 flex-col">
                    {/* Header */}
                    <div className="p-6 border-b border-white/5">
                        <Skeleton width={150} height={28} className="mb-4" />
                        <Skeleton width="100%" height={20} className="mb-2" />
                        <Skeleton width="80%" height={20} />
                    </div>

                    {/* Build Steps */}
                    <div className="flex-1 overflow-y-auto p-4">
                        <div className="space-y-3">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-3 p-3 rounded-lg bg-stone-800/30"
                                >
                                    <Skeleton variant="circular" width={40} height={40} />
                                    <div className="flex-1">
                                        <Skeleton width="60%" height={16} className="mb-2" />
                                        <Skeleton width="80%" height={12} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-4 border-t border-white/5 space-y-2">
                        <Skeleton width="100%" height={40} />
                        <Skeleton width="100%" height={40} />
                    </div>
                </div>

                {/* Main Content Area Skeleton */}
                <div className="flex-1 overflow-y-auto">
                    <div className="max-w-7xl mx-auto p-6">
                        {/* Header */}
                        <div className="mb-8">
                            <Skeleton width={200} height={32} className="mb-4" />
                            <Skeleton width="60%" height={20} />
                        </div>

                        {/* Filter/Category Pills */}
                        <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <Skeleton key={i} width={100} height={36} />
                            ))}
                        </div>

                        {/* Parts Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Array.from({ length: 9 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="bg-stone-900/50 border border-white/5 rounded-xl p-6"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <Skeleton width="70%" height={20} className="mb-2" />
                                            <Skeleton width="50%" height={16} />
                                        </div>
                                        <Skeleton variant="circular" width={32} height={32} />
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex justify-between">
                                            <Skeleton width="40%" height={14} />
                                            <Skeleton width="30%" height={14} />
                                        </div>
                                        <div className="flex justify-between">
                                            <Skeleton width="45%" height={14} />
                                            <Skeleton width="35%" height={14} />
                                        </div>
                                        <div className="flex justify-between">
                                            <Skeleton width="50%" height={14} />
                                            <Skeleton width="25%" height={14} />
                                        </div>
                                    </div>

                                    <Skeleton width="100%" height={36} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Performance Panel Skeleton (Desktop) */}
                <div className="hidden lg:flex w-80 border-l border-white/5 bg-stone-900/30 flex-col p-6">
                    <Skeleton width={150} height={24} className="mb-6" />

                    <div className="space-y-6">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="space-y-3">
                                <Skeleton width="60%" height={16} />
                                <div className="bg-stone-800/30 rounded-lg p-4">
                                    <Skeleton width="100%" height={80} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

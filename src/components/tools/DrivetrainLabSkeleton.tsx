import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';

export const DrivetrainLabSkeleton: React.FC = () => {
    return (
        <div className="w-full max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
                {/* Left Panel - Configuration Cards */}
                <div className="lg:col-span-4 space-y-4">
                    {/* Setup 1 Card */}
                    <div className="bg-stone-900/50 border border-white/5 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <Skeleton width={100} height={20} />
                            <Skeleton variant="circular" width={32} height={32} />
                        </div>
                        <div className="space-y-4">
                            <div>
                                <Skeleton width={80} height={14} className="mb-2" />
                                <Skeleton width="100%" height={40} />
                            </div>
                            <div>
                                <Skeleton width={80} height={14} className="mb-2" />
                                <Skeleton width="100%" height={40} />
                            </div>
                            <div>
                                <Skeleton width={80} height={14} className="mb-2" />
                                <Skeleton width="100%" height={40} />
                            </div>
                        </div>
                    </div>

                    {/* Setup 2 Card */}
                    <div className="bg-stone-900/50 border border-white/5 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <Skeleton width={100} height={20} />
                            <Skeleton variant="circular" width={32} height={32} />
                        </div>
                        <div className="space-y-4">
                            <div>
                                <Skeleton width={80} height={14} className="mb-2" />
                                <Skeleton width="100%" height={40} />
                            </div>
                            <div>
                                <Skeleton width={80} height={14} className="mb-2" />
                                <Skeleton width="100%" height={40} />
                            </div>
                            <div>
                                <Skeleton width={80} height={14} className="mb-2" />
                                <Skeleton width="100%" height={40} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel - Chart Area */}
                <div className="lg:col-span-8">
                    <div className="bg-stone-900/50 border border-white/5 rounded-xl p-6">
                        {/* Chart Header */}
                        <div className="flex items-center justify-between mb-6">
                            <Skeleton width={150} height={24} />
                            <div className="flex gap-2">
                                <Skeleton width={80} height={32} />
                                <Skeleton width={80} height={32} />
                            </div>
                        </div>

                        {/* Chart Area */}
                        <div className="relative">
                            <Skeleton width="100%" height={320} />
                        </div>

                        {/* Legend */}
                        <div className="flex justify-center gap-6 mt-6">
                            <div className="flex items-center gap-2">
                                <Skeleton variant="circular" width={12} height={12} />
                                <Skeleton width={60} height={14} />
                            </div>
                            <div className="flex items-center gap-2">
                                <Skeleton variant="circular" width={12} height={12} />
                                <Skeleton width={60} height={14} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div
                        key={i}
                        className="bg-stone-900/50 border border-white/5 rounded-xl p-6"
                    >
                        <Skeleton width={120} height={16} className="mb-4" />
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <Skeleton width={80} height={14} />
                                <Skeleton width={60} height={20} />
                            </div>
                            <div className="flex justify-between items-center">
                                <Skeleton width={80} height={14} />
                                <Skeleton width={60} height={20} />
                            </div>
                            <div className="flex justify-between items-center">
                                <Skeleton width={80} height={14} />
                                <Skeleton width={60} height={20} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

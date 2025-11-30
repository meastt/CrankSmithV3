import React from 'react';

interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'circular' | 'rectangular';
    width?: string | number;
    height?: string | number;
    animation?: 'pulse' | 'wave' | 'none';
}

export const Skeleton: React.FC<SkeletonProps> = ({
    className = '',
    variant = 'rectangular',
    width,
    height,
    animation = 'pulse',
}) => {
    const baseClass = 'bg-stone-800/50';

    const variantClass = {
        text: 'rounded',
        circular: 'rounded-full',
        rectangular: 'rounded-lg',
    }[variant];

    const animationClass = {
        pulse: 'animate-pulse',
        wave: 'animate-shimmer',
        none: '',
    }[animation];

    const style: React.CSSProperties = {};
    if (width) style.width = typeof width === 'number' ? `${width}px` : width;
    if (height) style.height = typeof height === 'number' ? `${height}px` : height;

    return (
        <div
            className={`${baseClass} ${variantClass} ${animationClass} ${className}`}
            style={style}
        />
    );
};

export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({
    lines = 3,
    className = '',
}) => {
    return (
        <div className={`space-y-2 ${className}`}>
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton
                    key={i}
                    variant="text"
                    height={16}
                    width={i === lines - 1 ? '70%' : '100%'}
                />
            ))}
        </div>
    );
};

'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface UsePullToRefreshOptions {
    onRefresh: () => Promise<void>;
    threshold?: number; // pixels to pull before triggering
}

export function usePullToRefresh({ onRefresh, threshold = 80 }: UsePullToRefreshOptions) {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [pullDistance, setPullDistance] = useState(0);
    const startY = useRef(0);
    const isPulling = useRef(false);

    const handleRefresh = useCallback(async () => {
        setIsRefreshing(true);
        try {
            await onRefresh();
        } finally {
            setIsRefreshing(false);
            setPullDistance(0);
        }
    }, [onRefresh]);

    useEffect(() => {
        const handleTouchStart = (e: TouchEvent) => {
            // Only activate when scrolled to top
            if (window.scrollY <= 0 && !isRefreshing) {
                startY.current = e.touches[0].clientY;
                isPulling.current = true;
            }
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (!isPulling.current || isRefreshing) return;

            const currentY = e.touches[0].clientY;
            const diff = currentY - startY.current;

            if (diff > 0 && window.scrollY <= 0) {
                // Apply resistance — pull distance is less than actual finger movement
                const distance = Math.min(diff * 0.4, threshold * 1.5);
                setPullDistance(distance);
            }
        };

        const handleTouchEnd = () => {
            if (!isPulling.current) return;
            isPulling.current = false;

            if (pullDistance >= threshold && !isRefreshing) {
                handleRefresh();
            } else {
                setPullDistance(0);
            }
        };

        document.addEventListener('touchstart', handleTouchStart, { passive: true });
        document.addEventListener('touchmove', handleTouchMove, { passive: true });
        document.addEventListener('touchend', handleTouchEnd, { passive: true });

        return () => {
            document.removeEventListener('touchstart', handleTouchStart);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
        };
    }, [isRefreshing, pullDistance, threshold, handleRefresh]);

    return { isRefreshing, pullDistance, threshold };
}

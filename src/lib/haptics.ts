/**
 * Haptic feedback utilities for native-feeling interactions
 * Uses the Vibration API for mobile devices
 */

type HapticPattern = number | number[];

const HAPTIC_PATTERNS: Record<string, HapticPattern> = {
    // Light tap for button presses
    light: 10,

    // Medium feedback for selections/toggles
    medium: 20,

    // Strong feedback for important actions
    strong: 30,

    // Success pattern
    success: [10, 50, 10],

    // Error pattern
    error: [20, 100, 20, 100, 20],

    // Warning pattern
    warning: [15, 80, 15],
};

/**
 * Trigger haptic feedback if the device supports it
 */
export function haptic(pattern: keyof typeof HAPTIC_PATTERNS = 'light'): void {
    // Check if the Vibration API is supported
    if (typeof window === 'undefined' || !('vibrate' in navigator)) {
        return;
    }

    // Check if user hasn't disabled vibration (respect system settings)
    // Note: There's no direct way to check if vibration is disabled at system level
    try {
        const vibrationPattern = HAPTIC_PATTERNS[pattern];
        navigator.vibrate(vibrationPattern);
    } catch (error) {
        // Silently fail if vibration is not available
        console.debug('Haptic feedback not available:', error);
    }
}

/**
 * Cancel any ongoing vibration
 */
export function cancelHaptic(): void {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(0);
    }
}

/**
 * Custom hook for haptic feedback
 */
export function useHaptic() {
    return {
        haptic,
        cancelHaptic,
    };
}

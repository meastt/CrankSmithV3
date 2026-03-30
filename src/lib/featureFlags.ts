function parseBooleanEnv(value: string | undefined, fallback: boolean): boolean {
    if (value === undefined) return fallback;
    const normalized = value.trim().toLowerCase();
    if (['1', 'true', 'yes', 'on'].includes(normalized)) return true;
    if (['0', 'false', 'no', 'off'].includes(normalized)) return false;
    return fallback;
}

/**
 * Phase 6 soft rollback switch.
 * When false, builder-only gravel enforcement is disabled for API gating paths.
 */
export function isGravelBuilderEnabled(): boolean {
    return parseBooleanEnv(process.env.CRANKSMITH_GRAVEL_BUILDER_ENABLED, true);
}

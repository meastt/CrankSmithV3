export type FeedbackOutcome = 'too_harsh' | 'balanced' | 'burped' | 'sluggish';

export interface SetupFeedbackEntry {
    id: string;
    createdAt: string;
    source: 'tire_pressure';
    profileKey: string;
    payload: Record<string, string | number | boolean>;
    outcome: FeedbackOutcome;
    verificationStatus: 'pending' | 'verified';
    verifiedAt?: string;
    verifierNote?: string;
}

const STORAGE_KEY = 'cranksmith_setup_feedback_v1';

function readEntries(): SetupFeedbackEntry[] {
    if (typeof window === 'undefined') return [];
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        return JSON.parse(raw) as SetupFeedbackEntry[];
    } catch {
        return [];
    }
}

function writeEntries(entries: SetupFeedbackEntry[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function addSetupFeedback(
    profileKey: string,
    payload: Record<string, string | number | boolean>,
    outcome: FeedbackOutcome
): SetupFeedbackEntry {
    const entry: SetupFeedbackEntry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        createdAt: new Date().toISOString(),
        source: 'tire_pressure',
        profileKey,
        payload,
        outcome,
        verificationStatus: 'pending'
    };
    const entries = readEntries();
    entries.unshift(entry);
    writeEntries(entries);
    return entry;
}

export function getSetupFeedbackForProfile(profileKey: string): SetupFeedbackEntry[] {
    return readEntries().filter((e) => e.profileKey === profileKey);
}

export function verifySetupFeedback(entryId: string, verifierNote: string = 'Self-verified'): SetupFeedbackEntry | null {
    const entries = readEntries();
    const idx = entries.findIndex((e) => e.id === entryId);
    if (idx < 0) return null;
    entries[idx] = {
        ...entries[idx],
        verificationStatus: 'verified',
        verifiedAt: new Date().toISOString(),
        verifierNote
    };
    writeEntries(entries);
    return entries[idx];
}

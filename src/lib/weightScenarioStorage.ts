import type { SavedWeightScenario } from '@/types/weight';

export const WEIGHT_SCENARIO_STORAGE_KEY = 'cranksmith_weight_scenarios_v1';

export function loadSavedWeightScenarios(): SavedWeightScenario[] {
    if (typeof window === 'undefined') return [];
    try {
        const raw = window.localStorage.getItem(WEIGHT_SCENARIO_STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw) as Array<Partial<SavedWeightScenario>>;
        if (!Array.isArray(parsed)) return [];
        return parsed
            .filter((entry) => entry && entry.id && entry.name && entry.createdAt && entry.baseline && entry.target)
            .map((entry) => ({
                ...(entry as SavedWeightScenario),
                mode: entry.mode || 'custom',
            }));
    } catch {
        return [];
    }
}

export function persistSavedWeightScenarios(scenarios: SavedWeightScenario[]): void {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(WEIGHT_SCENARIO_STORAGE_KEY, JSON.stringify(scenarios));
}

export function buildScenarioCsv(scenario: SavedWeightScenario): string {
    const header = ['Category', 'From', 'To', 'Weight Saved (g)', 'Cost Added ($)', 'Cost/Gram ($)'];
    const rows = scenario.target.upgrades.map((upgrade) => [
        upgrade.category,
        upgrade.old_component.name,
        upgrade.new_component.name,
        String(Math.round(upgrade.weight_saved)),
        String(Math.round(upgrade.cost_added)),
        upgrade.cost_per_gram.toFixed(2),
    ]);

    return [header, ...rows]
        .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))
        .join('\n');
}

export function downloadScenarioCsv(scenario: SavedWeightScenario): void {
    const csvContent = buildScenarioCsv(scenario);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${scenario.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-shortlist.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

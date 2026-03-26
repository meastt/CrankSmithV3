import { findQuickWins, optimizeQuickWinsForBudget, type QuickWin } from './quickWins';

function makeQuickWin(
    category: 'wheels' | 'tires' | 'cassette',
    weightSaved: number,
    costAdded: number,
    score: number,
    variant: string = 'a'
): QuickWin {
    return {
        component: {
            id: `${category}-base-${variant}`,
            category,
            name: `${category} baseline`,
            brand: 'Test',
            weight: 1000,
            is_rotating: true,
        },
        upgrade: {
            component: {
                id: `${category}-upgrade-${variant}`,
                name: `${category} upgrade`,
                brand: 'Test',
                model: 'X',
                type: 'Wheel',
                attributes: { weight_g: 900, price_msrp: 200 },
                interfaces: {},
            } as any,
            weight_saved: weightSaved,
            cost_added: costAdded,
            cost_per_gram: costAdded / weightSaved,
            is_upgrade: true,
        },
        score,
        reason: 'test',
    };
}

describe('optimizeQuickWinsForBudget', () => {
    it('maximizes total grams saved under budget', () => {
        const wins: QuickWin[] = [
            makeQuickWin('wheels', 300, 900, 100),
            makeQuickWin('tires', 160, 400, 80),
            makeQuickWin('cassette', 120, 300, 60),
        ];

        const result = optimizeQuickWinsForBudget(wins, 1000);

        expect(result.totalCost).toBe(900);
        expect(result.totalWeightSaved).toBe(300);
    });

    it('keeps only best candidate per category before optimizing', () => {
        const wins: QuickWin[] = [
            makeQuickWin('wheels', 120, 400, 50, 'low-score'),
            makeQuickWin('wheels', 110, 250, 70, 'high-score'), // higher score should win for same category
            makeQuickWin('cassette', 90, 200, 40, 'base'),
        ];

        const result = optimizeQuickWinsForBudget(wins, 500);
        const selectedIds = result.selected.map((s) => s.upgrade.component.id);

        expect(selectedIds).toContain('wheels-upgrade-high-score');
        expect(selectedIds).not.toContain('wheels-upgrade-low-score');
        expect(result.totalCost).toBeLessThanOrEqual(500);
    });
});

describe('findQuickWins', () => {
    it('uses category mapping even when baseline IDs do not exist in fetched alternatives', async () => {
        const baseline = {
            id: 'baseline-1',
            name: 'Test Build',
            components: [
                {
                    id: 'imported-custom-wheel-id',
                    category: 'wheels',
                    name: 'Custom Wheelset',
                    brand: 'Custom',
                    weight: 1600,
                    cost: 400,
                    is_rotating: true,
                }
            ],
            total_weight: 8000,
            total_cost: 2000,
        } as any;

        const allComponentsMap = {
            Wheel: [
                {
                    id: 'wheel-upgrade-1',
                    name: 'Light Wheelset',
                    attributes: { weight_g: 1400, price_msrp: 900 }
                }
            ]
        } as any;

        const quickWins = await findQuickWins(baseline, allComponentsMap);

        expect(quickWins.length).toBe(1);
        expect(quickWins[0].component.category).toBe('wheels');
        expect(quickWins[0].upgrade.weight_saved).toBe(200);
    });
});

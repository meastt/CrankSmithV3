'use client';

import React from 'react';
import { Scale, ArrowLeft, FolderOpen, Trash2, Download } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useWeightStore } from '@/store/weightStore';
import { useBuildStore } from '@/store/buildStore';
import { builderPartsToBaselineBuild } from '@/lib/weightConversion';
import { BaselineDisplay } from '@/components/weight/BaselineDisplay';
import { UpgradeSimulator } from '@/components/weight/UpgradeSimulator';
import { TerrorDisplay } from '@/components/weight/TerrorDisplay';
import { ManualEntryModal } from '@/components/weight/ManualEntryModal';
import { QuickWins } from '@/components/weight/QuickWins';
import { LandingView } from '@/components/weight/LandingView';
import { haptic } from '@/lib/haptics';
import { useToast } from '@/components/ui/Toast';
import {
    downloadScenarioCsv,
    loadSavedWeightScenarios,
    persistSavedWeightScenarios
} from '@/lib/weightScenarioStorage';
import type { WeightComponent, SavedWeightScenario, ScenarioMode } from '@/types/weight';

export default function WeightPage() {
    const { viewMode, baseline, target, setBaseline, setViewMode, clearUpgrades, setTarget } = useWeightStore();
    const builderParts = useBuildStore((state) => state.parts);
    const [isManualEntryOpen, setIsManualEntryOpen] = React.useState(false);
    const [savedScenarios, setSavedScenarios] = React.useState<SavedWeightScenario[]>([]);
    const [showSaveDialog, setShowSaveDialog] = React.useState(false);
    const [scenarioName, setScenarioName] = React.useState('');
    const [scenarioMode, setScenarioMode] = React.useState<ScenarioMode>('custom');
    const [modeFilter, setModeFilter] = React.useState<'all' | ScenarioMode>('all');
    const [compareLeftId, setCompareLeftId] = React.useState<string>('');
    const [compareRightId, setCompareRightId] = React.useState<string>('');
    const { toast } = useToast();

    React.useEffect(() => {
        setSavedScenarios(loadSavedWeightScenarios());
    }, []);

    const persistSavedScenarios = React.useCallback((scenarios: SavedWeightScenario[]) => {
        setSavedScenarios(scenarios);
        persistSavedWeightScenarios(scenarios);
    }, []);

    React.useEffect(() => {
        if (savedScenarios.length === 0) {
            setCompareLeftId('');
            setCompareRightId('');
            return;
        }

        setCompareLeftId((current) => {
            if (current && savedScenarios.some((scenario) => scenario.id === current)) return current;
            return savedScenarios[0]?.id ?? '';
        });

        setCompareRightId((current) => {
            if (current && savedScenarios.some((scenario) => scenario.id === current)) return current;
            return savedScenarios[1]?.id ?? savedScenarios[0]?.id ?? '';
        });
    }, [savedScenarios]);

    const handleImportFromBuilder = () => {
        haptic('medium');

        const baselineBuild = builderPartsToBaselineBuild(builderParts, 'Imported Build');

        if (!baselineBuild) {
            toast({
                type: 'error',
                title: 'No Build Found',
                message: 'Please build a bike in the builder first!',
            });
            return;
        }

        setBaseline(baselineBuild);
    };

    const handleManualEntry = () => {
        haptic('medium');
        setIsManualEntryOpen(true);
    };

    const handleSaveManualBuild = (components: WeightComponent[]) => {
        const totalWeight = components.reduce((sum, c) => sum + c.weight, 0);
        const totalCost = components.reduce((sum, c) => sum + (c.cost || 0), 0);

        const baselineBuild = {
            id: `manual-build-${Date.now()}`,
            name: 'Manual Build',
            components,
            total_weight: totalWeight,
            total_cost: totalCost,
        };

        setBaseline(baselineBuild);
        setIsManualEntryOpen(false);
        toast({
            type: 'success',
            title: 'Build Created',
            message: 'Manual build created successfully',
        });
    };

    const handleOpenSaveDialog = () => {
        if (!baseline || !target) return;
        haptic('medium');
        setScenarioName(`${baseline.name} Plan`);
        setScenarioMode('custom');
        setShowSaveDialog(true);
    };

    const handleSaveScenario = () => {
        if (!baseline || !target) return;

        const cleanName = scenarioName.trim();
        if (!cleanName) {
            toast({
                type: 'error',
                title: 'Name Required',
                message: 'Please name this scenario before saving.',
            });
            return;
        }

        const scenario: SavedWeightScenario = {
            id: `weight-scenario-${Date.now()}`,
            name: cleanName,
            createdAt: new Date().toISOString(),
            mode: scenarioMode,
            baseline,
            target,
        };

        const next = [scenario, ...savedScenarios].slice(0, 20);
        persistSavedScenarios(next);
        setShowSaveDialog(false);
        setScenarioName('');
        setScenarioMode('custom');
        toast({
            type: 'success',
            title: 'Scenario Saved',
            message: 'Upgrade plan saved locally on this device.',
        });
    };

    const handleLoadScenario = (scenario: SavedWeightScenario) => {
        setBaseline(scenario.baseline);
        setTarget(scenario.target);
        setViewMode('upgrading');
        toast({
            type: 'success',
            title: 'Scenario Loaded',
            message: `${scenario.name} is now active.`,
        });
    };

    const handleDeleteScenario = (scenarioId: string) => {
        const next = savedScenarios.filter((scenario) => scenario.id !== scenarioId);
        persistSavedScenarios(next);
        toast({
            type: 'success',
            title: 'Scenario Removed',
            message: 'Saved plan deleted.',
        });
    };

    const handleExportScenarioCsv = (scenario: SavedWeightScenario) => {
        downloadScenarioCsv(scenario);
    };

    const visibleScenarios = modeFilter === 'all'
        ? savedScenarios
        : savedScenarios.filter((scenario) => scenario.mode === modeFilter);
    const compareLeft = visibleScenarios.find((scenario) => scenario.id === compareLeftId) || null;
    const compareRight = visibleScenarios.find((scenario) => scenario.id === compareRightId) || null;
    const compareDelta = compareLeft && compareRight
        ? {
            weightSavedDiff: compareRight.target.total_weight_saved - compareLeft.target.total_weight_saved,
            costDiff: compareRight.target.total_cost_added - compareLeft.target.total_cost_added,
            costPerGramDiff: compareRight.target.avg_cost_per_gram - compareLeft.target.avg_cost_per_gram,
        }
        : null;

    React.useEffect(() => {
        if (visibleScenarios.length === 0) {
            setCompareLeftId('');
            setCompareRightId('');
            return;
        }

        if (!visibleScenarios.some((scenario) => scenario.id === compareLeftId)) {
            setCompareLeftId(visibleScenarios[0].id);
        }
        if (!visibleScenarios.some((scenario) => scenario.id === compareRightId)) {
            setCompareRightId(visibleScenarios[1]?.id ?? visibleScenarios[0].id);
        }
    }, [visibleScenarios, compareLeftId, compareRightId]);

    return (
        <div className="min-h-screen bg-stone-950 text-white">
            {showSaveDialog && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4">
                    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-stone-900 p-5">
                        <h2 className="text-lg font-semibold text-white mb-2">Save Upgrade Scenario</h2>
                        <p className="text-sm text-stone-400 mb-4">Name this plan so you can load and compare it later.</p>
                        <input
                            value={scenarioName}
                            onChange={(e) => setScenarioName(e.target.value)}
                            placeholder="Spring gravel race plan"
                            className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white placeholder-stone-600 focus:outline-none focus:border-emerald-500/50"
                        />
                        <div className="mt-3">
                            <label className="text-xs text-stone-500 uppercase tracking-wide mb-1 block">Scenario mode</label>
                            <select
                                value={scenarioMode}
                                onChange={(e) => setScenarioMode(e.target.value as ScenarioMode)}
                                className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white focus:outline-none focus:border-emerald-500/50"
                            >
                                <option value="custom">Custom</option>
                                <option value="race">Race</option>
                                <option value="training">Training</option>
                                <option value="all-weather">All-weather</option>
                            </select>
                        </div>
                        <div className="mt-4 flex items-center justify-end gap-2">
                            <button
                                onClick={() => setShowSaveDialog(false)}
                                className="px-3 py-2 rounded-lg text-sm text-stone-300 hover:text-white hover:bg-white/5"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveScenario}
                                className="px-3 py-2 rounded-lg text-sm bg-emerald-500 hover:bg-emerald-600 text-white"
                            >
                                Save Scenario
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Manual Entry Modal */}
            <ManualEntryModal
                isOpen={isManualEntryOpen}
                onClose={() => setIsManualEntryOpen(false)}
                onSave={handleSaveManualBuild}
            />

            {/* Header */}
            <header className="relative z-40 bg-stone-950/80 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-stone-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="text-sm font-medium hidden sm:inline">Back to Dashboard</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <Scale className="w-5 h-5 text-emerald-500" />
                        <h1 className="text-sm font-bold text-emerald-500 uppercase tracking-wider margin-0">
                            The Scale
                        </h1>
                    </div>
                </div>
            </header>

            {/* Terror Display - Shows when upgrades are active */}
            {target && baseline && (
                <TerrorDisplay
                    baseline={baseline}
                    target={target}
                    onReset={clearUpgrades}
                    onSave={handleOpenSaveDialog}
                />
            )}

            <div className="px-4 py-12">
                {savedScenarios.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-7xl mx-auto mb-8 p-4 rounded-2xl border border-white/10 bg-stone-900/40"
                    >
                        <div className="flex items-center gap-2 text-emerald-400 mb-3">
                            <FolderOpen className="w-4 h-4" />
                            <h3 className="text-sm uppercase tracking-wider font-semibold">Saved Scenarios</h3>
                        </div>
                        <div className="space-y-2">
                            <div className="flex flex-wrap gap-2 mb-2">
                                {(['all', 'race', 'training', 'all-weather', 'custom'] as const).map((mode) => (
                                    <button
                                        key={mode}
                                        onClick={() => setModeFilter(mode)}
                                        className={`px-3 py-1.5 text-xs rounded-md border ${
                                            modeFilter === mode
                                                ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-200'
                                                : 'bg-stone-900/60 border-white/10 text-stone-300 hover:text-white'
                                        }`}
                                    >
                                        {mode === 'all' ? 'All Modes' : mode}
                                    </button>
                                ))}
                            </div>
                            {visibleScenarios.length > 1 && (
                                <div className="rounded-xl border border-white/10 bg-black/20 p-3 mb-3">
                                    <p className="text-xs uppercase tracking-wider text-stone-400 mb-3">Scenario Compare</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                                        <select
                                            value={compareLeftId}
                                            onChange={(e) => setCompareLeftId(e.target.value)}
                                            className="bg-stone-900 border border-white/10 rounded-lg px-2 py-2 text-xs text-white"
                                        >
                                            {visibleScenarios.map((scenario) => (
                                                <option key={`left-${scenario.id}`} value={scenario.id}>{scenario.name}</option>
                                            ))}
                                        </select>
                                        <select
                                            value={compareRightId}
                                            onChange={(e) => setCompareRightId(e.target.value)}
                                            className="bg-stone-900 border border-white/10 rounded-lg px-2 py-2 text-xs text-white"
                                        >
                                            {visibleScenarios.map((scenario) => (
                                                <option key={`right-${scenario.id}`} value={scenario.id}>{scenario.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    {compareLeft && compareRight && compareDelta && (
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                                            <div className="rounded-lg border border-white/10 bg-stone-900/50 p-2">
                                                <p className="text-stone-500">Weight saved delta</p>
                                                <p className={`font-mono ${compareDelta.weightSavedDiff >= 0 ? 'text-emerald-300' : 'text-amber-300'}`}>
                                                    {compareDelta.weightSavedDiff >= 0 ? '+' : ''}{Math.round(compareDelta.weightSavedDiff)}g
                                                </p>
                                            </div>
                                            <div className="rounded-lg border border-white/10 bg-stone-900/50 p-2">
                                                <p className="text-stone-500">Cost delta</p>
                                                <p className={`font-mono ${compareDelta.costDiff <= 0 ? 'text-emerald-300' : 'text-amber-300'}`}>
                                                    {compareDelta.costDiff >= 0 ? '+' : ''}${Math.round(compareDelta.costDiff)}
                                                </p>
                                            </div>
                                            <div className="rounded-lg border border-white/10 bg-stone-900/50 p-2">
                                                <p className="text-stone-500">$/g delta</p>
                                                <p className={`font-mono ${compareDelta.costPerGramDiff <= 0 ? 'text-emerald-300' : 'text-amber-300'}`}>
                                                    {compareDelta.costPerGramDiff >= 0 ? '+' : ''}{compareDelta.costPerGramDiff.toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                            {visibleScenarios.map((scenario) => (
                                <div key={scenario.id} className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 rounded-xl border border-white/10 p-3 bg-black/20">
                                    <div>
                                        <p className="text-sm text-white font-medium">{scenario.name}</p>
                                        <p className="text-xs text-stone-500">
                                            [{scenario.mode}] •
                                            Saved {new Date(scenario.createdAt).toLocaleString()} • {scenario.target.upgrades.length} upgrades •
                                            {' '}−{Math.round(scenario.target.total_weight_saved)}g • +${Math.round(scenario.target.total_cost_added)}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleLoadScenario(scenario)}
                                            className="px-3 py-1.5 text-xs rounded-lg border border-cyan-500/40 text-cyan-200 hover:bg-cyan-500/10"
                                        >
                                            Load
                                        </button>
                                        <button
                                            onClick={() => handleExportScenarioCsv(scenario)}
                                            className="p-2 rounded-lg border border-white/10 text-stone-300 hover:text-white hover:bg-white/5"
                                            title="Export CSV shortlist"
                                        >
                                            <Download className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteScenario(scenario.id)}
                                            className="p-2 rounded-lg border border-white/10 text-stone-400 hover:text-red-300 hover:bg-red-500/10"
                                            title="Delete scenario"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {viewMode === 'landing' && (
                    <LandingView
                        onImport={handleImportFromBuilder}
                        onManual={handleManualEntry}
                    />
                )}

                {viewMode === 'baseline' && baseline && (
                    <BaselineDisplay
                        build={baseline}
                        onStartUpgrading={() => setViewMode('upgrading')}
                        onQuickWins={() => setViewMode('quickwins')}
                    />
                )}

                {viewMode === 'upgrading' && baseline && (
                    <div className="max-w-7xl mx-auto">
                        <UpgradeSimulator
                            baseline={baseline}
                            onBack={() => setViewMode('baseline')}
                        />
                    </div>
                )}

                {viewMode === 'quickwins' && baseline && (
                    <QuickWins
                        baseline={baseline}
                        onBack={() => setViewMode('baseline')}
                    />
                )}
            </div>
        </div>
    );
}

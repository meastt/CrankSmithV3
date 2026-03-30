import fs from 'node:fs';
import { evaluateRolloutGates, RolloutGateMetrics } from '../src/lib/rolloutGates';

function readJsonFile<T>(path: string): T {
    const raw = fs.readFileSync(path, 'utf8');
    return JSON.parse(raw) as T;
}

function main() {
    const [, , baselinePath, currentPath] = process.argv;
    if (!baselinePath || !currentPath) {
        console.error('Usage: tsx scripts/check_rollout_gates.ts <baseline.json> <current.json>');
        process.exit(2);
    }

    const baseline = readJsonFile<RolloutGateMetrics>(baselinePath);
    const current = readJsonFile<RolloutGateMetrics>(currentPath);
    const result = evaluateRolloutGates(baseline, current);

    console.log(JSON.stringify(result, null, 2));
    if (!result.pass) process.exit(1);
}

main();

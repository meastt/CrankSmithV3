import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { Component } from '@/lib/types/compatibility';
import { normalizeComponent } from '@/lib/normalization';

let cachedComponents: any[] | null = null;

const DEFAULT_CSV_PATH = '/Users/michaeleast/Documents/cranksmith_parts_db_NEW_3_30_2026.csv';

export async function getComponentsFromCSV(forceRefresh = false): Promise<Component[]> {
    if (cachedComponents && !forceRefresh) {
        return cachedComponents.map(c => normalizeComponent(c));
    }

    const csvPath = process.env.LOCAL_PARTS_CSV || DEFAULT_CSV_PATH;

    try {
        if (!fs.existsSync(csvPath)) {
            console.error(`Local parts CSV not found at: ${csvPath}`);
            return [];
        }

        const fileContent = fs.readFileSync(csvPath, 'utf8');
        const records = parse(fileContent, {
            columns: true,
            skip_empty_lines: true,
            cast: (value, context) => {
                if (context.column === 'builderEligible') {
                    return value.toLowerCase() === 'true' || value === '1';
                }
                return value;
            }
        });

        cachedComponents = records;
        console.log(`Loaded ${records.length} components from local CSV: ${csvPath}`);
        
        return records.map((c: any) => normalizeComponent(c));
    } catch (error) {
        console.error('Error loading components from CSV:', error);
        return [];
    }
}

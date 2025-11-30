import React from 'react';
import { Scale } from 'lucide-react';

export default function WeightWeeniesPage() {
    return (
        <div className="min-h-screen bg-stone-950 flex items-center justify-center p-4">
            <div className="text-center">
                <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <Scale className="w-10 h-10 text-emerald-400" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">The Scale</h1>
                <p className="text-stone-400">Weight Weenies tools coming soon.</p>
            </div>
        </div>
    );
}

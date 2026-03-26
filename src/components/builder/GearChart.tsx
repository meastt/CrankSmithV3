'use client';

import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { getAllGearRatios, parseCassetteRange } from '@/lib/gearCalculations';

interface GearChartProps {
    chainrings: number[];
    cassetteCogs: number[];
}

export const GearChart: React.FC<GearChartProps> = ({ chainrings, cassetteCogs }) => {
    const gears = getAllGearRatios(chainrings, cassetteCogs);

    // Prepare data for chart
    const chartData = gears.map((gear, index) => ({
        name: `${gear.chainring}/${gear.cog}`,
        ratio: Number(gear.ratio.toFixed(2)),
        gearInches: Number(gear.gearInches.toFixed(1)),
    }));

    return (
        <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
            <h3 className="font-semibold text-stone-200 mb-4">Gear Ratio Chart</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        fontSize={10}
                        tick={{ fill: '#78716c' }}
                        axisLine={{ stroke: '#ffffff10' }}
                        tickLine={{ stroke: '#ffffff10' }}
                    />
                    <YAxis
                        label={{ value: 'Gear Ratio', angle: -90, position: 'insideLeft', fill: '#78716c', fontSize: 11 }}
                        tick={{ fill: '#78716c' }}
                        axisLine={{ stroke: '#ffffff10' }}
                        tickLine={{ stroke: '#ffffff10' }}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1c1917', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#e7e5e4' }}
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    />
                    <Legend wrapperStyle={{ color: '#78716c', fontSize: 12 }} />
                    <Bar dataKey="ratio" fill="#06b6d4" name="Gear Ratio" radius={[3, 3, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
            <p className="text-xs text-stone-600 mt-2 text-center">
                Lower ratios = easier climbing | Higher ratios = higher speed
            </p>
        </div>
    );
};

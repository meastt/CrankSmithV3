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
        <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold mb-4">Gear Ratio Chart</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        fontSize={10}
                    />
                    <YAxis label={{ value: 'Gear Ratio', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="ratio" fill="#3b82f6" name="Gear Ratio" />
                </BarChart>
            </ResponsiveContainer>
            <p className="text-xs text-gray-500 mt-2 text-center">
                Lower ratios = easier climbing | Higher ratios = higher speed
            </p>
        </div>
    );
};

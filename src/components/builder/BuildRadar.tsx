'use client';

import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

interface BuildRadarProps {
    data?: {
        subject: string;
        A: number;
        fullMark: number;
    }[];
}

// Default mock data if none provided
const defaultData = [
    { subject: 'Climbing', A: 80, fullMark: 100 },
    { subject: 'Speed', A: 65, fullMark: 100 },
    { subject: 'Weight', A: 90, fullMark: 100 },
    { subject: 'Range', A: 70, fullMark: 100 },
    { subject: 'Durability', A: 85, fullMark: 100 },
];

export const BuildRadar: React.FC<BuildRadarProps> = ({ data = defaultData }) => {
    return (
        <div className="w-full h-[300px] bg-white/5 rounded-xl p-4 border border-white/10">
            <h3 className="text-lg font-bold text-white mb-2 text-center">Build DNA</h3>
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                    <PolarGrid stroke="#ffffff20" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                        name="Build"
                        dataKey="A"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        fill="#3b82f6"
                        fillOpacity={0.3}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
};

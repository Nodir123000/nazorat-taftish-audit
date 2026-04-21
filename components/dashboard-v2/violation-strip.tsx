"use client"

import React from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

interface ViolationStripProps {
    title: string;
    value: string;
    subValue?: string;
    color: string; // e.g., 'blue', 'green', 'red', 'orange'
    data: { v: number }[];
}

const colors: Record<string, { start: string, end: string, text: string }> = {
    blue: { start: '#59adfa', end: '#0ea5e9', text: 'white' },
    green: { start: '#22c55e', end: '#16a34a', text: 'white' },
    red: { start: '#ef4444', end: '#dc2626', text: 'white' },
    orange: { start: '#f97316', end: '#ea580c', text: 'white' },
    purple: { start: '#a855f7', end: '#9333ea', text: 'white' },
    teal: { start: '#14b8a6', end: '#0d9488', text: 'white' },
};

export function ViolationStrip({ title, value, subValue, color, data }: ViolationStripProps) {
    const theme = colors[color] || colors.blue;

    return (
        <div
            className="w-full h-24 rounded-2xl overflow-hidden relative shadow-sm transition-transform hover:scale-[1.01] cursor-pointer"
            style={{
                background: `linear-gradient(135deg, ${theme.start} 0%, ${theme.end} 100%)`
            }}
        >
            <div className="absolute inset-0 p-4 flex flex-col justify-between z-10 text-white">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-sm font-medium opacity-90">{title}</h3>
                        <div className="text-2xl font-bold mt-1 tracking-tight">{value}</div>
                    </div>
                    {subValue && (
                        <span className="text-xs bg-white/20 px-2 py-0.5 rounded backdrop-blur-sm">
                            {subValue}
                        </span>
                    )}
                </div>
            </div>

            {/* Sparkline Background */}
            <div className="absolute bottom-0 left-0 right-0 h-16 opacity-30 z-0">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <Area
                            type="monotone"
                            dataKey="v"
                            stroke="rgba(255,255,255,0.8)"
                            strokeWidth={2}
                            fill="rgba(255,255,255,0.2)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Decorative Grid */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(white_1px,transparent_1px)] [background-size:10px_10px] pointer-events-none"></div>
        </div>
    );
}

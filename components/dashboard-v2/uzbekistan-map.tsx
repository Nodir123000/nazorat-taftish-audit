"use client"

import React from 'react';

export function UzbekistanMap() {
    // Simplified SVG Path for Uzbekistan (Abstract representation)
    // In a real production app, use a detailed GeoJSON/TopoJSON file with d3-geo or react-simple-maps
    const uzbekistanPath = "M 50 150 L 150 150 L 200 100 L 400 100 L 450 150 L 550 150 L 600 200 L 550 300 L 400 350 L 200 350 L 100 300 L 50 200 Z";

    // A slightly more "premium" looking abstract map can be achieved with dots or a cool gradient stroke

    return (
        <div className="w-full h-full min-h-[300px] flex items-center justify-center relative bg-blue-50/30 rounded-xl overflow-hidden group">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

            <div className="relative w-full h-full p-8 flex items-center justify-center">
                <svg viewBox="0 0 800 500" className="w-full h-full drop-shadow-xl filter">
                    <defs>
                        <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#60a5fa" />
                            <stop offset="100%" stopColor="#3b82f6" />
                        </linearGradient>
                    </defs>

                    {/* Outline */}
                    <path
                        d="M130,180 L200,160 L240,120 L300,125 L340,90 L400,100 L440,80 L500,90 L600,140 L650,200 L620,250 L580,260 L540,300 L480,310 L440,290 L400,320 L320,310 L280,340 L180,320 L120,280 L100,220 Z"
                        fill="url(#mapGradient)"
                        stroke="#fff"
                        strokeWidth="2"
                        className="transition-all duration-300 hover:brightness-110 cursor-pointer"
                    />

                    {/* Region Markers (Mock) */}
                    <circle cx="200" cy="200" r="4" fill="white" className="animate-pulse" />
                    <text x="210" y="205" fontSize="12" fill="white" fontWeight="bold">Нукус</text>

                    <circle cx="500" cy="180" r="6" fill="#fbbf24" stroke="white" strokeWidth="2" className="animate-bounce" />
                    <text x="515" y="185" fontSize="14" fill="#1e3a8a" fontWeight="bold">Ташкент</text>

                    <circle cx="350" cy="250" r="4" fill="white" />
                    <text x="360" y="255" fontSize="12" fill="white">Бухара</text>
                </svg>
            </div>

            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg shadow-sm border border-blue-100 text-xs font-medium text-blue-900">
                Карта покрытий: 14 Регионов
            </div>
        </div>
    );
}

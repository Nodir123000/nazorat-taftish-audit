"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react';

type FilterState = {
    category: string | null; // e.g., 'NDS', 'RST'
    district: string | null; // e.g., 'VVO', 'CVO'
    period: string; // 'Month', 'Year'
};

interface DashboardContextType {
    filters: FilterState;
    setFilter: (key: keyof FilterState, value: string | null) => void;
    resetFilters: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
    const [filters, setFilters] = useState<FilterState>({
        category: null,
        district: null,
        period: 'Year',
    });

    const setFilter = (key: keyof FilterState, value: string | null) => {
        setFilters(prev => ({ ...prev, [key]: prev[key] === value ? null : value }));
    };

    const resetFilters = () => {
        setFilters({ category: null, district: null, period: 'Year' });
    };

    return (
        <DashboardContext.Provider value={{ filters, setFilter, resetFilters }}>
            {children}
        </DashboardContext.Provider>
    );
}

export function useDashboard() {
    const context = useContext(DashboardContext);
    if (!context) {
        throw new Error('useDashboard must be used within a DashboardProvider');
    }
    return context;
}

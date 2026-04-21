export const POLITICAL_PALETTE = {
    blue: "#93C5FD",       // Soft Blue
    green: "#86EFAC",      // Soft Green
    purple: "#C4B5FD",     // Soft Purple
    orange: "#FDBA74",     // Soft Orange
    teal: "#5EEAD4",       // Soft Teal
    indigo: "#A5B4FC",     // Soft Indigo
    rose: "#FDA4AF",       // Soft Rose
    yellow: "#FDE047",     // Soft Yellow
    cyan: "#67E8F9",       // Soft Cyan
    emerald: "#6EE7B7",    // Soft Emerald
    violet: "#D8B4FE",     // Soft Violet
    amber: "#FCD34D",      // Soft Amber
    lime: "#BEF264",       // Soft Lime
    fuchsia: "#F0ABFC",    // Soft Fuchsia
}

export interface RegionStats {
    id: string;
    name: string;
    violations: number;
    audits: number;
    damage: number;
    x: number;
    y: number;
    color: string;
}

export const REGION_DATA: RegionStats[] = [
    { id: "UZTO", name: "Ташкентская область", violations: 38, audits: 142, damage: 2100000, x: 812, y: 360, color: POLITICAL_PALETTE.blue },
    { id: "UZSA", name: "Самаркандская область", violations: 35, audits: 128, damage: 1950000, x: 651, y: 467, color: POLITICAL_PALETTE.green },
    { id: "UZBU", name: "Бухарская область", violations: 28, audits: 98, damage: 1420000, x: 529, y: 468, color: POLITICAL_PALETTE.orange },
    { id: "UZNW", name: "Навоийская область", violations: 22, audits: 85, damage: 1150000, x: 615, y: 351, color: POLITICAL_PALETTE.purple },
    { id: "UZQA", name: "Кашкадарьинская область", violations: 31, audits: 115, damage: 1680000, x: 647, y: 480, color: POLITICAL_PALETTE.rose },
    { id: "UZSU", name: "Сурхандарьинская область", violations: 24, audits: 92, damage: 1280000, x: 664, y: 500, color: POLITICAL_PALETTE.cyan },
    { id: "UZJI", name: "Джизакская область", violations: 18, audits: 76, damage: 980000, x: 715, y: 442, color: POLITICAL_PALETTE.amber },
    { id: "UZSI", name: "Сырдарьинская область", violations: 16, audits: 68, damage: 850000, x: 738, y: 416, color: POLITICAL_PALETTE.teal },
    { id: "UZFA", name: "Ферганская область", violations: 29, audits: 108, damage: 1580000, x: 882, y: 433, color: POLITICAL_PALETTE.indigo },
    { id: "UZAN", name: "Андижанская область", violations: 26, audits: 95, damage: 1320000, x: 905, y: 397, color: POLITICAL_PALETTE.emerald },
    { id: "UZNG", name: "Наманганская область", violations: 25, audits: 89, damage: 1250000, x: 871, y: 377, color: POLITICAL_PALETTE.violet },
    { id: "UZXO", name: "Хорезмская область", violations: 20, audits: 72, damage: 1050000, x: 265, y: 299, color: POLITICAL_PALETTE.lime },
    { id: "UZQR", name: "Республика Каракалпакстан", violations: 19, audits: 65, damage: 920000, x: 365, y: 184, color: POLITICAL_PALETTE.yellow },
    { id: "UZTK", name: "г. Ташкент", violations: 42, audits: 156, damage: 2850000, x: 747, y: 346, color: POLITICAL_PALETTE.fuchsia },
]

export const getRegionStats = (id: string | null) => {
    if (!id) return null;
    return REGION_DATA.find(r => r.id === id);
}

export type MilitaryUnitStatus = 'active' | 'inactive' | 'reorganization';

export interface MilitaryUnit {
    id: string;
    unitNumber: string;
    name: string;
    type: string;
    militaryDistrict: string;
    region: string;
    city: string;
    address: string;
    coordinates?: {
        lat: number;
        lng: number;
    };
    commander: string;
    staffCount: number;
    auditsCount: number;
    kpiScore: number;
    lastAuditDate?: string;
    status: MilitaryUnitStatus;
}

export interface MilitaryUnitStats {
    totalUnits: number;
    activeUnits: number;
    districtsCount: number;
    filteredCount: number;
}

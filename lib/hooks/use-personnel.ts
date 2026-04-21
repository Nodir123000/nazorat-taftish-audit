import { useQuery } from "@tanstack/react-query";
import { personnelService } from "@/lib/services/personnel-service";
import { PaginationParams } from "@/lib/types/api";

export const PERSONNEL_KEYS = {
    all: ['personnel'] as const,
    lists: () => [...PERSONNEL_KEYS.all, 'list'] as const,
    list: (params: PaginationParams) => [...PERSONNEL_KEYS.lists(), params] as const,
    details: () => [...PERSONNEL_KEYS.all, 'detail'] as const,
    detail: (id: string) => [...PERSONNEL_KEYS.details(), id] as const,
};

export function usePersonnelList(params: PaginationParams) {
    return useQuery({
        queryKey: PERSONNEL_KEYS.list(params),
        queryFn: () => personnelService.getEmployees(params),
        placeholderData: (previousData) => previousData,
    });
}

export function usePersonnel(id: string) {
    return useQuery({
        queryKey: PERSONNEL_KEYS.detail(id),
        queryFn: () => personnelService.getEmployee(id),
        enabled: !!id,
    });
}

export const usePersonnelById = usePersonnel;

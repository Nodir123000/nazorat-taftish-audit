import { useQuery } from "@tanstack/react-query";
import { auditsService } from "@/lib/services/audits-service";

export function useViolationReferences() {
    return useQuery({
        queryKey: ['references', 'violations'],
        queryFn: () => auditsService.getViolationReferences(),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

export function useAllReferences() {
    return useQuery({
        queryKey: ['references', 'all'],
        queryFn: () => auditsService.getAllReferences(),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

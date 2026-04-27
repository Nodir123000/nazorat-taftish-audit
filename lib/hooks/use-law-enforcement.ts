import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { auditsService } from "@/lib/services/audits-service";
import { LawEnforcementCaseDTO } from "@/lib/types/audits.dto";

export const LAW_ENFORCEMENT_KEYS = {
    all: ['audits', 'law-enforcement'] as const,
    list: () => [...LAW_ENFORCEMENT_KEYS.all, 'list'] as const,
};

export function useLawEnforcementCases() {
    return useQuery({
        queryKey: LAW_ENFORCEMENT_KEYS.list(),
        queryFn: () => auditsService.getLawEnforcementCases(),
    });
}

export function useCreateLawEnforcementCase() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Partial<LawEnforcementCaseDTO>) =>
            auditsService.createLawEnforcementCase(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: LAW_ENFORCEMENT_KEYS.all });
        },
    });
}

export function useUpdateLawEnforcementCase() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string | number; data: Partial<LawEnforcementCaseDTO> }) =>
            auditsService.updateLawEnforcementCase(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: LAW_ENFORCEMENT_KEYS.all });
        },
    });
}

export function useDeleteLawEnforcementCase() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string | number) => auditsService.deleteLawEnforcementCase(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: LAW_ENFORCEMENT_KEYS.all });
        },
    });
}

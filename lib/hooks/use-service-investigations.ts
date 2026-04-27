import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { auditsService } from "@/lib/services/audits-service";
import { ServiceInvestigationDTO } from "@/lib/types/audits.dto";

export const INVESTIGATION_KEYS = {
    all: ['audits', 'investigations'] as const,
    list: () => [...INVESTIGATION_KEYS.all, 'list'] as const,
};

export function useServiceInvestigations() {
    return useQuery({
        queryKey: INVESTIGATION_KEYS.list(),
        queryFn: () => auditsService.getServiceInvestigations(),
    });
}

export function useCreateServiceInvestigation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Partial<ServiceInvestigationDTO>) =>
            auditsService.createServiceInvestigation(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: INVESTIGATION_KEYS.all });
        },
    });
}

export function useUpdateServiceInvestigation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string | number; data: Partial<ServiceInvestigationDTO> }) =>
            auditsService.updateServiceInvestigation(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: INVESTIGATION_KEYS.all });
        },
    });
}

export function useDeleteServiceInvestigation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string | number) => auditsService.deleteServiceInvestigation(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: INVESTIGATION_KEYS.all });
        },
    });
}

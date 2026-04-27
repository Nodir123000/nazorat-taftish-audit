import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { auditsService } from "@/lib/services/audits-service";
import { AuditViolationDTO } from "@/lib/types/audits.dto";

export const VIOLATION_KEYS = {
    all: ['audits', 'violations'] as const,
    list: (params?: { inspectorId?: number }) => [...VIOLATION_KEYS.all, 'list', params] as const,
    repayments: (violationId: number) => [...VIOLATION_KEYS.all, 'repayments', violationId] as const,
};

export function useAuditViolations(params?: { inspectorId?: number }) {
    return useQuery({
        queryKey: VIOLATION_KEYS.list(params),
        queryFn: () => auditsService.getViolations(params),
    });
}

export function useCreateAuditViolation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Partial<AuditViolationDTO>) => auditsService.createViolation(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: VIOLATION_KEYS.all });
        },
    });
}

export function useUpdateAuditViolation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<AuditViolationDTO> }) =>
            auditsService.updateViolation(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: VIOLATION_KEYS.all });
        },
    });
}

export function useDeleteAuditViolation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => auditsService.deleteViolation(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: VIOLATION_KEYS.all });
        },
    });
}

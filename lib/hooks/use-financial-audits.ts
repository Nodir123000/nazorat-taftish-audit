import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { auditsService } from "@/lib/services/audits-service";
import { FinancialAuditDTO, CreateFinancialAuditDTO } from "@/lib/types/audits.dto";

export const AUDIT_KEYS = {
    financialAudits: (params?: { inspectorId?: string | number; unitName?: string }) =>
        ['audits', 'financial', params] as const,
    financialAuditDetail: (id: number) => ['audits', 'financial', 'detail', id] as const,
};

export function useFinancialAudits(params?: { inspectorId?: string | number; unitName?: string }) {
    return useQuery({
        queryKey: AUDIT_KEYS.financialAudits(params),
        queryFn: () => auditsService.getFinancialAudits(params),
        select: (data) => data?.items ?? [],
    });
}

export function useFinancialAudit(id: number) {
    return useQuery({
        queryKey: AUDIT_KEYS.financialAuditDetail(id),
        queryFn: () => auditsService.getFinancialAudit(id),
        enabled: !!id,
    });
}

export function useCreateFinancialAudit() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateFinancialAuditDTO) => auditsService.createFinancialAudit(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['audits', 'financial'] });
        },
    });
}

export function useUpdateFinancialAudit() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<CreateFinancialAuditDTO> }) =>
            auditsService.updateFinancialAudit(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: AUDIT_KEYS.financialAuditDetail(variables.id) });
            queryClient.invalidateQueries({ queryKey: ['audits', 'financial'] });
        },
    });
}

export function useDeleteFinancialAudit() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => auditsService.deleteFinancialAudit(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['audits', 'financial'] });
        },
    });
}

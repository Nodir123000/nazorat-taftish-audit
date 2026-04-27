import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { auditsService } from "@/lib/services/audits-service";
import { RepaymentDTO, CreateRepaymentDTO } from "@/lib/types/audits.dto";

export const REPAYMENT_KEYS = {
    forViolation: (violationId: number) => ['audits', 'violations', violationId, 'repayments'] as const,
};

export function useRepayments(violationId: number | null) {
    return useQuery<RepaymentDTO[]>({
        queryKey: REPAYMENT_KEYS.forViolation(violationId ?? 0),
        queryFn: () => auditsService.getRepayments(violationId!),
        enabled: !!violationId,
    });
}

export function useCreateRepayment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateRepaymentDTO) => auditsService.createRepayment(data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: REPAYMENT_KEYS.forViolation(variables.violation_id),
            });
            queryClient.invalidateQueries({ queryKey: ['audits', 'financial'] });
        },
    });
}


import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { planningService } from "@/lib/services/planning-service";
import { PaginationParams } from "@/lib/types/api";
import {
    CreateAnnualPlanDTO,
    CreateOrderDTO,
    CommissionMemberDTO,
    PrescriptionDTO,
    BriefingTopicDTO,
    UnplannedAuditDTO
} from "@/lib/types/planning.dto";

export const PLANNING_KEYS = {
    all: ['planning'] as const,
    annual: () => [...PLANNING_KEYS.all, 'annual'] as const,
    annualLists: () => [...PLANNING_KEYS.annual(), 'list'] as const,
    annualList: (params: Record<string, any>) => [...PLANNING_KEYS.annualLists(), params] as const,
    annualDetail: (id: string | number) => [...PLANNING_KEYS.annual(), 'detail', id.toString()] as const,
    orders: () => [...PLANNING_KEYS.all, 'orders'] as const,
    ordersLists: () => [...PLANNING_KEYS.orders(), 'list'] as const,
    ordersList: (params: Record<string, any>) => [...PLANNING_KEYS.ordersLists(), params] as const,
    orderDetail: (id: string) => [...PLANNING_KEYS.orders(), 'detail', id] as const,
    commission: () => [...PLANNING_KEYS.orders(), 'commission'] as const,
    commissionList: (params: Record<string, any>) => [...PLANNING_KEYS.commission(), 'list', params] as const,
    prescriptions: () => [...PLANNING_KEYS.orders(), 'prescriptions'] as const,
    prescriptionsList: (params: Record<string, any>) => [...PLANNING_KEYS.prescriptions(), 'list', params] as const,
    briefings: () => [...PLANNING_KEYS.orders(), 'briefings'] as const,
    briefingList: (params: Record<string, any>) => [...PLANNING_KEYS.briefings(), 'list', params] as const,
    unplanned: () => [...PLANNING_KEYS.all, 'unplanned'] as const,
    unplannedLists: () => [...PLANNING_KEYS.unplanned(), 'list'] as const,
    unplannedList: (params: Record<string, any>) => [...PLANNING_KEYS.unplannedLists(), params] as const,
    unplannedStats: () => [...PLANNING_KEYS.unplanned(), 'stats'] as const,
};

export function useAnnualPlans(params: PaginationParams & { year?: number, status?: string }) {
    return useQuery({
        queryKey: PLANNING_KEYS.annualList(params),
        queryFn: () => planningService.getAnnualPlans(params as any),
        placeholderData: (previousData) => previousData,
    });
}

export function useAnnualPlan(id: string | number) {
    return useQuery({
        queryKey: PLANNING_KEYS.annualDetail(id),
        queryFn: () => planningService.getAnnualPlan(id.toString()),
        enabled: !!id,
    });
}

export function useCreateAnnualPlan() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateAnnualPlanDTO) => planningService.createAnnualPlan(data as any),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PLANNING_KEYS.annualLists() });
        },
    });
}

export function useUpdateAnnualPlan() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string | number; data: Partial<CreateAnnualPlanDTO> }) => planningService.updateAnnualPlan(id.toString(), data as any),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: PLANNING_KEYS.annualDetail(variables.id) });
            queryClient.invalidateQueries({ queryKey: PLANNING_KEYS.annualLists() });
        },
    });
}

export function useDeleteAnnualPlan() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string | number) => planningService.deleteAnnualPlan(id.toString()),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PLANNING_KEYS.annualLists() });
        },
    });
}

export function useOrders(params: PaginationParams & { status?: string, dateFrom?: string, search?: string }) {
    return useQuery({
        queryKey: PLANNING_KEYS.ordersList(params),
        queryFn: () => planningService.getOrders(params),
        placeholderData: (previousData) => previousData,
    });
}

export function useOrder(id: string) {
    return useQuery({
        queryKey: PLANNING_KEYS.orderDetail(id),
        queryFn: () => planningService.getOrder(id),
        enabled: !!id,
    });
}

export function useCreateOrder() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateOrderDTO) => planningService.createOrder(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PLANNING_KEYS.ordersLists() });
        },
    });
}

export function useUpdateOrder() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<CreateOrderDTO> }) => planningService.updateOrder(id, data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: PLANNING_KEYS.orderDetail(variables.id) });
            queryClient.invalidateQueries({ queryKey: PLANNING_KEYS.ordersLists() });
        },
    });
}

export function useDeleteOrder() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => planningService.deleteOrder(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PLANNING_KEYS.ordersLists() });
        },
    });
}

// --- Commission Hooks ---

export function useCommissionMembers(params?: { orderId?: string | number, search?: string }) {
    return useQuery({
        queryKey: PLANNING_KEYS.commissionList(params || {}),
        queryFn: () => planningService.getCommissionMembers(params),
    });
}

export function useAddCommissionMember() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Partial<CommissionMemberDTO>) => planningService.addCommissionMember(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PLANNING_KEYS.commission() });
        },
    });
}

export function useUpdateCommissionMember() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string | number, data: Partial<CommissionMemberDTO> }) => planningService.updateCommissionMember(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PLANNING_KEYS.commission() });
        },
    });
}

export function useDeleteCommissionMember() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string | number) => planningService.deleteCommissionMember(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PLANNING_KEYS.commission() });
        },
    });
}

// --- Prescription Hooks ---

export function usePrescriptions(params?: { search?: string, status?: string }) {
    return useQuery({
        queryKey: PLANNING_KEYS.prescriptionsList(params || {}),
        queryFn: () => planningService.getPrescriptions(params),
    });
}

export function useUpdatePrescription() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string | number, data: Partial<PrescriptionDTO> }) => planningService.updatePrescription(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PLANNING_KEYS.prescriptions() });
        },
    });
}

export function useDeletePrescription() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string | number) => planningService.deletePrescription(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PLANNING_KEYS.prescriptions() });
        },
    });
}

// --- Briefing Hooks ---

export function useBriefingTopics(params?: { search?: string }) {
    return useQuery({
        queryKey: PLANNING_KEYS.briefingList(params || {}),
        queryFn: () => planningService.getBriefingTopics(params),
    });
}

export function useAddBriefingTopic() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Partial<BriefingTopicDTO>) => planningService.createBriefingTopic(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PLANNING_KEYS.briefingList({}) });
        },
    });
}

export function useUpdateBriefingTopic() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string | number, data: Partial<BriefingTopicDTO> }) => planningService.updateBriefingTopic(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PLANNING_KEYS.briefingList({}) });
        },
    });
}

export function useDeleteBriefingTopic() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string | number) => planningService.deleteBriefingTopic(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PLANNING_KEYS.briefingList({}) });
        },
    });
}

// --- Unplanned Audits ---

export function useUnplannedAudits(params?: { status?: string; search?: string }) {
    return useQuery({
        queryKey: PLANNING_KEYS.unplannedList(params || {}),
        queryFn: () => planningService.getUnplannedAudits(params),
    });
}

export function useUnplannedAuditsStats() {
    return useQuery({
        queryKey: PLANNING_KEYS.unplannedStats(),
        queryFn: () => planningService.getUnplannedAuditsStats(),
    });
}

export function useCreateUnplannedAudit() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Partial<UnplannedAuditDTO>) => planningService.createUnplannedAudit(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PLANNING_KEYS.unplanned() });
        },
    });
}

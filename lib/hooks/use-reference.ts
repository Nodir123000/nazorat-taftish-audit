import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api/http-client"
import { DocumentTypeDTO, CreateDocumentTypeDTO, MilitaryUnitDTO, CreateMilitaryUnitDTO } from "@/lib/types/reference.dto"

export function useDocumentTypes(params?: any) {
    return useQuery({
        queryKey: ["document-types", params],
        queryFn: () => api.reference.documentTypes.list(params).then((res: any) => res.data || res),
    })
}

export function useCreateDocumentType() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: CreateDocumentTypeDTO) => api.reference.documentTypes.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["document-types"] })
        },
    })
}

export function useUpdateDocumentType() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<CreateDocumentTypeDTO> }) =>
            api.reference.documentTypes.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["document-types"] })
        },
    })
}

export function useDeleteDocumentType() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => api.reference.documentTypes.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["document-types"] })
        },
    })
}

export function useUnits(params?: any) {
    return useQuery({
        queryKey: ["units", params],
        queryFn: () => api.reference.units.list(params).then((res: any) => res.data || res),
    })
}

export function useCreateUnit() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: CreateMilitaryUnitDTO) => api.reference.units.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["units"] })
        },
    })
}

export function useUpdateUnit() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<CreateMilitaryUnitDTO> }) =>
            api.reference.units.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["units"] })
        },
    })
}

export function useDeleteUnit() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => api.reference.units.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["units"] })
        },
    })
}

export function useRegions(params?: any) {
    return useQuery({
        queryKey: ["regions", params],
        queryFn: () => api.reference.regions.list(params).then((res: any) => res.data || res || { items: [], total: 0 }),
    })
}

export function useCreateRegion() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: any) => api.reference.regions.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["regions"] })
        },
    })
}

export function useUpdateRegion() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) =>
            api.reference.regions.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["regions"] })
        },
    })
}

export function useDeleteRegion() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => api.reference.regions.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["regions"] })
        },
    })
}

export function useAdministrativeDistricts(params?: any) {
    return useQuery({
        queryKey: ["administrative-districts", params],
        queryFn: () => api.reference.districts.list(params).then((res: any) => res.data || res || { items: [], total: 0 }),
    })
}

export function useCreateAdministrativeDistrict() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: any) => api.reference.districts.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["administrative-districts"] })
        },
    })
}

export function useUpdateAdministrativeDistrict() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) =>
            api.reference.districts.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["administrative-districts"] })
        },
    })
}

export function useDeleteAdministrativeDistrict() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => api.reference.districts.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["administrative-districts"] })
        },
    })
}

// --- Military Districts Hooks ---

export function useDistricts(params?: any) {
    return useQuery({
        queryKey: ["military-districts", params],
        queryFn: () => api.reference.militaryDistricts.list(params).then((res: any) => res.data || res || { items: [], total: 0 }),
    })
}

export function useCreateDistrict() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: any) => api.reference.militaryDistricts.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["military-districts"] })
        },
    })
}

export function useUpdateDistrict() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) =>
            api.reference.militaryDistricts.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["military-districts"] })
        },
    })
}

export function useDeleteDistrict() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => api.reference.militaryDistricts.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["military-districts"] })
        },
    })
}

// --- Positions Hooks ---

export function usePositions(params?: any) {
    return useQuery({
        queryKey: ["positions", params],
        queryFn: () => api.reference.positions.list(params).then((res: any) => res.data || res),
    })
}

export function useCreatePosition() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: any) => api.reference.positions.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["positions"] })
        },
    })
}

export function useUpdatePosition() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) =>
            api.reference.positions.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["positions"] })
        },
    })
}

export function useDeletePosition() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => api.reference.positions.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["positions"] })
        },
    })
}

// --- VUS Hooks ---

export function useVus(params?: any) {
    return useQuery({
        queryKey: ["vus", params],
        queryFn: () => api.reference.vus.list(params).then((res: any) => res.data || res),
    })
}

export function useCreateVus() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: any) => api.reference.vus.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["vus"] })
        },
    })
}

export function useUpdateVus() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) =>
            api.reference.vus.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["vus"] })
        },
    })
}

export function useDeleteVus() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => api.reference.vus.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["vus"] })
        },
    })
}

// --- Supply Departments Hooks ---

export function useSupplyDepartments(params?: any) {
    return useQuery({
        queryKey: ["supply-departments", params],
        queryFn: () => api.reference.supplyDepartments.list(params).then((res: any) => res.data || res),
    })
}

export function useCreateSupplyDepartment() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: any) => api.reference.supplyDepartments.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["supply-departments"] })
        },
    })
}

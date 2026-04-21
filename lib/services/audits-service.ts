import { httpClient as axiosInstance } from "@/lib/api/http-client";
import {
    AuditResultDTO,
    AuditSummaryStatsDTO,
    CreateAuditResultDTO,
    CashCheckDTO,
    ServiceCheckDTO,
    StorageNormDTO,
    LawEnforcementCaseDTO,
    ServiceInvestigationDTO,
    ActiveAuditDTO,
    AuditReportDTO,
    PreparationChecklistItemDTO,
    SourceDocumentDTO,
    AuditDocumentDTO,
    AuditEvidenceDTO,
    AuditViolationDTO,
    FinancialAuditDTO,
    CreateFinancialAuditDTO,
    RepaymentDTO,
    CreateRepaymentDTO,
} from "@/lib/types/audits.dto";
import { PaginatedResponse, PaginationParams } from "@/lib/types/api";

const httpClient = {
    get: <T>(url: string, config?: any) => axiosInstance.get<T>(url, config) as unknown as Promise<T>,
    post: <T>(url: string, data?: any, config?: any) => axiosInstance.post<T>(url, data, config) as unknown as Promise<T>,
    put: <T>(url: string, data?: any, config?: any) => axiosInstance.put<T>(url, data, config) as unknown as Promise<T>,
    patch: <T>(url: string, data?: any, config?: any) => axiosInstance.patch<T>(url, data, config) as unknown as Promise<T>,
    delete: <T>(url: string, config?: any) => axiosInstance.delete<T>(url, config) as unknown as Promise<T>,
};

const BASE_ENDPOINT = '/audits';

export const auditsService = {
    async getResults(params?: PaginationParams & { status?: string, search?: string }): Promise<PaginatedResponse<AuditResultDTO>> {
        return httpClient.get<PaginatedResponse<AuditResultDTO>>(`${BASE_ENDPOINT}/results`, { params });
    },

    async getResult(id: number): Promise<AuditResultDTO> {
        return httpClient.get<AuditResultDTO>(`${BASE_ENDPOINT}/results/${id}`);
    },

    async createResult(data: CreateAuditResultDTO): Promise<AuditResultDTO> {
        return httpClient.post<AuditResultDTO>(`${BASE_ENDPOINT}/results`, data);
    },

    async updateResult(id: number, data: Partial<CreateAuditResultDTO>): Promise<AuditResultDTO> {
        return httpClient.put<AuditResultDTO>(`${BASE_ENDPOINT}/results/${id}`, data);
    },

    async deleteResult(id: number): Promise<void> {
        return httpClient.delete<void>(`${BASE_ENDPOINT}/results/${id}`);
    },

    async getSummaryStats(): Promise<AuditSummaryStatsDTO> {
        return httpClient.get<AuditSummaryStatsDTO>(`${BASE_ENDPOINT}/stats/summary`);
    },

    async getCashChecks(): Promise<CashCheckDTO[]> {
        return httpClient.get<CashCheckDTO[]>(`${BASE_ENDPOINT}/financial/cash-checks`);
    },

    async getServiceChecks(): Promise<ServiceCheckDTO[]> {
        return httpClient.get<ServiceCheckDTO[]>(`${BASE_ENDPOINT}/financial/service-checks`);
    },

    async getStorageNorms(): Promise<StorageNormDTO[]> {
        return httpClient.get<StorageNormDTO[]>(`${BASE_ENDPOINT}/financial/storage-norms`);
    },

    async getLawEnforcementCases(): Promise<LawEnforcementCaseDTO[]> {
        return httpClient.get<LawEnforcementCaseDTO[]>(`${BASE_ENDPOINT}/law-enforcement/cases`);
    },

    async createLawEnforcementCase(data: Partial<LawEnforcementCaseDTO>): Promise<LawEnforcementCaseDTO> {
        return httpClient.post<LawEnforcementCaseDTO>(`${BASE_ENDPOINT}/law-enforcement/cases`, data);
    },

    async updateLawEnforcementCase(id: string | number, data: Partial<LawEnforcementCaseDTO>): Promise<LawEnforcementCaseDTO> {
        return httpClient.put<LawEnforcementCaseDTO>(`${BASE_ENDPOINT}/law-enforcement/cases/${id}`, data);
    },

    async deleteLawEnforcementCase(id: string | number): Promise<void> {
        return httpClient.delete<void>(`${BASE_ENDPOINT}/law-enforcement/cases/${id}`);
    },

    async getServiceInvestigations(): Promise<ServiceInvestigationDTO[]> {
        return httpClient.get<ServiceInvestigationDTO[]>(`${BASE_ENDPOINT}/service-investigations`);
    },

    async createServiceInvestigation(data: Partial<ServiceInvestigationDTO>): Promise<ServiceInvestigationDTO> {
        return httpClient.post<ServiceInvestigationDTO>(`${BASE_ENDPOINT}/service-investigations`, data);
    },

    async updateServiceInvestigation(id: string | number, data: Partial<ServiceInvestigationDTO>): Promise<ServiceInvestigationDTO> {
        return httpClient.put<ServiceInvestigationDTO>(`${BASE_ENDPOINT}/service-investigations/${id}`, data);
    },

    async deleteServiceInvestigation(id: string | number): Promise<void> {
        return httpClient.delete<void>(`${BASE_ENDPOINT}/service-investigations/${id}`);
    },

    async getActiveAudits(): Promise<ActiveAuditDTO[]> {
        return httpClient.get<ActiveAuditDTO[]>(`${BASE_ENDPOINT}/active`);
    },

    async getReports(): Promise<AuditReportDTO[]> {
        return httpClient.get<AuditReportDTO[]>(`${BASE_ENDPOINT}/reports`);
    },

    async getPreparationChecklist(auditId: string): Promise<PreparationChecklistItemDTO[]> {
        return httpClient.get<PreparationChecklistItemDTO[]>(`${BASE_ENDPOINT}/preparation/checklist/${auditId}`);
    },

    async getSourceDocuments(auditId: string): Promise<SourceDocumentDTO[]> {
        return httpClient.get<SourceDocumentDTO[]>(`${BASE_ENDPOINT}/preparation/source-documents/${auditId}`);
    },

    async getDocuments(auditId: string): Promise<AuditDocumentDTO[]> {
        return httpClient.get<AuditDocumentDTO[]>(`${BASE_ENDPOINT}/documents/${auditId}`);
    },

    async getEvidence(auditId: string): Promise<AuditEvidenceDTO[]> {
        return httpClient.get<AuditEvidenceDTO[]>(`${BASE_ENDPOINT}/evidence/${auditId}`);
    },

    async getViolations(params?: { inspectorId?: number }): Promise<AuditViolationDTO[]> {
        return httpClient.get<AuditViolationDTO[]>(`${BASE_ENDPOINT}/financial-audits/violations`, { params });
    },

    async createViolation(data: Partial<AuditViolationDTO>): Promise<AuditViolationDTO> {
        return httpClient.post<AuditViolationDTO>(`${BASE_ENDPOINT}/financial-audits/violations`, data);
    },

    async updateViolation(id: number, data: Partial<AuditViolationDTO>): Promise<AuditViolationDTO> {
        return httpClient.put<AuditViolationDTO>(`${BASE_ENDPOINT}/financial-audits/violations/${id}`, data);
    },

    async deleteViolation(id: number): Promise<void> {
        return httpClient.delete<void>(`${BASE_ENDPOINT}/financial-audits/violations/${id}`);
    },

    // --- Financial Audits (Cash Audits) ---

    async getFinancialAudits(params?: { inspectorId?: string | number; unitName?: string }): Promise<FinancialAuditDTO[]> {
        return httpClient.get<FinancialAuditDTO[]>(`${BASE_ENDPOINT}/financial-audits`, { params });
    },

    async getFinancialAudit(id: number): Promise<FinancialAuditDTO> {
        return httpClient.get<FinancialAuditDTO>(`${BASE_ENDPOINT}/financial-audits/${id}`);
    },

    async createFinancialAudit(data: CreateFinancialAuditDTO): Promise<FinancialAuditDTO> {
        return httpClient.post<FinancialAuditDTO>(`${BASE_ENDPOINT}/financial-audits`, data);
    },

    async updateFinancialAudit(id: number, data: Partial<CreateFinancialAuditDTO>): Promise<FinancialAuditDTO> {
        return httpClient.put<FinancialAuditDTO>(`${BASE_ENDPOINT}/financial-audits/${id}`, data);
    },

    async deleteFinancialAudit(id: number): Promise<void> {
        return httpClient.delete<void>(`${BASE_ENDPOINT}/financial-audits/${id}`);
    },

    // --- Financial Violations ---

    async createFinancialViolation(data: Partial<AuditViolationDTO>): Promise<AuditViolationDTO> {
        return httpClient.post<AuditViolationDTO>(`${BASE_ENDPOINT}/financial-audits/violations`, data);
    },

    async updateFinancialViolation(id: number, data: Partial<AuditViolationDTO>): Promise<AuditViolationDTO> {
        return httpClient.put<AuditViolationDTO>(`${BASE_ENDPOINT}/financial-audits/violations/${id}`, data);
    },

    async deleteFinancialViolation(id: number): Promise<void> {
        return httpClient.delete<void>(`${BASE_ENDPOINT}/financial-audits/violations/${id}`);
    },

    // --- Repayment History ---

    async getRepayments(violationId: number): Promise<RepaymentDTO[]> {
        return httpClient.get<RepaymentDTO[]>(`${BASE_ENDPOINT}/financial-audits/repayments`, {
            params: { violationId },
        });
    },

    async createRepayment(data: CreateRepaymentDTO): Promise<RepaymentDTO> {
        return httpClient.post<RepaymentDTO>(`${BASE_ENDPOINT}/financial-audits/repayments`, data);
    },
};

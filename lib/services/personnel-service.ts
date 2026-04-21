import { httpClient } from "@/lib/api/http-client";
import { EmployeeDTO } from "@/lib/types/personnel.dto";
import { PaginatedResponse, PaginationParams } from "@/lib/types/api";

const ENDPOINT = '/personnel';

export const personnelService = {
    async getEmployees(params?: PaginationParams): Promise<PaginatedResponse<EmployeeDTO>> {
        const response = await httpClient.get<PaginatedResponse<EmployeeDTO>>(ENDPOINT, {
            params: {
                ...params,
                limit: params?.limit || 100,
                page: params?.page || 1,
            }
        });

        return response;
    },

    async getEmployee(id: string): Promise<EmployeeDTO> {
        return httpClient.get<EmployeeDTO>(`${ENDPOINT}/${id}`);
    },

    async createEmployee(data: Partial<EmployeeDTO>): Promise<EmployeeDTO> {
        return httpClient.post<EmployeeDTO>(ENDPOINT, data);
    },

    async updateEmployee(id: string, data: Partial<EmployeeDTO>): Promise<EmployeeDTO> {
        return httpClient.put<EmployeeDTO>(`${ENDPOINT}/${id}`, data);
    }
};

import { ApiError } from "@/lib/types/api";
import { Api, HttpClient as SdkHttpClient } from "./generated-sdk";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

interface RequestConfig extends RequestInit {
    params?: Record<string, string | number | boolean | undefined>;
}

class HttpClient {
    async request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
        const { params, headers, ...customConfig } = config;

        const url = new URL(endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`, typeof window !== 'undefined' ? window.location.origin : undefined);
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    url.searchParams.append(key, String(value));
                }
            });
        }

        const defaultHeaders: HeadersInit = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };

        try {
            const response = await fetch(url.toString(), {
                headers: { ...defaultHeaders, ...headers },
                ...customConfig,
            });

            const data = await response.json();

            if (!response.ok) {
                throw {
                    code: data.error?.code || `HTTP_${response.status}`,
                    message: data.error?.message || response.statusText,
                    details: data.error?.details,
                } as ApiError;
            }

            if (data && typeof data === 'object' && 'success' in data && 'data' in data) {
                return data.data as T;
            }

            return data as T;

        } catch (error: any) {
            const errorMsg = error?.message || error?.error || "Unknown Error";
            console.error(`API Request Failed: ${endpoint}`, {
                message: errorMsg,
                status: error?.status || "N/A",
                original: error
            });
            throw error;
        }
    }

    get<T>(endpoint: string, config?: RequestConfig) {
        return this.request<T>(endpoint, { ...config, method: 'GET' });
    }

    post<T>(endpoint: string, body: any, config?: RequestConfig) {
        return this.request<T>(endpoint, { ...config, method: 'POST', body: JSON.stringify(body) });
    }

    put<T>(endpoint: string, body: any, config?: RequestConfig) {
        return this.request<T>(endpoint, { ...config, method: 'PUT', body: JSON.stringify(body) });
    }

    patch<T>(endpoint: string, body: any, config?: RequestConfig) {
        return this.request<T>(endpoint, { ...config, method: 'PATCH', body: JSON.stringify(body) });
    }

    delete<T>(endpoint: string, config?: RequestConfig) {
        return this.request<T>(endpoint, { ...config, method: 'DELETE' });
    }
}

export const httpClient = new HttpClient();

// Initialize and export the Api instance expected by some hooks
const sdkHttpClient = new SdkHttpClient();
export const api = new Api(sdkHttpClient);

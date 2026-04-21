export interface ApiResponse<T> {
    success: boolean;
    data: T;
    meta?: {
        requestId: string;
        timestamp: string;
    };
    error?: ApiError;
}

export interface PaginatedResponse<T> {
    items: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}

export interface ApiError {
    code: string;
    message: string;
    details?: Record<string, any>;
}

export interface PaginationParams {
    page?: number;
    limit?: number;
    search?: string;
    sort?: string;
    order?: 'asc' | 'desc';
    [key: string]: any;
}

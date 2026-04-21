import { httpClient } from "@/lib/api/http-client";
import { NotificationsResponse } from "@/lib/types/notifications";

const BASE_ENDPOINT = '/notifications';

export const notificationClientService = {
    /**
     * Get user's notifications
     */
    async getNotifications(): Promise<NotificationsResponse> {
        return httpClient.get<NotificationsResponse>(BASE_ENDPOINT);
    },

    /**
     * Mark a single notification as read
     */
    async markAsRead(id: number): Promise<{ success: boolean }> {
        return httpClient.patch<{ success: boolean }>(`${BASE_ENDPOINT}/${id}`, { is_read: true });
    },

    /**
     * Mark all notifications as read
     */
    async markAllAsRead(): Promise<{ success: boolean }> {
        return httpClient.post<{ success: boolean }>(BASE_ENDPOINT, { action: "READ_ALL" });
    },

    /**
     * Delete a notification
     */
    async deleteNotification(id: number): Promise<{ success: boolean }> {
        return httpClient.delete<{ success: boolean }>(`${BASE_ENDPOINT}/${id}`);
    }
};

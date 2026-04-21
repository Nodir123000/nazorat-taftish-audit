export type NotificationType = "info" | "warning" | "error" | "success";
export type NotificationCategory = "audit" | "deadline" | "system";

export interface NotificationDTO {
    id: number;
    user_id: number;
    title: string;
    message: string;
    type: NotificationType;
    category: NotificationCategory | null;
    link: string | null;
    is_read: boolean;
    created_at: string;
}

export interface NotificationsResponse {
    notifications: NotificationDTO[];
    unreadCount: number;
}

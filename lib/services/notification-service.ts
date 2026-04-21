import { prisma } from "@/lib/db/prisma";

export type NotificationType = "info" | "warning" | "error" | "success";
export type NotificationCategory = "audit" | "deadline" | "system";

export interface CreateNotificationDTO {
    userId: number;
    title: string;
    message: string;
    type?: NotificationType;
    category?: NotificationCategory;
    link?: string;
}

/**
 * Backend service for handling notifications
 */
export const notificationService = {
    /**
     * Create a new notification for a specific user
     */
    async create(data: CreateNotificationDTO) {
        return prisma.notifications.create({
            data: {
                user_id: data.userId,
                title: data.title,
                message: data.message,
                type: data.type || "info",
                category: data.category || "system",
                link: data.link,
            },
        });
    },

    /**
     * Get all notifications for a user, sorted by date (newest first)
     */
    async getByUser(userId: number, limit = 50) {
        return prisma.notifications.findMany({
            where: {
                user_id: userId,
            },
            orderBy: {
                created_at: "desc",
            },
            take: limit,
        });
    },

    /**
     * Get unread notifications count for a user
     */
    async getUnreadCount(userId: number) {
        return prisma.notifications.count({
            where: {
                user_id: userId,
                is_read: false,
            },
        });
    },

    /**
     * Mark a specific notification as read
     */
    async markAsRead(id: number, userId: number) {
        return prisma.notifications.update({
            where: {
                id,
                user_id: userId, // Ensure user can only mark their own
            },
            data: {
                is_read: true,
            },
        });
    },

    /**
     * Mark all user's notifications as read
     */
    async markAllAsRead(userId: number) {
        return prisma.notifications.updateMany({
            where: {
                user_id: userId,
                is_read: false,
            },
            data: {
                is_read: true,
            },
        });
    },

    /**
     * Delete a notification
     */
    async delete(id: number, userId: number) {
        return prisma.notifications.delete({
            where: {
                id,
                user_id: userId,
            },
        });
    },
};

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationClientService } from "@/lib/services/notification-client-service";

export const NOTIFICATION_KEYS = {
    all: ['notifications'] as const,
};

export function useNotifications() {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: NOTIFICATION_KEYS.all,
        queryFn: () => notificationClientService.getNotifications(),
        // Check for new notifications every 30 seconds for better perceived real-time
        refetchInterval: 30000,
    });

    // Effect to show toast when new notifications arrive
    const [lastCount, setLastCount] = useState<number | null>(null);
    useEffect(() => {
        if (query.data && lastCount !== null && query.data.unreadCount > lastCount) {
            import("sonner").then(({ toast }) => {
                toast.info("У вас новое уведомление", {
                    description: query.data.notifications[0]?.title || "Проверьте список уведомлений",
                });
            });
        }
        if (query.data) {
            setLastCount(query.data.unreadCount);
        }
    }, [query.data, lastCount]);

    const markAsReadMutation = useMutation({
        mutationFn: (id: number) => notificationClientService.markAsRead(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all });
        },
    });

    const markAllAsReadMutation = useMutation({
        mutationFn: () => notificationClientService.markAllAsRead(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => notificationClientService.deleteNotification(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all });
        },
    });

    return {
        ...query,
        markAsRead: markAsReadMutation.mutate,
        markAllAsRead: markAllAsReadMutation.mutate,
        deleteNotification: deleteMutation.mutate,
        isMarkingAsRead: markAsReadMutation.isPending,
        isMarkingAllAsRead: markAllAsReadMutation.isPending,
    };
}

"use client";

import React from "react";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotifications } from "@/lib/hooks/use-notifications";
import { NotificationDTO } from "@/lib/types/notifications";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { ru, uz } from "date-fns/locale";
import { useTranslation } from "@/lib/i18n/hooks";

export function NotificationBell() {
    const { locale } = useTranslation();
    const { 
        data, 
        isLoading, 
        markAsRead, 
        markAllAsRead, 
        deleteNotification 
    } = useNotifications();

    const notifications = data?.notifications || [];
    const unreadCount = data?.unreadCount || 0;

    const dateLocale = locale === "uz" ? uz : ru;

    const getIcon = (type: string) => {
        switch (type) {
            case "success": return <Icons.Check className="h-4 w-4 text-green-500" />;
            case "warning": return <Icons.Alert className="h-4 w-4 text-yellow-500" />;
            case "error": return <Icons.ShieldAlert className="h-4 w-4 text-red-500" />;
            default: return <Icons.Info className="h-4 w-4 text-blue-500" />;
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-9 w-9">
                    <Icons.Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <Badge 
                            variant="destructive" 
                            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] font-bold"
                        >
                            {unreadCount > 99 ? "99+" : unreadCount}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-0">
                <div className="flex items-center justify-between p-4 pb-2">
                    <DropdownMenuLabel className="p-0 font-bold text-base">
                        Уведомления
                    </DropdownMenuLabel>
                    {unreadCount > 0 && (
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-auto p-0 text-xs text-primary hover:bg-transparent"
                            onClick={() => markAllAsRead()}
                        >
                            Прочитать все
                        </Button>
                    )}
                </div>
                <DropdownMenuSeparator />
                <ScrollArea className="h-80">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-20 text-sm text-muted-foreground">
                            Загрузка...
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 text-center px-4">
                            <Icons.Bell className="h-10 w-10 text-muted-foreground/20 mb-2" />
                            <p className="text-sm text-muted-foreground">У вас пока нет уведомлений</p>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {notifications.map((notification: NotificationDTO) => (
                                <DropdownMenuItem 
                                    key={notification.id}
                                    className={cn(
                                        "flex flex-col items-start gap-1 p-4 cursor-pointer focus:bg-accent/50 border-b last:border-0",
                                        !notification.is_read && "bg-primary/5 font-medium"
                                    )}
                                    onSelect={(e) => {
                                        e.preventDefault();
                                        if (!notification.is_read) markAsRead(notification.id);
                                        if (notification.link) {
                                            // Handle redirection
                                            window.location.href = notification.link;
                                        }
                                    }}
                                >
                                    <div className="flex items-center justify-between w-full gap-2">
                                        <div className="flex items-center gap-2">
                                            {getIcon(notification.type)}
                                            <span className="text-sm truncate max-w-[180px] font-semibold">
                                                {notification.title}
                                            </span>
                                        </div>
                                        <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                                            {formatDistanceToNow(new Date(notification.created_at), { 
                                                addSuffix: true,
                                                locale: dateLocale
                                            })}
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground line-clamp-2">
                                        {notification.message}
                                    </p>
                                </DropdownMenuItem>
                            ))}
                        </div>
                    )}
                </ScrollArea>
                <DropdownMenuSeparator />
                <div className="p-2">
                    <Button variant="ghost" size="sm" className="w-full text-xs" onClick={() => window.location.href = '/notifications'}>
                        Показать все
                    </Button>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

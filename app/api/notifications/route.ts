import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { notificationService } from "@/lib/services/notification-service";

/**
 * GET /api/notifications
 * Retrieves current user's notifications
 */
export async function GET(req: NextRequest) {
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const notifications = await notificationService.getByUser(user.user_id);
        const unreadCount = await notificationService.getUnreadCount(user.user_id);
        
        return NextResponse.json({ 
            notifications,
            unreadCount
        });
    } catch (error) {
        console.error("[API Notifications GET]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

/**
 * POST /api/notifications
 * Action: mark all as read
 */
export async function POST(req: NextRequest) {
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { action } = await req.json();

        if (action === "READ_ALL") {
            await notificationService.markAllAsRead(user.user_id);
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: "Invalid Action" }, { status: 400 });
    } catch (error) {
        console.error("[API Notifications POST]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

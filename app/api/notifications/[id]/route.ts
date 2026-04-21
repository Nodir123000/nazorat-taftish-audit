import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { notificationService } from "@/lib/services/notification-service";

/**
 * PATCH /api/notifications/[id]
 * Action: mark specific as read
 */
export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const notificationId = parseInt(params.id);
    if (isNaN(notificationId)) {
        return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    try {
        const { is_read } = await req.json();

        if (is_read === true) {
            await notificationService.markAsRead(notificationId, user.user_id);
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: "Invalid Data" }, { status: 400 });
    } catch (error) {
        console.error("[API Notifications PATCH]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

/**
 * DELETE /api/notifications/[id]
 * Action: delete specific notification
 */
export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const notificationId = parseInt(params.id);
    if (isNaN(notificationId)) {
        return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    try {
        await notificationService.delete(notificationId, user.user_id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[API Notifications DELETE]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

import { NextResponse } from "next/server";
import { getUnits, getUnitsCount, saveUnit } from "@/lib/services/reference-db-service";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        const skip = parseInt(searchParams.get("skip") || "0", 10);
        const limit = Math.min(parseInt(searchParams.get("limit") || "50", 10), 100);
        const search = searchParams.get("search") || "";

        const [items, total] = await Promise.all([
            getUnits({ skip, take: limit, search }),
            getUnitsCount({ search })
        ]);

        return NextResponse.json({
            data: items,
            total
        });
    } catch (error: any) {
        console.error("GET /api/units error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })

    try {
        const body = await request.json();
        const result = await saveUnit(body);
        return NextResponse.json({ success: true, data: result });
    } catch (error: any) {
        console.error("POST /api/units error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

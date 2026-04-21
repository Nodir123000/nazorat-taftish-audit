import { NextResponse } from "next/server";
import { planningService } from "@/lib/services/planning-service";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        const year = searchParams.get("year");
        const status = searchParams.get("status");

        if (id) {
            const plan = await planningService.getAnnualPlan(id);
            if (!plan) return NextResponse.json({ error: "Plan not found" }, { status: 404 });
            return NextResponse.json(plan);
        }

        const plans = await planningService.getAnnualPlans({
            year: year ? Number(year) : undefined,
            status: status as any
        });

        return NextResponse.json(plans);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch plans" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    try {
        const body = await request.json();
        const newPlan = await planningService.createAnnualPlan(body);
        return NextResponse.json(newPlan);
    } catch (error) {
        console.error("Error creating plan:", error);
        return NextResponse.json({ error: "Failed to create plan" }, { status: 500 });
    }
}

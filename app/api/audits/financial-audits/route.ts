import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { getCurrentUser } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const inspectorId = searchParams.get("inspectorId")
    const unitName = searchParams.get("unitName")
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "50", 10)))

    const where: any = {}
    if (unitName) where.unit = { contains: unitName, mode: 'insensitive' }

    if (inspectorId) {
        const pId = Number.parseInt(inspectorId);
        
        let userId: number | null = null;
        const person = await prisma.personnel.findUnique({ where: { id: pId }, select: { full_name: true } });
        if (person?.full_name) {
            const user = await prisma.users.findFirst({ where: { fullname: person.full_name }, select: { user_id: true } });
            if (user) userId = user.user_id;
        }

        const assignments = await (prisma as any).commission_members.findMany({
            where: { OR: [ { personnel_id: pId }, ...(userId ? [{ user_id: userId }] : []) ] },
            select: { order_id: true }
        });

        const orderIds = assignments.map((a: any) => a.order_id);
        let prescriptionIds: number[] = [];

        if (orderIds.length > 0) {
            const orders = await prisma.orders.findMany({
                where: { id: { in: orderIds } },
                select: { plan_id: true }
            });
            const planIds = orders.map((o: any) => o.plan_id).filter((id: any) => id !== null) as number[];

            if (planIds.length > 0) {
                const prescriptions = await prisma.prescriptions.findMany({
                    where: { plan_id: { in: planIds } },
                    select: { id: true }
                });
                prescriptionIds = prescriptions.map((p: any) => p.id);
            }
        }

        where.OR = [
            { inspector_id: pId },
            ...(prescriptionIds.length > 0 ? [{ prescription_id: { in: prescriptionIds } }] : [])
        ];

        // AUTO-GENERATE DRAFT AUDITS FOR NEW ASSIGNMENTS
        if (prescriptionIds.length > 0 && pId && person?.full_name) {
            const existingAudits = await prisma.financial_audits.findMany({
                where: { prescription_id: { in: prescriptionIds } },
                select: { prescription_id: true }
            });
            const existingPrescriptionIds = new Set(existingAudits.map((a: any) => a.prescription_id));
            const missingPrescriptionIds = prescriptionIds.filter(id => !existingPrescriptionIds.has(id));

            if (missingPrescriptionIds.length > 0) {
                const getLoc = (obj: any): string => {
                    if (!obj?.name) return "";
                    if (typeof obj.name === "string") return obj.name;
                    return obj.name?.ru || obj.name?.uz || "";
                };

                for (const mId of missingPrescriptionIds) {
                    const pres = await prisma.prescriptions.findUnique({
                        where: { id: mId },
                        include: { 
                            rev_plan_year: { 
                                include: { 
                                    ref_units: { include: { ref_military_districts: true } }, 
                                    ref_control_authorities: true, 
                                    ref_control_directions: true 
                                } 
                            } 
                        }
                    } as any);

                    if (pres && pres.rev_plan_year) {
                        const plan = pres.rev_plan_year as any;
                        const unitName = getLoc(plan.ref_units);
                        const unitSubtitle = plan.ref_units?.ref_military_districts?.name_ru || getLoc(plan.ref_units?.ref_military_districts) || "";
                        const controlBody = getLoc(plan.ref_control_authorities) || "КРУ МО РУз";
                        const directionCode = plan.ref_control_directions?.code || "";
                        const directionName = getLoc(plan.ref_control_directions) || directionCode;

                        let type = "Комплексная";
                        if (directionCode.includes("FIN")) type = "Финансовая";
                        if (directionCode.includes("ECO")) type = "Хозяйственная";

                        await prisma.financial_audits.create({
                            data: {
                                unit: unitName || "Не указан объект",
                                unit_subtitle: unitSubtitle,
                                control_body: controlBody,
                                inspection_direction: directionName || "Плановая проверка",
                                inspection_type: type,
                                status: "Черновик",
                                date: new Date(),
                                inspector_id: pId,
                                inspector_name: person.full_name,
                                prescription_id: mId
                            }
                        });
                    }
                }
            }
        }
    }

    const [audits, total] = await Promise.all([
      prisma.financial_audits.findMany({
        where,
        include: { financial_violations: true },
        orderBy: { date: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.financial_audits.count({ where }),
    ])

    // Batch fetch prescriptions for enrichment if they have prescription_id
    const prescriptionIds = audits
        .map((a: any) => a.prescription_id)
        .filter((id: any) => id !== null) as number[];
    
    let prescriptionsMap: Record<number, any> = {};
    if (prescriptionIds.length > 0) {
        const presData = await prisma.prescriptions.findMany({
            where: { id: { in: prescriptionIds } },
            include: {
                rev_plan_year: {
                    include: {
                        ref_units: { include: { ref_military_districts: true } },
                        ref_control_directions: true,
                        ref_control_authorities: true
                    }
                }
            }
        } as any);
        
        presData.forEach((p: any) => {
            prescriptionsMap[p.id] = p;
        });
    }

    const getLoc = (obj: any): string => {
        if (!obj) return "";
        if (typeof obj.name === "string") return obj.name;
        if (obj.name && typeof obj.name === "object") return obj.name.ru || obj.name.uz || obj.name.uzk || "";
        return "";
    };

    // Map to DTO with enrichment
    const dtos = audits.map((item: any) => {
      const pres = item.prescription_id ? prescriptionsMap[item.prescription_id] : null;
      const plan = pres?.rev_plan_year;
      
      // Inherit from plan if missing in audit record
      const displayUnit = (item.unit && item.unit !== "Не указан объект") 
          ? item.unit 
          : (plan ? getLoc(plan.ref_units) : item.unit);
          
      const displayUnitSubtitle = item.unit_subtitle 
          ? item.unit_subtitle 
          : (plan?.ref_units?.ref_military_districts ? (plan.ref_units.ref_military_districts.name?.ru || getLoc(plan.ref_units.ref_military_districts)) : "");
          
      const displayDirection = (item.inspection_direction && item.inspection_direction !== "Плановая проверка")
          ? item.inspection_direction
          : (plan ? getLoc(plan.ref_control_directions) : item.inspection_direction);

      const displayControlBody = item.control_body
          ? item.control_body
          : (plan ? getLoc(plan.ref_control_authorities) : "КРУ МО РУ");

      return {
        id: item.id,
        unit: displayUnit || "Не указан объект",
        unitSubtitle: displayUnitSubtitle || "",
        controlBody: displayControlBody || "",
        inspectionDirection: displayDirection || "",
        inspectionDirectionSubtitle: item.inspection_direction_subtitle || "",
        inspectionType: item.inspection_type || (plan?.ref_control_directions?.code?.includes("FIN") ? "Финансовая" : "Комплексная"),
        date: item.date?.toLocaleDateString('ru-RU') || "",
        cashier: item.cashier || "",
        cashierRole: item.cashier_role || "",
        balance: item.balance != null ? Number(item.balance).toFixed(2) : "0.00",
        status: item.status,
        violations: item.financial_violations?.length || 0,
        financialAmount: (item.financial_violations || [])
          .reduce((acc: number, v: any) => acc + (v.amount != null ? parseFloat(v.amount.toString()) : 0), 0)
          .toFixed(2),
        propertyAmount: "0.00",
        recoveredAmount: (item.financial_violations || [])
          .reduce((acc: number, v: any) => acc + (v.recovered != null ? parseFloat(v.recovered.toString()) : 0), 0)
          .toFixed(2),
        resolvedViolations: 0,
        inspectorId: item.inspector_id,
        inspectorName: item.inspector_name,
        prescriptionId: item.prescription_id
      };
    })

    return NextResponse.json({ items: dtos, total, page, limit })
  } catch (error: any) {
    console.error("Error fetching financial audits:", error)
    return NextResponse.json({ error: "Failed to fetch financial audits", details: String(error.message) }, { status: 500 })
  }
}



export async function POST(request: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await request.json()

    // Validate required fields
    if (!body.unit) {
      return NextResponse.json({ error: "Unit is required" }, { status: 400 })
    }

    let auditDate = new Date()
    if (body.date) {
      auditDate = new Date(body.date)
      if (isNaN(auditDate.getTime())) {
        return NextResponse.json({ error: "Invalid date" }, { status: 400 })
      }
    }

    const newAudit = await prisma.financial_audits.create({
      data: {
        unit: body.unit,
        unit_subtitle: body.unitSubtitle,
        control_body: body.controlBody,
        inspection_direction: body.inspectionDirection,
        inspection_direction_subtitle: body.inspectionDirectionSubtitle,
        inspection_type: body.inspectionType,
        date: auditDate,
        cashier: body.cashier,
        cashier_role: body.cashierRole,
        balance: body.balance,
        status: body.status || "draft",
        inspector_id: body.inspectorId,
        inspector_name: body.inspectorName,
        prescription_id: body.prescriptionId
      }
    })

    return NextResponse.json(newAudit)
  } catch (error: any) {
    console.error("Error creating financial audit:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

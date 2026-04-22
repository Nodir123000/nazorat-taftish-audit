import { prisma } from "../db/prisma"
import { notificationService } from "./notification-service"

export type PlanStatus = "draft" | "approved" | "in_progress" | "completed"

export interface PlanFilters {
  year?: number
  status?: PlanStatus
  search?: string
}

export interface AnnualPlan {
  id: string
  year: number
  status: PlanStatus
  approved_by?: string
  approved_date?: string
  total_audits?: number
  created_at: string
  updated_at: string
}

export interface QuarterlyPlan {
  id: string
  annual_plan_id: string
  quarter: number
  year: number
  status: PlanStatus
  planned_audits: number
  created_at: string
}

export interface MonthlyPlan {
  id: string
  quarterly_plan_id: string
  month: number
  year: number
  status: PlanStatus
  planned_audits: number
  created_at: string
}

function getQuarter(date: Date | string | null): string {
  if (!date) return ""
  const d = new Date(date)
  const m = d.getMonth() // 0-11
  const q = Math.ceil((m + 1) / 3)
  const y = d.getFullYear()
  const romans = ["I", "II", "III", "IV"]
  return `${romans[q - 1]} квартал ${y}`
}

export const planningService = {
  // Annual Plans
  async getAnnualPlans(filters?: PlanFilters) {
    try {
      const where: any = {}

      if (filters?.year) where.year = filters.year
      if (filters?.status) where.status = filters.status
      if (filters?.search) {
        where.OR = [
          { status: { contains: filters.search, mode: 'insensitive' } },
          { description: { contains: filters.search, mode: 'insensitive' } },
        ]
      }

      // Соблюдаем правило "Sequential Fetch": не более 2 уровней вложенности
      const plans = await prisma.rev_plan_year.findMany({
        where,
        include: {
          ref_units: {
            include: {
              ref_areas: true,
              ref_military_districts: true,
            }
          },
          users_rev_plan_year_responsible_idTousers: true,
          users_rev_plan_year_approved_by_idTousers: true,
          ref_control_authorities: true,
          ref_control_directions: true,
          ref_inspection_types: true,
          orders: true, // Плоский список заказов
          briefings: true,
          prescriptions: true
        } as any,
        orderBy: { year: 'desc' }
      })

      return plans.map((p: any) => ({
        ...p,
        id: p.plan_id,
        planId: p.plan_id,
        planNumber: p.plan_number,
        startDate: p.start_date,
        endDate: p.end_date,
        unitId: p.unit_id,
        responsibleId: p.responsible_id,
        controlAuthority: p.ref_control_authorities?.code || "",
        inspectionDirection: p.ref_control_directions?.name?.ru || p.ref_control_directions?.name || p.ref_control_directions?.code || "",
        inspectionType: p.ref_inspection_types?.name?.ru || p.ref_inspection_types?.name || p.ref_inspection_types?.code || "2301",
        periodConducted: p.period_covered_start ? getQuarter(p.period_covered_start) : "",
        periodCoveredStart: p.period_covered_start,
        periodCoveredEnd: p.period_covered_end,
        controlObject: p.ref_units?.name?.ru || p.ref_units?.name || "",
        unit: p.ref_units,
        responsible: p.users_rev_plan_year_responsible_idTousers,
        approvedBy: p.users_rev_plan_year_approved_by_idTousers,
      }));
    } catch (error) {
      console.error("Error in getAnnualPlans:", error);
      return [];
    }
  },

  async getPlansForOrders() {
    const plans = await prisma.rev_plan_year.findMany({
      include: {
        ref_units: {
          include: {
            ref_military_districts: true
          }
        },
        users_rev_plan_year_responsible_idTousers: true,
        ref_control_directions: true,
        ref_inspection_types: true,
        orders: { include: { commission_members: { include: { users: true } } } },
        briefings: true,
        prescriptions: true
      } as any,
      orderBy: { year: 'desc' }
    })

    return plans.map((p: any) => ({
      ...p,
      id: p.plan_id,
      planId: p.plan_id,
      planNumber: p.plan_number,
      startDate: p.start_date,
      endDate: p.end_date,
      inspectionDirection: p.ref_control_directions?.name?.ru || p.ref_control_directions?.name || p.ref_control_directions?.code || "",
      inspectionType: p.ref_inspection_types?.name?.ru || p.ref_inspection_types?.name || p.ref_inspection_types?.code || "",
      controlObject: p.ref_units?.name?.ru || p.ref_units?.name || "",
      periodConducted: p.period_covered_start ? getQuarter(p.period_covered_start) : "",
      periodCoveredStart: p.period_covered_start,
      periodCoveredEnd: p.period_covered_end,
      unit: p.ref_units,
      responsible: p.users_rev_plan_year_responsible_idTousers,
    }))
  },

  async getAnnualPlan(id: string) {
    const p = await prisma.rev_plan_year.findUnique({
      where: { plan_id: Number.parseInt(id) },
      include: {
        ref_units: {
          include: {
            ref_areas: { include: { ref_regions: true } },
            ref_military_districts: true
          }
        },
        users_rev_plan_year_responsible_idTousers: true,
        users_rev_plan_year_approved_by_idTousers: true,
        ref_control_authorities: true,
        ref_control_directions: true,
        ref_inspection_types: true,
        orders: { include: { commission_members: { include: { users: true } } } },
        briefings: true,
        prescriptions: true
      } as any
    })

    if (!p) return null;

    return {
      ...p,
      id: (p as any).plan_id,
      planId: (p as any).plan_id,
      planNumber: (p as any).plan_number,
      startDate: (p as any).start_date,
      endDate: (p as any).end_date,
      unitId: (p as any).unit_id,
      responsibleId: (p as any).responsible_id,
      controlAuthority: (p as any).ref_control_authorities?.code || "",
      inspectionDirection: (p as any).ref_control_directions?.name?.ru || (p as any).ref_control_directions?.name || (p as any).ref_control_directions?.code || "",
      inspectionType: (p as any).ref_inspection_types?.name?.ru || (p as any).ref_inspection_types?.name || (p as any).ref_inspection_types?.code || "2301",
      periodConducted: (p as any).period_covered_start ? getQuarter((p as any).period_covered_start) : "",
      periodCoveredStart: (p as any).period_covered_start,
      periodCoveredEnd: (p as any).period_covered_end,
      controlObject: (p as any).ref_units?.name?.ru || (p as any).ref_units?.name || "",
      unit: (p as any).ref_units,
      responsible: (p as any).users_rev_plan_year_responsible_idTousers,
      approvedBy: (p as any).users_rev_plan_year_approved_by_idTousers,
    };
  },

  async createAnnualPlan(data: any) {
    let control_authority_id: number | undefined
    if (data.controlAuthority) {
      const auth = await (prisma as any).ref_control_authorities.findUnique({ where: { code: data.controlAuthority } });
      control_authority_id = auth?.authority_id;
    }

    let inspection_direction_id: number | undefined
    if (data.inspectionDirection) {
      const dir = await (prisma as any).ref_control_directions.findUnique({ where: { code: data.inspectionDirection } });
      inspection_direction_id = dir?.direction_id;
    }

    let inspection_type_id: number | undefined
    if (data.inspectionType) {
      const type = await (prisma as any).ref_inspection_types.findUnique({ where: { code: String(data.inspectionType) } });
      inspection_type_id = type?.id;
    }

    const created = await prisma.rev_plan_year.create({
      data: {
        year: Number(data.year),
        status: data.status || "draft",
        start_date: data.startDate ? new Date(data.startDate) : new Date(),
        end_date: data.endDate ? new Date(data.endDate) : new Date(),
        unit_id: data.unit ? Number.parseInt(data.unit) : undefined,
        responsible_id: data.responsible ? Number.parseInt(data.responsible) : undefined,
        plan_number: data.planNumber,
        incoming_number: data.incomingNumber,
        incoming_date: data.incomingDate ? new Date(data.incomingDate) : null,
        objects_total: Number(data.objectsTotal) || 0,
        objects_fs: Number(data.objectsFs) || 0,
        objects_os: Number(data.objectsOs) || 0,
        expense_classification: data.expenseClassification,
        supply_department: data.supplyDepartment,
        control_authority_id,
        inspection_direction_id,
        inspection_type_id,
        period_covered_start: data.periodCoveredStart ? new Date(data.periodCoveredStart) : null,
        period_covered_end: data.periodCoveredEnd ? new Date(data.periodCoveredEnd) : null,
        subordinate_units_on_allowance: data.subordinateUnitsOnAllowance,
      } as any
    })

    return { ...created, planId: (created as any).plan_id, id: (created as any).plan_id }
  },

  async updateAnnualPlan(id: string | number, data: any) {
    const updateData: any = {}

    if (data.controlAuthority) {
      const auth = await (prisma as any).ref_control_authorities.findUnique({ where: { code: data.controlAuthority } });
      if (auth) updateData.control_authority_id = auth.authority_id;
    }
    if (data.inspectionDirection) {
      const dir = await (prisma as any).ref_control_directions.findUnique({ where: { code: data.inspectionDirection } });
      if (dir) updateData.inspection_direction_id = dir.direction_id;
    }
    if (data.inspectionType) {
      const type = await (prisma as any).ref_inspection_types.findUnique({ where: { code: String(data.inspectionType) } });
      if (type) updateData.inspection_type_id = type.id;
    }

    if (data.year !== undefined) updateData.year = Number(data.year)
    if (data.status !== undefined) updateData.status = data.status
    if (data.description !== undefined) updateData.description = data.description
    if (data.planNumber !== undefined) updateData.plan_number = data.planNumber
    if (data.startDate !== undefined) updateData.start_date = new Date(data.startDate)
    if (data.endDate !== undefined) updateData.end_date = new Date(data.endDate)
    if (data.incomingNumber !== undefined) updateData.incoming_number = data.incomingNumber
    if (data.incomingDate !== undefined) updateData.incoming_date = data.incomingDate ? new Date(data.incomingDate) : null
    if (data.unit !== undefined) updateData.unit_id = data.unit ? Number.parseInt(data.unit) : null
    if (data.responsible !== undefined) updateData.responsible_id = data.responsible ? Number.parseInt(data.responsible) : null
    if (data.objectsTotal !== undefined) updateData.objects_total = Number(data.objectsTotal)
    if (data.objectsFs !== undefined) updateData.objects_fs = Number(data.objectsFs)
    if (data.objectsOs !== undefined) updateData.objects_os = Number(data.objectsOs)
    if (data.expenseClassification !== undefined) updateData.expense_classification = data.expenseClassification
    if (data.supplyDepartment !== undefined) updateData.supply_department = data.supplyDepartment
    if (data.periodCoveredStart !== undefined) updateData.period_covered_start = data.periodCoveredStart ? new Date(data.periodCoveredStart) : null
    if (data.periodCoveredEnd !== undefined) updateData.period_covered_end = data.periodCoveredEnd ? new Date(data.periodCoveredEnd) : null
    if (data.subordinateUnitsOnAllowance !== undefined) updateData.subordinate_units_on_allowance = data.subordinateUnitsOnAllowance

    return await prisma.rev_plan_year.update({
      where: { plan_id: Number.parseInt(id.toString()) },
      data: updateData as any
    })
  },

  async deleteAnnualPlan(id: string) {
    await prisma.rev_plan_year.delete({
      where: { plan_id: Number.parseInt(id) }
    })
  },

  // Quarterly Plans
  async getQuarterlyPlans(annualPlanId?: string, filters?: PlanFilters) {
    const where: any = {}
    if (annualPlanId) where.annual_plan_id = Number.parseInt(annualPlanId)
    if (filters?.status) where.status = filters.status

    return await prisma.quarterly_plans.findMany({
      where,
      orderBy: { quarter: 'asc' }
    })
  },

  async getQuarterlyPlan(id: string) {
    return await prisma.quarterly_plans.findUnique({
      where: { id: Number.parseInt(id) },
      include: {
        monthly_plans: true
      }
    })
  },

  // Monthly Plans
  async getMonthlyPlans(quarterlyPlanId?: string, filters?: PlanFilters) {
    const where: any = {}
    if (quarterlyPlanId) where.quarterly_plan_id = Number.parseInt(quarterlyPlanId)
    if (filters?.status) where.status = filters.status

    return await prisma.monthly_plans.findMany({
      where,
      orderBy: { month: 'asc' }
    })
  },

  async getMonthlyPlan(id: string) {
    return await prisma.monthly_plans.findUnique({
      where: { id: Number.parseInt(id) },
      include: {
        audits: true
      }
    })
  },

  // Document Templates
  async getTemplates(type?: string) {
    const where: any = {}
    if (type) where.type = type
    // @ts-ignore
    return await prisma.document_templates.findMany({
      where,
      orderBy: { created_at: 'desc' }
    })
  },

  async getTemplate(id: string) {
    // @ts-ignore
    return await prisma.document_templates.findUnique({
      where: { id }
    })
  },

  async upsertTemplate(id: string, data: any) {
    // @ts-ignore
    return await prisma.document_templates.upsert({
      where: { id },
      update: data,
      create: { id, ...data }
    })
  },

  async deleteTemplate(id: string) {
    // @ts-ignore
    await prisma.document_templates.delete({
      where: { id }
    })
  },

  // Orders
  async getOrders(params?: any) {
    const where: any = {}
    if (params?.plan_id) where.plan_id = Number(params.plan_id)
    if (params?.status) where.status = params.status

    const limit = Math.min(100, Math.max(1, Number(params?.limit) || 50))
    const page = Math.max(1, Number(params?.page) || 1)

    const [items, total] = await Promise.all([
      prisma.orders.findMany({
        where,
        include: {
          users: true,
          rev_plan_year: true,
          ref_units: true,
          commission_members: true
        } as any,
        orderBy: { created_at: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.orders.count({ where }),
    ])

    return { items, total, page, limit }
  },

  async getOrder(id: string | number) {
    return await prisma.orders.findUnique({
      where: { id: Number(id) },
      include: {
        users: true,
        rev_plan_year: true,
        ref_units: true,
        commission_members: true
      } as any
    })
  },

  async createOrder(data: any) {
    let issuerId = Number(data.issuerId);
    if (isNaN(issuerId) || !data.issuerId) {
      const fallback = await prisma.users.findFirst({ where: { is_active: true } });
      if (!fallback) throw new Error("Не найден ни один активный пользователь для создания приказа");
      issuerId = fallback.user_id;
    } else {
      const userExists = await prisma.users.findUnique({ where: { user_id: issuerId } });
      if (!userExists) {
        const fallback = await prisma.users.findFirst({ where: { is_active: true } });
        if (!fallback) throw new Error(`Пользователь id=${issuerId} не найден и нет активных пользователей`);
        console.warn(`[createOrder] user_id=${issuerId} не найден, используем id=${fallback.user_id}`);
        issuerId = fallback.user_id;
      }
    }

    return await prisma.orders.create({
      data: {
        order_number: data.orderNumber || `П-${Date.now()}`,
        order_date: new Date(data.orderDate || new Date()),
        issuer_id: issuerId,
        plan_id: data.planId ? Number(data.planId) : null,
        unit_id: data.unitId ? Number(data.unitId) : null,
        template_id: data.templateId,
        order_type: data.orderType,
        status: data.status || "issued",
        order_text: data.orderText,
      } as any
    })
  },

  async updateOrder(id: string | number, data: any) {
    const update: any = {}
    if (data.orderNumber) update.order_number = data.orderNumber
    if (data.orderDate) update.order_date = new Date(data.orderDate)
    if (data.status) update.status = data.status
    if (data.orderText) update.order_text = data.orderText

    return await prisma.orders.update({
      where: { id: Number(id) },
      data: update
    })
  },

  async deleteOrder(id: string | number) {
    await prisma.orders.delete({
      where: { id: Number(id) }
    })
  },

  // Commission Members
  async getCommissionMembers(params?: any) {
    const where: any = {}
    if (params?.orderId) where.order_id = Number(params.orderId)
    return await prisma.commission_members.findMany({
      where,
      include: {
        users: true,
        personnel: {
          include: {
            ref_physical_persons: true
          }
        }
      } as any
    })
  },

  async addCommissionMember(data: any) {
    const userId = data.userId ? Number(data.userId) : null
    const personnelId = data.personnelId ? Number(data.personnelId) : null
    if (!userId && !personnelId) {
      console.warn("[addCommissionMember] Skipped: both user_id and personnel_id are null")
      return null
    }
    try {
      const created = await prisma.commission_members.create({
        data: {
          order_id: Number(data.orderId),
          audit_id: data.auditId ? Number(data.auditId) : null,
          user_id: userId,
          personnel_id: personnelId,
          role: data.role,
          is_responsible: !!data.isResponsible,
        } as any
      })

      // Trigger notification if user_id is present
      if (userId) {
        try {
          const order = await prisma.orders.findUnique({
            where: { id: Number(data.orderId) },
            select: { order_number: true }
          })
          
          await notificationService.create({
            userId: userId,
            title: "Новое назначение",
            message: `Вы назначены в контрольную группу по приказу №${order?.order_number || "---"}. Роль: ${data.role}`,
            type: "info",
            category: "audit",
            link: `/personnel/view/${personnelId || userId}?mode=personnel` // Placeholder link
          })
        } catch (authErr) {
          console.error("[addCommissionMember] Failed to send notification:", authErr)
        }
      }

      return created
    } catch (e: any) {
      console.warn(`Failed to add commission member user_id: ${data.userId} - ${e.message}`)
      return null
    }
  },

  async updateCommissionMember(id: string | number, data: any) {
    return await prisma.commission_members.update({
      where: { id: Number(id) },
      data: {
        role: data.role,
        is_responsible: !!data.isResponsible,
        user_id: data.userId !== undefined ? (data.userId ? Number(data.userId) : null) : undefined,
        personnel_id: data.personnelId !== undefined ? (data.personnelId ? Number(data.personnelId) : null) : undefined,
        order_id: data.orderId ? Number(data.orderId) : undefined,
        audit_id: data.auditId !== undefined ? (data.auditId ? Number(data.auditId) : null) : undefined,
      } as any
    })
  },

  async deleteCommissionMember(id: string | number) {
    await prisma.commission_members.delete({
      where: { id: Number(id) }
    })
  },

  async deleteCommissionMembersByOrder(orderId: number) {
    // @ts-ignore
    await prisma.commission_members.deleteMany({
      where: { order_id: orderId }
    })
  },

  // Prescriptions
  async getPrescriptions(params?: any) {
    const where: any = {}
    if (params?.plan_id) where.plan_id = Number(params.plan_id)
    // @ts-ignore
    return await prisma.prescriptions.findMany({
      where,
      include: { rev_plan_year: true, users: true },
      orderBy: { created_at: 'desc' }
    })
  },

  async createPrescription(data: any) {
    const rawDate = data.issueDate ?? data.issuedDate ?? data.date ?? data.prescriptionDate ?? new Date();
    // @ts-ignore
    return await prisma.prescriptions.create({
      data: {
        plan_id: Number(data.planId),
        prescription_num: data.prescriptionNum,
        date: new Date(rawDate),
        issuer_id: Number(data.issuerId),
        requirements: data.requirements,
        status: data.status || "issued",
        updated_at: new Date(),
      }
    })
  },

  async updatePrescription(id: string | number, data: any) {
    const update: any = {}
    if (data.status) update.status = data.status
    if (data.requirements) update.requirements = data.requirements
    if (data.prescriptionNum) update.prescription_num = data.prescriptionNum
    if (data.date) update.date = new Date(data.date)

    // @ts-ignore
    return await prisma.prescriptions.update({
      where: { id: Number(id) },
      data: update
    })
  },

  async deletePrescription(id: string | number) {
    // @ts-ignore
    await prisma.prescriptions.delete({
      where: { id: Number(id) }
    })
  },

  // Briefings
  async getBriefings(params?: any) {
    const where: any = {}
    if (params?.plan_id) where.plan_id = Number(params.plan_id)
    // @ts-ignore
    return await prisma.briefings.findMany({
      where,
      include: { rev_plan_year: true, users: true },
      orderBy: { created_at: 'desc' }
    })
  },

  async createBriefing(data: any) {
    // @ts-ignore
    return await prisma.briefings.create({
      data: {
        plan_id: Number(data.planId),
        instructor_id: Number(data.instructorId),
        instruction_date: new Date(data.instructionDate),
        content: data.content,
        safety_measures: data.safetyMeasures,
        status: data.status || "conducted",
        updated_at: new Date(),
      }
    })
  },

  async deleteBriefing(id: string | number) {
    // @ts-ignore
    await prisma.briefings.delete({
      where: { id: Number(id) }
    })
  },

  async getBriefingTopics(params?: any) {
    return this.getBriefings(params)
  },

  async createBriefingTopic(data: any) {
    return this.createBriefing(data)
  },

  async updateBriefingTopic(id: string | number, data: any) {
    return await prisma.briefings.update({
      where: { id: Number(id) },
      data: {
        content: data.content,
        safety_measures: data.safetyMeasures,
        status: data.status,
        instruction_date: data.instructionDate ? new Date(data.instructionDate) : undefined,
      } as any
    })
  },

  async deleteBriefingTopic(id: string | number) {
    return this.deleteBriefing(id)
  },

  async getUnplannedAudits(params?: any) { return [] },
  async getUnplannedAuditsStats() { return { total: 0, inProgress: 0, completed: 0, cancelled: 0 } },
  async createUnplannedAudit(data: any) { return { id: "new", ...data } },

  async findLastControlPeriod(unitName: string, authorityCode: string) {
    if (!unitName || !authorityCode) return null;

    try {
      const unit = await prisma.ref_units.findFirst({
        where: { name: { path: ['ru'], equals: unitName } } as any,
      });

      const unit_id = unit?.unit_id;
      if (!unit_id) return null;

      const auth = await (prisma as any).ref_control_authorities.findUnique({
        where: { code: authorityCode }
      });
      const control_authority_id = auth?.authority_id;

      let latestPeriod = null;

      const lastAudit = await prisma.audits.findFirst({
        where: { unit_id, status: 'completed' },
        orderBy: { end_date: 'desc' }
      });

      if (lastAudit) {
        latestPeriod = {
          start: lastAudit.start_date,
          end: lastAudit.end_date,
          source: 'audit'
        };
      }

      if (control_authority_id) {
        const lastPlan = await prisma.rev_plan_year.findFirst({
          where: { unit_id, control_authority_id, status: 'approved' },
          orderBy: { year: 'desc' }
        });

        if (lastPlan && (lastPlan as any).period_covered_start && (lastPlan as any).period_covered_end) {
          if (!latestPeriod || lastPlan.year >= (new Date(latestPeriod.end).getFullYear())) {
            latestPeriod = {
              start: (lastPlan as any).period_covered_start,
              end: (lastPlan as any).period_covered_end,
              source: 'plan'
            };
          }
        }
      }

      return latestPeriod;
    } catch (error) {
      console.error("Error in findLastControlPeriod:", error);
      return null;
    }
  }
}

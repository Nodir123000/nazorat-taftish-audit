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
        select: {
          plan_id: true,
          plan_number: true,
          year: true,
          start_date: true,
          end_date: true,
          status: true,
          inspection_direction_id: true,
          inspection_type_id: true,
          control_authority_id: true,
          period_covered_start: true,
          period_covered_end: true,
          ref_units: {
            select: {
              unit_id: true,
              unit_code: true,
              name: true,
              ref_areas: {
                select: {
                  id: true,
                  name: true,
                  ref_regions: {
                    select: {
                      id: true,
                      name: true
                    }
                  }
                }
              },
              ref_military_districts: {
                select: {
                  district_id: true,
                  name: true,
                  short_name: true
                }
              }
            }
          },
          users_rev_plan_year_responsible_idTousers: {
            select: {
              user_id: true,
              fullname: true,
              rank: true,
              position: true
            }
          },
          users_rev_plan_year_approved_by_idTousers: {
            select: {
              user_id: true,
              fullname: true,
              rank: true,
              position: true
            }
          },
          ref_control_authorities: { select: { authority_id: true, name: true, code: true } },
          ref_control_directions: { select: { direction_id: true, name: true, code: true, abbreviation: true, abbreviation_uz_latn: true, abbreviation_uz_cyrl: true } },
          ref_inspection_types: { select: { id: true, name: true, code: true } },
          orders: {
            select: {
              id: true,
              order_number: true,
              order_date: true,
              status: true,
              unit_id: true
            }
          },
          briefings: {
            select: {
              id: true,
              instruction_date: true,
              status: true
            }
          },
          prescriptions: {
            select: {
              id: true,
              prescription_num: true,
              date: true,
              status: true
            }
          }
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
        inspectionDirection: p.ref_control_directions?.name?.ru || (typeof p.ref_control_directions?.name === 'string' ? p.ref_control_directions.name : "") || p.ref_control_directions?.code || "",
        inspectionAbbreviation: p.ref_control_directions?.abbreviation || "",
        inspectionAbbreviationUzLatn: p.ref_control_directions?.abbreviation_uz_latn || "",
        inspectionAbbreviationUzCyrl: p.ref_control_directions?.abbreviation_uz_cyrl || "",
        inspectionDirectionName: p.ref_control_directions?.name || null,
        inspectionType: p.ref_inspection_types?.name?.ru || (typeof p.ref_inspection_types?.name === 'string' ? p.ref_inspection_types.name : "") || p.ref_inspection_types?.code || "2301",
        periodConducted: p.period_covered_start ? getQuarter(p.period_covered_start) : "",
        periodCoveredStart: p.period_covered_start,
        periodCoveredEnd: p.period_covered_end,
        controlObject: p.ref_units?.name?.ru || (typeof p.ref_units?.name === 'string' ? p.ref_units.name : "") || "",
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
      select: {
        plan_id: true,
        plan_number: true,
        year: true,
        start_date: true,
        end_date: true,
        status: true,
        inspection_direction_id: true,
        inspection_type_id: true,
        period_covered_start: true,
        period_covered_end: true,
        ref_units: {
          select: {
            unit_id: true,
            unit_code: true,
            name: true,
            ref_areas: {
              select: {
                id: true,
                name: true,
                ref_regions: {
                  select: {
                    id: true,
                    name: true
                  }
                }
              }
            },
            ref_military_districts: {
              select: {
                district_id: true,
                name: true,
                short_name: true
              }
            }
          }
        },
        users_rev_plan_year_responsible_idTousers: {
          select: {
            user_id: true,
            fullname: true,
            rank: true,
            position: true
          }
        },
        ref_control_authorities: { select: { authority_id: true, name: true, code: true } },
        ref_control_directions: { select: { direction_id: true, name: true, code: true, abbreviation: true, abbreviation_uz_latn: true, abbreviation_uz_cyrl: true } },
        ref_inspection_types: { select: { id: true, name: true, code: true } },
        orders: {
          select: {
            id: true,
            order_number: true,
            order_date: true,
            status: true,
            unit_id: true,
            commission_members: {
              select: {
                id: true,
                role: true,
                is_responsible: true,
                users: {
                  select: {
                    user_id: true,
                    fullname: true,
                    rank: true
                  }
                },
                personnel: {
                  select: {
                    id: true,
                    pnr: true,
                    ref_physical_persons: {
                      select: {
                        id: true,
                        first_name: true,
                        last_name: true,
                        middle_name: true
                      }
                    },
                    ref_ranks: {
                      select: {
                        rank_id: true,
                        name: true
                      }
                    }
                  }
                }
              }
            }
          }
        },
        briefings: {
          select: {
            id: true,
            instruction_date: true,
            status: true
          }
        },
        prescriptions: {
          select: {
            id: true,
            prescription_num: true,
            date: true,
            status: true
          }
        }
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
      inspectionDirection: p.ref_control_directions?.name?.ru || (typeof p.ref_control_directions?.name === 'string' ? p.ref_control_directions.name : "") || p.ref_control_directions?.code || "",
      inspectionAbbreviation: p.ref_control_directions?.abbreviation || "",
      inspectionAbbreviationUzLatn: p.ref_control_directions?.abbreviation_uz_latn || "",
      inspectionAbbreviationUzCyrl: p.ref_control_directions?.abbreviation_uz_cyrl || "",
      inspectionDirectionName: p.ref_control_directions?.name || null,
      inspectionType: p.ref_inspection_types?.name?.ru || (typeof p.ref_inspection_types?.name === 'string' ? p.ref_inspection_types.name : "") || p.ref_inspection_types?.code || "2301",
      controlAuthority: p.ref_control_authorities?.code || "",
      inspectionDirectionId: p.inspection_direction_id,
      inspectionTypeId: p.inspection_type_id,
      status: p.status,
      controlObject: p.ref_units?.name?.ru || (typeof p.ref_units?.name === 'string' ? p.ref_units.name : "") || "",
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
      select: {
        plan_id: true,
        plan_number: true,
        year: true,
        start_date: true,
        end_date: true,
        status: true,
        inspection_direction_id: true,
        inspection_type_id: true,
        control_authority_id: true,
        period_covered_start: true,
        period_covered_end: true,
        ref_units: {
          select: {
            unit_id: true,
            unit_code: true,
            name: true,
            ref_areas: {
              select: {
                id: true,
                name: true,
                ref_regions: {
                  select: {
                    id: true,
                    name: true
                  }
                }
              }
            },
            ref_military_districts: {
              select: {
                district_id: true,
                name: true,
                short_name: true
              }
            }
          }
        },
        users_rev_plan_year_responsible_idTousers: {
          select: {
            user_id: true,
            fullname: true,
            rank: true,
            position: true
          }
        },
        users_rev_plan_year_approved_by_idTousers: {
          select: {
            user_id: true,
            fullname: true,
            rank: true,
            position: true
          }
        },
        ref_control_authorities: { select: { authority_id: true, name: true, code: true } },
        ref_control_directions: { select: { direction_id: true, name: true, code: true } },
        ref_inspection_types: { select: { id: true, name: true, code: true } },
        orders: {
          select: {
            id: true,
            order_number: true,
            order_date: true,
            unit_id: true,
            commission_members: {
              select: {
                id: true,
                role: true,
                is_responsible: true,
                users: {
                  select: {
                    user_id: true,
                    fullname: true,
                    rank: true
                  }
                },
                personnel: {
                  select: {
                    id: true,
                    pnr: true,
                    ref_physical_persons: {
                      select: {
                        id: true,
                        first_name: true,
                        last_name: true,
                        middle_name: true
                      }
                    },
                    ref_ranks: {
                      select: {
                        rank_id: true,
                        name: true
                      }
                    }
                  }
                }
              }
            }
          }
        },
        briefings: {
          select: {
            id: true,
            instruction_date: true,
            status: true
          }
        },
        prescriptions: {
          select: {
            id: true,
            prescription_num: true,
            date: true,
            status: true
          }
        }
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
      inspectionDirection: (p as any).ref_control_directions?.name?.ru || (typeof (p as any).ref_control_directions?.name === 'string' ? (p as any).ref_control_directions.name : "") || (p as any).ref_control_directions?.code || "",
      inspectionAbbreviation: (p as any).ref_control_directions?.abbreviation || "",
      inspectionAbbreviationUzLatn: (p as any).ref_control_directions?.abbreviation_uz_latn || "",
      inspectionAbbreviationUzCyrl: (p as any).ref_control_directions?.abbreviation_uz_cyrl || "",
      inspectionType: (p as any).ref_inspection_types?.name?.ru || (typeof (p as any).ref_inspection_types?.name === 'string' ? (p as any).ref_inspection_types.name : "") || (p as any).ref_inspection_types?.code || "2301",
      periodConducted: (p as any).period_covered_start ? getQuarter((p as any).period_covered_start) : "",
      periodCoveredStart: (p as any).period_covered_start,
      periodCoveredEnd: (p as any).period_covered_end,
      controlObject: (p as any).ref_units?.name?.ru || (typeof (p as any).ref_units?.name === 'string' ? (p as any).ref_units.name : "") || "",
      unit: (p as any).ref_units,
      responsible: (p as any).users_rev_plan_year_responsible_idTousers,
      approvedBy: (p as any).users_rev_plan_year_approved_by_idTousers,
    };
  },

  async createAnnualPlan(data: any) {
    console.log("[planning-service] createAnnualPlan input data:", JSON.stringify(data, null, 2));
    
    // 0. Поиск органа (по коду)
    let authId = null;
    if (data.controlAuthority) {
        try {
            const auth = await (prisma as any).ref_control_authorities.findUnique({
                where: { code: String(data.controlAuthority) }
            });
            if (auth) authId = auth.authority_id;
        } catch (e) {
            console.warn("[planning-service] Failed to lookup authority:", e);
        }
    }

    // 1. Поиск направления (по коду или по ID, если передано число)
    let directionId = null;
    if (data.inspectionDirection) {
        try {
            const dir = await (prisma as any).ref_control_directions.findFirst({
                where: {
                    OR: [
                        { code: String(data.inspectionDirection) },
                        { name: String(data.inspectionDirection) }
                    ]
                }
            });
            if (dir) directionId = dir.direction_id;
        } catch (e) {
            console.warn("[planning-service] Failed to lookup direction:", e);
        }
    }
    // 2. Поиск типа (по коду или по ID)
    let typeId = null;
    if (data.inspectionType) {
        try {
            const type = await (prisma as any).ref_inspection_types.findFirst({
                where: {
                    OR: [
                        { code: String(data.inspectionType) },
                        { name: String(data.inspectionType) }
                    ]
                }
            });
            if (type) typeId = type.id;
            else if (!isNaN(Number(data.inspectionType))) {
                typeId = Number(data.inspectionType);
            }
        } catch (e) {
            console.warn("[planning-service] Failed to lookup inspection type:", e);
        }
    }

    // 2.5. Derive start_date and end_date from periodConducted if not provided
    let startDate = data.startDate ? new Date(data.startDate) : null;
    let endDate = data.endDate ? new Date(data.endDate) : null;

    if ((!startDate || !endDate) && data.periodConducted) {
        try {
            const parts = data.periodConducted.split('-');
            if (parts.length >= 1) {
                const roman = parts[0].trim();
                const yearMatch = data.periodConducted.match(/\d{4}/);
                const year = yearMatch ? parseInt(yearMatch[0]) : Number(data.year);
                
                const qMap: Record<string, number> = { "I": 1, "II": 2, "III": 3, "IV": 4 };
                const q = qMap[roman];
                
                if (q && year) {
                    startDate = new Date(year, (q - 1) * 3, 1);
                    endDate = new Date(year, q * 3, 0); // Last day of quarter
                }
            }
        } catch (e) {
            console.warn("[planning-service] Failed to parse periodConducted:", e);
        }
    }

    // Fallback to start/end of year if still null
    if (!startDate) startDate = new Date(Number(data.year), 0, 1);
    if (!endDate) endDate = new Date(Number(data.year), 11, 31);

        // 3. Создание записи годового плана
        const created = await (prisma as any).rev_plan_year.create({
            data: {
                plan_number: data.planNumber,
                year: Number(data.year),
                start_date: startDate,
                end_date: endDate,
                ref_units: data.unitId || data.unit ? {
                    connect: { unit_id: data.unitId ? Number(data.unitId) : Number.parseInt(data.unit) }
                } : undefined,
                ref_control_authorities: authId ? {
                    connect: { authority_id: authId }
                } : undefined,
                ref_control_directions: directionId ? {
                    connect: { direction_id: directionId }
                } : undefined,
                ref_inspection_types: typeId ? {
                    connect: { id: typeId }
                } : undefined,
                period_covered_start: data.periodCoveredStart ? new Date(data.periodCoveredStart) : null,
                period_covered_end: data.periodCoveredEnd ? new Date(data.periodCoveredEnd) : null,
                status: data.status ? String(data.status) : "draft",
                objects_total: data.objectsTotal ? Number(data.objectsTotal) : (data.totalAudits ? Number(data.totalAudits) : null),
                objects_fs: data.objectsFs ? Number(data.objectsFs) : null,
                objects_os: data.objectsOs ? Number(data.objectsOs) : null,
                description: data.description,
                subordinate_units_on_allowance: data.subordinateUnitsOnAllowance || [],
            },
        });

    return { ...created, planId: (created as any).plan_id, id: (created as any).plan_id };
  },

  async updateAnnualPlan(id: string | number, data: any) {
    const updateData: any = {}

    if (data.unit !== undefined) {
      updateData.ref_units = data.unit ? { connect: { unit_id: Number.parseInt(data.unit) } } : { disconnect: true };
    }
    if (data.responsible !== undefined) {
      updateData.users_rev_plan_year_responsible_idTousers = data.responsible ? { connect: { user_id: Number.parseInt(data.responsible) } } : { disconnect: true };
    }
    if (data.controlAuthority !== undefined) {
      const auth = await (prisma as any).ref_control_authorities.findUnique({ where: { code: data.controlAuthority } });
      if (auth) updateData.ref_control_authorities = { connect: { authority_id: auth.authority_id } };
    }
    if (data.inspectionDirection !== undefined) {
      const dir = await (prisma as any).ref_control_directions.findUnique({ where: { code: data.inspectionDirection } });
      if (dir) updateData.ref_control_directions = { connect: { direction_id: dir.direction_id } };
    }
    if (data.inspectionType !== undefined) {
      const type = await (prisma as any).ref_inspection_types.findUnique({ where: { code: String(data.inspectionType) } });
      if (type) updateData.ref_inspection_types = { connect: { id: type.id } };
    }

    if (data.year !== undefined) updateData.year = Number(data.year)
    if (data.status !== undefined) updateData.status = data.status
    if (data.description !== undefined) updateData.description = data.description
    if (data.planNumber !== undefined) updateData.plan_number = data.planNumber
    if (data.startDate !== undefined) updateData.start_date = new Date(data.startDate)
    if (data.endDate !== undefined) updateData.end_date = new Date(data.endDate)
    if (data.incomingNumber !== undefined) updateData.incoming_number = data.incomingNumber
    if (data.incomingDate !== undefined) updateData.incoming_date = data.incomingDate ? new Date(data.incomingDate) : null
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
    let fallbackUser = await prisma.users.findFirst({ where: { is_active: true } });
    
    if (isNaN(issuerId) || !data.issuerId) {
      if (!fallbackUser) throw new Error("Не найден ни один активный пользователь для создания приказа");
      issuerId = fallbackUser.user_id;
    } else {
      const userExists = await prisma.users.findUnique({ where: { user_id: issuerId } });
      if (!userExists) {
        if (!fallbackUser) throw new Error(`Пользователь id=${issuerId} не найден и нет активных пользователей`);
        console.warn(`[createOrder] user_id=${issuerId} не найден, используем id=${fallbackUser.user_id}`);
        issuerId = fallbackUser.user_id;
      }
    }

      const orderData = {
        order_number: data.orderNumber || `П-${Date.now()}`,
        order_date: data.orderDate ? new Date(data.orderDate) : new Date(),
        order_type: data.orderType || "revision",
        status: data.status || "draft",
        order_text: data.orderText,
        issuer_id: issuerId,
        plan_id: data.planId ? Number(data.planId) : null,
        unit_id: data.unitId ? Number(data.unitId) : null,
      };

      console.log("[planning-service] Creating order with data:", JSON.stringify(orderData, null, 2));

      return await prisma.orders.create({
        data: orderData,
      });
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
          
          // Wrap notification in try-catch to prevent blocking the main operation
          try {
              await notificationService.create({
                  userId: userId,
                  title: "Новое назначение",
                  message: `Вы назначены ${data.role === 'head' ? 'председателем' : 'членом'} комиссии для проведения проверки по приказу №${order?.order_number || "---"}.`,
                  type: "info",
                  category: "audit",
                  link: `/personnel/view/${personnelId || userId}?mode=personnel` 
              });
          } catch (notifErr) {
              console.error("[planning-service] Failed to create notification for commission member:", notifErr);
          }
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

  async findLastControlPeriod(unitRef: number | string, authorityCode: string, directionCode?: string) {
    try {
      let unit_id: number | null = null;
      if (typeof unitRef === 'number') {
        unit_id = unitRef;
      } else {
        const unit = await prisma.ref_units.findFirst({
          where: { OR: [{ name: { path: ['ru'], equals: unitRef } }, { unit_code: unitRef }] }
        });
        unit_id = unit?.unit_id || null;
      }

      if (!unit_id) return null;

      const auth = await prisma.ref_control_authorities.findUnique({
        where: { code: authorityCode }
      });
      const control_authority_id = auth?.authority_id;

      let direction_id: number | undefined;
      if (directionCode) {
        const dir = await prisma.ref_control_directions.findFirst({
          where: { code: directionCode }
        });
        direction_id = dir?.direction_id;
      }

      let latestPeriod = null;

      // 1. Сначала ищем в реальных аудитах (выполненных)
      const lastAudit = await prisma.audits.findFirst({
        where: { 
            unit_id, 
            status: 'completed',
            ...(direction_id ? { inspection_direction_id: direction_id } : {})
        },
        orderBy: { end_date: 'desc' }
      });

      if (lastAudit) {
        latestPeriod = {
          start: lastAudit.start_date,
          end: lastAudit.end_date,
          source: 'audit'
        };
      }

      // 2. Если есть ID органа, ищем в утвержденных планах (может быть актуальнее)
      if (control_authority_id) {
        const lastPlan = await prisma.rev_plan_year.findFirst({
          where: { 
            unit_id, 
            control_authority_id, 
            status: { in: ['approved', 'completed', '101', '105'] },
            ...(direction_id ? { inspection_direction_id: direction_id } : {})
          },
          orderBy: { year: 'desc' }
        });

        if (lastPlan && (lastPlan as any).period_covered_start && (lastPlan as any).period_covered_end) {
          const planYear = lastPlan.year;
          const auditYear = latestPeriod ? new Date(latestPeriod.end).getFullYear() : 0;
          
          if (!latestPeriod || planYear >= auditYear) {
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
  },

  async checkPlanCollision(unitId: number, year: number, excludePlanId?: number) {
    try {
      const existingPlans = await prisma.rev_plan_year.findMany({
        where: {
          unit_id: unitId,
          year: year,
          plan_id: excludePlanId ? { not: excludePlanId } : undefined
        },
        include: {
          ref_control_authorities: true,
          ref_inspection_types: true
        }
      });

      if (existingPlans.length > 0) {
        return {
          hasCollision: true,
          plans: existingPlans.map((p: any) => ({
            planId: p.plan_id,
            authority: (p as any).ref_control_authorities?.name || (p as any).ref_control_authorities?.code || null,
            type: (p as any).ref_inspection_types?.name || (p as any).ref_inspection_types?.code || null,
            startDate: p.start_date,
            endDate: p.end_date
          }))
        };
      }

      return { hasCollision: false };
    } catch (error) {
      console.error("Error checking plan collision:", error);
      return { hasCollision: false };
    }
  },

  async bulkCreateAnnualPlans(plans: any[]) {
    try {
      const results = await prisma.$transaction(
        plans.map(p => prisma.rev_plan_year.create({
          data: {
            year: p.year,
            unit_id: p.unitId,
            control_authority_id: p.controlAuthorityId,
            inspection_direction_id: p.controlDirectionId,
            inspection_type_id: p.inspectionTypeId,
            start_date: p.startDate ? new Date(p.startDate) : null,
            end_date: p.endDate ? new Date(p.endDate) : null,
            period_conducted: p.periodConducted,
            status: p.status,
            plan_number: p.planNumber,
          }
        }))
      );
      return { success: true, count: results.length };
    } catch (error) {
      console.error("Bulk create failed:", error);
      throw error;
    }
  }
}

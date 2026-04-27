import { prisma } from "../db/prisma"

export interface OrderFilters {
  status?: "active" | "completed" | "cancelled"
  unitId?: number
  planId?: number
  search?: string
}

export const unifiedOrdersService = {
  // Get all orders with filtering
  async getOrders(filters?: OrderFilters) {
    const where: any = {}

    if (filters?.status) where.status = filters.status
    if (filters?.unitId) where.unitId = filters.unitId
    if (filters?.planId) where.planId = filters.planId
    if (filters?.search) {
      where.OR = [
        { orderNumber: { contains: filters.search, mode: 'insensitive' } },
        { orderType: { contains: filters.search, mode: 'insensitive' } },
      ]
    }

    return await (prisma as any).orders.findMany({
      where,
      include: {
        unit: true,
        issuer: true,
        plan: true,
      },
      orderBy: { orderDate: 'desc' }
    })
  },

  // Get order by ID
  async getOrder(orderId: number) {
    return await (prisma as any).orders.findUnique({
      where: { id: orderId },
      include: {
        unit: true,
        issuer: true,
        plan: true,
      }
    })
  },

  // Create new order
  async createOrder(data: any) {
    const order = await (prisma as any).orders.create({
      data: {
        orderNumber: data.order_num,
        orderDate: new Date(data.order_date),
        issuerId: data.commander_id,
        planId: data.plan_id,
        unitId: data.unit_id,
        orderType: data.audit_type,
        status: data.status || "issued",
      }
    });

    // Automatically update the annual plan status to 'In Progress' (102) if linked
    if (data.plan_id) {
      await prisma.rev_plan_year.update({
        where: { plan_id: Number(data.plan_id) },
        data: { status: "102" }
      });
    }

    return order;
  },

  // Update order
  async updateOrder(orderId: number, data: any) {
    return await (prisma as any).orders.update({
      where: { id: orderId },
      data: {
        ...data,
        updatedAt: new Date()
      }
    })
  },

  // Get commission members for an order
  async getCommissionMembers(orderId: number) {
    return await (prisma as any).commission_members.findMany({
      where: { orderId }
    })
  },

  // Add commission member
  async addCommissionMember(data: any) {
    return await (prisma as any).commission_members.create({
      data: {
        orderId: data.order_id,
        auditId: data.audit_id,
        userId: data.employee_id,
        role: data.role,
        isResponsible: data.isResponsible,
      }
    })
  },

  // Remove commission member
  async removeCommissionMember(memberId: number) {
    await (prisma as any).commission_members.delete({
      where: { id: memberId }
    })
    return true
  },

  // Get employee by ID (User)
  async getEmployee(employeeId: number) {
    return await (prisma as any).users.findUnique({
      where: { userId: employeeId }
    })
  },

  // Get all employees (Users)
  async getEmployees() {
    return await (prisma as any).users.findMany({
      orderBy: { fullname: 'asc' }
    })
  },

  // Get commission with full employee details
  async getCommissionWithDetails(orderId: number) {
    return await (prisma as any).commission_members.findMany({
      where: { orderId },
      include: {
        user: true
      }
    })
  },
}

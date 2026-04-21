import { prisma } from "../db/prisma"
import type { Employee } from "../types"

export interface EmployeeFilters {
  role?: "admin" | "chief_inspector" | "inspector" | "viewer"
  isActive?: boolean
  specialization?: string
  search?: string
}

function mapUserToEmployee(u: {
  user_id: number
  fullname: string
  rank?: string | null
  position?: string | null
  specialization?: string | null
  unit_id?: number | null
  role: string
  is_active?: boolean | null
  created_at?: Date | null
  updated_at?: Date | null
}): Employee {
  return {
    employee_id: u.user_id,
    fullname: u.fullname,
    rank: u.rank ?? undefined,
    position: u.position ?? undefined,
    specialization: u.specialization ?? undefined,
    unit_id: u.unit_id ?? undefined,
    role: u.role as Employee["role"],
    is_active: u.is_active ?? true,
    created_at: u.created_at?.toISOString() ?? new Date().toISOString(),
    updated_at: u.updated_at?.toISOString() ?? new Date().toISOString(),
  }
}

export const employeeService = {
  async getEmployees(filters?: EmployeeFilters): Promise<Employee[]> {
    const where: any = {}

    if (filters?.role) where.role = filters.role
    if (filters?.isActive !== undefined) where.is_active = filters.isActive
    if (filters?.specialization) {
      where.specialization = { contains: filters.specialization, mode: "insensitive" }
    }

    if (filters?.search) {
      where.OR = [
        { fullname: { contains: filters.search, mode: "insensitive" } },
        { position: { contains: filters.search, mode: "insensitive" } },
        { specialization: { contains: filters.search, mode: "insensitive" } },
      ]
    }

    const records = await prisma.users.findMany({ where, orderBy: { fullname: "asc" } })
    return records.map(mapUserToEmployee)
  },

  async getEmployee(employeeId: number): Promise<Employee | null> {
    const u = await prisma.users.findUnique({ where: { user_id: employeeId } })
    return u ? mapUserToEmployee(u) : null
  },

  async createEmployee(data: any): Promise<Employee> {
    const u = await prisma.users.create({
      data: {
        username: data.username,
        password_hash: data.password_hash || "default_hash",
        fullname: data.fullname,
        rank: data.rank,
        position: data.position,
        specialization: data.specialization,
        role: data.role || "inspector",
        is_active: data.is_active !== undefined ? data.is_active : true,
      },
    })
    return mapUserToEmployee(u)
  },

  async updateEmployee(employeeId: number, data: any): Promise<Employee> {
    const u = await prisma.users.update({
      where: { user_id: employeeId },
      data: { ...data, updated_at: new Date() },
    })
    return mapUserToEmployee(u)
  },

  async deactivateEmployee(employeeId: number): Promise<Employee> {
    return this.updateEmployee(employeeId, { is_active: false })
  },

  async getActiveInspectors(): Promise<Employee[]> {
    return this.getEmployees({ role: "inspector", isActive: true })
  },

  async getEmployeesBySpecialization(specialization: string): Promise<Employee[]> {
    return this.getEmployees({ specialization, isActive: true })
  },
}

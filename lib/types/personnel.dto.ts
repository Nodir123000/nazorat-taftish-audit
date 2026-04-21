import { z } from "zod";

// --- Enums ---
export const RankEnum = z.enum([
    "Рядовой",
    "Ефрейтор",
    "Младший сержант",
    "Сержант",
    "Старший сержант",
    "Старшина",
    "Прапорщик",
    "Старший прапорщик",
    "Лейтенант",
    "Старший лейтенант",
    "Капитан",
    "Майор",
    "Подполковник",
    "Полковник",
    "Генерал-майор",
    "Генерал-лейтенант",
    "Генерал-полковник",
    "Генерал армии"
]);

export const GenderEnum = z.enum(["MALE", "FEMALE"]);

// --- Schemas ---

export const PassportSchema = z.object({
    series: z.string(),
    number: z.string(),
    issueDate: z.string(), // ISO Date
    expiryDate: z.string(), // ISO Date
    issuedBy: z.string(),
    departmentCode: z.string().optional(),
});

export const ContactSchema = z.object({
    type: z.string(), // e.g., "PHONE", "EMAIL", "TELEGRAM"
    value: z.string(),
    isPrimary: z.boolean().default(false),
});

export const EmployeeSchema = z.object({
    id: z.string(),
    pin: z.string().optional(), // Personal Identification Number
    firstName: z.string(),
    lastName: z.string(),
    patronymic: z.string().optional(),
    fullName: z.string(), // Derived or explicit

    rank: RankEnum.or(z.string()), // Allow string fallback if enum doesn't match mock data initially
    position: z.string(),
    department: z.string(), // ID or Name
    militaryUnit: z.string().optional(),
    militaryDistrict: z.string().optional(),
    dislocation: z.string().optional(),

    dob: z.string(), // Date of Birth
    gender: GenderEnum.optional(),
    nationality: z.string().optional(),

    militaryRank: z.string().optional(),
    passportNumber: z.string().optional(),
    specialization: z.string().optional(),

    // Enhanced columns
    inspectorCategory: z.string().optional(),
    totalDamageAmount: z.number().optional().default(0),
    kpiRating: z.string().optional(),
    serviceStartDate: z.string().optional(),
    violationsFound: z.number().optional().default(0),
    serviceNumber: z.string().optional(),

    passport: PassportSchema.optional(),
    contacts: z.array(ContactSchema).optional(),

    // Extra fields for list view compatibility
    licenseCount: z.number().optional().default(0),
    auditCount: z.number().optional().default(0),
    source: z.string().optional(),

    createdAt: z.string(),
    updatedAt: z.string(),
});

// --- DTOs ---

export type EmployeeDTO = z.infer<typeof EmployeeSchema>;

export const CreateEmployeeSchema = EmployeeSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true
});

export type CreateEmployeeDTO = z.infer<typeof CreateEmployeeSchema>;

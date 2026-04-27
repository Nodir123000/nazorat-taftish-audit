import { prisma } from "@/lib/db/prisma";
import { z } from "zod";

export const PersonnelUpdateSchema = z.object({
  // Personnel fields
  serviceNumber: z.string().optional(),
  pnr: z.string().optional(),
  rankId: z.number().optional(),
  unitId: z.number().optional(),
  positionId: z.number().optional(),
  vusId: z.number().optional(),
  status: z.string().optional(),
  clearanceLevel: z.string().optional(),
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),
  
  // Physical Person fields
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  middleName: z.string().optional(),
  pinfl: z.string().length(14).optional(),
  passportSeries: z.string().optional(),
  passportNumber: z.string().optional(),
  passportIssuedBy: z.string().optional(),
  passportExpiryDate: z.string().optional(),
  birthPlace: z.string().optional(),
  actualAddress: z.string().optional(),
  biography: z.string().optional(),
  contactPhone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
});

export type PersonnelUpdateData = z.infer<typeof PersonnelUpdateSchema>;

export const PersonnelManagementService = {
  /**
   * Updates a full personnel profile including linked physical person data in a transaction.
   */
  async updateFullProfile(personnelId: number, data: PersonnelUpdateData) {
    return await prisma.$transaction(async (tx) => {
      // 1. Find the personnel record to get physical_person_id
      const personnel = await tx.personnel.findUnique({
        where: { id: personnelId },
        select: { physical_person_id: true }
      });

      if (!personnel) {
        throw new Error(`Personnel with ID ${personnelId} not found`);
      }

      // 2. Prepare Personnel update data
      const personnelUpdate: any = {};
      if (data.serviceNumber !== undefined) personnelUpdate.service_number = data.serviceNumber;
      if (data.pnr !== undefined) personnelUpdate.pnr = data.pnr;
      if (data.rankId !== undefined) personnelUpdate.rank_id = data.rankId;
      if (data.unitId !== undefined) personnelUpdate.unit_id = data.unitId;
      if (data.positionId !== undefined) personnelUpdate.position_id = data.positionId;
      if (data.vusId !== undefined) personnelUpdate.vus_id = data.vusId;
      if (data.status !== undefined) personnelUpdate.status = data.status;
      if (data.clearanceLevel !== undefined) personnelUpdate.clearance_level = data.clearanceLevel;
      if (data.emergencyContact !== undefined) personnelUpdate.emergency_contact = data.emergencyContact;
      if (data.emergencyPhone !== undefined) personnelUpdate.emergency_phone = data.emergencyPhone;
      
      personnelUpdate.updated_at = new Date();

      // 3. Prepare Physical Person update data
      const physicalUpdate: any = {};
      if (data.firstName !== undefined) physicalUpdate.first_name = data.firstName;
      if (data.lastName !== undefined) physicalUpdate.last_name = data.lastName;
      if (data.middleName !== undefined) physicalUpdate.middle_name = data.middleName;
      if (data.pinfl !== undefined) physicalUpdate.pinfl = data.pinfl;
      if (data.passportSeries !== undefined) physicalUpdate.passport_series = data.passportSeries;
      if (data.passportNumber !== undefined) physicalUpdate.passport_number = data.passportNumber;
      if (data.passportIssuedBy !== undefined) physicalUpdate.passport_issued_by = data.passportIssuedBy;
      if (data.passportExpiryDate !== undefined) {
        physicalUpdate.passport_expiry_date = data.passportExpiryDate ? new Date(data.passportExpiryDate) : null;
      }
      if (data.birthPlace !== undefined) physicalUpdate.birth_place = data.birthPlace;
      if (data.actualAddress !== undefined) physicalUpdate.actual_address = data.actualAddress;
      if (data.biography !== undefined) physicalUpdate.biography = data.biography;
      if (data.contactPhone !== undefined) physicalUpdate.contact_phone = data.contactPhone;
      if (data.email !== undefined) physicalUpdate.email = data.email || null;
      
      physicalUpdate.updated_at = new Date();

      // 4. Execute updates
      const updatedPersonnel = await tx.personnel.update({
        where: { id: personnelId },
        data: personnelUpdate,
        include: {
          ref_physical_persons: true
        }
      });

      if (Object.keys(physicalUpdate).length > 0) {
        await tx.ref_physical_persons.update({
          where: { id: personnel.physical_person_id },
          data: physicalUpdate
        });
      }

      // 5. TODO: Add audit_log entry here once AuditLogService is ready
      // await tx.audit_log.create({ ... })

      return updatedPersonnel;
    });
  },

  /**
   * Adds a contract to a personnel record.
   */
  async addContract(personnelId: number, data: { series_number: string, start_date: string, end_date: string }) {
    return await prisma.personnel_contracts.create({
      data: {
        personnel_id: personnelId,
        series_number: data.series_number,
        start_date: new Date(data.start_date),
        end_date: new Date(data.end_date),
        status: "active"
      }
    });
  },

  /**
   * Adds service history entry.
   */
  async addServiceHistory(personnelId: number, data: { unit: string, position: string, start_date: string, end_date?: string }) {
    return await prisma.personnel_service_history.create({
      data: {
        personnel_id: personnelId,
        unit: data.unit,
        position: data.position,
        start_date: new Date(data.start_date),
        end_date: data.end_date ? new Date(data.end_date) : null
      }
    });
  }
};

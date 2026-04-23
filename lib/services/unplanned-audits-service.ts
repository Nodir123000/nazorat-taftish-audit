import { prisma } from "../db/prisma";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Конфигурация S3 (MinIO)
const s3Client = new S3Client({
  endpoint: process.env.S3_ENDPOINT || "http://localhost:9000",
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY || "minioadmin",
    secretAccessKey: process.env.S3_SECRET_KEY || "minioadmin",
  },
  forcePathStyle: true,
});

const BUCKET_NAME = "audits-documents";

export interface UnplannedAuditPayload {
  request_number: string;
  source_agency: string;
  description?: string;
  unit_id: number;
  document_s3_key?: string;
}

export const unplannedAuditsService = {
  /**
   * Получение списка проверок с автоматическим применением RLS.
   */
  async getUnplannedAudits(ctx: { user_id: number; unit_id: number }) {
    return await (prisma as any).$withRLS(ctx, async (tx: any) => {
      return await tx.unplanned_audits.findMany({
        include: {
          ref_units: true,
          users: {
            select: { fullname: true, rank: true }
          }
        },
        orderBy: { created_at: "desc" },
      });
    });
  },

  /**
   * Создание записи в рамках RLS-контекста.
   */
  async createUnplannedAudit(ctx: { user_id: number; unit_id: number }, data: UnplannedAuditPayload) {
    return await (prisma as any).$withRLS(ctx, async (tx: any) => {
      return await tx.unplanned_audits.create({
        data: {
          ...data,
          assigned_to: ctx.user_id,
        },
      });
    });
  },

  /**
   * Генерация временной ссылки на документ из S3.
   * TTL строго ограничивается 15 минутами (900 секунд).
   */
  async getDocumentUrl(s3Key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: s3Key,
    });

    // TTL = 15 минут согласно архитектурному ограничению
    return await getSignedUrl(s3Client, command, { expiresIn: 900 });
  },
};

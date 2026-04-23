export const dynamic = "force-dynamic"
import { withAuth, AuthContext } from '@/lib/security/rbac-guardian';
import { unplannedAuditsService } from '@/lib/services/unplanned-audits-service';
import { NextResponse } from 'next/server';

/**
 * GET: Получение Pre-signed URL для безопасного скачивания документа.
 * Метод запрашивает временную ссылку у S3 с TTL 15 мин.
 */
export const GET = withAuth(async (req: Request, ctx: AuthContext, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  try {
    // 1. Находим запись в БД (проверка существования и прав через RLS произойдет в сервисе)
    const audit = await unplannedAuditsService.getUnplannedAudits(ctx);
    const target = audit.find((a: any) => a.id === parseInt(id));

    if (!target || !target.document_s3_key) {
      return NextResponse.json({ error: 'DOCUMENT_NOT_FOUND' }, { status: 404 });
    }

    // 2. Генерация ссылки через сервис (TTL 15 мин)
    const downloadUrl = await unplannedAuditsService.getDocumentUrl(target.document_s3_key);

    return NextResponse.json({ url: downloadUrl });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}, 'PS-3', 'VIEW');

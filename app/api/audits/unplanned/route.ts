import { withAuth, AuthContext } from '@/lib/security/rbac-guardian';
import { unplannedAuditsService } from '@/lib/services/unplanned-audits-service';
import { NextResponse } from 'next/server';

/**
 * GET: Список внеплановых ревизий.
 * Безопасность: RLS применяется через $withRLS в сервисе.
 */
export const GET = withAuth(async (req: Request, ctx: AuthContext) => {
  const data = await unplannedAuditsService.getUnplannedAudits(ctx);
  return NextResponse.json(data);
}, 'PS-3', 'VIEW');

/**
 * POST: Регистрация нового запроса.
 * Автоматически записывает assigned_to из контекста сессии.
 */
export const POST = withAuth(async (req: Request, ctx: AuthContext) => {
  try {
    const body = await req.json();
    
    const result = await unplannedAuditsService.createUnplannedAudit(ctx, {
      request_number: body.request_number,
      source_agency: body.source_agency,
      description: body.description,
      unit_id: body.unit_id,
      document_s3_key: body.document_s3_key
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error('[API_UNPLANNED] Create error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}, 'PS-3', 'CREATE');

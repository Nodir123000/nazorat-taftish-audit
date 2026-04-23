export const dynamic = "force-dynamic"
import { withAuth, AuthContext } from '@/lib/security/rbac-guardian';
import { translationExtendedService } from '@/lib/services/translation-extended-service';
import { NextResponse } from 'next/server';

/**
 * GET: Получение всех ключей и значений локализации для админки.
 */
export const GET = withAuth(async (req: Request, ctx: AuthContext) => {
  const keys = await translationExtendedService.getAllKeys();
  return NextResponse.json(keys);
}, 'PS-9', 'VIEW');

/**
 * PUT: Массовое или частичное обновление переводов.
 * Позволяет изменить термин во всей системе.
 */
export const PUT = withAuth(async (req: Request, ctx: AuthContext) => {
  try {
    const { key, locale, value } = await req.json();
    
    if (!key || !locale || !value) {
      return NextResponse.json({ error: 'MISSING_FIELDS' }, { status: 400 });
    }

    const result = await translationExtendedService.updateTerm(key, locale, value);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}, 'PS-9', 'EDIT');


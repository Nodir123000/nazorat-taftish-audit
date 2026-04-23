import { withAuth, AuthContext } from '@/lib/security/rbac-guardian';
import { prisma } from '@/lib/db/prisma';
import { NextResponse } from 'next/server';

/**
 * GET: Получение профиля инспектора с историей ротаций.
 */
export const GET = withAuth(async (req: Request, ctx: AuthContext, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  try {
    const data = await prisma.$withRLS(ctx, async (tx: any) => {
      return await tx.inspector_profiles.findUnique({
        where: { user_id: parseInt(id) },
        include: {
          users: {
            select: { fullname: true, rank: true, position: true, email: true }
          },
          inspector_rotations: {
            include: { ref_units: true },
            orderBy: { start_date: 'desc' }
          }
        }
      });
    });

    if (!data) {
      return NextResponse.json({ error: 'PROFILE_NOT_FOUND' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}, 'PS-5', 'VIEW');

import { Redis } from 'ioredis';
import { prisma } from '../db/prisma';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

let redisInstance: Redis | null = null;

function getRedis() {
  if (!redisInstance) {
    redisInstance = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
      maxRetriesPerRequest: 0,
      connectTimeout: 5000,
    });
  }
  return redisInstance;
}

export type AuthContext = {
  user_id: number;
  unit_id: number;
  role: string;
  fullname: string;
};

/**
 * Higher-Order Function для защиты API-маршрутов.
 * Выполняет: 
 * 1. Проверку сессии в Redis.
 * 2. RBAC-проверку по 9-модульной матрице.
 */
export function withAuth(handler: Function, subsystem: string, action: 'VIEW' | 'CREATE' | 'EDIT' | 'DELETE' | 'APPROVE') {
  return async (req: Request, ...args: any[]) => {
    try {
      const cookieStore = await cookies();
      const sessionId = cookieStore.get('session_id')?.value;

      if (!sessionId) {
        return NextResponse.json({ error: 'AUTH_REQUIRED' }, { status: 401 });
      }

      const sessionData = await getRedis().get(`session:${sessionId}`);
      if (!sessionData) {
        return NextResponse.json({ error: 'SESSION_EXPIRED' }, { status: 401 });
      }

      const ctx: AuthContext = JSON.parse(sessionData);

      // Проверка по обновленной 9-модульной матрице
      if (!hasPermission(ctx.role, subsystem, action)) {
        return NextResponse.json({ 
          error: 'FORBIDDEN', 
          message: `У роли ${ctx.role} нет прав на ${action} в подсистеме ${subsystem}` 
        }, { status: 403 });
      }

      return handler(req, ctx, ...args);
    } catch (error) {
      console.error('[RBAC_GUARDIAN] Critical Error:', error);
      return NextResponse.json({ error: 'INTERNAL_SERVER_ERROR' }, { status: 500 });
    }
  };
}

/**
 * Реализация матрицы доступа АИС КРР (9 подсистем)
 */
function hasPermission(role: string, subsystem: string, action: string): boolean {
  const matrix: Record<string, any> = {
    'admin': { '*': ['VIEW', 'CREATE', 'EDIT', 'DELETE', 'APPROVE'] },
    'chief': {
      'PS-1': ['VIEW', 'APPROVE'],
      'PS-2': ['VIEW', 'EDIT'],
      'PS-3': ['VIEW', 'APPROVE'],
      'PS-8': ['VIEW']
    },
    'senior_inspector': {
      'PS-3': ['VIEW', 'CREATE', 'EDIT'],
      'PS-4': ['VIEW', 'CREATE', 'EDIT'],
      'PS-5': ['VIEW', 'EDIT']
    },
    'inspector': {
      'PS-3': ['VIEW'],
      'PS-4': ['VIEW', 'CREATE'],
      'PS-7': ['VIEW']
    }
  };

  const roleRights = matrix[role.toLowerCase()];
  if (!roleRights) return false;
  if (roleRights['*']) return true;

  return roleRights[subsystem]?.includes(action) || false;
}

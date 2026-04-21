import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

async function reset() {
  const prisma = new PrismaClient();
  const hash = await bcrypt.hash('admin', 10);
  
  await prisma.users.update({
    where: { username: 'admin' },
    data: { password_hash: hash, is_active: true }
  });
  
  console.log('Password reset to: admin');
  await prisma.$disconnect();
}

reset().catch(console.error);


import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';
import path from 'path';

// Load .env
dotenv.config({ path: path.join(__dirname, '../.env') });

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Rebalancing KRU personnel to 50 total, evenly distributed...');

  const kruSubUnits = [20801, 20802, 20803, 20804];
  const targetTotal = 50;
  
  const allPersonnel = await prisma.personnel.findMany({
    orderBy: { id: 'asc' }
  });

  console.log(`Total personnel in system: ${allPersonnel.length}`);

  if (allPersonnel.length < targetTotal) {
    console.error(`Not enough personnel. Current total: ${allPersonnel.length}`);
    return;
  }

  const counts = [13, 13, 12, 12];
  let pIdx = 0;

  for (let i = 0; i < kruSubUnits.length; i++) {
    const unitId = kruSubUnits[i];
    for (let j = 0; j < counts[i]; j++) {
      const p = allPersonnel[pIdx++];
      await prisma.personnel.update({
        where: { id: p.id },
        data: { unit_id: unitId }
      });
    }
  }

  // Move others to unit 1
  while (pIdx < allPersonnel.length) {
    const p = allPersonnel[pIdx++];
    await prisma.personnel.update({
      where: { id: p.id },
      data: { unit_id: 1 }
    });
  }

  console.log('Rebalance complete.');
  for (const uid of kruSubUnits) {
    const c = await prisma.personnel.count({ where: { unit_id: uid } });
    console.log(`Unit ${uid}: ${c}`);
  }
}

main().finally(() => prisma.$disconnect());

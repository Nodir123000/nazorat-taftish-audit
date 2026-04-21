import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    try {
        const inspectorId = null;
        const unitName = null;
        const page = 1;
        const limit = 50;

        const where: any = {};
        const [audits, total] = await Promise.all([
          prisma.financial_audits.findMany({
            where,
            include: { financial_violations: true },
            orderBy: { date: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
          }),
          prisma.financial_audits.count({ where }),
        ]);

        console.log("Audits fetched:", audits.length);
        
        const dtos = audits.map(item => ({
            id: item.id,
            unit: item.unit,
            // ... omitting the rest to just test map
            date: item.date?.toLocaleDateString('ru-RU') || "",
            balance: item.balance != null ? Number(item.balance).toFixed(2) : "0.00",
            financialAmount: (item.financial_violations || [])
              .reduce((acc, v) => acc + (v.amount != null ? parseFloat(v.amount.toString()) : 0), 0)
              .toFixed(2),
        }));
        
        console.log("DTOs mapped successfully.");
        
    } catch (e: any) {
        console.error("PRISMA ERROR:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();

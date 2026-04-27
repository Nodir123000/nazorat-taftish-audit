import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = "postgresql://postgres:Muslima-3001%23%23@localhost:5432/nazorat_taftish"
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function seed() {
    console.log("🌱 Посев структуры КРУ и армейских должностей...");

    // 1. KRU Departments (Units)
    const kruDepartments = [
        { id: 20801, name: { ru: "Организационно-методический отдел", uz: "Tashkiliy-metodik bo'lim", uzk: "Ташкилий-методик бўлим" }, code: "OMO" },
        { id: 20802, name: { ru: "Отдел внутреннего аудита", uz: "Ichki audit bo'limi", uzk: "Ички аудит бўлими" }, code: "OVA" },
        { id: 20803, name: { ru: "Отдел финансовой инспекции", uz: "Moliyaviy inspeksiya bo'limi", uzk: "Молиявий инспекция бўлими" }, code: "OFI" },
        { id: 20804, name: { ru: "Отдел инспекции материально-технического обеспечения", uz: "MTO inspeksiyasi bo'limi", uzk: "МТO инспекцияси бўлими" }, code: "OMTO" }
    ];

    for (const dept of kruDepartments) {
        await (prisma as any).ref_units.upsert({
            where: { unit_id: dept.id },
            update: { name: dept.name, unit_code: dept.code },
            create: { unit_id: dept.id, name: dept.name, unit_code: dept.code, is_active: true }
        });
    }
    console.log("✅ Подразделения КРУ созданы.");

    // 2. KRU Specific Positions
    const kruPositions = [
        { id: 5001, name: { ru: "Начальник Контрольно-ревизионного управления", uz: "Nazorat-taftish boshqarmasi boshlig'i", uzk: "Назорат-тафтиш бошқармаси бошлиғи" }, code: "CHIEF_KRU" },
        { id: 5002, name: { ru: "Заместитель начальника КРУ – начальник ОМО", uz: "NTB boshlig'i o'rinbosari – TMB boshlig'i", uzk: "НТБ бошлиғи ўринбосари – ТМБ бошлиғи" }, code: "DEP_CHIEF_KRU" },
        { id: 5003, name: { ru: "Главный специалист Организационно-методического отдела", uz: "TMB bosh mutaxassisi", uzk: "ТМБ бош мутахассиси" }, code: "MAIN_SPEC_OMO" },
        { id: 5004, name: { ru: "Главный специалист-аудитор ОМО КРУ", uz: "NTB TMB bosh mutaxassis-auditori", uzk: "НТБ ТМБ бош мутахассис-аудитори" }, code: "AUDITOR_OMO" },
        { id: 5005, name: { ru: "Начальник Отдела внутреннего аудита", uz: "Ichki audit bo'limi boshlig'i", uzk: "Ички аудит бўлими бошлиғи" }, code: "CHIEF_OVA" },
        { id: 5006, name: { ru: "Главный специалист-аудитор Отдела внутреннего аудита", uz: "Ichki audit bo'limi bosh mutaxassis-auditori", uzk: "Ички аудит бўлими бош мутахассис-аудитори" }, code: "AUDITOR_OVA" },
        { id: 5007, name: { ru: "Начальник Отдела финансовой инспекции", uz: "Moliyaviy inspeksiya bo'limi boshlig'i", uzk: "Молиявий инспекция бўлими бошлиғи" }, code: "CHIEF_OFI" },
        { id: 5008, name: { ru: "Заместитель начальника Отдела финансовой инспекции", uz: "Moliyaviy inspeksiya bo'limi boshlig'i o'rinbosari", uzk: "Молиявий инспекция бўлими бошлиғи ўринбосари" }, code: "DEP_CHIEF_OFI" },
        { id: 5009, name: { ru: "Старший инспектор-ревизор Отдела финансовой инспекции", uz: "Moliyaviy inspeksiya bo'limi katta inspektor-revizori", uzk: "Молиявий инспекция бўлими катта инспектор-ревизори" }, code: "SR_REVISOR_OFI" },
        { id: 5010, name: { ru: "Главный специалист-ревизор Отдела финансовой инспекции", uz: "Moliyaviy inspeksiya bo'limi bosh mutaxassis-revizori", uzk: "Молиявий инспекция бўлими бош мутахассис-ревизори" }, code: "MAIN_REVISOR_OFI" },
        { id: 5011, name: { ru: "Начальник Отдела инспекции МТО", uz: "MTO inspeksiyasi bo'limi boshlig'i", uzk: "МТO инспекцияси бўлими бошлиғи" }, code: "CHIEF_OMTO" },
        { id: 5012, name: { ru: "Заместитель начальника Отдела инспекции МТО", uz: "MTO inspeksiyasi bo'limi boshlig'i o'rinbosari", uzk: "МТO инспекцияси бўлими бошлиғи ўринбосари" }, code: "DEP_CHIEF_OMTO" },
        { id: 5013, name: { ru: "Старший инспектор-ревизор Отдела инспекции МТО", uz: "MTO inspeksiyasi bo'limi katta inspektor-revizori", uzk: "МТO инспекцияси бўлими катта инспектор-ревизори" }, code: "SR_REVISOR_OMTO" },
        { id: 5014, name: { ru: "Главный специалист-ревизор Отдела инспекции МТО", uz: "MTO inspeksiyasi bo'limi bosh mutaxassis-revizori", uzk: "МТO инспекцияси бўлими бош мутахассис-ревизори" }, code: "MAIN_REVISOR_OMTO" }
    ];

    for (const pos of kruPositions) {
        await (prisma as any).ref_positions.upsert({
            where: { id: pos.id },
            update: { name: pos.name, code: pos.code },
            create: { id: pos.id, name: pos.name, code: pos.code, status: 'active' }
        });
    }
    console.log("✅ Должности КРУ созданы.");

    // 3. Common "Army" Positions to make it feel full
    const armyPositions = [
        { id: 1001, name: { ru: "Командир части", uz: "Qism komandiri", uzk: "Қисм командири" }, code: "UNIT_COMMANDER" },
        { id: 1002, name: { ru: "Начальник штаба", uz: "Shtab boshlig'i", uzk: "Штаб бошлиғи" }, code: "CHIEF_OF_STAFF" },
        { id: 1003, name: { ru: "Заместитель командира по воспитательной работе", uz: "Komandir o'rinbosari (tarbiyaviy ishlar)", uzk: "Командир ўринбосари (тарбиявий ишлар)" }, code: "DEP_COMMANDER_EDU" },
        { id: 1004, name: { ru: "Начальник финансовой службы", uz: "Moliya xizmati boshlig'i", uzk: "Молия хизмати бошлиғи" }, code: "CHIEF_FINANCE" },
        { id: 1005, name: { ru: "Начальник службы МТО", uz: "MTO xizmati boshlig'i", uzk: "МТO хизмати бошлиғи" }, code: "CHIEF_MTO" },
        { id: 1006, name: { ru: "Командир роты", uz: "Rota komandiri", uzk: "Рота командири" }, code: "COMPANY_COMMANDER" },
        { id: 1007, name: { ru: "Командир взвода", uz: "Vzvod komandiri", uzk: "Взвод командири" }, code: "PLATOON_COMMANDER" },
        { id: 1008, name: { ru: "Старший офицер", uz: "Katta ofitser", uzk: "Катта офицер" }, code: "SR_OFFICER" },
        { id: 1009, name: { ru: "Офицер", uz: "Ofitser", uzk: "Офицер" }, code: "OFFICER" }
    ];

    for (const pos of armyPositions) {
        await (prisma as any).ref_positions.upsert({
            where: { id: pos.id },
            update: { name: pos.name, code: pos.code },
            create: { id: pos.id, name: pos.name, code: pos.code, status: 'active' }
        });
    }
    console.log("✅ Общие армейские должности созданы.");
}

seed()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); await pool.end(); });

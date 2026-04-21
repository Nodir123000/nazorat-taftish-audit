
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Начинаю наполнение базы данных персоналом...")

  // 1. Убеждаемся, что подразделение 208 существует
  const unit208 = await prisma.ref_units.upsert({
    where: { unit_id: 208 },
    update: {},
    create: {
      unit_id: 208,
      unit_code: "208",
      name: { ru: "Центральный аппарат КРУ", uz: "KRU Markaziy apparati", uzk: "КРУ Марказий аппарати" },
      is_active: true,
    },
  })
  console.log(`✅ Подразделение: ${unit208.unit_id}`)

  // 2. Убеждаемся, что базовые звания существуют
  const ranks = [
    { id: 1, level: 1, category: "Офицеры", name: { ru: "Генерал-майор", uz: "General-mayor", uzk: "Генерал-майор" } },
    { id: 10, level: 10, category: "Офицеры", name: { ru: "Полковник", uz: "Polkovnik", uzk: "Полковник" } },
    { id: 20, level: 20, category: "Офицеры", name: { ru: "Подполковник", uz: "Podpolkovnik", uzk: "Подполковник" } },
    { id: 30, level: 30, category: "Офицеры", name: { ru: "Майор", uz: "Mayor", uzk: "Майор" } },
    { id: 40, level: 40, category: "Офицеры", name: { ru: "Капитан", uz: "Kapitan", uzk: "Капитан" } },
  ]

  for (const r of ranks) {
    await prisma.ref_ranks.upsert({
      where: { rank_id: r.id },
      update: {},
      create: {
        rank_id: r.id,
        level: r.level,
        category: r.category,
        name: r.name as any,
      },
    })
  }
  console.log(`✅ Звания созданы/проверены`)

  // 3. Создаем физических лиц и записи персонала
  const mockPersonnel = [
    {
      pnr: "Щ-000001",
      pinfl: "12345678901234",
      lastName: "Иванов",
      firstName: "Иван",
      middleName: "Иванович",
      rankId: 1,
      positionId: 1301,
      unitId: 208,
    },
    {
      pnr: "Щ-000002",
      pinfl: "43210987654321",
      lastName: "Петров",
      firstName: "Петр",
      middleName: "Петрович",
      rankId: 10,
      positionId: 1302,
      unitId: 208,
    },
    {
      pnr: "Щ-000003",
      pinfl: "11122233344455",
      lastName: "Сидоров",
      firstName: "Алексей",
      middleName: "Владимирович",
      rankId: 20,
      positionId: 1309,
      unitId: 208,
    },
    {
      pnr: "Щ-000004",
      pinfl: "55544433322211",
      lastName: "Ахмедов",
      firstName: "Бахтиёр",
      middleName: "Саидович",
      rankId: 30,
      positionId: 1309,
      unitId: 208,
    },
    {
        pnr: "Щ-000005",
        pinfl: "99988877766655",
        lastName: "Назаров",
        firstName: "Нодир",
        middleName: "Хайдарович",
        rankId: 40,
        positionId: 1309,
        unitId: 208,
      }
  ]

  for (const p of mockPersonnel) {
    // Сначала физлицо
    const person = await prisma.ref_physical_persons.upsert({
      where: { pinfl: p.pinfl },
      update: {
        last_name: p.lastName,
        first_name: p.firstName,
        middle_name: p.middleName,
      },
      create: {
        pinfl: p.pinfl,
        last_name: p.lastName,
        first_name: p.firstName,
        middle_name: p.middleName,
      },
    })

    // Затем запись в personnel
    await prisma.personnel.upsert({
      where: { pnr: p.pnr },
      update: {
        physical_person_id: person.id,
        rank_id: p.rankId,
        unit_id: p.unitId,
        position_id: p.positionId,
        status: "active",
      },
      create: {
        pnr: p.pnr,
        physical_person_id: person.id,
        rank_id: p.rankId,
        unit_id: p.unitId,
        position_id: p.positionId,
        status: "active",
      },
    })
    console.log(`✅ Добавлен: ${p.lastName} ${p.firstName}`)
  }

  console.log("✨ Наполнение завершено успешно!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

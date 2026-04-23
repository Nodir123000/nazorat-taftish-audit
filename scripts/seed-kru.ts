import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

interface Position {
    title: string
    personName?: string
}

interface Department {
    name: string
    positions: Position[]
    subDepartments?: Department[]
}

const initialKruStructure: Department = {
    name: "Контрольно-ревизионное управление",
    positions: [
        { title: "Начальник управления", personName: "Иванов И. И." },
        { title: "Зам. нач. управления", personName: "Петров П. П." },
    ],
    subDepartments: [
        {
            name: "Организационно-методический отдел",
            positions: [
                { title: "Начальник отдела", personName: "Сидоров С. С." },
                { title: "Главный специалист", personName: "Смирнов А. А." },
            ]
        },
        {
            name: "Отдел внутреннего аудита",
            positions: [
                { title: "Начальник отдела", personName: "Кузнецов В. В." },
                { title: "Главный специалист-аудитор", personName: "Попов Д. Д." },
            ]
        },
        {
            name: "Отдел финансовой инспекции",
            positions: [
                { title: "Начальник отдела", personName: "Васильев Е. Е." },
                { title: "Старший инспектор-ревизор", personName: "Михайлов Ж. Ж." },
            ]
        },
        {
            name: "Отдел инспекции МТО",
            positions: [
                { title: "Начальник отдела", personName: "Соколов З. З." },
                { title: "Старший инспектор-ревизор", personName: "Лебедев И. И." },
            ]
        }
    ]
}

async function main() {
    const firstUnit = await prisma.ref_units.findFirst()
    let unitId = firstUnit?.id || 1
    if (!firstUnit) {
        const newUnit = await prisma.ref_units.create({
            data: {
                name: { ru: "КРУ МО РУ" } as any,
                is_active: true
            }
        })
        unitId = newUnit.id
    }

    console.log(`Seeding personnel for Unit ${unitId} based on KRU Structure...`)

    let maxPos = await prisma.ref_positions.aggregate({ _max: { id: true } })
    let nextPosId = (maxPos._max.id || 1000) + 1

    const genderMale = await prisma.ref_genders.findUnique({ where: { code: '801' } })
    const genderId = genderMale?.id || null

    const firstRank = await prisma.ref_ranks.findFirst()
    const rankId = firstRank?.id || null

    // We will extract all positions
    const allPositions: { title: string, personName: string, deptName: string }[] = []

    allPositions.push(...initialKruStructure.positions.map(p => ({
        title: p.title,
        personName: p.personName || "Ушбу Вакансия",
        deptName: initialKruStructure.name
    })))

    for (const sub of initialKruStructure.subDepartments || []) {
        allPositions.push(...sub.positions.map(p => ({
            title: p.title,
            personName: p.personName || "Ушбу Вакансия",
            deptName: sub.name
        })))
    }

    // Process each
    for (let i = 0; i < allPositions.length; i++) {
        const item = allPositions[i]
        const pinfl = `KRU208000${i}`

        let last_name = "Вакансия"
        let first_name = ""
        let middle_name = ""

        if (item.personName && item.personName !== "Ушбу Вакансия") {
            const parts = item.personName.replace(/\./g, '').split(' ')
            last_name = parts[0] || ""
            first_name = parts[1] || ""
            middle_name = parts[2] || ""
        }

        // Create or find physical person
        let person = await prisma.ref_physical_persons.findFirst({ where: { pinfl } })
        if (!person) {
            person = await prisma.ref_physical_persons.create({
                data: {
                    pinfl,
                    last_name,
                    first_name,
                    middle_name,
                    birth_date: new Date('1980-01-01'),
                    gender_id: genderId, // Male
                    passport_series: "AA",
                    passport_number: `123456${i}`
                }
            })
        }

        // Create or find position dictionary
        let posDict = await prisma.ref_positions.findFirst({
            where: {
                name: {
                    path: ['ru'],
                    equals: item.title
                }
            }
        })

        if (!posDict) {
            // Check broadly
            posDict = await prisma.ref_positions.create({
                data: {
                    id: nextPosId++,
                    code: `POS-KRU-${i}`,
                    name: { ru: item.title, uzLatn: item.title, uzCyrl: item.title } as any,
                    status: 'active'
                }
            })
        }

        // Create personnel record
        // First check if already exists for this person
        let personnelUser = await prisma.personnel.findFirst({
            where: {
                physical_person_id: person.id,
                unit_id: unitId
            }
        })

        if (!personnelUser) {
            await prisma.personnel.create({
                data: {
                    physical_person_id: person.id,
                    unit_id: unitId,
                    position_id: posDict.id,
                    rank_id: rankId, // Default rank
                    status: 'active',
                    service_start_date: new Date('2020-01-01'),
                    pnr: `KRU-PNR-${i}`
                }
            })
            console.log(`Created personnel: ${item.title} -> ${item.personName}`)
        } else {
            // Update position to correct one
            await prisma.personnel.update({
                where: { id: personnelUser.id },
                data: { position_id: posDict.id }
            })
            console.log(`Updated personnel: ${item.title} -> ${item.personName}`)
        }
    }

    console.log("Seeding complete!")
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })

import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
    console.log("Setting up mock units and plans...");

    try {
        // 1. Setup control authority
        let auth = await (prisma as any).ref_control_authorities.findFirst();
        if (!auth) {
            auth = await (prisma as any).ref_control_authorities.create({
                data: {
                    code: 'KRR',
                    name: { ru: 'Контрольно-ревизионное управление', uz: 'NTE' }
                }
            });
        }

        // 2. Setup inspection direction
        let dir = await (prisma as any).ref_control_directions.findFirst();
        if (!dir) {
            dir = await (prisma as any).ref_control_directions.create({
                data: {
                    code: 'FIN',
                    name: { ru: 'Финансово-хозяйственная деятельность', uz: 'FIN' },
                    status: 'active'
                }
            });
        }

        // 3. Setup inspection type
        let type = await (prisma as any).ref_inspection_types.findFirst();
        if (!type) {
            type = await (prisma as any).ref_inspection_types.create({
                data: {
                    code: '2301',
                    name: { ru: 'Комплексная проверка', uz: 'Kompleks' },
                    status: 'active'
                }
            });
        }

        // 4. Create a dummy region & area
        let area = await (prisma as any).ref_areas.findFirst();
        if (!area) {
            let region = await (prisma as any).ref_regions.findFirst();
            if (!region) {
                region = await (prisma as any).ref_regions.create({
                    data: {
                        code: '10', name: { ru: 'Ташкентская область' }, type: 'Region', status: 'active'
                    }
                });
            }
            area = await (prisma as any).ref_areas.create({
                data: {
                    region_id: region.id,
                    code: '1001',
                    name: { ru: 'Бостанлыкский район' },
                    type: 'District',
                    status: 'active'
                }
            });
        }

        // 5. Create a dummy district
        let district = await (prisma as any).ref_military_districts.findFirst();
        if (!district) {
            district = await (prisma as any).ref_military_districts.create({
                data: {
                    code: 'TVO',
                    name: { ru: 'Ташкентский военный округ' },
                    status: 'active'
                }
            });
        }

        // 6. Create dummy unit type & specialization
        let unitType = await (prisma as any).ref_unit_types.findFirst();
        if (!unitType) {
            unitType = await (prisma as any).ref_unit_types.create({
                data: { code: 'BRIGADE', name: { ru: 'Бригада' }, status: 'active' }
            });
        }

        let spec = await (prisma as any).ref_specializations.findFirst();
        if (!spec) {
            spec = await (prisma as any).ref_specializations.create({
                data: { code: 'INFANTRY', name: { ru: 'Пехота' }, status: 'active' }
            });
        }

        // 7. Create a dummy unit
        let unit = await (prisma as any).ref_units.findUnique({ where: { unit_code: '00001' } });
        if (!unit) {
            unit = await (prisma as any).ref_units.create({
                data: {
                    unit_code: '00001',
                    name: { ru: 'В/Ч 00001' },
                    area_id: area.id,
                    military_district_id: district.district_id,
                    unit_type_id: unitType.id,
                    specialization_id: spec.id,
                    is_active: true
                }
            });
        }

        // 8. Create a mock plan
        await (prisma as any).rev_plan_year.deleteMany({});
        await (prisma as any).rev_plan_year.create({
            data: {
                plan_number: '10/001',
                year: 2024,
                status: '101',
                period_covered_start: new Date('2023-01-01'),
                period_covered_end: new Date('2023-12-31'),
                objects_total: 5,
                objects_fs: 1,
                objects_os: 2,
                subordinate_units_on_allowance: [{ unitCode: "00006", unitName: "Десантно-штурмовая бригада (В/Ч 00006)" }],
                unit_id: unit.unit_id,
                control_authority_id: auth.authority_id,
                inspection_direction_id: dir.direction_id,
                inspection_type_id: type.id,
                start_date: new Date('2024-01-01'),
                end_date: new Date('2024-12-31'),
                period_type: 'annual'
            }
        });

        console.log("Mock data successfully created!");
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();

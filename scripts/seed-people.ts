
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 1. GENDER (RefGender)
const genders = [
    { code: '801', name: { ru: 'Мужской', uz: 'Erkak', uzk: 'Эркак' } },
    { code: '802', name: { ru: 'Женский', uz: 'Ayol', uzk: 'Аёл' } }
]

// 2. NATIONALITY (RefNationality)
const nationalities = [
    { code: '901', name: { ru: 'Узбек', uz: 'O\'zbek', uzk: 'Ўзбек' } },
    { code: '902', name: { ru: 'Русский', uz: 'Rus', uzk: 'Рус' } },
    { code: '903', name: { ru: 'Таджик', uz: 'Tojik', uzk: 'Тожик' } },
    { code: '904', name: { ru: 'Казах', uz: 'Qozoq', uzk: 'Қозоқ' } },
    { code: '905', name: { ru: 'Каракалпак', uz: 'Qoraqalpoq', uzk: 'Қорақалпоқ' } },
    { code: '906', name: { ru: 'Киргиз', uz: 'Qirg\'iz', uzk: 'Қирғиз' } },
    { code: '907', name: { ru: 'Татарин', uz: 'Tatar', uzk: 'Татар' } },
    { code: '908', name: { ru: 'Туркмен', uz: 'Turkman', uzk: 'Туркман' } },
    { code: '909', name: { ru: 'Кореец', uz: 'Koreys', uzk: 'Корейс' } }
]

// 3. PHYSICAL PERSONS (RefPhysicalPerson) - Samples
const people = [
    {
        pinfl: '32001850050012',
        lastName: 'Abdullayev',
        firstName: 'Botir',
        middleName: 'Karimovich',
        genderCode: '801',
        natCode: '901',
        birthDate: new Date('1985-01-20'),
        passportNumber: 'AB1234567',
        registrationAddress: 'г. Ташкент, Мирзо-Улугбекский р-н, ул. Мустакиллик, д. 5, кв. 22',
        actualAddress: 'г. Ташкент, Мирзо-Улугбекский р-н, ул. Мустакиллик, д. 5, кв. 22'
    },
    // ... (Keep existing static records for predictability)
    {
        pinfl: '31212890010077',
        lastName: 'Petrov',
        firstName: 'Dmitry',
        middleName: 'Ivanovich',
        genderCode: '801',
        natCode: '902',
        birthDate: new Date('1989-12-12'),
        passportNumber: 'GG5544331',
        registrationAddress: 'г. Ташкент, Яшнабадский р-н, ул. Паркентская, д. 10',
        actualAddress: 'г. Ташкент, Яшнабадский р-н, ул. Паркентская, д. 10'
    }
]

// Generators
const lastNamesUz = ['Alimov', 'Karimov', 'Rahmonov', 'Usmanov', 'Ismailov', 'Yusupov', 'Ahmedov', 'Saidov', 'Rakhimov', 'Tursunov', 'Umarov', 'Sultonov', 'Nurmatov', 'Azimov'];
const lastNamesRu = ['Ivanov', 'Petrov', 'Sidorov', 'Smirnov', 'Kuznetsov', 'Popov', 'Vasiliev', 'Sokolov', 'Mikhailov', 'Fedorov', 'Morozov', 'Volkov', 'Alekseev', 'Lebedev'];
const firstNamesMaleUz = ['Aziz', 'Bekzod', 'Jamshid', 'Dilshod', 'Sherzod', 'Otabek', 'Sardor', 'Ulugbek', 'Farrukh', 'Javlon', 'Sanjar', 'Bobur', 'Davron', 'Oybek'];
const firstNamesFemaleUz = ['Malika', 'Dildora', 'Nargiza', 'Shahnoza', 'Gulnoza', 'Feruza', 'Kamola', 'Laylo', 'Zarina', 'Umida', 'Barno', 'Dilnoza', 'Nigora', 'Lobobar'];
const firstNamesMaleRu = ['Aleksandr', 'Sergey', 'Dmitry', 'Andrey', 'Maksim', 'Vladimir', 'Ivan', 'Mikhail', 'Nikolay', 'Egor', 'Artem', 'Viktor', 'Igor', 'Oleg'];
const firstNamesFemaleRu = ['Elena', 'Olga', 'Natalia', 'Tatiana', 'Anna', 'Maria', 'Svetlana', 'Irina', 'Ekaterina', 'Marina', 'Yulia', 'Anastasia', 'Viktoria', 'Daria'];
const middleNamesUz = ['ovich', 'ovna'];
const middleNamesRu = ['ovich', 'ovna'];

// Address parts
const streetNames = ['Amir Temur', 'Navoi', 'Mustakillik', 'Buyuk Ipak Yuli', 'Bunyodkor', 'Fargona Yuli', 'Parkent', 'Nukus', 'Shota Rustaveli', 'Bobur'];

function randomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomPerson(i: number) {
    const isUzbek = Math.random() > 0.3; // 70% Uzbeks
    const isMale = Math.random() > 0.4; // 60% Males

    // 1. Gender & Nationality codes
    const genderCode = isMale ? '801' : '802';
    const natCode = isUzbek ? '901' : (Math.random() > 0.5 ? '902' : '903'); // Uz, Ru, or Tj

    // 2. Names
    let lastName, firstName, middleName;
    if (isUzbek) {
        lastName = lastNamesUz[randomInt(0, lastNamesUz.length - 1)] + (isMale ? '' : 'a');
        firstName = isMale ? firstNamesMaleUz[randomInt(0, firstNamesMaleUz.length - 1)] : firstNamesFemaleUz[randomInt(0, firstNamesFemaleUz.length - 1)];
        // Simple middle name generation
        const fatherName = firstNamesMaleUz[randomInt(0, firstNamesMaleUz.length - 1)];
        middleName = fatherName + (isMale ? 'evich' : 'evna');
    } else {
        lastName = lastNamesRu[randomInt(0, lastNamesRu.length - 1)] + (isMale ? '' : 'a');
        firstName = isMale ? firstNamesMaleRu[randomInt(0, firstNamesMaleRu.length - 1)] : firstNamesFemaleRu[randomInt(0, firstNamesFemaleRu.length - 1)];
        const fatherName = firstNamesMaleRu[randomInt(0, firstNamesMaleRu.length - 1)];
        middleName = fatherName + (isMale ? 'evich' : 'evna');
    }

    // 3. Dates & Docs
    const birthYear = randomInt(1970, 2003);
    const birthMonth = randomInt(0, 11);
    const birthDay = randomInt(1, 28);
    const birthDate = new Date(birthYear, birthMonth, birthDay);

    const pinflBase = isMale ? '3' : '4';
    const pinflDatePart = birthDay.toString().padStart(2, '0') + (birthMonth + 1).toString().padStart(2, '0') + (birthYear % 100).toString().padStart(2, '0');
    const pinfl = pinflBase + pinflDatePart + randomInt(10000, 99999) + randomInt(1, 9); // Simplified PINFL gen

    const passportSeries = isUzbek ? 'AA' : 'FA';
    const passportNumber = passportSeries + randomInt(1000000, 9999999).toString();

    // 4. Address (Simulated raw string to be parsed by logic)
    // We will trick the logic by providing a string that matches our matching heuristic
    // "г. Ташкент, Чиланзарский р-н, ..."
    const regions = ['г. Ташкент', 'Самаркандская область', 'Бухарская область', 'Ферганская область', 'Андижанская область'];
    const districts = {
        'г. Ташкент': ['Чиланзарский р-н', 'Юнусабадский р-н', 'Мирзо-Улугбекский р-н', 'Яшнабадский р-н'],
        'Самаркандская область': ['г. Самарканд', 'Ургутский район', 'Пастдаргомский район'],
        // ... simple fallback
    };

    const regionName = regions[randomInt(0, regions.length - 1)];
    const dists = (districts as any)[regionName] || ['г. Центр'];
    const distName = dists[randomInt(0, dists.length - 1)];

    const street = streetNames[randomInt(0, streetNames.length - 1)];
    const house = randomInt(1, 150);
    const kv = randomInt(1, 50);

    const addressStr = `${regionName}, ${distName}, ул. ${street}, д. ${house}, кв. ${kv}`;

    return {
        pinfl,
        lastName,
        firstName,
        middleName,
        genderCode,
        natCode,
        birthDate,
        passportNumber,
        registrationAddress: addressStr,
        actualAddress: addressStr
    };
}

// Generate 900 more
for (let k = 0; k < 900; k++) {
    people.push(generateRandomPerson(k));
}

async function main() {
    console.log('Seeding Gender, Nationality and Physical Persons...')

    // 1. Seed Gender
    for (const g of genders) {
        const existing = await (prisma as any).ref_genders.findUnique({ where: { code: g.code } })
        if (existing) {
            await (prisma as any).ref_genders.update({ where: { code: g.code }, data: { name: g.name as any, status: 'active' } })
        } else {
            await (prisma as any).ref_genders.create({ data: { code: g.code, name: g.name as any, status: 'active' } })
        }
    }
    console.log('Gender seeded.')

    // 2. Seed Nationality
    for (const n of nationalities) {
        const existing = await (prisma as any).ref_nationalities.findUnique({ where: { code: n.code } })
        if (existing) {
            await (prisma as any).ref_nationalities.update({ where: { code: n.code }, data: { name: n.name as any, status: 'active' } })
        } else {
            await (prisma as any).ref_nationalities.create({ data: { code: n.code, name: n.name as any, status: 'active' } })
        }
    }
    console.log('Nationality seeded.')

    // 3. Seed Physical Persons
    // Pre-fetch relation maps
    const genderMap = new Map();
    const allGenders = await (prisma as any).ref_genders.findMany();
    allGenders.forEach((g: any) => genderMap.set(g.code, g.id));

    const natMap = new Map();
    const allNats = await (prisma as any).ref_nationalities.findMany();
    allNats.forEach((n: any) => natMap.set(n.code, n.id));

    // Fetch regions and areas for address linking
    const regions = await (prisma as any).ref_regions.findMany();
    const areas = await (prisma as any).ref_areas.findMany();

    for (const p of people) {
        // Find best match for region/districts from address string
        // Sample: "г. Ташкент, Мирзо-Улугбекский р-н"
        let regionId: number | undefined = undefined;
        let districtId: number | undefined = undefined;

        const addressLower = p.registrationAddress.toLowerCase();

        // Helper to normalize strings (remove prefixes/suffixes)
        const normalize = (s: string) => s.replace(/(город|г\.|область|обл\.|viloyati|respublikasi|tuman|tumani|р-н)/g, '').trim();

        const regionMatch = regions.find((r: any) => {
            const names = r.name as any;
            const ruNorm = normalize(names.ru.toLowerCase());
            const addrNorm = normalize(addressLower.split(',')[0] || "");
            return (ruNorm && addrNorm.includes(ruNorm)) || (ruNorm && ruNorm.includes(addrNorm));
        });

        if (regionMatch) {
            regionId = regionMatch.id;

            const districtPart = addressLower.split(',')[1] || "";
            const distNormAddr = normalize(districtPart);

            if (distNormAddr.length > 2) {
                const districtMatch = areas.find((a: any) => {
                    const names = a.name as any;
                    const ruNorm = normalize(names.ru.toLowerCase());
                    if (a.region_id !== regionId) return false;
                    return (ruNorm && distNormAddr.includes(ruNorm)) || (ruNorm && ruNorm.includes(distNormAddr));
                });
                if (districtMatch) districtId = districtMatch.id;
            }
        }

        const existing = await (prisma as any).ref_physical_persons.findUnique({ where: { pinfl: p.pinfl } })

        const genderId = genderMap.get(p.genderCode);
        const nationalityId = natMap.get(p.natCode);

        const dbData = {
            pinfl: p.pinfl,
            last_name: p.lastName,
            first_name: p.firstName,
            middle_name: p.middleName,
            birth_date: p.birthDate,
            passport_series: p.passportNumber.substring(0, 2),
            passport_number: p.passportNumber.substring(2),

            // Relation IDs
            gender_id: genderId,
            nationality_id: nationalityId,
            region_id: regionId,
            district_id: districtId,

            // Single clean address field (parts after region/district)
            address: p.registrationAddress.split(',').slice(2).join(', ').trim(),

            email: `${p.lastName.toLowerCase()}.${p.firstName.toLowerCase()}@example.com`,
            contact_phone: '+99890' + Math.floor(1000000 + Math.random() * 9000000)
        }

        if (existing) {
            await (prisma as any).ref_physical_persons.update({
                where: { pinfl: p.pinfl },
                data: dbData
            })
        } else {
            await (prisma as any).ref_physical_persons.create({
                data: dbData
            })
        }
    }
    console.log(`Physical Persons seeded: ${people.length} entries.`)

}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })

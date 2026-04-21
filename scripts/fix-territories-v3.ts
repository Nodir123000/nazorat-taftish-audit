import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function translateLatnToCyrl(str: string): string {
    const map: Record<string, string> = {
        "o'": "ў", "O'": "Ў",
        "g'": "ғ", "G'": "Ғ",
        "sh": "ш", "Sh": "Ш", "SH": "Ш",
        "ch": "ч", "Ch": "Ч", "CH": "Ч",
        "q": "қ", "Q": "Қ",
        "yu": "ю", "Yu": "Ю",
        "ya": "я", "Ya": "Я",
        "ye": "е", "Ye": "Е",
        "yo": "ё", "Yo": "Ё",
        "A": "А", "a": "а",
        "B": "Б", "b": "б",
        "V": "В", "v": "в",
        "G": "Г", "g": "г",
        "D": "Д", "d": "д",
        "E": "Е", "e": "е",
        "J": "Ж", "j": "ж",
        "Z": "З", "z": "з",
        "I": "И", "i": "и",
        "Y": "Й", "y": "й",
        "K": "К", "k": "к",
        "L": "Л", "l": "л",
        "M": "М", "m": "м",
        "N": "Н", "n": "н",
        "O": "О", "o": "о",
        "P": "П", "p": "п",
        "R": "Р", "r": "р",
        "S": "С", "s": "с",
        "T": "Т", "t": "т",
        "U": "У", "u": "у",
        "F": "Ф", "f": "ф",
        "X": "Х", "x": "х",
        "Ts": "Ц", "ts": "ц",
        "H": "Ҳ", "h": "ҳ",
    };
    
    let res = str;
    // Replace double character patterns first
    const pairs = ["O'", "o'", "G'", "g'", "SH", "sh", "Sh", "CH", "ch", "Ch", "YU", "yu", "Yu", "YA", "ya", "Ya", "YE", "ye", "Ye", "YO", "yo", "Yo", "TS", "ts", "Ts"];
    for (let p of pairs) {
        if (map[p]) res = res.split(p).join(map[p]);
    }
    // Single characters
    for (let s in map) {
        if (s.length === 1) res = res.split(s).join(map[s]);
    }
    return res;
}

// Special dictionary for common Russian district names
const ruMap: Record<string, string> = {
    "Boston": "Бостон", // Boston vs Bo'z. Bo'z is old/current common name.
    "Oltinkol": "Алтынкуль",
    "Ulugnor": "Улугнорский",
    "Jalaquduq": "Джалакудукский",
    "Paxtaobod": "Пахтаабадский",
    "Buloqboshi": "Булакбаши",
    "Qorgontepa": "Кургантепа",
    "Xodjaobod": "Ходжаабад",
    "Baliqchi": "Балыкчи",
    "Asaka": "Асака",
    "Shahrixon": "Шахрихан",
    "Marhamat": "Мархамат",
    // etc... 
}

async function main() {
    console.log('🚀 Fixing Area (District) names...')
    const areas = await prisma.ref_areas.findMany()

    for (const area of areas) {
        const nameObj = area.name as any || {}
        let uz = nameObj.uz || ""
        let ru = nameObj.ru || ""
        let uzk = nameObj.uzk || ""

        // Strip current labels
        const base = uz.replace(/\stumani/gi, '').trim()
        const baseCyrl = translateLatnToCyrl(base)

        // Fix RU: try dictionary or translit
        let ruBase = ru.replace(/\sрайон/gi, '').trim()
        if (/^[A-Za-z\s]+$/.test(ruBase)) {
            // If RU is still Latin, use translit
            ruBase = translateLatnToCyrl(ruBase)
        }
        
        // Finalize
        const cleanUz = `${base} tumani`
        const cleanUzk = `${baseCyrl} тумани`
        const cleanRu = `${ruBase} район`

        await prisma.ref_areas.update({
            where: { id: area.id },
            data: {
                name: {
                    ru: cleanRu,
                    uz: cleanUz,
                    uzk: cleanUzk
                }
            }
        })
    }
    console.log('✅ Areas updated.')
}

main().finally(() => prisma.$disconnect())

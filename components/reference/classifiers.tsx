"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Tag, BookOpen, Layers, Hash, Globe2, MoreHorizontal, Settings, FileText, LayoutGrid, Database } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useI18n } from "@/lib/i18n/context"
import { cn } from "@/lib/utils"

export const classifiers = [
  {
    id: 1,
    name: "Статусы проверок",
    name_uz_cyrl: "Текширув ҳолатлари",
    name_uz_latn: "Tekshiruv holatlari",
    description: "Возможные статусы проведения проверок",
    description_uz_cyrl: "Текширув ўтказишнинг мумкин бўлган ҳолатлари",
    description_uz_latn: "Tekshiruv o'tkazishning mumkin bo'lgan holatlari",
    values: [
      { id: 101, name: "Запланирована", name_uz_cyrl: "Режалаштирилган", name_uz_latn: "Rejalashtirilgan" },
      { id: 102, name: "В работе", name_uz_cyrl: "Жараёнда", name_uz_latn: "Jarayonda" },
      { id: 103, name: "Приостановлена", name_uz_cyrl: "Тўхтатилган", name_uz_latn: "To'xtatilgan" },
      { id: 104, name: "Завершена", name_uz_cyrl: "Якунланган", name_uz_latn: "Yakunlangan" },
      { id: 105, name: "Отменена", name_uz_cyrl: "Бекор қилинган", name_uz_latn: "Bekor qilingan" },
      { id: 106, name: "Черновик", name_uz_cyrl: "Қоралама", name_uz_latn: "Qoralama" },
    ],
  },
  {
    id: 2,
    name: "Типы проверок",
    name_uz_cyrl: "Текширув турлари",
    name_uz_latn: "Tekshiruv turlari",
    description: "Классификация проверок по типам",
    description_uz_cyrl: "Текширувларнинг турлари бўйича таснифи",
    description_uz_latn: "Tekshiruvlarning turlari bo'yicha tasnifi",
    values: [
      { id: 201, name: "Финансовая", name_uz_cyrl: "Молиявий", name_uz_latn: "Moliyaviy" },
      { id: 202, name: "Хозяйственная", name_uz_cyrl: "Хўжалик", name_uz_latn: "Xo'jalik" },
      { id: 203, name: "Документальная", name_uz_cyrl: "Ҳужжатли", name_uz_latn: "Hujjatli" },
      { id: 204, name: "Комплексная", name_uz_cyrl: "Комплекс", name_uz_latn: "Kompleks" },
      { id: 205, name: "Тематическая", name_uz_cyrl: "Мавзуий", name_uz_latn: "Mavzuiy" },
      { id: 206, name: "Внеплановая", name_uz_cyrl: "Режадан ташқари", name_uz_latn: "Rejadan tashqari" },
    ],
  },
  {
    id: 3,
    name: "Степени серьезности",
    name_uz_cyrl: "Жиддийлик даражалари",
    name_uz_latn: "Jiddiylik darajalari",
    description: "Классификация нарушений по степени серьезности",
    description_uz_cyrl: "Қоидабузарликларнинг жиддийлик даражаси бўйича таснифи",
    description_uz_latn: "Qoidabuzarliklarning jiddiylik darajasi bo'yicha tasnifi",
    values: [
      { id: 301, name: "Низкая", name_uz_cyrl: "Паст", name_uz_latn: "Past" },
      { id: 302, name: "Средняя", name_uz_cyrl: "Ўрта", name_uz_latn: "O'rta" },
      { id: 303, name: "Высокая", name_uz_cyrl: "Юқори", name_uz_latn: "Yuqori" },
      { id: 304, name: "Критическая", name_uz_cyrl: "Критик", name_uz_latn: "Kritik" },
    ],
  },
  {
    id: 4,
    name: "Статусы нарушений",
    name_uz_cyrl: "Қоидабузарлик ҳолатлари",
    name_uz_latn: "Qoidabuzarlik holatlari",
    description: "Возможные статусы выявленных нарушений",
    description_uz_cyrl: "Аниқланган қоидабузарликларнинг мумкин бўлган ҳолатлари",
    description_uz_latn: "Aniqlangan qoidabuzarliklarning mumkin bo'lgan holatlari",
    values: [
      { id: 401, name: "Выявлено", name_uz_cyrl: "Аниқланган", name_uz_latn: "Aniqlangan" },
      { id: 402, name: "На рассмотрении", name_uz_cyrl: "Кўриб чиқилмоқда", name_uz_latn: "Ko'rib chiqilmoqda" },
      { id: 403, name: "Подтверждено", name_uz_cyrl: "Тасдиқланган", name_uz_latn: "Tasdiqlangan" },
      { id: 404, name: "Устранено", name_uz_cyrl: "Бартараф этилган", name_uz_latn: "Bartaraf etilgan" },
      { id: 405, name: "Не подтверждено", name_uz_cyrl: "Тасдиқланмаган", name_uz_latn: "Tasdiqlanmagan" },
    ],
  },
  {
    id: 5,
    name: "Статусы решений",
    name_uz_cyrl: "Қарор ҳолатлари",
    name_uz_latn: "Qaror holatlari",
    description: "Статусы исполнения принятых решений",
    description_uz_cyrl: "Қабул қилинган қарорларнинг ижро ҳолатлари",
    description_uz_latn: "Qabul qilingan qarorlarning ijro holatlari",
    values: [
      { id: 501, name: "Принято", name_uz_cyrl: "Қабул қилинган", name_uz_latn: "Qabul qilingan" },
      { id: 502, name: "В работе", name_uz_cyrl: "Жараёнда", name_uz_latn: "Jarayonda" },
      { id: 503, name: "Частично исполнено", name_uz_cyrl: "Қисман бажарилган", name_uz_latn: "Qisman bajarilgan" },
      { id: 504, name: "Исполнено", name_uz_cyrl: "Бажарилган", name_uz_latn: "Bajarilgan" },
      { id: 505, name: "Просрочено", name_uz_cyrl: "Муддати ўтган", name_uz_latn: "Muddati o'tgan" },
    ],
  },
  {
    id: 6,
    name: "Воинские звания",
    name_uz_cyrl: "Ҳарбий унвонлар",
    name_uz_latn: "Harbiy unvonlar",
    description: "Классификатор воинских званий с привязкой к составам",
    description_uz_cyrl: "Таркибларга боғланган ҳолда ҳарбий унвонлар таснифи",
    description_uz_latn: "Tarkiblarga bog'langan holda harbiy unvonlar tasnifi",
    values: [
      // Рядовой состав (compositionId: 1101)
      { id: 601, name: "Рядовой", name_uz_cyrl: "Оддий аскар", name_uz_latn: "Oddiy askar", compositionId: 1101, type: "army" },
      { id: 602, name: "Матрос", name_uz_cyrl: "Матрос", name_uz_latn: "Matros", compositionId: 1101, type: "navy" },

      // Сержантский состав (compositionId: 1102)
      { id: 603, name: "Младший сержант", name_uz_cyrl: "Кичик сержант", name_uz_latn: "Kichik serjant", compositionId: 1102, type: "army" },
      { id: 604, name: "Сержант III степени", name_uz_cyrl: "III даражали сержант", name_uz_latn: "III darajali serjant", compositionId: 1102, type: "army" },
      { id: 605, name: "Сержант II степени", name_uz_cyrl: "II даражали сержант", name_uz_latn: "II darajali serjant", compositionId: 1102, type: "army" },
      { id: 606, name: "Сержант I степени", name_uz_cyrl: "I даражали сержант", name_uz_latn: "I darajali serjant", compositionId: 1102, type: "army" },
      { id: 607, name: "Старший сержант", name_uz_cyrl: "Катта сержант", name_uz_latn: "Katta serjant", compositionId: 1102, type: "army" },
      { id: 608, name: "Старшина", name_uz_cyrl: "Старшина", name_uz_latn: "Starshina", compositionId: 1102, type: "army" },
      { id: 609, name: "Старшина III статьи", name_uz_cyrl: "III тоифали старшина", name_uz_latn: "III toifali starshina", compositionId: 1102, type: "navy" },
      { id: 610, name: "Старшина II статьи", name_uz_cyrl: "II тоифали старшина", name_uz_latn: "II toifali starshina", compositionId: 1102, type: "navy" },
      { id: 611, name: "Старшина I статьи", name_uz_cyrl: "I тоифали старшина", name_uz_latn: "I toifali starshina", compositionId: 1102, type: "navy" },
      { id: 612, name: "Главный старшина", name_uz_cyrl: "Бош старшина", name_uz_latn: "Bosh starshina", compositionId: 1102, type: "navy" },

      // Младший офицерский состав (compositionId: 1103)
      { id: 613, name: "Лейтенант", name_uz_cyrl: "Лейтенант", name_uz_latn: "Leytenant", compositionId: 1103, type: "army" },
      { id: 614, name: "Старший лейтенант", name_uz_cyrl: "Катта лейтенант", name_uz_latn: "Katta leytenant", compositionId: 1103, type: "army" },
      { id: 615, name: "Капитан", name_uz_cyrl: "Капитан", name_uz_latn: "Kapitan", compositionId: 1103, type: "army" },
      { id: 616, name: "Лейтенант", name_uz_cyrl: "Лейтенант", name_uz_latn: "Leytenant", compositionId: 1103, type: "navy" },
      { id: 617, name: "Старший лейтенант", name_uz_cyrl: "Катта лейтенант", name_uz_latn: "Katta leytenant", compositionId: 1103, type: "navy" },
      { id: 618, name: "Капитан-лейтенант", name_uz_cyrl: "Капитан-лейтенант", name_uz_latn: "Kapitan-leytenant", compositionId: 1103, type: "navy" },

      // Старший офицерский состав (compositionId: 1104)
      { id: 619, name: "Майор", name_uz_cyrl: "Майор", name_uz_latn: "Mayor", compositionId: 1104, type: "army" },
      { id: 620, name: "Подполковник", name_uz_cyrl: "Подполковник", name_uz_latn: "Podpolkovnik", compositionId: 1104, type: "army" },
      { id: 621, name: "Полковник", name_uz_cyrl: "Полковник", name_uz_latn: "Polkovnik", compositionId: 1104, type: "army" },
      { id: 622, name: "Капитан III ранга", name_uz_cyrl: "III даражали капитан", name_uz_latn: "III darajali kapitan", compositionId: 1104, type: "navy" },
      { id: 623, name: "Капитан II ранга", name_uz_cyrl: "II даражали капитан", name_uz_latn: "II darajali kapitan", compositionId: 1104, type: "navy" },
      { id: 624, name: "Капитан I ранга", name_uz_cyrl: "I даражали капитан", name_uz_latn: "I darajali kapitan", compositionId: 1104, type: "navy" },

      // Генеральский состав (compositionId: 1105)
      { id: 625, name: "Генерал-майор", name_uz_cyrl: "Генерал-майор", name_uz_latn: "General-mayor", compositionId: 1105, type: "army" },
      { id: 626, name: "Генерал-лейтенант", name_uz_cyrl: "Генерал-лейтенант", name_uz_latn: "General-leytenant", compositionId: 1105, type: "army" },
      { id: 627, name: "Генерал-полковник", name_uz_cyrl: "Генерал-полковник", name_uz_latn: "General-polkovnik", compositionId: 1105, type: "army" },
      { id: 628, name: "Генерал армии", name_uz_cyrl: "Армия генерали", name_uz_latn: "Armiya generali", compositionId: 1105, type: "army" },
    ],
  },
  {
    id: 7,
    name: "Типы воинских частей",
    name_uz_cyrl: "Ҳарбий қисм турлари",
    name_uz_latn: "Harbiy qism turlari",
    description: "Справочник организационных структур",
    description_uz_cyrl: "Ташкилий тузилмалар маълумотномаси",
    description_uz_latn: "Tashkiliy tuzilmalar ma'lumotnomasi",
    values: [
      { id: 701, name: "Бригада", name_uz_cyrl: "Бригада", name_uz_latn: "Brigada" },
      { id: 702, name: "Отдельный батальон", name_uz_cyrl: "Алоҳида батальон", name_uz_latn: "Alohida batalyon" },
      { id: 703, name: "Отдельный отряд", name_uz_cyrl: "Алоҳида отряд", name_uz_latn: "Alohida otryad" },
      { id: 704, name: "Учебный центр", name_uz_cyrl: "Ўқув маркази", name_uz_latn: "O'quv markazi" },
      { id: 705, name: "ВВОУ (Академия)", name_uz_cyrl: "ОҲҲЮ (Академия)", name_uz_latn: "O'HHYu (Akademiya)" },
      { id: 706, name: "Управление", name_uz_cyrl: "Бошқарма", name_uz_latn: "Boshqarma" },
    ],
  },
  {
    id: 8,
    name: "Пол",
    name_uz_cyrl: "Жинси",
    name_uz_latn: "Jinsi",
    description: "Классификатор пола",
    description_uz_cyrl: "Жинсни таснифловчи маълумотнома",
    description_uz_latn: "Jinsni tasniflovchi ma'lumotnoma",
    values: [
      { id: 801, name: "Мужской", name_uz_cyrl: "Эркак", name_uz_latn: "Erkak" },
      { id: 802, name: "Женский", name_uz_cyrl: "Аёл", name_uz_latn: "Ayol" },
    ],
  },
  {
    id: 9,
    name: "Национальность",
    name_uz_cyrl: "Миллати",
    name_uz_latn: "Millati",
    description: "Справочник национальностей",
    description_uz_cyrl: "Миллатлар маълумотномаси",
    description_uz_latn: "Millatlar ma'lumotnomasi",
    values: [
      { id: 901, name: "Узбек", name_uz_cyrl: "Ўзбек", name_uz_latn: "O'zbek" },
      { id: 902, name: "Таджик", name_uz_cyrl: "Тожик", name_uz_latn: "Tojik" },
      { id: 903, name: "Казах", name_uz_cyrl: "Қозоқ", name_uz_latn: "Qozoq" },
      { id: 904, name: "Каракалпак", name_uz_cyrl: "Қорақалпоқ", name_uz_latn: "Qoraqalpoq" },
      { id: 905, name: "Русский", name_uz_cyrl: "Рус", name_uz_latn: "Rus" },
      { id: 906, name: "Киргиз", name_uz_cyrl: "Қирғиз", name_uz_latn: "Qirg'iz" },
      { id: 907, name: "Туркмен", name_uz_cyrl: "Туркман", name_uz_latn: "Turkman" },
      { id: 908, name: "Татарин", name_uz_cyrl: "Татар", name_uz_latn: "Tatar" },
      { id: 909, name: "Кореец", name_uz_cyrl: "Корейс", name_uz_latn: "Koreys" },
      { id: 1100, name: "Другая", name_uz_cyrl: "Бошқа", name_uz_latn: "Boshqa" },
    ],
  },
  {
    id: 11,
    name: "Состав военнослужащих",
    name_uz_cyrl: "Ҳарбий хизматчилар таркиби",
    name_uz_latn: "Harbiy xizmatchilar tarkibi",
    description: "Классификатор составов военнослужащих",
    description_uz_cyrl: "Ҳарбий хизматчилар таркиблари классификатори",
    description_uz_latn: "Harbiy xizmatchilar tarkiblari klassifikatori",
    values: [
      { id: 1101, name: "Рядовой состав", name_uz_cyrl: "Оддий аскарлар таркиби", name_uz_latn: "Oddiy askarlar tarkibi" },
      { id: 1102, name: "Сержантский состав", name_uz_cyrl: "Сержантлар таркиби", name_uz_latn: "Serjantlar tarkibi" },
      { id: 1103, name: "Младший офицерский состав", name_uz_cyrl: "Кичик офицерлар таркиби", name_uz_latn: "Kichik ofitserlar tarkibi" },
      { id: 1104, name: "Старший офицерский состав", name_uz_cyrl: "Катта офицерлар таркиби", name_uz_latn: "Katta ofitserlar tarkibi" },
      { id: 1105, name: "Генеральский состав", name_uz_cyrl: "Генераллар таркиби", name_uz_latn: "Generallar tarkibi" },
    ],
  },
  {
    id: 10,
    name: "Специализации",
    name_uz_cyrl: "Ихтисосликлар",
    name_uz_latn: "Ixtisosliklar",
    description: "Справочник специализаций подразделений",
    description_uz_cyrl: "Бўлинмалар ихтисослиги маълумотномаси",
    description_uz_latn: "Bo'linmalar ixtisosligi ma'lumotnomasi",
    values: [
      { id: 1001, name: "Боевое применение", name_uz_cyrl: "Жанговар қўллаш", name_uz_latn: "Jangovar qo'llash" },
      { id: 1002, name: "Тыловое обеспечение", name_uz_cyrl: "Орт таъминоти", name_uz_latn: "Ort ta'minoti" },
      { id: 1003, name: "Боевое обеспечение", name_uz_cyrl: "Жанговар таъминот", name_uz_latn: "Jangovar ta'minot" },
      { id: 1004, name: "Техническое обеспечение", name_uz_cyrl: "Техник таъминот", name_uz_latn: "Texnik ta'minot" },
    ],
  },
  {
    id: 12,
    name: "Наименования подразделений",
    name_uz_cyrl: "Бўлинма номлари",
    name_uz_latn: "Bo'linma nomlari",
    description: "Справочник типовых наименований подразделений (батальон, рота, взвод)",
    description_uz_cyrl: "Бўлинмаларнинг типик номлари (батальон, рота, взвод)",
    description_uz_latn: "Bo'linmalarning tipik nomlari (batalyon, rota, vzvod)",
    values: [
      { id: 1201, name: "Управление", name_uz_cyrl: "Бошқарма", name_uz_latn: "Boshqarma" },
      { id: 1202, name: "Штаб", name_uz_cyrl: "Штаб", name_uz_latn: "Shtab" },
      { id: 1203, name: "Батальон", name_uz_cyrl: "Батальон", name_uz_latn: "Batalyon" },
      { id: 1204, name: "Дивизион", name_uz_cyrl: "Дивизион", name_uz_latn: "Divizion" },
      { id: 1205, name: "Рота", name_uz_cyrl: "Рота", name_uz_latn: "Rota" },
      { id: 1206, name: "Батарея", name_uz_cyrl: "Батарея", name_uz_latn: "Batareya" },
      { id: 1207, name: "Взвод", name_uz_cyrl: "Взвод", name_uz_latn: "Vzvod" },
      { id: 1208, name: "Отделение", name_uz_cyrl: "Бўлинма", name_uz_latn: "Bo'linma" },
    ],
  },
  {
    id: 13,
    name: "Воинские должности",
    name_uz_cyrl: "Ҳарбий лавозимлар",
    name_uz_latn: "Harbiy lavozimlar",
    description: "Справочник типовых воинских должностей",
    description_uz_cyrl: "Типик ҳарбий лавозимлар маълумотномаси",
    description_uz_latn: "Tipik harbiy lavozimlar ma'lumotnomasi",
    values: [], // MOVED TO DATABASE: ref_positions
    isDynamic: true
  },
  {
    id: 14,
    name: "ВУС",
    name_uz_cyrl: "ҲҲМ (ВУС)",
    name_uz_latn: "HHM (VUS)",
    description: "Военно-учетные специальности",
    description_uz_cyrl: "Ҳарбий ҳисоб мутахассисликлари",
    description_uz_latn: "Harbiy hisob mutaxassisliklari",
    values: [], // MOVED TO DATABASE: ref_vus_list
    isDynamic: true
  },
  {
    id: 15,
    name: "Источники финансирования",
    name_uz_cyrl: "Молиялаштириш манбалари",
    name_uz_latn: "Moliyalashtirish manbalari",
    description: "Классификатор источников бюджетного финансирования",
    description_uz_cyrl: "Бюджет маблағлари манбалари таснифлагичи",
    description_uz_latn: "Byudjet mablag'lari manbalari tasniflagichi",
    values: [
      { id: 1501, name: "Республиканский бюджет", name_uz_cyrl: "Республика бюджети", name_uz_latn: "Respublika byudjeti" },
      { id: 1502, name: "Внебюджетные средства", name_uz_cyrl: "Бюджетдан ташқари маблағлар", name_uz_latn: "Byudjetdan tashqari mablag'lar" },
      { id: 1503, name: "Специальные фонды", name_uz_cyrl: "Махсус жамғармалар", name_uz_latn: "Maxsus jamg'armalar" },
    ],
  },
  {
    id: 16,
    name: "Виды ТМЦ",
    name_uz_cyrl: "ТМЦ турлари",
    name_uz_latn: "TMC turlari",
    description: "Классификатор товарно-материальных ценностей",
    description_uz_cyrl: "Товар-моддий бойликлар таснифлагичи",
    description_uz_latn: "Tovar-moddiy boyliklar tasniflagichi",
    values: [
      { id: 1601, name: "Вооружение и техника", name_uz_cyrl: "Қурол-ярағ ва техника", name_uz_latn: "Qurol-yarag' va texnika" },
      { id: 1602, name: "ГСМ", name_uz_cyrl: "Ёнилғи-мойлаш материаллари", name_uz_latn: "Yonilg'i-moylash materiallari" },
      { id: 1603, name: "Продовольствие", name_uz_cyrl: "Озиқ-овқат таъминоти", name_uz_latn: "Oziq-ovqat ta'minoti" },
      { id: 1604, name: "Вещевое имущество", name_uz_cyrl: "Кийим-кечак мулки", name_uz_latn: "Kiyim-kechak mulki" },
    ],
  },
  {
    id: 17,
    name: "Причины нарушений",
    name_uz_cyrl: "Қонунбузарлик сабаблари",
    name_uz_latn: "Qonunbuzarlik sabablari",
    description: "Типовой классификатор причин финансовых нарушений",
    description_uz_cyrl: "Молиявий қонунбузарликлар сабаблари таснифлагичи",
    description_uz_latn: "Moliyaviy qonunbuzarliklar sabablari tasniflagichi",
    values: [
      { id: 1701, name: "Незнание НПА", name_uz_cyrl: "Меъёрий ҳужжатларни билмаслик", name_uz_latn: "Me'yoriy hujjatlarni bilmaslik" },
      { id: 1702, name: "Слабый контроль", name_uz_cyrl: "Кучсиз назорат", name_uz_latn: "Kuchsiz nazorat" },
      { id: 1703, name: "Халатность", name_uz_cyrl: "Лоқайдлик", name_uz_latn: "Loqaydlik" },
      { id: 1704, name: "Корыстный умысел", name_uz_cyrl: "Ғаразли ният", name_uz_latn: "G'arazli niyat" },
    ],
  },
  {
    id: 18,
    name: "Образование",
    name_uz_cyrl: "Маълумоти",
    name_uz_latn: "Ma'lumoti",
    description: "Классификатор уровней образования",
    description_uz_cyrl: "Маълумот даражалари таснифлагичи",
    description_uz_latn: "Ma'lumot darajalari tasniflagichi",
    values: [
      { id: 1801, name: "Среднее общее", name_uz_cyrl: "Умумий ўрта", name_uz_latn: "Umumiy o'rta" },
      { id: 1802, name: "Среднее специальное", name_uz_cyrl: "Ўрта махсус", name_uz_latn: "O'rta maxsus" },
      { id: 1803, name: "Высшее гражданское", name_uz_cyrl: "Олий фуқаролик", name_uz_latn: "Oliy fuqarolik" },
      { id: 1804, name: "Высшее военное", name_uz_cyrl: "Олий ҳарбий", name_uz_latn: "Oliy harbiy" },
      { id: 1805, name: "Академическое (послевузовское)", name_uz_cyrl: "Академик (Олийгоҳдан кейинги)", name_uz_latn: "Akademik (Oliygohdan keyingi)" },
    ],
  },
  {
    id: 19,
    name: "Допуск / Секретность",
    name_uz_cyrl: "Рухсат / Махфийлик",
    name_uz_latn: "Ruxsat / Maxfiylik",
    description: "Формы допуска к государственным секретам",
    description_uz_cyrl: "Давлат сирлари билан ишлаш учун рухсат шакллари",
    description_uz_latn: "Davlat sirlari bilan ishlash uchun ruxsat shakllari",
    values: [
      { id: 1901, name: "Форма №1", name_uz_cyrl: "1-шакл", name_uz_latn: "1-shakl" },
      { id: 1902, name: "Форма №2", name_uz_cyrl: "2-шакл", name_uz_latn: "2-shakl" },
      { id: 1903, name: "Форма №3", name_uz_cyrl: "3-шакл", name_uz_latn: "3-shakl" },
      { id: 1904, name: "Без допуска", name_uz_cyrl: "Рухсати йўқ", name_uz_latn: "Ruxsati yo'q" },
    ],
  },
  {
    id: 20,
    name: "Категории годности",
    name_uz_cyrl: "Яроқлилик тоифалари",
    name_uz_latn: "Yaroqlilik toifalari",
    description: "Категории годности к военной службе",
    description_uz_cyrl: "Ҳарбий хизматга яроқлилик тоифалари",
    description_uz_latn: "Harbiy xizmatga yaroqlilik toifalari",
    values: [
      { id: 2001, name: "Годен (А)", name_uz_cyrl: "Яроқли (А)", name_uz_latn: "Yaroqli (A)" },
      { id: 2002, name: "Годен с ограничениями (Б)", name_uz_cyrl: "Чекланиш билан яроқли (Б)", name_uz_latn: "CHeclanish bilan yaroqli (B)" },
      { id: 2003, name: "Ограниченно годен (В)", name_uz_cyrl: "Чекланган яроқли (В)", name_uz_latn: "CHeclangan yaroqli (V)" },
    ],
  },
  {
    id: 21,
    name: "Взыскания и поощрения",
    name_uz_cyrl: "Интизомий чоралар ва рағбатлар",
    name_uz_latn: "Intizomiy choralar va rag'batlar",
    description: "Виды дисциплинарных взысканий и поощрений",
    description_uz_cyrl: "Интизомий жазолар ва рағбатлантириш турлари",
    description_uz_latn: "Intizomiy jazolar va rag'batlantirish turlari",
    values: [
      { id: 2101, name: "Благодарность", name_uz_cyrl: "Миннатдорчилик", name_uz_latn: "Minnatdorchilik" },
      { id: 2102, name: "Выговор", name_uz_cyrl: "Ҳайфсан", name_uz_latn: "Hayfsan" },
      { id: 2103, name: "Строгий выговор", name_uz_cyrl: "Қаттиқ ҳайфсан", name_uz_latn: "Qattiq hayfsan" },
    ],
  },
  {
    id: 22,
    name: "Объекты аудита",
    name_uz_cyrl: "Аудит объектлари",
    name_uz_latn: "Audit ob'ektlari",
    description: "Классификатор проверяемых объектов",
    description_uz_cyrl: "Текширилувчи объектлар таснифлагичи",
    description_uz_latn: "Tekshiriluvchi ob'ektlar tasniflagichi",
    values: [
      { id: 2201, name: "Финансовая деятельность", name_uz_cyrl: "Молиявий фаолият", name_uz_latn: "Moliyaviy faoliyat" },
      { id: 2202, name: "Хозяйственная деятельность", name_uz_cyrl: "Хўжалик фаолияти", name_uz_latn: "Xo'jalik faoliyati" },
      { id: 2203, name: "Капитальное строительство", name_uz_cyrl: "Капитал қурилиш", name_uz_latn: "Kapital qurilish" },
    ],
  },
  {
    id: 23,
    name: "Виды инспекций",
    name_uz_cyrl: "Инспекция турлари",
    name_uz_latn: "Inspektsiya turlari",
    description: "Классификатор видов проверок и инспекций",
    description_uz_cyrl: "Текширув ва инспекция турлари таснифлагичи",
    description_uz_latn: "Tekshiruv va inspektsiya turlari tasniflagichi",
    values: [
      { id: 2301, name: "Плановая инспекция", name_uz_cyrl: "Режали инспекция", name_uz_latn: "Rejali inspektsiya" },
      { id: 2302, name: "Внеплановая проверка", name_uz_cyrl: "Режадан ташқари текширув", name_uz_latn: "Rejadan tashqari tekshiruv" },
      { id: 2303, name: "Целевая проверка", name_uz_cyrl: "Мақсадли текширув", name_uz_latn: "Maqsadli tekshiruv" },
    ],
  },
]

export function Classifiers() {
  const { locale } = useI18n()
  const [dynamicClassifiers, setDynamicClassifiers] = useState<any[]>(classifiers)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDynamicData = async () => {
      setLoading(true)
      try {
        const [vusRes, posRes] = await Promise.all([
          fetch('/api/vus'),
          fetch('/api/positions')
        ])

        const vusData = (vusRes.ok ? await vusRes.json() : [])
        const posData = (posRes.ok ? await posRes.json() : [])

        const cleanVusData = Array.isArray(vusData) ? vusData : []
        const cleanPosData = Array.isArray(posData) ? posData : []

        setDynamicClassifiers(prev => prev.map(c => {
          if (c.id === 14) return { ...c, values: cleanVusData }
          if (c.id === 13) return { ...c, values: cleanPosData }
          return c
        }))
      } catch (error) {
        console.error("Failed to fetch dynamic classifiers", error)
      } finally {
        setLoading(false)
      }
    }
    fetchDynamicData()
  }, [])

  const getLocalizedName = (item: any) => {
    if (!item) return ""
    // Handle JSON name if present
    if (item.name && typeof item.name === 'object') {
      if (locale === "uzLatn") return item.name.uz || item.name.ru || ""
      if (locale === "uzCyrl") return item.name.uzk || item.name.ru || ""
      return item.name.ru || ""
    }

    if (locale === "uzLatn") return item.name_uz_latn || item.name
    if (locale === "uzCyrl") return item.name_uz_cyrl || item.name
    return item.name
  }

  const getLocalizedDescription = (item: any) => {
    if (!item) return ""
    if (locale === "uzLatn") return item.description_uz_latn || item.description
    if (locale === "uzCyrl") return item.description_uz_cyrl || item.description
    return item.description
  }

  const getSubtextNames = (item: any) => {
    if (!item) return ""

    // Handle JSON name if present
    if (item.name && typeof item.name === 'object') {
      const names = []
      if (locale !== "ru") names.push(item.name.ru)
      if (locale !== "uzLatn" && item.name.uz) names.push(item.name.uz)
      if (locale !== "uzCyrl" && item.name.uzk) names.push(item.name.uzk)
      return names.filter(Boolean).join(" / ")
    }

    const names = []
    if (locale !== "ru") names.push(item.name)
    if (locale !== "uzLatn" && item.name_uz_latn) names.push(item.name_uz_latn)
    if (locale !== "uzCyrl" && item.name_uz_cyrl) names.push(item.name_uz_cyrl)
    return names.filter(Boolean).join(" / ")
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-1">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-600 shadow-inner">
              <Database className="h-6 w-6" />
            </div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900">Системные классификаторы</h2>
          </div>
          <p className="text-lg font-medium text-muted-foreground/80 leading-relaxed pl-1">
            {locale === "ru" ? "Управление глобальными справочниками и числовыми идентификаторами системы" : "Global ma'lumotnomalar va tizim identifikatorlarini boshqarish"}
          </p>
        </div>
        <Button className="rounded-2xl h-12 px-8 font-black uppercase tracking-widest text-[11px] shadow-xl shadow-indigo-600/20 bg-indigo-600 hover:bg-indigo-700 transition-all hover:scale-[1.02] active:scale-[0.98] text-white">
          <Layers className="h-4 w-4 mr-2.5" />
          Добавить справочник
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {dynamicClassifiers.map((classifier) => (
          <Card key={classifier.id} className="border-none shadow-2xl shadow-slate-200/50 bg-white/80 backdrop-blur-xl rounded-4xl overflow-hidden group hover:ring-2 hover:ring-indigo-500/20 transition-all duration-500">
            <CardHeader className="p-8 pb-6 border-b border-slate-100 bg-white/40">
              <div className="flex items-start justify-between">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      <Tag className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black tracking-tight text-slate-900 leading-none">
                        {getLocalizedName(classifier)}
                      </h3>
                      <div className="flex items-center gap-2 mt-1.5 opacity-60">
                        <Globe2 className="h-3 w-3" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">
                          {getSubtextNames(classifier)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <CardDescription className="text-[14px] font-medium text-slate-500 leading-relaxed pl-1.5">
                    {getLocalizedDescription(classifier)}
                  </CardDescription>
                </div>
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl opacity-0 group-hover:opacity-100 transition-all">
                  <MoreHorizontal className="h-5 w-5 text-slate-400" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-100 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50 border-b border-slate-100 h-14">
                      <TableHead className="w-25 px-8 font-black text-[10px] uppercase tracking-widest text-slate-400 text-center">ID</TableHead>
                      <TableHead className="px-4 font-black text-[10px] uppercase tracking-widest text-slate-400">Значение</TableHead>
                      <TableHead className="px-8 font-black text-[10px] uppercase tracking-widest text-slate-400">Переводы</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {classifier.values.map((v: any, idx: number) => (
                      <TableRow key={v.id} className="h-16 hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-none group/row">
                        <TableCell className="px-8 text-center">
                          <Badge variant="outline" className="font-mono text-[11px] font-black bg-white border-slate-200 text-slate-400 group-hover/row:border-indigo-200 group-hover/row:text-indigo-600 px-2.5 py-1 rounded-lg transition-all">
                            {v.code || v.id}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-4 font-bold text-[14px] text-slate-700">
                          {getLocalizedName(v)}
                        </TableCell>
                        <TableCell className="px-8 flex items-center gap-2 min-h-16">
                          <div className="text-[10px] font-bold text-slate-300 italic group-hover/row:text-slate-400 transition-colors">
                            {getSubtextNames(v)}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-1 w-4 bg-indigo-500 rounded-full" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Всего записей: <span className="text-slate-900">{classifier.values.length}</span>
                  </span>
                </div>
                <Button size="sm" variant="outline" className="h-9 px-4 rounded-xl font-bold text-xs bg-white shadow-sm border-slate-200 hover:border-indigo-600 hover:text-indigo-600 transition-all">
                  <Edit className="h-3.5 w-3.5 mr-2" />
                  Правка данных
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Placeholder for adding more classifiers */}
        <button className="flex flex-col items-center justify-center p-12 border-4 border-dashed border-slate-200 rounded-4xl hover:border-indigo-500/40 hover:bg-indigo-500/5 transition-all group">
          <div className="p-5 rounded-3xl bg-slate-100 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner mb-4">
            <LayoutGrid className="h-10 w-10" />
          </div>
          <span className="text-xl font-black text-slate-400 group-hover:text-indigo-600 transition-colors">Добавить классификатор</span>
          <p className="text-sm font-medium text-slate-300 mt-2">Создать новый системный справочник</p>
        </button>
      </div>
    </div>
  )
}

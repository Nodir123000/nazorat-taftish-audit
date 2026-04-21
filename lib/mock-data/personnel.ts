import { initialKruStructure, Department, Position } from "@/lib/data/kru-data";
import { PersonnelMember } from "@/lib/types/personnel";

// Helper to generate a random ID
const generateId = () => Math.floor(Math.random() * 10000) + 1000;

// Helper to parse Name
const parseName = (fullName: string) => {
  const parts = fullName.split(' ');
  const cleanName = fullName.replace(/^(Генерал-майор|Полковник|Подполковник|Майор|Капитан|Старший лейтенант|Лейтенант|Младший лейтенант|Сержант)\s+/i, "");

  const nameTokens = cleanName.split(' ');
  let lastName = nameTokens[0] || "Неизвестно";
  let firstName = nameTokens[1] || "Неизвестно";
  let patronymic = nameTokens[2] || "";

  return { fullName, firstName, lastName, patronymic, cleanFullname: cleanName };
}

// Recursive function to flatten structure
const flattenStructure = (dept: Department, parentDeptName: string = ""): PersonnelMember[] => {
  let members: PersonnelMember[] = [];
  const currentDeptName = dept.name;

  if (dept.positions && dept.positions.length > 0) {
    members = dept.positions.map((pos, index) => {
      const nameData = parseName(pos.personName || `Сотрудник ${pos.id}`);

      let rank = "Офицер";
      const lowerName = (pos.personName || "").toLowerCase();
      if (lowerName.includes("генерал")) rank = "Высший офицер";
      else if (lowerName.includes("полковник") || lowerName.includes("майор")) rank = "Старший офицер";
      else if (lowerName.includes("капитан") || lowerName.includes("лейтенант")) rank = "Младший офицер";

      const militaryRank = (pos.personName || "").split(' ')[0] || "Майор";

      return {
        id: parseInt(pos.id.replace(/\D/g, '')) || generateId() + index,
        pin: (10000000000000 + Math.floor(Math.random() * 9000000000000)).toString(),
        source: "Бюджет",
        licenseCount: `01/00${index + 1}`,
        militaryRank: militaryRank,
        militaryUnit: "12345",
        militaryDistrict: "Центральный аппарат",
        rank: rank,
        passportNumber: `AA-${Math.floor(100000 + Math.random() * 900000)}`,
        dateOfBirth: "01.01.1980",
        fullName: nameData.cleanFullname,
        firstName: nameData.firstName,
        lastName: nameData.lastName,
        patronymic: nameData.patronymic,
        position: pos.title,
        department: currentDeptName,
        citizenship: "Узбекистан",
        placeOfBirth: "Ташкент",
        registrationAddress: "г. Ташкент",
        actualAddress: "г. Ташкент",
        maritalStatus: "Женат",
        gender: "Мужской",
        nationality: "Узбек",
        passportSeries: "AA",
        passportIssueDate: "01.01.2020",
        passportExpiryDate: "01.01.2030",
        passportIssuedBy: "IIV",
        militaryID: "AA 1234567",
        militaryIDIssueDate: "01.01.2000",
        militaryIDExpiryDate: "Indefinite",
        serviceNumber: `S-${Math.floor(1000 + Math.random() * 9000)}`,
        serviceStartDate: "01.01.2005",
        specialization: "Командная",
        clearanceLevel: "Форма 2",
        contactPhone: "+998901234567",
        email: "user@example.com",
        emergencyContact: "Жена",
        emergencyPhone: "+998901234567",
        photo: pos.photoUrl,
        auditCount: Math.floor(Math.random() * 20) + 1,
        inspectorCategory: ["Младший инспектор", "Инспектор", "Старший инспектор", "Главный инспектор"][Math.floor(Math.random() * 4)],
        totalDamageAmount: Math.floor(Math.random() * 500000000) + 100000000,
        kpiRating: ["excellent", "good", "satisfactory"][Math.floor(Math.random() * 3)],
        violationsFound: Math.floor(Math.random() * 50) + 5,
        kpiScore: Math.floor(Math.random() * 40) + 60,
        employmentDate: "2015-05-12",
        contractEndDate: "2026-05-12",
        certifications: [
          {
            id: "cert-1",
            name: "Сертификат инспектора I категории",
            issuedBy: "Министерство Обороны",
            issueDate: "2023-01-15",
            expiryDate: "2026-01-15",
            status: "active"
          }
        ],
        completedCourses: [
          {
            id: "course-1",
            name: "Курс повышения квалификации: Финансовый аудит",
            institution: "Академия ВС",
            completionDate: "2022-11-20",
            certificateNumber: "BC-998877"
          }
        ],
        specializations: ["Финансовый контроль", "Вещевое имущество"],
        workPhone: "+998712223344",
        personalPhone: "+998901234567",
        notes: "Опытный сотрудник",
        auditHistory: [
          {
            id: "audit-1",
            planId: "M-125",
            controlObject: "В/Ч 00168",
            controlObjectSubtext: "Ташкентский округ",
            unitsOnAllowance: "3 подразделения",
            inspectionDirection: "Материально-техническая",
            inspectionSubtext: "Целевая проверка",
            periodStart: "2024-01-10",
            periodEnd: "2024-02-10",
            orderNumber: "123-П",
            orderDate: "2023-12-25",
            briefingStatus: "conducted",
            status: "completed"
          }
        ],
        inspectionResults: [
          {
            id: "res-1",
            planId: "M-125",
            actNumber: "ACT-889",
            actDate: "2024-02-15",
            controlAuthority: "КРУ МО",
            controlObject: "В/Ч 00168",
            controlObjectRegion: "Ташкент",
            inspectionDirection: "Финансово-хозяйственная",
            inspectionDepartment: "1-й отдел",
            inspectionType: "planned",
            totalAmount: 450000000,
            recoveredAmount: 120000000,
            quantityStats: "15/3",
            responsiblePerson: "подполковник Сидоров А.В.",
            status: "checked",
            violations: [
              {
                id: "viol-1",
                violationType: "Нарушение порядка ведения учета",
                violationSubtype: "Недоимка по вещевому имуществу",
                source: "Инвентаризация",
                amount: 25000000,
                recoveredAmount: 10000000,
                quantityStats: "5 ед.",
                responsiblePerson: "капитан Петров И.И."
              }
            ]
          }
        ]
      };
    });
  }

  if (dept.subDepartments) {
    dept.subDepartments.forEach(sub => {
      members = [...members, ...flattenStructure(sub, currentDeptName)];
    });
  }

  return members;
}

export const mockPersonnelData: PersonnelMember[] = flattenStructure(initialKruStructure);

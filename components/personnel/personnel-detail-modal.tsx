"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Icons } from "@/components/icons"
import type { PersonnelMember } from "@/lib/types/personnel"

interface PersonnelDetailModalProps {
  personnel: PersonnelMember
  isOpen: boolean
  onClose: () => void
}

export function PersonnelDetailModal({ personnel, isOpen, onClose }: PersonnelDetailModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Информация о военнослужащем</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {/* Left column - Photo and basic info */}
          <div className="md:col-span-1">
            <div className="bg-muted rounded-lg p-4 flex flex-col items-center">
              <div className="w-32 h-40 bg-background rounded border border-border mb-4 flex items-center justify-center overflow-hidden">
                {personnel.photo ? (
                  <img
                    src={personnel.photo || "/placeholder.svg"}
                    alt={personnel.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Icons.User className="h-16 w-16 text-muted-foreground" />
                )}
              </div>
              <h3 className="text-center font-bold text-foreground mb-1">{personnel.fullName}</h3>
              <p className="text-center text-sm text-muted-foreground mb-4">{personnel.militaryRank}</p>

              <div className="w-full space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground font-medium">Воинский номер:</p>
                  <p className="text-foreground font-mono">{personnel.serviceNumber}</p>
                </div>
                <div>
                  <p className="text-muted-foreground font-medium">ПИНЭЛ:</p>
                  <p className="text-foreground font-mono text-xs">{personnel.pin}</p>
                </div>
                <div>
                  <p className="text-muted-foreground font-medium">Дата рождения:</p>
                  <p className="text-foreground">{personnel.dateOfBirth}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right columns - Detailed information */}
          <div className="md:col-span-2">
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-muted">
                <TabsTrigger value="personal" className="text-xs sm:text-sm">
                  Личные данные
                </TabsTrigger>
                <TabsTrigger value="passport" className="text-xs sm:text-sm">
                  Паспорт
                </TabsTrigger>
                <TabsTrigger value="military" className="text-xs sm:text-sm">
                  Военные данные
                </TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">ФИО:</p>
                    <p className="text-sm text-foreground">{personnel.fullName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Фамилия:</p>
                    <p className="text-sm text-foreground">{personnel.lastName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Имя:</p>
                    <p className="text-sm text-foreground">{personnel.firstName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Отчество:</p>
                    <p className="text-sm text-foreground">{personnel.patronymic}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Дата рождения:</p>
                    <p className="text-sm text-foreground">{personnel.dateOfBirth}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Пол:</p>
                    <p className="text-sm text-foreground">{personnel.gender}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Гражданство:</p>
                    <p className="text-sm text-foreground">{personnel.citizenship}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Национальность:</p>
                    <p className="text-sm text-foreground">{personnel.nationality}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Место рождения:</p>
                    <p className="text-sm text-foreground">{personnel.placeOfBirth}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Семейное положение:</p>
                    <p className="text-sm text-foreground">{personnel.maritalStatus}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground font-medium">Адрес регистрации:</p>
                    <p className="text-sm text-foreground">{personnel.registrationAddress}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground font-medium">Фактический адрес:</p>
                    <p className="text-sm text-foreground">{personnel.actualAddress}</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="passport" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Серия паспорта:</p>
                    <p className="text-sm text-foreground font-mono">{personnel.passportSeries}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Номер паспорта:</p>
                    <p className="text-sm text-foreground font-mono">{personnel.passportNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Дата выдачи:</p>
                    <p className="text-sm text-foreground">{personnel.passportIssueDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Дата истечения:</p>
                    <p className="text-sm text-foreground">{personnel.passportExpiryDate}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground font-medium">Выдан:</p>
                    <p className="text-sm text-foreground">{personnel.passportIssuedBy}</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="military" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Воинское звание:</p>
                    <p className="text-sm text-foreground">{personnel.militaryRank}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Воинская часть:</p>
                    <p className="text-sm text-foreground">{personnel.militaryUnit}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Пункт дислокации:</p>
                    <p className="text-sm text-foreground">{personnel.dislocation || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Должность:</p>
                    <p className="text-sm text-foreground">{personnel.position}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Отдел:</p>
                    <p className="text-sm text-foreground">{personnel.department}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Номер военного билета:</p>
                    <p className="text-sm text-foreground font-mono">{personnel.militaryID}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Дата выдачи военного билета:</p>
                    <p className="text-sm text-foreground">{personnel.militaryIDIssueDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Дата истечения военного билета:</p>
                    <p className="text-sm text-foreground">{personnel.militaryIDExpiryDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Номер службы:</p>
                    <p className="text-sm text-foreground font-mono">{personnel.serviceNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Дата начала службы:</p>
                    <p className="text-sm text-foreground">{personnel.serviceStartDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Специализация:</p>
                    <p className="text-sm text-foreground">{personnel.specialization}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Уровень допуска:</p>
                    <p className="text-sm text-foreground">{personnel.clearanceLevel}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Контактный телефон:</p>
                    <p className="text-sm text-foreground">{personnel.contactPhone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Email:</p>
                    <p className="text-sm text-foreground">{personnel.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Контакт в экстренном случае:</p>
                    <p className="text-sm text-foreground">{personnel.emergencyContact}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Телефон экстренного контакта:</p>
                    <p className="text-sm text-foreground">{personnel.emergencyPhone}</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

"use client"

import * as React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/icons"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Order } from "@/lib/types/orders"
import {
    getCommissionMembersByOrderId,
    getAllPrescriptions,
    getAllBriefingTopics
} from "@/lib/mock-data/orders"
import { militaryPersonnel } from "@/components/reference/personnel-data"
import { physicalPersons } from "@/components/reference/physical-persons-data"
import { getUnitName } from "./orders-registry" // Need to export this or move to utils
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// Duplicate utility for now if not exported
const getPersonnelName = (id: string) => {
    const mp = militaryPersonnel.find(p => p.id.toString() === id);
    if (!mp) return id;
    const person = physicalPersons.find(p => p.id === mp.personId);
    return person ? `${person.lastName} ${person.firstName} ${person.middleName || ''}` : id;
};

// Internal unit name getter if we can't easily import
const getInternalUnitName = (id: string) => {
    // In a real app this would be a shared utility or hook
    return `В/Ч ${id.padStart(5, '0')}` // Fallback
}

interface OrderDetailsProps {
    order: Order
}

export function OrderDetails({ order }: OrderDetailsProps) {
    const commissionMembers = getCommissionMembersByOrderId(order.id)
    // Filter prescriptions and briefings loosely based on unit or ID for mock purposes
    // In real app, these would be linked by order ID
    const prescriptions = getAllPrescriptions().filter(p => p.date >= order.date && p.date <= order.period.split(" - ")[1]) // Loose mock association
    const briefingTopics = getAllBriefingTopics() // Just show all or mock empty

    return (
        <div className="p-4 bg-muted/30 rounded-lg border shadow-inner">
            <Tabs defaultValue="commission" className="w-full">
                <TabsList className="grid w-full grid-cols-4 max-w-[600px]">
                    <TabsTrigger value="commission">Ревизоры ({commissionMembers.length})</TabsTrigger>
                    <TabsTrigger value="checklist">Чек-лист</TabsTrigger>
                    <TabsTrigger value="prescriptions">Предписания ({prescriptions.length})</TabsTrigger>
                    <TabsTrigger value="audit">Хронология</TabsTrigger>
                </TabsList>

                <TabsContent value="commission" className="mt-4">
                    <Card>
                        <CardHeader className="py-2">
                            <CardTitle className="text-base">Назначенные ревизоры</CardTitle>
                        </CardHeader>
                        <CardContent className="py-2">
                            {commissionMembers.length > 0 ? (
                                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                    {commissionMembers.map(member => (
                                        <div key={member.id} className="flex items-center space-x-3 rounded-md border p-2 bg-card">
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback className={member.role === "Главный ревизор" ? "bg-blue-100 text-blue-700" : ""}>
                                                    {getPersonnelName(member.name).split(' ').map((n, i) => i < 2 ? n[0] : '').join('')}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="space-y-1 overflow-hidden">
                                                <p className="text-sm font-medium leading-none truncate">{getPersonnelName(member.name)}</p>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-muted-foreground truncate">{member.position}</span>
                                                    {member.role === "Главный ревизор" && <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 border-blue-200 text-blue-700 bg-blue-50">Главный ревизор</Badge>}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">Ревизоры не назначены.</p>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="checklist" className="mt-4">
                    <Card>
                        <CardHeader className="py-2">
                            <CardTitle className="text-base">Темы инструктажа</CardTitle>
                            <CardDescription>Список обязательных вопросов для проверки</CardDescription>
                        </CardHeader>
                        <CardContent className="py-2">
                            {/* Mock Checklist */}
                            <div className="space-y-2">
                                {["Проверка наличия личного состава", "Проверка состояния вооружения", "Проверка документации", "Опрос жалоб и заявлений"].map((item, i) => (
                                    <div key={i} className="flex items-center gap-2 text-sm">
                                        <div className="h-4 w-4 rounded-full border border-primary flex items-center justify-center">
                                            {i < 2 && <div className="h-2 w-2 rounded-full bg-primary" />}
                                        </div>
                                        <span className={i < 2 ? "line-through text-muted-foreground" : ""}>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="prescriptions" className="mt-4">
                    <Card>
                        <CardHeader className="py-2">
                            <CardTitle className="text-base">Выданные предписания</CardTitle>
                        </CardHeader>
                        <CardContent className="py-2">
                            {prescriptions.length > 0 ? (
                                <div className="space-y-2">
                                    {prescriptions.map(p => (
                                        <div key={p.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-sm">Предписание {p.prescriptionNum}</span>
                                                <span className="text-xs text-muted-foreground">{p.date}</span>
                                            </div>
                                            <Badge variant={p.status === "Действует" ? "destructive" : "secondary"}>{p.status}</Badge>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">Предписаний нет.</p>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="audit" className="mt-4">
                    <Card>
                        <CardHeader className="py-2">
                            <CardTitle className="text-base">Хронология изменений</CardTitle>
                        </CardHeader>
                        <CardContent className="py-2">
                            <ScrollArea className="h-[150px]">
                                <ol className="relative border-l border-muted-foreground/20 ml-3">
                                    <li className="mb-4 ml-4">
                                        <div className="absolute w-2 h-2 bg-blue-500 rounded-full -left-[21px] mt-1.5 border border-white"></div>
                                        <time className="mb-1 text-xs font-normal text-muted-foreground">{order.date}</time>
                                        <h3 className="text-sm font-semibold">Приказ создан</h3>
                                        <p className="text-xs text-muted-foreground">Инициатор: Командование</p>
                                    </li>
                                    {order.status === "Действует" && (
                                        <li className="mb-4 ml-4">
                                            <div className="absolute w-2 h-2 bg-green-500 rounded-full -left-[21px] mt-1.5 border border-white"></div>
                                            <time className="mb-1 text-xs font-normal text-muted-foreground">Вчера</time>
                                            <h3 className="text-sm font-semibold">Статус изменен на "Действует"</h3>
                                        </li>
                                    )}
                                    {/* Mock logic */}
                                </ol>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

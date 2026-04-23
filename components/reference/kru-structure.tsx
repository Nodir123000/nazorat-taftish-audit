"use client"

import React, { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"
import { ChevronRight, Shield, Users, Briefcase, Building2, Camera, Plus, Edit2, X, Target, LayoutGrid, CheckCircle2, User, Image as ImageIcon, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { TechnicalNameBadge } from "./technical-name-badge"

// Initial Data imported from lib/data/kru-data.ts
import { initialKruStructure, Department, Position } from "@/lib/data/kru-data"

// Helper to render icon from name or fallback
const getIcon = (name?: string) => {
    if (name === "Shield") return <Shield className="h-6 w-6 text-indigo-600" />
    if (name === "Settings") return <Icons.Settings className="h-5 w-5 text-blue-500" />
    if (name === "Check") return <Icons.Check className="h-5 w-5 text-emerald-500" />
    if (name === "Dollar") return <Icons.Dollar className="h-5 w-5 text-amber-500" />
    if (name === "Package") return <Icons.Package className="h-5 w-5 text-indigo-500" />
    return <Shield className="h-6 w-6 text-indigo-600" />
}

export function KruStructure() {
    const [structure, setStructure] = useState<Department>(initialKruStructure)
    const [isEditMode, setIsEditMode] = useState(false)
    const [editingNode, setEditingNode] = useState<{ type: 'dept' | 'pos', id: string, parentId?: string } | null>(null)
    const [photoDialogOpen, setPhotoDialogOpen] = useState(false)
    const [tempPhotoUrl, setTempPhotoUrl] = useState("")
    const [tempName, setTempName] = useState("")

    // Helper to find and update node in the tree
    const updateNode = (root: Department, targetId: string, type: 'dept' | 'pos', updates: any): Department => {
        if (type === 'dept') {
            if (root.id === targetId) return { ...root, ...updates }
            if (root.subDepartments) {
                return {
                    ...root,
                    subDepartments: root.subDepartments.map(sub => updateNode(sub, targetId, type, updates))
                }
            }
        } else {
            // Search in current positions
            const posIndex = root.positions.findIndex(p => p.id === targetId)
            if (posIndex !== -1) {
                const newPositions = [...root.positions]
                newPositions[posIndex] = { ...newPositions[posIndex], ...updates }
                return { ...root, positions: newPositions }
            }
            // Search in children
            if (root.subDepartments) {
                return {
                    ...root,
                    subDepartments: root.subDepartments.map(sub => updateNode(sub, targetId, type, updates))
                }
            }
        }
        return root
    }

    const handleEditClick = (type: 'dept' | 'pos', id: string, currentPhoto?: string, currentName?: string) => {
        setEditingNode({ type, id })
        setTempPhotoUrl(currentPhoto || "")
        setTempName(currentName || "")
        setPhotoDialogOpen(true)
    }

    const handleSave = () => {
        if (!editingNode) return

        const updates: any = {};
        if (tempPhotoUrl) updates[editingNode.type === 'dept' ? 'imageUrl' : 'photoUrl'] = tempPhotoUrl
        if (tempName) updates[editingNode.type === 'dept' ? 'name' : 'personName'] = tempName

        setStructure(prev => updateNode(prev, editingNode.id, editingNode.type, updates))
        setPhotoDialogOpen(false)
        setEditingNode(null)
    }

    const DepartmentCard = ({ dept, isRoot = false }: { dept: Department, isRoot?: boolean }) => {
        const hasPositions = dept.positions && dept.positions.length > 0;
        const hasSubDepts = dept.subDepartments && dept.subDepartments.length > 0;

        return (
            <div className={cn("flex flex-col items-center", isRoot ? "w-full" : "min-w-100")}>
                {/* Department Node */}
                <Card className={cn(
                    "relative w-full transition-all duration-300 hover:shadow-2xl border-none shadow-xl z-10 rounded-[28px] overflow-hidden",
                    isRoot ? "bg-white border-2 border-indigo-500/20 max-w-2xl" : "bg-white hover:ring-2 hover:ring-indigo-500/20 max-w-xl"
                )}>
                    {/* Background Gradient Accent */}
                    <div className={cn("absolute top-0 left-0 right-0 h-1.5", isRoot ? "bg-indigo-600" : "bg-slate-200")} />

                    {/* Connector Line to Parent (if not root) */}
                    {!isRoot && (
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 h-12 w-0.5 bg-slate-300/50" />
                    )}

                    {/* Connector Line to Children (if has children) */}
                    {hasSubDepts && (
                        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 h-12 w-0.5 bg-slate-300/50" />
                    )}

                    <CardHeader className="p-6 pb-4">
                        <div className="flex items-center gap-5">
                            <div className="relative group shrink-0">
                                <div className={cn(
                                    "flex items-center justify-center h-16 w-16 rounded-[20px] border-none transition-all overflow-hidden shadow-inner",
                                    isRoot ? "bg-indigo-50" : "bg-slate-50"
                                )}>
                                    {dept.imageUrl ? (
                                        <img src={dept.imageUrl} alt={dept.name} className="h-full w-full object-cover" />
                                    ) : (
                                        getIcon(dept.iconName)
                                    )}
                                </div>
                                {isEditMode && (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleEditClick('dept', dept.id, dept.imageUrl, dept.name) }}
                                        className="absolute -bottom-1 -right-1 bg-white text-indigo-600 p-1.5 rounded-full shadow-lg border border-indigo-50 hover:scale-110 transition-transform z-20"
                                    >
                                        <Camera className="h-3.5 w-3.5" />
                                    </button>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className={cn("font-black tracking-tight leading-tight text-slate-900", isRoot ? "text-2xl" : "text-lg")}>
                                    {dept.name}
                                </h3>
                                {isRoot && (
                                    <div className="flex items-center gap-1.5 mt-1.5">
                                        <div className="h-1 w-4 bg-indigo-600 rounded-full" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Штаб-квартира</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardHeader>

                    {/* Positions Table */}
                    {hasPositions && (
                        <CardContent className="p-0 border-t border-slate-100 bg-slate-50/30">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent border-none">
                                        <TableHead className="w-14"></TableHead>
                                        <TableHead className="font-bold text-[11px] uppercase tracking-widest text-muted-foreground/70 py-4">Должность</TableHead>
                                        <TableHead className="font-bold text-[11px] uppercase tracking-widest text-muted-foreground/70 py-4">Сотрудник</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {dept.positions.map((pos) => (
                                        <TableRow key={pos.id} className="hover:bg-white transition-colors group/row border-none">
                                            <TableCell className="py-3 pl-6 w-14">
                                                <div className="relative group/avatar">
                                                    <Avatar className="h-10 w-10 border-2 border-white shadow-md rounded-xl">
                                                        <AvatarImage src={pos.photoUrl} className="object-cover" />
                                                        <AvatarFallback className="bg-indigo-50 text-indigo-600 rounded-xl"><User className="h-5 w-5" /></AvatarFallback>
                                                    </Avatar>
                                                    {isEditMode && (
                                                        <button
                                                            onClick={() => handleEditClick('pos', pos.id, pos.photoUrl, pos.personName)}
                                                            className="opacity-0 group-hover/avatar:opacity-100 absolute -bottom-1 -right-1 bg-white text-indigo-600 p-1.5 rounded-full shadow-lg border border-indigo-50 hover:scale-110 transition-all z-20"
                                                        >
                                                            <Edit2 className="h-3 w-3" />
                                                        </button>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-3 font-bold text-slate-700 text-[14px]">
                                                {pos.title}
                                            </TableCell>
                                            <TableCell className="py-3">
                                                <div className="flex items-center gap-2">
                                                    <span className={cn("text-sm font-semibold truncate max-w-45", pos.personName ? "text-slate-900" : "text-muted-foreground/50 italic")}>
                                                        {pos.personName || "Вакансия"}
                                                    </span>
                                                    {!pos.personName && <Badge variant="outline" className="h-5 px-1.5 text-[9px] font-black uppercase tracking-tighter bg-amber-50 text-amber-600 border-amber-200">Открыто</Badge>}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    )}
                </Card>

                {/* Recursive Children Rendering in a Flex Row */}
                {hasSubDepts && (
                    <div className="flex gap-12 mt-24 relative pt-12">
                        {/* Vertical line connector from above */}
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 h-12 w-0.5 bg-slate-300/50" />

                        {/* Horizontal Connector Line Holder */}
                        <div className="absolute top-0 left-0 right-0 h-0.5">
                            {/* Horizontal Line logic handled per child */}
                        </div>

                        <div className="flex items-start gap-12 relative">
                            {dept.subDepartments!.map((sub, idx, arr) => (
                                <div key={sub.id} className="relative pt-6">
                                    {/* Horizontal Line segment above child */}
                                    {arr.length > 1 && (
                                        <div className={cn(
                                            "absolute top-0 h-0.5 bg-slate-300/50",
                                            idx === 0 ? "left-1/2 w-1/2" :
                                                idx === arr.length - 1 ? "right-1/2 w-1/2" :
                                                    "left-0 w-full"
                                        )} />
                                    )}

                                    {/* Vertical entry line for each child */}
                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 h-6 w-0.5 bg-slate-300/50" />
                                    <DepartmentCard dept={sub} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        )
    }

    return (
        <Card className="border-none shadow-none bg-transparent animate-in fade-in slide-in-from-bottom-4 duration-700 w-full overflow-x-auto p-4">
            <CardHeader className="px-0 pt-0 pb-12 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="p-3.5 rounded-2xl bg-indigo-600 text-white shadow-xl shadow-indigo-600/20">
                            <Target className="h-6 w-6" />
                        </div>
                        <div>
                            <CardTitle className="text-3xl font-black tracking-tight text-slate-900 leading-none">
                                Структура КРУ МНО
                            </CardTitle>
                            <CardDescription className="text-lg font-medium text-muted-foreground/80 mt-1">
                                Организационная структура и штатное расписание контрольно-ревизионного управления
                            </CardDescription>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-6 px-6 py-4 bg-white rounded-3xl shadow-xl shadow-indigo-500/5 border border-indigo-50">
                    <TechnicalNameBadge name="KruStructure" />
                    <div className="flex items-center gap-3">
                        <Label htmlFor="edit-mode" className="text-xs font-black uppercase tracking-widest text-slate-500 cursor-pointer">Режим правок</Label>
                        <Switch
                            id="edit-mode"
                            checked={isEditMode}
                            onCheckedChange={setIsEditMode}
                            className="data-[state=checked]:bg-indigo-600"
                        />
                    </div>
                </div>
            </CardHeader>

            <CardContent className="px-0 pt-20 pb-32 min-w-max">
                <div className="flex justify-center">
                    <DepartmentCard dept={structure} isRoot />
                </div>
            </CardContent>

            <Dialog open={photoDialogOpen} onOpenChange={setPhotoDialogOpen}>
                <DialogContent className="max-w-xl border-none shadow-2xl bg-white/95 backdrop-blur-xl rounded-3xl overflow-hidden p-0">
                    <DialogHeader className="p-8 pb-0">
                        <div className="flex items-center gap-4">
                            <div className="p-3.5 rounded-2xl bg-indigo-600 text-white shadow-xl shadow-indigo-600/20">
                                {editingNode?.type === 'dept' ? <Building2 className="h-6 w-6" /> : <User className="h-6 w-6" />}
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-black tracking-tight text-slate-900 leading-none mb-1.5">
                                    {editingNode?.type === 'dept' ? 'Редактировать отдел' : 'Редактировать сотрудника'}
                                </DialogTitle>
                                <DialogDescription className="text-[15px] font-medium text-muted-foreground/80">
                                    Измените визуальную информацию и наименование
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="p-8 pt-6 space-y-8">
                        {/* Section 1: Basic Info */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 px-1">
                                <div className="h-1 w-6 bg-indigo-600 rounded-full" />
                                <span className="text-[11px] font-black uppercase tracking-[0.15em] text-indigo-600">Основные данные</span>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pl-1">
                                    {editingNode?.type === 'dept' ? 'Название подразделения' : 'ФИО Сотрудника'} *
                                </Label>
                                <div className="relative group">
                                    <LayoutGrid className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 group-focus-within:text-indigo-600 transition-colors" />
                                    <Input
                                        id="name"
                                        value={tempName}
                                        onChange={(e) => setTempName(e.target.value)}
                                        placeholder="Введите текст..."
                                        className="h-12 rounded-2xl bg-muted/40 border-none pl-11 focus:bg-white transition-all font-bold"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Image */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 px-1">
                                <div className="h-1 w-6 bg-blue-600 rounded-full" />
                                <span className="text-[11px] font-black uppercase tracking-[0.15em] text-blue-600">Изображение</span>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 pl-1">Ссылка на фото (URL)</Label>
                                    <div className="relative group">
                                        <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 group-focus-within:text-blue-600 transition-colors" />
                                        <Input
                                            id="photo"
                                            value={tempPhotoUrl}
                                            onChange={(e) => setTempPhotoUrl(e.target.value)}
                                            placeholder="https://example.com/photo.jpg"
                                            className="h-12 rounded-2xl bg-muted/40 border-none pl-11 focus:bg-white transition-all font-medium"
                                        />
                                    </div>
                                    <p className="text-[10px] font-bold text-muted-foreground/60 pl-1">
                                        Вставьте прямую ссылку на изображение для отображения в структуре.
                                    </p>
                                </div>

                                {tempPhotoUrl && (
                                    <Card className="flex flex-col h-full bg-linear-to-b from-blue-50/50 to-white min-w-100 border-2 border-dashed border-indigo-200">
                                        <div className="relative">
                                            <img src={tempPhotoUrl} alt="Preview" className="h-32 w-32 object-cover rounded-3xl shadow-2xl ring-4 ring-white" />
                                            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity">
                                                <Check className="h-4 w-4" />
                                            </div>
                                        </div>
                                    </Card>
                                )}
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="p-8 bg-muted/20 border-t border-border/40 gap-3">
                        <Button variant="ghost" onClick={() => setPhotoDialogOpen(false)} className="h-12 rounded-2xl px-6 font-black uppercase tracking-widest text-[11px] hover:bg-white transition-all">
                            Отмена
                        </Button>
                        <Button onClick={handleSave} className="h-12 rounded-2xl px-10 bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 font-black uppercase tracking-widest text-[11px] text-white transition-all hover:scale-[1.02] active:scale-[0.98]">
                            Применить изменения
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    )
}

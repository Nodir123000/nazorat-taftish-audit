"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Icons } from "@/components/icons"
import { ChevronRight, ChevronDown, FileText, Building2, DollarSign, Wrench, Package, Search, Download, Layers, ShieldCheck, PieChart, Activity, Info } from "lucide-react"
import { expenseGroups, supplyDepartments } from "@/lib/data/expense-classification"
import { cn } from "@/lib/utils"

export function ExpenseClassificationView() {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedGroup, setSelectedGroup] = useState<string>("all")
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
    const [expandedArticles, setExpandedArticles] = useState<Set<string>>(new Set())

    const toggleCategory = (code: string) => {
        const newExpanded = new Set(expandedCategories)
        if (newExpanded.has(code)) {
            newExpanded.delete(code)
        } else {
            newExpanded.add(code)
        }
        setExpandedCategories(newExpanded)
    }

    const toggleArticle = (code: string) => {
        const newExpanded = new Set(expandedArticles)
        if (newExpanded.has(code)) {
            newExpanded.delete(code)
        } else {
            newExpanded.add(code)
        }
        setExpandedArticles(newExpanded)
    }


    const filteredGroups = useMemo(() => {
        let result = expenseGroups
        if (selectedGroup !== "all") {
            result = result.filter((g) => g.id === selectedGroup)
        }
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            result = result.map(group => ({
                ...group,
                categories: group.categories.map(cat => ({
                    ...cat,
                    articles: cat.articles.filter(art =>
                        art.code.toLowerCase().includes(query) ||
                        art.name.toLowerCase().includes(query)
                    )
                })).filter(cat => cat.articles.length > 0)
            })).filter(group => group.categories.length > 0)
        }
        return result
    }, [selectedGroup, searchQuery])

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-700">
            <Tabs defaultValue="classification" className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-1">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2.5">
                            <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-600 shadow-inner">
                                <Layers className="h-6 w-6" />
                            </div>
                            <h2 className="text-3xl font-black tracking-tight text-slate-900">Бюджетная классификация</h2>
                        </div>
                        <p className="text-lg font-medium text-muted-foreground/80 leading-relaxed pl-1">Справочник статей и кодов расходов Министерства обороны</p>
                    </div>

                    <TabsList className="bg-white/60 p-1.5 rounded-2xl border border-border/50 shadow-xl shadow-primary/5 backdrop-blur-xl h-auto flex-wrap justify-start">
                        <TabsTrigger value="classification" className="rounded-xl h-10 px-6 font-bold data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-indigo-600/20 transition-all uppercase tracking-wider text-[11px]">Классификация</TabsTrigger>
                        <TabsTrigger value="structure" className="rounded-xl h-10 px-6 font-bold data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-indigo-600/20 transition-all uppercase tracking-wider text-[11px]">Структура кода</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="classification" className="space-y-6 pt-2 focus-visible:outline-none">
                    <Card className="border-none shadow-2xl shadow-primary/5 bg-white/60 backdrop-blur-xl rounded-[32px] overflow-hidden">
                        <CardHeader className="bg-white/40 pb-8 border-b border-border/50">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-indigo-600 mb-2">
                                        <div className="h-1 w-6 bg-indigo-600 rounded-full" />
                                        Иерархия статей
                                    </div>
                                    <CardTitle className="text-2xl font-black tracking-tight text-slate-900 leading-none">Перечень статей и видов расходов</CardTitle>
                                </div>
                                <div className="flex flex-col sm:flex-row items-center gap-4">
                                    <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                                        <SelectTrigger className="w-full sm:w-[200px] h-12 rounded-2xl bg-white/80 border-none shadow-sm font-bold focus:ring-4 focus:ring-indigo-500/10 transition-all">
                                            <div className="flex items-center gap-2">
                                                <PieChart className="h-4 w-4 text-indigo-500" />
                                                <SelectValue placeholder="Все группы" />
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent className="rounded-2xl border-none shadow-2xl">
                                            <SelectItem value="all" className="rounded-xl font-bold">Все группы</SelectItem>
                                            <SelectItem value="I" className="rounded-xl font-bold">Группа I</SelectItem>
                                            <SelectItem value="II" className="rounded-xl font-bold">Группа II</SelectItem>
                                            <SelectItem value="III" className="rounded-xl font-bold">Группа III</SelectItem>
                                            <SelectItem value="IV" className="rounded-xl font-bold">Группа IV</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <div className="relative w-full sm:w-[300px] group">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-indigo-600 transition-colors" />
                                        <Input
                                            placeholder="Поиск по статьям..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-11 h-12 rounded-2xl bg-white/80 border-none focus:bg-white transition-all shadow-sm font-bold text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-border/30">
                                {filteredGroups.map((group) => (
                                    <div key={group.id} className="group-container">
                                        <div className={cn("p-8 text-white flex items-center gap-6 shadow-2xl relative overflow-hidden", group.color)}>
                                            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                                                <DollarSign className="h-48 w-48" />
                                            </div>
                                            <div className="p-4 bg-white/20 rounded-[24px] backdrop-blur-xl relative z-10 shadow-lg border border-white/20">
                                                <Icons.Dollar className="h-8 w-8 text-white drop-shadow-md" />
                                            </div>
                                            <div className="relative z-10">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80">Справочник</span>
                                                    <Badge className="bg-white/20 text-white border-white/30 text-[10px] uppercase font-black rounded-lg">Группа {group.id}</Badge>
                                                </div>
                                                <h3 className="font-black text-2xl tracking-wide uppercase">{group.name}</h3>
                                            </div>
                                        </div>
                                        <div className="p-8 space-y-6 bg-slate-50/20 backdrop-blur-sm">
                                            {group.categories.map((category) => (
                                                <Collapsible
                                                    key={category.code}
                                                    open={expandedCategories.has(category.code)}
                                                    onOpenChange={() => toggleCategory(category.code)}
                                                    className="border-none rounded-[28px] bg-white shadow-xl shadow-slate-200/40 overflow-hidden ring-1 ring-slate-100"
                                                >
                                                    <CollapsibleTrigger className="flex items-center gap-5 w-full p-6 transition-all hover:bg-indigo-50/30 text-left group/trigger">
                                                        <div className="flex items-center justify-center h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 transition-all group-hover/trigger:scale-110 group-hover/trigger:bg-indigo-600 group-hover/trigger:text-white shadow-inner">
                                                            {expandedCategories.has(category.code) ? (
                                                                <ChevronDown className="h-6 w-6" />
                                                            ) : (
                                                                <ChevronRight className="h-6 w-6" />
                                                            )}
                                                        </div>
                                                        <div className="flex flex-col flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="text-[10px] font-black text-indigo-600/70 font-mono tracking-widest uppercase bg-indigo-50/50 px-2 py-0.5 rounded-lg">Код {category.code}</span>
                                                            </div>
                                                            <span className="font-black text-slate-800 text-lg leading-tight group-hover/trigger:text-indigo-600 transition-colors">{category.name}</span>
                                                        </div>
                                                        <Badge variant="secondary" className="rounded-xl px-4 py-1.5 bg-slate-100 text-slate-600 font-black text-[10px] uppercase tracking-widest border-none">
                                                            {category.articles.length} статей
                                                        </Badge>
                                                    </CollapsibleTrigger>
                                                    <CollapsibleContent className="px-6 pb-6 space-y-4 animate-in slide-in-from-top-4 duration-500">
                                                        {category.articles.map((article) => (
                                                            <Collapsible
                                                                key={article.code}
                                                                open={expandedArticles.has(article.code)}
                                                                onOpenChange={() => toggleArticle(article.code)}
                                                                className="border border-slate-100 rounded-[20px] bg-slate-50/40 overflow-hidden hover:bg-white hover:shadow-lg transition-all"
                                                            >
                                                                <CollapsibleTrigger className="flex items-center gap-4 w-full p-4.5 transition-colors text-left group/article">
                                                                    {article.elements.length > 0 ? (
                                                                        <div className="flex items-center justify-center h-8 w-8 rounded-xl bg-white text-slate-400 group-hover/article:bg-indigo-50 group-hover/article:text-indigo-600 shadow-sm border border-slate-100 transition-all">
                                                                            {expandedArticles.has(article.code) ? (
                                                                                <ChevronDown className="h-4 w-4" />
                                                                            ) : (
                                                                                <ChevronRight className="h-4 w-4" />
                                                                            )}
                                                                        </div>
                                                                    ) : (
                                                                        <div className="w-8" />
                                                                    )}
                                                                    <Badge variant="outline" className="font-mono text-[12px] font-bold bg-white border-indigo-100 px-2.5 py-1 rounded-xl text-indigo-600 shadow-sm">
                                                                        {article.code}
                                                                    </Badge>
                                                                    <span className="text-[15px] font-bold text-slate-700 tracking-tight">{article.name}</span>
                                                                    {article.elements.length > 0 && (
                                                                        <div className="ml-auto flex items-center gap-2">
                                                                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Элементы</span>
                                                                            <Badge className="h-6 min-w-[24px] flex justify-center text-[10px] font-black border-none bg-indigo-500 text-white rounded-lg shadow-lg shadow-indigo-500/20">
                                                                                {article.elements.length}
                                                                            </Badge>
                                                                        </div>
                                                                    )}
                                                                </CollapsibleTrigger>
                                                                {article.elements.length > 0 && (
                                                                    <CollapsibleContent className="px-4 pb-4 pt-0 space-y-1.5">
                                                                        {article.elements.map((element) => (
                                                                            <div
                                                                                key={element.code}
                                                                                className="flex items-center justify-between p-3.5 rounded-2xl text-[14px] text-slate-600 hover:bg-white hover:shadow-xl hover:shadow-indigo-500/5 hover:text-indigo-600 transition-all border border-transparent hover:border-indigo-50 group/element"
                                                                            >
                                                                                <div className="flex items-center gap-3.5">
                                                                                    <div className="w-2 h-2 rounded-full bg-slate-200 group-hover/element:bg-indigo-400 transition-colors" />
                                                                                    <span className="font-semibold">{element.name}</span>
                                                                                </div>
                                                                                <div className="flex items-center gap-2">
                                                                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest group-hover/element:text-indigo-300">Код элемента</span>
                                                                                    <code className="text-[11px] font-black bg-slate-100 text-slate-500 group-hover/element:bg-indigo-50 group-hover/element:text-indigo-600 px-3 py-1 rounded-xl font-mono shadow-inner transition-all">{element.code}</code>
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </CollapsibleContent>
                                                                )}
                                                            </Collapsible>
                                                        ))}
                                                    </CollapsibleContent>
                                                </Collapsible>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>


                <TabsContent value="structure" className="pt-2 focus-visible:outline-none">
                    <Card className="border-none shadow-2xl shadow-primary/5 bg-white/60 backdrop-blur-xl rounded-[32px] overflow-hidden">
                        <CardHeader className="bg-white/40 pb-8 border-b border-border/50">
                            <div className="flex items-center gap-4">
                                <div className="p-3.5 bg-indigo-600 rounded-[22px] text-white shadow-xl shadow-indigo-600/20"><Layers className="h-7 w-7" /></div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-indigo-600 mb-1">
                                        <div className="h-1 w-6 bg-indigo-600 rounded-full" />
                                        Логика кодирования
                                    </div>
                                    <CardTitle className="text-2xl font-black tracking-tight text-slate-900 leading-none">Структура классификационного кода</CardTitle>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-10 space-y-16">
                            {/* Code Segments Display */}
                            <div className="flex flex-wrap items-center justify-center gap-8 relative p-12 bg-white rounded-[40px] border border-slate-100 shadow-[inset_0_4px_12px_rgba(0,0,0,0.02)]">
                                <div className="flex flex-col items-center gap-4 transform hover:scale-110 transition-transform duration-500 group">
                                    <div className="h-16 w-32 flex items-center justify-center text-3xl font-mono font-black bg-blue-600 text-white rounded-[24px] shadow-2xl shadow-blue-600/30 group-hover:rotate-[-2deg]">XX</div>
                                    <div className="flex flex-col items-center">
                                        <span className="text-[11px] font-black uppercase text-blue-600 tracking-widest">Категория</span>
                                        <Badge className="text-[10px] font-black bg-blue-50 text-blue-700 px-3 py-1 rounded-full mt-2 border-none">2 знака</Badge>
                                    </div>
                                </div>
                                <div className="h-px w-8 bg-slate-200 border-t-2 border-dashed border-slate-300 mt-[-50px] opacity-40" />
                                <div className="flex flex-col items-center gap-4 transform hover:scale-110 transition-transform duration-500 group">
                                    <div className="h-16 w-24 flex items-center justify-center text-3xl font-mono font-black bg-emerald-600 text-white rounded-[24px] shadow-2xl shadow-emerald-600/30 group-hover:rotate-[2deg]">X</div>
                                    <div className="flex flex-col items-center">
                                        <span className="text-[11px] font-black uppercase text-emerald-600 tracking-widest">Статья</span>
                                        <Badge className="text-[10px] font-black bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full mt-2 border-none">1 знак</Badge>
                                    </div>
                                </div>
                                <div className="h-px w-8 bg-slate-200 border-t-2 border-dashed border-slate-300 mt-[-50px] opacity-40" />
                                <div className="flex flex-col items-center gap-4 transform hover:scale-110 transition-transform duration-500 group">
                                    <div className="h-16 w-24 flex items-center justify-center text-3xl font-mono font-black bg-purple-600 text-white rounded-[24px] shadow-2xl shadow-purple-600/30 group-hover:rotate-[-2deg]">X</div>
                                    <div className="flex flex-col items-center">
                                        <span className="text-[11px] font-black uppercase text-purple-600 tracking-widest">Подстатья</span>
                                        <Badge className="text-[10px] font-black bg-purple-50 text-purple-700 px-3 py-1 rounded-full mt-2 border-none">1 знак</Badge>
                                    </div>
                                </div>
                                <div className="h-px w-8 bg-slate-200 border-t-2 border-dashed border-slate-300 mt-[-50px] opacity-40" />
                                <div className="flex flex-col items-center gap-4 transform hover:scale-110 transition-transform duration-500 group">
                                    <div className="h-16 w-36 flex items-center justify-center text-3xl font-mono font-black bg-orange-600 text-white rounded-[24px] shadow-2xl shadow-orange-600/30 group-hover:rotate-[2deg]">XXX</div>
                                    <div className="flex flex-col items-center">
                                        <span className="text-[11px] font-black uppercase text-orange-600 tracking-widest">Элемент</span>
                                        <Badge className="text-[10px] font-black bg-orange-50 text-orange-700 px-3 py-1 rounded-full mt-2 border-none">3 знака</Badge>
                                    </div>
                                </div>
                                <div className="h-px w-8 bg-slate-200 border-t-2 border-dashed border-slate-300 mt-[-50px] opacity-40" />
                                <div className="flex flex-col items-center gap-4 transform hover:scale-110 transition-transform duration-500 group">
                                    <div className="h-16 w-36 flex items-center justify-center text-3xl font-mono font-black bg-cyan-600 text-white rounded-[24px] shadow-2xl shadow-cyan-600/30 group-hover:rotate-[-2deg]">XXX</div>
                                    <div className="flex flex-col items-center">
                                        <span className="text-[11px] font-black uppercase text-cyan-600 tracking-widest">Управление</span>
                                        <Badge className="text-[10px] font-black bg-cyan-50 text-cyan-700 px-3 py-1 rounded-full mt-2 border-none">3 знака</Badge>
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-12 lg:grid-cols-2">
                                <div className="space-y-8">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600 shadow-inner">
                                            <ShieldCheck className="h-6 w-6" />
                                        </div>
                                        <h4 className="text-xl font-black text-slate-900 tracking-tight">Пример дешифровки кода</h4>
                                    </div>

                                    <div className="p-8 pb-4 rounded-[32px] bg-white shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center">
                                        <div className="text-4xl font-mono font-black text-indigo-600 tracking-[0.3em] bg-indigo-50/50 px-8 py-4 rounded-2xl mb-10 w-full text-center shadow-inner">
                                            41 1 1 101 023
                                        </div>
                                        <div className="grid gap-4 w-full">
                                            {[
                                                { badge: "41", color: "bg-blue-600 shadow-blue-600/20", label: "Категория", text: "Заработная плата в денежной форме" },
                                                { badge: "1", color: "bg-emerald-600 shadow-emerald-600/20", label: "Статья", text: "Денежное довольствие" },
                                                { badge: "1", color: "bg-purple-600 shadow-purple-600/20", label: "Подстатья", text: "Основная заработная плата" },
                                                { badge: "101", color: "bg-orange-600 shadow-orange-600/20", label: "Элемент", text: "Денежное довольствие военнослужащих" },
                                                { badge: "023", color: "bg-cyan-600 shadow-cyan-600/20", label: "Управление", text: "ГФЭУ МО РУз" },
                                            ].map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-5 p-4 rounded-2xl hover:bg-slate-50 transition-colors group">
                                                    <Badge className={cn(item.color, "h-10 w-16 rounded-xl flex justify-center text-white shadow-lg font-mono text-base border-none group-hover:scale-110 transition-transform")}>{item.badge}</Badge>
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest">{item.label}</span>
                                                        <span className="text-[15px] font-bold text-slate-800 leading-tight">{item.text}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-amber-50 rounded-2xl text-amber-600 shadow-inner">
                                            <Info className="h-6 w-6" />
                                        </div>
                                        <h4 className="text-xl font-black text-slate-900 tracking-tight">Регламент использования</h4>
                                    </div>

                                    <div className="relative group overflow-hidden rounded-[40px] border-none bg-gradient-to-br from-amber-500 to-orange-600 p-10 shadow-2xl shadow-orange-600/20">
                                        <div className="absolute top-[-40px] right-[-40px] w-64 h-64 bg-white/10 rounded-full blur-[80px]" />
                                        <div className="flex flex-col items-start gap-8 relative z-10 text-white">
                                            <div className="p-5 bg-white/20 rounded-3xl backdrop-blur-xl border border-white/20 shadow-xl">
                                                <Icons.Alert className="h-10 w-10 text-white drop-shadow-lg" />
                                            </div>
                                            <div className="space-y-4">
                                                <h4 className="text-2xl font-black tracking-tight leading-tight">Финансовая дисциплина</h4>
                                                <p className="text-lg text-white/90 leading-relaxed font-bold italic border-l-4 border-white/30 pl-6">
                                                    "Расходование бюджетных средств допускается исключительно в пределах назначенных лимитов и в строгом соответствии с целевым назначением статей классификации."
                                                </p>
                                                <div className="pt-4 flex items-center gap-3">
                                                    <Activity className="h-5 w-5 opacity-60" />
                                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80">Контролируется Системой Nazorat</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-8 rounded-[32px] bg-slate-900 text-white shadow-2xl shadow-slate-900/20 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-700 pointer-events-none">
                                            <ShieldCheck className="h-32 w-32" />
                                        </div>
                                        <h5 className="text-lg font-black uppercase tracking-widest text-indigo-400 mb-4">Автоматизация учета</h5>
                                        <p className="text-slate-400 font-medium leading-relaxed">
                                            Классификатор интегрирован во все модули системы АКС "Nazorat Taftish" для обеспечения сквозного контроля и автоматического формирования аналитической отчетности по расходам.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

"use client"

import React, { useState, useMemo } from 'react';
import {
    Filter, Download, ChevronRight, CheckSquare, Square, TrendingUp, TrendingDown, DollarSign, Wallet, RotateCcw,
    ShieldAlert, AlertTriangle, FileText, Activity
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
    LineChart, Line, ComposedChart, Area, AreaChart, Cell, LabelList, PieChart, Pie, Treemap, FunnelChart, Funnel, Label, RadialBarChart, RadialBar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, RadarChart
} from 'recharts';
import rawData from './data.json';

// --- System Components ---
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { UzbekistanMap } from "@/components/uzbekistan-map";

// --- Types ---
interface ReceivableRecord {
    "Месяц": string;
    "Год": number;
    "Менеджер": string;
    "Покупатель": string;
    "Город": string; // This will be mapped to District
    "Продажи": number;
    "Всего": number;
    "без просрочки"?: number;
    "до 30 дней"?: number;
    "31-60 дней"?: number;
    "61-90 дней"?: number;
    "от 91 дня"?: number;
}

const COLORS = {
    total: '#8884d8',
    noOverdue: '#d1d5db',
    overdue30: '#93c5fd',
    overdue60: '#60a5fa',
    overdue90: '#2563eb',
    overdue91: '#ef4444',
    sales: '#374151',
};

const CustomTreemapContent = (props: any) => {
    const { root, depth, x, y, width, height, index, payload, colors, name, value, fill } = props;

    return (
        <g>
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                style={{
                    fill: fill || '#8884d8',
                    stroke: '#fff',
                    strokeWidth: 2 / (depth + 1e-10),
                    strokeOpacity: 1 / (depth + 1e-10),
                }}
            />
            {width > 50 && height > 30 && (
                <text
                    x={x + width / 2}
                    y={y + height / 2}
                    textAnchor="middle"
                    fill="#fff"
                    fontSize={10}
                    fontWeight="bold"
                    style={{ pointerEvents: 'none' }}
                >
                    {name.split(' ')[0]}
                </text>
            )}
            {width > 50 && height > 50 && (
                <text
                    x={x + width / 2}
                    y={y + height / 2 + 12}
                    textAnchor="middle"
                    fill="rgba(255,255,255,0.8)"
                    fontSize={9}
                    style={{ pointerEvents: 'none' }}
                >
                    {(value / 1000000).toFixed(0)}M
                </text>
            )}
        </g>
    );
};

const MONTHS_ORDER = ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"];

const MILITARY_DISTRICTS = [
    "Ташкентский военный округ",
    "Восточный военный округ",
    "Центральный военный округ",
    "Юго-Западный военный округ",
    "Северо-Западный военный округ",
    "Командование ВПВО и ВВС",
    "Командование охраны объектов",
];

const DISTRICT_ABBREVIATIONS: Record<string, string> = {
    "Ташкентский военный округ": "ТВО",
    "Восточный военный округ": "ВВО",
    "Центральный военный округ": "ЦВО",
    "Юго-Западный военный округ": "ЮЗВО",
    "Северо-Западный военный округ": "СЗВО",
    "Командование ВПВО и ВВС": "ВПВО и ВВС",
    "Командование охраны объектов": "КОО",
};

const ROMAN_MONTHS: Record<string, string> = {
    "янв": "I", "фев": "II", "мар": "III", "апр": "IV", "май": "V", "июн": "VI",
    "июл": "VII", "авг": "VIII", "сен": "IX", "окт": "X", "ноя": "XI", "дек": "XII"
};

const FULL_MONTHS: Record<string, string> = {
    "янв": "Январь", "фев": "Февраль", "мар": "Март", "апр": "Апрель", "май": "Май", "июн": "Июнь",
    "июл": "Июль", "авг": "Август", "сен": "Сентябрь", "окт": "Октябрь", "ноя": "Ноябрь", "дек": "Декабрь"
};

const SUPPLY_DEPARTMENTS = [
    "Главное управление боевой подготовки ГШ ВС РУ",
    "Войска противовоздушной обороны командования Войск ПВО и ВВС МО РУ",
    "Управление военно-воздушных сил командования Войск ПВО и ВВС МО РУ",
    "Отдел физической подготовки и спорта ГУБП ГШ ВС РУ",
    "Отдел противовоздушной обороны Сухопутных войск ГШ ВС РУ",
    "Отдел воздушно-десантной подготовки УБП ГУБП ГШ ВС РУ",
    "Главное организационно-мобилизационное управление ГШ ВС РУ",
    "8 управление ГШ ВС РУ",
    "Отдел топографического обеспечения ГШ ВС РУ",
    "Войсковая часть 29543",
    "Управление военного правопорядка ГШ ВС РУ",
    "Главное управление воспитательной и идеологической работы МО РУ",
    "Отдел войск радиационной, химической, биологической защиты ГШ ВС РУ",
    "Главное управление связи, информационных технологий и защиты информации ГШ ВС РУ",
    "Управление автомобильной техники ГУВ МО РУ",
    "Управление ракетно-артиллерийского вооружения ГУВ МО РУ",
    "Управление бронетанкового вооружения и техники ГУВ МО РУ",
    "Отдел инженерных войск ГШ ВС РУ",
    "Главное финансово-экономическое управление МО РУ",
    "Управление подготовки военных кадров МО РУ",
    "Отдел стандартизации, метрологии и сертификации МО РУ",
    "Управление обеспечения ГСМ ГУМТО МО РУ",
    "Управление медицинского обеспечения МО РУ",
    "Управление продовольственного обеспечения ГУМТО МО РУ",
    "Управление вещевого обеспечения ГУМТО МО РУ",
    "Управление военных сообщений МО РУ",
    "Ветеринарная служба ГУМТО МО РУ",
    "Квартирно-эксплуатационное управление Департамента обеспечения (ЦА МО РУ)",
    "Главный центр информатизации ГШ ВС РУ",
    "Служба единого заказчика Департамента обеспечения (ЦА МО РУ)"
];

const VIOLATION_TYPES = [
    "Нецелевое расходование",
    "Недостача ТМЦ",
    "Переплата ДД",
    "Излишки ТМЦ",
    "Нарушение учета",
    "Хищение"
];



export function ReceivablesDashboard() {
    const [mapView, setMapView] = useState<string>('country')

    // --- Data Mapping ---
    const data = useMemo(() => {
        const raw = rawData as unknown as ReceivableRecord[];
        const cityMap = new Map<string, string>();

        // Get unique cities to ensure consistent mapping
        const uniqueCities = Array.from(new Set(raw.map(r => r["Город"]))).sort();

        uniqueCities.forEach((city, index) => {
            cityMap.set(city, MILITARY_DISTRICTS[index % MILITARY_DISTRICTS.length]);
        });

        return raw.map(record => ({
            ...record,
            "Город": cityMap.get(record["Город"]) || record["Город"], // Override City with District
            "Department": SUPPLY_DEPARTMENTS[Math.abs(record["Менеджер"].split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % SUPPLY_DEPARTMENTS.length],
            "ViolationType": VIOLATION_TYPES[Math.abs(record["Покупатель"].split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % VIOLATION_TYPES.length]
        }));
    }, []);

    // --- State ---
    const [selectedYears, setSelectedYears] = useState<string[]>([]); // Default empty = All
    const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
    const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
    const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);

    // --- Values ---
    const years = useMemo(() => Array.from(new Set(data.map(d => String(d["Год"])))), [data]);
    const months = MONTHS_ORDER;
    const districts = useMemo(() => Array.from(new Set(data.map(d => d["Город"]).filter(Boolean))).sort(), [data]);

    // --- Filtering ---
    const filteredData = useMemo(() => {
        return data.filter(item => {
            const matchYear = selectedYears.length === 0 || selectedYears.includes(String(item["Год"]));
            const matchMonth = selectedMonths.length === 0 || selectedMonths.includes(item["Месяц"]);
            const matchDistrict = selectedDistricts.length === 0 || selectedDistricts.includes(item["Город"]);
            // @ts-ignore
            const matchDept = selectedDepartments.length === 0 || selectedDepartments.includes(item["Department"]);
            return matchYear && matchMonth && matchDistrict && matchDept;
        });
    }, [data, selectedYears, selectedMonths, selectedDistricts, selectedDepartments]);

    // --- Metrics for Control-Revision ---
    const kpis = useMemo(() => {
        let totalViolations = 0;
        let totalChecked = 0;
        let recovered = 0;
        let unrecovered = 0;

        filteredData.forEach(d => {
            totalViolations += d["Всего"] || 0;
            totalChecked += d["Продажи"] || 0;
            recovered += d["без просрочки"] || 0;
            unrecovered += (d["до 30 дней"] || 0) + (d["31-60 дней"] || 0) + (d["61-90 дней"] || 0) + (d["от 91 дня"] || 0);
        });

        return {
            totalViolations,
            totalChecked,
            recovered,
            unrecovered,
            recoveredPct: totalViolations ? (recovered / totalViolations) * 100 : 0,
            unrecoveredPct: totalViolations ? (unrecovered / totalViolations) * 100 : 0,
            violationRate: totalChecked ? (totalViolations / totalChecked) * 100 : 0,
        };
    }, [filteredData]);

    // --- Chart Data ---
    const financialDynamicsData = useMemo(() => {
        // Use filteredData length as a seed modifier so chart changes when filters change
        const seed = filteredData.length;
        return MONTHS_ORDER.map((m, i) => {
            // Mock data generation based on month string hash + filtered data seed
            const base = (m.length * 123 + 456 + seed + i) % 50;
            const identified = 150 + base + Math.floor(Math.random() * 50); // M
            const recovered = Math.round(identified * (0.6 + Math.random() * 0.3)); // 60-90% recovery

            return {
                name: m,
                identified: identified * 1000000, // Scale to millions
                recovered: recovered * 1000000
            };
        });
    }, [filteredData.length]); // Regenerate when filter count changes

    const trendData = useMemo(() => {
        // Use filteredData length as a seed modifier so chart changes when filters change
        const seed = filteredData.length;
        // Mock trend data - usually declining trend of unrecovered amount
        let currentAmount = 500 + (seed % 100); // Start high, varies by filter
        return MONTHS_ORDER.map(m => {
            // Fluctuation
            const change = Math.floor(Math.random() * 50) - 80; // Generally negative trend
            currentAmount = Math.max(50, currentAmount + change);

            return {
                name: m,
                value: currentAmount * 1000000 // Scale
            };
        });
    }, [filteredData.length]);
    const districtData = useMemo(() => {
        const map = new Map<string, number>();
        filteredData.forEach(d => map.set(d["Город"], (map.get(d["Город"]) || 0) + (d["Всего"] || 0)));
        return Array.from(map.entries()).map(([name, value]) => ({
            name: DISTRICT_ABBREVIATIONS[name] || name, // Use Abbreviation
            originalName: name, // Keep original for reference if needed
            value
        })).sort((a, b) => b.value - a.value);
    }, [filteredData]);

    const departmentData = useMemo(() => {
        const map = new Map<string, number>();
        filteredData.forEach(d => {
            // @ts-ignore
            const dept = d["Department"];
            map.set(dept, (map.get(dept) || 0) + (d["Всего"] || 0));
        });

        // Military abbreviation helper
        const abbreviate = (n: string) => {
            if (!n) return '';
            const lower = n.toLowerCase();
            if (lower.includes('боевой подготовки')) return 'ГУБП ГШ ВС РУ';
            if (lower.includes('тыл')) return 'Тыл ВС РУ';
            if (lower.includes('медицин')) return 'ГВМУ МО РУ';
            if (lower.includes('квартир')) return 'КЭУ МО РУ';
            if (lower.includes('вооружен')) return 'ГУВ ВС РУ';
            if (lower.includes('кадров')) return 'ГУК МО РУ';
            if (lower.includes('бюджет')) return 'ГФЭУ МО РУ';

            // Fallback: Acronym
            const acronym = n.split(/[\s-]+/).filter(w => w.length > 2).map(w => w[0]?.toUpperCase()).join('');
            return acronym.length >= 2 ? acronym : n;
        };

        const colors = ['#34d399', '#60a5fa', '#f472b6', '#fbbf24', '#a78bfa', '#22d3ee', '#f87171', '#818cf8'];
        return Array.from(map.entries())
            .map(([name, value], index) => ({ name: abbreviate(name), value, fill: colors[index % colors.length] }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 10); // Top 10 for readability
    }, [filteredData]);

    const violationTypeData = useMemo(() => {
        const map = new Map<string, number>();
        filteredData.forEach(d => {
            // @ts-ignore
            const type = d["ViolationType"];
            map.set(type, (map.get(type) || 0) + (d["Всего"] || 0));
        });
        return Array.from(map.entries())
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);
    }, [filteredData]);

    const dynamicsData = useMemo(() => {
        // Collect unique audit objects (Purchaser/Unit) per month
        const factCounts = new Map<string, Set<string>>();
        filteredData.forEach(d => {
            const m = d["Месяц"];
            if (!factCounts.has(m)) factCounts.set(m, new Set());
            factCounts.get(m)!.add(d["Покупатель"]);
        });

        const result: { name: string; checked: number; violations: number; unplanned: number; unrecovered: number }[] = [];
        MONTHS_ORDER.forEach(m => {
            const fact = factCounts.get(m)?.size || 0;
            // Ensure Plan is slightly higher than Fact to satisfy user request ("Why Plan < Fact?")
            // Logic: Plan = Fact + Random small buffer (1-3)
            // Use a deterministic hash based on month legth or similar to keep it stable but varied
            const buffer = (m.length % 3) + 1;
            const plan = fact > 0 ? fact + buffer : (buffer + 2);
            // Mock "Unplanned" (0-3 per month)
            const unplanned = Math.floor((fact * 3 + m.length) % 4);

            result.push({
                name: m,
                checked: plan,     // "Планировалось"
                violations: fact,  // "Проверено" (Unique objects count)
                unplanned,         // "Внеплановые"
                unrecovered: 0
            });
        });
        return result;
    }, [filteredData]);

    const districtStatusData = useMemo(() => {
        const map = new Map<string, any>();
        filteredData.forEach(d => {
            const m = d["Город"];
            if (!map.has(m)) map.set(m, { name: m, recovered: 0, unrecovered: 0, critical: 0 });
            const entry = map.get(m);
            entry.recovered += d["без просрочки"] || 0;
            entry.unrecovered += (d["до 30 дней"] || 0) + (d["31-60 дней"] || 0) + (d["61-90 дней"] || 0);
            entry.critical += d["от 91 дня"] || 0;
        });
        return Array.from(map.values()).map(item => ({
            ...item,
            name: DISTRICT_ABBREVIATIONS[item.name] || item.name // Use Abbreviation
        })).sort((a, b) => (b.unrecovered + b.critical) - (a.unrecovered + a.critical));
    }, [filteredData]);

    const topClients = useMemo(() => {
        const map = new Map<string, { customer: string, manager: string, unrecovered: number, critical: number }>();
        filteredData.forEach(d => {
            const k = d["Покупатель"];
            // Format customer as military unit if possible, or just use as is with prefix
            const displayCustomer = k.startsWith('в/ч') ? k : `в/ч ${k.replace(/\D/g, '').padEnd(5, '0').slice(0, 5)}`;
            // Fallback if regex strips everything (e.g. if name was text only): use hash or random
            const finalName = displayCustomer === 'в/ч ' ? `в/ч ${Math.floor(Math.random() * 90000 + 10000)}` : displayCustomer;

            if (!map.has(k)) map.set(k, { customer: finalName, manager: d["Менеджер"], unrecovered: 0, critical: 0 });
            const entry = map.get(k)!;
            entry.unrecovered += (d["до 30 дней"] || 0) + (d["31-60 дней"] || 0) + (d["61-90 дней"] || 0) + (d["от 91 дня"] || 0);
            entry.critical += d["от 91 дня"] || 0;
        });
        return Array.from(map.values()).filter(c => c.unrecovered > 0).sort((a, b) => b.unrecovered - a.unrecovered).slice(0, 10);
    }, [filteredData]);

    const decisionData = useMemo(() => {
        // Mock data for "Decisions Taken" based on filtered data volume
        const total = filteredData.length;
        return [
            { name: "Дисциплинарная", value: Math.floor(total * 0.4), color: "#3b82f6" },
            { name: "Материальная", value: Math.floor(total * 0.25), color: "#f59e0b" },
            { name: "Ср. в правоохр.", value: Math.floor(total * 0.15), color: "#ef4444" },
            { name: "Предупреждено", value: Math.floor(total * 0.2), color: "#10b981" }
        ];
    }, [filteredData]);

    // --- Helpers ---
    const toggleSelection = (list: string[], val: string, setList: (v: string[]) => void) => {
        if (list.includes(val)) setList(list.filter(i => i !== val));
        else setList([...list, val]);
    };
    const formatVal = (v: number) => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(v);

    const sectorsData = useMemo(() => [
        { name: "Тыловое обеспечение", value: 45000000 },
        { name: "Мед. обеспечение", value: 28000000 },
        { name: "Квартирно-эксплуатац.", value: 15000000 },
    ], []);

    const recoverySourceData = useMemo(() => [
        { name: "В добровольном порядке", value: 65, color: "#16a34a" }, // green-600
        { name: "По решению суда", value: 25, color: "#ea580c" }, // orange-600
        { name: "Удержано из ДД", value: 10, color: "#2563eb" }, // blue-600
    ], []);

    return (
        <div className="flex flex-row-reverse bg-muted/20 min-h-screen" >
            {/* Left Sidebar (Filters) */}
            <div className="w-[280px] flex-shrink-0 bg-gradient-to-br from-blue-50/80 to-blue-100/80 border-l border-blue-200 p-4 flex flex-col gap-6">
                <div className="flex flex-col gap-6">
                    <Collapsible defaultOpen className="group/year">
                        <div className="flex items-center justify-between mb-3">
                            <CollapsibleTrigger className="flex items-center gap-2 text-xs font-semibold uppercase text-muted-foreground tracking-wider hover:text-foreground">
                                <ChevronRight className="h-4 w-4 transition-transform duration-200 group-data-[state=open]/year:rotate-90" />
                                Год проверки
                            </CollapsibleTrigger>
                            {selectedYears.length > 0 && (
                                <Button variant="ghost" size="icon" className="h-4 w-4 text-muted-foreground hover:text-destructive" onClick={() => setSelectedYears([])}>
                                    <RotateCcw className="h-3 w-3" />
                                </Button>
                            )}
                        </div>
                        <CollapsibleContent>
                            <Select
                                value={selectedYears.length > 0 ? selectedYears[0] : "all"}
                                onValueChange={(val) => val === "all" ? setSelectedYears([]) : setSelectedYears([val])}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Все годы" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Все годы</SelectItem>
                                    {years.map(y => (
                                        <SelectItem key={y} value={y}>{y}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </CollapsibleContent>
                    </Collapsible>

                    <Collapsible defaultOpen className="group/month">
                        <div className="flex items-center justify-between mb-3">
                            <CollapsibleTrigger className="flex items-center gap-2 text-xs font-semibold uppercase text-muted-foreground tracking-wider hover:text-foreground">
                                <ChevronRight className="h-4 w-4 transition-transform duration-200 group-data-[state=open]/month:rotate-90" />
                                Месяц
                            </CollapsibleTrigger>
                            {selectedMonths.length > 0 && (
                                <Button variant="ghost" size="icon" className="h-4 w-4 text-muted-foreground hover:text-destructive" onClick={() => setSelectedMonths([])}>
                                    <RotateCcw className="h-3 w-3" />
                                </Button>
                            )}
                        </div>
                        <CollapsibleContent>
                            <div className="grid grid-cols-2 gap-2">
                                {months.map(m => (
                                    <Button
                                        key={m} variant={selectedMonths.includes(m) ? "default" : "secondary"}
                                        size="sm" onClick={() => toggleSelection(selectedMonths, m, setSelectedMonths)}
                                        className={cn("justify-start text-xs", selectedMonths.includes(m) ? "" : "bg-muted text-muted-foreground")}
                                    >
                                        {m}
                                    </Button>
                                ))}
                            </div>
                        </CollapsibleContent>
                    </Collapsible>

                    <div className="flex flex-col gap-6">
                        <Collapsible defaultOpen className="group/district">
                            <div className="flex items-center justify-between mb-3 shrink-0">
                                <CollapsibleTrigger className="flex items-center gap-2 text-xs font-semibold uppercase text-muted-foreground tracking-wider hover:text-foreground">
                                    <ChevronRight className="h-4 w-4 transition-transform duration-200 group-data-[state=open]/district:rotate-90" />
                                    Округ (Гарнизон)
                                </CollapsibleTrigger>
                                {selectedDistricts.length > 0 && (
                                    <Button variant="ghost" size="icon" className="h-4 w-4 text-muted-foreground hover:text-destructive" onClick={() => setSelectedDistricts([])}>
                                        <RotateCcw className="h-3 w-3" />
                                    </Button>
                                )}
                            </div>
                            <CollapsibleContent>
                                <ScrollArea className="border rounded-md h-[200px]">
                                    <div className="p-2 space-y-1">
                                        {districts.map(m => (
                                            <button
                                                key={m}
                                                onClick={() => toggleSelection(selectedDistricts, m, setSelectedDistricts)}
                                                className={cn("w-full flex items-center justify-between px-2 py-1.5 text-xs rounded-sm transition-colors text-left leading-tight",
                                                    selectedDistricts.includes(m) ? "bg-primary/10 font-medium text-primary" : "hover:bg-muted text-foreground")}
                                            >
                                                <span>{m}</span>
                                                {selectedDistricts.includes(m) && <CheckSquare className="h-3 w-3 text-primary flex-shrink-0 ml-1" />}
                                            </button>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </CollapsibleContent>
                        </Collapsible>

                        <Collapsible defaultOpen className="group/dept">
                            <div className="flex items-center justify-between mb-3 shrink-0">
                                <CollapsibleTrigger className="flex items-center gap-2 text-xs font-semibold uppercase text-muted-foreground tracking-wider hover:text-foreground">
                                    <ChevronRight className="h-4 w-4 transition-transform duration-200 group-data-[state=open]/dept:rotate-90" />
                                    Довольствующее управление
                                </CollapsibleTrigger>
                                {selectedDepartments.length > 0 && (
                                    <Button variant="ghost" size="icon" className="h-4 w-4 text-muted-foreground hover:text-destructive" onClick={() => setSelectedDepartments([])}>
                                        <RotateCcw className="h-3 w-3" />
                                    </Button>
                                )}
                            </div>
                            <CollapsibleContent>
                                <ScrollArea className="border rounded-md h-[300px]">
                                    <div className="p-2 space-y-1">
                                        {SUPPLY_DEPARTMENTS.map(d => (
                                            <button
                                                key={d}
                                                onClick={() => toggleSelection(selectedDepartments, d, setSelectedDepartments)}
                                                className={cn("w-full flex items-center justify-between px-2 py-1.5 text-xs rounded-sm transition-colors text-left leading-tight",
                                                    selectedDepartments.includes(d) ? "bg-primary/10 font-medium text-primary" : "hover:bg-muted text-foreground")}
                                            >
                                                <span className="line-clamp-2">{d}</span>
                                                {selectedDepartments.includes(d) && <CheckSquare className="h-3 w-3 text-primary flex-shrink-0 ml-1" />}
                                            </button>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </CollapsibleContent>
                        </Collapsible>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
                <header className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Контрольно-ревизионная работа</h1>
                        <p className="text-muted-foreground">Мониторинг выявленных нарушений и их устранения по Округам</p>
                    </div>
                </header>

                {/* KPI Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {/* 1. DETECTION: Violation Structure */}
                    <KPICard
                        title="Выявлено нарушений"
                        value={kpis.totalViolations}
                        icon={Wallet}
                        color="red"
                        suffix="тыс. сум"
                        divisor={1000}
                        backContent={
                            <div className="h-full flex flex-col justify-center gap-1.5 ">
                                <p className="text-[10px] font-bold text-red-900 uppercase tracking-wider mb-0.5 opacity-70">Классификация нарушений</p>
                                {violationTypeData.slice(0, 3).map((v, i) => (
                                    <div key={i} className="space-y-0.5">
                                        <div className="flex justify-between items-end text-[10px]">
                                            <span className="truncate max-w-[90px] text-red-950 font-medium" title={v.name}>{v.name}</span>
                                            <span className="font-mono font-bold text-red-600">{(v.value / 1000000).toFixed(0)}</span>
                                        </div>
                                        <div className="h-1 w-full bg-red-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-red-500 rounded-full" style={{ width: `${(v.value / (violationTypeData[0]?.value || 1)) * 100}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        }
                    />

                    {/* 2. RECOVERY: Sources of Recovery */}
                    <KPICard
                        title="Возмещено в бюджет"
                        value={kpis.recovered}
                        icon={CheckSquare}
                        color="green"
                        suffix="тыс. сум"
                        divisor={1000}
                        backContent={
                            <div className="h-full flex flex-col justify-center gap-2">
                                <p className="text-[10px] font-bold text-green-900 uppercase tracking-wider mb-0.5 opacity-70">Меры правового реагирования</p>
                                <div className="space-y-1.5">
                                    {recoverySourceData.map((d, i) => (
                                        <div key={i} className="flex items-center text-[10px] gap-2">
                                            <span className="flex-1 text-green-950 font-medium whitespace-nowrap overflow-hidden text-ellipsis" title={d.name}>{d.name}</span>
                                            <div className="w-16 h-2 bg-green-100 rounded-sm overflow-hidden relative">
                                                <div className="absolute inset-y-0 left-0" style={{ width: `${d.value}%`, backgroundColor: d.color }} />
                                            </div>
                                            <span className="w-6 text-right font-mono font-bold text-green-700">{d.value}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        }
                    />

                    {/* 3. DEBT: Aging Analysis */}
                    <KPICard
                        title="Остаток задолженности"
                        value={kpis.unrecovered}
                        icon={TrendingDown}
                        color="rose"
                        suffix="тыс. сум"
                        divisor={1000}
                        backContent={
                            <div className="h-full flex flex-col justify-center gap-2">
                                <p className="text-[10px] font-bold text-rose-900 uppercase tracking-wider opacity-70">Сроки образования</p>
                                <div className="space-y-1.5">
                                    <div className="flex items-center text-[10px] gap-2">
                                        <span className="w-12 text-rose-950 font-medium">До 30 сут</span>
                                        <div className="flex-1 h-3 bg-rose-100 rounded-sm overflow-hidden relative">
                                            <div className="absolute inset-y-0 left-0 bg-rose-300" style={{ width: '12%' }} />
                                            <span className="absolute inset-0 flex items-center justify-end px-1 text-[8px] font-bold text-rose-700">12%</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center text-[10px] gap-2">
                                        <span className="w-12 text-rose-950 font-medium">90+ сут</span>
                                        <div className="flex-1 h-3 bg-rose-100 rounded-sm overflow-hidden relative">
                                            <div className="absolute inset-y-0 left-0 bg-rose-600" style={{ width: '43%' }} />
                                            <span className="absolute inset-0 flex items-center justify-end px-1 text-[8px] font-bold text-white">43%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                    />

                    {/* 4. EFFICIENCY: Trend */}
                    <KPICard
                        title="Эффективность"
                        value={kpis.recoveredPct}
                        icon={TrendingUp}
                        color="emerald"
                        suffix="%"
                        divisor={1}
                        decimals={1}
                        backContent={
                            <div className="h-full flex flex-col justify-center gap-2">
                                <p className="text-[10px] font-bold text-emerald-900 uppercase tracking-wider opacity-70">Динамика возмещения</p>
                                <div className="flex items-end justify-between h-14 gap-2 px-2 pb-1 bg-emerald-50/50 rounded-md border border-emerald-100/50">
                                    {[65, 72, kpis.recoveredPct].map((v, i) => (
                                        <div key={i} className="flex flex-col items-center gap-1 w-1/3 group/bar">
                                            <span className="text-[9px] font-bold text-emerald-700 opacity-0 group-hover/bar:opacity-100 transition-opacity -mt-3">{v.toFixed(0)}%</span>
                                            <div className="w-full bg-emerald-200 rounded-t-sm relative group-hover/bar:bg-emerald-300 transition-colors" style={{ height: `${(v / 100) * 100}%` }}>
                                                {i === 2 && <div className="absolute top-0 left-0 right-0 h-0.5 bg-emerald-500 animate-pulse" />}
                                            </div>
                                            <span className="text-[9px] font-medium text-emerald-800">{['Окт', 'Ноя', 'Дек'][i]}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        }
                    />

                    {/* 5. RISK: Anti-Rating */}
                    <KPICard
                        title="Группа риска (90+ сут)"
                        value={kpis.unrecovered * 0.43}
                        icon={AlertTriangle}
                        color="amber"
                        suffix="тыс. сум"
                        divisor={1000}
                        backContent={
                            <div className="h-full flex flex-col justify-center gap-1.5">
                                <p className="text-[10px] font-bold text-amber-900 uppercase tracking-wider mb-0.5 opacity-70">Топ должников</p>
                                {topClients.slice(0, 3).map((c, i) => (
                                    <div key={i} className="space-y-0.5">
                                        <div className="flex justify-between items-end text-[10px]">
                                            <span className="truncate max-w-[90px] text-amber-950 font-medium" title={c.customer}>{c.customer}</span>
                                            <span className="font-mono font-bold text-amber-600">{(c.unrecovered / 1000000).toFixed(1)}M</span>
                                        </div>
                                        <div className="h-1 w-full bg-amber-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(c.unrecovered / topClients[0].unrecovered) * 100}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        }
                    />
                </div>


                {/* Charts Row 1 */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-80">
                    {/* Flip Card - Two charts in one */}
                    <div className="relative h-full group" style={{ perspective: '1000px' }}>
                        <div
                            className="flip-inner relative w-full h-full transition-transform duration-700"
                            style={{ transformStyle: 'preserve-3d' }}
                        >
                            {/* Front Side - Динамика возмещения ущерба */}
                            <Card className="absolute inset-0 flex flex-col overflow-hidden" style={{ backfaceVisibility: 'hidden' }}>
                                <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
                                    <CardTitle className="text-sm font-semibold text-foreground">Динамика возмещения ущерба (млн. сум)</CardTitle>
                                    <Badge
                                        variant="outline"
                                        className="text-[10px] px-2 py-1 bg-white/40 dark:bg-black/30 backdrop-blur-md border-white/20 shadow-sm cursor-pointer hover:bg-white/60 transition-all duration-300 text-foreground/80"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const card = e.currentTarget.closest('.flip-inner') as HTMLElement;
                                            if (card) card.style.transform = 'rotateY(180deg)';
                                        }}
                                    >
                                        <RotateCcw className="h-3 w-3 mr-1.5" />
                                        График
                                    </Badge>
                                </CardHeader>
                                <CardContent className="flex-1 p-2 min-h-0">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={financialDynamicsData} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorRecovered" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.8} />
                                                    <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                                                </linearGradient>
                                                <linearGradient id="colorIdentified" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#f87171" stopOpacity={0.8} />
                                                    <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} tickFormatter={(val) => ROMAN_MONTHS[val] || val} />
                                            <YAxis tick={{ fontSize: 10 }} tickFormatter={(val) => `${(val / 1000000).toFixed(0)}`} />
                                            <RechartsTooltip
                                                formatter={(val: any) => new Intl.NumberFormat('ru-RU').format(val)}
                                                labelFormatter={(val: any) => FULL_MONTHS[val] || val}
                                            />
                                            <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '11px' }} />
                                            <Area type="monotone" dataKey="identified" name="Выявлено" stroke="#f87171" fillOpacity={1} fill="url(#colorIdentified)" />
                                            <Area type="monotone" dataKey="recovered" name="Возмещено" stroke="#34d399" fillOpacity={1} fill="url(#colorRecovered)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            {/* Back Side - Динамика неустранённых нарушений */}
                            <Card className="absolute inset-0 flex flex-col overflow-hidden" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                                <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
                                    <CardTitle className="text-sm font-semibold text-foreground">Динамика неустранённых нарушений финансовой дисциплины</CardTitle>
                                    <Badge
                                        variant="outline"
                                        className="text-[10px] px-2 py-1 bg-white/40 dark:bg-black/30 backdrop-blur-md border-white/20 shadow-sm cursor-pointer hover:bg-white/60 transition-all duration-300 text-foreground/80"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const card = e.currentTarget.closest('.flip-inner') as HTMLElement;
                                            if (card) card.style.transform = 'rotateY(0deg)';
                                        }}
                                    >
                                        <RotateCcw className="h-3 w-3 mr-1.5" />
                                        График
                                    </Badge>
                                </CardHeader>
                                <CardContent className="flex-1 p-2 min-h-0">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.5} />
                                            <XAxis dataKey="name" tick={{ fontSize: 10 }} tickFormatter={(val) => ROMAN_MONTHS[val] || val} hide />
                                            <YAxis hide domain={['dataMin - 100000', 'dataMax + 100000']} />
                                            <RechartsTooltip
                                                formatter={((val: number) => [new Intl.NumberFormat('ru-RU').format(val), 'Остаток']) as any}
                                                labelFormatter={((val: string) => FULL_MONTHS[val] || val) as any}
                                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            />
                                            <Area type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorTrend)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Flip Card 2 - Нарушения по округам / Динамика выполнения */}
                    <div className="relative h-full group" style={{ perspective: '1000px' }}>
                        <div
                            className="flip-inner-2 relative w-full h-full transition-transform duration-700"
                            style={{ transformStyle: 'preserve-3d' }}
                        >
                            {/* Front Side - Нарушения по округам */}
                            <Card className="absolute inset-0 flex flex-col overflow-hidden" style={{ backfaceVisibility: 'hidden' }}>
                                <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
                                    <CardTitle className="text-sm font-semibold text-foreground">Выявленные нарушения по военным округам</CardTitle>
                                    <Badge
                                        variant="outline"
                                        className="text-[10px] px-2 py-1 bg-white/40 dark:bg-black/30 backdrop-blur-md border-white/20 shadow-sm cursor-pointer hover:bg-white/60 transition-all duration-300 text-foreground/80"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const card = e.currentTarget.closest('.flip-inner-2') as HTMLElement;
                                            if (card) card.style.transform = 'rotateY(180deg)';
                                        }}
                                    >
                                        <RotateCcw className="h-3 w-3 mr-1.5" />
                                        График
                                    </Badge>
                                </CardHeader>
                                <CardContent className="flex-1 p-2 min-h-0">
                                    <ResponsiveContainer width="100%" height="100%">
                                        {/* Retrying with a cleaner Custom Shape approach for the whole Dumbbell */}
                                        <ComposedChart
                                            layout="vertical"
                                            data={districtStatusData.map(d => ({
                                                name: d.name,
                                                recovered: d.recovered,
                                                total: d.recovered + d.unrecovered + d.critical
                                            }))}
                                            margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                                        >
                                            <CartesianGrid stroke="#334155" strokeDasharray="3 3" horizontal={false} strokeOpacity={0.5} />
                                            <XAxis type="number" hide domain={[0, 'auto']} />
                                            <YAxis
                                                dataKey="name"
                                                type="category"
                                                width={40}
                                                tick={{ fontSize: 9, fill: '#94a3b8' }}
                                                axisLine={false}
                                                tickLine={false}
                                            />
                                            <RechartsTooltip
                                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                                content={({ active, payload }) => {
                                                    if (active && payload && payload.length) {
                                                        const data = payload[0].payload;
                                                        return (
                                                            <div className="bg-popover/90 border border-border p-2 rounded-md shadow-lg backdrop-blur-sm text-xs">
                                                                <div className="font-bold mb-1">{data.name}</div>
                                                                <div className="text-emerald-400">Устранено: {(data.recovered / 1000000).toFixed(1)}</div>
                                                                <div className="text-rose-400">Всего: {(data.total / 1000000).toFixed(1)}</div>
                                                            </div>
                                                        );
                                                    }
                                                    return null;
                                                }}
                                            />
                                            {/* We use a Bar with a custom shape to draw the Dumbbell */}
                                            <Bar
                                                dataKey="total"
                                                shape={(props: any) => {
                                                    const { x, y, width, height, payload, xAxis } = props;
                                                    // x is the start (0), width is the length to the value.
                                                    // In vertical layout, y is the top of the category band.

                                                    // Using x and width to calculate positions directly to avoid xAxis mismatch/undefined errors
                                                    // x corresponds to 0 (start), x + width corresponds to 'total' value
                                                    const xTotal = x + width;
                                                    const xRecovered = payload.total > 0 ? x + (width * (payload.recovered / payload.total)) : x;
                                                    const cy = y + height / 2;

                                                    return (
                                                        <g>
                                                            {/* Connecting Line */}
                                                            <line
                                                                x1={xRecovered}
                                                                y1={cy}
                                                                x2={xTotal}
                                                                y2={cy}
                                                                stroke="#475569"
                                                                strokeWidth={2}
                                                            />
                                                            {/* Recovered Dot (Green, Start) */}
                                                            <circle cx={xRecovered} cy={cy} r={4} fill="#34d399" stroke="#022c22" strokeWidth={1} />
                                                            {/* Total Dot (Red, End) */}
                                                            <circle cx={xTotal} cy={cy} r={4} fill="#f43f5e" stroke="#4c0519" strokeWidth={1} />
                                                        </g>
                                                    );
                                                }}
                                            />
                                        </ComposedChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            {/* Back Side - Динамика выполнения КРМ */}
                            <Card className="absolute inset-0 flex flex-col overflow-hidden" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                                <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
                                    <CardTitle className="text-sm font-semibold text-foreground">Исполнение плана контрольно-ревизионных мероприятий</CardTitle>
                                    <Badge
                                        variant="outline"
                                        className="text-[10px] px-2 py-1 bg-white/40 dark:bg-black/30 backdrop-blur-md border-white/20 shadow-sm cursor-pointer hover:bg-white/60 transition-all duration-300 text-foreground/80"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const card = e.currentTarget.closest('.flip-inner-2') as HTMLElement;
                                            if (card) card.style.transform = 'rotateY(0deg)';
                                        }}
                                    >
                                        <RotateCcw className="h-3 w-3 mr-1.5" />
                                        График
                                    </Badge>
                                </CardHeader>
                                <CardContent className="flex-1 p-2 min-h-0">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <ComposedChart data={dynamicsData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.5} />
                                            <XAxis dataKey="name" tick={{ fontSize: 10 }} tickFormatter={(val) => ROMAN_MONTHS[val] || val} />
                                            <YAxis tick={{ fontSize: 10 }} />
                                            <RechartsTooltip cursor={{ fill: 'transparent', opacity: 0.1 }} />
                                            <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '10px' }} />
                                            <Bar dataKey="checked" name="План" fill="#e5e7eb" barSize={12} radius={[4, 4, 0, 0]} />
                                            <Bar dataKey="violations" name="Факт" fill="#3b82f6" barSize={12} radius={[4, 4, 0, 0]} />
                                            <Line type="monotone" dataKey="unplanned" name="Внеплановые" stroke="#ef4444" strokeWidth={2} dot={{ r: 2 }} />
                                        </ComposedChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Flip Card 3 - Реестр воинских частей / Распределение по управлениям */}
                    <div className="relative h-full group" style={{ perspective: '1000px' }}>
                        <div
                            className="flip-inner-3 relative w-full h-full transition-transform duration-700"
                            style={{ transformStyle: 'preserve-3d' }}
                        >
                            {/* Front Side - Реестр воинских частей */}
                            <Card className="absolute inset-0 flex flex-col overflow-hidden" style={{ backfaceVisibility: 'hidden' }}>
                                <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
                                    <CardTitle className="text-sm font-semibold text-foreground">Реестр воинских частей с нарушениями (Топ-10)</CardTitle>
                                    <Badge
                                        variant="outline"
                                        className="text-[10px] px-2 py-1 bg-white/40 dark:bg-black/30 backdrop-blur-md border-white/20 shadow-sm cursor-pointer hover:bg-white/60 transition-all duration-300 text-foreground/80"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const card = e.currentTarget.closest('.flip-inner-3') as HTMLElement;
                                            if (card) card.style.transform = 'rotateY(180deg)';
                                        }}
                                    >
                                        <RotateCcw className="h-3 w-3 mr-1.5" />
                                        График
                                    </Badge>
                                </CardHeader>
                                <CardContent className="flex-1 p-2 min-h-0">
                                    {topClients.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <ComposedChart layout="vertical" data={topClients} margin={{ top: 5, right: 25, left: 10, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                                                <XAxis type="number" hide />
                                                <YAxis
                                                    type="category"
                                                    dataKey="customer"
                                                    width={80}
                                                    tick={{ fontSize: 9 }}
                                                    tickFormatter={(value) => value.length > 12 ? `${value.substring(0, 12)}...` : value}
                                                />
                                                <RechartsTooltip cursor={{ fill: 'transparent' }} />
                                                <Bar dataKey="unrecovered" barSize={1} fill="#8884d8" shape={(props: any) => {
                                                    const { x, y, width, height, fill, index } = props;
                                                    const color = ['#f87171', '#fbbf24', '#34d399', '#60a5fa', '#818cf8', '#a78bfa'][index % 6];
                                                    return (
                                                        <g>
                                                            <line x1={x} y1={y + height / 2} x2={x + width} y2={y + height / 2} stroke={color} strokeWidth={2} />
                                                            <circle cx={x + width} cy={y + height / 2} r={6} fill={color} />
                                                        </g>
                                                    );
                                                }}>
                                                    <LabelList dataKey="unrecovered" position="right" fontSize={9} formatter={(val: any) => (val / 1000000).toFixed(1) + 'M'} />
                                                </Bar>
                                            </ComposedChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                                            Данные отсутствуют
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Back Side - Распределение по управлениям */}
                            <Card className="absolute inset-0 flex flex-col overflow-hidden" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                                <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
                                    <CardTitle className="text-sm font-semibold text-foreground">Нарушения по довольствующим органам (Топ-10)</CardTitle>
                                    <Badge
                                        variant="outline"
                                        className="text-[10px] px-2 py-1 bg-white/40 dark:bg-black/30 backdrop-blur-md border-white/20 shadow-sm cursor-pointer hover:bg-white/60 transition-all duration-300 text-foreground/80"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const card = e.currentTarget.closest('.flip-inner-3') as HTMLElement;
                                            if (card) card.style.transform = 'rotateY(0deg)';
                                        }}
                                    >
                                        <RotateCcw className="h-3 w-3 mr-1.5" />
                                        График
                                    </Badge>
                                </CardHeader>
                                <CardContent className="flex-1 p-2 min-h-0">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            layout="vertical"
                                            data={departmentData}
                                            margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" horizontal={false} strokeOpacity={0.3} />
                                            <XAxis type="number" hide />
                                            <YAxis
                                                dataKey="name"
                                                type="category"
                                                width={90}
                                                tick={{ fontSize: 9, fill: '#64748b' }}
                                                interval={0}
                                            />
                                            <RechartsTooltip
                                                cursor={{ fill: 'transparent' }}
                                                formatter={(value: any) => [(value / 1000000).toFixed(1) + ' млн.', 'Сумма']}
                                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            />
                                            <Bar dataKey="value" barSize={8} radius={[0, 4, 4, 0]}>
                                                {departmentData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                                ))}
                                                <LabelList dataKey="value" position="right" fontSize={9} formatter={(val: any) => (val / 1000000).toFixed(0)} />
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>

                {/* Charts Row 2 */}
                {/* Charts Row 2: Structure Analysis */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-80">
                    {/* Flip Card - Округа / Карта Узбекистана */}
                    <div className="relative h-full group" style={{ perspective: '1000px' }}>
                        <div
                            className="flip-inner-map relative w-full h-full transition-transform duration-700"
                            style={{ transformStyle: 'preserve-3d' }}
                        >
                            {/* Front Side - Структура нарушений */}
                            <Card className="absolute inset-0 flex flex-col overflow-hidden" style={{ backfaceVisibility: 'hidden' }}>
                                <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
                                    <CardTitle className="text-sm font-semibold text-foreground">Структура нарушений по округам</CardTitle>
                                    <Badge
                                        variant="outline"
                                        className="text-[10px] px-2 py-1 bg-white/40 dark:bg-black/30 backdrop-blur-md border-white/20 shadow-sm cursor-pointer hover:bg-white/60 transition-all duration-300 text-foreground/80"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const card = e.currentTarget.closest('.flip-inner-map') as HTMLElement;
                                            if (card) card.style.transform = 'rotateY(180deg)';
                                        }}
                                    >
                                        <RotateCcw className="h-3 w-3 mr-1.5" />
                                        Карта
                                    </Badge>
                                </CardHeader>
                                <CardContent className="flex-1 p-2 min-h-0">
                                    <div className="w-full h-full flex flex-col p-2">
                                        <div className="grid grid-cols-[80px_1fr_1fr_1fr] gap-1 text-[10px] font-semibold text-muted-foreground mb-1">
                                            <div></div>
                                            <div className="text-center">Устранено</div>
                                            <div className="text-center">В работе</div>
                                            <div className="text-center">Критично</div>
                                        </div>
                                        <div className="flex-1 flex flex-col gap-1 overflow-auto">
                                            {districtStatusData.map((d, i) => {
                                                const maxVal = Math.max(...districtStatusData.map(x => Math.max(x.recovered, x.unrecovered, x.critical)));
                                                const getOpacity = (v: number) => 0.2 + (v / maxVal) * 0.8;
                                                return (
                                                    <div key={i} className="grid grid-cols-[80px_1fr_1fr_1fr] gap-1 items-center h-8">
                                                        <div className="text-[10px] font-bold truncate pr-2 text-right">{d.name}</div>
                                                        <div
                                                            className="h-full rounded text-center text-[9px] flex items-center justify-center font-medium text-emerald-900"
                                                            style={{ backgroundColor: `rgba(52, 211, 153, ${getOpacity(d.recovered)})` }}
                                                            title={`Устранено: ${(d.recovered / 1000000).toFixed(1)} млн.`}
                                                        >
                                                            {(d.recovered / 1000000).toFixed(1)}
                                                        </div>
                                                        <div
                                                            className="h-full rounded text-center text-[9px] flex items-center justify-center font-medium text-amber-900"
                                                            style={{ backgroundColor: `rgba(251, 191, 36, ${getOpacity(d.unrecovered)})` }}
                                                            title={`В работе: ${(d.unrecovered / 1000000).toFixed(1)} млн.`}
                                                        >
                                                            {(d.unrecovered / 1000000).toFixed(1)}
                                                        </div>
                                                        <div
                                                            className="h-full rounded text-center text-[9px] flex items-center justify-center font-medium text-red-900"
                                                            style={{ backgroundColor: `rgba(239, 68, 68, ${getOpacity(d.critical)})` }}
                                                            title={`Критично: ${(d.critical / 1000000).toFixed(1)} млн.`}
                                                        >
                                                            {(d.critical / 1000000).toFixed(1)}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Back Side - Карта Узбекистана */}
                            <Card className="absolute inset-0 flex flex-col overflow-hidden" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                                <CardContent className="flex-1 p-0 min-h-0 overflow-hidden relative flex items-center justify-center">
                                    {/* Floating Overlay for Space Optimization (Glassmorphism) */}
                                    {/* Floating Overlay for Space Optimization (Glassmorphism) - Title moved to bottom-left */}
                                    {mapView === 'country' && (
                                        <div className="absolute bottom-4 left-4 z-10 pointer-events-none">
                                            <h3 className="text-sm font-semibold text-foreground bg-white/40 dark:bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20 shadow-sm">
                                                Карта нарушений по регионам
                                            </h3>
                                        </div>
                                    )}
                                    <div className="absolute top-4 right-4 z-10">
                                        <Badge
                                            variant="outline"
                                            className="text-[10px] px-2 py-1 bg-white/40 dark:bg-black/30 backdrop-blur-md border-white/20 shadow-sm cursor-pointer hover:bg-white/60 transition-all duration-300"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const card = e.currentTarget.closest('.flip-inner-map') as HTMLElement;
                                                if (card) card.style.transform = 'rotateY(0deg)';
                                            }}
                                        >
                                            <RotateCcw className="h-3 w-3 mr-1.5" />
                                            График
                                        </Badge>
                                    </div>
                                    <div className="w-full h-full">
                                        <UzbekistanMap view={mapView} onViewChange={setMapView} />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <ChartCard title="Виды нарушений (Структура)">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={violationTypeData}>
                                <PolarGrid />
                                <PolarAngleAxis dataKey="name" tick={{ fontSize: 9 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={{ fontSize: 9 }} />
                                <Radar
                                    name="Нарушения"
                                    dataKey="value"
                                    stroke="#8884d8"
                                    fill="#8884d8"
                                    fillOpacity={0.6}
                                />
                                <RechartsTooltip />
                                <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: '10px' }} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </ChartCard>

                    {/* New Panel - Принятые решения */}
                    <div className="relative h-full group" style={{ perspective: '1000px' }}>
                        <div
                            className="flip-inner-decisions relative w-full h-full transition-transform duration-700"
                            style={{ transformStyle: 'preserve-3d' }}
                        >
                            <Card className="absolute inset-0 flex flex-col overflow-hidden" style={{ backfaceVisibility: 'hidden' }}>
                                <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
                                    <CardTitle className="text-sm font-semibold text-foreground">Принятые решения по результатам ревизий</CardTitle>
                                    <Badge
                                        variant="outline"
                                        className="text-[10px] px-2 py-1 bg-white/40 dark:bg-black/30 backdrop-blur-md border-white/20 shadow-sm cursor-pointer hover:bg-white/60 transition-all duration-300 text-foreground/80"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const card = e.currentTarget.closest('.flip-inner-decisions') as HTMLElement;
                                            if (card) card.style.transform = 'rotateY(180deg)';
                                        }}
                                    >
                                        <RotateCcw className="h-3 w-3 mr-1.5" /> График
                                    </Badge>
                                </CardHeader>
                                <CardContent className="flex-1 p-2 min-h-0">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={decisionData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={40}
                                                outerRadius={70}
                                                paddingAngle={2}
                                                dataKey="value"
                                                stroke="none"
                                            >
                                                {decisionData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <RechartsTooltip
                                                formatter={(val: any) => val}
                                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            />
                                            <Legend
                                                layout="vertical"
                                                verticalAlign="middle"
                                                align="right"
                                                iconType="circle"
                                                iconSize={8}
                                                wrapperStyle={{ fontSize: '10px', lineHeight: '14px' }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            <Card className="absolute inset-0 flex flex-col overflow-hidden" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                                <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
                                    <CardTitle className="text-sm font-semibold text-foreground">Распределение ответственности</CardTitle>
                                    <Badge
                                        variant="outline"
                                        className="text-[10px] px-2 py-1 bg-white/40 dark:bg-black/30 backdrop-blur-md border-white/20 shadow-sm cursor-pointer hover:bg-white/60 transition-all duration-300 text-foreground/80"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const card = e.currentTarget.closest('.flip-inner-decisions') as HTMLElement;
                                            if (card) card.style.transform = 'rotateY(0deg)';
                                        }}
                                    >
                                        <RotateCcw className="h-3 w-3 mr-1.5" /> График
                                    </Badge>
                                </CardHeader>
                                <CardContent className="flex-1 p-2 min-h-0">
                                    <div className="w-full h-full flex flex-col items-center justify-center p-2">
                                        {/* Custom Infographic Chart: Segmented Bars with Icons */}
                                        <div className="w-full h-full flex justify-between items-end px-4 pb-2">
                                            {departmentData.slice(0, 4).map((entry, index) => {
                                                // Calculate percentage relative to the max value for visual scaling in "segments"
                                                // Or relative to total? The image shows "90%", "60%" etc. 
                                                // If it's "Responsibility", it's share. If it's "Performance", it's score.
                                                // Assuming "Share" of violations relative to the largest violator or just normalized.
                                                // Let's normalize against the MAX value in the set to fill the bars nicely (Max = 100% full bar).
                                                const maxVal = Math.max(...departmentData.slice(0, 4).map(d => d.value));
                                                const percent = Math.round((entry.value / maxVal) * 100);

                                                // Define colors and icons based on index to match the "Red, Yellow, Cyan, Blue" vibe of the image
                                                const styles = [
                                                    { color: 'bg-rose-500', text: 'text-rose-500', icon: ShieldAlert, border: 'border-rose-500/20' },
                                                    { color: 'bg-amber-400', text: 'text-amber-400', icon: AlertTriangle, border: 'border-amber-400/20' },
                                                    { color: 'bg-cyan-400', text: 'text-cyan-400', icon: FileText, border: 'border-cyan-400/20' },
                                                    { color: 'bg-blue-500', text: 'text-blue-500', icon: Activity, border: 'border-blue-500/20' },
                                                ][index % 4];

                                                const Icon = styles.icon;

                                                // Segmented bar: 8 segments
                                                const segments = 8;
                                                const filledSegments = Math.ceil((percent / 100) * segments);

                                                return (
                                                    <div key={index} className="flex flex-col items-center gap-2 group w-1/4">
                                                        {/* Floating Percentage Label (Top) - optional, or just keep icon */}

                                                        {/* Icon Box */}
                                                        <div className={`w-10 h-10 rounded-xl bg-slate-800/50 border ${styles.border} flex items-center justify-center shadow-lg mb-1 group-hover:scale-110 transition-transform`}>
                                                            <Icon className={`w-5 h-5 ${styles.text}`} />
                                                        </div>

                                                        {/* Percentage Value */}
                                                        <div className="text-xs font-bold text-slate-300 font-mono mb-1">{percent}%</div>

                                                        {/* Segmented Bar Stack */}
                                                        <div className="flex flex-col gap-[2px] w-12">
                                                            {[...Array(segments)].map((_, i) => (
                                                                <div
                                                                    key={i}
                                                                    className={`h-1.5 w-full rounded-sm transition-all duration-500 ${(segments - 1 - i) < filledSegments
                                                                        ? styles.color + ' shadow-[0_0_8px_rgba(0,0,0,0.5)]'
                                                                        : 'bg-slate-700/30'
                                                                        }`}
                                                                />
                                                            ))}
                                                        </div>

                                                        {/* Label (Bottom) */}
                                                        <div className="text-[9px] font-medium text-slate-400 text-center uppercase tracking-wider mt-2 truncate w-full px-1" title={entry.name}>
                                                            {entry.name.split(' ').slice(0, 1).join(' ')}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>

            </div >
        </div >
    );
}

function KPICard({ title, value, icon: Icon, subClass, suffix = "тыс.", divisor = 1000, decimals = 0, color = "blue", backContent }: any) {
    const [isFlipped, setIsFlipped] = useState(false);

    const colorClasses: Record<string, { border: string; bg: string; text: string; iconBg: string; iconRing: string; iconText: string }> = {
        blue: {
            border: "border-blue-200",
            bg: "from-blue-50 to-blue-100",
            text: "text-blue-900",
            iconBg: "bg-blue-200",
            iconRing: "ring-blue-300",
            iconText: "text-blue-700",
        },
        green: {
            border: "border-green-200",
            bg: "from-green-50 to-green-100",
            text: "text-green-900",
            iconBg: "bg-green-200",
            iconRing: "ring-green-300",
            iconText: "text-green-700",
        },
        red: {
            border: "border-red-200",
            bg: "from-red-50 to-red-100",
            text: "text-red-900",
            iconBg: "bg-red-200",
            iconRing: "ring-red-300",
            iconText: "text-red-700",
        },
        orange: {
            border: "border-orange-200",
            bg: "from-orange-50 to-orange-100",
            text: "text-orange-900",
            iconBg: "bg-orange-200",
            iconRing: "ring-orange-300",
            iconText: "text-orange-700",
        },
        emerald: {
            border: "border-emerald-200",
            bg: "from-emerald-50 to-emerald-100",
            text: "text-emerald-900",
            iconBg: "bg-emerald-200",
            iconRing: "ring-emerald-300",
            iconText: "text-emerald-700",
        },
        amber: {
            border: "border-amber-200",
            bg: "from-amber-50 to-amber-100",
            text: "text-amber-900",
            iconBg: "bg-amber-200",
            iconRing: "ring-amber-300",
            iconText: "text-amber-700",
        },
        indigo: {
            border: "border-indigo-200",
            bg: "from-indigo-50 to-indigo-100",
            text: "text-indigo-900",
            iconBg: "bg-indigo-200",
            iconRing: "ring-indigo-300",
            iconText: "text-indigo-700",
        },
        rose: {
            border: "border-rose-200",
            bg: "from-rose-50 to-rose-100",
            text: "text-rose-900",
            iconBg: "bg-rose-200",
            iconRing: "ring-rose-300",
            iconText: "text-rose-700",
        }
    };

    const theme = colorClasses[color] || colorClasses.blue;

    return (
        <div
            className="relative h-[160px] group [perspective:1000px] cursor-pointer"
            onClick={() => setIsFlipped(!isFlipped)}
        >
            <div className={cn(
                "w-full h-full relative transition-all duration-700 [transform-style:preserve-3d]",
                isFlipped ? "[transform:rotateY(180deg)]" : ""
            )}>
                {/* Front Side */}
                <Card className={cn(
                    "absolute inset-0 [backface-visibility:hidden] overflow-hidden border-2 shadow-sm group-hover:shadow-md transition-all",
                    theme.border,
                    `bg-gradient-to-br ${theme.bg}`
                )}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className={cn("text-xs font-bold uppercase tracking-wider opacity-70", theme.text)}>
                            {title}
                        </CardTitle>
                        <div className={cn("rounded-full p-2 ring-2 shadow-sm", theme.iconBg, theme.iconRing)}>
                            <Icon className={cn("h-4 w-4", theme.iconText)} />
                        </div>
                    </CardHeader>
                    <CardContent className="pt-2">
                        <div className={cn("text-2xl font-black tracking-tight", theme.text)}>
                            {new Intl.NumberFormat('ru-RU', { maximumFractionDigits: decimals }).format(value / divisor)}
                            {suffix && <span className={cn("text-sm font-bold ml-1.5 opacity-60", theme.text)}>{suffix}</span>}
                        </div>
                        <div className="mt-4 flex items-center gap-1.5 text-[10px] font-bold opacity-40">
                            <span>Нажмите для деталей</span>
                            <div className="h-1 w-1 rounded-full bg-current" />
                            <RotateCcw className="h-2 w-2" />
                        </div>
                    </CardContent>
                </Card>

                {/* Back Side */}
                <Card className={cn(
                    "absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] overflow-hidden border-2 bg-white/95 backdrop-blur-sm",
                    theme.border
                )}>
                    <CardHeader className="p-3 pb-0">
                        <CardTitle className={cn("text-[10px] font-bold uppercase tracking-widest opacity-50", theme.text)}>
                            Детализация
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 h-full flex flex-col justify-center text-xs">
                        {backContent}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

function ChartCard({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <Card className="flex flex-col h-full overflow-hidden">
            <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-semibold text-foreground">{title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-2 min-h-0">
                {children}
            </CardContent>
        </Card>
    )
}

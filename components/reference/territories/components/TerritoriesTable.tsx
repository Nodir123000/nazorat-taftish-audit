import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, MapPin, Building2, Map, LayoutList, LocateFixed } from "lucide-react"
import { Region, District, LocalizedContent } from "../types"
import { RegionRow } from "./RegionRow"
import { DistrictRow } from "./DistrictRow"

interface TableProps {
    data: (Region | District)[]
    activeTab: "regions" | "districts"
    loading: boolean
    onEdit: (item: any) => void
    onDelete: (id: number) => void
    getLocalizedName: (obj: LocalizedContent) => string
    getSubtextNames: (obj: LocalizedContent) => string
    t: (ru: string, uzL: string, uzC: string) => string
    ui: (key: string, fallback?: string) => string
}

export function TerritoriesTable({ data, activeTab, loading, onEdit, onDelete, getLocalizedName, getSubtextNames, t, ui }: TableProps) {
    if (loading) {
        return (
            <div className="p-12 flex justify-center items-center">
                <div className="flex flex-col items-center gap-3 animate-pulse">
                    <div className="h-12 w-12 rounded-full bg-muted"></div>
                    <div className="h-4 w-32 rounded bg-muted">{ui("common.loading")}</div>
                </div>
            </div>
        )
    }

    if (data.length === 0) {
        return (
            <div className="p-12 flex justify-center items-center">
                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                    <Search className="h-10 w-10 opacity-20" />
                    <span className="font-medium">{ui("common.nothing_found")}</span>
                </div>
            </div>
        )
    }

    const isRegion = activeTab === 'regions'

    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent border-b border-border/50 h-16 bg-muted/20">
                        <TableHead className="w-15 px-6 font-bold text-[11px] uppercase tracking-wider text-muted-foreground/70">ID</TableHead>
                        <TableHead className="px-6 font-bold text-[11px] uppercase tracking-wider text-muted-foreground/70 border-l border-border/5">
                            <div className="flex items-center gap-1.5">
                                {isRegion ? <Map className="h-3.5 w-3.5 text-blue-500/70" /> : <LocateFixed className="h-3.5 w-3.5 text-indigo-500/70" />}
                                {ui("ref.territories.field.name")}
                            </div>
                        </TableHead>
                        {isRegion ? (
                            <TableHead className="px-6 font-bold text-[11px] uppercase tracking-wider text-muted-foreground/70 border-l border-border/5 w-35">{ui("ref.territories.field.type")}</TableHead>
                        ) : (
                            <TableHead className="px-6 font-bold text-[11px] uppercase tracking-wider text-muted-foreground/70 border-l border-border/5">
                                <div className="flex items-center gap-1.5 ">
                                    <MapPin className="h-3.5 w-3.5 text-emerald-500/70" />
                                    {ui("ref.territories.field.region")}
                                </div>
                            </TableHead>
                        )}
                        <TableHead className="px-6 font-bold text-[11px] uppercase tracking-wider text-muted-foreground/70 border-l border-border/5 w-35">
                            {isRegion ? (
                                <div className="flex items-center gap-1.5">
                                    <LayoutList className="h-3.5 w-3.5 text-orange-500/70" />
                                    {ui("ref.territories.tab_districts")}
                                </div>
                            ) : ui("ref.territories.field.type")}
                        </TableHead>
                        <TableHead className="px-6 font-bold text-[11px] uppercase tracking-wider text-muted-foreground/70 border-l border-border/5 w-35">{ui("ref.territories.field.status")}</TableHead>
                        <TableHead className="px-6 font-bold text-[11px] uppercase tracking-wider text-muted-foreground/70 border-l border-border/5 text-right w-25">{ui("common.actions")}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((item, idx) => (
                        isRegion ? (
                            <RegionRow
                                key={item.id}
                                item={item as Region}
                                idx={idx}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                getLocalizedName={getLocalizedName}
                                getSubtextNames={getSubtextNames}
                                t={t}
                                ui={ui}
                            />
                        ) : (
                            <DistrictRow
                                key={item.id}
                                item={item as District}
                                idx={idx}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                getLocalizedName={getLocalizedName}
                                getSubtextNames={getSubtextNames}
                                t={t}
                                ui={ui}
                            />
                        )
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

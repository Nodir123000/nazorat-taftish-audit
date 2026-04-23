import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Check, ChevronsUpDown } from "lucide-react"
import { DistrictFormData, Lang, Region, LocalizedContent } from "../../types"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { useTerritoryReferences } from "../../hooks/useTerritoryReferences"

interface DistrictFormProps {
    form: DistrictFormData
    setForm: (data: DistrictFormData) => void
    regions: Region[]
    errors: any
    getLocalizedName: (obj: LocalizedContent) => string
    t: (ru: string, uzL: string, uzC: string) => string
    ui: (key: string, fallback?: string) => string
}

export function DistrictForm({ form, setForm, regions, errors, getLocalizedName, t, ui }: DistrictFormProps) {
    const [openRegionSelect, setOpenRegionSelect] = useState(false)
    const { references } = useTerritoryReferences()

    const handleNameChange = (lang: string, value: string) => {
        setForm({
            ...form,
            name: { ...form.name, [lang]: value }
        })
    }

    return (
        <div className="grid gap-6 py-4">
            <div className="space-y-4">
                <div className="text-[11px] font-black uppercase tracking-widest text-indigo-600 flex items-center gap-2">
                    <span className="h-1 w-8 bg-indigo-600 rounded-full" />
                    {ui("ref.territories.field.name")}
                </div>

                <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase text-muted-foreground pl-1">
                        {ui("ref.territories.field.ru")} <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative group">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-xs text-muted-foreground group-focus-within:text-blue-500 transition-colors">RU</span>
                        <Input
                            value={form.name[Lang.RU]}
                            onChange={e => handleNameChange(Lang.RU, e.target.value)}
                            className={cn("h-11 rounded-xl bg-muted/40 border-none pl-10 focus:bg-white transition-all font-bold", errors?.name?.[Lang.RU] && "ring-2 ring-destructive/20")}
                            placeholder={ui("ref.territories.placeholder.name")}
                        />
                    </div>
                    {errors?.name?.[Lang.RU] && (
                        <p className="text-sm text-destructive mt-1 ml-1 font-medium">{errors.name[Lang.RU]._errors[0]}</p>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase text-muted-foreground pl-1">
                            {ui("ref.territories.field.uz_latn")}
                        </Label>
                        <div className="relative group">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-xs text-muted-foreground group-focus-within:text-blue-500 transition-colors">UZ</span>
                            <Input
                                value={form.name[Lang.UZ_LATN] || ""}
                                onChange={e => handleNameChange(Lang.UZ_LATN, e.target.value)}
                                className="h-11 rounded-xl bg-muted/40 border-none pl-10 focus:bg-white transition-all font-medium"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase text-muted-foreground pl-1">
                            {ui("ref.territories.field.uz_cyrl")}
                        </Label>
                        <div className="relative group">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-xs text-muted-foreground group-focus-within:text-blue-500 transition-colors">ЎЗ</span>
                            <Input
                                value={form.name[Lang.UZ_CYRL] || ""}
                                onChange={e => handleNameChange(Lang.UZ_CYRL, e.target.value)}
                                className="h-11 rounded-xl bg-muted/40 border-none pl-10 focus:bg-white transition-all font-medium"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-4 pt-2">
                <div className="text-[11px] font-black uppercase tracking-widest text-emerald-500 flex items-center gap-2">
                    <span className="h-1 w-8 bg-emerald-500 rounded-full" />
                    {ui("ref.territories.field.link")}
                </div>

                <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase text-muted-foreground pl-1">
                        {ui("ref.territories.field.region")} <span className="text-destructive">*</span>
                    </Label>
                    <Popover open={openRegionSelect} onOpenChange={setOpenRegionSelect}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={openRegionSelect}
                                className={cn("w-full justify-between h-11 rounded-xl bg-muted/40 border-none font-normal", !form.region && "text-muted-foreground")}
                            >
                                {form.region
                                    ? getLocalizedName(regions.find((r) => r.id.toString() === form.region)?.name || { [Lang.RU]: "", [Lang.UZ_LATN]: "", [Lang.UZ_CYRL]: "" })
                                    : ui("ref.territories.placeholder.select_region")}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-100 p-0 rounded-xl" align="start">
                            <Command>
                                <CommandInput placeholder={ui("ref.territories.placeholder.search_region")} />
                                <CommandList>
                                    <CommandEmpty>{ui("ref.territories.not_found_region")}</CommandEmpty>
                                    <CommandGroup>
                                        {regions.map((region) => (
                                            <CommandItem
                                                key={region.id}
                                                value={getLocalizedName(region.name)}
                                                onSelect={() => {
                                                    setForm({ ...form, region: region.id.toString() })
                                                    setOpenRegionSelect(false)
                                                }}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        form.region === region.id.toString() ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                                {getLocalizedName(region.name)}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                    {errors?.region && (
                        <p className="text-sm text-destructive mt-1 ml-1 font-medium">{errors.region._errors[0]}</p>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase text-muted-foreground pl-1">{ui("ref.territories.field.type")}</Label>
                        <Select
                            value={form.type}
                            onValueChange={(val: any) => setForm({ ...form, type: val })}
                        >
                            <SelectTrigger className="h-11 rounded-xl bg-muted/40 border-none">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {references.types
                                    .filter(t => ['district', 'city'].includes(t.code))
                                    .map(type => (
                                        <SelectItem key={type.code} value={type.code.charAt(0).toUpperCase() + type.code.slice(1)}>
                                            {getLocalizedName(type.name)}
                                        </SelectItem>
                                    ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase text-muted-foreground pl-1">{ui("ref.territories.field.status")}</Label>
                        <Select
                            value={form.status}
                            onValueChange={(val) => setForm({ ...form, status: val })}
                        >
                            <SelectTrigger className="h-11 rounded-xl bg-muted/40 border-none">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {references.statuses.map(status => (
                                    <SelectItem key={status.code} value={status.code}>
                                        <div className="flex items-center gap-2">
                                            <div className={cn(
                                                "h-2 w-2 rounded-full",
                                                status.code === 'active' ? "bg-emerald-500" : "bg-slate-400"
                                            )} />
                                            {getLocalizedName(status.name)}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
        </div>
    )
}

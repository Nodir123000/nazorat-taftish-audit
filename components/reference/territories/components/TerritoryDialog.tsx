import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Map, Check, X } from "lucide-react"
import { RegionForm } from "./forms/RegionForm"
import { DistrictForm } from "./forms/DistrictForm"
import { RegionFormData, DistrictFormData, Region, LocalizedContent } from "../types"

interface TerritoryDialogProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    activeTab: "regions" | "districts"
    editingItem: any
    regionForm: {
        form: RegionFormData
        setForm: (data: RegionFormData) => void
        errors: any
    }
    districtForm: {
        form: DistrictFormData
        setForm: (data: DistrictFormData) => void
        errors: any
    }
    regions: Region[]
    onSave: () => void
    getLocalizedName: (obj: LocalizedContent) => string
    t: (ru: string, uzL: string, uzC: string) => string
    ui: (key: string, fallback?: string) => string
}

export function TerritoryDialog({ isOpen, onOpenChange, activeTab, editingItem, regionForm, districtForm, regions, onSave, getLocalizedName, t, ui }: TerritoryDialogProps) {
    const isEditing = !!editingItem
    const isRegion = activeTab === 'regions'

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl rounded-3xl border-none shadow-2xl backdrop-blur-2xl bg-white/95 max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2.5 rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-600/20">
                            <Map className="h-6 w-6" />
                        </div>
                        <div>
                            <DialogTitle className="text-2xl font-black tracking-tight text-slate-900">
                                {isEditing
                                    ? (isRegion ? ui("ref.territories.edit_region_title") : ui("ref.territories.edit_district_title"))
                                    : (isRegion ? ui("ref.territories.create_region_title") : ui("ref.territories.create_district_title"))
                                }
                            </DialogTitle>
                            <DialogDescription className="font-medium">
                                {ui("common.fill_form")}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {isRegion ? (
                    <RegionForm
                        form={regionForm.form}
                        setForm={regionForm.setForm}
                        errors={regionForm.errors}
                        getLocalizedName={getLocalizedName}
                        t={t}
                        ui={ui}
                    />
                ) : (
                    <DistrictForm
                        form={districtForm.form}
                        setForm={districtForm.setForm}
                        regions={regions}
                        errors={districtForm.errors}
                        getLocalizedName={getLocalizedName}
                        t={t}
                        ui={ui}
                    />
                )}

                <DialogFooter className="gap-2 sm:gap-0 pt-2">
                    <Button variant="ghost" onClick={() => onOpenChange(false)} className="rounded-xl h-11 font-bold text-muted-foreground hover:bg-slate-100/50 hover:text-slate-600">
                        <X className="h-4 w-4 mr-2" />
                        {ui("common.cancel")}
                    </Button>
                    <Button onClick={onSave} className="rounded-xl h-11 px-8 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 bg-blue-600 hover:bg-blue-700 font-bold transition-all">
                        <Check className="h-4 w-4 mr-2" />
                        {ui("common.save")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

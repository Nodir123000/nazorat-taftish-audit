"use client"

import { useState } from "react"
import { useI18n } from "@/lib/i18n/context"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Map, MapPin } from "lucide-react"

import { TerritoriesHeader } from "./components/TerritoriesHeader"
import { TerritoriesTable } from "./components/TerritoriesTable"
import { TerritoryDialog } from "./components/TerritoryDialog"

import { useTerritories } from "./hooks/useTerritories"
import { useRegionForm } from "./hooks/useRegionForm"
import { useDistrictForm } from "./hooks/useDistrictForm"
import { useTerritoryDialog } from "./hooks/useTerritoryDialog"
import { useUITranslations } from "@/lib/hooks/use-ui-translations"

export function TerritoriesPage() {
    const { locale } = useI18n()
    const {
        regionsList,
        districtsList,
        loading,
        deleteTerritory,
        saveItem,
        getLocalizedName,
        getSubtextNames,
        getNameValue
    } = useTerritories()

    const {
        isOpen,
        setIsOpen,
        editingItem,
        activeTab,
        setActiveTab,
        openForAdd,
        openForEdit,
        close
    } = useTerritoryDialog()
    const { t: ui } = useUITranslations()

    const regionForm = useRegionForm()
    const districtForm = useDistrictForm()

    const [searchTerm, setSearchTerm] = useState("")

    const t = (ru: string, uzL: string, uzC: string) => {
        if (locale === "ru") return ru;
        if (locale === "uzLatn") return uzL;
        return uzC;
    }

    // Filtration
    const filteredRegions = regionsList.filter((region) =>
        getNameValue(region.name).toLowerCase().includes(searchTerm.toLowerCase())
    )

    const filteredDistricts = districtsList.filter((district) =>
        getNameValue(district.name).toLowerCase().includes(searchTerm.toLowerCase()) ||
        getNameValue(district.region).toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Handlers
    const handleAddClick = () => {
        if (activeTab === 'regions') {
            regionForm.resetForm()
        } else {
            // Default region for district form (first one)
            const defaultRegionId = regionsList.length > 0 ? regionsList[0].id.toString() : "";
            districtForm.resetForm(defaultRegionId)
        }
        openForAdd(activeTab)
    }

    const handleEditClick = (item: any) => {
        if (activeTab === 'regions') {
            regionForm.setRegionData(item)
        } else {
            districtForm.setDistrictData(item)
        }
        openForEdit(item, activeTab)
    }

    const handleSave = async () => {
        let success = false
        if (activeTab === 'regions') {
            if (regionForm.validate()) {
                success = await saveItem(regionForm.form, 'Region')
            }
        } else {
            if (districtForm.validate()) {
                success = await saveItem(districtForm.form, 'District')
            }
        }

        if (success) {
            close()
        }
    }

    const handleDelete = (id: number) => {
        deleteTerritory(id)
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Card className="border-none shadow-xl shadow-primary/5 bg-white/60 backdrop-blur-xl overflow-hidden">
                <TerritoriesHeader
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    onAddClick={handleAddClick}
                    activeTab={activeTab}
                    t={t}
                    ui={ui}
                />

                <CardContent className="p-0">
                    <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)} className="w-full">
                        <div className="px-8 pt-6 pb-2 border-b border-border/50 bg-white/40">
                            <TabsList className="bg-muted/40 p-1 rounded-2xl h-14 w-full md:w-auto grid grid-cols-2 md:inline-flex">
                                <TabsTrigger
                                    value="regions"
                                    className="rounded-xl h-12 px-8 font-bold text-sm data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/10 transition-all gap-2.5"
                                >
                                    <Map className="h-4 w-4" />
                                    {ui("ref.territories.tab_regions")}
                                    <span className="ml-1.5 px-2 py-0.5 rounded-md bg-muted text-[10px] text-muted-foreground group-data-[state=active]:bg-blue-50 group-data-[state=active]:text-blue-600">
                                        {regionsList.length}
                                    </span>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="districts"
                                    className="rounded-xl h-12 px-8 font-bold text-sm data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-lg data-[state=active]:shadow-indigo-500/10 transition-all gap-2.5"
                                >
                                    <MapPin className="h-4 w-4" />
                                    {ui("ref.territories.tab_districts")}
                                    <span className="ml-1.5 px-2 py-0.5 rounded-md bg-muted text-[10px] text-muted-foreground group-data-[state=active]:bg-indigo-50 group-data-[state=active]:text-indigo-600">
                                        {districtsList.length}
                                    </span>
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <TabsContent value="regions" className="m-0 focus-visible:ring-0 focus-visible:outline-none">
                            <TerritoriesTable
                                data={filteredRegions}
                                activeTab="regions"
                                loading={loading}
                                onEdit={handleEditClick}
                                onDelete={handleDelete}
                                getLocalizedName={getLocalizedName}
                                getSubtextNames={getSubtextNames}
                                t={t}
                                ui={ui}
                            />
                        </TabsContent>

                        <TabsContent value="districts" className="m-0 focus-visible:ring-0 focus-visible:outline-none">
                            <TerritoriesTable
                                data={filteredDistricts}
                                activeTab="districts"
                                loading={loading}
                                onEdit={handleEditClick}
                                onDelete={handleDelete}
                                getLocalizedName={getLocalizedName}
                                getSubtextNames={getSubtextNames}
                                t={t}
                                ui={ui}
                            />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            <TerritoryDialog
                isOpen={isOpen}
                onOpenChange={setIsOpen}
                activeTab={activeTab}
                editingItem={editingItem}
                regionForm={regionForm}
                districtForm={districtForm}
                regions={regionsList}
                onSave={handleSave}
                getLocalizedName={getLocalizedName}
                t={t}
                ui={ui}
            />
        </div>
    )
}

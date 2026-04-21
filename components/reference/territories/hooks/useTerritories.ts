import { useState, useCallback, useEffect } from "react"
import { getTerritories, saveTerritory, deleteTerritory as dbDeleteTerritory } from "@/lib/services/reference-db-service"
import { toast } from "sonner"
import { Lang } from "@/lib/types/i18n"
import { Region, District, LocalizedContent, ReferenceData } from "../types"
import { useI18n } from "@/lib/i18n/context"
import { useTerritoryReferences } from "./useTerritoryReferences"

export function useTerritories() {
    const { locale } = useI18n()
    const [regionsList, setRegionsList] = useState<Region[]>([])
    const [districtsList, setDistrictsList] = useState<District[]>([])
    const [loading, setLoading] = useState(true)

    // Загружаем справочники
    const { references, loading: referencesLoading } = useTerritoryReferences()

    const getNameObj = useCallback((name: any): LocalizedContent => {
        if (typeof name === 'object' && name !== null) return name as LocalizedContent;
        if (typeof name === 'string') return { [Lang.RU]: name };
        return { [Lang.RU]: "" };
    }, [])

    // Функция для получения данных типа из справочника
    const getTypeData = useCallback((type: string): ReferenceData | undefined => {
        const typeCode = type.toLowerCase()
        return references.types.find(t => t.code === typeCode)
    }, [references.types])

    // Функция для получения данных статуса из справочника
    const getStatusData = useCallback((status: string): ReferenceData | undefined => {
        return references.statuses.find(s => s.code === status)
    }, [references.statuses])

    const loadData = useCallback(async () => {
        if (referencesLoading) return // Ждём загрузки справочников

        setLoading(true)
        try {
            const data = await getTerritories()

            const regs = data.filter((t: any) => !t.parentId).map((r: any) => ({
                id: r.id,
                name: getNameObj(r.name),
                type: r.type as Region['type'],
                typeData: getTypeData(r.type), // Добавляем данные типа
                status: r.status || 'active',
                statusData: getStatusData(r.status || 'active'), // Добавляем данные статуса
                districtsCount: data.filter((d: any) => d.parentId === r.id).length
            }))

            const dists = data.filter((t: any) => t.parentId).map((d: any) => ({
                id: d.id,
                name: getNameObj(d.name),
                type: d.type as District['type'],
                typeData: getTypeData(d.type), // Добавляем данные типа
                status: d.status || 'active',
                statusData: getStatusData(d.status || 'active'), // Добавляем данные статуса
                regionId: d.parentId || d.regionId,
                region: d.region ? getNameObj(d.region.name) : { [Lang.RU]: "" }
            }))

            setRegionsList(regs)
            setDistrictsList(dists)
        } catch (error) {
            toast.error("Ошибка при загрузке данных")
            console.error(error)
        } finally {
            setLoading(false)
        }
    }, [getNameObj, getTypeData, getStatusData, referencesLoading])

    useEffect(() => {
        loadData()
    }, [loadData])

    const deleteTerritory = async (id: number) => {
        if (confirm("Вы уверены? Это действие нельзя отменить.")) {
            try {
                await dbDeleteTerritory(id)
                toast.success("Удалено успешно")
                loadData()
            } catch (error) {
                toast.error("Ошибка при удалении")
                console.error(error)
            }
        }
    }

    const saveItem = async (data: any, type: 'Region' | 'District') => {
        try {
            await saveTerritory({ ...data, type })
            toast.success("Сохранено успешно")
            loadData()
            return true
        } catch (error) {
            toast.error("Ошибка при сохранении")
            console.error(error)
            return false
        }
    }

    // Helper functions for localized display
    const getLocalizedName = useCallback((nameObj: LocalizedContent) => {
        if (locale === "uzLatn") return nameObj[Lang.UZ_LATN] || nameObj[Lang.RU] || "";
        if (locale === "uzCyrl") return nameObj[Lang.UZ_CYRL] || nameObj[Lang.RU] || "";
        return nameObj[Lang.RU] || "";
    }, [locale])

    const getSubtextNames = useCallback((nameObj: LocalizedContent) => {
        const names = [];
        if (locale !== "ru" && nameObj[Lang.RU]) names.push(nameObj[Lang.RU]);
        if (locale !== "uzLatn" && nameObj[Lang.UZ_LATN]) names.push(nameObj[Lang.UZ_LATN]);
        if (locale !== "uzCyrl" && nameObj[Lang.UZ_CYRL]) names.push(nameObj[Lang.UZ_CYRL]);
        return names.join(" / ");
    }, [locale])

    const getNameValue = useCallback((obj: LocalizedContent) => {
        return (obj[Lang.RU] || "") + (obj[Lang.UZ_LATN] || "") + (obj[Lang.UZ_CYRL] || "");
    }, [])

    return {
        regionsList,
        districtsList,
        loading,
        loadData,
        deleteTerritory,
        saveItem,
        getLocalizedName,
        getSubtextNames,
        getNameValue
    }
}

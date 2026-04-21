import { useState } from "react"
import { RegionFormData, Region, regionSchema } from "../types"
import { Lang } from "@/lib/types/i18n"

export function useRegionForm() {
    const initialForm: RegionFormData = {
        id: "",
        name: { [Lang.RU]: "", [Lang.UZ_LATN]: "", [Lang.UZ_CYRL]: "" },
        type: "Region",
        districtsCount: 0,
        status: "active"
    }

    const [form, setForm] = useState<RegionFormData>(initialForm)
    const [errors, setErrors] = useState<any>({})

    const resetForm = () => {
        setForm(initialForm)
        setErrors({})
    }

    const setRegionData = (item: Region) => {
        setForm({
            id: item.id.toString(),
            name: item.name,
            type: item.type,
            districtsCount: item.districtsCount,
            status: item.status || "active"
        })
        setErrors({})
    }

    const validate = () => {
        const result = regionSchema.safeParse(form)
        if (!result.success) {
            setErrors(result.error.format())
            return false
        }
        setErrors({})
        return true
    }

    return {
        form,
        setForm,
        errors,
        resetForm,
        setRegionData,
        validate
    }
}

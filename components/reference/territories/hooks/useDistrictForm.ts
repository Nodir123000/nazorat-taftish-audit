import { useState } from "react"
import { DistrictFormData, District, districtSchema, Region } from "../types"
import { Lang } from "@/lib/types/i18n"

export function useDistrictForm() {
    const initialForm: DistrictFormData = {
        id: "",
        name: { [Lang.RU]: "", [Lang.UZ_LATN]: "", [Lang.UZ_CYRL]: "" },
        region: "",
        type: "District",
        status: "active"
    }

    const [form, setForm] = useState<DistrictFormData>(initialForm)
    const [errors, setErrors] = useState<any>({})

    const resetForm = (defaultRegionId: string = "") => {
        setForm({ ...initialForm, region: defaultRegionId })
        setErrors({})
    }

    const setDistrictData = (item: District) => {
        setForm({
            id: item.id.toString(),
            name: item.name,
            region: item.regionId?.toString() || "", // Use ID for select
            type: item.type,
            status: item.status || "active"
        })
        setErrors({})
    }

    const validate = () => {
        const result = districtSchema.safeParse(form)
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
        setDistrictData,
        validate
    }
}

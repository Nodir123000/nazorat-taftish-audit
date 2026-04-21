import { Personnel } from "@/components/reference/personnel"

interface PersonnelTabProps {
    unitId: string
    unitNumber?: string
}

export function PersonnelTab({ unitId, unitNumber }: PersonnelTabProps) {
    return (
        <div className="w-full">
            <Personnel lockedUnitId={unitId} hideHeader={true} />
        </div>
    )
}

import { Suspense } from "react"
import { Personnel } from "@/components/reference/personnel"

function PersonnelPageContent() {
    return <Personnel navigateOnView={true} />
}

export default function PersonnelPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center h-full">Загрузка...</div>}>
            <PersonnelPageContent />
        </Suspense>
    )
}

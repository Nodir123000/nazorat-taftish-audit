import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CardDescription, CardHeader, CardTitle, Card } from "@/components/ui/card"
import { Users, Search, Plus, Map } from "lucide-react"
import { TechnicalNameBadge } from "../../technical-name-badge"

interface HeaderProps {
    searchTerm: string
    setSearchTerm: (val: string) => void
    onAddClick: () => void
    activeTab: "regions" | "districts"
    t: (ru: string, uzL: string, uzC: string) => string
    ui: (key: string, fallback?: string) => string
}

export function TerritoriesHeader({ searchTerm, setSearchTerm, onAddClick, activeTab, t, ui }: HeaderProps) {
    return (
        <CardHeader className="relative pb-8 border-b border-border/50">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                <Map className="h-32 w-32" />
            </div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-600 shadow-inner">
                            <Map className="h-6 w-6" />
                        </div>
                        <CardTitle className="text-3xl font-extrabold tracking-tight">
                            {ui("ref.territories.title")}
                        </CardTitle>
                    </div>
                    <CardDescription className="text-lg font-medium text-muted-foreground/80 max-w-2xl leading-relaxed pl-1">
                        {ui("ref.territories.description")}
                    </CardDescription>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <TechnicalNameBadge name="RefArea" />
                    <div className="relative group w-full md:w-80">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-blue-500 transition-colors" />
                        <Input
                            placeholder={ui("ref.territories.search_placeholder")}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 h-11 bg-white/50 border-border/40 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all font-medium placeholder:text-muted-foreground/50 shadow-sm text-sm"
                        />
                    </div>
                    <Button onClick={onAddClick} className="rounded-xl h-11 px-6 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 bg-blue-600 hover:bg-blue-700 transition-all font-bold">
                        <Plus className="h-4 w-4 mr-2" />
                        {activeTab === 'regions'
                            ? ui("ref.territories.add_region")
                            : ui("ref.territories.add_district")
                        }
                    </Button>
                </div>
            </div>
        </CardHeader>
    )
}

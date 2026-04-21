"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, FileText, ImageIcon, Search, Filter, Eye } from "lucide-react"
import type { User } from "@/lib/types"
import { useAuditEvidence } from "@/lib/hooks/use-audits"
import type { AuditEvidenceDTO } from "@/lib/types/audits.dto"

interface AuditEvidenceProps {
  user: User
}

export function AuditEvidence({ user }: AuditEvidenceProps) {
  const { data: evidence = [], isLoading } = useAuditEvidence("Приказ-2024/045")
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Доказательная база</CardTitle>
              <CardDescription>
                Загрузка и управление фото, видео и скан-копиями документов, подтверждающих нарушения
              </CardDescription>
            </div>
            <Button>
              <Upload className="w-4 h-4 mr-2" />
              Загрузить материалы
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="all">Все файлы</TabsTrigger>
                <TabsTrigger value="images">Фото</TabsTrigger>
                <TabsTrigger value="videos">Видео</TabsTrigger>
                <TabsTrigger value="documents">Документы</TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Поиск файлов..." className="pl-8 w-[250px]" />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <TabsContent value="all" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Example Evidence Items */}
                <Card className="overflow-hidden border-2 border-dashed flex flex-col items-center justify-center p-6 text-muted-foreground hover:bg-muted/50 cursor-pointer transition-colors">
                  <Upload className="w-8 h-8 mb-2" />
                  <p className="font-medium">Перетащите файлы сюда</p>
                  <p className="text-xs">или нажмите для загрузки</p>
                </Card>

                {evidence.map((item: AuditEvidenceDTO) => (
                  <Card key={item.id} className="overflow-hidden group relative">
                    <div className="aspect-video bg-muted relative">
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex gap-2">
                          <Button variant="secondary" size="sm">
                            <Eye className="w-4 h-4 mr-2" /> Просмотр
                          </Button>
                        </div>
                      </div>
                      <div className={`w-full h-full flex items-center justify-center ${item.fileType === 'image' ? 'bg-slate-100 text-slate-400' :
                          item.fileType === 'document' ? 'bg-blue-50 text-blue-400' :
                            'bg-gray-100 text-gray-400'
                        }`}>
                        {item.fileType === 'image' ? <ImageIcon className="w-8 h-8" /> : <FileText className="w-8 h-8" />}
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-sm truncate">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{item.date} • {item.size}</p>
                        </div>
                        <Badge variant="outline">{item.type}</Badge>
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground line-clamp-2">
                        {item.description}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mic, HelpCircle } from 'lucide-react';

export function VoiceAssistantHelp() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          title="Справка по голосовому помощнику"
          className="hover:bg-cyan-500/20 hover:text-cyan-400"
        >
          <HelpCircle className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-150 max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5 text-cyan-500" />
            Голосовой помощник
          </DialogTitle>
          <DialogDescription>
            Используйте голосовые команды для навигации по системе КРР
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-muted p-3 rounded-lg text-sm">
            <p className="font-medium mb-2">Как использовать:</p>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
              <li>Нажмите на иконку микрофона в верхней панели</li>
              <li>Дождитесь уведомления об активации</li>
              <li>Четко произнесите команду</li>
              <li>Система автоматически перейдет на нужную страницу</li>
            </ol>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Доступные голосовые команды:</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="border rounded-lg p-3 bg-card">
                <h4 className="text-sm font-semibold mb-2 text-cyan-600">📋 Планирование</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>"планирование"</li>
                  <li>"годовой план"</li>
                  <li>"квартальный план"</li>
                  <li>"приказы"</li>
                  <li>"внеплановые ревизии"</li>
                </ul>
              </div>

              <div className="border rounded-lg p-3 bg-card">
                <h4 className="text-sm font-semibold mb-2 text-blue-600">🔍 Проведение ревизий</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>"активные ревизии"</li>
                  <li>"подготовка"</li>
                  <li>"документы ревизии"</li>
                  <li>"финансовая деятельность"</li>
                  <li>"результаты ревизий"</li>
                </ul>
              </div>

              <div className="border rounded-lg p-3 bg-card">
                <h4 className="text-sm font-semibold mb-2 text-orange-600">⚠️ Учет нарушений</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>"нарушения"</li>
                  <li>"финансовые нарушения"</li>
                  <li>"материальные нарушения"</li>
                  <li>"квалификация нарушений"</li>
                  <li>"ответственные лица"</li>
                </ul>
              </div>

              <div className="border rounded-lg p-3 bg-card">
                <h4 className="text-sm font-semibold mb-2 text-green-600">✅ Решения</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>"решения"</li>
                  <li>"корректирующие действия"</li>
                  <li>"статус исполнения"</li>
                  <li>"контроль сроков"</li>
                </ul>
              </div>

              <div className="border rounded-lg p-3 bg-card">
                <h4 className="text-sm font-semibold mb-2 text-purple-600">📊 Отчеты</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>"отчеты"</li>
                  <li>"стандартные отчеты"</li>
                  <li>"пользовательские отчеты"</li>
                  <li>"аналитика"</li>
                </ul>
              </div>

              <div className="border rounded-lg p-3 bg-card">
                <h4 className="text-sm font-semibold mb-2 text-indigo-600">📚 Справочники</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>"справочники"</li>
                  <li>"база данных"</li>
                  <li>"военные округа"</li>
                  <li>"воинские части"</li>
                  <li>"классификаторы"</li>
                </ul>
              </div>

              <div className="border rounded-lg p-3 bg-card">
                <h4 className="text-sm font-semibold mb-2 text-pink-600">👥 Кадры</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>"кадры"</li>
                  <li>"сотрудники"</li>
                  <li>"личный состав"</li>
                </ul>
              </div>

              <div className="border rounded-lg p-3 bg-card">
                <h4 className="text-sm font-semibold mb-2 text-red-600">⚙️ Администрирование</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>"администрирование"</li>
                  <li>"пользователи"</li>
                  <li>"роли и права"</li>
                  <li>"журнал аудита"</li>
                  <li>"архив"</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-cyan-50 dark:bg-cyan-950 p-3 rounded-lg text-sm border border-cyan-200 dark:border-cyan-800">
            <p className="font-medium text-cyan-900 dark:text-cyan-100">💡 Совет:</p>
            <p className="text-cyan-700 dark:text-cyan-300 mt-1">
              Говорите четко и не слишком быстро. Система поддерживает русский язык. 
              При активном голосовом помощнике иконка микрофона будет светиться красным.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

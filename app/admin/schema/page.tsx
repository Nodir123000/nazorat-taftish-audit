"use client"

import React from 'react';
import SchemaVisualizer from '@/components/admin/SchemaVisualizer';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import Link from 'next/link';

export default function SchemaPage() {
  return (
    <div className="flex flex-col h-screen overflow-hidden p-6 gap-6 bg-white">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Icons.Database className="h-6 w-6 text-blue-600" />
            Визуализация архитектуры БД
          </h1>
          <p className="text-sm text-slate-500">
            Автоматически сгенерированная схема на основе Prisma Schema. Позволяет увидеть связи между таблицами системы.
          </p>
        </div>
        
        <div className="flex gap-3">
           <Button variant="outline" asChild>
             <Link href="/planning/annual">
                К планированию
             </Link>
           </Button>
           <Button className="bg-blue-600 hover:bg-blue-700 font-medium">
             Экспорт схемы (PNG)
           </Button>
        </div>
      </div>

      <main className="flex-1 min-h-0 bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden relative shadow-inner">
         <SchemaVisualizer />
      </main>
      
      <footer className="py-2 text-[10px] text-slate-400 flex justify-between uppercase tracking-widest border-t border-slate-100 mt-2">
         <span>Nazorat-Taftish System Architecture</span>
         <span>v1.0.0 Alpha • Generated from 750+ Prisma lines</span>
      </footer>
    </div>
  );
}

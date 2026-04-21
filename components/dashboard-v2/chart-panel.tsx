"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDashboard } from './dashboard-context';
import { UzbekistanMap } from "@/components/uzbekistan-map";
import { TrendingDown, Filter, Calendar, BarChart2, Grid3x3, Maximize2, ChevronLeft, Move, ZoomIn, ZoomOut, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Save, Trash2, FileText, Download } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface ChartPanelProps {
  data: {
    name: string;
    violations: number;
    amt: number;
  }[];
}

export function ChartPanel({ data }: ChartPanelProps) {
  const { filters } = useDashboard();
  const router = useRouter(); // Initialize router
  const [mapView, setMapView] = useState<string>('country');
  const [activeBottomFilter, setActiveBottomFilter] = useState<'all' | 'growth' | 'outsiders' | 'control'>('all');

  // --- MAP CONFIG ---
  const MAP_CONFIG = {
    initialZoom: 1,
    initialX: 0,
    initialY: 0,
    zoomStep: 0.2,
    panStep: 50,
    minZoom: 0.5,
    maxZoom: 5,
  };

  const [zoom, setZoom] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('uzbekistan-map-settings');
      if (saved) return JSON.parse(saved).zoom;
    }
    return MAP_CONFIG.initialZoom;
  });

  const [pan, setPan] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('uzbekistan-map-settings');
      if (saved) return JSON.parse(saved).pan;
    }
    return { x: MAP_CONFIG.initialX, y: MAP_CONFIG.initialY };
  });

  const [showControls, setShowControls] = useState(true);

  const handleSave = () => {
    const settings = { zoom, pan };
    localStorage.setItem('uzbekistan-map-settings', JSON.stringify(settings));
    alert("Настройки карты сохранены");
  };

  const handleReset = () => {
    setZoom(MAP_CONFIG.initialZoom);
    setPan({ x: MAP_CONFIG.initialX, y: MAP_CONFIG.initialY });
    localStorage.removeItem('uzbekistan-map-settings');
    alert("Настройки сброшены");
  };

  const handleZoomIn = () => setZoom((prev: number) => Math.min(prev + MAP_CONFIG.zoomStep, MAP_CONFIG.maxZoom));
  const handleZoomOut = () => setZoom((prev: number) => Math.max(prev - MAP_CONFIG.zoomStep, MAP_CONFIG.minZoom));
  const handlePan = (dx: number, dy: number) => setPan((prev: { x: number; y: number }) => ({ x: prev.x + dx, y: prev.y + dy }));

  // Filtered Table Data
  const allRows = [
    { name: 'ВВО', sub: 'Восточный округ', price: '7.175 М', vol: '38,237.37', change: '+7.11%', isUp: true, category: 'НДС', status: 'normal' },
    { name: 'ЦВО', sub: 'Центральный округ', price: '4.466 М', vol: '1,231,481.81', isUp: true, change: '+10.26%', category: 'РСТ', status: 'growth' },
    { name: 'ЮВО', sub: 'Южный округ', price: '1,602.59 М', vol: '2,901.96', isUp: true, change: '+8.89%', category: 'НДС', status: 'control' },
    { name: 'ЗВО', sub: 'Западный округ', price: '0.001 М', vol: '3,070,291.08', isUp: false, change: '-99.63%', category: 'ХИЩ', status: 'outsiders' },
    { name: 'СФ', sub: 'Северный флот', price: '3.346 М', vol: '209,892.33', isUp: false, change: '-9.68%', category: 'ИЗЛ', status: 'normal' },
  ];

  const filteredRows = allRows.filter(row => {
    if (filters.category && row.category !== filters.category) return false;
    if (activeBottomFilter === 'all') return true;
    if (activeBottomFilter === 'growth') return row.isUp;
    if (activeBottomFilter === 'outsiders') return !row.isUp;
    if (activeBottomFilter === 'control') return row.status === 'control';
    return true;
  });

  // MOCK DATA
  const regionNames: Record<string, string> = {
    'UZTK': 'г. Ташкент',
    'UZSA': 'Самаркандская обл.',
    'UZFA': 'Ферганская обл.',
    'UZQA': 'Кашкадарьинская обл.',
    'UZAN': 'Андижанская обл.',
    'UZQR': 'Республика Каракалпакстан',
  };

  const MOCK_DISTRICTS = {
    'UZTK': [
      { name: 'Юнусабадский', amount: '12.4 М', status: 'critical' },
      { name: 'Чиланзарский', amount: '10.1 М', status: 'warning' },
      { name: 'Мирзо-Улугбекский', amount: '8.5 М', status: 'normal' },
      { name: 'Алмазарский', amount: '5.2 М', status: 'normal' },
      { name: 'Яшнабадский', amount: '2.8 М', status: 'good' },
    ],
    'UZSA': [
      { name: 'г. Самарканд', amount: '15.2 М', status: 'critical' },
      { name: 'Ургутский', amount: '8.1 М', status: 'warning' },
      { name: 'Пастдаргомский', amount: '6.5 М', status: 'normal' },
      { name: 'Иштыханский', amount: '4.2 М', status: 'good' },
    ],
    'UZFA': [
      { name: 'г. Фергана', amount: '9.8 М', status: 'warning' },
      { name: 'Маргилан', amount: '7.5 М', status: 'normal' },
      { name: 'Коканд', amount: '6.2 М', status: 'normal' },
      { name: 'Риштанский', amount: '3.1 М', status: 'good' },
    ],
    'UZQA': [
      { name: 'г. Карши', amount: '11.5 М', status: 'critical' },
      { name: 'Шахрисабз', amount: '5.5 М', status: 'normal' },
      { name: 'Касби', amount: '2.1 М', status: 'good' },
    ],
    'UZAN': [
      { name: 'г. Андижан', amount: '8.8 М', status: 'warning' },
      { name: 'Асака', amount: '4.5 М', status: 'normal' },
      { name: 'Шахрихан', amount: '3.2 М', status: 'good' },
    ],
  };

  return (
    <div className="flex-1 bg-white p-6 overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Мониторинг Нарушений</h2>
          <p className="text-sm text-gray-500">Визуализация по регионам и категориям</p>
        </div>
        <div className="flex gap-2">
          <button
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
            onClick={() => alert('Отчет генерируется...')}
          >
            <FileText size={16} />
            <span>Отчет</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
            <Calendar size={16} />
            <span>2025 Год</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
            <Filter size={16} />
            <span>Фильтры</span>
          </button>
        </div>
      </div>

      {/* Split Content: 3-Column Standard Grid */}
      <div className="flex-1 grid grid-cols-12 gap-6 min-h-0 mb-6">

        {/* 1. Left Panel (3 cols) - Top Regions Only */}
        <div className="col-span-3 bg-white rounded-2xl border border-slate-200 flex flex-col h-full overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">Топ Регионов</h3>
              <p className="text-[10px] text-gray-400">По сумме нарушений</p>
            </div>
            <span className="text-[10px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded font-medium">Live</span>
          </div>
          <div className="flex-1 overflow-auto p-2 space-y-2">
            {[
              { id: 'UZTK', name: 'г. Ташкент', amount: '89.2 М', percent: 85, trend: '+12%' },
              { id: 'UZSA', name: 'Самарканд', amount: '64.5 М', percent: 65, trend: '+5%' },
              { id: 'UZFA', name: 'Фергана', amount: '42.1 М', percent: 45, trend: '-2%' },
              { id: 'UZQA', name: 'Кашкадарья', amount: '38.7 М', percent: 38, trend: '+1%' },
              { id: 'UZAN', name: 'Андижан', amount: '21.4 М', percent: 25, trend: '0%' },
            ].map((region, i) => (
              <div
                key={region.id}
                className="p-2 hover:bg-slate-50 rounded-lg cursor-pointer group transition-colors border border-transparent hover:border-slate-100"
                onClick={() => setMapView(region.id)}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium text-slate-700 group-hover:text-blue-600 transition-colors">
                    {i + 1}. {region.name}
                  </span>
                  <span className="text-xs font-bold text-slate-900">{region.amount}</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-1">
                  <div
                    className={`h-full rounded-full ${i === 0 ? 'bg-red-500' : i === 1 ? 'bg-orange-400' : 'bg-blue-400'}`}
                    style={{ width: `${region.percent}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>{region.percent}% от общего</span>
                  <span className={region.trend.startsWith('+') ? 'text-red-500' : 'text-green-500'}>
                    {region.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Center: Map (6 cols) */}
        <div className="col-span-6 bg-white rounded-2xl border-2 border-red-500 p-1 flex flex-col h-full overflow-hidden relative group">
          <div className="flex justify-between items-center px-4 py-2 border-b border-gray-100/50 mb-2 shrink-0 z-20 bg-white relative">
            <span className="text-sm font-semibold text-gray-700 truncate">{regionNames[mapView] || 'География'}</span>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-gray-400 hover:text-blue-600"
                onClick={() => setShowControls(!showControls)}
                title="Настройки"
              >
                <Move size={14} />
              </Button>
              {mapView !== 'country' && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-[10px] font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-2 rounded transition-colors"
                  onClick={() => setMapView('country')}
                >
                  <ChevronLeft className="w-3 h-3 mr-1" />
                  Назад
                </Button>
              )}
            </div>
          </div>

          <div className="flex-1 relative overflow-hidden bg-slate-50/50 rounded-lg m-1 border border-slate-100 flex items-center justify-center">
            {showControls && (
              <div className="absolute top-2 right-2 z-30 bg-white/90 backdrop-blur shadow-lg border border-slate-200 rounded-lg p-2 flex flex-col gap-2 transition-all opacity-20 group-hover:opacity-100">
                <div className="flex items-center gap-1 bg-slate-100 rounded p-1">
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleZoomOut}><ZoomOut size={14} /></Button>
                  <span className="text-[10px] font-mono w-6 text-center">{(zoom).toFixed(1)}x</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleZoomIn}><ZoomIn size={14} /></Button>
                </div>
                <div className="grid grid-cols-3 gap-1 bg-slate-100 rounded p-1">
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handlePan(0, MAP_CONFIG.panStep)}><ArrowUp size={10} /></Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handlePan(-MAP_CONFIG.panStep, 0)}><ArrowLeft size={10} /></Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handlePan(MAP_CONFIG.panStep, 0)}><ArrowRight size={10} /></Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handlePan(0, -MAP_CONFIG.panStep)}><ArrowDown size={10} /></Button>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" className="h-6 w-full text-[10px] text-blue-600 hover:bg-blue-50" onClick={handleSave}><Save size={12} /></Button>
                  <Button variant="ghost" size="sm" className="h-6 w-full text-[10px] text-red-600 hover:bg-red-50" onClick={handleReset}><Trash2 size={12} /></Button>
                </div>
              </div>
            )}
            <UzbekistanMap
              view={mapView}
              onViewChange={setMapView}
              hideControls
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transformOrigin: 'center center'
              }}
              className="transition-transform duration-300 ease-out"
            />
          </div>
        </div>

        {/* 3. Right Panel (3 cols) - Districts Only */}
        <div className="col-span-3 bg-white rounded-2xl border border-slate-200 flex flex-col h-full overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">
                {mapView !== 'country' && regionNames[mapView] ? regionNames[mapView] : 'По Районам'}
              </h3>
              <p className="text-[10px] text-gray-400">
                {mapView !== 'country' ? 'Детализация региона' : 'Выберите регион'}
              </p>
            </div>
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
            </div>
          </div>
          <div className="flex-1 overflow-auto p-2 space-y-2">
            {(() => {
              const currentDistricts = (mapView !== 'country' && MOCK_DISTRICTS[mapView as keyof typeof MOCK_DISTRICTS]) || [];

              if (mapView === 'country') {
                return (
                  <div className="flex flex-col items-center justify-center h-full text-center p-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 mb-3">
                      <Move size={24} />
                    </div>
                    <p className="text-sm font-medium text-gray-900">Выберите регион</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Нажмите на регион на карте или в списке слева, чтобы увидеть статистику по районам.
                    </p>
                  </div>
                );
              }

              if (currentDistricts.length === 0) {
                return (
                  <div className="text-xs text-gray-400 text-center py-4">
                    Нет данных по районам для этого региона.
                  </div>
                );
              }

              return currentDistricts.map((dist, i) => (
                <div key={i} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded border border-transparent hover:border-slate-100 transition-all cursor-default animate-in fade-in slide-in-from-right-4 duration-300" style={{ animationDelay: `${i * 50}ms` }}>
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${dist.status === 'critical' ? 'bg-red-500' : dist.status === 'warning' ? 'bg-orange-500' : 'bg-blue-400'}`} />
                    <span className="text-xs text-slate-700 font-medium">{dist.name}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-900">{dist.amount}</span>
                </div>
              ));
            })()}
          </div>
        </div>
      </div>

      {/* Bottom Actions/Table Header (Existing) */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveBottomFilter('all')}
            className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${activeBottomFilter === 'all'
              ? 'bg-gray-800 text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
          >
            {filters.category ? `Подразделения (${filters.category})` : 'Все подразделения'}
          </button>
          <button
            onClick={() => setActiveBottomFilter('growth')}
            className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${activeBottomFilter === 'growth'
              ? 'bg-green-100 text-green-700 shadow-sm border border-green-200'
              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
          >
            Лидеры роста
          </button>
          <button
            onClick={() => setActiveBottomFilter('outsiders')}
            className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${activeBottomFilter === 'outsiders'
              ? 'bg-red-50 text-red-600 shadow-sm border border-red-200'
              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
          >
            Аутсайдеры
          </button>
          <button
            onClick={() => setActiveBottomFilter('control')}
            className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${activeBottomFilter === 'control'
              ? 'bg-orange-50 text-orange-600 shadow-sm border border-orange-200'
              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
          >
            На контроле
          </button>
        </div>
        <div className="flex gap-2 text-gray-400">
          <BarChart2 size={18} />
          <Grid3x3 size={18} />
          <Maximize2 size={18} />
        </div>
      </div>

      {/* Styled Table (Existing) */}
      <div className="flex-1 overflow-auto bg-white border border-gray-100 rounded-xl min-h-[200px]">
        <table className="w-full">
          <thead className="text-xs text-gray-400 border-b border-gray-100 bg-gray-50/50 sticky top-0 backdrop-blur-sm">
            <tr>
              <th className="text-left font-medium py-3 pl-4">Подразделение</th>
              <th className="text-right font-medium py-3">Сумма нарушений</th>
              <th className="text-right font-medium py-3">Объем [UZS]</th>
              <th className="text-right font-medium py-3">Изм. [24ч]</th>
              <th className="text-right font-medium py-3 pr-4">Действие</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {filteredRows.map((row, i) => (
              <tr key={i} className="group hover:bg-gray-50 border-b border-gray-50 last:border-0 transition-colors">
                <td className="py-3 pl-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-xs text-gray-600 group-hover:bg-white group-hover:shadow-sm">
                      {row.name[0]}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{row.name}</div>
                      <div className="text-xs text-gray-400">{row.sub}</div>
                    </div>
                  </div>
                </td>
                <td className="text-right font-medium text-gray-900">{row.price}</td>
                <td className="text-right text-gray-600">{row.vol}</td>
                <td className={`text-right font-medium ${row.isUp ? 'text-green-600' : 'text-blue-500'}`}>
                  <div className="flex items-center justify-end gap-1">
                    {row.isUp ? <TrendingDown size={14} className="rotate-180" /> : <TrendingDown size={14} />}
                    {row.change}
                  </div>
                </td>
                <td className="text-right pr-4">
                  <button className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded hover:bg-blue-100 transition-colors">
                    Подробнее
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mini Footer / Legend mock */}
      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400 shrink-0">
        <div className="flex gap-4">
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div>Критично</div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-orange-500"></div>Высокий риск</div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div>Норма</div>
        </div>
        <div>Обновлено: Только что</div>
      </div>
    </div >
  );
}

"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MoreHorizontal, TrendingUp, TrendingDown, Settings, Filter, MapPin } from 'lucide-react';

interface ActivityItem {
    id: string;
    type: string;
    title: string;
    description: string;
    timestamp: string;
}

interface RightPanelProps {
    recentActivity: ActivityItem[];
}

import { useDashboard } from "./dashboard-context";

export function RightPanel({ recentActivity }: RightPanelProps) {
    const { filters } = useDashboard();
    const [activeTab, setActiveTab] = useState<'audits' | 'kpi' | 'personnel'>('audits');
    const router = useRouter();

    const personnelData = [
        { id: 'UZTK', region: 'г. Ташкент', count: 45, status: 'Активная фаза', color: 'text-green-600' },
        { id: 'UZSA', region: 'Самарканд', count: 28, status: 'Завершение', color: 'text-blue-600' },
        { id: 'UZFA', region: 'Фергана', count: 18, status: 'Новая проверка', color: 'text-orange-600' },
        { id: 'UZBU', region: 'Бухара', count: 12, status: 'Анализ', color: 'text-gray-500' },
        { id: 'UZXO', region: 'Хорезм', count: 10, status: 'В пути', color: 'text-yellow-600' },
        { id: 'UZNW', region: 'Навои', count: 8, status: 'Планирование', color: 'text-purple-600' },
        { id: 'UZTO', region: 'Ташкентская обл.', count: 38, status: 'Активная фаза', color: 'text-green-600' }, // Added to match map
    ];

    const filteredPersonnel = filters.district
        ? personnelData.filter(p => p.id === filters.district)
        : personnelData;

    return (
        <div className="w-96 bg-gray-50 p-4 overflow-y-auto flex flex-col gap-4 border-l border-gray-200">
            {/* ... other code ... */}
            {/* Widget 1: Top List (Simulating 'Crypto' widget) */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex p-1 bg-gray-100 rounded-lg w-full">
                        <button
                            onClick={() => setActiveTab('audits')}
                            className={`flex-1 px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${activeTab === 'audits' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            Аудиты
                        </button>
                        <button
                            onClick={() => setActiveTab('kpi')}
                            className={`flex-1 px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${activeTab === 'kpi' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            KPI
                        </button>
                        <button
                            onClick={() => setActiveTab('personnel')}
                            className={`flex-1 px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${activeTab === 'personnel' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            Кадры
                        </button>
                    </div>
                </div>

                <div className="space-y-5">
                    {activeTab === 'audits' && (
                        <>
                            {[
                                { name: 'Плановые ревизии', ticker: 'ПЛН', price: '14', change: '+2.54%', isPositive: true, icon: 'bg-orange-100 text-orange-600' },
                                { name: 'Внеплановые', ticker: 'ВНП', price: '4', change: '+1.02%', isPositive: true, icon: 'bg-purple-100 text-purple-600' },
                                { name: 'Контрольные', ticker: 'КНТ', price: '8', change: '-0.45%', isPositive: false, icon: 'bg-blue-100 text-blue-600' },
                                { name: 'Просроченные', ticker: 'ПРС', price: '2', change: '-5.12%', isPositive: false, icon: 'bg-red-100 text-red-600' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 -mx-2 rounded transition-colors" onClick={() => router.push('/audits')}>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${item.icon}`}>
                                            {item.ticker[0]}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900">{item.name}</div>
                                            <div className="text-xs text-gray-500">{item.ticker}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-semibold text-gray-900">{item.price}</div>
                                        <div className={`text-xs flex items-center justify-end gap-1 ${item.isPositive ? 'text-green-600' : 'text-red-500'}`}>
                                            {item.isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                            {item.change}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}

                    {activeTab === 'kpi' && (
                        <div className="flex flex-col gap-4 animate-in fade-in duration-300">
                            <div className="px-1 pt-2">
                                <div className="space-y-3">
                                    {[
                                        { name: 'А. Смирнов', score: '98%', position: '1' },
                                        { name: 'Б. Иванов', score: '95%', position: '2' },
                                        { name: 'В. Петров', score: '92%', position: '3' },
                                        { name: 'Г. Сидоров', score: '88%', position: '4' },
                                        { name: 'Д. Алиев', score: '85%', position: '5' },
                                    ].map((p, i) => (
                                        <div key={i} onClick={() => router.push('/kpi')} className="flex justify-between items-center text-sm p-2 hover:bg-gray-50 rounded cursor-pointer transition-colors border border-transparent hover:border-gray-100">
                                            <div className="flex items-center gap-3">
                                                <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${i === 0 ? 'bg-yellow-100 text-yellow-700' : i === 1 ? 'bg-gray-100 text-gray-700' : i === 2 ? 'bg-orange-50 text-orange-700' : 'bg-slate-50 text-slate-500'}`}>{p.position}</span>
                                                <span className="text-gray-900 font-medium">{p.name}</span>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="font-bold text-blue-600">{p.score}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'personnel' && (
                        <div className="animate-in fade-in duration-300 space-y-3">
                            <div className="bg-purple-50 p-3 rounded-xl border border-purple-100 flex items-center justify-between">
                                <div>
                                    <div className="text-xs text-purple-600 font-semibold uppercase">В Командировках</div>
                                    <div className="text-xl font-bold text-gray-900">{filteredPersonnel.reduce((sum, p) => sum + p.count, 0)}</div>
                                </div>
                                <div className="h-8 w-8 bg-purple-200 rounded-full flex items-center justify-center text-purple-700 font-bold">
                                    <MapPin size={16} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                {filteredPersonnel.length > 0 ? filteredPersonnel.map((item, i) => (
                                    <div key={i} onClick={() => router.push('/personnel')} className="flex items-center justify-between p-2.5 hover:bg-gray-50 rounded-lg cursor-pointer border border-transparent hover:border-gray-100 transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-slate-200" />
                                            <div>
                                                <div className="text-sm font-semibold text-gray-900">{item.region}</div>
                                                <div className={`text-[10px] font-medium ${item.color}`}>
                                                    {item.status}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="font-bold text-gray-900">{item.count}</span>
                                            <span className="text-[10px] text-gray-400">чел.</span>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center text-sm text-gray-500 py-4">Нет данных по региону</div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Widget 2: Bottom Table (Simulating 'Order Book') */}
            <div className="bg-white rounded-2xl p-5 shadow-sm flex-1">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-4">
                        <button className="text-sm font-semibold text-gray-900 border-b-2 border-blue-600 pb-1">Нарушения</button>
                        <button className="text-sm text-gray-500 hover:text-gray-900 pb-1">Возмещения</button>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded text-xs">
                            <span>Все</span>
                            <Settings size={12} className="text-gray-400" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-3 text-xs text-gray-400 mb-2 px-2">
                    <div>Категория</div>
                    <div className="text-right">Сумма</div>
                    <div className="text-right">Кол-во</div>
                </div>

                <div className="space-y-1">
                    {[
                        { cat: 'Недостача', amount: '24.6M', total: '12', type: 'sell' },
                        { cat: 'Растрата', amount: '18.2M', total: '5', type: 'sell' },
                        { cat: 'Хищение', amount: '9.5M', total: '3', type: 'sell' },
                        { cat: 'Ил. Выплаты', amount: '4.1M', total: '8', type: 'sell' },
                        { cat: 'Переплата', amount: '15.3M', total: '12', type: 'buy' },
                        { cat: 'Недоплата', amount: '7.8M', total: '4', type: 'buy' },
                        { cat: 'Ущерб ТМЦ', amount: '2.4M', total: '15', type: 'buy' },
                        { cat: 'Прочее', amount: '1.1M', total: '6', type: 'buy' },
                    ].map((row, i) => (
                        <div key={i} className="grid grid-cols-3 text-sm py-1.5 px-2 hover:bg-gray-50 rounded cursor-pointer relative group">
                            {/* Bar background simulation */}
                            <div
                                className={`absolute top-0 right-0 bottom-0 opacity-10 ${row.type === 'sell' ? 'bg-red-500' : 'bg-green-500'}`}
                                style={{ width: `${((i * 37) % 50) + 10}%` }}
                            />

                            <div className="font-medium text-gray-700 relative z-10">{row.cat}</div>
                            <div className={`text-right relative z-10 ${row.type === 'sell' ? 'text-red-600' : 'text-green-600'}`}>
                                {row.amount}
                            </div>
                            <div className="text-right text-gray-600 relative z-10">{row.total}</div>
                        </div>
                    ))}
                </div>

                <div className="mt-4 flex justify-between items-center pt-4 border-t border-gray-100">
                    <span className="text-xs text-gray-400">Всего за период</span>
                    <span className="text-sm font-bold text-gray-900">83.0M UZS</span>
                </div>
            </div>
        </div>
    );
}

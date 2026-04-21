"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { RefreshCw, TrendingDown, TrendingUp, AlertCircle, FileWarning, Search, Wallet, ArrowRightLeft, Star, X, FileText, ClipboardList } from 'lucide-react';
import { useDashboard } from './dashboard-context';

interface BalancePanelProps {
    totalAmount: number;
    bySeverity: Record<string, number>;
    byStatus: Record<string, number>;
}

import { getRegionStats } from "@/lib/data/regions"; // Import shared data

export function BalancePanel({ totalAmount, bySeverity, byStatus }: BalancePanelProps) {
    const { filters, setFilter } = useDashboard();
    const [view, setView] = useState<'identified' | 'recovered'>('identified');
    const router = useRouter();

    // Calculate amount based on filter
    const regionStats = getRegionStats(filters.district);
    const currentTotal = regionStats ? regionStats.damage : totalAmount;

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'UZS', maximumFractionDigits: 0 }).format(val);

    return (
        <div className="w-80 bg-white border-r border-gray-200 p-6 flex flex-col h-full overflow-hidden">
            {/* Balance Card Section */}
            <div className="mb-8">
                {/* Tabs */}
                <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
                    <button
                        onClick={() => setView('identified')}
                        className={`flex-1 py-1.5 rounded-lg text-sm font-semibold transition-all ${view === 'identified' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                        Выявлено
                    </button>
                    <button
                        onClick={() => setView('recovered')}
                        className={`flex-1 py-1.5 rounded-lg text-sm font-semibold transition-all ${view === 'recovered' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                        Возмещено
                    </button>
                </div>

                {/* Сумма */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <div className={`text-3xl font-bold ${view === 'identified' ? 'text-gray-900' : 'text-green-600'}`}>
                            {view === 'identified' ? formatCurrency(currentTotal) : formatCurrency(currentTotal * 0.64)}
                        </div>
                        <button className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400">
                            <span className="text-xs font-semibold px-2 py-0.5 bg-gray-100 rounded text-gray-600">UZS</span>
                        </button>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                        <span>14:23:05</span>
                        <RefreshCw size={12} />
                        <span>Обновлено</span>
                    </div>

                    <div className="flex gap-4 border-t border-b border-gray-100 py-4 mb-6">
                        <div>
                            <div className="text-sm font-semibold text-gray-900">162.39</div>
                            <div className="text-xs text-gray-400">Нарушений</div>
                        </div>
                        <div>
                            <div className="text-sm font-semibold text-gray-900">0.029</div>
                            <div className="text-xs text-gray-400">Индекс</div>
                        </div>
                        <div>
                            <div className="text-sm font-semibold text-green-600">64.0%</div>
                            <div className="text-xs text-gray-400">% Возмещ.</div>
                        </div>
                    </div>

                    {/* Основные Действия */}
                    <div className="flex gap-3">
                        <button
                            onClick={() => router.push('/reports')}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold text-sm shadow-sm transition-transform active:scale-95 flex items-center justify-center gap-2"
                        >
                            <FileText size={16} />
                            Аналитика
                        </button>
                        <button
                            onClick={() => router.push('/audits')}
                            className="flex-1 bg-white border border-blue-200 hover:bg-blue-50 text-blue-700 py-3 rounded-xl font-semibold text-sm shadow-sm transition-transform active:scale-95 flex items-center justify-center gap-2"
                        >
                            <ClipboardList size={16} />
                            Ревизии
                        </button>
                    </div>
                </div>
            </div>

            {/* Поиск */}
            <div className="relative mb-6">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Поиск по источнику..."
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all"
                />
            </div>

            {/* List Header */}
            <div className="flex items-center justify-between text-xs text-gray-400 mb-2 px-2">
                <div>Источник Финансирования</div>
                {filters.category && (
                    <button onClick={() => setFilter('category', null)} className="flex items-center gap-1 text-blue-600 hover:text-blue-700">
                        <span className="font-semibold">{filters.category}</span>
                        <X size={12} />
                    </button>
                )}
                {!filters.category && (
                    <div className="flex gap-8">
                        <span>Сумма</span>
                        <span>Доля</span>
                    </div>
                )}
            </div>

            {/* Assets List (Funding Sources) */}
            <div className="flex-1 overflow-auto -mx-2 px-2 space-y-1">
                {[
                    { name: 'Респ. Бюджет', code: 'РБ', price: '65.23', change: '45%', isUp: true, starred: true },
                    { name: 'Местный Бюджет', code: 'МБ', price: '28.12', change: '19%', isUp: false, starred: false },
                    { name: 'Пенсионный Фонд', code: 'ПФ', price: '15.45', change: '11%', isUp: true, starred: false },
                    { name: 'Фонд Развития', code: 'ФР', price: '12.80', change: '9%', isUp: false, starred: true },
                    { name: 'Внебюджетные', code: 'ВБ', price: '8.54', change: '6%', isUp: false, starred: true },
                    { name: 'Гранты и МФИ', code: 'ГР', price: '4.86', change: '3%', isUp: true, starred: false },
                    { name: 'Спонсорские', code: 'СП', price: '1.24', change: '1%', isUp: true, starred: false },
                ].map((item, i) => {
                    const isActive = filters.category === item.code;
                    return (
                        <div
                            key={i}
                            onClick={() => setFilter('category', item.code)}
                            className={`flex items-center justify-between p-3 rounded-xl cursor-pointer group transition-all duration-200 border 
                                ${isActive ? 'bg-blue-50 border-blue-200 shadow-sm' : 'border-transparent hover:bg-gray-50'} `}
                        >
                            <div className="flex items-center gap-3">
                                <Star size={14} className={`${item.starred ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} transition-colors`} />
                                <div>
                                    <div className={`font-semibold text-sm ${isActive ? 'text-blue-700' : 'text-gray-900'} `}>{item.code}</div>
                                    <div className="text-xs text-gray-400 mt-0.5">{item.name}</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className={`font-semibold text-sm ${isActive ? 'text-blue-900' : 'text-gray-900'} `}>
                                    {new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'UZS', maximumFractionDigits: 0 }).format(Number(item.price) * 1000000)}
                                </div>
                                <div className="text-xs font-medium mt-0.5 flex items-center justify-end gap-1 text-gray-500">
                                    {item.change}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Макет Нижнего Колонтитула */}
            <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between text-xs mb-2">
                    <span className="font-semibold text-gray-900">Критичность</span>
                    <span className="text-gray-500">30.83%</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="w-[30%] h-full bg-gradient-to-r from-blue-500 to-red-500"></div>
                </div>
            </div>
        </div>
    );
}

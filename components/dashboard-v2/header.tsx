import { Bell, ChevronDown, LayoutGrid, Search, Wallet } from 'lucide-react';
import { Button } from "@/components/ui/button"

export function Header() {
    const modules = [
        { name: 'Обзор', active: true, icon: LayoutGrid },
        { name: 'Ревизии', active: false, icon: Search },
        { name: 'Нарушения', active: false, icon: AlertIcon },
        { name: 'Отчеты', active: false, icon: Wallet },
        { name: 'Аналитика', active: false, icon: ChartIcon },
        { name: 'Настройки', active: false, icon: SettingsIcon },
    ];

    return (
        <header className="border-b border-gray-200 bg-white px-6 py-3 shrink-0">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                            <LayoutGrid size={20} />
                        </div>
                    </div>

                    {/* Left Actions */}
                    <div className="flex items-center gap-1 pl-6 border-l border-gray-100">
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg">
                            <Search size={20} />
                        </button>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full border border-green-100">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-xs font-medium text-green-700">Система активна</span>
                        </div>
                    </div>
                </div>

                {/* Center Navigation (Exchange Tabs style) */}
                <div className="flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
                    {modules.map((mod) => (
                        <button
                            key={mod.name}
                            className={`flex items-center gap-2 text-sm transition-colors ${mod.active
                                ? 'text-blue-600 font-semibold'
                                : 'text-gray-500 hover:text-gray-900'
                                }`}
                        >
                            {/* {mod.active && <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>} */}
                            {mod.name}
                        </button>
                    ))}
                </div>

                {/* Right side */}
                <div className="flex items-center gap-4">
                    <button className="relative p-2 text-gray-500 hover:bg-gray-50 rounded-lg hover:text-gray-700 transition-colors">
                        <Bell size={20} />
                        <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>

                    <div className="h-8 w-px bg-gray-200"></div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg hover:border-gray-300 cursor-pointer bg-gray-50">
                            <span className="text-sm font-medium text-gray-700">UZS</span>
                            <ChevronDown size={14} className="text-gray-400" />
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg hover:border-gray-300 cursor-pointer bg-white transition-colors">
                            <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center text-[10px] text-white font-bold">Р</div>
                            <span className="text-sm font-medium text-gray-700">Р. Фазылов</span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

function AlertIcon({ className }: { className?: string }) {
    return <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
}

function ChartIcon({ className }: { className?: string }) {
    return <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18" /><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" /></svg>
}

function SettingsIcon({ className }: { className?: string }) {
    return <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
}

import { Home, TrendingUp, Link2, Share2, CreditCard, FileText, Compass, HelpCircle, Settings, User } from 'lucide-react';

export function Sidebar() {
    const menuItems = [
        { icon: Home, active: false },
        { icon: TrendingUp, active: true },
        { icon: Link2, active: false },
        { icon: Share2, active: false },
        { icon: CreditCard, active: true, badge: true },
        { icon: FileText, active: false },
        { icon: Compass, active: false },
    ];

    const bottomItems = [
        { icon: HelpCircle },
        { icon: Settings },
        { icon: User },
    ];

    return (
        <aside className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 h-full">
            <div className="flex-1 flex flex-col gap-6">
                {menuItems.map((item, index) => (
                    <button
                        key={index}
                        className={`w-10 h-10 flex items-center justify-center rounded-lg relative ${item.active ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        <item.icon size={20} />
                        {item.badge && (
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        )}
                    </button>
                ))}
            </div>

            <div className="flex flex-col gap-4">
                {bottomItems.map((item, index) => (
                    <button
                        key={index}
                        className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-lg"
                    >
                        <item.icon size={20} />
                    </button>
                ))}
            </div>
        </aside>
    );
}

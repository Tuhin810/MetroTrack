import React from 'react';
import { Map, Search, Clock, Ticket } from 'lucide-react';
import { View } from '../../types';

interface NavItemProps {
    active: boolean;
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    theme: 'light' | 'dark';
}

const NavItem: React.FC<NavItemProps> = ({ active, icon, label, onClick, theme }) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center justify-center py-2.5 px-4 rounded-2xl transition-all duration-300 ${active
            ? 'bg-[#FF4B3A] text-white shadow-lg shadow-red-500/30'
            : theme === 'dark'
                ? 'text-slate-400 hover:text-slate-200'
                : 'text-slate-500 hover:text-slate-700'
            }`}
    >
        <div className="mb-0.5">
            {icon}
        </div>
        <span className="text-[10px] font-bold">{label}</span>
    </button>
);

interface BottomNavProps {
    activeView: View;
    theme: 'light' | 'dark';
    onNavigate: (view: View) => void;
    isFloating?: boolean;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeView, theme, onNavigate, isFloating = false }) => {
    const navItems = [
        { view: 'map' as View, icon: <Map size={22} />, label: 'Map' },
        { view: 'search' as View, icon: <Search size={22} />, label: 'Routes' },
        { view: 'timings' as View, icon: <Clock size={22} />, label: 'Times' },
        { view: 'tickets' as View, icon: <Ticket size={22} />, label: 'Tickets' },
    ];

    if (isFloating) {
        return (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 px-4 w-full max-w-md">
                <nav className={`rounded-[28px] p-2 flex items-center justify-around shadow-2xl ${theme === 'dark' ? 'bg-black/10 shadow-black/40' : 'bg-white/70 shadow-slate-400/20'} backdrop-blur-sm`}>
                    {navItems.map((item) => (
                        <NavItem
                            key={item.view}
                            active={activeView === item.view}
                            icon={item.icon}
                            label={item.label}
                            onClick={() => onNavigate(item.view)}
                            theme={theme}
                        />
                    ))}
                </nav>
            </div>
        );
    }

    return (
        <nav className={`sticky bottom-0 w-full z-40 flex items-center justify-around py-2 border-t shadow-[0_-4px_20px_rgba(0,0,0,0.08)] ${theme === 'dark' ? 'bg-slate-900 border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.3)]' : 'bg-white/70 border-slate-100'} `}>
            {navItems.map((item) => (
                <NavItem
                    key={item.view}
                    active={activeView === item.view}
                    icon={item.icon}
                    label={item.label}
                    onClick={() => onNavigate(item.view)}
                    theme={theme}
                />
            ))}
        </nav>
    );
};

export default BottomNav;

import React, { useState } from 'react';
import { User, Settings, Bell, CreditCard, Heart, MapPin, Clock, ChevronRight, LogOut, Moon, Sun, Shield, HelpCircle, Info } from 'lucide-react';

interface ProfileProps {
    theme?: 'light' | 'dark';
    onThemeToggle?: () => void;
}

const Profile: React.FC<ProfileProps> = ({ theme = 'light', onThemeToggle }) => {
    const isDark = theme === 'dark';
    const [userName] = useState('Metro Traveler');
    const [userEmail] = useState('traveler@metrotrack.com');

    const stats = [
        { label: 'Trips', value: '47', icon: MapPin },
        { label: 'Hours', value: '12.5', icon: Clock },
        { label: 'Saved', value: '₹340', icon: Heart }
    ];

    const menuSections = [
        {
            title: 'Account',
            items: [
                { icon: User, label: 'Edit Profile', badge: null },
                { icon: CreditCard, label: 'Payment Methods', badge: '2' },
                { icon: Bell, label: 'Notifications', badge: null },
            ]
        },
        {
            title: 'Preferences',
            items: [
                { icon: isDark ? Sun : Moon, label: 'Theme', badge: isDark ? 'Dark' : 'Light', action: onThemeToggle },
                { icon: MapPin, label: 'Saved Locations', badge: '5' },
            ]
        },
        {
            title: 'Support',
            items: [
                { icon: HelpCircle, label: 'Help & Support', badge: null },
                { icon: Shield, label: 'Privacy Policy', badge: null },
                { icon: Info, label: 'About', badge: 'v1.0.0' },
            ]
        }
    ];

    return (
        <div className={`h-full overflow-y-auto no-scrollbar pb-32 ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
            {/* Profile Header */}
            <div className={`pt-8 pb-6 px-6 ${isDark ? 'bg-gradient-to-b from-slate-900 to-slate-950' : 'bg-gradient-to-b from-white to-slate-50'}`}>
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FF4B3A] to-orange-600 flex items-center justify-center text-white shadow-xl">
                        <User size={36} strokeWidth={2.5} />
                    </div>
                    <div className="flex-1">
                        <h2 className={`text-2xl font-black mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{userName}</h2>
                        <p className="text-sm text-slate-400 font-medium">{userEmail}</p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                    {stats.map((stat) => (
                        <div key={stat.label} className={`rounded-2xl p-4 border ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-100'}`}>
                            <div className="flex items-center justify-center mb-2">
                                <stat.icon size={18} className="text-[#FF4B3A]" />
                            </div>
                            <p className={`text-2xl font-black text-center mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{stat.value}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider text-center">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Menu Sections */}
            <div className="px-6 pt-6 space-y-8">
                {menuSections.map((section) => (
                    <div key={section.title}>
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-3 px-1">{section.title}</h3>
                        <div className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
                            {section.items.map((item, idx) => (
                                <button
                                    key={item.label}
                                    onClick={item.action}
                                    className={`w-full px-4 py-4 flex items-center justify-between transition-colors ${idx !== section.items.length - 1 ? (isDark ? 'border-b border-slate-800' : 'border-b border-slate-100') : ''
                                        } ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-50'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                            <item.icon size={20} className={isDark ? 'text-slate-400' : 'text-slate-600'} />
                                        </div>
                                        <span className={`font-bold text-sm ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>{item.label}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {item.badge && (
                                            <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'}`}>
                                                {item.badge}
                                            </span>
                                        )}
                                        <ChevronRight size={18} className="text-slate-400" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}

                {/* Logout Button */}
                <button className={`w-full rounded-2xl p-4 flex items-center justify-center gap-3 border transition-all ${isDark ? 'bg-slate-900 border-slate-800 text-red-400 hover:bg-red-500/10' : 'bg-white border-slate-100 text-red-600 hover:bg-red-50'}`}>
                    <LogOut size={20} />
                    <span className="font-bold text-sm">Log Out</span>
                </button>

                {/* App Version */}
                <div className="text-center py-4">
                    <p className="text-xs text-slate-400 font-medium">MetroTrack Kolkata</p>
                    <p className="text-[10px] text-slate-500 font-medium mt-1">Made with ❤️ for metro travelers</p>
                </div>
            </div>
        </div>
    );
};

export default Profile;

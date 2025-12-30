import React from 'react';
import { User, Sun, Moon } from 'lucide-react';

interface HeaderProps {
    theme: 'light' | 'dark';
    onThemeToggle: () => void;
    onProfileClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, onThemeToggle, onProfileClick }) => {
    return (
        <header className={`px-6 py-4 flex items-center justify-between ${theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-100'} backdrop-blur-md sticky top-0 z-30 border-b`}>
            <div className="flex items-center gap-1">
                <div className="w-12 h-12">
                    <img src="/favicon_io/apple-touch-icon.png" alt="MetroTrack Logo" className="w-full h-full object-cover" />
                </div>
                <h1 className={`font-extrabold text-xl tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    Metro<span className="text-[#FF4B3A]">Track</span>
                </h1>
            </div>
            <div className="flex gap-2">
                <button
                    onClick={onThemeToggle}
                    className={`p-2.5 rounded-full ${theme === 'dark' ? 'bg-slate-800 text-yellow-400' : 'bg-slate-50 text-slate-600'} active:scale-90 transition-all`}
                >
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>
                <button
                    onClick={onProfileClick}
                    className={`p-2.5 rounded-full ${theme === 'dark' ? 'bg-slate-800 text-slate-400' : 'bg-slate-50 text-slate-600'} active:bg-slate-100 transition-colors`}
                >
                    <User size={20} />
                </button>
            </div>
        </header>
    );
};

export default Header;

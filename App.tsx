
import React, { useState, useEffect } from 'react';
import { View, Station } from './types';
import LiveMap from './components/LiveMap';
import RoutePlanner from './components/RoutePlanner';
import Timings from './components/Timings';
import Profile from './components/Profile';
import { Map, Search, Clock, Ticket, Bell, User, Sun, Moon } from 'lucide-react';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('search');
  const [initialStation, setInitialStation] = useState<Station | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Check local storage or system preference on mount
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleViewSchedule = (station: Station) => {
    setInitialStation(station);
    setActiveView('timings');
  };

  const renderView = () => {
    switch (activeView) {
      case 'map': return <LiveMap theme={theme} onViewSchedule={handleViewSchedule} />;
      case 'search': return <RoutePlanner theme={theme} />;
      case 'timings': return <Timings theme={theme} initialStation={initialStation} onStationCleared={() => setInitialStation(null)} />;
      case 'profile': return <Profile theme={theme} onThemeToggle={toggleTheme} />;
      case 'tickets': return (
        <div className={`flex flex-col items-center justify-center h-full p-8 text-center space-y-6 ${theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>
          <div className={`w-24 h-24 ${theme === 'dark' ? 'bg-slate-800 text-blue-400' : 'bg-blue-50 text-blue-600'} rounded-full flex items-center justify-center`}>
            <Ticket size={48} />
          </div>
          <h2 className="text-2xl font-extrabold">Digital Tickets</h2>
          <p className={`${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'} max-w-xs`}>Buy and manage your Kolkata Metro QR tickets directly from your mobile.</p>
          <a
            href="https://mtp.indianrailways.gov.in/index.jsp?lang=0&id=0,5"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#FF4B3A] text-white w-full py-4 rounded-2xl font-bold text-lg shadow-lg shadow-orange-200 active:scale-95 transition-all text-center"
          >
            Launch Metro Ride
          </a>
        </div>
      );
    }
  };

  return (
    <div className={`flex flex-col h-screen w-full max-w-md mx-auto relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.1)] border-x ${theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-100'}`}>
      {/* Top Header */}
      {activeView !== 'map' && (
        <header className={`px-6 py-4 flex items-center justify-between ${theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-100'} backdrop-blur-md sticky top-0 z-30 border-b`}>
          <div className="flex items-center gap-1">
            <div className="w-12 h-12  ">
              <img src="/favicon_io/apple-touch-icon.png" alt="MetroTrack Logo" className="w-full h-full object-cover" />
            </div>
            <h1 className={`font-extrabold text-xl tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Metro<span className="text-[#FF4B3A]">Track</span></h1>
          </div>
          <div className="flex gap-2">
            <button onClick={toggleTheme} className={`p-2.5 rounded-full ${theme === 'dark' ? 'bg-slate-800 text-yellow-400' : 'bg-slate-50 text-slate-600'} active:scale-90 transition-all`}>
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <button onClick={() => setActiveView('profile')} className={`p-2.5 rounded-full ${theme === 'dark' ? 'bg-slate-800 text-slate-400' : 'bg-slate-50 text-slate-600'} active:bg-slate-100 transition-colors`}>
              <User size={20} />
            </button>
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <main className={`flex-1 relative overflow-hidden ${activeView === 'map' ? '' : (theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50')}`}>
        {renderView()}
      </main>

      {/* Bottom Navigation - Modern Floating Style */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 px-4 w-full max-w-md">
        <nav className={`rounded-[28px] p-2 flex items-center justify-around shadow-2xl ${theme === 'dark' ? 'bg-slate-900/90 shadow-black/40' : 'bg-white shadow-slate-400/20'} backdrop-blur-2xl`}>
          <NavItem
            active={activeView === 'map'}
            icon={<Map size={22} />}
            label="Map"
            onClick={() => { setActiveView('map'); setInitialStation(null); }}
            theme={theme}
          />
          <NavItem
            active={activeView === 'search'}
            icon={<Search size={22} />}
            label="Routes"
            onClick={() => setActiveView('search')}
            theme={theme}
          />
          <NavItem
            active={activeView === 'timings'}
            icon={<Clock size={22} />}
            label="Times"
            onClick={() => setActiveView('timings')}
            theme={theme}
          />
          <NavItem
            active={activeView === 'tickets'}
            icon={<Ticket size={22} />}
            label="Tickets"
            onClick={() => setActiveView('tickets')}
            theme={theme}
          />
        </nav>
      </div>
      {/* Map-specific theme toggle when in map view */}
      {activeView === 'map' && (
        <button
          onClick={toggleTheme}
          className={`absolute top-24 right-6 z-[1001] w-14 h-14 rounded-full shadow-2xl flex items-center justify-center border-2 transition-all active:scale-90 ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-yellow-400' : 'bg-white border-white text-slate-600'}`}
        >
          {theme === 'light' ? <Moon size={22} strokeWidth={2.5} /> : <Sun size={22} strokeWidth={2.5} />}
        </button>
      )}
    </div>
  );
};

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

export default App;

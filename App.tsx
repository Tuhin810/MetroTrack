
import React, { useState, useEffect } from 'react';
import { View, Station } from './types';
import LiveMap from './components/LiveMap';
import RoutePlanner from './components/RoutePlanner';
import Timings from './components/Timings';
import { Map, Search, Clock, Ticket, Bell, User, Sun, Moon } from 'lucide-react';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('map');
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
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-[#FF4B3A] rounded-xl flex items-center justify-center text-white font-black text-xs">M</div>
             <h1 className={`font-extrabold text-xl tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Metro<span className="text-[#FF4B3A]">Track</span></h1>
          </div>
          <div className="flex gap-2">
            <button onClick={toggleTheme} className={`p-2.5 rounded-full ${theme === 'dark' ? 'bg-slate-800 text-yellow-400' : 'bg-slate-50 text-slate-600'} active:scale-90 transition-all`}>
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <button className={`p-2.5 rounded-full ${theme === 'dark' ? 'bg-slate-800 text-slate-400' : 'bg-slate-50 text-slate-600'} active:bg-slate-100 transition-colors`}>
              <User size={20} />
            </button>
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <main className={`flex-1 relative overflow-hidden ${activeView === 'map' ? '' : (theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50')}`}>
        {renderView()}
      </main>

      {/* Bottom Navigation */}
      <nav className={`h-20 ${theme === 'dark' ? 'bg-slate-900/95 border-slate-800' : 'bg-white/95 border-slate-100'} backdrop-blur-xl border-t flex items-center justify-around px-4 sticky bottom-0 z-40 pb-safe`}>
        <NavItem 
          active={activeView === 'map'} 
          icon={<Map size={24} />} 
          label="Map" 
          onClick={() => { setActiveView('map'); setInitialStation(null); }} 
        />
        <NavItem 
          active={activeView === 'search'} 
          icon={<Search size={24} />} 
          label="Search" 
          onClick={() => setActiveView('search')} 
        />
        <NavItem 
          active={activeView === 'timings'} 
          icon={<Clock size={24} />} 
          label="Timings" 
          onClick={() => setActiveView('timings')} 
        />
        <NavItem 
          active={activeView === 'tickets'} 
          icon={<Ticket size={24} />} 
          label="Tickets" 
          onClick={() => setActiveView('tickets')} 
        />
      </nav>
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
}

const NavItem: React.FC<NavItemProps> = ({ active, icon, label, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-20 transition-all duration-200 ${active ? 'text-[#FF4B3A]' : 'text-slate-400'}`}
  >
    <div className={`mb-1 transition-all ${active ? 'scale-110' : ''}`}>
      {icon}
    </div>
    <span className={`text-[10px] font-bold uppercase tracking-widest ${active ? 'opacity-100' : 'opacity-60'}`}>{label}</span>
    {active && <div className="w-1.5 h-1.5 bg-[#FF4B3A] rounded-full mt-1.5" />}
  </button>
);

export default App;

import React, { useState, useEffect } from 'react';
import { View, Station } from './types';
import LiveMap from './components/LiveMap';
import RoutePlanner from './components/RoutePlanner';
import Timings from './components/Timings';
import Profile from './components/Profile';
import { BottomNav, Header } from './components/shared';
import { Ticket, Sun, Moon } from 'lucide-react';

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

  const handleNavigate = (view: View) => {
    setActiveView(view);
    if (view === 'map') {
      setInitialStation(null);
    }
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
        <Header
          theme={theme}
          onThemeToggle={toggleTheme}
          onProfileClick={() => setActiveView('profile')}
        />
      )}

      {/* Main Content Area */}
      <main className={`flex-1 relative overflow-hidden ${activeView === 'map' ? '' : (theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50')}`}>
        {renderView()}
      </main>

      {/* Bottom Navigation - Floating for Map, Docked for Others */}
      <BottomNav
        activeView={activeView}
        theme={theme}
        onNavigate={handleNavigate}
        isFloating={activeView === 'map'}
      />

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

export default App;

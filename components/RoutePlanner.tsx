import React, { useState, useMemo } from 'react';
import { Train } from 'lucide-react';
import { ALL_STATIONS } from '../data/metroData';
import { calculateFare, getDetailedRoute } from '../utils/tracker';
import { Station } from '../types';
import { StationSelector, RouteCard, RouteItinerary } from './route-planner';

interface RoutePlannerProps {
  theme?: 'light' | 'dark';
}

const RoutePlanner: React.FC<RoutePlannerProps> = ({ theme = 'light' }) => {
  // State
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [fromQuery, setFromQuery] = useState('');
  const [toQuery, setToQuery] = useState('');
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  const [showItinerary, setShowItinerary] = useState(false);

  const isDark = theme === 'dark';

  // Calculate route
  const routeResult = useMemo(() => {
    const sFrom = ALL_STATIONS.find(s => s.id === from);
    const sTo = ALL_STATIONS.find(s => s.id === to);
    if (sFrom && sTo) {
      const legs = getDetailedRoute(sFrom, sTo);
      const totalDist = legs.reduce((acc, leg) => acc + leg.distance, 0);
      const totalFare = calculateFare(totalDist);
      const totalTime = Math.round(totalDist * 2.5 + (legs.length > 1 ? (legs.length - 1) * 8 : 5));
      const totalStations = legs.reduce((acc, leg) => acc + leg.stations.length - (acc > 0 ? 1 : 0), 0);
      return { legs, totalFare, totalTime, totalDist, sFrom, sTo, totalStations };
    }
    return null;
  }, [from, to]);

  // Handlers
  const handleSelectFrom = (station: Station) => {
    setFrom(station.id);
    setFromQuery(station.name);
    setShowFromSuggestions(false);
  };

  const handleSelectTo = (station: Station) => {
    setTo(station.id);
    setToQuery(station.name);
    setShowToSuggestions(false);
  };

  const handleFromQueryChange = (value: string) => {
    setFromQuery(value);
    setFrom('');
    setShowFromSuggestions(true);
  };

  const handleToQueryChange = (value: string) => {
    setToQuery(value);
    setTo('');
    setShowToSuggestions(true);
  };

  const handleSwap = () => {
    const tempFrom = from;
    const tempFromQuery = fromQuery;
    setFrom(to);
    setFromQuery(toQuery);
    setTo(tempFrom);
    setToQuery(tempFromQuery);
  };

  const handleFindRoute = () => {
    if (routeResult) {
      setShowItinerary(true);
    }
  };

  // Render Itinerary View
  if (showItinerary && routeResult) {
    return (
      <RouteItinerary
        routeResult={routeResult}
        onBack={() => setShowItinerary(false)}
        theme={theme}
      />
    );
  }

  // Render Main View
  return (
    <div className={`relative h-full overflow-y-auto no-scrollbar pb-32 transition-colors duration-500 ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full blur-[100px] opacity-20 ${isDark ? 'bg-blue-600' : 'bg-blue-200'}`} />
        <div className={`absolute bottom-[10%] left-[-10%] w-[300px] h-[300px] rounded-full blur-[80px] opacity-10 ${isDark ? 'bg-orange-600' : 'bg-orange-200'}`} />
      </div>

      <div className="relative z-10 p-6 px-5 max-w-lg mx-auto">
        {/* Header Section */}
        <div className="mb-8 pt-4 px-1">

          <h2 className={`text-[32px] font-black leading-[1.1] tracking-tight animate-in fade-in slide-in-from-bottom duration-700 delay-150 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Where would you <br />
            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              like to travel
            </span> today?
          </h2>
        </div>

        {/* Station Selector Container */}
        <div className="animate-in fade-in slide-in-from-bottom duration-700 delay-300">
          <StationSelector
            fromQuery={fromQuery}
            toQuery={toQuery}
            from={from}
            to={to}
            showFromSuggestions={showFromSuggestions}
            showToSuggestions={showToSuggestions}
            onFromQueryChange={handleFromQueryChange}
            onToQueryChange={handleToQueryChange}
            onFromFocus={() => {
              setShowFromSuggestions(true);
              setShowToSuggestions(false);
            }}
            onToFocus={() => {
              setShowToSuggestions(true);
              setShowFromSuggestions(false);
            }}
            onSelectFrom={handleSelectFrom}
            onSelectTo={handleSelectTo}
            onSwap={handleSwap}
            onFindRoute={handleFindRoute}
            hasRoute={!!routeResult}
            theme={theme}
          />
        </div>

        {/* Route Card Section */}
        {routeResult && (
          <div className="mt-8 animate-in fade-in zoom-in-95 duration-500">
            <RouteCard
              totalTime={routeResult.totalTime}
              totalFare={routeResult.totalFare}
              totalStations={routeResult.totalStations}
              onPress={() => setShowItinerary(true)}
              theme={theme}
            />
          </div>
        )}

        {/* Quick Access Section - Shows when no route is found */}
        {!routeResult && (
          <div className="mt-12 animate-in fade-in slide-in-from-bottom duration-700 delay-500">
            <div className="flex justify-between items-center mb-6 px-1">
              <h3 className={`text-xs font-black uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                Major Stations
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: 'Howrah', id: 'howrah-maidan', color: '#3b82f6' },
                { name: 'Esplanade', id: 'esplanade-blue', color: '#3b82f6' },
                { name: 'Sector V', id: 'salt-lake-sector-v', color: '#22c55e' },
                { name: 'Sealdah', id: 'sealdah', color: '#22c55e' }
              ].map((station, i) => (
                <button
                  key={station.id}
                  onClick={() => {
                    const s = ALL_STATIONS.find(st => st.id === station.id);
                    if (s) {
                      if (!from) handleSelectFrom(s);
                      else handleSelectTo(s);
                    }
                  }}
                  className={`flex items-center gap-4 p-3 rounded-2xl border transition-all duration-300 active:scale-95 ${isDark
                    ? 'bg-slate-900 border-slate-800 hover:bg-slate-800 hover:border-slate-700'
                    : 'bg-white border-slate-100 hover:shadow-lg hover:shadow-slate-200/50 hover:border-slate-200'
                    }`}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md flex-shrink-0"
                    style={{ backgroundColor: station.color }}
                  >
                    <Train size={18} />
                  </div>
                  <span className={`text-sm font-black ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                    {station.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoutePlanner;

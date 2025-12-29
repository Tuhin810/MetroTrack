
import React, { useState, useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { ALL_STATIONS, LINE_COLORS } from '../data/metroData';
import { calculateFare, getDetailedRoute } from '../utils/tracker';
import { Station } from '../types';
import { ArrowLeft, ArrowRightLeft, ChevronRight, Circle, X, Bell, User, Train, ArrowDown, MapPin } from 'lucide-react';

const miniMarkerIcon = (color: string) => L.divIcon({
  html: `<div class="w-4 h-4 rounded-full border-2 border-white shadow-md" style="background-color: ${color}"></div>`,
  className: '',
  iconSize: [16, 16],
  iconAnchor: [8, 8]
});

const RouteMapController = ({ stations }: { stations: Station[] }) => {
  const map = useMap();
  useEffect(() => {
    if (stations.length > 0) {
      const bounds = L.latLngBounds(stations.map(s => [s.lat, s.lng]));
      map.fitBounds(bounds, { padding: [40, 40], animate: true });
    }
  }, [stations, map]);
  return null;
};

interface RoutePlannerProps {
  theme?: 'light' | 'dark';
}

const RoutePlanner: React.FC<RoutePlannerProps> = ({ theme = 'light' }) => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [fromQuery, setFromQuery] = useState('');
  const [toQuery, setToQuery] = useState('');
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  const [showItinerary, setShowItinerary] = useState(false);

  const isDark = theme === 'dark';

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

  const allRouteStations = useMemo(() => {
    if (!routeResult) return [];
    return routeResult.legs.flatMap(l => l.stations);
  }, [routeResult]);

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

  if (showItinerary && routeResult) {
    return (
      <div className={`flex flex-col h-full animate-in slide-in-from-right duration-300 relative z-[1002] ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
        <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
          <div className="relative h-60 bg-slate-100 overflow-hidden z-0">
            <MapContainer
              center={[routeResult.sFrom.lat, routeResult.sFrom.lng]} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false}
              dragging={false} touchZoom={false} scrollWheelZoom={false}
            >
              <RouteMapController stations={allRouteStations} />
              <TileLayer url={isDark ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"} />
              {routeResult.legs.map((leg, i) => (
                <React.Fragment key={`map-leg-${i}`}>
                  <Polyline positions={leg.stations.map(s => [s.lat, s.lng]) as [number, number][]} color={leg.color} weight={5} opacity={0.8} />
                  <Marker position={[leg.stations[0].lat, leg.stations[0].lng]} icon={miniMarkerIcon(leg.color)} />
                </React.Fragment>
              ))}
            </MapContainer>
            <div className="absolute top-6 left-6 z-[1001]">
              <button onClick={() => setShowItinerary(false)} className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-xl active:scale-95 transition-all">
                <ArrowLeft size={20} />
              </button>
            </div>
            <div className={`absolute inset-0 pointer-events-none bg-gradient-to-t ${isDark ? 'from-slate-900' : 'from-white'} via-transparent to-transparent opacity-60`} />
          </div>

          <div className="px-1 -mt-10 relative z-10">
            <div className={`rounded-t-[40px] pt-8 pb-6 ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
              <div className="flex justify-between px-5 items-start gap-4 mb-6">
                <div className="flex-1 min-w-0">
                  <h2 className={`text-2xl font-black leading-tight tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{routeResult.sTo.name}</h2>
                  <p className="text-xs font-bold text-slate-400 mt-1.5 uppercase tracking-wide">From <span className={isDark ? 'text-slate-200' : 'text-slate-700'}>{routeResult.sFrom.name}</span></p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`text-4xl font-black leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>{routeResult.totalTime}</p>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">MINS</p>
                </div>
              </div>

              <div className="flex gap-2.5 mb-10">
                {[
                  { label: 'FARE', val: `₹${routeResult.totalFare}` },
                  { label: 'STOPS', val: routeResult.totalStations },
                  { label: 'SWITCHES', val: routeResult.legs.length - 1 }
                ].map((item, i) => (
                  <div key={i} className={`flex-1 px-3 py-3.5 rounded-2xl flex flex-col items-center justify-center border backdrop-blur ${isDark ? 'bg-slate-800/50 border-slate-800' : 'bg-slate-50/80 border-slate-100'}`}>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.15em] mb-1">{item.label}</p>
                    <p className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.val}</p>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] mb-8 px-1">STATIONS</h3>
                <div className="space-y-0 relative pl-4">
                  <div className={`absolute left-[15px] top-3 bottom-3 w-px ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`} />
                  {routeResult.legs.map((leg, legIdx) => (
                    <React.Fragment key={legIdx}>
                      <div className="flex items-start gap-8 mb-10 relative z-10">
                        <div className={`w-4 h-4 rounded-full border-[3.5px] bg-white mt-1.5 shadow-sm`} style={{ borderColor: legIdx === 0 ? '#3b82f6' : '#94a3b8' }} />
                        <div>
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-0.5">{legIdx === 0 ? 'STARTING POINT' : 'TRANSFER STATION'}</p>
                          <p className={`text-lg font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{leg.stations[0].name}</p>
                        </div>
                      </div>
                      <div className="mb-10 ml-12">
                        <div className={`border shadow-xl rounded-[32px] p-6 relative overflow-hidden ${isDark ? 'bg-slate-800/50 border-slate-700 shadow-black/20' : 'bg-white border-slate-50 shadow-slate-100/60'}`}>
                          <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ backgroundColor: leg.color }} />
                          <div className="flex justify-between items-center mb-6 pl-2">
                            <span className="px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest text-white shadow-sm" style={{ backgroundColor: leg.color }}>{leg.line} Line</span>
                            <span className="text-[11px] font-black text-slate-400 tracking-tight">{(leg.stations.length - 1) * 2.5} mins</span>
                          </div>
                          <div className="pl-2 space-y-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-slate-500 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}><Train size={16} /></div>
                              <div>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Board Toward</p>
                                <p className={`text-sm font-black ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>{leg.direction}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-slate-500 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}><ArrowDown size={16} /></div>
                              <div>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Get Off At</p>
                                <p className={`text-sm font-black ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>{leg.stations[leg.stations.length - 1].name}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={`fixed bottom-0 left-0 right-0 p-6 backdrop-blur-md border-t z-[1004] max-w-md mx-auto ${isDark ? 'bg-slate-900/95 border-slate-800' : 'bg-white/95 border-slate-100'}`}>
          <button className="w-full bg-[#FF4B3A] text-white font-black py-5 rounded-[28px] shadow-2xl shadow-red-200 active:scale-[0.98] transition-all text-xl flex items-center justify-center gap-3">
            Confirm & Pay ₹{routeResult.totalFare}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 pb-24 h-full overflow-y-auto no-scrollbar ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <div className="mb-10 pt-4 px-2">
        <h2 className={`text-3xl font-black leading-tight tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Where would you <br /> like to travel today?</h2>
      </div>

      <div className={`rounded-[20px] p-4 shadow-2xl border space-y-6 mb-8 relative ${isDark ? 'bg-slate-900 border-slate-800 shadow-black/20' : 'bg-white border-slate-100 shadow-slate-300/90'}`}>
        <div className="space-y-8 relative">
          <div className={`absolute left-[13px] top-6 bottom-6 w-px border-l border-dashed ${isDark ? 'border-slate-700' : 'border-slate-200'}`} />
          <div className="relative">
            <div className="flex items-center gap-4">
              <div className="w-3.5 h-3.5 rounded-full border-2 border-blue-500 bg-white relative z-10 flex-shrink-0" />
              <input
                type="text" placeholder="I'm at..."
                className={`w-full text-base font-bold outline-none placeholder:font-semibold placeholder:text-slate-400 bg-transparent ${isDark ? 'text-white' : 'text-slate-900'}`}
                value={fromQuery}
                onChange={(e) => { setFromQuery(e.target.value); setFrom(''); setShowFromSuggestions(true); }}
                onFocus={() => { setShowFromSuggestions(true); setShowToSuggestions(false); }}
              />
            </div>
            {showFromSuggestions && fromQuery && !from && (
              <div className={`absolute left-7 right-0 top-full mt-2 rounded-2xl shadow-2xl border z-[100] overflow-hidden max-h-48 overflow-y-auto no-scrollbar ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-50'}`}>
                {ALL_STATIONS.filter(s => s.name.toLowerCase().includes(fromQuery.toLowerCase())).slice(0, 5).map(s => (
                  <button key={`f-${s.id}`} className={`w-full px-4 py-4 text-left text-sm font-black flex justify-between items-center border-b last:border-0 ${isDark ? 'hover:bg-slate-700 text-slate-300 border-slate-700' : 'hover:bg-slate-50 text-slate-600 border-slate-50'}`} onClick={() => handleSelectFrom(s)}>
                    {s.name}
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: LINE_COLORS[s.line] }} />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="relative">
            <div className="flex items-center gap-4">
              <div className="w-3.5 h-3.5 rounded-full border-2 border-red-500 bg-white relative z-10 flex-shrink-0" />
              <input
                type="text" placeholder="I'm going to..."
                className={`w-full text-base font-bold outline-none placeholder:font-semibold placeholder:text-slate-400 bg-transparent ${isDark ? 'text-white' : 'text-slate-900'}`}
                value={toQuery}
                onChange={(e) => { setToQuery(e.target.value); setTo(''); setShowToSuggestions(true); }}
                onFocus={() => { setShowToSuggestions(true); setShowFromSuggestions(false); }}
              />
            </div>
            {showToSuggestions && toQuery && !to && (
              <div className={`absolute left-7 right-0 top-full mt-2 rounded-2xl shadow-2xl border z-[100] overflow-hidden max-h-48 overflow-y-auto no-scrollbar ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-50'}`}>
                {ALL_STATIONS.filter(s => s.name.toLowerCase().includes(toQuery.toLowerCase())).slice(0, 5).map(s => (
                  <button key={`t-${s.id}`} className={`w-full px-4 py-4 text-left text-sm font-black flex justify-between items-center border-b last:border-0 ${isDark ? 'hover:bg-slate-700 text-slate-300 border-slate-700' : 'hover:bg-slate-50 text-slate-600 border-slate-50'}`} onClick={() => handleSelectTo(s)}>
                    {s.name}
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: LINE_COLORS[s.line] }} />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <button
          onClick={() => { const tf = from; const tfq = fromQuery; setFrom(to); setFromQuery(toQuery); setTo(tf); setToQuery(tfq); }}
          className={`absolute right-6 top-[30%] -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center shadow-sm border active:rotate-180 transition-transform duration-500 ${isDark ? 'bg-slate-800 border-slate-700 text-blue-400' : 'bg-slate-50 border-slate-100 text-blue-600'}`}
        >
          <ArrowRightLeft size={18} className="rotate-90" />
        </button>
        <button
          onClick={() => routeResult && setShowItinerary(true)}
          disabled={!routeResult}
          className={`w-full mt-4 py-3.5 rounded-[28px] font-bold text-base transition-all shadow-lg ${routeResult ? 'bg-[#3b82f6] text-white shadow-blue-500/20 active:scale-[0.98]' : (isDark ? 'bg-slate-800 text-slate-600' : 'bg-slate-100 text-slate-300')}`}
        >
          Find Route
        </button>
      </div>

      {routeResult && (
        <div className="px-2 animate-in slide-in-from-bottom-4">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 ml-1">Suggested Route</p>
          <button onClick={() => setShowItinerary(true)} className={`w-full rounded-[20px] p-6 shadow-md border flex items-center justify-between group transition-all ${isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-900'}`}>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDark ? 'bg-blue-900/20 text-blue-400' : 'bg-blue-50 text-blue-600'}`}><Circle size={20} fill="currentColor" /></div>
              <div className="text-left">
                <p className="text-xl font-black">{routeResult.totalTime} Mins</p>
                <p className={`text-xs font-bold tracking-tight ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>₹{routeResult.totalFare} • {routeResult.totalStations} Stops</p>
              </div>
            </div>
            <ChevronRight size={24} className="text-slate-600 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
          </button>
        </div>
      )}
    </div>
  );
};

export default RoutePlanner;

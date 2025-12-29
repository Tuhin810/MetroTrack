
import React, { useState, useMemo, useEffect } from 'react';
import { Clock, Info, Calendar, Search, X, MapPin, Train, ChevronRight, ArrowLeft, ArrowUpDown, ArrowRight } from 'lucide-react';
import { ALL_STATIONS, METRO_LINES, LINE_COLORS } from '../data/metroData';
import { Station, MetroLine } from '../types';

interface TimingsProps {
  initialStation?: Station | null;
  onStationCleared?: () => void;
  theme?: 'light' | 'dark';
}

const Timings: React.FC<TimingsProps> = ({ initialStation, onStationCleared, theme = 'light' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeFullChart, setActiveFullChart] = useState<MetroLine | null>(null);
  const [viewingStationSchedule, setViewingStationSchedule] = useState<boolean>(false);
  
  const isDark = theme === 'dark';

  useEffect(() => {
    if (initialStation) {
      setSelectedStation(initialStation);
      setSearchQuery(initialStation.name);
      setShowSuggestions(false);
    }
  }, [initialStation]);

  const suggestions = useMemo(() => 
    ALL_STATIONS.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5),
    [searchQuery]
  );

  const formatTime = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = Math.floor(minutes % 60);
    return `${h % 12 || 12}:${m.toString().padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
  };

  const generateFullDaySchedule = (station: Station, line: MetroLine, direction: 'up' | 'down') => {
    const stationIdx = line.stations.findIndex(s => s.id === station.id);
    const totalStations = line.stations.length;
    const offset = direction === 'up' ? stationIdx * 2.5 : (totalStations - 1 - stationIdx) * 2.5;
    const startTime = 6 * 60 + 50; 
    const endTime = 21 * 60 + 40;  
    const times: number[] = [];
    let currentTime = startTime;
    while (currentTime <= endTime) {
      times.push(currentTime + offset);
      const hour = Math.floor(currentTime / 60);
      const isPeak = (hour >= 9 && hour < 11.5) || (hour >= 17 && hour < 20);
      currentTime += isPeak ? 7 : 12;
    }
    return times.filter(t => t >= startTime && t <= (endTime + 30)).map(t => formatTime(t));
  };

  const getStationTimingSummary = (station: Station, line: MetroLine) => {
    const stationIdx = line.stations.findIndex(s => s.id === station.id);
    const totalStations = line.stations.length;
    const baseFirst = 6 * 60 + 50; 
    const baseLast = 21 * 60 + 30; 
    const upOffset = stationIdx * 2.5;
    const downOffset = (totalStations - 1 - stationIdx) * 2.5;
    return {
      up: { first: formatTime(baseFirst + upOffset), last: formatTime(baseLast + upOffset) },
      down: { first: formatTime(baseFirst + downOffset), last: formatTime(baseLast + downOffset) }
    };
  };

  const stationTimings = useMemo(() => {
    if (!selectedStation) return null;
    const line = METRO_LINES.find(l => l.stations.some(s => s.id === selectedStation.id));
    if (!line) return null;
    return { ...getStationTimingSummary(selectedStation, line), line };
  }, [selectedStation]);

  if (viewingStationSchedule && selectedStation && stationTimings) {
    const line = stationTimings.line;
    const upTimes = generateFullDaySchedule(selectedStation, line, 'up');
    const downTimes = generateFullDaySchedule(selectedStation, line, 'down');

    return (
      <div className={`flex flex-col h-full animate-in slide-in-from-right duration-300 ${isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>
        <div className={`px-6 py-6 border-b flex items-center justify-between sticky top-0 z-10 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
          <button onClick={() => setViewingStationSchedule(false)} className="text-slate-400 p-2 -ml-2"><ArrowLeft size={24} /></button>
          <div className="flex-1 text-center">
            <h2 className="text-lg font-black">{selectedStation.name}</h2>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Full Day Schedule</p>
          </div>
          <div className="w-10" />
        </div>

        <div className="flex-1 overflow-y-auto p-6 no-scrollbar space-y-8">
          {[
            { label: `Toward ${line.stations[line.stations.length-1].name}`, times: upTimes, alpha: '1' },
            { label: `Toward ${line.stations[0].name}`, times: downTimes, alpha: '0.5' }
          ].map((sec, idx) => (
            <section key={idx}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-6 rounded-full" style={{ backgroundColor: line.color, opacity: sec.alpha }} />
                <h3 className="text-sm font-black uppercase tracking-wider">{sec.label}</h3>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {sec.times.map((time, i) => (
                  <div key={i} className={`p-3 rounded-2xl text-center border ${isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-100 text-slate-700'}`}>
                    <p className="text-xs font-black">{time}</p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    );
  }

  if (activeFullChart) {
    return (
      <div className={`flex flex-col h-full animate-in slide-in-from-right duration-300 ${isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>
        <div className={`px-6 py-6 border-b flex items-center justify-between sticky top-0 z-10 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
          <button onClick={() => setActiveFullChart(null)} className="text-slate-400 p-2 -ml-2 transition-colors"><ArrowLeft size={24} /></button>
          <div className="flex-1 text-center">
            <h2 className="text-lg font-black">{activeFullChart.name}</h2>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Route Timeline</p>
          </div>
          <div className="w-10" />
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar">
          <div className={`px-6 py-4 border-b flex justify-between items-center text-[10px] font-black uppercase tracking-widest sticky top-0 z-20 ${isDark ? 'bg-slate-800 border-slate-700 text-slate-500' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
            <span className="w-1/3 text-left">Station</span>
            <span className="w-1/3 text-center">Terminal A</span>
            <span className="w-1/3 text-right">Terminal B</span>
          </div>
          <div className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-slate-50'}`}>
            {activeFullChart.stations.map((s, idx) => {
              const times = getStationTimingSummary(s, activeFullChart);
              return (
                <div key={s.id} className={`px-6 py-4 flex items-center transition-colors ${isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}`}>
                  <div className="w-1/3">
                    <p className="text-sm font-black truncate">{s.name}</p>
                    <p className="text-[10px] text-slate-500 font-bold">Stop #{idx + 1}</p>
                  </div>
                  <div className="w-1/3 text-center">
                    <p className={`text-xs font-black ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>{times.up.first}</p>
                    <p className="text-[9px] text-slate-500 font-bold">{times.up.last}</p>
                  </div>
                  <div className="w-1/3 text-right">
                    <p className={`text-xs font-black ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>{times.down.first}</p>
                    <p className="text-[9px] text-slate-500 font-bold">{times.down.last}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 pb-32 h-full overflow-y-auto no-scrollbar ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <div className="mb-8">
        <h2 className={`text-3xl font-black mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Schedules</h2>
        <p className="text-slate-500">Official timings and live frequencies.</p>
      </div>

      <div className="mb-10">
        <div className="relative">
          <label className={`text-[10px] font-bold uppercase tracking-widest ml-3 absolute -top-2 px-2 z-10 ${isDark ? 'bg-slate-950 text-slate-500' : 'bg-slate-50 text-slate-400'}`}>Search Station</label>
          <div className={`flex items-center rounded-2xl border px-4 py-4 transition-all focus-within:ring-2 focus-within:ring-[#FF4B3A] ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
            <Search className="text-slate-500 shrink-0" size={18} strokeWidth={3} />
            <input 
              type="text" placeholder="Enter station name..."
              className={`ml-3 flex-1 bg-transparent outline-none font-bold text-sm placeholder:text-slate-600 ${isDark ? 'text-white' : 'text-slate-900'}`}
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setSelectedStation(null); setShowSuggestions(true); }}
              onFocus={() => setShowSuggestions(searchQuery.length > 0)}
            />
            {searchQuery && (
              <button onClick={() => { setSearchQuery(''); setSelectedStation(null); if (onStationCleared) onStationCleared(); }} className="text-slate-500 p-1"><X size={18} strokeWidth={3} /></button>
            )}
          </div>
          {showSuggestions && searchQuery && !selectedStation && (
            <div className={`absolute top-full left-0 right-0 mt-2 rounded-2xl shadow-xl border overflow-hidden z-[50] animate-in fade-in slide-in-from-top-2 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
              {suggestions.length > 0 ? suggestions.map(s => (
                <button key={s.id} className={`w-full px-4 py-4 text-left flex items-center justify-between border-b last:border-0 ${isDark ? 'hover:bg-slate-700 border-slate-700' : 'hover:bg-slate-50 border-slate-50'}`} onClick={() => { setSelectedStation(s); setSearchQuery(s.name); setShowSuggestions(false); }}>
                  <div>
                    <p className={`text-sm font-black ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>{s.name}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{s.line} Line</p>
                  </div>
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: LINE_COLORS[s.line] }} />
                </button>
              )) : <div className="px-6 py-6 text-center text-xs text-slate-500 font-bold italic">No station found</div>}
            </div>
          )}
        </div>

        {selectedStation && stationTimings && (
          <div className="mt-4 animate-in fade-in zoom-in-95 duration-300">
            <div className={`rounded-[40px] p-8 shadow-xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-[24px] flex items-center justify-center text-white shadow-lg relative overflow-hidden group" style={{ backgroundColor: stationTimings.line.color }}>
                    <MapPin size={32} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className={`text-2xl font-black leading-tight mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{selectedStation.name}</h3>
                    <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.25em]">{stationTimings.line.name}</p>
                  </div>
                </div>
                <p className="text-[10px] font-black text-emerald-600 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
                   <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> LIVE
                </p>
              </div>
              <div className="grid grid-cols-2 gap-5 mb-10">
                {['Terminal A', 'Terminal B'].map((label, i) => (
                  <div key={label} className={`p-6 rounded-[32px] border ${isDark ? 'bg-slate-800/50 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                    <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-6">{label}</p>
                    <div className="space-y-4">
                      {['First', 'Last'].map(f => (
                        <div key={f} className="flex justify-between items-center">
                          <span className="text-sm text-slate-500 font-bold">{f}</span>
                          <span className={`text-lg font-black ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>{i === 0 ? (f === 'First' ? stationTimings.up.first : stationTimings.up.last) : (f === 'First' ? stationTimings.down.first : stationTimings.down.last)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className={`pt-6 border-t flex items-center justify-between ${isDark ? 'border-slate-800' : 'border-slate-50'}`}>
                <span className={`text-sm font-black ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>Next in <span className="text-blue-500">5m</span></span>
                <button onClick={() => setViewingStationSchedule(true)} className="text-xs font-black text-[#FF4B3A] flex items-center gap-2 uppercase tracking-widest group">
                  FULL CHART <ChevronRight size={18} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-12">
        <section>
          <div className="flex items-center justify-between mb-5 px-1">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Frequencies</h3>
            <span className={`text-[10px] px-3 py-1.5 rounded-xl font-black ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-900 text-white'}`}>MON - SAT</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Peak Hour', val: '7m', sub: '09:00 - 11:30', col: 'bg-orange-500' },
              { label: 'Regular', val: '12m', sub: 'All other hours', col: 'bg-slate-400' }
            ].map(f => (
              <div key={f.label} className={`p-6 rounded-[32px] border shadow-sm ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
                <div className="flex items-center gap-2 mb-4">
                   <div className={`w-2.5 h-2.5 rounded-full ${f.col}`} />
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{f.label}</p>
                </div>
                <div className={`font-black text-4xl mb-2 tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>{f.val}</div>
                <p className="text-[10px] text-slate-500 font-bold leading-tight">{f.sub}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-5 px-1">Network Lines</h3>
          <div className="space-y-4">
            {METRO_LINES.map(line => (
              <button key={line.id} onClick={() => setActiveFullChart(line)} className={`w-full text-left p-6 rounded-[32px] shadow-sm border group transition-all ${isDark ? 'bg-slate-900 border-slate-800 hover:bg-slate-800' : 'bg-white border-slate-100 hover:shadow-md'}`}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-110" style={{ backgroundColor: line.color }}><Train size={20} strokeWidth={2.5} /></div>
                    <div>
                      <span className={`text-lg font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{line.name}</span>
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest truncate">{line.stations[0].name} ↔ {line.stations[line.stations.length-1].name}</p>
                    </div>
                  </div>
                  <ArrowRight size={20} className="text-slate-600 group-hover:translate-x-1 transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-8 relative">
                  <div className={`absolute left-1/2 top-1 bottom-1 w-px -translate-x-1/2 ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`} />
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">First Train</p>
                    <p className={`text-xl font-black tracking-tight ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>06:55 <span className="text-[10px] text-slate-500 font-bold">AM</span></p>
                  </div>
                  <div className="pl-4">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Last Train</p>
                    <p className={`text-xl font-black tracking-tight ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>09:40 <span className="text-[10px] text-slate-500 font-bold">PM</span></p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Timings;

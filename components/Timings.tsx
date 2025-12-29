
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
  const [filterTime, setFilterTime] = useState(() => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  });

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
    return times.filter(t => t >= startTime && t <= (endTime + 30));
  };

  const getNextTrainTime = (station: Station, line: MetroLine) => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    // Generate schedules for both directions
    const upTimes = generateFullDaySchedule(station, line, 'up');
    const downTimes = generateFullDaySchedule(station, line, 'down');

    // Combine and sort all times
    const allTimes = [...upTimes, ...downTimes].sort((a, b) => a - b);

    // Find next train
    const nextTrain = allTimes.find(t => t > currentMinutes);

    if (nextTrain) {
      const minutesUntil = nextTrain - currentMinutes;
      return minutesUntil;
    }

    return null;
  };

  const formatWaitTime = (minutes: number | null) => {
    if (minutes === null) return 'N/A';

    if (minutes < 60) {
      return `${minutes}m`;
    } else {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      if (mins === 0) {
        return `${hours}h`;
      }
      return `${hours}h ${mins}m`;
    }
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
    const nextTrainMinutes = getNextTrainTime(selectedStation, line);
    return { ...getStationTimingSummary(selectedStation, line), line, nextTrainMinutes };
  }, [selectedStation]);


  if (viewingStationSchedule && selectedStation && stationTimings) {
    const line = stationTimings.line;

    // Generate all trains with direction info
    const upTimesRaw = generateFullDaySchedule(selectedStation, line, 'up');
    const downTimesRaw = generateFullDaySchedule(selectedStation, line, 'down');

    const allTrains = [
      ...upTimesRaw.map(t => ({
        time: t,
        direction: 'up',
        from: line.stations[0].name,
        to: line.stations[line.stations.length - 1].name
      })),
      ...downTimesRaw.map(t => ({
        time: t,
        direction: 'down',
        from: line.stations[line.stations.length - 1].name,
        to: line.stations[0].name
      }))
    ].sort((a, b) => a.time - b.time);

    // Filter to show next 10 trains after selected time
    const nextTrains = allTrains.filter(t => t.time >= filterTime).slice(0, 10);

    const formatFilterTime = (mins: number) => {
      const h = Math.floor(mins / 60);
      const m = mins % 60;
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    };

    return (
      <div className={`flex flex-col h-full animate-in slide-in-from-right duration-300 ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
        <div className={`px-6 py-5 border-b sticky top-0 z-10 ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => setViewingStationSchedule(false)} className="text-slate-400 p-2 -ml-2 hover:text-slate-600 transition-colors">
              <ArrowLeft size={24} />
            </button>
            <div className="flex-1">
              <h2 className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{selectedStation.name}</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Train Schedule</p>
            </div>
          </div>

          {/* Time Filter */}
          <div className={`rounded-2xl border p-3 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-wide mb-2 block">Filter From Time</label>
            <input
              type="time"
              value={formatFilterTime(filterTime)}
              onChange={(e) => {
                const [h, m] = e.target.value.split(':').map(Number);
                setFilterTime(h * 60 + m);
              }}
              className={`w-full text-base font-bold outline-none bg-transparent ${isDark ? 'text-white' : 'text-slate-900'}`}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 no-scrollbar space-y-3 pb-32">
          {nextTrains.length > 0 ? nextTrains.map((train, idx) => (
            <div key={idx} className={`rounded-2xl p-4 border shadow-sm ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-8 rounded-full" style={{ backgroundColor: line.color }} />
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-wide">
                      {train.direction === 'up' ? 'Toward' : 'Toward'}
                    </p>
                    <p className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {train.to}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {formatTime(train.time)}
                  </p>
                </div>
              </div>

              <div className={`pt-3 border-t flex items-center justify-between ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-slate-400" />
                  <p className="text-xs text-slate-400 font-medium">From <span className={`font-bold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{train.from}</span></p>
                </div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">{line.name}</p>
              </div>
            </div>
          )) : (
            <div className="text-center py-12">
              <p className="text-slate-400 font-medium">No trains available after selected time</p>
            </div>
          )}
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
      <div className="mb-6 pt-4">
        <h2 className={`text-3xl font-black mb-1 leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Schedules</h2>
        <p className="text-sm text-slate-400 font-medium">Official timings and live frequencies.</p>
      </div>

      <div className="mb-8">
        <div className="relative">
          <label className={`text-[9px] font-bold uppercase tracking-wider ml-3 absolute -top-2 px-2 z-10 ${isDark ? 'bg-slate-950 text-slate-400' : 'bg-slate-50 text-slate-400'}`}>Search Station</label>
          <div className={`flex items-center rounded-2xl border px-4 py-3.5 transition-all focus-within:ring-2 focus-within:ring-[#FF4B3A] ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
            <Search className="text-slate-400 shrink-0" size={18} strokeWidth={2.5} />
            <input
              type="text" placeholder="Enter station name..."
              className={`ml-3 flex-1 bg-transparent outline-none font-semibold text-sm placeholder:text-slate-400 ${isDark ? 'text-white' : 'text-slate-900'}`}
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setSelectedStation(null); setShowSuggestions(true); }}
              onFocus={() => setShowSuggestions(searchQuery.length > 0)}
            />
            {searchQuery && (
              <button onClick={() => { setSearchQuery(''); setSelectedStation(null); if (onStationCleared) onStationCleared(); }} className="text-slate-400 p-1 hover:text-slate-600 transition-colors">
                <X size={18} strokeWidth={2.5} />
              </button>
            )}
          </div>
          {showSuggestions && searchQuery && !selectedStation && (
            <div className={`absolute top-full left-0 right-0 mt-2 rounded-2xl shadow-2xl border overflow-hidden z-[50] animate-in fade-in slide-in-from-top-2 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
              {suggestions.length > 0 ? suggestions.map(s => (
                <button key={s.id} className={`w-full px-4 py-3.5 text-left flex items-center justify-between border-b last:border-0 transition-colors ${isDark ? 'hover:bg-slate-700 border-slate-700' : 'hover:bg-slate-50 border-slate-50'}`} onClick={() => { setSelectedStation(s); setSearchQuery(s.name); setShowSuggestions(false); }}>
                  <div>
                    <p className={`text-sm font-bold ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>{s.name}</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{s.line} Line</p>
                  </div>
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: LINE_COLORS[s.line] }} />
                </button>
              )) : <div className="px-6 py-6 text-center text-xs text-slate-400 font-medium italic">No station found</div>}
            </div>
          )}
        </div>

        {selectedStation && stationTimings && (
          <div className="mt-4 animate-in fade-in zoom-in-95 duration-300 relative">
            <div className={`rounded-[24px] p-4 shadow-2xl border ${isDark ? 'bg-slate-900 border-slate-800 shadow-black/20' : 'bg-white border-slate-100 shadow-slate-200/50'}`}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg flex-shrink-0" style={{ backgroundColor: stationTimings.line.color }}>
                    <MapPin size={20} strokeWidth={2.5} />
                  </div>
                  <div className="min-w-0">
                    <h3 className={`text-md font-black leading-tight mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{selectedStation.name}</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{stationTimings.line.name}</p>
                  </div>
                  <p className="text-[9px] absolute top-5 right-5 font-black text-emerald-600 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20 flex items-center gap-1.5 flex-shrink-0">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> LIVE
                  </p>
                </div>

              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {['Terminal A', 'Terminal B'].map((label, i) => (
                  <div key={label} className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-800/50 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-4">{label}</p>
                    <div className="space-y-4">
                      {[
                        { label: 'First', time: i === 0 ? stationTimings.up.first : stationTimings.down.first },
                        { label: 'Last', time: i === 0 ? stationTimings.up.last : stationTimings.down.last }
                      ].map(item => (
                        <div key={item.label}>
                          <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wide mb-1">{item.label}</p>
                          <p className={`text-lg font-black whitespace-nowrap ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>{item.time}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className={`pt-4 border-t flex items-center justify-between ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                <span className={`text-sm font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Next in <span className="text-blue-500">{formatWaitTime(stationTimings.nextTrainMinutes)}</span></span>
                <button onClick={() => setViewingStationSchedule(true)} className="text-xs font-black text-[#FF4B3A] flex items-center gap-2 uppercase tracking-wider group">
                  FULL CHART <ChevronRight size={16} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-10">
        <section>
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Frequencies</h3>
            <span className={`text-[9px] px-2.5 py-1 rounded-lg font-black ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-900 text-white'}`}>MON - SAT</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Peak Hour', val: '7m', sub: '09:00 - 11:30', col: 'bg-orange-500' },
              { label: 'Regular', val: '12m', sub: 'All other hours', col: 'bg-slate-400' }
            ].map(f => (
              <div key={f.label} className={`p-5 rounded-2xl border shadow-sm ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-2 h-2 rounded-full ${f.col}`} />
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">{f.label}</p>
                </div>
                <div className={`font-black text-3xl mb-1.5 tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{f.val}</div>
                <p className="text-[9px] text-slate-400 font-medium leading-tight">{f.sub}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-4 px-1">Network Lines</h3>
          <div className="space-y-3">
            {METRO_LINES.map(line => (
              <button key={line.id} onClick={() => setActiveFullChart(line)} className={`w-full text-left p-5 rounded-2xl shadow-sm border group transition-all ${isDark ? 'bg-slate-900 border-slate-800 hover:bg-slate-800' : 'bg-white border-slate-100 hover:shadow-md'}`}>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-105" style={{ backgroundColor: line.color }}>
                      <Train size={20} strokeWidth={2.5} />
                    </div>
                    <div>
                      <span className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{line.name}</span>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wide truncate">{line.stations[0].name} ↔ {line.stations[line.stations.length - 1].name}</p>
                    </div>
                  </div>
                  <ArrowRight size={20} className="text-slate-400 group-hover:translate-x-1 transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-6 relative">
                  <div className={`absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`} />
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">First Train</p>
                    <p className={`text-lg font-black tracking-tight ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>06:55 <span className="text-[9px] text-slate-400 font-semibold">AM</span></p>
                  </div>
                  <div className="pl-3">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">Last Train</p>
                    <p className={`text-lg font-black tracking-tight ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>09:40 <span className="text-[9px] text-slate-400 font-semibold">PM</span></p>
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

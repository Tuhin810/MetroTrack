
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { METRO_LINES, ALL_STATIONS, LINE_COLORS } from '../data/metroData';
import { getLiveTrains, getDistance, findNearestStation, fetchRoute } from '../utils/tracker';
import { LiveTrain, Station } from '../types';
import { 
  Search as SearchIcon, 
  X, 
  Navigation, 
  LocateFixed, 
  MapPin, 
  Layers, 
  Check, 
  Clock, 
  ChevronRight, 
  Navigation2, 
  ArrowUpRight,
  CircleStop,
  Footprints,
  Car,
  Cloud,
  Sun,
  CloudRain,
  CloudLightning,
  CloudFog,
  Wind
} from 'lucide-react';

// Default center is central Kolkata
const initialCenter = [22.5726, 88.3639];

const stationIcon = (color: string, isDark: boolean) => L.divIcon({
  html: `<div class="w-3.5 h-3.5 rounded-full border-[2.5px] ${isDark ? 'border-slate-800 shadow-[0_0_10px_rgba(0,0,0,0.5)]' : 'border-white shadow-sm'}" style="background-color: ${color}"></div>`,
  className: '',
  iconSize: [14, 14],
  iconAnchor: [7, 7]
});

const userIcon = L.divIcon({
  html: `<div class="w-8 h-8 rounded-full border-[3px] border-white bg-blue-600 shadow-2xl flex items-center justify-center pulse">
          <div class="w-3 h-3 rounded-full bg-white shadow-inner"></div>
         </div>`,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 16]
});

const interchangeIcon = (isDark: boolean) => L.divIcon({
  html: `<div class="w-6 h-6 rounded-full border-2 ${isDark ? 'border-slate-600 bg-slate-800 shadow-lg' : 'border-slate-300 bg-white shadow-md'} flex items-center justify-center">
          <div class="w-3 h-3 rounded-full ${isDark ? 'bg-slate-200' : 'bg-slate-900'}"></div>
         </div>`,
  className: '',
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

const trainIcon = (color: string, isDark: boolean) => L.divIcon({
  html: `<div class="pulse w-7 h-7 rounded-full ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-white'} flex items-center justify-center border-2 shadow-lg" style="border-color: ${color}">
          <div class="w-3.5 h-3.5 rounded-full" style="background-color: ${color}"></div>
         </div>`,
  className: '',
  iconSize: [28, 28],
  iconAnchor: [14, 14]
});

const MapController = ({ 
  selectedStation, 
  userLocation, 
  isNavigating,
  routeCoords,
  isFindingNearest
}: { 
  selectedStation: Station | null, 
  userLocation: {lat: number, lng: number} | null,
  isNavigating: boolean,
  routeCoords: [number, number][],
  isFindingNearest: boolean
}) => {
  const map = useMap();
  const hasFittedInitial = useRef(false);

  useEffect(() => {
    if (!hasFittedInitial.current) {
      const allCoords = ALL_STATIONS.map(s => [s.lat, s.lng] as [number, number]);
      const bounds = L.latLngBounds(allCoords);
      map.fitBounds(bounds, { padding: [50, 50], duration: 2 });
      hasFittedInitial.current = true;
      return;
    }

    if (isNavigating && routeCoords.length > 0) {
      const bounds = L.latLngBounds(routeCoords);
      map.fitBounds(bounds, { padding: [80, 180], duration: 1.5 });
    } 
    else if (userLocation && isFindingNearest) {
      map.flyTo([userLocation.lat, userLocation.lng], 16, { duration: 1 });
    }
    else if (selectedStation && !isNavigating) {
      map.flyTo([selectedStation.lat, selectedStation.lng], 16, {
        duration: 1.5,
        easeLinearity: 0.25
      });
    }
  }, [selectedStation, isNavigating, routeCoords, userLocation, isFindingNearest, map]);

  return null;
};

interface WeatherData {
  temp: number;
  conditionCode: number;
}

const WeatherWidget = ({ isDark }: { isDark: boolean }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=22.5726&longitude=88.3639&current_weather=true');
        const data = await res.json();
        if (data.current_weather) {
          setWeather({
            temp: Math.round(data.current_weather.temperature),
            conditionCode: data.current_weather.weathercode
          });
        }
      } catch (e) {
        console.error("Weather fetch failed", e);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 900000); // 15 mins
    return () => clearInterval(interval);
  }, []);

  if (!weather) return null;

  const getWeatherIcon = (code: number) => {
    if (code === 0) return <Sun className="text-yellow-400" size={20} />;
    if (code <= 3) return <Cloud className="text-slate-400" size={20} />;
    if (code <= 48) return <CloudFog className="text-slate-300" size={20} />;
    if (code <= 67) return <CloudRain className="text-blue-400" size={20} />;
    if (code <= 82) return <CloudRain className="text-blue-500" size={20} />;
    if (code <= 99) return <CloudLightning className="text-purple-400" size={20} />;
    return <Sun className="text-yellow-400" size={20} />;
  };

  return (
    <div className={`absolute top-40 right-6 z-[1001] backdrop-blur-xl rounded-2xl p-3 border shadow-2xl transition-all duration-300 flex items-center gap-3 ${isDark ? 'bg-slate-900/90 border-slate-700 shadow-black/40' : 'bg-white/95 border-white/40 shadow-slate-300/40'}`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
        {getWeatherIcon(weather.conditionCode)}
      </div>
      <div className="pr-1">
        <p className={`text-sm font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{weather.temp}°C</p>
        <p className={`text-[9px] font-black uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>KOLKATA</p>
      </div>
    </div>
  );
};

interface LiveMapProps {
  onViewSchedule?: (station: Station) => void;
  theme?: 'light' | 'dark';
}

const LiveMap: React.FC<LiveMapProps> = ({ onViewSchedule, theme = 'light' }) => {
  const [trains, setTrains] = useState<LiveTrain[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  
  const [isFindingNearest, setIsFindingNearest] = useState(false);
  const [nearestResult, setNearestResult] = useState<{ station: Station, distance: number } | null>(null);
  
  const [isNavigating, setIsNavigating] = useState(false);
  const [navMode, setNavMode] = useState<'walking' | 'driving'>('walking');
  const [navDistance, setNavDistance] = useState<number>(0);
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);
  
  const [visibleLines, setVisibleLines] = useState<string[]>(METRO_LINES.map(l => l.id));
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const watchIdRef = useRef<number | null>(null);
  const isDark = theme === 'dark';

  useEffect(() => {
    const update = () => setTrains(getLiveTrains());
    update();
    const interval = setInterval(update, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredStations = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return ALL_STATIONS.filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5);
  }, [searchQuery]);

  const handleSelectStation = (station: Station) => {
    setSelectedStation(station);
    setSearchQuery(station.name);
    setShowResults(false);
  };

  const updateRoute = async (loc: {lat: number, lng: number}, target: Station, mode: 'walking' | 'driving') => {
    const coords = await fetchRoute(loc, target, mode);
    setRouteCoords(coords);
  };

  const startNavigation = async (mode: 'walking' | 'driving') => {
    if (!nearestResult) return;
    setNavMode(mode);
    setIsNavigating(true);
    
    if (userLocation) {
      await updateRoute(userLocation, nearestResult.station, mode);
    }

    if ("geolocation" in navigator) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        async (position) => {
          const { latitude: lat, longitude: lng } = position.coords;
          const newLoc = { lat, lng };
          setUserLocation(newLoc);
          const dist = getDistance(newLoc, nearestResult.station);
          setNavDistance(dist);
          if (routeCoords.length === 0) {
            await updateRoute(newLoc, nearestResult.station, mode);
          }
        },
        (error) => console.error("Nav Error:", error),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    }
  };

  const stopNavigation = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsNavigating(false);
    setNearestResult(null);
    setSelectedStation(null);
    setRouteCoords([]);
  };

  const handleFindNearest = () => {
    if (isNavigating) return;
    if ("geolocation" in navigator) {
      setIsFindingNearest(true);
      setNearestResult(null);
      setRouteCoords([]);

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude: lat, longitude: lng } = position.coords;
          const loc = { lat, lng };
          setUserLocation(loc);
          const nearest = findNearestStation(lat, lng);
          setNearestResult(nearest);
          setNavDistance(nearest.distance);
          setSelectedStation(nearest.station);
          const coords = await fetchRoute(loc, nearest.station, 'walking');
          setRouteCoords(coords);
          setIsFindingNearest(false);
        },
        () => {
          alert("Could not access your location. Please check browser permissions.");
          setIsFindingNearest(false);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }
  };

  const getETA = () => {
    const speed = navMode === 'walking' ? 4.5 : 20; 
    const minutes = (navDistance / speed) * 60;
    return Math.ceil(minutes);
  };

  const toggleLineVisibility = (lineId: string) => {
    setVisibleLines(prev => 
      prev.includes(lineId) ? prev.filter(id => id !== lineId) : [...prev, lineId]
    );
  };

  const mapTileUrl = isDark 
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

  return (
    <div className={`h-full w-full relative z-0 transition-colors duration-500 ${isDark ? 'bg-slate-950' : 'bg-slate-100'}`}>
      <WeatherWidget isDark={isDark} />
      
      {/* Navigation Overlay (Header) */}
      {!isNavigating ? (
        <div className="absolute top-6 left-0 right-0 px-6 z-[1001] pointer-events-none">
          <div className="max-w-md mx-auto pointer-events-auto relative">
            <div className={`flex items-center backdrop-blur-xl rounded-full shadow-2xl transition-all duration-300 px-6 py-4 border ${isDark ? 'bg-slate-900/90 border-slate-700 shadow-black/40' : 'bg-white/95 border-white/40 shadow-slate-300/40'} ${showResults && filteredStations.length > 0 ? 'rounded-b-none' : ''}`}>
              <SearchIcon className={isDark ? 'text-slate-500' : 'text-slate-400'} size={18} strokeWidth={3} />
              <input 
                type="text"
                placeholder="Find a station..."
                className={`ml-3 flex-1 bg-transparent outline-none font-black text-sm placeholder:text-slate-500 ${isDark ? 'text-white' : 'text-slate-900'}`}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowResults(true);
                  setSelectedStation(null);
                }}
                onFocus={() => setShowResults(true)}
              />
              {searchQuery && (
                <button onClick={() => { setSearchQuery(''); setSelectedStation(null); setRouteCoords([]); setNearestResult(null); setShowResults(false); }} className="ml-2 text-slate-400">
                  <X size={20} strokeWidth={3} />
                </button>
              )}
            </div>

            {/* Search Results Dropdown */}
            {showResults && filteredStations.length > 0 && (
              <div className={`absolute left-0 right-0 top-full mt-0 rounded-b-[28px] shadow-2xl border-x border-b overflow-hidden z-[1002] animate-in slide-in-from-top-2 duration-200 ${isDark ? 'bg-slate-900/95 border-slate-700 backdrop-blur-xl' : 'bg-white/95 border-white/40 backdrop-blur-xl'}`}>
                {filteredStations.map((station) => (
                  <button 
                    key={station.id}
                    onClick={() => handleSelectStation(station)}
                    className={`w-full px-6 py-4 text-left flex items-center justify-between border-t transition-colors ${isDark ? 'border-slate-800 hover:bg-slate-800/50' : 'border-slate-50 hover:bg-slate-50'}`}
                  >
                    <div className="flex items-center gap-3">
                      <MapPin size={16} className={isDark ? 'text-slate-500' : 'text-slate-400'} />
                      <span className={`text-sm font-black ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{station.name}</span>
                    </div>
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: LINE_COLORS[station.line] }} />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="absolute top-6 left-0 right-0 px-6 z-[1001]">
          <div className={`max-w-md mx-auto rounded-[32px] p-6 shadow-2xl flex items-center justify-between border ${isDark ? 'bg-slate-800 text-white border-slate-700' : 'bg-slate-900 text-white border-white/10'}`}>
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <ArrowUpRight size={24} strokeWidth={3} />
               </div>
               <div>
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Navigating To</p>
                  <h3 className="text-lg font-black truncate max-w-[160px]">{selectedStation?.name}</h3>
               </div>
            </div>
            <button 
              onClick={stopNavigation}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isDark ? 'bg-slate-700 text-slate-300 hover:bg-red-500/20 hover:text-red-400' : 'bg-white/10 hover:bg-red-500/20 hover:text-red-400'}`}
            >
              <CircleStop size={24} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      )}

      {/* Control Buttons (Floating Right) */}
      {!isNavigating && (
        <div className="absolute bottom-10 right-6 z-[1001] flex flex-col gap-3">
          {isFilterOpen && (
            <div className={`backdrop-blur-xl rounded-[28px] shadow-2xl border p-3 mb-1 animate-in slide-in-from-bottom-4 duration-300 flex flex-col gap-1 w-48 ${isDark ? 'bg-slate-900/95 border-slate-700 shadow-black' : 'bg-white/95 border-white/40 shadow-slate-300'}`}>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-3 py-2">Visible Lines</p>
              {METRO_LINES.map(line => (
                <button
                  key={line.id}
                  onClick={() => toggleLineVisibility(line.id)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-2xl transition-all ${
                    visibleLines.includes(line.id) 
                      ? (isDark ? 'bg-slate-800 text-white' : 'bg-slate-50 text-slate-900') 
                      : (isDark ? 'text-slate-600 hover:bg-slate-800/50' : 'text-slate-300 hover:bg-slate-50/50')
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: line.color }} />
                    <span className="text-xs font-black">{line.name.split(' ')[0]}</span>
                  </div>
                  {visibleLines.includes(line.id) && <Check size={14} strokeWidth={4} className="text-blue-500" />}
                </button>
              ))}
            </div>
          )}
          <button onClick={() => setIsFilterOpen(!isFilterOpen)} className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center border-2 active:scale-90 transition-all ${isDark ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-white border-white text-slate-600'}`}>
            <Layers size={22} strokeWidth={2.5} />
          </button>
          <button 
            onClick={handleFindNearest}
            disabled={isFindingNearest}
            className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center border-2 active:scale-90 transition-all ${
              nearestResult 
                ? 'bg-[#FF4B3A] text-white border-red-300' 
                : (isDark ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-white border-white text-slate-600')
            }`}
          >
            <Navigation2 size={22} strokeWidth={2.5} className={isFindingNearest ? 'animate-spin' : ''} />
          </button>
        </div>
      )}

      {/* Navigation Detail Card (Bottom) */}
      {(nearestResult || isNavigating) && (
        <div className="absolute bottom-10 left-6 right-6 z-[1001] max-w-md mx-auto">
          <div className={`backdrop-blur-2xl rounded-[40px] p-8 shadow-2xl border shadow-slate-900/10 animate-in slide-in-from-bottom-12 duration-500 ${isDark ? 'bg-slate-900/95 border-slate-800 text-white' : 'bg-white/95 border-white/40 text-slate-900'}`}>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-[20px] flex items-center justify-center shadow-lg transition-colors ${isNavigating ? 'bg-blue-600 text-white' : (isDark ? 'bg-slate-800 text-slate-500' : 'bg-slate-100 text-slate-400')}`}>
                  {navMode === 'walking' ? <Footprints size={28} /> : <Car size={28} />}
                </div>
                <div>
                  <h3 className="text-2xl font-black leading-tight">
                    {isNavigating ? (navDistance < 0.05 ? "Arrived!" : `${getETA()} mins`) : nearestResult?.station.name}
                  </h3>
                  <p className={`text-[11px] font-black uppercase tracking-widest mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    {isNavigating ? `${navMode.toUpperCase()} • ${(navDistance * 1000).toFixed(0)}m AWAY` : `${nearestResult?.distance.toFixed(1)} KM FROM YOU`}
                  </p>
                </div>
              </div>
              {!isNavigating && (
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${isDark ? 'bg-blue-900/20 text-blue-400 border-blue-900/40' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                  <LocateFixed size={12} strokeWidth={3} />
                  <span className="text-[10px] font-black uppercase">Nearest</span>
                </div>
              )}
            </div>

            {!isNavigating ? (
              <div className="flex gap-4">
                <button 
                  onClick={() => startNavigation('walking')}
                  className="flex-1 bg-[#FF4B3A] text-white py-5 rounded-[24px] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl shadow-red-200"
                >
                  <Footprints size={18} /> WALK
                </button>
                <button 
                  onClick={() => startNavigation('driving')}
                  className={`flex-1 py-5 rounded-[24px] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl ${isDark ? 'bg-slate-800 text-white shadow-black border border-slate-700' : 'bg-slate-900 text-white shadow-slate-200'}`}
                >
                  <Car size={18} /> DRIVE
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                   <div 
                    className="h-full bg-blue-600 transition-all duration-1000" 
                    style={{ width: `${Math.min(100, Math.max(5, 100 - (navDistance * 50)))}%` }} 
                   />
                </div>
                <div className={`flex justify-between items-center text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-600' : 'text-slate-300'}`}>
                   <span>FOLLOW THE ROAD</span>
                   <span>{navDistance < 0.1 ? 'ARRIVING' : `${(navDistance * 1000).toFixed(0)}m`}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <MapContainer center={initialCenter as [number, number]} zoom={12} style={{ height: '100%', width: '100%' }} zoomControl={false}>
        <MapController 
          selectedStation={selectedStation} 
          userLocation={userLocation} 
          isNavigating={isNavigating} 
          routeCoords={routeCoords}
          isFindingNearest={isFindingNearest}
        />
        <TileLayer url={mapTileUrl} attribution='&copy; CARTO' />
        
        {METRO_LINES.filter(line => visibleLines.includes(line.id)).map(line => (
          <React.Fragment key={line.id}>
            <Polyline 
              positions={line.stations.map(s => [s.lat, s.lng]) as [number, number][]}
              color={line.color} weight={8} opacity={isDark ? 0.7 : 0.6} lineCap="round"
            />
            {line.stations.map(station => (
              <Marker 
                key={station.id} 
                position={[station.lat, station.lng]} 
                icon={station.isInterchange ? interchangeIcon(isDark) : stationIcon(line.color, isDark)}
              >
                {!isNavigating && (
                  <Popup className="custom-popup" maxWidth={240}>
                    <div className={`p-2 space-y-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      <h3 className="font-black text-sm leading-tight">{station.name}</h3>
                      <div className={`rounded-xl p-3 flex items-center gap-3 ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                        <Clock size={16} strokeWidth={3} className="text-emerald-500" />
                        <div>
                          <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider">Next Train</p>
                          <p className="text-sm font-black text-emerald-600">4 Mins</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => onViewSchedule?.(station)}
                        className="w-full py-2.5 bg-[#FF4B3A] text-white text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center justify-between px-4 transition-all"
                      >
                        Timings <ChevronRight size={14} strokeWidth={4} />
                      </button>
                    </div>
                  </Popup>
                )}
              </Marker>
            ))}
          </React.Fragment>
        ))}

        {userLocation && <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon} />}
        
        {/* Real Road-Based Navigation Path */}
        {routeCoords.length > 0 && (
          <Polyline 
            positions={routeCoords}
            color={isNavigating ? "#2563eb" : "#FF4B3A"}
            weight={6}
            opacity={0.8}
            lineCap="round"
            lineJoin="round"
            dashArray={!isNavigating ? "1, 10" : undefined}
          />
        )}

        {trains.filter(train => visibleLines.includes(train.line.toLowerCase())).map(train => (
          <Marker key={train.id} position={[train.lat, train.lng]} icon={trainIcon(LINE_COLORS[train.line] || '#000', isDark)}>
            {!isNavigating && (
              <Popup className="custom-popup">
                 <div className={`p-1 text-center font-black text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>Toward {train.nextStation}</div>
              </Popup>
            )}
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default LiveMap;

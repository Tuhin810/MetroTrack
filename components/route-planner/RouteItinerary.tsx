import React, { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { ArrowLeft, Train, ArrowDown, ChevronDown, ChevronUp, List, Wallet } from 'lucide-react';
import { Station } from '../../types';

// Types
interface RouteLeg {
    line: string;
    color: string;
    direction: string;
    distance: number;
    stations: Station[];
    fare: number;
}

interface RouteResult {
    legs: RouteLeg[];
    totalFare: number;
    totalTime: number;
    totalDist: number;
    totalStations: number;
    sFrom: Station;
    sTo: Station;
}

interface RouteItineraryProps {
    routeResult: RouteResult;
    onBack: () => void;
    theme: 'light' | 'dark';
}

// Helper to create marker icons
const miniMarkerIcon = (color: string) => L.divIcon({
    html: `<div class="w-4 h-4 rounded-full border-2 border-white shadow-md" style="background-color: ${color}"></div>`,
    className: '',
    iconSize: [16, 16],
    iconAnchor: [8, 8]
});

// Map controller component
const RouteMapController: React.FC<{ stations: Station[] }> = ({ stations }) => {
    const map = useMap();
    useEffect(() => {
        if (stations.length > 0) {
            const bounds = L.latLngBounds(stations.map(s => [s.lat, s.lng]));
            map.fitBounds(bounds, { padding: [40, 40], animate: true });
        }
    }, [stations, map]);
    return null;
};

// Stats card component
const StatCard: React.FC<{ label: string; value: string | number; isDark: boolean }> = ({ label, value, isDark }) => (
    <div className={`flex-1 px-2 py-2  rounded-xl flex flex-col items-center 
        justify-center border transition-all duration-300 ${isDark
            ? 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/60'
            : 'bg-slate-100/40 border-slate-100 hover:shadow-xl hover:shadow-slate-200/50'
        }`}>
        <p className="text-[9px] font-black text-slate-400 uppercase  mb-">{label}</p>
        <p className={`text-lg font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{value}</p>
    </div>
);

// Station point component
const StationPoint: React.FC<{
    type: 'start' | 'transfer' | 'end';
    name: string;
    isDark: boolean
}> = ({ type, name, isDark }) => {
    const colors = {
        start: '#3b82f6',
        transfer: '#94a3b8',
        end: '#10b981'
    };
    const labels = {
        start: 'Starting Point',
        transfer: 'Transfer Station',
        end: 'Destination'
    };

    return (
        <div className="flex items-start gap-4 relative">
            <div className="relative flex flex-col items-center">
                <div
                    className="w-6 h-6 rounded-full border-[4px] bg-white shadow-[0_4px_10px_rgba(0,0,0,0.1)] flex-shrink-0 z-10 relative transition-transform duration-300 hover:scale-110"
                    style={{ borderColor: colors[type] }}
                />
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
                <p className="text-[10px] font-black text-slate-400 uppercase  mb-0.5">
                    {labels[type]}
                </p>
                <p className={`text-lg font-black leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {name}
                </p>
            </div>
        </div>
    );
};

// Leg card component
const LegCard: React.FC<{ leg: RouteLeg; isDark: boolean; showLegFare: boolean }> = ({ leg, isDark, showLegFare }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const intermediateStations = leg.stations.slice(1, -1);
    const hasIntermediate = intermediateStations.length > 0;

    return (
        <div className="flex items-start gap-4 mb-4 relative">
            <div className="relative flex flex-col items-center" style={{ width: '24px' }}>
                <div className="w-[3px] h-full absolute top-0 bottom-0 opacity-20" style={{ backgroundColor: leg.color }} />
            </div>
            <div className="flex-1 min-w-0">
                <div
                    onClick={() => hasIntermediate && setIsExpanded(!isExpanded)}
                    className={`border rounded-[14px] py-3 px-4 relative overflow-hidden transition-all duration-300 cursor-pointer ${isDark
                        ? 'bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/40'
                        : 'bg-slate-50 border-slate-100 hover:border-slate-200 hover:shadow-lg hover:shadow-slate-200/30'
                        } ${isExpanded ? (isDark ? 'bg-slate-800/60' : 'bg-slate-200/50 shadow-inner') : ''}`}
                >
                    <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ backgroundColor: leg.color }} />
                    <div className="flex justify-between items-center mb-4 pl-1">
                        <div className="flex items-center gap-2">
                            <div
                                className="w-7 h-7 rounded-lg flex items-center justify-center text-white shadow-sm"
                                style={{ backgroundColor: leg.color }}
                            >
                                <Train size={14} />
                            </div>
                            <span className="text-[11px] font-black uppercase tracking-tight" style={{ color: leg.color }}>
                                {leg.line} Line
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${isDark ? 'bg-slate-700/50 text-slate-400' : 'bg-white text-slate-500 shadow-sm border border-slate-100'}`}>
                                {(leg.stations.length - 1) * 2.5} mins
                            </span>
                            {showLegFare && (
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${isDark ? 'bg-slate-700/50 text-slate-400' : 'bg-white text-slate-500 shadow-sm border border-slate-100'}`}>
                                    ₹{leg.fare}
                                </span>
                            )}
                            {hasIntermediate && (
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''} ${isDark ? 'bg-slate-800' : 'bg-white shadow-sm'}`}>
                                    <ChevronDown size={12} className={isDark ? 'text-slate-400' : 'text-slate-500'} />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="pl-1 space-y-2">
                        <div className="flex items-center gap-3.5">
                            <div className={`w-9 h-9 rounded-2xl flex items-center justify-center text-slate-400 transition-colors ${isDark ? 'bg-slate-900/50' : 'bg-white shadow-sm'}`}>
                                <Train size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-wide mb-0.5">Board Toward</p>
                                <p className={`text-sm font-bold ${isDark ? 'text-slate-200' : 'text-slate-900'} truncate`}>
                                    {leg.direction}
                                </p>
                            </div>
                        </div>

                        {/* Intermediate Stations List */}
                        {isExpanded && hasIntermediate && (
                            <div className="py-2 space-y-4 relative animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="absolute left-[17.5px] top-0 bottom-0 w-[1.5px] bg-slate-200 dark:bg-slate-700/50" />
                                {intermediateStations.map((station, idx) => (
                                    <div key={idx} className="flex items-center gap-3.5 relative z-10">
                                        <div className="w-9 flex justify-center">
                                            <div className="w-2.5 h-2.5 rounded-full bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 shadow-sm" />
                                        </div>
                                        <p className={`text-[13px] font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                            {station.name}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex items-center gap-3.5">
                            <div className={`w-9 h-9 rounded-2xl flex items-center justify-center text-slate-400 transition-colors ${isDark ? 'bg-slate-900/50' : 'bg-white shadow-sm'}`}>
                                {leg.direction === leg.stations[leg.stations.length - 1].name ? <List size={16} /> : <ArrowDown size={16} />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-wide mb-0.5">
                                    {leg.direction === leg.stations[leg.stations.length - 1].name ? "Total Stops" : "Get Off At"}
                                </p>
                                <p className={`text-sm font-bold ${isDark ? 'text-slate-200' : 'text-slate-900'} truncate`}>
                                    {leg.direction === leg.stations[leg.stations.length - 1].name
                                        ? `${leg.stations.length - 1} stops journey`
                                        : leg.stations[leg.stations.length - 1].name
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Main Itinerary Component
const RouteItinerary: React.FC<RouteItineraryProps> = ({ routeResult, onBack, theme }) => {
    const isDark = theme === 'dark';

    const allRouteStations = useMemo(() => {
        return routeResult.legs.flatMap(l => l.stations);
    }, [routeResult]);

    const stats = [
        { label: 'FARE', val: `₹${routeResult.totalFare}` },
        { label: 'STOPS', val: routeResult.totalStations },
        { label: 'SWITCHES', val: routeResult.legs.length - 1 }
    ];

    return (
        <div className={`flex flex-col h-full animate-in slide-in-from-right duration-500 relative z-[1002] transition-colors duration-500 ${isDark ? 'bg-slate-950' : 'bg-white'}`}>
            <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
                {/* Map Section - Enhanced height and visibility */}
                <div className="relative h-72 bg-slate-100 overflow-hidden z-0">
                    <MapContainer
                        center={[routeResult.sFrom.lat, routeResult.sFrom.lng]}
                        zoom={13}
                        style={{ height: '100%', width: '100%' }}
                        zoomControl={false}
                        dragging={false}
                        touchZoom={false}
                        scrollWheelZoom={false}
                    >
                        <RouteMapController stations={allRouteStations} />
                        <TileLayer
                            url={isDark
                                ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                                : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                            }
                        />
                        {routeResult.legs.map((leg, i) => (
                            <React.Fragment key={`map-leg-${i}`}>
                                <Polyline
                                    positions={leg.stations.map(s => [s.lat, s.lng]) as [number, number][]}
                                    color={leg.color}
                                    weight={6}
                                    opacity={0.8}
                                />
                                <Marker
                                    position={[leg.stations[0].lat, leg.stations[0].lng]}
                                    icon={miniMarkerIcon(leg.color)}
                                />
                            </React.Fragment>
                        ))}
                    </MapContainer>

                    {/* Back Button - Premium Floating Style */}
                    <div className="absolute top-8 left-6 z-[1001]">
                        <button
                            onClick={onBack}
                            className="w-12 h-12 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-2xl flex items-center justify-center text-slate-800 dark:text-white shadow-2xl active:scale-90 transition-all duration-300 group"
                        >
                            <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                        </button>
                    </div>

                    {/* Gradient Overlay - Better blending */}
                    <div className={`absolute inset-0 pointer-events-none bg-gradient-to-t ${isDark ? 'from-slate-950 via-slate-950/20' : 'from-white via-white/20'} to-transparent`} />
                </div>

                {/* Content Section - Refined Header and Journey details */}
                <div className=" -mt-12 relative z-10">
                    <div className={`rounded-t-[38px] pt-10 pb-6 shadow-[0_-30px_60px_rgba(0,0,0,0.12)] ${isDark ? 'bg-slate-950' : 'bg-white'}`}>
                        {/* Header */}
                        <div className="flex justify-between px-6 items-start gap-4 mb-8">
                            <div className="flex-1 min-w-0">
                                <h2 className={`text-[28px] font-black leading-tight tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    {routeResult.sTo.name}
                                </h2>
                                <p className="text-xs font-bold text-slate-400 mt-2 uppercase ">
                                    From <span className={isDark ? 'text-slate-200' : 'text-slate-600'}>{routeResult.sFrom.name}</span>
                                </p>
                            </div>
                            <div className="text-right flex-shrink-0 bg-blue-500/10 px-4 py-2 rounded-2xl border border-blue-500/20">
                                <p className={`text-3xl font-black leading-none ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                                    {routeResult.totalTime}
                                </p>
                                <p className="text-[9px] font-black text-blue-500/60 uppercase tracking-widest mt-1">MINS</p>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="flex gap-3 mb-6 px-5">
                            {stats.map((item, i) => (
                                <StatCard key={i} label={item.label} value={item.val} isDark={isDark} />
                            ))}
                        </div>

                        {/* Journey List */}
                        <div className="pl-5 pr-3 relative">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-[20px] font-black text-slate-400  ">
                                    Stations Route
                                </h3>
                            </div>

                            <div className="relative">
                                {/* Vertical Journey Line */}
                                <div className={`absolute left-[11px] top-6 bottom-10 w-[2.5px] rounded-full ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`} />

                                {routeResult.legs.map((leg, legIdx) => (
                                    <React.Fragment key={legIdx}>
                                        <div className="mb-4">
                                            <StationPoint
                                                type={legIdx === 0 ? 'start' : 'transfer'}
                                                name={leg.stations[0].name}
                                                isDark={isDark}
                                            />
                                        </div>
                                        <LegCard
                                            leg={leg}
                                            isDark={isDark}
                                            showLegFare={routeResult.legs.length > 1}
                                        />
                                        {legIdx === routeResult.legs.length - 1 && (
                                            <div className="mt-4">
                                                <StationPoint
                                                    type="end"
                                                    name={leg.stations[leg.stations.length - 1].name}
                                                    isDark={isDark}
                                                />
                                            </div>
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom CTA - Premium Gradient with Hover Effect */}
            {/* <div className={`fixed bottom-0 left-0 right-0 p-6 pb-8 backdrop-blur-xl border-t z-[1004] max-w-md mx-auto ${isDark ? 'bg-slate-950/90 border-slate-800' : 'bg-white/90 border-slate-100'}`}>
                <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-black py-5 rounded-[28px] shadow-[0_15px_35px_rgba(239,68,68,0.3)] active:scale-[0.98] transition-all text-xl flex items-center justify-center gap-3 overflow-hidden group">
                    <span className="relative z-10">Confirm & Pay ₹{routeResult.totalFare}</span>
                    <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                </button>
            </div> */}
        </div>
    );
};

export default RouteItinerary;

import React from 'react';
import { Train, ChevronRight } from 'lucide-react';

interface RouteCardProps {
    totalTime: number;
    totalFare: number;
    totalStations: number;
    onPress: () => void;
    theme: 'light' | 'dark';
}

const RouteCard: React.FC<RouteCardProps> = ({
    totalTime,
    totalFare,
    totalStations,
    onPress,
    theme
}) => {
    const isDark = theme === 'dark';

    return (
        <div className="px-2">
            <div className="flex justify-between items-center mb-4 ml-1">
                <p className="text-[10px] font-black text-slate-500 uppercase ">
                    Best Route Found
                </p>
                <div className="h-1 w-12 bg-blue-500/20 rounded-full" />
            </div>

            <button
                onClick={onPress}
                className={`w-full rounded-[30px] p-5 shadow-[0_15px_40px_rgba(0,0,0,0.08)] border flex items-center justify-between group transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)] hover:-translate-y-1 active:scale-[0.98] ${isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-900'
                    }`}
            >
                <div className="flex items-center gap-5">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center relative overflow-hidden transition-colors duration-300 text-white shadow-lg ${isDark ? 'bg-blue-600' : 'bg-blue-600 shadow-blue-200'
                        }`}>
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Train size={24} />
                    </div>
                    <div className="text-left">
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-black">{totalTime}</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mins</span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                                ₹{totalFare}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                            <span className={`text-xs font-bold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                {totalStations} Stops
                            </span>
                        </div>
                    </div>
                </div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-50 text-slate-400 group-hover:bg-blue-600 group-hover:text-white'
                    }`}>
                    <ChevronRight size={22} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
            </button>
        </div>
    );
};

export default RouteCard;

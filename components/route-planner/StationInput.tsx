import React from 'react';
import { Train } from 'lucide-react';
import { Station } from '../../types';
import { ALL_STATIONS, LINE_COLORS } from '../../data/metroData';

interface StationInputProps {
    value: string;
    placeholder: string;
    onChange: (value: string) => void;
    onFocus: () => void;
    onSelect: (station: Station) => void;
    showSuggestions: boolean;
    isSelected: boolean;
    indicatorColor: string;
    theme: 'light' | 'dark';
}

const StationInput: React.FC<StationInputProps> = ({
    value,
    placeholder,
    onChange,
    onFocus,
    onSelect,
    showSuggestions,
    isSelected,
    indicatorColor,
    theme
}) => {
    const isDark = theme === 'dark';
    const filteredStations = ALL_STATIONS.filter(s =>
        s.name.toLowerCase().includes(value.toLowerCase())
    ).slice(0, 5);

    return (
        <div className="relative flex-1">
            <div className={`group flex items-center transition-all duration-500 ${isDark ? 'bg-slate-800/40' : 'bg-slate-100'} rounded-[20px] px-4 py-1 border border-transparent focus-within:bg-white 
            dark:focus-within:bg-gray-200  focus-within:shadow-[0_10px_30px_rgba(59,130,246,0.08)]`}>
                <div className="flex-shrink-0 flex flex-col items-center justify-center">
                    <div
                        className={`w-3.5 h-3.5 rounded-full border-2 bg-white flex-shrink-0 transition-all duration-500 group-focus-within:scale-125 shadow-sm`}
                        style={{ borderColor: indicatorColor }}
                    />
                </div>
                <input
                    type="text"
                    placeholder={placeholder}
                    className={`flex-1 ml-3 py-3 text-[16px] font-black outline-none leading-none placeholder:font-bold placeholder:text-slate-400 bg-transparent ${isDark ? 'text-white' : 'text-slate-900'} transition-all`}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={onFocus}
                />
            </div>

            {showSuggestions && value && !isSelected && (
                <div className={`absolute left-0 right-0 top-full mt-2 rounded-2xl shadow-2xl border z-[999] overflow-hidden max-h-60 overflow-y-auto no-scrollbar animate-in fade-in 
                slide-in-from-top-2 duration-200 ${isDark ? 'bg-slate-900 border-slate-800 shadow-black/40' : 'bg-white border-slate-100'}`}>
                    {filteredStations.map(station => (
                        <button
                            key={station.id}
                            className={`w-full px-5 py-4 text-left text-sm font-bold flex justify-between items-center transition-colors border-b last:border-0 ${isDark ? 'hover:bg-slate-800 text-slate-300 border-slate-800' : 'hover:bg-slate-50 text-slate-600 border-slate-50'}`}
                            onClick={() => onSelect(station)}
                        >
                            <span className="truncate">{station.name}</span>
                            <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-sm ml-2 flex-shrink-0"
                                style={{ backgroundColor: LINE_COLORS[station.line] }}
                            >
                                <Train size={14} />
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StationInput;

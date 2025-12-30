import React from 'react';
import { ArrowRightLeft } from 'lucide-react';
import { Station } from '../../types';
import StationInput from './StationInput';

interface StationSelectorProps {
    fromQuery: string;
    toQuery: string;
    from: string;
    to: string;
    showFromSuggestions: boolean;
    showToSuggestions: boolean;
    onFromQueryChange: (value: string) => void;
    onToQueryChange: (value: string) => void;
    onFromFocus: () => void;
    onToFocus: () => void;
    onSelectFrom: (station: Station) => void;
    onSelectTo: (station: Station) => void;
    onSwap: () => void;
    onFindRoute: () => void;
    hasRoute: boolean;
    theme: 'light' | 'dark';
}

const StationSelector: React.FC<StationSelectorProps> = ({
    fromQuery,
    toQuery,
    from,
    to,
    showFromSuggestions,
    showToSuggestions,
    onFromQueryChange,
    onToQueryChange,
    onFromFocus,
    onToFocus,
    onSelectFrom,
    onSelectTo,
    onSwap,
    onFindRoute,
    hasRoute,
    theme
}) => {
    const isDark = theme === 'dark';

    return (
        <div className={`rounded-[32px] p-6 shadow border border-gray-200 relative transition-all duration-500 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
            <div className="flex flex-col gap-3 relative">
                {/* Connection Line - Styled as a more elegant dashed line */}
                <div className="absolute left-[22px] top-10 bottom-10 w-[1.5px] pointer-events-none">
                    <div className={`h-full border-l-2 border-dashed ${isDark ? 'border-slate-700' : 'border-slate-200'}`} />
                </div>

                {/* From Input */}
                <div className={`relative ${showFromSuggestions ? 'z-30' : 'z-10'}`}>
                    <StationInput
                        value={fromQuery}
                        placeholder="Starting station..."
                        onChange={onFromQueryChange}
                        onFocus={onFromFocus}
                        onSelect={onSelectFrom}
                        showSuggestions={showFromSuggestions}
                        isSelected={!!from}
                        indicatorColor="#3b82f6"
                        theme={theme}
                    />
                </div>

                {/* To Input */}
                <div className={`relative transition-all duration-300 ${showToSuggestions ? 'z-30' : 'z-10'}`}>
                    <StationInput
                        value={toQuery}
                        placeholder="Where to?"
                        onChange={onToQueryChange}
                        onFocus={onToFocus}
                        onSelect={onSelectTo}
                        showSuggestions={showToSuggestions}
                        isSelected={!!to}
                        indicatorColor="#ef4444"
                        theme={theme}
                    />
                </div>

                {/* Swap Button - Improved design and positioning */}
                <button
                    onClick={onSwap}
                    className={`absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl z-20
                        flex items-center justify-center shadow-lg active:rotate-180 transition-all duration-500 
                        ${isDark ? 'bg-slate-800 border border-slate-700 text-blue-400 hover:bg-slate-700' : 'bg-gradient-to-br from-orange-400 to-red-500 text-white hover:scale-105 active:scale-90 '}`}
                >
                    <ArrowRightLeft size={16} className="rotate-90" />
                </button>
            </div>

            {/* Find Route Button - Significantly improved design */}
            {/* <div className="mt-6 pt-2">
                <button
                    onClick={onFindRoute}
                    disabled={!hasRoute}
                    className={`w-full py-4 rounded-2xl font-black text-base tracking-wide transition-all duration-300 flex 
                        items-center justify-center gap-2 group ${hasRoute
                            ? 'bg-[#FF4B3A] gradient-to-r from-orange-500 to-orange-600/80 text-white hover:-translate-y-0.5 active:scale-[0.97]'
                            : (isDark ? 'bg-slate-800 text-slate-600' : 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-70')
                        }`}
                >
                    <span>Find Route</span>
                    <div className={`transition-transform duration-300 ${hasRoute ? 'group-hover:translate-x-1' : ''}`}>
                        <ArrowRightLeft size={18} className="-rotate-180" />
                    </div>
                </button>
            </div> */}
        </div>
    );
};

export default StationSelector;

import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
    onFinish: () => void;
    theme: 'light' | 'dark';
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish, theme }) => {
    const [status, setStatus] = useState('initializing');
    const isDark = theme === 'dark';

    useEffect(() => {
        const sequence = async () => {
            await new Promise(r => setTimeout(r, 800));
            setStatus('preparing');
            await new Promise(r => setTimeout(r, 1000));
            setStatus('ready');
            await new Promise(r => setTimeout(r, 600));
            onFinish();
        };
        sequence();
    }, [onFinish]);

    return (
        <div className={`fixed inset-0 z-[2000] flex flex-col items-center justify-center transition-colors duration-700 ${isDark ? 'bg-slate-950' : 'bg-white'}`}>
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className={`absolute top-[-20%] right-[-20%] w-[600px] h-[600px] rounded-full blur-[120px] opacity-20 animate-pulse ${isDark ? 'bg-[#FF4B3A]/20' : 'bg-orange-50'}`} />
                <div className={`absolute bottom-[-20%] left-[-20%] w-[500px] h-[500px] rounded-full blur-[100px] opacity-10 animate-pulse delay-700 ${isDark ? 'bg-blue-600/20' : 'bg-blue-50'}`} />
            </div>

            <div className="relative z-10 flex flex-col items-center">
                {/* Logo Animation */}
                <div className="relative group">
                    <div className="absolute -inset-4 bg-gradient-to-tr from-blue-500 to-orange-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-1000 animate-pulse" />
                    <img src="/favicon_io/apple-touch-icon.png" alt="MetroTrack" className="w-44 h-44 object-contain z-50" />
                </div>

                {/* Text Content */}
                <div className="mt-12 text-center space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
                    <h1 className={`text-4xl font-black tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Metro<span className="text-[#FF4B3A]">Track</span>
                    </h1>
                    <p className={`text-sm font-bold tracking-[0.2em] uppercase ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        For Metro Travelers
                    </p>
                </div>

                {/* Loading Status */}
                <div className="mt-20 flex flex-col items-center gap-4">
                    <div className={`w-48 h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                        <div
                            className="h-full bg-gradient-to-r from-orange-400 via-[#FF4B3A] to-red-600 transition-all duration-1000 ease-out"
                            style={{
                                width: status === 'initializing' ? '30%' : status === 'preparing' ? '70%' : '100%'
                            }}
                        />
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest animate-pulse ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                        {status === 'initializing' ? 'Connecting to Servers...' : status === 'preparing' ? 'Syncing Metro Schedules...' : 'Welcome Aboard'}
                    </span>
                </div>
            </div>

            {/* Bottom Version Branding */}
            <div className="absolute bottom-12 left-0 right-0 text-center animate-in fade-in duration-1000 delay-700">
                <p className={`text-[9px] font-bold tracking-widest uppercase ${isDark ? 'text-slate-700' : 'text-slate-300'}`}>
                    Designed for Kolkata • v2.4.0
                </p>
            </div>
        </div>
    );
};

export default SplashScreen;

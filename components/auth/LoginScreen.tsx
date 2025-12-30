import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Github, Chrome, Fingerprint, Info } from 'lucide-react';

interface LoginScreenProps {
    onLogin: () => void;
    theme: 'light' | 'dark';
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, theme }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const isDark = theme === 'dark';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin();
    };

    return (
        <div className={`fixed inset-0 z-[1500] flex flex-col h-screen transition-colors duration-500 ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
            {/* Top Background Pattern */}
            <div className="absolute top-0 left-0 right-0 h-[45%] overflow-hidden pointer-events-none">
                <div className={`absolute -top-24 -left-24 w-96 h-96 rounded-full blur-[100px] opacity-30 ${isDark ? 'bg-[#FF4B3A]/40' : 'bg-orange-100'}`} />
                <div className={`absolute top-0 -right-24 w-80 h-80 rounded-full blur-[80px] opacity-20 ${isDark ? 'bg-[#FF4B3A]' : 'bg-orange-200'}`} />
                <div className={`absolute inset-0 opacity-[0.03] ${isDark ? 'invert' : ''}`} style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            </div>

            <div className="relative z-10 flex-1 flex flex-col px-8 pb-12 overflow-y-auto no-scrollbar">
                {/* Header Section */}
                <div className="mt-16 mb-8 animate-in fade-in slide-in-from-top-6 duration-700">
                    <img src="/favicon_io/apple-touch-icon.png" alt="MetroTrack" className="w-24 h-24 mb-4 object-contain" />
                    <h1 className="text-4xl font-black -tight leading-tight">
                        Experience the <br />
                        <span className="bg-gradient-to-r from-orange-500 to-[#FF4B3A] bg-clip-text text-transparent">Future</span> of Travel.
                    </h1>
                    <p className={`mt-3 text-lg font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Sign in to start your journey with MetroTrack.
                    </p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                    <div className="space-y-1.5">
                        <label className={`text-[10px] font-black uppercase -widest ml-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Email Address</label>
                        <div className={`group relative flex items-center transition-all ${isDark ? 'bg-slate-900' : 'bg-white'} rounded-[18px] border ${isDark ? 'border-slate-800 focus-within:border-[#FF4B3A]/50' : 'border-slate-200 focus-within:border-[#FF4B3A]/50'} focus-within:shadow-xl focus-within:shadow-orange-500/10`}>
                            <div className="pl-4 text-slate-400">
                                <Mail size={20} />
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                className="w-full bg-transparent py-4 px-4 text-base font-bold outline-none placeholder:text-slate-400"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <div className="flex justify-between items-center ml-1">
                            <label className={`text-[10px] font-black uppercase -widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Password</label>
                            <button type="button" className="text-[10px] font-black uppercase -widest text-orange-500 hover:text-orange-400 transition-colors">Forgot?</button>
                        </div>
                        <div className={`group relative flex items-center transition-all ${isDark ? 'bg-slate-900' : 'bg-white'} rounded-[18px] border ${isDark ? 'border-slate-800 focus-within:border-[#FF4B3A]/50' : 'border-slate-200 focus-within:border-[#FF4B3A]/50'} focus-within:shadow-xl focus-within:shadow-orange-500/10`}>
                            <div className="pl-4 text-slate-400">
                                <Lock size={20} />
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-transparent py-4 px-4 text-base font-bold outline-none placeholder:text-slate-400"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full mt-2 bg-gradient-to-r from-orange-500 to-[#FF4B3A] text-white
                         font-black py-4 rounded-[20px] shadow-sm shadow-orange-500/20 active:scale-[0.98] transition-all text-lg flex items-center justify-center gap-2 group overflow-hidden relative"
                    >
                        <span className="relative z-10">Get Started</span>
                        <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                        <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                    </button>
                </form>

                {/* Divider */}
                <div className="my-10 flex items-center gap-4 animate-in fade-in duration-1000 delay-300">
                    <div className={`flex-1 h-px ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
                    <span className={`text-[10px] font-black uppercase -widest ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>Or continue with</span>
                    <div className={`flex-1 h-px ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
                </div>

                {/* Social Login */}
                <div className="grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400">
                    <button className={`flex items-center justify-center gap-3 py-4 rounded-[20px] border font-bold transition-all active:scale-[0.96] ${isDark ? 'bg-slate-900 border-slate-800 hover:bg-slate-800 text-white' : 'bg-white border-slate-200 hover:border-slate-300 text-slate-900'}`}>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Google_Favicon_2025.svg/250px-Google_Favicon_2025.svg.png" alt="Google" className="w-6 h-6" />
                        <span>Continue with Google</span>
                    </button>

                </div>

                {/* Fingerprint / Biometric Hint */}

            </div>

            {/* Support Tooltip */}

        </div>
    );
};

export default LoginScreen;

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, User, Send, ChevronRight, LayoutDashboard, KeyRound, AlertCircle, Mail } from 'lucide-react';

const AdminLogin = () => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
      setIsLoading(true);

      try {
          const res = await fetch('/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(credentials)
          });
          
          const data = await res.json();
          
          if (res.ok) {
              localStorage.setItem('token', data.token);
              navigate('/admin');
          } else {
              setError(data.message || 'Login failed. Please check your credentials.');
          }
      } catch (err) {
          setError('Server unreachable. Please try again later.');
      } finally {
          setIsLoading(false);
      }
  };

  return (
        <main className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden selection:bg-accent/30 selection:text-white font-main">
            {/* Grid Pattern Background */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-accent/5 via-transparent to-purple-500/5 pointer-events-none"></div>
            
            {/* Geometric Decoration */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 -z-10"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 -z-10"></div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-[450px]"
            >
                <div className="text-center mb-12 relative">
                    <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="w-20 h-20 bg-gradient-to-br from-accent to-accent-secondary rounded-[2rem] mx-auto flex items-center justify-center shadow-[0_0_50px_rgba(99,102,241,0.3)] mb-8 border border-white/20"
                    >
                        <Shield size={40} className="text-white drop-shadow-lg" />
                    </motion.div>
                    
                    <h1 className="text-5xl font-black font-heading tracking-tighter text-white uppercase leading-none">
                        Terminal <br/>
                        <span className="text-accent">Access</span>
                    </h1>
                    <div className="flex items-center justify-center gap-2 mt-4">
                        <div className="h-px w-8 bg-white/10"></div>
                        <p className="text-white/40 font-bold tracking-[0.3em] text-[10px] uppercase">Encrypted Session</p>
                        <div className="h-px w-8 bg-white/10"></div>
                    </div>
                </div>

                <div className="bg-white/[0.03] backdrop-blur-2xl p-8 md:p-12 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden group">
                    {/* Scan effect animation */}
                    <div className="absolute inset-0 bg-gradient-to-b from-accent/0 via-accent/5 to-accent/0 h-20 -translate-y-full group-focus-within:animate-[scan_3s_infinite] pointer-events-none"></div>
                    
                    <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-white/50 uppercase tracking-[0.25em] ml-2">System Identifier</label>
                                <div className="relative">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-accent transition-colors">
                                        <Mail size={20} />
                                    </div>
                                    <input 
                                        type="email" 
                                        placeholder="admin@sethkorir.com"
                                        required
                                        value={credentials.email}
                                        onChange={e => setCredentials({ ...credentials, email: e.target.value })}
                                        className="w-full bg-white/[0.02] border border-white/5 pl-14 pr-6 py-5 rounded-2xl outline-none focus:border-accent/50 focus:bg-white/[0.05] transition-all duration-500 font-medium text-white placeholder:text-white/20"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-white/50 uppercase tracking-[0.25em] ml-2">Access Key</label>
                                <div className="relative">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-accent transition-colors">
                                        <KeyRound size={20} />
                                    </div>
                                    <input 
                                        type="password" 
                                        placeholder="••••••••••••"
                                        required
                                        value={credentials.password}
                                        onChange={e => setCredentials({ ...credentials, password: e.target.value })}
                                        className="w-full bg-white/[0.02] border border-white/5 pl-14 pr-6 py-5 rounded-2xl outline-none focus:border-accent/50 focus:bg-white/[0.05] transition-all duration-500 font-medium text-white placeholder:text-white/20"
                                    />
                                </div>
                            </div>
                        </div>

                        <AnimatePresence>
                            {error && (
                                <motion.div 
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-xs font-bold uppercase tracking-wider"
                                >
                                    <AlertCircle size={18} className="shrink-0" />
                                    <p>{error}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full py-5 rounded-2xl bg-gradient-to-r from-accent to-accent-secondary text-white font-black tracking-[0.2em] uppercase text-sm shadow-[0_10px_30px_rgba(99,102,241,0.3)] hover:shadow-[0_15px_40px_rgba(99,102,241,0.4)] hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:translate-y-0"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center gap-3">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Authenticating
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-3">
                                    Initialize Login
                                    <ChevronRight size={18} />
                                </div>
                            )}
                        </button>
                    </form>
                </div>

                <div className="mt-12 text-center">
                    <a href="/" className="inline-flex items-center gap-2 text-[10px] font-black text-white/30 hover:text-accent uppercase tracking-[0.3em] transition-all group">
                        <ChevronRight size={14} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
                        Return to Portfolio
                    </a>
                </div>
            </motion.div>
        </main>
    );
};

export default AdminLogin;

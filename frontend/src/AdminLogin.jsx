import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, User, Send, ChevronRight, LayoutDashboard, KeyRound, AlertCircle } from 'lucide-react';

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
        <main className="min-h-screen bg-bg-main flex items-center justify-center p-6 relative overflow-hidden selection:bg-accent/30 selection:text-white">
            <div className="bg-shimmer"></div>
            <div className="noise"></div>
            
            {/* Ambient Background elements */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] -z-10 animate-pulse delay-1000"></div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "backOut" }}
                className="w-full max-w-md"
            >
                <div className="text-center mb-10 space-y-4">
                    <motion.div 
                        initial={{ rotate: -10 }}
                        animate={{ rotate: 10 }}
                        transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                        className="w-16 h-16 bg-accent rounded-3xl mx-auto flex items-center justify-center shadow-glow mb-6"
                    >
                        <Shield size={32} className="text-white" />
                    </motion.div>
                  <h1 className="text-4xl font-black font-heading tracking-tighter text-text-primary uppercase">
                      Admin <span className="text-accent underline decoration-accent/20">Login</span>
                  </h1>
                  <p className="text-text-secondary font-bold tracking-widest text-xs uppercase">Manage Your Portfolio</p>
              </div>

                <div className="glass p-8 md:p-10 border border-white/5 relative overflow-hidden group shadow-2xl">
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-accent/0 via-accent/50 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    
                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                          <div className="space-y-4">
                              <div className="space-y-2">
                                  <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] px-1">Email Address</label>
                                  <div className="relative">
                                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent transition-colors">
                                          <User size={18} />
                                      </div>
                                      <input 
                                          type="email" 
                                          placeholder="admin@example.com"
                                          required
                                          value={credentials.email}
                                          onChange={e => setCredentials({ ...credentials, email: e.target.value })}
                                          className="w-full bg-bg-main/50 glass border border-white/5 pl-12 pr-4 py-4 rounded-xl outline-none focus:border-accent transition-all duration-300 hover:border-white/10"
                                      />
                                  </div>
                              </div>

                              <div className="space-y-2">
                                  <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] px-1">Password</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent transition-colors">
                                        <KeyRound size={18} />
                                    </div>
                                    <input 
                                        type="password" 
                                        placeholder="••••••••••••"
                                        required
                                        value={credentials.password}
                                        onChange={e => setCredentials({ ...credentials, password: e.target.value })}
                                        className="w-full bg-bg-main/50 glass border border-white/5 pl-12 pr-4 py-4 rounded-xl outline-none focus:border-accent transition-all duration-300 hover:border-white/10"
                                    />
                                </div>
                            </div>
                        </div>

                        <AnimatePresence>
                            {error && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 text-sm font-bold"
                                >
                                    <AlertCircle size={18} className="shrink-0" />
                                    <p>{error}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                      <button 
                          type="submit" 
                          disabled={isLoading}
                          className="btn-modern btn-primary w-full py-5 text-lg font-black tracking-[0.2em] uppercase mt-2 group relative overflow-hidden"
                      >
                          {isLoading ? (
                              <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                  Logging in...
                              </div>
                          ) : (
                              <div className="flex items-center justify-center gap-3">
                                  Log In
                                  <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                              </div>
                          )}
                      </button>
                  </form>
              </div>

              <div className="mt-12 text-center">
                  <a href="/" className="text-text-muted hover:text-accent transition-colors flex items-center justify-center gap-2 text-sm font-black uppercase tracking-widest group">
                      <div className="w-8 h-px bg-white/10 group-hover:w-12 transition-all group-hover:bg-accent/40"></div>
                      Back to Portfolio
                      <div className="w-8 h-px bg-white/10 group-hover:w-12 transition-all group-hover:bg-accent/40"></div>
                    </a>
                </div>
            </motion.div>
        </main>
    );
};

export default AdminLogin;

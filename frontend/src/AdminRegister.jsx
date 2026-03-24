import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, KeyRound, AlertCircle, ChevronRight, UserPlus } from 'lucide-react';

const AdminRegister = () => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ 
        email: '', 
        password: '', 
        registrationSecret: '' 
    });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: '', message: '' });
        setIsLoading(true);

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            });
            
            const data = await res.json();
            
            if (res.ok) {
                setStatus({ type: 'success', message: 'Admin registered successfully! Redirecting to login...' });
                setTimeout(() => navigate('/login'), 2000);
            } else {
                const errorMsg = data.errors ? data.errors[0].msg : (data.message || 'Registration failed.');
                setStatus({ type: 'error', message: errorMsg });
            }
        } catch (err) {
            setStatus({ type: 'error', message: 'Server unreachable. Please check your backend.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-bg-main flex items-center justify-center p-6 relative overflow-hidden">
            <div className="bg-shimmer"></div>
            <div className="noise"></div>
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="text-center mb-10 space-y-4">
                    <div className="w-16 h-16 bg-accent rounded-3xl mx-auto flex items-center justify-center shadow-glow mb-6">
                        <UserPlus size={32} className="text-white" />
                    </div>
                    <h1 className="text-4xl font-black font-heading tracking-tighter text-text-primary uppercase">
                        Admin <span className="text-accent underline decoration-accent/20">Register</span>
                    </h1>
                    <p className="text-text-secondary font-bold tracking-widest text-xs uppercase uppercase pt-2">Create Initial Administrator</p>
                </div>

                <div className="glass p-8 md:p-10 border border-white/5 relative overflow-hidden group shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] px-1">Email Address</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
                                        <Mail size={18} />
                                    </div>
                                    <input 
                                        type="email" 
                                        placeholder="admin@example.com"
                                        required
                                        value={credentials.email}
                                        onChange={e => setCredentials({ ...credentials, email: e.target.value })}
                                        className="w-full bg-bg-main/50 glass border border-white/5 pl-12 pr-4 py-4 rounded-xl outline-none focus:border-accent transition-all hover:border-white/10"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] px-1">New Password</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
                                        <Lock size={18} />
                                    </div>
                                    <input 
                                        type="password" 
                                        placeholder="••••••••••••"
                                        required
                                        minLength="6"
                                        value={credentials.password}
                                        onChange={e => setCredentials({ ...credentials, password: e.target.value })}
                                        className="w-full bg-bg-main/50 glass border border-white/5 pl-12 pr-4 py-4 rounded-xl outline-none focus:border-accent transition-all hover:border-white/10"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-accent uppercase tracking-[0.2em] px-1">Registration Secret</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-accent">
                                        <KeyRound size={18} />
                                    </div>
                                    <input 
                                        type="password" 
                                        placeholder="Enter server secret key"
                                        required
                                        value={credentials.registrationSecret}
                                        onChange={e => setCredentials({ ...credentials, registrationSecret: e.target.value })}
                                        className="w-full bg-bg-main/50 glass border border-accent/20 pl-12 pr-4 py-4 rounded-xl outline-none focus:border-accent transition-all hover:border-accent/40"
                                    />
                                </div>
                            </div>
                        </div>

                        <AnimatePresence>
                            {status.message && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className={`p-4 rounded-xl flex items-center gap-3 text-sm font-bold ${
                                        status.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                                    }`}
                                >
                                    <AlertCircle size={18} className="shrink-0" />
                                    <p>{status.message}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="btn-modern btn-primary w-full py-5 text-lg font-black tracking-[0.2em] uppercase mt-2"
                        >
                            {isLoading ? 'Creating Account...' : 'Register Administrator'}
                        </button>
                    </form>
                </div>

                <div className="mt-12 text-center">
                    <a href="/login" className="text-text-muted hover:text-accent transition-colors text-sm font-black uppercase tracking-widest">
                        Already have an account? Log In
                    </a>
                </div>
            </motion.div>
        </main>
    );
};

export default AdminRegister;

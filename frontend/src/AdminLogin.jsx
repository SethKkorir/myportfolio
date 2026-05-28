import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

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
                setError(data.message || 'Invalid email or password.');
            }
        } catch (err) {
            setError('Server unreachable. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#030014] flex flex-col items-center justify-center p-6 font-main">
            <div className="w-full max-w-[400px] bg-[#0c0a24]/60 border border-white/5 p-8 rounded-2xl shadow-2xl">
                
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold tracking-tight text-white mb-2">Admin Login</h1>
                    <p className="text-xs text-gray-400">Enter your credentials to access the panel</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Email Address</label>
                        <input 
                            type="email" 
                            required
                            placeholder="admin@example.com"
                            value={credentials.email}
                            onChange={e => setCredentials({ ...credentials, email: e.target.value })}
                            className="w-full bg-[#030014] border border-white/5 px-4 py-3 rounded-xl outline-none focus:border-[var(--accent)] text-white placeholder:text-gray-600 transition-colors"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Password</label>
                        <input 
                            type="password" 
                            required
                            placeholder="••••••••"
                            value={credentials.password}
                            onChange={e => setCredentials({ ...credentials, password: e.target.value })}
                            className="w-full bg-[#030014] border border-white/5 px-4 py-3 rounded-xl outline-none focus:border-[var(--accent)] text-white placeholder:text-gray-600 transition-colors"
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold rounded-xl text-center">
                            {error}
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full py-3 bg-[var(--accent)] hover:bg-[#4f46e5] text-white font-bold rounded-xl text-sm transition-all shadow-[0_4px_20px_rgba(99,102,241,0.2)] disabled:opacity-50"
                    >
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                {/* Back to Site */}
                <div className="mt-6 text-center">
                    <a href="/" className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-white transition-colors">
                        <ChevronLeft size={16} />
                        Return to site
                    </a>
                </div>

            </div>
        </main>
    );
};

export default AdminLogin;

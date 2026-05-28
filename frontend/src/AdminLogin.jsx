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
                setError(data.message || 'Wrong email or password.');
            }
        } catch (err) {
            setError('Server connection failure. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#f0f4f9] flex items-center justify-center p-4 font-main">
            <div className="w-full max-w-[448px] bg-white border border-[#e0e0e0] p-10 rounded-[28px] shadow-sm flex flex-col gap-8">
                
                {/* Brand / Logo */}
                <div className="flex flex-col items-start gap-4">
                    <div style={{ fontFamily: "'Product Sans', 'Google Sans', Arial, sans-serif", fontSize: '26px', fontWeight: 'bold', letterSpacing: '-0.5px' }}>
                        <span style={{ color: '#4285F4' }}>S</span>
                        <span style={{ color: '#EA4335' }}>K</span>
                        <span style={{ color: '#FBBC05' }}>.</span>
                        <span style={{ color: '#34A853' }}>a</span>
                        <span style={{ color: '#4285F4' }}>d</span>
                        <span style={{ color: '#EA4335' }}>m</span>
                        <span style={{ color: '#34A853' }}>i</span>
                        <span style={{ color: '#FBBC05' }}>n</span>
                    </div>

                    <div className="text-left">
                        <h1 className="text-2xl font-normal text-[#1f1f1f] m-0">Sign in</h1>
                        <p className="text-[#444746] text-base mt-2 m-0">to continue to SethX Core</p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="flex flex-col gap-4">
                        
                        {/* Email Input */}
                        <div className="flex flex-col gap-1.5">
                            <input 
                                type="email" 
                                required
                                placeholder="Email address"
                                value={credentials.email}
                                onChange={e => setCredentials({ ...credentials, email: e.target.value })}
                                style={{
                                    width: '100%',
                                    background: '#ffffff',
                                    border: '1px solid #747775',
                                    borderRadius: '4px',
                                    padding: '16px',
                                    fontSize: '16px',
                                    color: '#1f1f1f',
                                    outline: 'none',
                                    transition: 'border-color 0.2s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#0b57d0'}
                                onBlur={(e) => e.target.style.borderColor = '#747775'}
                            />
                        </div>

                        {/* Password Input */}
                        <div className="flex flex-col gap-1.5">
                            <input 
                                type="password" 
                                required
                                placeholder="Enter password"
                                value={credentials.password}
                                onChange={e => setCredentials({ ...credentials, password: e.target.value })}
                                style={{
                                    width: '100%',
                                    background: '#ffffff',
                                    border: '1px solid #747775',
                                    borderRadius: '4px',
                                    padding: '16px',
                                    fontSize: '16px',
                                    color: '#1f1f1f',
                                    outline: 'none',
                                    transition: 'border-color 0.2s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#0b57d0'}
                                onBlur={(e) => e.target.style.borderColor = '#747775'}
                            />
                        </div>

                    </div>

                    {error && (
                        <div className="text-[#b3261e] text-sm font-medium">
                            {error}
                        </div>
                    )}

                    {/* Bottom Actions Row */}
                    <div className="flex justify-between items-center mt-4">
                        <a 
                            href="/" 
                            className="inline-flex items-center gap-1 text-sm font-semibold text-[#0b57d0] hover:underline"
                        >
                            Return to site
                        </a>

                        <button 
                            type="submit" 
                            disabled={isLoading}
                            style={{
                                background: '#0b57d0',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '100px',
                                padding: '10px 24px',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s'
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#0842a0'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#0b57d0'}
                            className="disabled:opacity-50"
                        >
                            {isLoading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </div>

                </form>

            </div>
        </main>
    );
};

export default AdminLogin;

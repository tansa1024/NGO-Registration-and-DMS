'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Login form state
    const [loginData, setLoginData] = useState({ email: '', password: '' });

    // Register form state
    const [registerData, setRegisterData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user',
        adminSecret: ''
    });

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Login failed');

            router.push(data.user.role === 'admin' ? '/dashboard/admin' : '/dashboard/user');
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const payload = {
                name: registerData.name,
                email: registerData.email,
                password: registerData.password,
                adminSecret: registerData.role === 'admin' ? registerData.adminSecret : ''
            };

            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Registration failed');

            router.push(data.user.role === 'admin' ? '/dashboard/admin' : '/dashboard/user');
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card animate-fade-in">
                {/* Logo Header */}
                <div className="auth-header">
                    <div className="flex justify-center mb-4">
                        <div className="logo-avatar">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                        </div>
                    </div>
                    <h1 className="auth-title">Unnati</h1>
                    <p className="auth-subtitle">Empowering communities through transparent giving</p>
                </div>

                {/* Tabs */}
                <div className="tabs mb-6">
                    <button
                        className={`tab ${activeTab === 'login' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('login'); setError(''); }}
                    >
                        Login
                    </button>
                    <button
                        className={`tab ${activeTab === 'register' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('register'); setError(''); }}
                    >
                        Register
                    </button>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="alert alert-error">
                        {error}
                    </div>
                )}

                {/* Login Form */}
                {activeTab === 'login' && (
                    <form onSubmit={handleLogin} className="animate-fade-in">
                        <div className="form-group">
                            <label className="label">Email Address</label>
                            <input
                                type="email"
                                required
                                className="input"
                                placeholder="Enter your email"
                                value={loginData.email}
                                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label className="label">Password</label>
                            <div className="input-icon-wrapper">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    className="input"
                                    placeholder="Enter your password"
                                    value={loginData.password}
                                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                    style={{ paddingRight: '2.75rem' }}
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary btn-block mt-6"
                        >
                            {loading ? 'Signing in...' : 'Login'}
                        </button>
                    </form>
                )}

                {/* Register Form */}
                {activeTab === 'register' && (
                    <form onSubmit={handleRegister} className="animate-fade-in">
                        <div className="form-group">
                            <label className="label">Full Name</label>
                            <input
                                type="text"
                                required
                                className="input"
                                placeholder="Enter your full name"
                                value={registerData.name}
                                onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label className="label">Email Address</label>
                            <input
                                type="email"
                                required
                                className="input"
                                placeholder="Enter your email"
                                value={registerData.email}
                                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label className="label">Password</label>
                            <div className="input-icon-wrapper">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    className="input"
                                    placeholder="Create a password"
                                    value={registerData.password}
                                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                                    style={{ paddingRight: '2.75rem' }}
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="label">Role</label>
                            <select
                                className="select"
                                value={registerData.role}
                                onChange={(e) => setRegisterData({ ...registerData, role: e.target.value })}
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        {registerData.role === 'admin' && (
                            <div className="form-group animate-fade-in">
                                <label className="label">Admin Secret Code</label>
                                <input
                                    type="password"
                                    required
                                    className="input"
                                    placeholder="Enter admin secret code"
                                    value={registerData.adminSecret}
                                    onChange={(e) => setRegisterData({ ...registerData, adminSecret: e.target.value })}
                                />
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary btn-block mt-6"
                        >
                            {loading ? 'Creating Account...' : 'Register'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate sending email
        setSubmitted(true);
    };

    return (
        <div className="flex items-center justify-center p-4" style={{ minHeight: '80vh' }}>
            <div className="card w-full max-w-md animate-fade-in">
                <h1 className="text-3xl font-bold mb-6 text-center">Reset Password</h1>

                {submitted ? (
                    <div className="text-center">
                        <div className="p-4 rounded mb-6" style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
                            <p className="font-bold">Check your email</p>
                            <p className="text-sm opacity-80 mt-1">
                                We have sent a password reset link to <strong>{email}</strong>.
                            </p>
                        </div>
                        <Link href="/login" className="btn btn-primary btn-block">
                            Back to Login
                        </Link>
                    </div>
                ) : (
                    <>
                        <p className="text-[var(--foreground)] opacity-70 mb-6 text-center text-sm">
                            Enter your registered email address and we'll send you a link to reset your password.
                        </p>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div>
                                <label className="label">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    className="input"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary btn-block mt-4"
                            >
                                Send Reset Link
                            </button>
                        </form>
                        <div className="mt-6 text-center">
                            <Link href="/login" className="text-sm text-[var(--foreground)] opacity-60 hover:opacity-100 hover:underline">
                                Back to Login
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

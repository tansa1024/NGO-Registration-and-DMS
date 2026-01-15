import { getSession } from '@/lib/auth';
import { get } from '@/lib/db';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import LogoutButton from '@/components/LogoutButton';

export default async function ProfilePage() {
    const session = await getSession() as any;
    if (!session) redirect('/login');

    const user = await get('SELECT * FROM users WHERE id = ?', [session.id]);

    return (
        <div className="min-h-screen" style={{ background: '#F9FAFB' }}>
            {/* Dashboard Navigation */}
            <nav style={{
                background: 'white',
                borderBottom: '1px solid #E5E7EB',
                position: 'sticky',
                top: 0,
                zIndex: 50
            }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
                        {/* Left: Logo */}
                        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                                width: '36px',
                                height: '36px',
                                background: 'linear-gradient(135deg, #FF9933, #FF8000)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="white">
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                </svg>
                            </div>
                            <span style={{
                                fontSize: '1.25rem',
                                fontWeight: 700,
                                background: 'linear-gradient(to right, #FF9933, #138808)',
                                WebkitBackgroundClip: 'text',
                                backgroundClip: 'text',
                                color: 'transparent'
                            }}>Unnati</span>
                        </Link>

                        {/* Center: Navigation Tabs */}
                        <div style={{ display: 'flex', gap: '32px' }}>
                            <Link href="/dashboard/user" style={{
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                color: '#6B7280',
                                padding: '20px 0'
                            }}>Dashboard</Link>
                            <Link href="/donate" style={{
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                color: '#6B7280',
                                padding: '20px 0'
                            }}>Donate</Link>
                            <Link href="/dashboard/user/profile" style={{
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                color: '#FF9933',
                                borderBottom: '2px solid #FF9933',
                                padding: '20px 0'
                            }}>Profile</Link>
                        </div>

                        {/* Right: User Info & Logout */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827', margin: 0 }}>{session.name}</p>
                                <p style={{ fontSize: '0.75rem', color: '#6B7280', margin: 0 }}>{session.email}</p>
                            </div>
                            <LogoutButton />
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '8px' }}>Profile Settings</h1>
                <p style={{ color: '#6B7280', marginBottom: '32px' }}>Manage your account information</p>

                {/* Profile Card */}
                <div className="card animate-fade-in" style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '32px' }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            background: 'linear-gradient(135deg, #FF9933, #FF8000)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '2rem',
                            fontWeight: 700,
                            color: 'white'
                        }}>
                            {session.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '4px' }}>{session.name}</h2>
                            <p style={{ color: '#6B7280', margin: 0 }}>{session.email}</p>
                            <span className="badge badge-user" style={{ marginTop: '8px' }}>{session.role}</span>
                        </div>
                    </div>

                    {/* Profile Details */}
                    <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '24px' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px' }}>Account Information</h3>

                        <div style={{ display: 'grid', gap: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #E5E7EB' }}>
                                <span style={{ color: '#6B7280' }}>Full Name</span>
                                <span style={{ fontWeight: 500 }}>{session.name}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #E5E7EB' }}>
                                <span style={{ color: '#6B7280' }}>Email Address</span>
                                <span style={{ fontWeight: 500 }}>{session.email}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #E5E7EB' }}>
                                <span style={{ color: '#6B7280' }}>Account Type</span>
                                <span style={{ fontWeight: 500, textTransform: 'capitalize' }}>{session.role}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0' }}>
                                <span style={{ color: '#6B7280' }}>Member Since</span>
                                <span style={{ fontWeight: 500 }}>
                                    {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-IN', {
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric'
                                    }) : 'N/A'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Account Status */}
                <div className="card animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px' }}>Account Status</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            background: 'rgba(16, 185, 129, 0.1)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                        </div>
                        <div>
                            <p style={{ fontWeight: 600, color: '#10B981', margin: 0 }}>Account Verified</p>
                            <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: 0 }}>Your account is active and in good standing</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

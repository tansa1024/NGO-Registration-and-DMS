import { getSession } from '@/lib/auth';
import { query } from '@/lib/db';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import LogoutButton from '@/components/LogoutButton';

export default async function UserDashboard() {
    const session = await getSession() as any;
    if (!session) redirect('/login');

    const donations = await query(
        'SELECT * FROM donations WHERE user_id = ? ORDER BY created_at DESC',
        [session.id]
    );

    const successfulDonations = donations.filter((d: any) => d.status === 'success');
    const totalDonated = successfulDonations.reduce((sum: number, d: any) => sum + d.amount, 0);
    const latestDonation = donations[0];

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
                <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
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
                                fontWeight: 600,
                                color: '#FF9933',
                                borderBottom: '2px solid #FF9933',
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
                                fontWeight: 500,
                                color: '#6B7280',
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
            <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' }}>
                {/* Welcome Banner */}
                <div className="card animate-fade-in" style={{ marginBottom: '24px', padding: '32px' }}>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '8px' }}>
                        Welcome back, {session.name?.split(' ')[0]}! 👋
                    </h1>
                    <p style={{ color: '#6B7280', margin: 0, fontSize: '1rem' }}>
                        Thank you for being part of our mission to empower communities across India.
                        Your contributions make a real difference.
                    </p>
                </div>

                {/* Summary Cards */}
                <div className="grid md-grid-cols-3 gap-6" style={{ marginBottom: '24px' }}>
                    {/* Registration Status */}
                    <div className="card animate-fade-in" style={{ animationDelay: '0.1s' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                background: 'linear-gradient(135deg, #FF9933, #FF8000)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                </svg>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Registration Status</p>
                                <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#10B981', marginBottom: '4px' }}>Completed</p>
                                <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: 0 }}>Your account is active</p>
                            </div>
                        </div>
                    </div>

                    {/* Total Donations Made */}
                    <div className="card animate-fade-in" style={{ animationDelay: '0.2s' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                background: 'linear-gradient(135deg, #FF9933, #FF8000)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="12" y1="1" x2="12" y2="23"></line>
                                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                                </svg>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Total Donations Made</p>
                                <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>₹{totalDonated.toLocaleString()}</p>
                                <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: 0 }}>Across {successfulDonations.length} donation{successfulDonations.length !== 1 ? 's' : ''}</p>
                            </div>
                        </div>
                    </div>

                    {/* Latest Donation Status */}
                    <div className="card animate-fade-in" style={{ animationDelay: '0.3s' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                background: 'linear-gradient(135deg, #FF9933, #FF8000)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                                </svg>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Latest Donation Status</p>
                                {latestDonation ? (
                                    <>
                                        <p style={{
                                            fontSize: '1.5rem',
                                            fontWeight: 700,
                                            color: latestDonation.status === 'success' ? '#10B981' : latestDonation.status === 'pending' ? '#F59E0B' : '#EF4444',
                                            marginBottom: '4px',
                                            textTransform: 'capitalize'
                                        }}>{latestDonation.status}</p>
                                        <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: 0 }}>
                                            ₹{latestDonation.amount.toLocaleString()} on {new Date(latestDonation.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#9CA3AF', marginBottom: '4px' }}>No donations</p>
                                        <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: 0 }}>Make your first donation today</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Call-to-Action Banner */}
                <div className="animate-fade-in" style={{
                    background: 'linear-gradient(135deg, #FF9933, #FF8000)',
                    borderRadius: '12px',
                    padding: '40px',
                    marginBottom: '24px',
                    animationDelay: '0.4s'
                }}>
                    <div style={{ maxWidth: '600px' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white', marginBottom: '12px' }}>
                            Make a Difference Today
                        </h2>
                        <p style={{ color: 'rgba(255,255,255,0.9)', marginBottom: '24px', lineHeight: 1.6 }}>
                            Every donation, no matter how small, creates ripples of change in communities across India.
                            Your generosity helps provide education, healthcare, and hope to those who need it most.
                        </p>
                        <Link href="/donate" style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            background: 'white',
                            color: '#FF9933',
                            padding: '14px 28px',
                            borderRadius: '8px',
                            fontWeight: 600,
                            fontSize: '1rem',
                            textDecoration: 'none',
                            boxShadow: '0 4px 14px rgba(0,0,0,0.1)'
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                            Make a Donation
                        </Link>
                    </div>
                </div>

                {/* Recent Activity Feed */}
                <div className="card animate-fade-in" style={{ animationDelay: '0.5s' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        Recent Activity
                    </h3>

                    {donations.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '48px 24px', borderTop: '1px solid #E5E7EB' }}>
                            <div style={{
                                width: '64px',
                                height: '64px',
                                background: '#F9FAFB',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 16px'
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                </svg>
                            </div>
                            <p style={{ color: '#6B7280', marginBottom: '16px' }}>No activity yet. Start your giving journey today!</p>
                            <Link href="/donate" className="btn btn-primary">Make Your First Donation</Link>
                        </div>
                    ) : (
                        <div style={{ borderTop: '1px solid #E5E7EB' }}>
                            {donations.slice(0, 10).map((d: any, index: number) => (
                                <div key={d.id} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '16px 0',
                                    borderBottom: index < donations.length - 1 ? '1px solid #E5E7EB' : 'none'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{
                                            width: '40px',
                                            height: '40px',
                                            background: d.status === 'success' ? 'rgba(16, 185, 129, 0.1)' : d.status === 'pending' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill={d.status === 'success' ? '#10B981' : d.status === 'pending' ? '#F59E0B' : '#EF4444'}>
                                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p style={{ fontWeight: 500, color: '#111827', margin: 0, marginBottom: '2px' }}>
                                                Donation {d.status === 'success' ? 'completed' : d.status === 'pending' ? 'pending' : 'failed'}
                                            </p>
                                            <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: 0 }}>
                                                {new Date(d.created_at).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <span style={{ fontWeight: 600, color: '#111827' }}>₹{d.amount.toLocaleString()}</span>
                                        <span className={`badge ${d.status === 'success' ? 'badge-success' : d.status === 'pending' ? 'badge-pending' : 'badge-failed'}`}>
                                            {d.status === 'success' && '✓ '}
                                            {d.status.charAt(0).toUpperCase() + d.status.slice(1)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

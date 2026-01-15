import { getSession } from '@/lib/auth';
import { query, get } from '@/lib/db';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import LogoutButton from '@/components/LogoutButton';

export default async function AdminDashboard() {
    const session = await getSession() as any;
    if (!session || session.role !== 'admin') redirect('/login');

    // Stats
    const stats = await get(`
        SELECT 
            (SELECT COUNT(*) FROM users WHERE role = 'user') as total_users,
            (SELECT COUNT(*) FROM donations) as total_donations,
            (SELECT COUNT(*) FROM donations WHERE status = 'success') as successful_donations,
            (SELECT COUNT(*) FROM donations WHERE status = 'pending' OR status = 'failed') as pending_failed,
            (SELECT SUM(amount) FROM donations WHERE status = 'success') as total_amount
    `);

    // Recent registrations
    const recentUsers = await query(`
        SELECT id, name, email, created_at FROM users 
        WHERE role = 'user'
        ORDER BY created_at DESC LIMIT 5
    `);

    // Recent donations
    const recentDonations = await query(`
        SELECT d.*, u.name as user_name, u.email as user_email 
        FROM donations d 
        JOIN users u ON d.user_id = u.id 
        ORDER BY d.created_at DESC LIMIT 5
    `);

    // Monthly stats
    const monthlyStats = await get(`
        SELECT 
            (SELECT COUNT(*) FROM users WHERE role = 'user' AND created_at >= date('now', '-1 month')) as new_registrations,
            (SELECT SUM(amount) FROM donations WHERE status = 'success' AND created_at >= date('now', '-1 month')) as monthly_donations,
            (SELECT AVG(amount) FROM donations WHERE status = 'success') as avg_donation,
            (SELECT COUNT(DISTINCT user_id) FROM donations WHERE created_at >= date('now', '-1 month')) as active_donors
    `);

    const successRate = stats.total_donations > 0
        ? ((stats.successful_donations / stats.total_donations) * 100).toFixed(1)
        : 0;
    const failRate = stats.total_donations > 0
        ? ((stats.pending_failed / stats.total_donations) * 100).toFixed(1)
        : 0;

    return (
        <div className="min-h-screen" style={{ background: '#F9FAFB' }}>
            {/* Admin Navigation */}
            <nav style={{
                background: 'white',
                borderBottom: '1px solid #E5E7EB',
                position: 'sticky',
                top: 0,
                zIndex: 50
            }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
                        {/* Left: Logo + Admin Label */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
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
                            <span style={{
                                background: '#FFF7ED',
                                color: '#FF9933',
                                padding: '4px 12px',
                                borderRadius: '20px',
                                fontSize: '0.75rem',
                                fontWeight: 600
                            }}>Admin Panel</span>
                        </div>

                        {/* Center: Navigation Tabs */}
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <Link href="/dashboard/admin" style={{
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                color: 'white',
                                background: 'linear-gradient(135deg, #FF9933, #FF8000)',
                                padding: '8px 20px',
                                borderRadius: '6px'
                            }}>Dashboard</Link>
                            <Link href="/dashboard/admin/registrations" style={{
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                color: '#6B7280',
                                padding: '8px 20px',
                                borderRadius: '6px'
                            }}>Registrations</Link>
                            <Link href="/dashboard/admin/donations" style={{
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                color: '#6B7280',
                                padding: '8px 20px',
                                borderRadius: '6px'
                            }}>Donations</Link>
                        </div>

                        {/* Right: Admin Info & Logout */}
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
                {/* Summary Cards - 4 columns */}
                <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '24px' }}>
                    {/* Total Registrations */}
                    <div className="card animate-fade-in">
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                            <div style={{
                                width: '48px', height: '48px',
                                background: 'linear-gradient(135deg, #FF9933, #FF8000)',
                                borderRadius: '12px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="9" cy="7" r="4"></circle>
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                </svg>
                            </div>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase', marginBottom: '4px' }}>Total Registrations</p>
                                <p style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '4px' }}>{stats.total_users.toLocaleString()}</p>
                                <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: 0 }}>Active users</p>
                                <p style={{ fontSize: '0.75rem', color: '#10B981', marginTop: '4px' }}>+12% from last month</p>
                            </div>
                        </div>
                    </div>

                    {/* Total Donations */}
                    <div className="card animate-fade-in" style={{ animationDelay: '0.1s' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                            <div style={{
                                width: '48px', height: '48px',
                                background: 'linear-gradient(135deg, #FF9933, #FF8000)',
                                borderRadius: '12px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                    <line x1="12" y1="1" x2="12" y2="23"></line>
                                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                                </svg>
                            </div>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase', marginBottom: '4px' }}>Total Donations</p>
                                <p style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '4px' }}>₹{(stats.total_amount || 0).toLocaleString()}</p>
                                <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: 0 }}>All time total</p>
                                <p style={{ fontSize: '0.75rem', color: '#10B981', marginTop: '4px' }}>+8% from last month</p>
                            </div>
                        </div>
                    </div>

                    {/* Successful Payments */}
                    <div className="card animate-fade-in" style={{ animationDelay: '0.2s' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                            <div style={{
                                width: '48px', height: '48px',
                                background: 'linear-gradient(135deg, #FF9933, #FF8000)',
                                borderRadius: '12px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                </svg>
                            </div>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase', marginBottom: '4px' }}>Successful Payments</p>
                                <p style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '4px' }}>{stats.successful_donations.toLocaleString()}</p>
                                <p style={{ fontSize: '0.875rem', color: '#10B981', margin: 0 }}>{successRate}% success rate</p>
                            </div>
                        </div>
                    </div>

                    {/* Pending/Failed */}
                    <div className="card animate-fade-in" style={{ animationDelay: '0.3s' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                            <div style={{
                                width: '48px', height: '48px',
                                background: 'linear-gradient(135deg, #FF9933, #FF8000)',
                                borderRadius: '12px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="8" x2="12" y2="12"></line>
                                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                </svg>
                            </div>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase', marginBottom: '4px' }}>Pending/Failed</p>
                                <p style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '4px' }}>{stats.pending_failed}</p>
                                <p style={{ fontSize: '0.875rem', color: '#F59E0B', margin: 0 }}>{failRate}% of total</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Two-Column Activity Feed */}
                <div className="grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', marginBottom: '24px' }}>
                    {/* Recent Registrations */}
                    <div className="card animate-fade-in" style={{ animationDelay: '0.4s' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>Recent Registrations</h3>
                            <Link href="/dashboard/admin/registrations" style={{ fontSize: '0.875rem', color: '#FF9933' }}>View All →</Link>
                        </div>
                        <div style={{ borderTop: '1px solid #E5E7EB' }}>
                            {recentUsers.length === 0 ? (
                                <p style={{ color: '#6B7280', textAlign: 'center', padding: '24px' }}>No registrations yet</p>
                            ) : (
                                recentUsers.map((user: any) => (
                                    <div key={user.id} style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '12px 0',
                                        borderBottom: '1px solid #E5E7EB'
                                    }}>
                                        <div>
                                            <p style={{ fontWeight: 500, margin: 0 }}>{user.name}</p>
                                            <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: 0 }}>{user.email}</p>
                                        </div>
                                        <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
                                            {new Date(user.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Recent Donations */}
                    <div className="card animate-fade-in" style={{ animationDelay: '0.5s' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>Recent Donations</h3>
                            <Link href="/dashboard/admin/donations" style={{ fontSize: '0.875rem', color: '#FF9933' }}>View All →</Link>
                        </div>
                        <div style={{ borderTop: '1px solid #E5E7EB' }}>
                            {recentDonations.length === 0 ? (
                                <p style={{ color: '#6B7280', textAlign: 'center', padding: '24px' }}>No donations yet</p>
                            ) : (
                                recentDonations.map((d: any) => (
                                    <div key={d.id} style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '12px 0',
                                        borderBottom: '1px solid #E5E7EB'
                                    }}>
                                        <div>
                                            <p style={{ fontWeight: 500, margin: 0 }}>{d.user_name}</p>
                                            <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: 0 }}>₹{d.amount.toLocaleString()}</p>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <span style={{
                                                fontSize: '0.75rem',
                                                fontWeight: 600,
                                                color: d.status === 'success' ? '#10B981' : d.status === 'pending' ? '#F59E0B' : '#EF4444'
                                            }}>
                                                {d.status.toUpperCase()}
                                            </span>
                                            <p style={{ fontSize: '0.75rem', color: '#9CA3AF', margin: 0 }}>
                                                {new Date(d.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Monthly Overview */}
                <div className="card animate-fade-in" style={{ animationDelay: '0.6s' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '20px' }}>Monthly Overview</h3>
                    <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                        <div style={{ background: '#EFF6FF', borderRadius: '12px', padding: '20px' }}>
                            <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#2563EB', marginBottom: '4px' }}>
                                {monthlyStats.new_registrations || 0}
                            </p>
                            <p style={{ fontSize: '0.875rem', color: '#3B82F6', margin: 0 }}>New Registrations</p>
                        </div>
                        <div style={{ background: '#ECFDF5', borderRadius: '12px', padding: '20px' }}>
                            <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#059669', marginBottom: '4px' }}>
                                ₹{(monthlyStats.monthly_donations || 0).toLocaleString()}
                            </p>
                            <p style={{ fontSize: '0.875rem', color: '#10B981', margin: 0 }}>Total Donations</p>
                        </div>
                        <div style={{ background: '#F5F3FF', borderRadius: '12px', padding: '20px' }}>
                            <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#7C3AED', marginBottom: '4px' }}>
                                ₹{Math.round(monthlyStats.avg_donation || 0).toLocaleString()}
                            </p>
                            <p style={{ fontSize: '0.875rem', color: '#8B5CF6', margin: 0 }}>Avg Donation</p>
                        </div>
                        <div style={{ background: '#FFF7ED', borderRadius: '12px', padding: '20px' }}>
                            <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#EA580C', marginBottom: '4px' }}>
                                {monthlyStats.active_donors || 0}
                            </p>
                            <p style={{ fontSize: '0.875rem', color: '#F97316', margin: 0 }}>Active Donors</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

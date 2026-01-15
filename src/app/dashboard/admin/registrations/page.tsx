import { getSession } from '@/lib/auth';
import { query, get } from '@/lib/db';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import LogoutButton from '@/components/LogoutButton';

export default async function RegistrationManagement({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
    const session = await getSession() as any;
    if (!session || session.role !== 'admin') redirect('/login');

    const resolvedParams = await searchParams;
    const search = resolvedParams.search || '';
    const page = parseInt(resolvedParams.page || '1');
    const limit = 10;
    const offset = (page - 1) * limit;

    // Get total count
    const totalResult = await get(`
        SELECT COUNT(*) as total FROM users 
        WHERE role = 'user' AND (name LIKE ? OR email LIKE ?)
    `, [`%${search}%`, `%${search}%`]);
    const total = totalResult.total;
    const totalPages = Math.ceil(total / limit);

    // Get users with pagination
    const users = await query(`
        SELECT id, name, email, created_at FROM users 
        WHERE role = 'user' AND (name LIKE ? OR email LIKE ?)
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
    `, [`%${search}%`, `%${search}%`, limit, offset]);

    // Stats
    const stats = await get(`
        SELECT 
            (SELECT COUNT(*) FROM users WHERE role = 'user') as total_users,
            (SELECT COUNT(*) FROM users WHERE role = 'user' AND created_at >= date('now', '-1 month')) as this_month,
            (SELECT COUNT(*) FROM users WHERE role = 'user' AND created_at >= date('now', '-7 days')) as this_week
    `);

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
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{
                                    width: '36px', height: '36px',
                                    background: 'linear-gradient(135deg, #FF9933, #FF8000)',
                                    borderRadius: '50%',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="white">
                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                    </svg>
                                </div>
                                <span style={{ fontSize: '1.25rem', fontWeight: 700, background: 'linear-gradient(to right, #FF9933, #138808)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>Unnati</span>
                            </Link>
                            <span style={{ background: '#FFF7ED', color: '#FF9933', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600 }}>Admin Panel</span>
                        </div>

                        <div style={{ display: 'flex', gap: '8px' }}>
                            <Link href="/dashboard/admin" style={{ fontSize: '0.875rem', fontWeight: 500, color: '#6B7280', padding: '8px 20px', borderRadius: '6px' }}>Dashboard</Link>
                            <Link href="/dashboard/admin/registrations" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'white', background: 'linear-gradient(135deg, #FF9933, #FF8000)', padding: '8px 20px', borderRadius: '6px' }}>Registrations</Link>
                            <Link href="/dashboard/admin/donations" style={{ fontSize: '0.875rem', fontWeight: 500, color: '#6B7280', padding: '8px 20px', borderRadius: '6px' }}>Donations</Link>
                        </div>

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

            <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' }}>
                {/* Page Header */}
                <div className="card animate-fade-in" style={{ marginBottom: '24px' }}>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>Registration Management</h1>
                    <p style={{ color: '#6B7280', margin: 0 }}>View and manage all user registrations on the platform.</p>
                </div>

                {/* Management Card */}
                <div className="card animate-fade-in" style={{ marginBottom: '24px', animationDelay: '0.1s' }}>
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h2 style={{ fontSize: '1.125rem', fontWeight: 600, margin: 0 }}>
                            Registered Users ({total})
                        </h2>
                        <Link href={`/api/admin/export?tab=registrations`} className="btn btn-primary btn-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="7 10 12 15 17 10"></polyline>
                                <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                            Export CSV
                        </Link>
                    </div>

                    {/* Search Bar */}
                    <form method="GET" style={{ marginBottom: '20px' }}>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <div style={{ position: 'relative', flex: 1 }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}>
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                </svg>
                                <input
                                    type="text"
                                    name="search"
                                    placeholder="Search by name or email..."
                                    defaultValue={search}
                                    className="input"
                                    style={{ paddingLeft: '44px' }}
                                />
                            </div>
                            <button type="submit" className="btn btn-secondary">Search</button>
                        </div>
                    </form>

                    {/* Data Table */}
                    <div style={{ overflow: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: '#F9FAFB' }}>
                                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', borderBottom: '1px solid #E5E7EB' }}>ID</th>
                                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', borderBottom: '1px solid #E5E7EB' }}>Name</th>
                                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', borderBottom: '1px solid #E5E7EB' }}>Email</th>
                                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', borderBottom: '1px solid #E5E7EB' }}>Registration Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} style={{ padding: '48px', textAlign: 'center', color: '#6B7280' }}>
                                            No users found
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((user: any) => (
                                        <tr key={user.id} style={{ borderBottom: '1px solid #E5E7EB' }} className="hover:bg-surface">
                                            <td style={{ padding: '16px', fontSize: '0.875rem', color: '#9CA3AF' }}>#{user.id}</td>
                                            <td style={{ padding: '16px', fontWeight: 500 }}>{user.name}</td>
                                            <td style={{ padding: '16px', color: '#6B7280' }}>{user.email}</td>
                                            <td style={{ padding: '16px', color: '#6B7280', fontSize: '0.875rem' }}>
                                                {new Date(user.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #E5E7EB' }}>
                        <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: 0 }}>
                            Showing {offset + 1} to {Math.min(offset + limit, total)} of {total}
                        </p>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            {page > 1 && (
                                <Link href={`?page=${page - 1}&search=${search}`} className="btn btn-secondary btn-sm">Previous</Link>
                            )}
                            {page < totalPages && (
                                <Link href={`?page=${page + 1}&search=${search}`} className="btn btn-secondary btn-sm">Next</Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid md-grid-cols-3 gap-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <div className="card">
                        <p style={{ fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase', marginBottom: '8px' }}>Total Registrations</p>
                        <p style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '4px' }}>{stats.total_users}</p>
                        <p style={{ fontSize: '0.875rem', color: '#10B981' }}>All time</p>
                    </div>
                    <div className="card">
                        <p style={{ fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase', marginBottom: '8px' }}>This Month</p>
                        <p style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '4px' }}>{stats.this_month}</p>
                        <p style={{ fontSize: '0.875rem', color: '#10B981' }}>+{stats.this_month} new</p>
                    </div>
                    <div className="card">
                        <p style={{ fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase', marginBottom: '8px' }}>This Week</p>
                        <p style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '4px' }}>{stats.this_week}</p>
                        <p style={{ fontSize: '0.875rem', color: '#10B981' }}>+{stats.this_week} new</p>
                    </div>
                </div>
            </main>
        </div>
    );
}

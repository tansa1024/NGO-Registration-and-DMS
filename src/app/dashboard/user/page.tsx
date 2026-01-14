import { getSession } from '@/lib/auth';
import { query } from '@/lib/db';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function UserDashboard() {
    const session = await getSession() as any;
    if (!session) redirect('/login');
    // Optional: Redirect if admin access user dashboard? Usually fine, or redirect.
    // if (session.role === 'admin') redirect('/dashboard/admin');

    const donations = await query(
        'SELECT * FROM donations WHERE user_id = ? ORDER BY created_at DESC',
        [session.id]
    );

    return (
        <div className="container mx-auto py-10 px-4 animate-fade-in">
            <div className="flex flex-col md-flex-row justify-between items-center mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-bold">My Dashboard</h1>
                    <div className="mt-2 text-[var(--foreground)] opacity-80 space-y-1">
                        <p><span className="opacity-60">Name:</span> {session.name}</p>
                        <p><span className="opacity-60">Email:</span> {session.email}</p>
                        <p><span className="opacity-60">Role:</span> <span className="uppercase text-xs font-bold tracking-wider">{session.role}</span></p>
                    </div>
                </div>
                <Link href="/donate" className="btn btn-primary shadow-lg">
                    Make a New Donation
                </Link>
            </div>

            <div className="card overflow-hidden">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    Donation History
                </h2>

                {donations.length === 0 ? (
                    <div className="text-center py-12 border-t border-[var(--border)]">
                        <p className="opacity-50">You haven't made any donations yet.</p>
                        <Link href="/donate" className="text-primary hover:underline mt-2 inline-block">Start today</Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-[var(--border)] text-xs uppercase tracking-wider opacity-60">
                                    <th className="py-4 px-2">Date</th>
                                    <th className="py-4 px-2">Amount</th>
                                    <th className="py-4 px-2">Status</th>
                                    <th className="py-4 px-2">Payment Ref</th>
                                </tr>
                            </thead>
                            <tbody>
                                {donations.map((d: any) => (
                                    <tr key={d.id} className="border-b border-[var(--border)] last:border-0 hover:bg-white/5 transition-colors">
                                        <td className="py-4 px-2">{new Date(d.created_at).toLocaleDateString()}</td>
                                        <td className="py-4 px-2 text-lg font-semibold">${d.amount.toFixed(2)}</td>
                                        <td className="py-4 px-2">
                                            <span className={`badge ${d.status === 'success' ? 'badge-success' :
                                                d.status === 'pending' ? 'badge-pending' :
                                                    'badge-failed'
                                                }`}>
                                                {d.status === 'success' && '✓ '}
                                                {d.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="py-4 px-2 font-mono text-xs opacity-50">
                                            {d.payment_id ? d.payment_id.slice(0, 16) + '...' : '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
                }
            </div >
        </div >
    );
}

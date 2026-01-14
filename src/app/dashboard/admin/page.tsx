import { getSession } from '@/lib/auth';
import { query, get } from '@/lib/db';
import React, { Suspense } from 'react';
import { redirect } from 'next/navigation';
import AdminControls from './AdminControls';

export default async function AdminDashboard({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const session = await getSession() as any;
    if (!session || session.role !== 'admin') redirect('/login');

    const resolvedParams = await searchParams;
    const tab = (resolvedParams.tab as string) || 'registrations';
    const search = (resolvedParams.search as string) || '';
    const filter = (resolvedParams.filter as string) || 'all';

    // Stats
    const stats = await get(`
    SELECT 
      (SELECT COUNT(*) FROM users WHERE role = 'user') as users,
      (SELECT COUNT(*) FROM donations WHERE status = 'success') as donations,
      (SELECT SUM(amount) FROM donations WHERE status = 'success') as total_amount
  `);

    let filterClause = '';
    // Note: The column name for date filtering differs between tables (created_at vs d.created_at)
    // We'll insert the specific column name dynamically or handle it in the clause if we standardize.
    // simpler: generated the condition part (operator + value) and prepend column name in query.

    let dateCondition = "";
    if (filter === 'today') {
        dateCondition = " = date('now')";
    } else if (filter === 'yesterday') {
        dateCondition = " = date('now', '-1 day')";
    } else if (filter === 'week') {
        dateCondition = " >= date('now', '-7 days')";
    } else if (filter === 'month') {
        dateCondition = " >= date('now', '-1 month')";
    }

    let data = [];
    if (tab === 'registrations') {
        const dateFilter = dateCondition ? `AND date(created_at) ${dateCondition}` : '';
        data = await query(`
      SELECT id, name, email, role, created_at FROM users 
      WHERE (name LIKE ? OR email LIKE ?)
      ${dateFilter}
      ORDER BY created_at DESC
    `, [`%${search}%`, `%${search}%`]);
    } else {
        const dateFilter = dateCondition ? `AND date(d.created_at) ${dateCondition}` : '';
        // Note: For week/month usually we don't wrap in date() for the >= comparison to preserve precision or use date() on both sides.
        // For simplicity in this SQLite setup:
        // If filter is week/month, we surely want >= date('...'). 
        // If filter is today/yesterday, we want date(col) = date('...').

        let specificDateFilter = "";
        if (filter === 'today' || filter === 'yesterday') {
            specificDateFilter = dateCondition ? `AND date(d.created_at) ${dateCondition}` : '';
        } else {
            // For week/month keys logic
            if (filter === 'week') specificDateFilter = "AND d.created_at >= date('now', '-7 days')";
            if (filter === 'month') specificDateFilter = "AND d.created_at >= date('now', '-1 month')";
        }

        data = await query(`
      SELECT d.*, u.name as user_name, u.email as user_email 
      FROM donations d 
      JOIN users u ON d.user_id = u.id 
      WHERE (u.name LIKE ? OR u.email LIKE ? OR d.payment_id LIKE ?)
      ${specificDateFilter}
      ORDER BY d.created_at DESC
    `, [`%${search}%`, `%${search}%`, `%${search}%`]);
    }

    return (
        <div className="container mx-auto py-10 px-4 animate-fade-in">
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md-grid-cols-3 gap-6 mb-10">
                <div className="card">
                    <h3 className="text-sm font-medium opacity-70 uppercase">Total Registrations</h3>
                    <p className="text-3xl font-bold mt-2">{stats.users}</p>
                </div>
                <div className="card">
                    <h3 className="text-sm font-medium opacity-70 uppercase">Total Donations</h3>
                    <p className="text-3xl font-bold mt-2">${(stats.total_amount || 0).toLocaleString()}</p>
                    <p className="text-xs opacity-50 mt-1">{stats.donations} transactions</p>
                </div>
                <div className="card">
                    <h3 className="text-sm font-medium opacity-70 uppercase">System Status</h3>
                    <p className="text-3xl font-bold mt-2 text-success">Active</p>
                </div>
            </div>

            <div className="card">
                <Suspense fallback={<div>Loading controls...</div>}>
                    <AdminControls />
                </Suspense>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            {tab === 'registrations' ? (
                                <tr className="border-b border-[var(--border)] text-xs uppercase tracking-wider opacity-60">
                                    <th className="py-4 px-2">User ID</th>
                                    <th className="py-4 px-2">Name</th>
                                    <th className="py-4 px-2">Email</th>
                                    <th className="py-4 px-2">Role</th>
                                    <th className="py-4 px-2">Joined</th>
                                </tr>
                            ) : (
                                <tr className="border-b border-[var(--border)] text-xs uppercase tracking-wider opacity-60">
                                    <th className="py-4 px-2">ID</th>
                                    <th className="py-4 px-2">Donor</th>
                                    <th className="py-4 px-2">Amount</th>
                                    <th className="py-4 px-2">Status</th>
                                    <th className="py-4 px-2">Date</th>
                                </tr>
                            )}
                        </thead>
                        <tbody>
                            {data.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center opacity-50">No records found.</td>
                                </tr>
                            ) : (
                                data.map((row: any) => (
                                    <tr key={row.id} className="border-b border-[var(--border)] last:border-0 hover:bg-white/5">
                                        {tab === 'registrations' ? (
                                            <>
                                                <td className="py-4 px-2 font-mono text-xs opacity-50">#{row.id}</td>
                                                <td className="py-4 px-2 font-medium">{row.name}</td>
                                                <td className="py-4 px-2 opacity-80">{row.email}</td>
                                                <td className="py-4 px-2">
                                                    <span className={`badge ${row.role === 'admin' ? 'badge-admin' : 'badge-pending'}`}>
                                                        {row.role}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-2 text-sm opacity-60">{new Date(row.created_at).toLocaleDateString()}</td>
                                            </>
                                        ) : (
                                            <>
                                                <td className="py-4 px-2 font-mono text-xs opacity-50">#{row.id}</td>
                                                <td className="py-4 px-2">
                                                    <div className="font-medium">{row.user_name}</div>
                                                    <div className="text-xs opacity-50">{row.user_email}</div>
                                                </td>
                                                <td className="py-4 px-2 font-bold">${row.amount.toFixed(2)}</td>
                                                <td className="py-4 px-2">
                                                    <span className={`badge ${row.status === 'success' ? 'badge-success' :
                                                        row.status === 'pending' ? 'badge-pending' :
                                                            'badge-failed'
                                                        }`}>
                                                        {row.status}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-2 text-sm opacity-60">{new Date(row.created_at).toLocaleDateString()}</td>
                                            </>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

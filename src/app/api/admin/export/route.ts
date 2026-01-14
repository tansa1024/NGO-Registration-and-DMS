import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET(request: Request) {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
        return new NextResponse('Forbidden', { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const tab = searchParams.get('tab') || 'registrations';
    const search = searchParams.get('search') || '';

    let csv = '';
    if (tab === 'registrations') {
        const data = await query(`
       SELECT id, name, email, role, created_at FROM users 
       WHERE name LIKE ? OR email LIKE ?
       ORDER BY created_at DESC
    `, [`%${search}%`, `%${search}%`]);

        csv = 'ID,Name,Email,Role,Created At\n' +
            data.map((r: any) => `${r.id},"${r.name}","${r.email}",${r.role},${r.created_at}`).join('\n');
    } else {
        const data = await query(`
      SELECT d.id, d.amount, d.status, d.created_at, u.name, u.email 
      FROM donations d JOIN users u ON d.user_id = u.id
      WHERE u.name LIKE ? OR u.email LIKE ?
      ORDER BY d.created_at DESC
    `, [`%${search}%`, `%${search}%`]);

        csv = 'ID,Donor Name,Donor Email,Amount,Status,Date\n' +
            data.map((r: any) => `${r.id},"${r.name}","${r.email}",${r.amount},${r.status},${r.created_at}`).join('\n');
    }

    return new NextResponse(csv, {
        headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename="${tab}_export.csv"`
        }
    });
}

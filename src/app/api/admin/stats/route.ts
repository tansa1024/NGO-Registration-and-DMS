import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { get } from '@/lib/db';

export async function GET() {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    try {
        const totalUsers = await get('SELECT COUNT(*) as count FROM users');
        const totalDonations = await get('SELECT COUNT(*) as count FROM donations');
        const totalAmount = await get("SELECT SUM(amount) as total FROM donations WHERE status = 'success'");

        return NextResponse.json({
            totalUsers: totalUsers.count,
            totalDonations: totalDonations.count,
            totalAmount: totalAmount.total || 0
        });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

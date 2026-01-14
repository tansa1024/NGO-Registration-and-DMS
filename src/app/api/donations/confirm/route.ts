import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { run, get } from '@/lib/db';

export async function POST(request: Request) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { donationId, status } = await request.json(); // status: 'success' or 'failed'

        if (!['success', 'failed'].includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        }

        // Verify ownership or admin
        const donation = await get('SELECT * FROM donations WHERE id = ?', [donationId]);
        if (!donation) {
            return NextResponse.json({ error: 'Donation not found' }, { status: 404 });
        }

        if (donation.user_id !== session.id && session.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await run(
            'UPDATE donations SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [status, donationId]
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Donation update error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

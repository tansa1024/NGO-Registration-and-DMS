import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { run, query } from '@/lib/db';

export async function POST(request: Request) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { amount } = await request.json();
        if (!amount || amount <= 0) {
            return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
        }

        const result = await run(
            'INSERT INTO donations (user_id, amount, status) VALUES (?, ?, ?)',
            [session.id, amount, 'pending']
        );

        return NextResponse.json({ donationId: result.id });
    } catch (error) {
        console.error('Donation creation error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(request: Request) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        let rows;
        if (session.role === 'admin') {
            // Admin: view all donations with user info
            rows = await query(`
        SELECT d.*, u.name as user_name, u.email as user_email 
        FROM donations d 
        JOIN users u ON d.user_id = u.id 
        ORDER BY d.created_at DESC
      `);
        } else {
            // User: view own donations
            rows = await query(
                'SELECT * FROM donations WHERE user_id = ? ORDER BY created_at DESC',
                [session.id]
            );
        }
        return NextResponse.json({ donations: rows });
    } catch (error) {
        console.error('Fetch donations error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

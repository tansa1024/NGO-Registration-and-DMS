import { NextResponse } from 'next/server';
import { get, run } from '@/lib/db';
import { hashPassword, createSession } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const { name, email, password, adminSecret } = await request.json();

        if (!name || !email || !password) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        // Check if user exists
        const existing = await get('SELECT * FROM users WHERE email = ?', [email]);
        if (existing) {
            return NextResponse.json({ error: 'User already exists' }, { status: 409 });
        }

        const hashedPassword = await hashPassword(password);

        // Simple admin role check
        const role = adminSecret === 'admin123' ? 'admin' : 'user';

        const result = await run(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, role]
        );

        const user = { id: result.id, name, email, role };
        await createSession(user);

        return NextResponse.json({ user });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

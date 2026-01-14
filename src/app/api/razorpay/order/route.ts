import { NextResponse } from 'next/server';
import razorpay from '@/lib/razorpay';
import { getSession } from '@/lib/auth';
import { run } from '@/lib/db';

export async function POST(request: Request) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { amount } = await request.json();

        // Create an order in Razorpay
        // Amount must be in "paise" (multiply by 100)
        const options = {
            amount: Math.round(amount * 100),
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        // Create a local pending record linked to this order
        await run(
            'INSERT INTO donations (user_id, amount, status, payment_id) VALUES (?, ?, ?, ?)',
            [session.id, amount, 'pending', order.id]
        );

        return NextResponse.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            keyId: process.env.RAZORPAY_KEY_ID
        });
    } catch (error) {
        console.error('Razorpay Order Error:', error);
        return NextResponse.json({ error: 'Error creating order' }, { status: 500 });
    }
}

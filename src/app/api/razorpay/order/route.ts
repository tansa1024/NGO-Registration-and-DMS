import { NextResponse } from 'next/server';
import Razorpay from 'razorpay'; // Import the SDK directly
import { getSession } from '@/lib/auth';
import { run } from '@/lib/db';

export async function POST(request: Request) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // SAFE INITIALIZATION: Create the client INSIDE the function
        const razorpayInstance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID!,
            key_secret: process.env.RAZORPAY_KEY_SECRET!,
        });

        const { amount } = await request.json();

        const options = {
            amount: Math.round(amount * 100),
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        // Use the instance created inside the function
        const order = await razorpayInstance.orders.create(options);

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
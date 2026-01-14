import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { run } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json();

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
            .update(body.toString())
            .digest('hex');

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            // Update donation status to success
            await run(
                'UPDATE donations SET status = ?, payment_id = ? WHERE payment_id = ?',
                ['success', razorpay_payment_id, razorpay_order_id]
            );

            return NextResponse.json({ success: true });
        } else {
            // Mark as failed if signature mismatch (optional, or just ignore)
            await run(
                'UPDATE donations SET status = ? WHERE payment_id = ?',
                ['failed', razorpay_order_id]
            );
            return NextResponse.json({ success: false, error: 'Invalid Signature' }, { status: 400 });
        }
    } catch (error) {
        console.error('Verify Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

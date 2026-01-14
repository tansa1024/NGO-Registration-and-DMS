'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Donate() {
    const router = useRouter();
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);

    // Load Razorpay Script
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
    }, []);

    const handleDonate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) return;

        setLoading(true);
        try {
            // 1. Create Order
            const res = await fetch('/api/razorpay/order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: parseFloat(amount) })
            });

            if (res.status === 401) {
                router.push('/login');
                return;
            }

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            // 2. Open Razorpay Checkout
            const options = {
                key: data.keyId,
                amount: data.amount,
                currency: data.currency,
                name: "Unnati Foundation",
                description: "Donation for a cause",
                order_id: data.orderId,
                handler: async function (response: any) {
                    // 3. Verify Payment
                    const verifyRes = await fetch('/api/razorpay/verify', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature
                        })
                    });

                    if (verifyRes.ok) {
                        router.push('/dashboard/user');
                        router.refresh(); // Ensure dashboard updates
                    } else {
                        alert('Payment verification failed');
                    }
                },
                prefill: {
                    name: "Donor Name", // Could fill from session if available
                    email: "donor@example.com",
                    contact: "9999999999"
                },
                theme: {
                    color: "#6d28d9"
                }
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.on('payment.failed', function (response: any) {
                alert("Payment Failed: " + response.error.description);
            });
            rzp.open();
            setLoading(false);

        } catch (e: any) {
            console.error(e);
            alert('Error: ' + e.message);
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center p-4" style={{ minHeight: '80vh' }}>
            <div className="card w-full max-w-md animate-fade-in text-center">
                <h1 className="text-3xl font-bold mb-2">Make a Donation</h1>
                <div className="mb-6 flex justify-center">
                    <span className="badge badge-admin px-3 py-1">Razorpay Secured</span>
                </div>
                <p className="text-[var(--foreground)] opacity-70 mb-8">
                    Your contribution helps us make a real difference.
                </p>

                <form onSubmit={handleDonate} className="flex flex-col gap-6">
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold opacity-50">₹</span>
                        <input
                            type="number"
                            min="1"
                            required
                            className="input pl-10 text-xl font-bold"
                            placeholder="0"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary btn-block py-4 text-lg"
                    >
                        {loading ? 'Processing...' : 'Pay with Razorpay'}
                    </button>
                </form>

                <div className="mt-6 flex flex-wrap gap-2 justify-center">
                    {[100, 500, 1000, 2000].map(val => (
                        <button
                            key={val}
                            type="button"
                            onClick={() => setAmount(val.toString())}
                            className="btn btn-secondary text-sm py-1 px-3"
                        >
                            ₹{val}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

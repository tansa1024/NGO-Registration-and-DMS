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

            const options = {
                key: data.keyId,
                amount: data.amount,
                currency: data.currency,
                name: "Unnati Foundation",
                description: "Donation for a cause",
                order_id: data.orderId,
                handler: async function (response: any) {
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
                        router.refresh();
                    } else {
                        alert('Payment verification failed');
                    }
                },
                prefill: {
                    name: "Donor Name",
                    email: "donor@example.com",
                    contact: "9999999999"
                },
                theme: {
                    color: "#FF9933"
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

    const quickAmounts = [100, 500, 1000, 2000, 5000];

    return (
        <div className="min-h-screen bg-surface py-20 px-4">
            <div className="container max-w-md">
                <div className="card card-elevated animate-fade-in text-center p-8">
                    {/* Header */}
                    <div className="logo-avatar mx-auto mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                    </div>

                    <h1 className="text-2xl font-bold mb-2">Make a Donation</h1>
                    <p className="text-secondary mb-8">
                        Your contribution helps us make a real difference in communities across India.
                    </p>

                    {/* Amount Input */}
                    <form onSubmit={handleDonate}>
                        <div className="relative mb-6">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-secondary">₹</span>
                            <input
                                type="number"
                                min="1"
                                required
                                className="input text-center text-3xl font-bold py-6 pl-12"
                                placeholder="0"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </div>

                        {/* Quick Amount Buttons */}
                        <div className="flex flex-wrap gap-3 justify-center mb-8">
                            {quickAmounts.map(val => (
                                <button
                                    key={val}
                                    type="button"
                                    onClick={() => setAmount(val.toString())}
                                    className={`btn btn-sm ${amount === val.toString() ? 'btn-primary' : 'btn-secondary'}`}
                                >
                                    ₹{val.toLocaleString()}
                                </button>
                            ))}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading || !amount}
                            className="btn btn-primary btn-block btn-lg"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" strokeOpacity="0.25"></circle>
                                        <path d="M12 2a10 10 0 0 1 10 10" strokeOpacity="0.75"></path>
                                    </svg>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                                        <line x1="1" y1="10" x2="23" y2="10"></line>
                                    </svg>
                                    Pay with Razorpay
                                </>
                            )}
                        </button>
                    </form>

                    {/* Security Badge */}
                    <div className="mt-8 flex items-center justify-center gap-2 text-sm text-secondary">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                        </svg>
                        Secured by Razorpay
                    </div>
                </div>
            </div>
        </div>
    );
}

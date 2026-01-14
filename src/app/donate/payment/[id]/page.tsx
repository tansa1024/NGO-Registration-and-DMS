'use client';
import { useRouter, useParams } from 'next/navigation';
import { useState } from 'react';

export default function PaymentGateway() {
    const params = useParams(); // params is not a promise in client component in older next.js, but check next 15. In client component it's hook.
    // In Next 15, useParams returns params object directly (wrapped in proxy).
    const id = params.id;
    const router = useRouter();
    const [processing, setProcessing] = useState(false);

    const handlePayment = async (status: 'success' | 'failed') => {
        setProcessing(true);
        // Simulate processing delay
        await new Promise(r => setTimeout(r, 2000));

        await fetch('/api/donations/confirm', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ donationId: id, status })
        });

        router.push('/dashboard/user');
        router.refresh();
    };

    if (processing) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-zinc-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 mx-auto mb-4"></div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Processing Payment...</h2>
                    <p className="text-gray-600 dark:text-gray-400">Please do not close this window.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-[80vh] items-center justify-center p-4 bg-gray-50 dark:bg-black">
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-2xl rounded-xl p-8 max-w-md w-full animate-fade-in relative overflow-hidden">
                {/* Mock Gateway Header */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                <div className="flex justify-between items-center mb-8">
                    <div className="font-bold text-xl italic text-gray-800 dark:text-gray-200">SecurePay<span className="text-blue-500">.Mock</span></div>
                    <div className="text-xs font-mono bg-gray-100 dark:bg-zinc-800 px-2 py-1 rounded text-gray-500">TEST MODE</div>
                </div>

                <div className="text-center mb-8">
                    <p className="text-gray-500 dark:text-gray-400 uppercase text-xs font-bold tracking-widest mb-1">Total Amount</p>
                    <div className="text-4xl font-extrabold text-gray-900 dark:text-white">
                        CONFIRM
                    </div>
                    <p className="text-xs text-gray-400 mt-2">Ref: {id}</p>
                </div>

                <div className="space-y-4">
                    <div className="p-4 bg-gray-50 dark:bg-zinc-800 rounded border border-gray-100 dark:border-zinc-700">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600 dark:text-gray-400">Card Number</span>
                            <span className="font-mono text-gray-800 dark:text-gray-200">**** **** **** 4242</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Expiry</span>
                            <span className="font-mono text-gray-800 dark:text-gray-200">12/28</span>
                        </div>
                    </div>

                    <button
                        onClick={() => handlePayment('success')}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-blue-500/30 transition-all transform active:scale-95"
                    >
                        Pay Now
                    </button>

                    <button
                        onClick={() => handlePayment('failed')}
                        className="w-full bg-transparent hover:bg-red-50 dark:hover:bg-red-900/10 text-red-500 font-semibold py-3 rounded-lg border border-transparent hover:border-red-200 dark:hover:border-red-800 transition-all"
                    >
                        Cancel Transaction
                    </button>
                </div>

                <div className="mt-8 flex justify-center text-gray-300 dark:text-zinc-600 gap-4">
                    <div className="h-6 w-10 bg-current rounded opacity-20"></div>
                    <div className="h-6 w-10 bg-current rounded opacity-20"></div>
                    <div className="h-6 w-10 bg-current rounded opacity-20"></div>
                </div>
            </div>
        </div>
    );
}

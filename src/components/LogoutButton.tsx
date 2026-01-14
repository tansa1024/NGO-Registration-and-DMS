'use client';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        await fetch('/api/auth/me', { method: 'POST' });
        router.push('/login');
        router.refresh();
    };

    return (
        <button onClick={handleLogout} className="text-[var(--danger)] hover:opacity-80 font-medium">
            Logout
        </button>
    );
}

'use client';
import { useRouter } from 'next/navigation';

export default function LogoutButton({ className }: { className?: string }) {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            // Call logout API to clear the session cookie
            await fetch('/api/auth/me', { method: 'POST' });

            // Replace current history entry with login page (prevents back button issue)
            router.replace('/login');

            // Force refresh to clear any cached data
            router.refresh();
        } catch (error) {
            console.error('Logout error:', error);
            // Still redirect to login even if there's an error
            router.replace('/login');
        }
    };

    return (
        <button
            onClick={handleLogout}
            className={className || "btn btn-secondary btn-sm"}
        >
            Logout
        </button>
    );
}

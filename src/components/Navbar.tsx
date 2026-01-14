import Link from 'next/link';
import { getSession } from '@/lib/auth';
import LogoutButton from './LogoutButton';

export default async function Navbar() {
    const session = await getSession() as any;

    return (
        <nav className="border-b border-[var(--border)] sticky top-0 z-50" style={{ background: 'rgba(23, 23, 23, 0.8)', backdropFilter: 'blur(12px)' }}>
            <div className="container mx-auto px-4 h-16 flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent" style={{ backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent', backgroundImage: 'linear-gradient(to right, #fb923c, #22c55e)' }}>
                    Unnati
                </Link>

                <div className="flex gap-6 items-center">
                    <Link href="/" className="text-[var(--foreground)] hover:text-[var(--primary)] transition-colors">Home</Link>

                    {session ? (
                        <>
                            {session.role === 'admin' ? (
                                <Link href="/dashboard/admin" className="text-[var(--foreground)] hover:text-[var(--primary)] transition-colors">Admin Dashboard</Link>
                            ) : (
                                <Link href="/dashboard/user" className="text-[var(--foreground)] hover:text-[var(--primary)] transition-colors">My Dashboard</Link>
                            )}
                            <LogoutButton />
                        </>
                    ) : (
                        <div className="flex gap-4 items-center">
                            <Link href="/login" className="text-[var(--foreground)] hover:text-[var(--primary)] transition-colors">Login</Link>
                            <Link href="/register" className="btn btn-primary px-6 py-2">Join Us</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

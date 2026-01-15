import Link from 'next/link';
import { getSession } from '@/lib/auth';
import LogoutButton from './LogoutButton';

export default async function Navbar() {
    const session = await getSession() as any;

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link href="/" className="navbar-logo">
                    Unnati
                </Link>

                <div className="navbar-links">
                    <Link href="/" className="navbar-link">Home</Link>

                    {session ? (
                        <>
                            {session.role === 'admin' ? (
                                <Link href="/dashboard/admin" className="navbar-link">Admin Dashboard</Link>
                            ) : (
                                <Link href="/dashboard/user" className="navbar-link">My Dashboard</Link>
                            )}
                            <LogoutButton />
                        </>
                    ) : (
                        <div className="flex gap-3 items-center">
                            <Link href="/login" className="navbar-link">Login</Link>
                            <Link href="/login" className="btn btn-primary btn-sm">Join Us</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

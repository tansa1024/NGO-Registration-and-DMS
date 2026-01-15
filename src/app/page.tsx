import Link from 'next/link';
import { getSession } from '@/lib/auth';

export default async function Home() {
  const session = await getSession() as any;

  return (
    <main className="min-h-screen" style={{ background: 'white' }}>
      {/* Navigation */}
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
                <Link href="/login" className="btn btn-secondary btn-sm">Logout</Link>
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

      {/* Hero Section */}
      <section className="py-24 px-4" style={{ background: 'linear-gradient(135deg, #FFF7ED 0%, #ECFDF5 100%)' }}>
        <div className="container text-center">
          <h1 className="text-5xl font-extrabold mb-6 animate-fade-in hero-gradient">
            Unnati: For a Better Tomorrow
          </h1>
          <p className="text-xl text-secondary max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Empowering communities through transparent giving. Join our mission to create lasting change across India.
          </p>
          <div className="flex gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <Link href="/login" className="btn btn-primary btn-lg">
              Get Started
            </Link>
            <Link href="/login" className="btn btn-secondary btn-lg">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-4">Why Choose Unnati?</h2>
          <p className="text-secondary text-center mb-12 max-w-2xl mx-auto">
            We believe in transparent, impactful giving that makes a real difference in communities across India.
          </p>

          <div className="grid grid-cols-1 md-grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card text-center p-8">
              <div className="logo-avatar mx-auto mb-6" style={{ background: 'linear-gradient(135deg, #FF9933, #FF8000)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Secure Donations</h3>
              <p className="text-secondary">
                Your donations are protected with bank-grade security. Every transaction is encrypted and verified.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card text-center p-8">
              <div className="logo-avatar mx-auto mb-6" style={{ background: 'linear-gradient(135deg, #138808, #0F6E06)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">100% Transparent</h3>
              <p className="text-secondary">
                Track exactly where your money goes. We provide detailed reports on every campaign.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card text-center p-8">
              <div className="logo-avatar mx-auto mb-6" style={{ background: 'linear-gradient(135deg, #3B82F6, #2563EB)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Community First</h3>
              <p className="text-secondary">
                Join thousands of donors making a difference in communities across India every day.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-surface">
        <div className="container">
          <div className="grid grid-cols-1 md-grid-cols-3 gap-8 text-center">
            <div>
              <p className="stat-value hero-gradient">₹10L+</p>
              <p className="text-secondary mt-2">Donations Raised</p>
            </div>
            <div>
              <p className="stat-value hero-gradient">5,000+</p>
              <p className="text-secondary mt-2">Active Donors</p>
            </div>
            <div>
              <p className="stat-value hero-gradient">50+</p>
              <p className="text-secondary mt-2">Campaigns Funded</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4" style={{ background: 'linear-gradient(135deg, #FF9933, #FF8000)' }}>
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4" style={{ color: 'white' }}>Ready to Make a Difference?</h2>
          <p className="text-lg mb-8" style={{ color: 'rgba(255,255,255,0.9)' }}>
            Join Unnati today and be part of the change.
          </p>
          <Link href="/login" className="btn btn-lg" style={{ background: 'white', color: '#FF9933' }}>
            Start Donating
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t">
        <div className="container text-center">
          <p className="text-secondary text-sm">
            © 2026 Unnati Foundation. All rights reserved. Made with ❤️ for India.
          </p>
        </div>
      </footer>
    </main>
  );
}

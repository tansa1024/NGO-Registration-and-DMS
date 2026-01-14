import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      {/* Hero Section */}
      <section className="w-full py-24 px-4 flex flex-col items-center justify-center text-center">
        <h1 className="text-5xl font-extrabold mb-6 animate-fade-in bg-clip-text text-transparent"
          style={{ backgroundImage: 'linear-gradient(to right, #fb923c, #22c55e)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
          Unnati: For a Better Tomorrow
        </h1>
        <p className="text-xl text-[var(--foreground)] opacity-80 max-w-2xl mb-10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          Join our global community of changemakers. Your support brings hope to those who need it most.
          Register today and make an impact.
        </p>
        <div className="flex gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <Link href="/donate" className="btn btn-primary text-lg px-8 py-4 shadow-lg">
            Donate Now
          </Link>
          <Link href="/register" className="btn btn-secondary text-lg px-8 py-4">
            Join the Cause
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-16 px-4 bg-[var(--surface)] border-t border-[var(--border)]">
        <div className="container mx-auto grid md-grid-cols-3 gap-8">
          <div className="card hover:border-[var(--primary)] transition-colors">
            <div className="text-[var(--primary)] mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.28 3.6-1.28 5.1 0 1.25 1.07 1.25 2.76 0 3.83-1.49 1.28-3.6 1.28-5.1 0-1.25-1.07-1.25-2.76 0-3.83 1.49-1.28 3.6-1.28 5.1 0-1.25-1.07-1.25-2.76 0-3.83z"></path><path d="M12 14c1.49-1.28 3.6-1.28 5.1 0 1.25 1.07 1.25 2.76 0 3.83-1.49 1.28-3.6 1.28-5.1 0-1.25-1.07-1.25-2.76 0-3.83 1.49-1.28 3.6-1.28 5.1 0-1.25-1.07-1.25-2.76 0-3.83z"></path><path d="M5 14c1.49-1.28 3.6-1.28 5.1 0 1.25 1.07 1.25 2.76 0 3.83-1.49 1.28-3.6 1.28-5.1 0-1.25-1.07-1.25-2.76 0-3.83 1.49-1.28 3.6-1.28 5.1 0-1.25-1.07-1.25-2.76 0-3.83z"></path><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            </div>
            <h3 className="text-xl mb-2">Secure & Transparent</h3>
            <p className="text-[var(--foreground)] opacity-70">
              We separate registration from payments, ensuring your data is safe and every transaction is verified.
            </p>
          </div>
          <div className="card hover:border-[var(--secondary)] transition-colors">
            <div className="text-[var(--secondary)] mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            </div>
            <h3 className="text-xl mb-2">Track Your Impact</h3>
            <p className="text-[var(--foreground)] opacity-70">
              Monitor your donation history and see exactly how your contributions are making a difference.
            </p>
          </div>
          <div className="card hover:border-[var(--accent)] transition-colors">
            <div className="text-[var(--accent)] mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </div>
            <h3 className="text-xl mb-2">Campaign Driven</h3>
            <p className="text-[var(--foreground)] opacity-70">
              Participate in specific campaigns that resonate with you and our mission.
            </p>
          </div>
        </div>
      </section>

      <footer className="w-full py-8 text-center text-[var(--foreground)] opacity-50 text-sm">
        © 2026 HopeConnect NGO. All rights reserved. Built for secure impact.
      </footer>
    </div>
  );
}

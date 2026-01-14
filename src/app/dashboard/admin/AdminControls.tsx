'use client';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AdminControls() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const tab = searchParams.get('tab') || 'registrations';

    const handleTab = (t: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('tab', t);
        router.push(`?${params.toString()}`);
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const params = new URLSearchParams(searchParams.toString());
        if (e.target.value) params.set('search', e.target.value);
        else params.delete('search');
        router.push(`?${params.toString()}`);
    };

    const handleExport = () => {
        const params = new URLSearchParams(searchParams.toString());
        // Trigger download
        window.open(`/api/admin/export?${params.toString()}`, '_blank');
    };

    return (
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <div className="flex bg-[var(--surface)] p-1 rounded-lg border border-[var(--border)]">
                <button
                    onClick={() => handleTab('registrations')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${tab === 'registrations' ? 'bg-[var(--primary)] text-white' : 'hover:bg-white/5'}`}
                >
                    Registrations
                </button>
                <button
                    onClick={() => handleTab('donations')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${tab === 'donations' ? 'bg-[var(--primary)] text-white' : 'hover:bg-white/5'}`}
                >
                    Donations
                </button>
            </div>

            <div className="flex gap-2 w-full md:w-auto">
                <select
                    className="input w-40"
                    style={{ background: 'var(--surface)', color: 'var(--foreground)' }}
                    defaultValue={searchParams.get('filter') || 'all'}
                    onChange={(e) => {
                        const params = new URLSearchParams(searchParams.toString());
                        params.set('filter', e.target.value);
                        router.push(`?${params.toString()}`);
                    }}
                >
                    <option value="all" className="bg-[var(--surface)] text-[var(--foreground)]">All Time</option>
                    <option value="today" className="bg-[var(--surface)] text-[var(--foreground)]">Today</option>
                    <option value="yesterday" className="bg-[var(--surface)] text-[var(--foreground)]">Yesterday</option>
                    <option value="week" className="bg-[var(--surface)] text-[var(--foreground)]">Last 1 Week</option>
                    <option value="month" className="bg-[var(--surface)] text-[var(--foreground)]">Last 1 Month</option>
                </select>
                <input
                    type="text"
                    placeholder="Search..."
                    className="input max-w-xs"
                    defaultValue={searchParams.get('search') || ''}
                    onChange={handleSearch}
                />
                <button onClick={handleExport} className="btn btn-secondary whitespace-nowrap">
                    Export CSV
                </button>
            </div>
        </div>
    );
}

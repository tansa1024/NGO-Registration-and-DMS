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
        window.open(`/api/admin/export?${params.toString()}`, '_blank');
    };

    return (
        <div className="flex flex-col md-flex-row justify-between items-center gap-4 mb-6">
            {/* Tabs */}
            <div className="tabs">
                <button
                    onClick={() => handleTab('registrations')}
                    className={`tab ${tab === 'registrations' ? 'active' : ''}`}
                >
                    Registrations
                </button>
                <button
                    onClick={() => handleTab('donations')}
                    className={`tab ${tab === 'donations' ? 'active' : ''}`}
                >
                    Donations
                </button>
            </div>

            {/* Filters */}
            <div className="flex gap-3 w-full md-w-auto flex-wrap">
                <select
                    className="select"
                    style={{ width: 'auto', minWidth: '140px' }}
                    defaultValue={searchParams.get('filter') || 'all'}
                    onChange={(e) => {
                        const params = new URLSearchParams(searchParams.toString());
                        params.set('filter', e.target.value);
                        router.push(`?${params.toString()}`);
                    }}
                >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="yesterday">Yesterday</option>
                    <option value="week">Last 7 Days</option>
                    <option value="month">Last 30 Days</option>
                </select>

                <input
                    type="text"
                    placeholder="Search..."
                    className="input"
                    style={{ width: 'auto', minWidth: '200px' }}
                    defaultValue={searchParams.get('search') || ''}
                    onChange={handleSearch}
                />

                <button onClick={handleExport} className="btn btn-secondary whitespace-nowrap">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    Export CSV
                </button>
            </div>
        </div>
    );
}

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import SearchBar from '../components/SearchBar';
import HotelCard from '../components/HotelCard';
import Spinner from '../components/Spinner';
import OffersSection from '../components/OffersSection';   // NEW
import TrustBar from '../components/TrustBar';             // NEW
import { searchHotels } from '../api/hotels';
import type { SearchRequest } from '../types/api';

const today = () => new Date().toISOString().slice(0, 10);
const plusDays = (base: string, n: number) => {
    const d = new Date(base);
    d.setDate(d.getDate() + n);
    return d.toISOString().slice(0, 10);
};

export default function HomePage() {
    const [page, setPage] = useState(0);
    const startDate = today();
    const endDate = plusDays(startDate, 1);

    const req: SearchRequest = { city: '', startDate, endDate, roomsCount: 1, page, size: 18 };
    const query = new URLSearchParams({ startDate, endDate, roomsCount: '1' }).toString();

    const { data, isLoading, error } = useQuery({
        queryKey: ['home-hotels', req],
        queryFn: () => searchHotels(req),
    });

    function goToPage(next: number) {
        setPage(next);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    return (
        <div className="space-y-8">
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-600 px-8 py-16 text-white">
                <div className="relative z-10 max-w-xl">
                    <h1 className="text-4xl font-bold leading-tight md:text-5xl">Find your next stay</h1>
                    <p className="mt-3 text-indigo-100">Real-time availability, dynamic pricing, instant confirmation.</p>
                </div>
                <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-white/10" />
                <div className="pointer-events-none absolute -bottom-24 right-24 h-72 w-72 rounded-full bg-white/10" />
            </section>

            <div className="relative z-10 -mt-12 px-2">
                <SearchBar />
            </div>

            <OffersSection />   {/* NEW */}

            <section className="space-y-5">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-slate-900">All hotels</h2>
                </div>

                {isLoading && <Spinner label="Loading hotels…" />}
                {error && <p className="card text-rose-600">{(error as Error).message}</p>}
                {data && data.content.length === 0 && (
                    <p className="card text-center text-slate-500">No hotels available right now.</p>
                )}

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {data?.content.map((h) => <HotelCard key={h.id} hotel={h} query={query} />)}
                </div>

                {data && data.totalPages > 1 && (
                    <div className="flex items-center justify-center gap-3 pt-2">
                        <button onClick={() => goToPage(Math.max(0, page - 1))} disabled={data.first}
                                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40">
                            Previous
                        </button>
                        <span className="text-sm text-slate-500">Page {data.number + 1} of {data.totalPages}</span>
                        <button onClick={() => goToPage(page + 1)} disabled={data.last}
                                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40">
                            Next
                        </button>
                    </div>
                )}
            </section>

            <TrustBar />   {/* NEW */}
        </div>
    );
}
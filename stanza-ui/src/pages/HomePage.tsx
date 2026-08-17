import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Star } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import HotelCard from '../components/HotelCard';
import Spinner from '../components/Spinner';
import OffersSection from '../components/OffersSection';
import TrustBar from '../components/TrustBar';
import StatBand from '../components/StatBand';
import Reveal from '../components/Reveal';
import { searchHotels } from '../api/hotels';
import type { SearchRequest } from '../types/api';

const today = () => new Date().toISOString().slice(0, 10);
const plusDays = (base: string, n: number) => { const d = new Date(base); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };

export default function HomePage() {
    const [page, setPage] = useState(0);
    const startDate = today();
    const endDate = plusDays(startDate, 1);
    const req: SearchRequest = { city: '', startDate, endDate, roomsCount: 1, page, size: 18 };
    const query = new URLSearchParams({ startDate, endDate, roomsCount: '1' }).toString();

    const { data, isLoading, error } = useQuery({ queryKey: ['home-hotels', req], queryFn: () => searchHotels(req) });
    const goToPage = (n: number) => { setPage(n); window.scrollTo({ top: 0, behavior: 'smooth' }); };

    return (
        <div className="space-y-12">
            {/* HERO */}
            <section className="relative -mx-4 -mt-8 overflow-hidden rounded-b-[2.5rem]">
                <img
                    src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920&q=80"
                    alt="" className="absolute inset-0 -z-20 h-full w-full object-cover" />
                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-950/85 via-violet-900/70 to-indigo-900/55" />
                <div className="animate-float pointer-events-none absolute -left-10 top-10 -z-10 h-56 w-56 rounded-full bg-fuchsia-400/20 blur-3xl" />
                <div className="animate-float-slow pointer-events-none absolute bottom-10 right-0 -z-10 h-72 w-72 rounded-full bg-indigo-400/20 blur-3xl" />

                <div className="px-6 pb-40 pt-24 text-center text-white sm:pt-32">
                    <span className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur">
                        <Star className="h-4 w-4 fill-amber-300 text-amber-300" /> Trusted by 25,000+ travellers
                    </span>
                    <h1 className="animate-fade-up mx-auto mt-6 max-w-4xl text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl" style={{ animationDelay: '80ms' }}>
                        Find your next{' '}
                        <span className="bg-gradient-to-r from-amber-300 via-orange-200 to-white bg-clip-text text-transparent">stay</span>
                    </h1>
                    <p className="animate-fade-up mx-auto mt-5 max-w-xl text-lg text-indigo-100/90" style={{ animationDelay: '160ms' }}>
                        Real-time availability, dynamic pricing, and instant confirmation — booking made effortless.
                    </p>
                </div>
            </section>

            {/* SEARCH — floating over the hero */}
            <div className="relative z-10 -mt-28 px-2">
                <Reveal>
                    <div className="rounded-2xl shadow-2xl shadow-indigo-900/25">
                        <SearchBar />
                    </div>
                </Reveal>
            </div>

            <Reveal><StatBand /></Reveal>
            <Reveal><OffersSection /></Reveal>

            <section className="space-y-5">
                <Reveal><h2 className="text-2xl font-bold text-slate-900">Stay somewhere lovely</h2></Reveal>
                {isLoading && <Spinner label="Loading hotels…" />}
                {error && <p className="card text-rose-600">{(error as Error).message}</p>}
                {data && data.content.length === 0 && <p className="card text-center text-slate-500">No hotels available right now.</p>}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {data?.content.map((h, i) => (
                        <Reveal key={h.id} delay={(i % 3) * 80}><HotelCard hotel={h} query={query} /></Reveal>
                    ))}
                </div>
                {data && data.totalPages > 1 && (
                    <div className="flex items-center justify-center gap-3 pt-2">
                        <button onClick={() => goToPage(Math.max(0, page - 1))} disabled={data.first}
                                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-40">Previous</button>
                        <span className="text-sm text-slate-500">Page {data.number + 1} of {data.totalPages}</span>
                        <button onClick={() => goToPage(page + 1)} disabled={data.last}
                                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-40">Next</button>
                    </div>
                )}
            </section>

            <Reveal><TrustBar /></Reveal>
        </div>
    );
}
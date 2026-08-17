import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { searchHotels } from '../api/hotels';
import HotelCard from '../components/HotelCard';
import SearchBar from '../components/SearchBar';
import Spinner from '../components/Spinner';
import type { SearchRequest } from '../types/api';

export default function SearchResultsPage() {
    const [params] = useSearchParams();
    const [page, setPage] = useState(0);
    const [name, setName] = useState('');
    const query = params.toString();

    useEffect(() => { setPage(0); }, [query, name]);

    const city = params.get('city') ?? '';
    const req: SearchRequest = {
        city,
        name,
        startDate: params.get('startDate') ?? '',
        endDate: params.get('endDate') ?? '',
        roomsCount: Number(params.get('roomsCount') ?? 1),
        page,
        size: 18,
    };

    const { data, isLoading, error } = useQuery({
        queryKey: ['search', req],
        queryFn: () => searchHotels(req),
        enabled: !!req.startDate && !!req.endDate,
    });

    return (
        <div className="space-y-6">
            <SearchBar initial={params} />

            <div className="relative max-w-md">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={city ? `Search hotels in ${city} by name…` : 'Search hotels by name…'}
                    className="input pl-9"
                />
            </div>

            <h1 className="text-xl font-semibold text-slate-900">{city ? `Hotels in ${city}` : 'All hotels'}</h1>

            {isLoading && <Spinner label="Searching hotels…" />}
            {error && <p className="card text-rose-600">{(error as Error).message}</p>}
            {data && data.content.length === 0 && (
                <p className="card text-center text-slate-500">No hotels match. Try a different name or dates.</p>
            )}

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {data?.content.map((h) => <HotelCard key={h.id} hotel={h} query={query} />)}
            </div>

            {data && data.totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 pt-2">
                    <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={data.first}
                            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40">Previous</button>
                    <span className="text-sm text-slate-500">Page {data.number + 1} of {data.totalPages}</span>
                    <button onClick={() => setPage((p) => p + 1)} disabled={data.last}
                            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40">Next</button>
                </div>
            )}
        </div>
    );
}
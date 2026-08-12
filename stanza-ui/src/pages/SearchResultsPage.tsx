import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { searchHotels } from '../api/hotels';
import HotelCard from '../components/HotelCard';
import SearchBar from '../components/SearchBar';
import Spinner from '../components/Spinner';
import type { SearchRequest } from '../types/api';

export default function SearchResultsPage() {
    const [params] = useSearchParams();
    const req: SearchRequest = {
        city: params.get('city') ?? '',
        startDate: params.get('startDate') ?? '',
        endDate: params.get('endDate') ?? '',
        roomsCount: Number(params.get('roomsCount') ?? 1),
        page: 0,
        size: 20,
    };
    const query = params.toString();

    const { data, isLoading, error } = useQuery({
        queryKey: ['search', req],
        queryFn: () => searchHotels(req),
        enabled: !!req.city && !!req.startDate && !!req.endDate,
    });

    return (
        <div className="space-y-6">
            <SearchBar initial={params} />
            {isLoading && <Spinner label="Searching hotels…" />}
            {error && <p className="card text-rose-600">{(error as Error).message}</p>}
            {data && data.content.length === 0 && (
                <p className="card text-center text-slate-500">No hotels available for these dates. Try another city or date range.</p>
            )}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {data?.content.map((h) => <HotelCard key={h.id} hotel={h} query={query} />)}
            </div>
        </div>
    );
}
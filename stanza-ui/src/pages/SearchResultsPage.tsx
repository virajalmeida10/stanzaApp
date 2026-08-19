import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
    MapPin, Star, Search, SlidersHorizontal, Wifi, Waves, Dumbbell, Car, Utensils,
    Wine, Sparkles, PawPrint, Plane, ConciergeBell, Briefcase, Snowflake, Coffee, Umbrella, Users, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { searchHotels } from '../api/hotels';
import SearchBar from '../components/SearchBar';
import { ratingFor, reviewsFor } from '../lib/hotelMeta';
import type { HotelPriceResponse, SearchRequest } from '../types/api';

/* ------------------------------------------------------------------ */
/*  Deterministic, self-contained hotel "meta" (rating/reviews/stars)  */
/*  so results look like a real booking site without extra deps.       */
/* ------------------------------------------------------------------ */

function starsFor(h: HotelPriceResponse): number {
    if (h.price >= 190) return 5;
    if (h.price >= 110) return 4;
    return 3;
}
function ratingLabel(r: number): string {
    if (r >= 4.5) return 'Excellent';
    if (r >= 4.0) return 'Very Good';
    return 'Good';
}

const AMENITY_ICON: Record<string, ReactNode> = {
    'Free WiFi': <Wifi className="h-3.5 w-3.5" />,
    'Swimming Pool': <Waves className="h-3.5 w-3.5" />,
    'Fitness Center': <Dumbbell className="h-3.5 w-3.5" />,
    'Free Parking': <Car className="h-3.5 w-3.5" />,
    Restaurant: <Utensils className="h-3.5 w-3.5" />,
    Bar: <Wine className="h-3.5 w-3.5" />,
    Spa: <Sparkles className="h-3.5 w-3.5" />,
    'Pet Friendly': <PawPrint className="h-3.5 w-3.5" />,
    'Airport Shuttle': <Plane className="h-3.5 w-3.5" />,
    'Room Service': <ConciergeBell className="h-3.5 w-3.5" />,
    'Business Center': <Briefcase className="h-3.5 w-3.5" />,
    'Air Conditioning': <Snowflake className="h-3.5 w-3.5" />,
    'Breakfast Included': <Coffee className="h-3.5 w-3.5" />,
    'Beach Access': <Umbrella className="h-3.5 w-3.5" />,
    'Family Rooms': <Users className="h-3.5 w-3.5" />,
};

const FALLBACK = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=60';
const PER_PAGE = 8;
const today = () => new Date().toISOString().slice(0, 10);
const plusDays = (base: string, n: number) => {
    const d = new Date(base);
    d.setDate(d.getDate() + n);
    return d.toISOString().slice(0, 10);
};

type SortKey = 'recommended' | 'priceLow' | 'priceHigh' | 'rating';

export default function SearchResultsPage() {
    const [params] = useSearchParams();
    const navigate = useNavigate();

    const city = params.get('city') ?? '';
    const startDate = params.get('startDate') || today();
    const endDate = params.get('endDate') || plusDays(startDate, 1);
    const roomsCount = Number(params.get('roomsCount') ?? 1);
    const detailQuery = new URLSearchParams({ startDate, endDate, roomsCount: String(roomsCount) }).toString();

    const req: SearchRequest = { city, startDate, endDate, roomsCount, page: 0, size: 60 };
    const { data, isLoading, error } = useQuery({
        queryKey: ['search', req],
        queryFn: () => searchHotels(req),
        enabled: !!startDate && !!endDate,
    });

    // ---- filter state ----
    const [nameQuery, setNameQuery] = useState('');
    const [stars, setStars] = useState<number[]>([]);
    const [minRating, setMinRating] = useState(0);
    const [maxPrice, setMaxPrice] = useState<number | null>(null);
    const [amenityFilter, setAmenityFilter] = useState<string[]>([]);
    const [sort, setSort] = useState<SortKey>('recommended');
    const [page, setPage] = useState(0);
    const [showFilters, setShowFilters] = useState(false);

    const enriched = useMemo(
        () => (data?.content ?? []).map((h) => ({
            ...h,
            _rating: ratingFor(h.id),
            _reviews: reviewsFor(h.id),
            _stars: starsFor(h),
        })),
        [data],
    );

    // facet counts
    const starCounts = useMemo(() => {
        const c: Record<number, number> = { 3: 0, 4: 0, 5: 0 };
        enriched.forEach((h) => { c[h._stars] = (c[h._stars] ?? 0) + 1; });
        return c;
    }, [enriched]);

    const amenityFacets = useMemo(() => {
        const c: Record<string, number> = {};
        enriched.forEach((h) => (h.amenities ?? []).forEach((a) => { c[a] = (c[a] ?? 0) + 1; }));
        return Object.entries(c).sort((a, b) => b[1] - a[1]);
    }, [enriched]);

    const priceCap = useMemo(
        () => (enriched.length ? Math.ceil(Math.max(...enriched.map((h) => h.price)) / 10) * 10 : 500),
        [enriched],
    );

    // ---- apply filters + sort ----
    const filtered = useMemo(() => {
        let list = enriched.filter((h) => {
            if (nameQuery && !h.name.toLowerCase().includes(nameQuery.toLowerCase())) return false;
            if (stars.length && !stars.includes(h._stars)) return false;
            if (minRating && h._rating < minRating) return false;
            if (maxPrice != null && h.price > maxPrice) return false;
            if (amenityFilter.length && !amenityFilter.every((a) => (h.amenities ?? []).includes(a))) return false;
            return true;
        });
        list = [...list];
        if (sort === 'priceLow') list.sort((a, b) => a.price - b.price);
        else if (sort === 'priceHigh') list.sort((a, b) => b.price - a.price);
        else if (sort === 'rating') list.sort((a, b) => b._rating - a._rating);
        return list;
    }, [enriched, nameQuery, stars, minRating, maxPrice, amenityFilter, sort]);

    useEffect(() => { setPage(0); }, [nameQuery, stars, minRating, maxPrice, amenityFilter, sort]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
    const pageItems = filtered.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

    function toggle<T>(arr: T[], v: T): T[] {
        return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
    }
    function clearAll() {
        setNameQuery(''); setStars([]); setMinRating(0); setMaxPrice(null); setAmenityFilter([]);
    }

    return (
        <div className="space-y-5">
            <SearchBar initial={params} />

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-slate-900">
                        {city ? `Hotels in ${city}` : 'All hotels'}
                    </h1>
                    <p className="text-sm text-slate-500">
                        {isLoading ? 'Searching…' : `${filtered.length} propert${filtered.length === 1 ? 'y' : 'ies'} · ${startDate} → ${endDate}`}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowFilters((s) => !s)}
                        className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 lg:hidden"
                    >
                        <SlidersHorizontal className="h-4 w-4" /> Filters
                    </button>
                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value as SortKey)}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none focus:border-indigo-400"
                    >
                        <option value="recommended">Recommended</option>
                        <option value="priceLow">Price: Low to High</option>
                        <option value="priceHigh">Price: High to Low</option>
                        <option value="rating">Guest rating</option>
                    </select>
                </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
                {/* ---------------- Filters sidebar ---------------- */}
                <aside className={`${showFilters ? 'block' : 'hidden'} space-y-5 lg:block`}>
                    <div className="sticky top-4 space-y-5 rounded-2xl border border-slate-200 bg-white p-4">
                        <div className="flex items-center justify-between">
                            <h2 className="flex items-center gap-2 font-semibold text-slate-900">
                                <SlidersHorizontal className="h-4 w-4 text-indigo-600" /> Filters
                            </h2>
                            <button onClick={clearAll} className="text-xs font-medium text-indigo-600 hover:underline">Clear all</button>
                        </div>

                        {/* Search by name */}
                        <div>
                            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">Hotel name</label>
                            <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-2.5">
                                <Search className="h-4 w-4 text-slate-400" />
                                <input
                                    value={nameQuery}
                                    onChange={(e) => setNameQuery(e.target.value)}
                                    placeholder="Search by name"
                                    className="w-full py-2 text-sm outline-none"
                                />
                            </div>
                        </div>

                        {/* Star category */}
                        <FilterGroup title="Star category">
                            {[5, 4, 3].map((s) => (
                                <Check
                                    key={s}
                                    checked={stars.includes(s)}
                                    onChange={() => setStars((a) => toggle(a, s))}
                                    label={<span className="flex items-center gap-1">{Array.from({ length: s }).map((_, i) => <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />)}</span>}
                                    count={starCounts[s] ?? 0}
                                />
                            ))}
                        </FilterGroup>

                        {/* User rating */}
                        <FilterGroup title="Guest rating">
                            {[4.5, 4.0, 3.5].map((r) => (
                                <Check
                                    key={r}
                                    checked={minRating === r}
                                    onChange={() => setMinRating((cur) => (cur === r ? 0 : r))}
                                    label={<span>{r.toFixed(1)}+ · {ratingLabel(r)}</span>}
                                />
                            ))}
                        </FilterGroup>

                        {/* Price */}
                        <FilterGroup title={`Max price ${maxPrice != null ? `· $${maxPrice}` : ''}`}>
                            <input
                                type="range"
                                min={0}
                                max={priceCap}
                                step={10}
                                value={maxPrice ?? priceCap}
                                onChange={(e) => setMaxPrice(Number(e.target.value) >= priceCap ? null : Number(e.target.value))}
                                className="w-full accent-indigo-600"
                            />
                            <div className="flex justify-between text-xs text-slate-400"><span>$0</span><span>${priceCap}+</span></div>
                        </FilterGroup>

                        {/* Amenities */}
                        {amenityFacets.length > 0 && (
                            <FilterGroup title="Amenities">
                                <div className="max-h-52 space-y-1 overflow-y-auto pr-1">
                                    {amenityFacets.map(([a, n]) => (
                                        <Check
                                            key={a}
                                            checked={amenityFilter.includes(a)}
                                            onChange={() => setAmenityFilter((cur) => toggle(cur, a))}
                                            label={<span className="flex items-center gap-1.5">{AMENITY_ICON[a] ?? null}{a}</span>}
                                            count={n}
                                        />
                                    ))}
                                </div>
                            </FilterGroup>
                        )}
                    </div>
                </aside>

                {/* ---------------- Results ---------------- */}
                <div className="space-y-4">
                    {isLoading && (
                        <div className="space-y-4">
                            {[0, 1, 2].map((i) => (
                                <div key={i} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-3">
                                    <div className="h-40 w-56 animate-pulse rounded-xl bg-slate-100" />
                                    <div className="flex-1 space-y-3 py-2">
                                        <div className="h-5 w-2/3 animate-pulse rounded bg-slate-100" />
                                        <div className="h-4 w-1/3 animate-pulse rounded bg-slate-100" />
                                        <div className="h-4 w-1/2 animate-pulse rounded bg-slate-100" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {error && <p className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-600">{(error as Error).message}</p>}

                    {!isLoading && filtered.length === 0 && (
                        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">
                            No hotels match your filters. Try widening your price or removing some amenities.
                        </div>
                    )}

                    {pageItems.map((h, idx) => (
                        <HotelRow key={h.id} hotel={h} rank={page * PER_PAGE + idx + 1} onOpen={() => navigate(`/hotels/${h.id}?${detailQuery}`)} />
                    ))}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 pt-2">
                            <button
                                disabled={page === 0}
                                onClick={() => setPage((p) => Math.max(0, p - 1))}
                                className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm disabled:opacity-40"
                            >
                                <ChevronLeft className="h-4 w-4" /> Prev
                            </button>
                            <span className="text-sm text-slate-500">Page {page + 1} of {totalPages}</span>
                            <button
                                disabled={page >= totalPages - 1}
                                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                                className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm disabled:opacity-40"
                            >
                                Next <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ---------------- pieces ---------------- */

type Enriched = HotelPriceResponse & { _rating: number; _reviews: number; _stars: number };

function HotelRow({ hotel, rank, onOpen }: { hotel: Enriched; rank: number; onOpen: () => void }) {
    const deal = hotel.id % 3 === 0;
    return (
        <div className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md sm:flex-row">
            {/* Image */}
            <div className="relative sm:w-64 sm:flex-shrink-0">
                <img src={hotel.photos?.[0] ?? FALLBACK} alt={hotel.name} className="h-48 w-full object-cover sm:h-full" />
                <span className="absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur">
                    {(hotel.photos?.length ?? 1) * 137} Photos
                </span>
                {deal && (
                    <span className="absolute left-2 top-2 rounded-md bg-gradient-to-r from-rose-500 to-orange-500 px-2 py-0.5 text-[11px] font-bold text-white shadow">
                        Last-minute deal
                    </span>
                )}
            </div>

            {/* Middle */}
            <div className="flex flex-1 flex-col gap-2 p-4">
                <div>
                    <h3 className="flex flex-wrap items-center gap-2 text-lg font-bold text-slate-900">
                        <span className="text-slate-400">{rank}.</span> {hotel.name}
                        <span className="flex items-center">
                            {Array.from({ length: hotel._stars }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />)}
                        </span>
                    </h3>
                    <p className="mt-0.5 flex items-center gap-1 text-sm font-medium text-indigo-600"><MapPin className="h-4 w-4" /> {hotel.city}</p>
                </div>

                <div className="flex flex-wrap gap-1.5">
                    {(hotel.amenities ?? []).slice(0, 4).map((a) => (
                        <span key={a} className="flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                            {AMENITY_ICON[a] ?? null}{a}
                        </span>
                    ))}
                    {(hotel.amenities?.length ?? 0) > 4 && (
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-500">+{(hotel.amenities!.length) - 4} more</span>
                    )}
                </div>

                <p className="mt-auto flex items-center gap-1 text-xs font-medium text-emerald-600">
                    <Sparkles className="h-3.5 w-3.5" /> Top selling · booked {50 + (hotel.id % 120)} times this month
                </p>
            </div>

            {/* Right rail: rating + price */}
            <div className="flex flex-row items-center justify-between gap-3 border-t border-slate-100 p-4 sm:w-52 sm:flex-col sm:items-end sm:justify-between sm:border-l sm:border-t-0 sm:text-right">
                <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                    <div className="flex items-center gap-1.5">
                        <span className="text-right text-xs font-semibold text-slate-700 sm:order-1">{ratingLabel(hotel._rating)}</span>
                        <span className="flex h-7 min-w-[2.2rem] items-center justify-center rounded-md bg-indigo-600 px-1.5 text-sm font-bold text-white">{hotel._rating.toFixed(1)}</span>
                    </div>
                    <span className="text-[11px] text-slate-400">({hotel._reviews.toLocaleString()} ratings)</span>
                </div>

                <div className="sm:mt-auto">
                    <p className="text-2xl font-extrabold text-slate-900">${Math.round(hotel.price)}</p>
                    <p className="text-[11px] text-slate-400">+ ${Math.round(hotel.price * 0.12)} taxes · per night</p>
                    <button
                        onClick={onOpen}
                        className="mt-2 w-full rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow transition hover:shadow-lg"
                    >
                        View deal
                    </button>
                </div>
            </div>
        </div>
    );
}

function FilterGroup({ title, children }: { title: string; children: ReactNode }) {
    return (
        <div className="border-t border-slate-100 pt-4 first:border-t-0 first:pt-0">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">{title}</p>
            <div className="space-y-1.5">{children}</div>
        </div>
    );
}

function Check({ checked, onChange, label, count }: { checked: boolean; onChange: () => void; label: ReactNode; count?: number }) {
    return (
        <label className="flex cursor-pointer items-center justify-between rounded-md px-1 py-1 text-sm text-slate-700 hover:bg-slate-50">
            <span className="flex items-center gap-2">
                <input type="checkbox" checked={checked} onChange={onChange} className="h-4 w-4 rounded border-slate-300 accent-indigo-600" />
                {label}
            </span>
            {count != null && <span className="text-xs text-slate-400">{count}</span>}
        </label>
    );
}
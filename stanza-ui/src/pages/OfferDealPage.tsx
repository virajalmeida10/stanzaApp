import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MapPin, ArrowLeft } from 'lucide-react';
import { getOffers } from '../api/offers';
import { searchHotels } from '../api/hotels';
import Spinner from '../components/Spinner';
import type { SearchRequest } from '../types/api';

const FALLBACK = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=60';
const PAGE_SIZE = 18;
const today = () => new Date().toISOString().slice(0, 10);
const plusDays = (base: string, n: number) => { const d = new Date(base); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };

export default function OfferDealPage() {
    const { code } = useParams();
    const [pageNum, setPageNum] = useState(0);
    useEffect(() => { setPageNum(0); }, [code]);

    const startDate = today();
    const endDate = plusDays(startDate, 1);

    const { data: offers } = useQuery({ queryKey: ['offers'], queryFn: getOffers });
    const offer = offers?.find((o) => o.code === code);

    // fetch all hotels once, then filter to the offer's cities client-side
    const req: SearchRequest = { city: '', startDate, endDate, roomsCount: 1, page: 0, size: 500 };
    const { data: page, isLoading } = useQuery({
        queryKey: ['offer-hotels', req],
        queryFn: () => searchHotels(req),
        enabled: !!offer,
    });

    const hotels = useMemo(() => {
        if (!page || !offer) return [];
        return offer.cities.length === 0 ? page.content : page.content.filter((h) => offer.cities.includes(h.city));
    }, [page, offer]);

    if (offers && !offer) return <p className="card text-rose-600">Offer not found.</p>;
    if (!offer || isLoading) return <Spinner label="Loading offer…" />;

    const query = new URLSearchParams({ startDate, endDate, roomsCount: '1', offer: offer.code }).toString();
    const factor = (100 - offer.discountPercent) / 100;
    const totalPages = Math.ceil(hotels.length / PAGE_SIZE);
    const shown = hotels.slice(pageNum * PAGE_SIZE, pageNum * PAGE_SIZE + PAGE_SIZE);

    return (
        <div className="space-y-6">
            <Link to="/" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700">
                <ArrowLeft className="h-4 w-4" /> Back to home
            </Link>

            <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-rose-500 to-orange-500 px-8 py-10 text-white">
                <p className="text-sm font-semibold uppercase tracking-wide text-white/80">Limited-time offer</p>
                <h1 className="mt-1 text-3xl font-bold md:text-4xl">{offer.title}</h1>
                <p className="mt-2 text-white/90">{offer.description}</p>
                <span className="mt-4 inline-block rounded-full bg-white/20 px-4 py-1 text-sm font-semibold">
                    {offer.discountPercent}% OFF — applied automatically
                </span>
            </section>

            <h2 className="text-xl font-semibold text-slate-900">{hotels.length} hotel(s) in this deal</h2>
            {hotels.length === 0 && <p className="card text-slate-500">No hotels available for this offer right now.</p>}

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {shown.map((h) => {
                    const discounted = Math.round(h.price * factor);
                    return (
                        <Link key={h.id} to={`/hotels/${h.id}?${query}`}
                              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                            <div className="relative">
                                <img src={h.photos?.[0] ?? FALLBACK} alt={h.name} className="h-44 w-full object-cover transition group-hover:scale-105" />
                                <span className="absolute left-3 top-3 rounded-full bg-rose-500 px-2.5 py-1 text-xs font-bold text-white shadow">
                                    {offer.discountPercent}% OFF
                                </span>
                            </div>
                            <div className="space-y-2 p-4">
                                <h3 className="font-semibold text-slate-900">{h.name}</h3>
                                <p className="flex items-center gap-1 text-sm text-slate-500"><MapPin className="h-4 w-4" /> {h.city}</p>
                                <p className="pt-1">
                                    <span className="text-sm text-slate-400 line-through">${Math.round(h.price)}</span>{' '}
                                    <span className="text-lg font-bold text-rose-600">${discounted}</span>
                                    <span className="text-sm font-normal text-slate-400"> / night</span>
                                </p>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 pt-2">
                    <button onClick={() => setPageNum((p) => Math.max(0, p - 1))} disabled={pageNum === 0}
                            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40">Previous</button>
                    <span className="text-sm text-slate-500">Page {pageNum + 1} of {totalPages}</span>
                    <button onClick={() => setPageNum((p) => Math.min(totalPages - 1, p + 1))} disabled={pageNum >= totalPages - 1}
                            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40">Next</button>
                </div>
            )}
        </div>
    );
}
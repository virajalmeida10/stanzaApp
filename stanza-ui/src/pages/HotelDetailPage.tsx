import { useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Star, Users, BedDouble, ArrowLeft, ShieldCheck, Check, BadgeCheck } from 'lucide-react';
import { getHotelInfo } from '../api/hotels';
import { getOffers } from '../api/offers';
import Spinner from '../components/Spinner';
import Reveal from '../components/Reveal';
import { useAuth } from '../auth/AuthContext';
import { ratingFor, reviewsFor, amenitiesFor } from '../lib/hotelMeta';
import type { HotelInfoRequest } from '../types/api';

const FALLBACK = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=70';

function sleeps(type: string): number {
    const t = type.toLowerCase();
    if (t.includes('executive')) return 5;
    if (t.includes('suite')) return 4;
    if (t.includes('deluxe')) return 3;
    return 2;
}
const INTROS = [
    (n: string, c: string) => `Tucked into the heart of ${c}, ${n} pairs modern comfort with an unbeatable location.`,
    (n: string, c: string) => `${n} is a stylish retreat in ${c}, ideal for both business trips and weekend escapes.`,
    (n: string, c: string) => `Wake up to the best of ${c} at ${n}, where thoughtful design meets warm hospitality.`,
    (n: string, c: string) => `A local favourite in ${c}, ${n} offers spacious rooms and standout service.`,
];

export default function HotelDetailPage() {
    const { hotelId } = useParams();
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [guests, setGuests] = useState(2);
    const [mainImg, setMainImg] = useState(0);
    const offerCode = params.get('offer') ?? '';

    const req: HotelInfoRequest = {
        startDate: params.get('startDate') ?? '',
        endDate: params.get('endDate') ?? '',
        roomsCount: Number(params.get('roomsCount') ?? 1),
    };

    const { data, isLoading, error } = useQuery({
        queryKey: ['hotel', hotelId, req],
        queryFn: () => getHotelInfo(Number(hotelId), req),
        enabled: !!req.startDate && !!req.endDate,
    });
    const { data: offers } = useQuery({ queryKey: ['offers'], queryFn: getOffers, enabled: !!offerCode });
    const offer = offers?.find((o) => o.code === offerCode);

    function book(roomId: number) {
        const q = new URLSearchParams({
            hotelId: String(hotelId), roomId: String(roomId),
            checkInDate: req.startDate, checkOutDate: req.endDate,
            roomsCount: String(req.roomsCount), guestCount: String(guests),
        });
        if (offerCode) q.set('offerCode', offerCode);
        const qs = q.toString();
        navigate(isAuthenticated ? `/book?${qs}` : `/login?next=${encodeURIComponent(`/book?${qs}`)}`);
    }

    if (isLoading) return <Spinner label="Loading hotel…" />;
    if (error) return <p className="card text-rose-600">{(error as Error).message}</p>;
    if (!data) return null;

    const { hotel, rooms } = data;
    const id = Number(hotelId);
    const rating = ratingFor(id);
    const reviews = reviewsFor(id);
    const amenities = amenitiesFor(id, 8);
    const description = INTROS[id % INTROS.length](hotel.name, hotel.city);
    const offerApplies = !!offer && (offer.cities.length === 0 || offer.cities.includes(hotel.city));
    const factor = offerApplies ? (100 - offer!.discountPercent) / 100 : 1;

    const gallery = Array.from(new Set([...(hotel.photos ?? []), ...rooms.flatMap((r) => r.photos ?? [])])).slice(0, 5);
    if (gallery.length === 0) gallery.push(FALLBACK);
    const main = gallery[Math.min(mainImg, gallery.length - 1)];
    const verdict = rating >= 4.5 ? 'Exceptional' : rating >= 4.2 ? 'Excellent' : rating >= 3.9 ? 'Very good' : 'Good';

    return (
        <div className="space-y-8">
            <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700">
                <ArrowLeft className="h-4 w-4" /> Back to results
            </button>

            {/* GALLERY */}
            <div className="grid gap-3 sm:grid-cols-4">
                <div className="relative overflow-hidden rounded-3xl sm:col-span-3">
                    <img src={main} alt={hotel.name} className="h-72 w-full object-cover sm:h-[420px]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                    <div className="absolute bottom-5 left-6 text-white">
                        <h1 className="text-3xl font-extrabold sm:text-4xl">{hotel.name}</h1>
                        <p className="mt-1 flex items-center gap-1 text-white/90"><MapPin className="h-4 w-4" /> {hotel.city}</p>
                    </div>
                    {offerApplies && (
                        <span className="absolute right-5 top-5 rounded-full bg-rose-500 px-3 py-1 text-sm font-bold text-white shadow">
                            {offer!.discountPercent}% OFF
                        </span>
                    )}
                </div>
                <div className="grid grid-cols-4 gap-3 sm:grid-cols-1">
                    {gallery.slice(0, 4).map((src, i) => (
                        <button key={src} onClick={() => setMainImg(i)}
                                className={`overflow-hidden rounded-2xl border-2 transition ${i === mainImg ? 'border-indigo-500' : 'border-transparent'}`}>
                            <img src={src} alt="" className="h-20 w-full object-cover transition hover:scale-105 sm:h-[99px]" />
                        </button>
                    ))}
                </div>
            </div>

            {/* RATING */}
            <div className="flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className={`h-4 w-4 ${i <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                    ))}
                </span>
                <span className="font-bold text-slate-900">{rating.toFixed(1)}</span>
                <span className="text-sm text-slate-500">({reviews.toLocaleString()} reviews)</span>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">{verdict}</span>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1.7fr_1fr]">
                <div className="space-y-8">
                    <Reveal>
                        <section>
                            <h2 className="text-xl font-bold text-slate-900">About this stay</h2>
                            <p className="mt-2 leading-relaxed text-slate-600">{description}</p>
                            <p className="mt-2 leading-relaxed text-slate-600">
                                Guests enjoy easy access to {hotel.city}'s top attractions, dining and transit — plus attentive service and spotless, well-appointed rooms.
                            </p>
                        </section>
                    </Reveal>

                    <Reveal>
                        <section>
                            <h2 className="text-xl font-bold text-slate-900">What this place offers</h2>
                            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                                {amenities.map(({ label, Icon }) => (
                                    <div key={label} className="flex items-center gap-2 rounded-xl border border-slate-100 px-3 py-2.5 text-sm text-slate-700">
                                        <Icon className="h-4 w-4 flex-shrink-0 text-indigo-500" /> {label}
                                    </div>
                                ))}
                            </div>
                        </section>
                    </Reveal>

                    <section className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-900">Choose your room</h2>
                            <label className="flex items-center gap-2 text-sm text-slate-600">
                                Guests
                                <select value={guests} onChange={(e) => setGuests(Number(e.target.value))} className="input w-20">
                                    {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n}</option>)}
                                </select>
                            </label>
                        </div>
                        {guests > 2 && <p className="text-xs text-amber-600">Guests beyond 2 add 30% of the room price per extra guest.</p>}
                        {rooms.length === 0 && <p className="card text-slate-500">No rooms available for these dates.</p>}

                        {rooms.map((room) => {
                            const discounted = Math.round(room.price * factor);
                            const isSuite = room.type.toLowerCase().includes('suite');
                            return (
                                <Reveal key={room.id}>
                                    <div className="flex flex-col gap-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md sm:flex-row">
                                        <img src={room.photos?.[0] ?? FALLBACK} alt={room.type} className="h-40 w-full object-cover sm:h-auto sm:w-48" />
                                        <div className="flex flex-1 flex-col gap-2 p-4">
                                            <h3 className="font-semibold text-slate-900">{room.type}</h3>
                                            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
                                                <span className="flex items-center gap-1"><Users className="h-4 w-4" /> Sleeps {sleeps(room.type)}</span>
                                                <span className="flex items-center gap-1"><BedDouble className="h-4 w-4" /> {isSuite ? 'King bed' : 'Queen bed'}</span>
                                            </p>
                                            <div className="flex flex-wrap gap-1">
                                                {room.amenities?.slice(0, 4).map((a) => (
                                                    <span key={a} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{a}</span>
                                                ))}
                                            </div>
                                            <div className="mt-auto flex items-end justify-between pt-2">
                                                <div>
                                                    {offerApplies ? (
                                                        <p><span className="text-sm text-slate-400 line-through">${Math.round(room.price)}</span>{' '}
                                                            <span className="text-2xl font-bold text-rose-600">${discounted}</span></p>
                                                    ) : (
                                                        <p className="gradient-text text-2xl font-bold">${Math.round(room.price)}</p>
                                                    )}
                                                    <p className="text-xs text-slate-400">avg / night</p>
                                                </div>
                                                <button onClick={() => book(room.id)} className="btn-primary">Book now</button>
                                            </div>
                                        </div>
                                    </div>
                                </Reveal>
                            );
                        })}
                    </section>
                </div>

                {/* SIDEBAR */}
                <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
                    <div className="card">
                        <p className="text-sm font-medium text-slate-500">Your stay</p>
                        <div className="mt-3 space-y-1.5 text-sm">
                            <p className="flex justify-between"><span className="text-slate-500">Check-in</span><span className="font-medium text-slate-800">{req.startDate}</span></p>
                            <p className="flex justify-between"><span className="text-slate-500">Check-out</span><span className="font-medium text-slate-800">{req.endDate}</span></p>
                            <p className="flex justify-between"><span className="text-slate-500">Rooms</span><span className="font-medium text-slate-800">{req.roomsCount}</span></p>
                            <p className="flex justify-between"><span className="text-slate-500">Guests</span><span className="font-medium text-slate-800">{guests}</span></p>
                        </div>
                        {offerApplies && (
                            <div className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-sm font-medium text-rose-600">
                                {offer!.title} — {offer!.discountPercent}% OFF applied
                            </div>
                        )}
                        <p className="mt-3 text-xs text-slate-400">Pick a room to continue to secure checkout.</p>
                    </div>
                    <div className="card space-y-3 text-sm">
                        <p className="flex items-center gap-2 text-slate-700"><BadgeCheck className="h-5 w-5 flex-shrink-0 text-emerald-500" /> Free cancellation on select rates</p>
                        <p className="flex items-center gap-2 text-slate-700"><ShieldCheck className="h-5 w-5 flex-shrink-0 text-indigo-500" /> Secure payment via Stripe</p>
                        <p className="flex items-center gap-2 text-slate-700"><Check className="h-5 w-5 flex-shrink-0 text-indigo-500" /> Instant confirmation</p>
                    </div>
                </aside>
            </div>
        </div>
    );
}
import { useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Check } from 'lucide-react';
import { getHotelInfo } from '../api/hotels';
import { getOffers } from '../api/offers';
import Spinner from '../components/Spinner';
import { useAuth } from '../auth/AuthContext';
import type { HotelInfoRequest } from '../types/api';

const FALLBACK = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=70';

export default function HotelDetailPage() {
    const { hotelId } = useParams();
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [guests, setGuests] = useState(2);
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
    const offerApplies = !!offer && (offer.cities.length === 0 || offer.cities.includes(hotel.city));
    const factor = offerApplies ? (100 - offer!.discountPercent) / 100 : 1;

    return (
        <div className="space-y-8">
            <div className="overflow-hidden rounded-3xl">
                <img src={hotel.photos?.[0] ?? FALLBACK} alt={hotel.name} className="h-72 w-full object-cover" />
            </div>

            <div>
                <h1 className="text-3xl font-bold text-slate-900">{hotel.name}</h1>
                <p className="mt-1 flex items-center gap-1 text-slate-500"><MapPin className="h-4 w-4" /> {hotel.city}</p>
                {offerApplies && (
                    <span className="mt-3 inline-block rounded-full bg-rose-50 px-3 py-1 text-sm font-semibold text-rose-600">
                        {offer!.title} — {offer!.discountPercent}% OFF applied
                    </span>
                )}
                <div className="mt-3 flex flex-wrap gap-2">
                    {hotel.amenities?.map((a) => (
                        <span key={a} className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
                            <Check className="h-3 w-3 text-emerald-500" /> {a}
                        </span>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Available rooms</h2>
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
                    return (
                        <div key={room.id} className="card flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <h3 className="font-semibold text-slate-900">{room.type}</h3>
                                <div className="mt-1 flex flex-wrap gap-1">
                                    {room.amenities?.slice(0, 4).map((a) => (
                                        <span key={a} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{a}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="text-right">
                                {offerApplies ? (
                                    <p>
                                        <span className="text-sm text-slate-400 line-through">${Math.round(room.price)}</span>{' '}
                                        <span className="text-2xl font-bold text-rose-600">${discounted}</span>
                                    </p>
                                ) : (
                                    <p className="text-2xl font-bold text-indigo-600">${Math.round(room.price)}</p>
                                )}
                                <p className="text-xs text-slate-400">avg / night</p>
                                <button onClick={() => book(room.id)} className="btn-primary mt-2">Book now</button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
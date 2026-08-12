import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Check } from 'lucide-react';
import { getHotelInfo } from '../api/hotels';
import Spinner from '../components/Spinner';
import { useAuth } from '../auth/AuthContext';
import type { HotelInfoRequest } from '../types/api';

const FALLBACK = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=70';

export default function HotelDetailPage() {
    const { hotelId } = useParams();
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

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

    function book(roomId: number) {
        const q = new URLSearchParams({
            hotelId: String(hotelId), roomId: String(roomId),
            checkInDate: req.startDate, checkOutDate: req.endDate, roomsCount: String(req.roomsCount),
        }).toString();
        navigate(isAuthenticated ? `/book?${q}` : `/login?next=${encodeURIComponent(`/book?${q}`)}`);
    }

    if (isLoading) return <Spinner label="Loading hotel…" />;
    if (error) return <p className="card text-rose-600">{(error as Error).message}</p>;
    if (!data) return null;

    const { hotel, rooms } = data;
    return (
        <div className="space-y-8">
            <div className="overflow-hidden rounded-3xl">
                <img src={hotel.photos?.[0] ?? FALLBACK} alt={hotel.name} className="h-72 w-full object-cover" />
            </div>

            <div>
                <h1 className="text-3xl font-bold text-slate-900">{hotel.name}</h1>
                <p className="mt-1 flex items-center gap-1 text-slate-500"><MapPin className="h-4 w-4" /> {hotel.city}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                    {hotel.amenities?.map((a) => (
                        <span key={a} className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
              <Check className="h-3 w-3 text-emerald-500" /> {a}
            </span>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Available rooms</h2>
                {rooms.length === 0 && <p className="card text-slate-500">No rooms available for these dates.</p>}
                {rooms.map((room) => (
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
                            <p className="text-2xl font-bold text-indigo-600">₹{Math.round(room.price)}</p>
                            <p className="text-xs text-slate-400">avg / night</p>
                            <button onClick={() => book(room.id)} className="btn-primary mt-2">Book now</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
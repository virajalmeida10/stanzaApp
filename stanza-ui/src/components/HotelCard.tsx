import { MapPin, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { HotelPriceResponse } from '../types/api';

const FALLBACK = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=60';

export default function HotelCard({ hotel, query }: { hotel: HotelPriceResponse; query: string }) {
    const navigate = useNavigate();
    return (
        <button
            onClick={() => navigate(`/hotels/${hotel.id}?${query}`)}
            className="group overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
        >
            <img src={hotel.photos?.[0] ?? FALLBACK} alt={hotel.name} className="h-44 w-full object-cover transition group-hover:scale-105" />
            <div className="space-y-2 p-4">
                <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-slate-900">{hotel.name}</h3>
                    <span className="flex items-center gap-1 rounded-md bg-amber-50 px-1.5 py-0.5 text-xs font-medium text-amber-600">
            <Star className="h-3 w-3 fill-amber-500 text-amber-500" /> 4.5
          </span>
                </div>
                <p className="flex items-center gap-1 text-sm text-slate-500"><MapPin className="h-4 w-4" /> {hotel.city}</p>
                <div className="flex flex-wrap gap-1">
                    {hotel.amenities?.slice(0, 3).map((a) => (
                        <span key={a} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{a}</span>
                    ))}
                </div>
                <p className="pt-1 text-lg font-bold text-indigo-600">
                    ${Math.round(hotel.price)} <span className="text-sm font-normal text-slate-400">/ night</span>
                </p>
            </div>
        </button>
    );
}
import { MapPin, Star, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { HotelPriceResponse } from '../types/api';

const FALLBACK = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=60';

export default function HotelCard({ hotel, query }: { hotel: HotelPriceResponse; query: string }) {
    const navigate = useNavigate();
    return (
        <button
            onClick={() => navigate(`/hotels/${hotel.id}?${query}`)}
            className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white text-left shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-slate-300/50"
        >
            <div className="relative overflow-hidden">
                <img src={hotel.photos?.[0] ?? FALLBACK} alt={hotel.name}
                     className="h-48 w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-xs font-semibold text-amber-600 shadow-sm backdrop-blur">
                    <Star className="h-3 w-3 fill-amber-500 text-amber-500" /> 4.5
                </span>
            </div>
            <div className="flex flex-1 flex-col gap-2 p-4">
                <h3 className="font-semibold text-slate-900 transition-colors group-hover:text-indigo-600">{hotel.name}</h3>
                <p className="flex items-center gap-1 text-sm text-slate-500"><MapPin className="h-4 w-4" /> {hotel.city}</p>
                <div className="flex flex-wrap gap-1">
                    {hotel.amenities?.slice(0, 3).map((a) => (
                        <span key={a} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{a}</span>
                    ))}
                </div>
                <div className="mt-auto flex items-end justify-between pt-2">
                    <p className="text-lg font-bold gradient-text">
                        ${Math.round(hotel.price)}<span className="ml-1 text-sm font-normal text-slate-400">/ night</span>
                    </p>
                    <span className="flex translate-x-1 items-center gap-1 text-sm font-medium text-indigo-600 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                        View <ArrowRight className="h-4 w-4" />
                    </span>
                </div>
            </div>
        </button>
    );
}
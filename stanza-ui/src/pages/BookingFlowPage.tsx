import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { MapPin, CalendarDays, Users, BedDouble, ShieldCheck, Clock } from 'lucide-react';
import { initBooking, initiatePayment } from '../api/bookings';
import Spinner from '../components/Spinner';
import type { BookingDto } from '../types/api';

const FALLBACK = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=70';
const fmt = (d: string) => new Date(d).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });

export default function BookingFlowPage() {
    const [params] = useSearchParams();
    const [booking, setBooking] = useState<BookingDto | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [paying, setPaying] = useState(false);
    const started = useRef(false);

    const guestCount = Number(params.get('guestCount') ?? 2);
    const offerCode = params.get('offerCode') ?? '';

    useEffect(() => {
        if (started.current) return;
        started.current = true;
        initBooking({
            hotelId: Number(params.get('hotelId')),
            roomId: Number(params.get('roomId')),
            checkInDate: params.get('checkInDate')!,
            checkOutDate: params.get('checkOutDate')!,
            roomsCount: Number(params.get('roomsCount') ?? 1),
            guestCount: Number(params.get('guestCount') ?? 2),
            offerCode: offerCode || undefined,
        }).then(setBooking).catch((e) => setError((e as Error).message));
    }, [params]);

    async function pay() {
        if (!booking) return;
        setPaying(true);
        try {
            const url = await initiatePayment(booking.id);
            window.location.href = url;
        } catch (e) { toast.error((e as Error).message); setPaying(false); }
    }

    if (error) return <div className="card text-rose-600">{error}</div>;
    if (!booking) return <Spinner label="Reserving your room…" />;

    const nights = Math.max(1, Math.round(
        (new Date(booking.checkOutDate).getTime() - new Date(booking.checkInDate).getTime()) / 86400000));
    const image = booking.hotelPhotos?.[0] ?? FALLBACK;

    return (
        <div className="mx-auto max-w-5xl space-y-6">
            <h1 className="text-2xl font-bold text-slate-900">Review your booking</h1>

            <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
                {/* LEFT: stay details */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="relative h-52">
                        <img src={image} alt={booking.hotelName ?? 'Hotel'} className="h-full w-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-4 left-5 text-white">
                            <h2 className="text-2xl font-bold">{booking.hotelName ?? 'Your hotel'}</h2>
                            <p className="flex items-center gap-1 text-sm text-white/90"><MapPin className="h-4 w-4" /> {booking.hotelCity}</p>
                        </div>
                    </div>

                    <div className="grid gap-4 p-5 sm:grid-cols-2">
                        <Detail icon={<BedDouble className="h-5 w-5" />} label="Room" value={`${booking.roomType ?? 'Room'} · ${booking.roomsCount} room(s)`} />
                        <Detail icon={<Users className="h-5 w-5" />} label="Guests" value={`${guestCount} guest(s)`} />
                        <Detail icon={<CalendarDays className="h-5 w-5" />} label="Check-in" value={fmt(booking.checkInDate)} />
                        <Detail icon={<CalendarDays className="h-5 w-5" />} label="Check-out" value={fmt(booking.checkOutDate)} />
                        <div className="sm:col-span-2 flex items-center gap-2 rounded-xl bg-indigo-50 px-4 py-3 text-sm font-medium text-indigo-700">
                            <Clock className="h-4 w-4" /> {nights} night(s) · Room held for 30 minutes
                        </div>
                    </div>
                </div>

                {/* RIGHT: price + pay */}
                <div className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="font-semibold text-slate-900">Price summary</h3>
                    <div className="mt-4 space-y-2 text-sm">
                        <Row label={`${booking.roomType ?? 'Room'} × ${nights} night(s)`} value="" muted />
                        {guestCount > 2 && <Row label={`Extra-guest charge (${guestCount - 2})`} value="+30% each" muted />}
                        {offerCode && <Row label={`Offer ${offerCode}`} value="applied" accent />}
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4">
                        <span className="text-slate-500">Total</span>
                        <span className="text-2xl font-extrabold text-slate-900">${Number(booking.amount).toLocaleString('en-US')}</span>
                    </div>
                    <button onClick={pay} disabled={paying} className="btn-primary mt-5 w-full">
                        {paying ? 'Redirecting to payment…' : 'Pay with Stripe'}
                    </button>
                    <p className="mt-3 flex items-center justify-center gap-1 text-xs text-slate-400">
                        <ShieldCheck className="h-3.5 w-3.5" /> Secure payment · You won't be charged twice
                    </p>
                </div>
            </div>
        </div>
    );
}

function Detail({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
    return (
        <div className="flex items-start gap-3">
            <span className="mt-0.5 text-indigo-500">{icon}</span>
            <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
                <p className="font-medium text-slate-800">{value}</p>
            </div>
        </div>
    );
}
function Row({ label, value, muted, accent }: { label: string; value: string; muted?: boolean; accent?: boolean }) {
    return (
        <div className="flex items-center justify-between">
            <span className={muted ? 'text-slate-500' : 'text-slate-700'}>{label}</span>
            <span className={accent ? 'font-medium text-emerald-600' : 'text-slate-600'}>{value}</span>
        </div>
    );
}
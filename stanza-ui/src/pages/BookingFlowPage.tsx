import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CalendarDays, Hotel } from 'lucide-react';
import { initBooking, initiatePayment } from '../api/bookings';
import Spinner from '../components/Spinner';
import type { BookingDto } from '../types/api';

export default function BookingFlowPage() {
    const [params] = useSearchParams();
    const [booking, setBooking] = useState<BookingDto | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [paying, setPaying] = useState(false);
    const started = useRef(false); // guard StrictMode double-mount so we don't reserve twice

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
        })
            .then(setBooking)
            .catch((e) => setError((e as Error).message));
    }, [params]);

    async function pay() {
        if (!booking) return;
        setPaying(true);
        try {
            const url = await initiatePayment(booking.id);
            window.location.href = url; // hand off to Stripe Checkout
        } catch (e) {
            toast.error((e as Error).message);
            setPaying(false);
        }
    }

    if (error) return <div className="card text-rose-600">{error}</div>;
    if (!booking) return <Spinner label="Reserving your room…" />;

    return (
        <div className="mx-auto max-w-lg">
            <div className="card space-y-5">
                <div className="flex items-center gap-2 text-indigo-600">
                    <Hotel className="h-5 w-5" />
                    <h1 className="text-xl font-bold">Confirm your booking</h1>
                </div>
                <div className="rounded-xl bg-slate-50 p-4 text-sm">
                    <Row icon={<CalendarDays className="h-4 w-4" />} label="Check in" value={booking.checkInDate} />
                    <Row icon={<CalendarDays className="h-4 w-4" />} label="Check out" value={booking.checkOutDate} />
                    <Row label="Rooms" value={String(booking.roomsCount)} />
                    <Row label="Guests" value={String(guestCount)} />
                    {offerCode && <Row label="Offer" value={offerCode} />}
                    <Row label="Status" value={booking.bookingStatus} />
                </div>
                <div className="flex items-center justify-between border-t border-slate-200 pt-4">
                    <span className="text-slate-500">Total amount</span>
                    <span className="text-2xl font-bold text-slate-900">${Number(booking.amount).toLocaleString('en-US')}</span>
                </div>
                {guestCount > 2 && (
                    <p className="text-xs text-slate-400">
                        Includes a 30% extra-guest charge for {guestCount - 2} guest(s) beyond the first 2.
                    </p>
                )}
                {offerCode && (
                    <p className="text-xs text-emerald-600">
                        Offer <b>{offerCode}</b> applied — discount is already reflected in the total.
                    </p>
                )}
                <p className="text-xs text-slate-400">Your room is held for 10 minutes. Complete payment to confirm.</p>
                <button onClick={pay} disabled={paying} className="btn-primary w-full">
                    {paying ? 'Redirecting to payment…' : 'Pay with Stripe'}
                </button>
            </div>
        </div>
    );
}

function Row({ icon, label, value }: { icon?: ReactNode; label: string; value: string }) {
    return (
        <div className="flex items-center justify-between py-1.5">
            <span className="flex items-center gap-1 text-slate-500">{icon}{label}</span>
            <span className="font-medium text-slate-800">{value}</span>
        </div>
    );
}
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';
import { getBookingStatus } from '../api/bookings';
import type { BookingStatus } from '../types/api';

export default function PaymentStatusPage() {
    const { bookingId } = useParams();
    const [status, setStatus] = useState<BookingStatus | null>(null);
    const [tries, setTries] = useState(0);

    useEffect(() => {
        let active = true;
        (async () => {
            try {
                const s = await getBookingStatus(Number(bookingId));
                if (!active) return;
                setStatus(s);
                if (s !== 'CONFIRMED' && s !== 'CANCELLED' && tries < 10) {
                    setTimeout(() => setTries((t) => t + 1), 2000); // re-poll
                }
            } catch {
                /* transient — will retry on next tick */
            }
        })();
        return () => { active = false; };
    }, [bookingId, tries]);

    const confirmed = status === 'CONFIRMED';
    const pending = !confirmed && status !== 'CANCELLED';

    return (
        <div className="mx-auto max-w-md">
            <div className="card text-center">
                {confirmed ? (
                    <>
                        <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-500" />
                        <h1 className="mt-3 text-2xl font-bold">Booking confirmed!</h1>
                        <p className="mt-1 text-slate-500">Your payment was successful.</p>
                    </>
                ) : pending ? (
                    <>
                        <Clock className="mx-auto h-14 w-14 animate-pulse text-amber-500" />
                        <h1 className="mt-3 text-2xl font-bold">Confirming payment…</h1>
                        <p className="mt-1 text-slate-500">This updates automatically once Stripe notifies us.</p>
                    </>
                ) : (
                    <>
                        <XCircle className="mx-auto h-14 w-14 text-rose-500" />
                        <h1 className="mt-3 text-2xl font-bold">Payment not completed</h1>
                    </>
                )}
                <Link to="/my-bookings" className="btn-primary mt-6 inline-block">View my bookings</Link>
            </div>
        </div>
    );
}
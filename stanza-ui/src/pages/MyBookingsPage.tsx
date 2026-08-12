import { useQuery } from '@tanstack/react-query';
import { getMyBookings } from '../api/users';
import Spinner from '../components/Spinner';
import type { BookingStatus } from '../types/api';

const STATUS_STYLES: Record<BookingStatus, string> = {
    CONFIRMED: 'bg-emerald-50 text-emerald-600',
    RESERVED: 'bg-amber-50 text-amber-600',
    GUESTS_ADDED: 'bg-amber-50 text-amber-600',
    PAYMENTS_PENDING: 'bg-blue-50 text-blue-600',
    CANCELLED: 'bg-rose-50 text-rose-600',
    EXPIRED: 'bg-slate-100 text-slate-500',
};

export default function MyBookingsPage() {
    const { data, isLoading, error } = useQuery({ queryKey: ['my-bookings'], queryFn: getMyBookings });

    if (isLoading) return <Spinner label="Loading bookings…" />;
    if (error) return <p className="card text-rose-600">{(error as Error).message}</p>;

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold">My bookings</h1>
            {data && data.length === 0 && <p className="card text-slate-500">You have no bookings yet.</p>}
            {data?.map((b) => (
                <div key={b.id} className="card flex items-center justify-between">
                    <div>
                        <p className="font-semibold text-slate-900">Booking #{b.id}</p>
                        <p className="text-sm text-slate-500">{b.checkInDate} → {b.checkOutDate} · {b.roomsCount} room(s)</p>
                    </div>
                    <div className="text-right">
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLES[b.bookingStatus]}`}>
              {b.bookingStatus}
            </span>
                        <p className="mt-1 font-bold text-slate-900">₹{Number(b.amount).toLocaleString('en-IN')}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
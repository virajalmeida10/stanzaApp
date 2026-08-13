import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { getMyBookings } from '../api/users';
import { cancelUnpaidBooking } from '../api/bookings';
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

// Statuses that still hold inventory and can be released by the user
const CANCELLABLE: BookingStatus[] = ['RESERVED', 'GUESTS_ADDED', 'PAYMENTS_PENDING'];

export default function MyBookingsPage() {
    const queryClient = useQueryClient();
    const { data, isLoading, error } = useQuery({ queryKey: ['my-bookings'], queryFn: getMyBookings });

    const cancelMutation = useMutation({
        mutationFn: cancelUnpaidBooking,
        onSuccess: () => {
            toast.success('Booking cancelled — room released');
            queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
        },
        onError: (e) => toast.error((e as Error).message),
    });

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
                    <div className="flex items-center gap-4">
                        <div className="text-right">
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLES[b.bookingStatus]}`}>
                {b.bookingStatus}
              </span>
                            <p className="mt-1 font-bold text-slate-900">${Number(b.amount).toLocaleString('en-US')}</p>
                        </div>
                        {CANCELLABLE.includes(b.bookingStatus) && (
                            <button
                                onClick={() => cancelMutation.mutate(b.id)}
                                disabled={cancelMutation.isPending}
                                className="rounded-lg border border-rose-200 px-3 py-1.5 text-sm font-medium text-rose-600 hover:bg-rose-50 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
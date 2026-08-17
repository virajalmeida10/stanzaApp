import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { getMyBookings } from '../api/users';
import { cancelUnpaidBooking, initiatePayment } from '../api/bookings';
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
const STATUS_LABEL: Record<BookingStatus, string> = {
    CONFIRMED: 'Confirmed',
    RESERVED: 'In cart',
    GUESTS_ADDED: 'In cart',
    PAYMENTS_PENDING: 'Payment pending',
    CANCELLED: 'Cancelled',
    EXPIRED: 'Cancelled (payment incomplete)',
};
const CART_STATUSES: BookingStatus[] = ['RESERVED', 'GUESTS_ADDED'];

export default function MyBookingsPage() {
    const queryClient = useQueryClient();
    const [payingId, setPayingId] = useState<number | null>(null);
    const { data, isLoading, error } = useQuery({ queryKey: ['my-bookings'], queryFn: getMyBookings });

    const cancelMutation = useMutation({
        mutationFn: cancelUnpaidBooking,
        onSuccess: () => { toast.success('Removed'); queryClient.invalidateQueries({ queryKey: ['my-bookings'] }); },
        onError: (e) => toast.error((e as Error).message),
    });

    async function pay(id: number) {
        setPayingId(id);
        try {
            const url = await initiatePayment(id);
            window.location.href = url;
        } catch (e) {
            toast.error((e as Error).message);
            setPayingId(null);
        }
    }

    if (isLoading) return <Spinner label="Loading…" />;
    if (error) return <p className="card text-rose-600">{(error as Error).message}</p>;

    const cart = data?.filter((b) => CART_STATUSES.includes(b.bookingStatus)) ?? [];
    const bookings = data?.filter((b) => !CART_STATUSES.includes(b.bookingStatus)) ?? [];

    return (
        <div className="space-y-10">
            <section className="space-y-4">
                <h1 className="text-2xl font-bold">Your cart</h1>
                {cart.length === 0 && <p className="card text-slate-500">Your cart is empty.</p>}
                {cart.map((b) => (
                    <div key={b.id} className="card flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="font-semibold text-slate-900">Booking #{b.id}</p>
                            <p className="text-sm text-slate-500">{b.checkInDate} → {b.checkOutDate} · {b.roomsCount} room(s)</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <p className="font-bold text-slate-900">${Number(b.amount).toLocaleString('en-US')}</p>
                            <button onClick={() => pay(b.id)} disabled={payingId === b.id} className="btn-primary">
                                {payingId === b.id ? 'Redirecting…' : 'Complete payment'}
                            </button>
                            <button onClick={() => cancelMutation.mutate(b.id)} disabled={cancelMutation.isPending}
                                    className="rounded-lg border border-rose-200 px-3 py-1.5 text-sm font-medium text-rose-600 hover:bg-rose-50 disabled:opacity-50">
                                Remove
                            </button>
                        </div>
                    </div>
                ))}
            </section>

            <section className="space-y-4">
                <h1 className="text-2xl font-bold">My bookings</h1>
                {bookings.length === 0 && <p className="card text-slate-500">You have no bookings yet.</p>}
                {bookings.map((b) => (
                    <div key={b.id} className="card flex items-center justify-between">
                        <div>
                            <p className="font-semibold text-slate-900">Booking #{b.id}</p>
                            <p className="text-sm text-slate-500">{b.checkInDate} → {b.checkOutDate} · {b.roomsCount} room(s)</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <span className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLES[b.bookingStatus]}`}>
                                    {STATUS_LABEL[b.bookingStatus]}
                                </span>
                                <p className="mt-1 font-bold text-slate-900">${Number(b.amount).toLocaleString('en-US')}</p>
                            </div>
                            {b.bookingStatus === 'PAYMENTS_PENDING' && (
                                <button onClick={() => cancelMutation.mutate(b.id)} disabled={cancelMutation.isPending}
                                        className="rounded-lg border border-rose-200 px-3 py-1.5 text-sm font-medium text-rose-600 hover:bg-rose-50 disabled:opacity-50">
                                    Cancel
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
}
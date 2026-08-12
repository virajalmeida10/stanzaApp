import { api } from '../lib/apiClient';
import type { BookingDto, BookingRequest, BookingStatus } from '../types/api';

export async function initBooking(body: BookingRequest): Promise<BookingDto> {
    const { data } = await api.post<BookingDto>('/bookings/init', body);
    return data;
}
export async function addGuests(bookingId: number, guestIds: number[]): Promise<BookingDto> {
    const { data } = await api.post<BookingDto>(`/bookings/${bookingId}/addGuests`, guestIds);
    return data;
}
export async function initiatePayment(bookingId: number): Promise<string> {
    const { data } = await api.post<{ sessionUrl: string }>(`/bookings/${bookingId}/payments`, null);
    return data.sessionUrl;
}
export async function cancelBooking(bookingId: number): Promise<void> {
    await api.post(`/bookings/${bookingId}/cancel`, null);
}
export async function getBookingStatus(bookingId: number): Promise<BookingStatus> {
    const { data } = await api.get<{ bookingStatus: BookingStatus }>(`/bookings/${bookingId}/status`);
    return data.bookingStatus;
}
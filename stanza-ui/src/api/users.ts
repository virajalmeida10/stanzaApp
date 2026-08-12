import { api } from '../lib/apiClient';
import type { BookingDto, GuestDto, ProfileUpdateRequest, UserDto } from '../types/api';

export async function getMyProfile(): Promise<UserDto> {
    const { data } = await api.get<UserDto>('/users/profile');
    return data;
}
export async function updateProfile(body: ProfileUpdateRequest): Promise<void> {
    await api.patch('/users/profile', body); // needs PATCH in CORS (setup note #2)
}
export async function getMyBookings(): Promise<BookingDto[]> {
    const { data } = await api.get<BookingDto[]>('/users/myBookings');
    return data;
}
export async function getGuests(): Promise<GuestDto[]> {
    const { data } = await api.get<GuestDto[]>('/users/guests');
    return data;
}
export async function addGuest(body: GuestDto): Promise<GuestDto> {
    const { data } = await api.post<GuestDto>('/users/guests', body);
    return data;
}
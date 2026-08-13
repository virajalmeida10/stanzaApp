export type Gender = 'MALE' | 'FEMALE' | 'OTHER';
export type Role = 'GUEST' | 'HOTEL_MANAGER';
export type BookingStatus =
    | 'RESERVED' | 'GUESTS_ADDED' | 'PAYMENTS_PENDING'
    | 'CONFIRMED' | 'CANCELLED' | 'EXPIRED';

// Every response is wrapped by GlobalResponseHandler
export interface ApiEnvelope<T> {
    timeStamp: string;
    data: T | null;
    error: { status: string; message: string } | null;
}

// Spring Page<T> shape
export interface Page<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
    first: boolean;
    last: boolean;
}

export interface Offer {
    code: string;
    title: string;
    description: string;
    discountPercent: number;
    cities: string[];
    image: string;
}

export interface BookingRequest {
    hotelId: number; roomId: number;
    checkInDate: string; checkOutDate: string;
    roomsCount: number; guestCount: number;
    offerCode?: string;   // NEW
}

export interface HotelContactInfo {
    address: string; phoneNumber: string; email: string; location: string;
}
export interface HotelPriceResponse {
    id: number; name: string; city: string;
    photos: string[]; amenities: string[];
    contactInfo: HotelContactInfo; price: number;
}
export interface HotelDto {
    id: number; name: string; city: string;
    photos: string[]; amenities: string[];
    contactInfo: HotelContactInfo; active: boolean;
}
export interface RoomPriceResponse {
    id: number; type: string; photos: string[]; amenities: string[]; price: number;
}
export interface HotelInfo { hotel: HotelDto; rooms: RoomPriceResponse[]; }

export interface SearchRequest {
    city: string; startDate: string; endDate: string;
    roomsCount: number; page?: number; size?: number;
}
export interface HotelInfoRequest {
    startDate: string; endDate: string; roomsCount: number;
}
export interface BookingRequest {
    hotelId: number; roomId: number;
    checkInDate: string; checkOutDate: string; roomsCount: number; guestCount: number;
}
export interface GuestDto { id?: number; name: string; gender: Gender; dateOfBirth: string; }
export interface BookingDto {
    id: number; roomsCount: number;
    checkInDate: string; checkOutDate: string;
    createdAt: string; updatedAt: string;
    bookingStatus: BookingStatus; guests: GuestDto[]; amount: number;
}
export interface UserDto {
    id: number; email: string; name: string;
    gender?: Gender; dateOfBirth?: string;
}
export interface SignUpRequest { email: string; password: string; name: string; }
export interface LoginRequest { email: string; password: string; }
export interface ProfileUpdateRequest { name: string; dateOfBirth: string; gender: Gender; }
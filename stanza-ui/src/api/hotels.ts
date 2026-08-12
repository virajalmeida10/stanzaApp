import { api } from '../lib/apiClient';
import type {
    HotelInfo, HotelInfoRequest, HotelPriceResponse, Page, SearchRequest,
} from '../types/api';

// Backend endpoints must be POST (see setup note #1)
export async function searchHotels(body: SearchRequest): Promise<Page<HotelPriceResponse>> {
    const { data } = await api.post<Page<HotelPriceResponse>>('/hotels/search', body);
    return data;
}

export async function getHotelInfo(hotelId: number, body: HotelInfoRequest): Promise<HotelInfo> {
    const { data } = await api.post<HotelInfo>(`/hotels/${hotelId}/info`, body);
    return data;
}
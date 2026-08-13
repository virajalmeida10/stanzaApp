import { api } from '../lib/apiClient';
import type { Offer } from '../types/api';

export async function getOffers(): Promise<Offer[]> {
    const { data } = await api.get<Offer[]>('/offers');
    return data;
}
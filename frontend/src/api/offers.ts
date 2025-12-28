import { http } from './http';
import type { Offer, OfferRequest, OfferStatus } from '../types';

export const offerApi = {
    getAll: async () => {
        const { data } = await http.get<Offer[]>('/offers');
        return data;
    },
    get: async (id: string) => {
        const { data } = await http.get<Offer>(`/offers/${id}`);
        return data;
    },
    create: async (payload: OfferRequest) => {
        const { data } = await http.post<Offer>('/offers', payload);
        return data;
    },
    updateStatus: async (id: string, status: OfferStatus) => {
        const { data } = await http.patch<Offer>(`/offers/${id}/status`, null, {
            params: { status }
        });
        return data;
    }
};

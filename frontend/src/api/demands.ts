import { http } from './http';
import type { Demand, DemandRequest, DemandStatus } from '../types';

export const demandApi = {
    getAll: async () => {
        const { data } = await http.get<Demand[]>('/demands');
        return data;
    },
    get: async (id: string) => {
        const { data } = await http.get<Demand>(`/demands/${id}`);
        return data;
    },
    create: async (payload: DemandRequest) => {
        const { data } = await http.post<Demand>('/demands', payload);
        return data;
    },
    updateStatus: async (id: string, status: DemandStatus) => {
        const { data } = await http.patch<Demand>(`/demands/${id}/status`, null, {
            params: { status }
        });
        return data;
    }
};

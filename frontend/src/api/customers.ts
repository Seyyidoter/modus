import { http } from './http';
import type { Customer, CustomerRequest } from '../types';

export const customerApi = {
    getAll: async () => {
        const { data } = await http.get<Customer[]>('/customers');
        return data;
    },
    get: async (id: string) => {
        const { data } = await http.get<Customer>(`/customers/${id}`);
        return data;
    },
    create: async (payload: CustomerRequest) => {
        const { data } = await http.post<Customer>('/customers', payload);
        return data;
    },
    update: async (id: string, payload: CustomerRequest) => {
        const { data } = await http.put<Customer>(`/customers/${id}`, payload);
        return data;
    },
    delete: async (id: string) => {
        await http.delete(`/customers/${id}`);
    }
};

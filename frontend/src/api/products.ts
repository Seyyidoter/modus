import { http } from './http';
import type { Product, ProductRequest } from '../types';

export const productApi = {
    getAll: async () => {
        const { data } = await http.get<Product[]>('/products');
        return data;
    },
    create: async (payload: ProductRequest) => {
        const { data } = await http.post<Product>('/products', payload);
        return data;
    }
};

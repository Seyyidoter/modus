import { http } from './http';
import type { Warehouse, WarehouseRequest } from '../types';

export const warehouseApi = {
    getAll: async () => {
        const { data } = await http.get<Warehouse[]>('/warehouses');
        return data;
    },
    create: async (payload: WarehouseRequest) => {
        const { data } = await http.post<Warehouse>('/warehouses', payload);
        return data;
    }
};

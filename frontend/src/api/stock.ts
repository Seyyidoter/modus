import { http } from './http';
import type { StockSummary, StockMovementRequest, StockTransferRequest } from '../types';

export const stockApi = {
    getOverview: async (warehouseId: string) => {
        const { data } = await http.get<StockSummary[]>(`/stock?warehouseId=${warehouseId}`);
        return data;
    },
    createMovement: async (payload: StockMovementRequest) => {
        await http.post('/stock/movements', payload);
    },
    createTransfer: async (payload: StockTransferRequest) => {
        await http.post('/stock/transfers', payload);
    },
    getHistory: async (productId: string) => {
        const { data } = await http.get<import('../types').StockMovementResponse[]>(`/stock/movements?productId=${productId}`);
        return data;
    }
};

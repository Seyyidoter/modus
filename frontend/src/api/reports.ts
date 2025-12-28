import { http } from './http';
import type { DashboardData } from '../types';

export const reportApi = {
    getDashboardData: async () => {
        const { data } = await http.get<DashboardData>('/reports/dashboard');
        return data;
    }
};

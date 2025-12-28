import { http } from './http';
import type { UserDTO } from '../types';

export const userApi = {
    getAll: async () => {
        const { data } = await http.get<UserDTO[]>('/users');
        return data;
    }
};

import http from './http';

export interface AuthResponse {
    token: string;
    firstName: string;
    lastName: string;
    role: string;
}

export const authApi = {
    login: async (credentials: any) => {
        const response = await http.post<AuthResponse>('/auth/login', credentials);
        return response.data;
    },
    register: async (data: any) => {
        const response = await http.post<AuthResponse>('/auth/register', data);
        return response.data;
    }
};

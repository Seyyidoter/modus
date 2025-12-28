import axios, { AxiosError } from 'axios';
import { notification } from 'antd';

export const http = axios.create({
    baseURL: '/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

http.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

http.interceptors.response.use(
    (response) => response,
    (error: AxiosError<any>) => {
        const { response } = error;

        if (response) {
            const { status, data } = response;
            const errorCode = data?.errorCode || 'UNKNOWN_ERROR';
            const message = data?.message || 'Something went wrong';

            // 401 Unauthorized
            if (status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                // We rely on React State change to redirect, or do force redirect if needed
                // window.location.href = '/login'; 
            }

            // 400 Bad Request (Validation Errors handling is special)
            if (status === 400 && data?.fieldErrors) {
                return Promise.reject(data);
            }

            // 409 Conflict
            if (status === 409) {
                notification.error({
                    message: 'Business Error',
                    description: message,
                    duration: 5
                });
                return Promise.reject(data);
            }

            // 404 Not Found
            if (status === 404) {
                notification.warning({
                    message: 'Not Found',
                    description: message
                });
                return Promise.reject(data);
            }

            // 500 & Others
            notification.error({
                message: `Error (${status}) - ${errorCode}`,
                description: message,
            });

        } else {
            // Network Error
            notification.error({
                message: 'Network Error',
                description: 'Could not connect to the server.'
            });
        }

        return Promise.reject(error);
    }
);

export default http;

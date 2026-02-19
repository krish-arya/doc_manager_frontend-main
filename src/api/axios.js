// src/api/axios.js
import axios from 'axios';

const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://164.52.203.8:8081/api';

const instance = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Network errors (e.g. connection refused) have no response object
        if (!error.response) {
            console.error('Network error:', error.message);
            return Promise.reject(error);
        }

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refreshToken');

            try {
                const response = await axios.post(baseURL + '/token/refresh/', {
                    refresh: refreshToken,
                });

                if (response.status === 200) {
                    const newAccessToken = response.data.access;
                    localStorage.setItem('token', newAccessToken);
                    instance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return instance(originalRequest);
                }
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                // Clear tokens and redirect to login
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                window.location.href = '/auth/login';
            }
        }

        return Promise.reject(error);
    }
);

export default instance;








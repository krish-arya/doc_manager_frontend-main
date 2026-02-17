// src/api/axios.js
import axios from 'axios';
import  { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://164.52.203.8:8081/api';

const instance = axios.create({
    baseURL: baseURL, // Replace with your actual base URL
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
                    return instance(originalRequest);  // Retry the original request
                }
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                const { logout } = useAuth();
                const navigate = useNavigate();

                useEffect(() => {
                    logout();
                    navigate('/auth/login');
                }, [logout, navigate]);
                // Handle token refresh failure, like logging out the user or showing an error message
            }
        }

        return Promise.reject(error);
    }
);

export default instance;








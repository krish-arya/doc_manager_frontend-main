// src/context/AuthContext.js
import React, { createContext, useState, useContext,useEffect } from 'react';
import axios from '../api/axios';
import authAxios from '../api/authAxios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            authAxios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            // Optionally, fetch user data here if required
            setUser({ username: 'user' });
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            // Use authAxios for login - points to AWS server
            const response = await authAxios.post('/token/', { username, password });
            
            localStorage.setItem('token', response.data.access);
            localStorage.setItem('refreshToken',response.data.refresh)
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
            authAxios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
            setUser({ username });
        } catch (error) {
            console.error("Login failed", error.response ? error.response.data : error.message);
            alert("Login failed: " + (error.response?.data?.detail || "An unknown error occurred"));
            throw error;
        }
    };
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        delete axios.defaults.headers.common['Authorization'];
        delete authAxios.defaults.headers.common['Authorization'];
        setUser(null);
    };


    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

// src/views/templates/Logout.js
import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        logout();
        navigate('/auth/login');
    }, [logout, navigate]);

    return <div>Logging out...</div>;
};

export default Logout;

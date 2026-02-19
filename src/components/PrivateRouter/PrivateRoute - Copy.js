// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from 'context/AuthContext';

const PrivateRoute = ({ component: Component }) => {
    const { user, loading } = useAuth();
    if (loading) {
        return <div>Loading...</div>; // or a loading spinner
    }
    
    return user ? <Component /> : <Navigate to="/auth/login" replace />;
};

export default PrivateRoute;

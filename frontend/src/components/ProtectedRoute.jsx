import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAdmin } from '../utils/AdminContext';

const ProtectedRoute = () => {
    const { user, loading } = useAdmin();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-dark">
                <div className="w-12 h-12 border-4 border-accent-purple border-t-white rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/om/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;

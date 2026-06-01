import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkStatus = async () => {
        try {
            const response = await api.get('/api/auth/status/');
            if (response.data.is_authenticated && response.data.is_staff) {
                setUser({ username: response.data.username });
            } else {
                setUser(null);
            }
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkStatus();
    }, []);

    const login = async (username, password) => {
        try {
            const response = await api.post('/api/auth/login/', { username, password });
            setUser({ username: response.data.username });
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.detail || 'Login failed' };
        }
    };

    const logout = async () => {
        try {
            await api.post('/api/auth/logout/');
            setUser(null);
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    return (
        <AdminContext.Provider value={{ user, loading, login, logout, checkStatus }}>
            {children}
        </AdminContext.Provider>
    );
};

export const useAdmin = () => useContext(AdminContext);

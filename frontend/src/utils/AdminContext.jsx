import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AdminContext = createContext();

// Configure axios defaults
axios.defaults.withCredentials = true;
// Removing baseURL because we use Vite proxy in dev
// axios.defaults.baseURL = 'http://localhost:8000'; 

// Add a request interceptor to include the CSRF token if it exists in cookies
axios.interceptors.request.use((config) => {
    const name = 'csrftoken';
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    if (cookieValue) {
        config.headers['X-CSRFToken'] = cookieValue;
    }
    return config;
});

export const AdminProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkStatus = async () => {
        try {
            const response = await axios.get('/api/auth/status/');
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
            const response = await axios.post('/api/auth/login/', { username, password });
            setUser({ username: response.data.username });
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.detail || 'Login failed' };
        }
    };

    const logout = async () => {
        try {
            await axios.post('/api/auth/logout/');
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

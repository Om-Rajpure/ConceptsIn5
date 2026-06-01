import axios from 'axios';

// Central axios instance — all API calls go through here.
// In production (Vercel), VITE_API_URL = https://conceptsin5.onrender.com
// Falls back to absolute Render URL so calls never go to the Vercel domain.
const API_URL = import.meta.env.VITE_API_URL || 'https://conceptsin5.onrender.com';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Attach CSRF token from cookie on every mutating request
api.interceptors.request.use((config) => {
  const name = 'csrftoken';
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + '=') {
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

export default api;

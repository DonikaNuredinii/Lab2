import axios from 'axios';
import { refreshAccessToken } from './authService';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

const axiosInstance = axios.create({
  baseURL: API_BASE,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/auth'; 
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

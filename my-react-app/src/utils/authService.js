// utils/authService.js
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  const accessToken = localStorage.getItem('token');

  if (!refreshToken || !accessToken) {
    throw new Error("No refresh token or access token");
  }

  const response = await axios.post(`${API_BASE}/api/User/refresh`, {
    accessToken,
    refreshToken,
  });

  const { token, refreshToken: newRefreshToken } = response.data;

  localStorage.setItem('token', token);
  localStorage.setItem('refreshToken', newRefreshToken);

  return token; // return for retry
};

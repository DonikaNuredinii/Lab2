import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

export const refreshAccessToken = async () => {
  const token = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refreshToken');

  if (!token || !refreshToken) throw new Error('Missing tokens');

  const res = await axios.post(`${API_BASE}/api/User/refresh`, {
    accessToken: token,
    refreshToken: refreshToken,
  });

  localStorage.setItem('token', res.data.token);
  localStorage.setItem('refreshToken', res.data.refreshToken);
  return res.data.token;
};

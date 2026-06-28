import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true, 
});

api.interceptors.request.use((config) => {
  const token = document.cookie
    .split('; ')
    .find((row) => row.startsWith('auth_token'))
    ?.split('=')[1];

    // alert(token)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default api;
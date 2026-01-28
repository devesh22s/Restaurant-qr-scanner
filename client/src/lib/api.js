import axios from 'axios';

const api = axios.create({
  // ✅ IMPORTANT: Backend URL yahan check karein. Slash (/) last me nahi hona chahiye.
  baseURL: import.meta.env.VITE_API_URL || 'https://restaurant-qr-scanner-1qo7.vercel.app/api/v1',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const userToken = localStorage.getItem('accessToken');
  let sessionToken = localStorage.getItem('sessionToken');

  if (userToken) config.headers.Authorization = `Bearer ${userToken}`;
  
  if (!userToken && !sessionToken) {
      sessionToken = `guest-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      localStorage.setItem('sessionToken', sessionToken);
  }

  if (sessionToken) config.headers['x-session-token'] = sessionToken;

  return config;
}, (error) => Promise.reject(error));

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // 404 Error (Table Not Found) ko interceptor handle na kare, use Home.jsx handle karega
    if (error.response?.status === 404) {
        return Promise.reject(error);
    }

    if (originalRequest.url.includes('/auth/login')) return Promise.reject(error);
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const storedRefreshToken = localStorage.getItem('refreshToken');
        if (!storedRefreshToken) throw new Error("No token");

        const { data } = await axios.post(`${api.defaults.baseURL}/auth/refresh-token`, { refreshToken: storedRefreshToken });
        localStorage.setItem('accessToken', data.accessToken);
        originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
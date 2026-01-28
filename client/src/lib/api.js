import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
  withCredentials: true,
});

// 1. REQUEST INTERCEPTOR
api.interceptors.request.use((config) => {
  const userToken = localStorage.getItem('accessToken');
  let sessionToken = localStorage.getItem('sessionToken');

  // User Token (Admin/Customer)
  if (userToken) {
    config.headers.Authorization = `Bearer ${userToken}`;
  } 
  
  // Guest Token (Generate only if not logged in)
  if (!userToken && !sessionToken) {
      sessionToken = `guest-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      localStorage.setItem('sessionToken', sessionToken);
  }
  
  // Session Token (Always send for cart continuity)
  if (sessionToken) {
    config.headers['x-session-token'] = sessionToken;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});
  
// 2. RESPONSE INTERCEPTOR (Auto Logout Logic)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Login/Refresh page par error aaye to intercept mat karo
    if (originalRequest.url.includes('/auth/login') || originalRequest.url.includes('/auth/refresh-token')) {
        return Promise.reject(error);
    }
    
    // Agar 401 (Unauthorized) hai aur retry nahi kiya hai
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const storedRefreshToken = localStorage.getItem('refreshToken');
        
        if (!storedRefreshToken) {
             throw new Error("No refresh token found");
        }

        // Call Refresh API
        const { data } = await axios.post(
          `${api.defaults.baseURL}/auth/refresh-token`,
          { refreshToken: storedRefreshToken }
        );
        
        // Success
        const newAccessToken = data.accessToken;
        localStorage.setItem('accessToken', newAccessToken);
        
        // Retry Original Request
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return api(originalRequest);

      } catch (refreshError) {
        // 🚨 FINAL LOGOUT: Agar Refresh bhi fail hua, to sab saaf karo
        console.error("Session expired completely. Logging out...");
        
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        // Note: 'sessionToken' mat udao, taaki wo Guest ban sake agar chahe to
        
        window.location.href = '/login'; // Force Redirect
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
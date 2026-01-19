import axios from 'axios';

// Backend URL update kiya hai (v1 versioning ke sath)
const api = axios.create({
  baseURL: 'http://localhost:3000/api/v1', 
});

// REQUEST INTERCEPTOR (Hybrid Auth Logic)
api.interceptors.request.use((config) => {
  const userToken = localStorage.getItem('accessToken');
  const sessionToken = localStorage.getItem('sessionToken'); // Guest Token

  // 1. Agar User Login hai -> Send Bearer Token
  if (userToken) {
    config.headers.Authorization = `Bearer ${userToken}`;
  } 
  // 2. Agar User Login nahi hai, par Guest Session hai -> Send Custom Header
  else if (sessionToken) {
    config.headers['x-session-token'] = sessionToken;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

// RESPONSE INTERCEPTOR (Token Refresh Logic)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Agar 401 aaya (Unauthorized) aur yeh pehli baar hai
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
           const response = await axios.post(
             'http://localhost:3000/api/v1/auth/refresh',
             { refreshToken }
           );
           
           const newAccessToken = response.data.accessToken;
           localStorage.setItem('accessToken', newAccessToken);
           
           // Retry original request with new token
           originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
           return api(originalRequest);
        }
      } catch (error) {
        console.log("Session expired, please login again", error);
        // Logout logic here (Clear local storage)
        localStorage.clear();
        window.location.href = '/login'; 
      }
    }
    return Promise.reject(error);
  }
);

export default api;
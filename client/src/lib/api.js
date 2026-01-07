import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});
//interceptors
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  console.log('console via request interceptors' , token)
  config.headers.Authorization = `Bearer ${token}`;
  config.headers.name = 'ritesh';
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log('interceptors response' ,response)
    // Process successful responses
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
console.log(error)
console.log(error.config)
    if (error.response.status === 401) {
      try {
        const response = await axios.post(
          'http://localhost:3000/api/v1/auth/refresh',
          { refreshToken: localStorage.getItem('refreshToken') }
        );
        console.log('token' ,response.data.accessToken);
        localStorage.setItem('accessToken' , response.data.accessToken);
        originalRequest.headers[
          'Authorization'
        ] = `Bearer ${localStorage.getItem('accessToken')}`;
        api(originalRequest);
        //1save it to local
        // then call the api again
      } catch (error) {

        console.log(error);   
        //handle the case of navigation to the login page in case we get error navigate it to login page.
      }
    }
    //   } else if (error.response.status === 500) {
    //     // Handle server errors
    //     console.error('Server error');
    //   }
    return Promise.reject(error);
  }
);

export default api;
// axiosServices.js
import axios from 'axios';

const axiosServices = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/',
});

export const setupInterceptors = (logoutFn) => {
  axiosServices.interceptors.response.use(
    (response) => response,
    async (error) => {
      const status = error?.response?.status;

      if (status === 401 || status === 403) {
        console.warn('🔐 Unauthorized. Triggering logout in 1 seconds...');
        if (logoutFn) {
            setTimeout(async () => {
                await logoutFn();
            }, 1000);
        } 
    }
    
      return Promise.reject(error);
    }
  );
};

export default axiosServices;

import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000', // Adjust base URL as needed
});

// Add a request interceptor to attach Authorization header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Retrieve token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Add the token to headers
    }
    return config;
  },
  (error) => {
    return Promise.reject(error); // Handle request errors
  }
);

export default axiosInstance;
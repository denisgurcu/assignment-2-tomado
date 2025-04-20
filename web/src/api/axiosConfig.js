import axios from 'axios';

// well this was an attempt to simplfy things but I got more consufed:  a customized instance to simplify api calls
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000', //  URL for our the API
});

// Add a request to attach the "Authorization header" with the user's generated token
axiosInstance.interceptors.request.use(
  (config) => {
    // Get the authentication token stored in the browser's local storage
    const token = localStorage.getItem('token'); 

    // If a token exists, add it to the request's Authorization header
    // with this the server knows who is making the request
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; 
    }

   
    return config;
  },
  (error) => {
    // if there's an error - reject
    return Promise.reject(error);
  }
);

// export the axios so it can be used across the app for all API calls
// this suppose to make  API requests consistent and makes it easier to add future configurations but I guess my brain is not ready for that yet (can't believe this was an auto complete message)
export default axiosInstance;
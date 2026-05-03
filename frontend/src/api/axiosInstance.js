import axios from 'axios';

// Pre-configured axios instance for API calls
const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000/api',
});

// Request interceptor to automatically attach JWT token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;

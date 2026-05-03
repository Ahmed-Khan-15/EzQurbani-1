import axiosInstance from './axiosInstance';

// Authentication API calls
export const login = async (credentials) => {
    const response = await axiosInstance.post('/auth/login', credentials);
    return response.data;
};

export const register = async (userData) => {
    const response = await axiosInstance.post('/auth/register', userData);
    return response.data;
};

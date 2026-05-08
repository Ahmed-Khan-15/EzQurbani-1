import axiosInstance from './axiosInstance';

export const createReview = async (reviewData) => {
    const response = await axiosInstance.post('/reviews', reviewData);
    return response.data;
};

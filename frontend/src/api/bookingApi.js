import axiosInstance from './axiosInstance';

export const createBooking = async (bookingData) => {
    const response = await axiosInstance.post('/bookings', bookingData);
    return response.data;
};

export const getMyBookings = async () => {
    const response = await axiosInstance.get('/bookings/my');
    return response.data;
};

export const cancelBooking = async (id) => {
    const response = await axiosInstance.patch(`/bookings/${id}/cancel`);
    return response.data;
};

export const validateDiscount = async (code) => {
    const response = await axiosInstance.post('/bookings/discount/validate', { code });
    return response.data;
};

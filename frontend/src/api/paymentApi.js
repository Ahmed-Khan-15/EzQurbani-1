import axiosInstance from './axiosInstance';

export const getPaymentMethods = async () => {
    const response = await axiosInstance.get('/payments/methods');
    return response.data;
};

export const makePayment = async (paymentData) => {
    const response = await axiosInstance.post('/payments', paymentData);
    return response.data;
};

export const getReceipt = async (bookingId) => {
    const response = await axiosInstance.get(`/payments/receipt/${bookingId}`);
    return response.data;
};

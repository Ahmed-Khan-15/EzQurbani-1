import axiosInstance from './axiosInstance';

export const getMyNotifications = async () => {
    const response = await axiosInstance.get('/notifications/my');
    return response.data;
};

export const markNotificationAsRead = async (id) => {
    const response = await axiosInstance.patch(`/notifications/${id}/read`);
    return response.data;
};

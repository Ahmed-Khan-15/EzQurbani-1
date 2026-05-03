import axiosInstance from './axiosInstance';

export const getAnimals = async () => {
    const response = await axiosInstance.get('/animals');
    return response.data;
};

export const getAnimalById = async (id) => {
    const response = await axiosInstance.get(`/animals/${id}`);
    return response.data;
};

export const getAnimalHissas = async (id) => {
    const response = await axiosInstance.get(`/animals/${id}/hissas`);
    return response.data;
};

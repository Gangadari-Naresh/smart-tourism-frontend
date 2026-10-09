import axiosInstance from './axiosConfig';

export const itineraryApi = {
  getAll: async () => {
    const response = await axiosInstance.get('/itineraries');
    return response.data;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`/itineraries/${id}`);
    return response.data;
  },

  create: async (itineraryData) => {
    const response = await axiosInstance.post('/itineraries', itineraryData);
    return response.data;
  },

  update: async (id, itineraryData) => {
    const response = await axiosInstance.put(`/itineraries/${id}`, itineraryData);
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`/itineraries/${id}`);
    return response.data;
  }
};

import axiosInstance from './axiosConfig';

export const destinationApi = {
  getAll: async (params = {}) => {
    const response = await axiosInstance.get('/destinations', { params });
    return response.data;
  },

  getFeatured: async () => {
    const response = await axiosInstance.get('/destinations/featured');
    return response.data;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`/destinations/${id}`);
    return response.data;
  },

  create: async (destinationData) => {
    const response = await axiosInstance.post('/destinations', destinationData);
    return response.data;
  },

  update: async (id, destinationData) => {
    const response = await axiosInstance.put(`/destinations/${id}`, destinationData);
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`/destinations/${id}`);
    return response.data;
  }
};

import axiosInstance from './axiosConfig';

export const attractionApi = {
  getAll: async (destinationId = null) => {
    const params = destinationId ? { destinationId } : {};
    const response = await axiosInstance.get('/attractions', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`/attractions/${id}`);
    return response.data;
  },

  create: async (attractionData) => {
    const response = await axiosInstance.post('/attractions', attractionData);
    return response.data;
  },

  update: async (id, attractionData) => {
    const response = await axiosInstance.put(`/attractions/${id}`, attractionData);
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`/attractions/${id}`);
    return response.data;
  }
};

import axiosInstance from './axiosConfig';

export const favoriteApi = {
  getFavorites: async () => {
    const response = await axiosInstance.get('/favorites');
    return response.data;
  },

  addFavorite: async (destinationId) => {
    const response = await axiosInstance.post(`/favorites/${destinationId}`);
    return response.data;
  },

  removeFavorite: async (destinationId) => {
    const response = await axiosInstance.delete(`/favorites/${destinationId}`);
    return response.data;
  }
};

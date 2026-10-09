import axiosInstance from './axiosConfig';

export const recommendationApi = {
  getUserRecommendations: async () => {
    const response = await axiosInstance.get('/recommendations');
    return response.data;
  },

  generate: async (preferences = {}) => {
    const response = await axiosInstance.post('/recommendations/generate', preferences);
    return response.data;
  }
};

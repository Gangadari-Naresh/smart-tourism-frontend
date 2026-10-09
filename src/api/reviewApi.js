import axiosInstance from './axiosConfig';

export const reviewApi = {
  getByDestination: async (destinationId) => {
    const response = await axiosInstance.get(`/reviews/destination/${destinationId}`);
    return response.data;
  },

  getMyReviews: async () => {
    const response = await axiosInstance.get('/reviews/my-reviews');
    return response.data;
  },

  create: async (reviewData) => {
    const response = await axiosInstance.post('/reviews', reviewData);
    return response.data;
  },

  update: async (id, reviewData) => {
    const response = await axiosInstance.put(`/reviews/${id}`, reviewData);
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`/reviews/${id}`);
    return response.data;
  },

  getAllAdmin: async () => {
    const response = await axiosInstance.get('/reviews');
    return response.data;
  }
};

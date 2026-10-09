import axiosInstance from './axiosConfig';

export const adminApi = {
  getDashboardStats: async () => {
    const response = await axiosInstance.get('/admin/dashboard');
    return response.data;
  },

  getAllUsers: async () => {
    const response = await axiosInstance.get('/admin/users');
    return response.data;
  },

  toggleUserStatus: async (userId) => {
    const response = await axiosInstance.put(`/admin/users/${userId}/toggle-status`);
    return response.data;
  },

  deleteUser: async (userId) => {
    const response = await axiosInstance.delete(`/admin/users/${userId}`);
    return response.data;
  }
};

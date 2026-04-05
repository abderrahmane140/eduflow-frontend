import api from './axios';

export const wishlistApi = {
  getAll: ()         => api.get('/student/wishlist'),
  save:   (courseId) => api.post(`/student/wishlist/${courseId}`),
  remove: (courseId) => api.delete(`/student/wishlist/${courseId}`),
};
import api from './axios';

export const courseApi = {
  getAll:            (params)   => api.get('/courses', { params }),
  getOne:            (id)       => api.get(`/courses/${id}`),
  getRecommended:    ()         => api.get('/courses/recommended'),
  getTeacherCourses: ()         => api.get('/teacher/courses'),
  create:            (data)     => api.post('/teacher/courses', data),
  update:            (id, data) => api.put(`/teacher/courses/${id}`, data),
  delete:            (id)       => api.delete(`/teacher/courses/${id}`),
  getStudents:       (courseId) => api.get(`/teacher/courses/${courseId}/students`),
  getStats:          ()         => api.get('/teacher/stats'),
};
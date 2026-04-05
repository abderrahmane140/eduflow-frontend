import api from './axios';

export const enrollmentApi = {
  enroll:        (data)     => api.post('/student/enroll', data),
  unenroll:      (courseId) => api.delete(`/student/unenroll/${courseId}`),
  myEnrollments: ()         => api.get('/student/enrollments'),
};
import api from './axios';

export const groupApi = {
  getCourseGroups:     (courseId) => api.get(`/teacher/courses/${courseId}/groups`),
  getGroupWithStudents:(groupId)  => api.get(`/teacher/groups/${groupId}`),
};
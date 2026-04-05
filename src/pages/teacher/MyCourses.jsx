import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { courseApi } from '../../api/courseApi';
import {
  Plus, BookMarked, Edit2, Trash2,
  Users, Eye, MoreVertical
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    courseApi.getTeacherCourses()
      .then(({ data }) => setCourses(data))
      .catch(() => toast.error('Failed to load courses'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this course? This cannot be undone.')) return;
    setDeleting(id);
    try {
      await courseApi.delete(id);
      setCourses(prev => prev.filter(c => c.id !== id));
      toast.success('Course deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
            <p className="text-gray-500 mt-1">{courses.length} courses</p>
          </div>
          <Link to="/teacher/courses/new" className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Course
          </Link>
        </div>

        {/* Courses */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3].map(i => (
              <div key={i} className="card animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
                <div className="h-3 bg-gray-200 rounded w-full mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map(course => (
              <div key={course.id} className="card hover:shadow-md transition-shadow group">

                {/* Course header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <BookMarked className="w-6 h-6 text-purple-600" />
                  </div>
                  <span className="text-lg font-bold text-primary-600">
                    ${course.price}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                  {course.description}
                </p>

                {/* Interests */}
                {course.interests?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {course.interests.slice(0, 2).map(i => (
                      <span key={i.id}
                        className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">
                        {i.name}
                      </span>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                  <Link
                    to={`/teacher/courses/${course.id}/students`}
                    className="flex items-center gap-1 text-xs text-gray-500
                      hover:text-blue-600 font-medium transition-colors"
                  >
                    <Users className="w-3.5 h-3.5" /> Students
                  </Link>
                  <Link
                    to={`/teacher/courses/${course.id}/groups`}
                    className="flex items-center gap-1 text-xs text-gray-500
                      hover:text-green-600 font-medium transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" /> Groups
                  </Link>
                  <div className="ml-auto flex items-center gap-1">
                    <Link
                      to={`/teacher/courses/${course.id}/edit`}
                      className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400
                        hover:text-blue-600 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(course.id)}
                      disabled={deleting === course.id}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400
                        hover:text-red-500 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center py-12">
            <BookMarked className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-gray-600 font-medium">No courses yet</h3>
            <p className="text-gray-400 text-sm mt-1">
              Create your first course to get started
            </p>
            <Link to="/teacher/courses/new" className="btn-primary inline-flex mt-4 gap-2">
              <Plus className="w-4 h-4" /> Create Course
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
}
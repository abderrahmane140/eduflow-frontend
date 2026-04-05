import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { enrollmentApi } from '../../api/enrollmentApi';
import { courseApi } from '../../api/courseApi';
import { ClipboardList, BookOpen, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MyEnrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    enrollmentApi.myEnrollments()
      .then(({ data }) => setEnrollments(data))
      .catch(() => toast.error('Failed to load enrollments'))
      .finally(() => setLoading(false));
  }, []);

  const handleUnenroll = async (courseId) => {
    if (!confirm('Are you sure you want to unenroll?')) return;
    try {
      await enrollmentApi.unenroll(courseId);
      setEnrollments(prev => prev.filter(e => e.course_id !== courseId));
      toast.success('Successfully unenrolled');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to unenroll');
    }
  };

  const statusBadge = (status) => {
    const styles = {
      paid:      'bg-green-100 text-green-700',
      pending:   'bg-yellow-100 text-yellow-700',
      cancelled: 'bg-red-100 text-red-700',
    };
    return (
      <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${styles[status] || styles.pending}`}>
        {status}
      </span>
    );
  };

  return (
    <Layout>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Enrollments</h1>
            <p className="text-gray-500 mt-1">
              {enrollments.length} enrolled {enrollments.length === 1 ? 'course' : 'courses'}
            </p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <ClipboardList className="w-6 h-6 text-blue-600" />
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => (
              <div key={i} className="card animate-pulse">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-xl" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-1/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : enrollments.length > 0 ? (
          <div className="space-y-4">
            {enrollments.map(enrollment => (
              <div key={enrollment.id} className="card hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">

                  {/* Icon */}
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {enrollment.course?.title}
                      </h3>
                      {statusBadge(enrollment.status)}
                    </div>
                    <div className="flex items-center gap-4 mt-1">
                      <p className="text-sm text-gray-500">
                        {enrollment.course?.teacher?.name}
                      </p>
                      <span className="text-sm font-semibold text-primary-600">
                        ${enrollment.course?.price}
                      </span>
                    </div>
                    {enrollment.enrolled_at && (
                      <p className="text-xs text-gray-400 mt-1">
                        Enrolled: {new Date(enrollment.enrolled_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link
                      to={`/courses/${enrollment.course_id}`}
                      className="btn-secondary text-sm py-1.5 flex items-center gap-1"
                    >
                      View <ArrowRight className="w-3 h-3" />
                    </Link>
                    <button
                      onClick={() => handleUnenroll(enrollment.course_id)}
                      className="p-2 rounded-lg hover:bg-red-50 text-gray-400
                        hover:text-red-500 transition-colors"
                      title="Unenroll"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center py-12">
            <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-gray-600 font-medium">No enrollments yet</h3>
            <p className="text-gray-400 text-sm mt-1">
              Enroll in a course to start learning
            </p>
            <Link to="/courses" className="btn-primary inline-flex mt-4">
              Browse courses
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
}
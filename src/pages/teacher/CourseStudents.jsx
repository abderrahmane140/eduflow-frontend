import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { courseApi } from '../../api/courseApi';
import { ArrowLeft, Users, Mail, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CourseStudents() {
  const { id }      = useParams();
  const navigate    = useNavigate();
  const [students,  setStudents]  = useState([]);
  const [course,    setCourse]    = useState(null);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, courseRes] = await Promise.all([
          courseApi.getStudents(id),
          courseApi.getOne(id),
        ]);
        setStudents(studentsRes.data);
        setCourse(courseRes.data);
      } catch {
        toast.error('Failed to load students');
        navigate('/teacher/courses');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/teacher/courses')}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {course?.title || 'Course'} — Students
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">
              {students.length} enrolled {students.length === 1 ? 'student' : 'students'}
            </p>
          </div>
        </div>

        {/* Students list */}
        <div className="card">
          {loading ? (
            <div className="space-y-4">
              {[1,2,3,4].map(i => (
                <div key={i} className="animate-pulse flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : students.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {students.map((enrollment, index) => (
                <div
                  key={enrollment.id}
                  className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
                >
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center
                    justify-center flex-shrink-0">
                    <span className="text-primary-700 font-semibold text-sm">
                      {enrollment.student?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {enrollment.student?.name}
                    </p>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Mail className="w-3 h-3" />
                      <span className="truncate">{enrollment.student?.email}</span>
                    </div>
                  </div>

                  {/* Status + date */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {enrollment.enrolled_at && (
                      <span className="text-xs text-gray-400 hidden sm:block">
                        {new Date(enrollment.enrolled_at).toLocaleDateString()}
                      </span>
                    )}
                    <div className="flex items-center gap-1 bg-green-100 text-green-700
                      px-2.5 py-1 rounded-full text-xs font-medium">
                      <CheckCircle className="w-3 h-3" />
                      {enrollment.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-gray-600 font-medium">No students yet</h3>
              <p className="text-gray-400 text-sm mt-1">
                Students will appear here once they enroll
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
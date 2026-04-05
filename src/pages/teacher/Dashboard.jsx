import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { courseApi } from '../../api/courseApi';
import {
  BookMarked, Users, TrendingUp, DollarSign,
  ArrowRight, BarChart2, Plus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function TeacherDashboard() {
  const { user }    = useAuth();
  const [stats,     setStats]   = useState(null);
  const [courses,   setCourses] = useState([]);
  const [loading,   setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, coursesRes] = await Promise.all([
          courseApi.getStats(),
          courseApi.getTeacherCourses(),
        ]);
        setStats(statsRes.data);
        setCourses(coursesRes.data);
      } catch {}
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const totalStudents = stats?.reduce((sum, s) => sum + (s.total_students || 0), 0) || 0;
  const totalRevenue  = stats?.reduce((sum, s) => sum + parseFloat(s.total_revenue || 0), 0) || 0;

  const statCards = [
    {
      label: 'Total Courses',
      value: courses.length,
      icon:  BookMarked,
      color: 'bg-purple-50 text-purple-600',
      link:  '/teacher/courses',
    },
    {
      label: 'Total Students',
      value: totalStudents,
      icon:  Users,
      color: 'bg-blue-50 text-blue-600',
      link:  '/teacher/courses',
    },
    {
      label: 'Total Revenue',
      value: `$${totalRevenue.toFixed(2)}`,
      icon:  DollarSign,
      color: 'bg-green-50 text-green-600',
      link:  '/teacher/courses',
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">

        {/* Welcome banner */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <BarChart2 className="w-6 h-6" />
            <span className="text-purple-100 text-sm font-medium">Teacher Portal</span>
          </div>
          <h1 className="text-2xl font-bold mb-1">Welcome, {user?.name}! 👋</h1>
          <p className="text-purple-100">Manage your courses and track student progress.</p>
          <Link
            to="/teacher/courses/new"
            className="inline-flex items-center gap-2 mt-4 bg-white text-purple-600
              px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-50 transition-colors"
          >
            <Plus className="w-4 h-4" /> Create New Course
          </Link>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {statCards.map(({ label, value, icon: Icon, color, link }) => (
            <Link key={label} to={link} className="card hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {loading ? '...' : value}
                  </p>
                  <p className="text-sm text-gray-500">{label}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Course performance table */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Course Performance</h2>
            <Link
              to="/teacher/courses"
              className="text-sm text-primary-600 hover:text-primary-700
                font-medium flex items-center gap-1"
            >
              Manage courses <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => (
                <div key={i} className="animate-pulse flex gap-4">
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                </div>
              ))}
            </div>
          ) : stats?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-3 text-gray-500 font-medium">Course</th>
                    <th className="text-center py-3 text-gray-500 font-medium">Students</th>
                    <th className="text-right py-3 text-gray-500 font-medium">Revenue</th>
                    <th className="text-right py-3 text-gray-500 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.map(stat => (
                    <tr key={stat.course_id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3 font-medium text-gray-900">
                        {stat.course?.title}
                      </td>
                      <td className="py-3 text-center">
                        <span className="bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full text-xs font-medium">
                          {stat.total_students}
                        </span>
                      </td>
                      <td className="py-3 text-right font-semibold text-green-600">
                        ${parseFloat(stat.total_revenue || 0).toFixed(2)}
                      </td>
                      <td className="py-3 text-right">
                        <Link
                          to={`/teacher/courses/${stat.course_id}/students`}
                          className="text-primary-600 hover:text-primary-700 text-xs font-medium"
                        >
                          View students
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <TrendingUp className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No data yet. Create a course to get started.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
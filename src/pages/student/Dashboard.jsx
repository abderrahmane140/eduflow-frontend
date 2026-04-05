import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { useAuth } from '../../context/AuthContext';
import { courseApi } from '../../api/courseApi';
import { enrollmentApi } from '../../api/enrollmentApi';
import { wishlistApi } from '../../api/wishlistApi';
import { BookOpen, Heart, ClipboardList, Star, ArrowRight, TrendingUp } from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [stats,       setStats]       = useState({ courses: 0, wishlist: 0, enrollments: 0 });
  const [recommended, setRecommended] = useState([]);
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [enrollRes, wishRes, recRes] = await Promise.all([
          enrollmentApi.myEnrollments(),
          wishlistApi.getAll(),
          courseApi.getRecommended(),
        ]);
        setStats({
          enrollments: enrollRes.data.length,
          wishlist:    wishRes.data.length,
          courses:     recRes.data?.data?.length || 0,
        });
        setRecommended(recRes.data?.data?.slice(0, 3) || []);
      } catch {}
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const statCards = [
    { label: 'Enrolled Courses', value: stats.enrollments, icon: ClipboardList, color: 'bg-blue-50 text-blue-600',   link: '/my-enrollments' },
    { label: 'Saved Courses',    value: stats.wishlist,    icon: Heart,          color: 'bg-pink-50 text-pink-600',   link: '/wishlist' },
    { label: 'Recommended',      value: stats.courses,     icon: Star,           color: 'bg-amber-50 text-amber-600', link: '/recommended' },
  ];

  return (
    <Layout>
      <div className="space-y-6">

        {/* Welcome */}
        <div className="bg-gradient-to-r from-primary-600 to-indigo-600 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6" />
            <span className="text-primary-100 text-sm font-medium">Welcome back</span>
          </div>
          <h1 className="text-2xl font-bold mb-1">Hello, {user?.name}! 👋</h1>
          <p className="text-primary-100">Continue your learning journey today.</p>
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 mt-4 bg-white text-primary-600
              px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-50 transition-colors"
          >
            Browse Courses <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Stats */}
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

        {/* Recommended courses */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Suggested for you</h2>
            <Link
              to="/recommended"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1,2,3].map(i => (
                <div key={i} className="card animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-1/4" />
                </div>
              ))}
            </div>
          ) : recommended.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recommended.map(course => (
                <Link
                  key={course.id}
                  to={`/courses/${course.id}`}
                  className="card hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-primary-600" />
                    </div>
                    <span className="text-sm font-semibold text-primary-600">
                      ${course.price}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{course.title}</h3>
                  <p className="text-xs text-gray-500">{course.teacher?.name}</p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="card text-center py-8">
              <Star className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No recommendations yet.</p>
              <Link to="/courses" className="text-primary-600 text-sm font-medium mt-1 inline-block">
                Browse all courses
              </Link>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
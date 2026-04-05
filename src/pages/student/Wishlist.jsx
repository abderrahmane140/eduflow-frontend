import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { wishlistApi } from '../../api/wishlistApi';
import { Heart, BookOpen, Trash2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Wishlist() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    wishlistApi.getAll()
      .then(({ data }) => setCourses(data))
      .catch(() => toast.error('Failed to load wishlist'))
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = async (courseId, e) => {
    e.preventDefault();
    try {
      await wishlistApi.remove(courseId);
      setCourses(prev => prev.filter(c => c.id !== courseId));
      toast.success('Removed from wishlist');
    } catch {
      toast.error('Failed to remove');
    }
  };

  return (
    <Layout>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
            <p className="text-gray-500 mt-1">
              {courses.length} saved {courses.length === 1 ? 'course' : 'courses'}
            </p>
          </div>
          <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
            <Heart className="w-6 h-6 text-pink-500 fill-pink-500" />
          </div>
        </div>

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
              <Link
                key={course.id}
                to={`/courses/${course.id}`}
                className="card hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 group relative"
              >
                {/* Remove button */}
                <button
                  onClick={(e) => handleRemove(course.id, e)}
                  className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-red-50
                    text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-pink-600" />
                </div>

                <h3 className="font-semibold text-gray-900 mb-2 pr-8 line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                  {course.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">{course.teacher?.name}</span>
                  <span className="text-sm font-bold text-primary-600">${course.price}</span>
                </div>

                <div className="mt-4 flex items-center gap-1 text-primary-600 text-sm font-medium
                  group-hover:gap-2 transition-all">
                  View course <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="card text-center py-12">
            <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-gray-600 font-medium">Your wishlist is empty</h3>
            <p className="text-gray-400 text-sm mt-1">
              Save courses you're interested in to view them later
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
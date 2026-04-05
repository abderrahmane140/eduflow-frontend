import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { courseApi } from '../../api/courseApi';
import { wishlistApi } from '../../api/wishlistApi';
import { Star, BookOpen, Heart } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Recommended() {
  const [courses,  setCourses]  = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recRes, wishRes] = await Promise.all([
          courseApi.getRecommended(),
          wishlistApi.getAll(),
        ]);
        setCourses(recRes.data?.data || recRes.data || []);
        setWishlist(wishRes.data.map(c => c.id));
      } catch {
        toast.error('Failed to load recommendations');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleWishlist = async (courseId, e) => {
    e.preventDefault();
    const isSaved = wishlist.includes(courseId);
    try {
      if (isSaved) {
        await wishlistApi.remove(courseId);
        setWishlist(prev => prev.filter(id => id !== courseId));
        toast.success('Removed from wishlist');
      } else {
        await wishlistApi.save(courseId);
        setWishlist(prev => [...prev, courseId]);
        toast.success('Saved to wishlist!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <Layout>
      <div className="space-y-6">

        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Star className="w-6 h-6" />
            <span className="text-amber-100 text-sm font-medium">Personalized for you</span>
          </div>
          <h1 className="text-2xl font-bold">Recommended Courses</h1>
          <p className="text-amber-100 mt-1">Based on your interests and preferences</p>
        </div>

        {/* Courses */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3,4,5,6].map(i => (
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
                {/* Wishlist */}
                <button
                  onClick={(e) => toggleWishlist(course.id, e)}
                  className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <Heart className={`w-4 h-4 ${
                    wishlist.includes(course.id)
                      ? 'fill-red-500 text-red-500'
                      : 'text-gray-400'
                  }`} />
                </button>

                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-amber-600" />
                </div>

                <h3 className="font-semibold text-gray-900 mb-2 pr-8 line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                  {course.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">{course.teacher?.name}</span>
                  <span className="text-sm font-bold text-amber-600">${course.price}</span>
                </div>

                {course.interests?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {course.interests.slice(0, 2).map(interest => (
                      <span
                        key={interest.id}
                        className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full"
                      >
                        {interest.name}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <div className="card text-center py-12">
            <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-gray-600 font-medium">No recommendations yet</h3>
            <p className="text-gray-400 text-sm mt-1">
              Update your interests in your profile to get personalized recommendations
            </p>
            <Link to="/courses" className="btn-primary inline-flex mt-4">
              Browse all courses
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
}
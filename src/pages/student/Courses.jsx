// src/pages/student/Courses.jsx

import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { courseApi } from '../../api/courseApi';
import { wishlistApi } from '../../api/wishlistApi';
import { Search, BookOpen, Heart, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

export default function Courses() {
  const [courses,   setCourses]   = useState([]);
  const [interests, setInterests] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [wishlist,  setWishlist]  = useState([]);
  const [meta,      setMeta]      = useState({});
  const [filters,   setFilters]   = useState({
    search:      '',
    interest_id: '',
    min_price:   '',
    max_price:   '',
    page:        1,
  });

  // Load interests for filter
  useEffect(() => {
    api.get('/interests').then(({ data }) => setInterests(data)).catch(() => {});
    wishlistApi.getAll().then(({ data }) => {
      setWishlist(data.map(c => c.id));
    }).catch(() => {});
  }, []);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await courseApi.getAll(filters);
      setCourses(data.data || []);
      setMeta(data.meta || {});
    } catch {
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchCourses(); }, [fetchCourses]);

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

  const handleSearch = (e) => {
    setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }));
  };

  const handleFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  return (
    <Layout>
      <div className="space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Courses</h1>
          <p className="text-gray-500 mt-1">Explore and find your next course</p>
        </div>

        {/* Search & Filters */}
        <div className="card">
          <div className="flex flex-col md:flex-row gap-3">

            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                value={filters.search}
                onChange={handleSearch}
                className="input-field pl-10"
              />
            </div>

            {/* Interest filter */}
            <select
              value={filters.interest_id}
              onChange={e => handleFilter('interest_id', e.target.value)}
              className="input-field md:w-48"
            >
              <option value="">All Topics</option>
              {interests.map(i => (
                <option key={i.id} value={i.id}>{i.name}</option>
              ))}
            </select>

            {/* Price filters */}
            <input
              type="number"
              placeholder="Min price"
              value={filters.min_price}
              onChange={e => handleFilter('min_price', e.target.value)}
              className="input-field md:w-28"
            />
            <input
              type="number"
              placeholder="Max price"
              value={filters.max_price}
              onChange={e => handleFilter('max_price', e.target.value)}
              className="input-field md:w-28"
            />
          </div>
        </div>

        {/* Course grid */}
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
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map(course => (
                <Link
                  key={course.id}
                  to={`/courses/${course.id}`}
                  className="card hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 group relative"
                >
                  {/* Wishlist button */}
                  <button
                    onClick={(e) => toggleWishlist(course.id, e)}
                    className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <Heart className={`w-4 h-4 transition-colors ${
                      wishlist.includes(course.id)
                        ? 'fill-red-500 text-red-500'
                        : 'text-gray-400 group-hover:text-red-400'
                    }`} />
                  </button>

                  {/* Course icon */}
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                    <BookOpen className="w-6 h-6 text-primary-600" />
                  </div>

                  {/* Course info */}
                  <h3 className="font-semibold text-gray-900 mb-2 pr-8 line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                    {course.description}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-xs text-gray-400">{course.teacher?.name}</span>
                    <span className="text-sm font-bold text-primary-600">${course.price}</span>
                  </div>

                  {/* Interests */}
                  {course.interests?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {course.interests.slice(0, 2).map(interest => (
                        <span
                          key={interest.id}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                        >
                          {interest.name}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {meta.last_page > 1 && (
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => handleFilter('page', filters.page - 1)}
                  disabled={filters.page === 1}
                  className="btn-secondary p-2 disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm text-gray-600">
                  Page {filters.page} of {meta.last_page}
                </span>
                <button
                  onClick={() => handleFilter('page', filters.page + 1)}
                  disabled={filters.page === meta.last_page}
                  className="btn-secondary p-2 disabled:opacity-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="card text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-gray-600 font-medium">No courses found</h3>
            <p className="text-gray-400 text-sm mt-1">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
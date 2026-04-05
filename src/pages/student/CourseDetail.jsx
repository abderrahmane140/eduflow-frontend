// src/pages/student/CourseDetail.jsx

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { courseApi } from '../../api/courseApi';
import { wishlistApi } from '../../api/wishlistApi';
import { enrollmentApi } from '../../api/enrollmentApi';
import toast from 'react-hot-toast';
import {
  BookOpen, Heart, Users, Tag, ArrowLeft,
  CheckCircle, Clock, DollarSign, User
} from 'lucide-react';

export default function CourseDetail() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const [course,    setCourse]    = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [inWishlist,setInWishlist]= useState(false);
  const [enrolled,  setEnrolled]  = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const [courseRes, wishRes, enrollRes] = await Promise.all([
          courseApi.getOne(id),
          wishlistApi.getAll(),
          enrollmentApi.myEnrollments(),
        ]);
        setCourse(courseRes.data);
        setInWishlist(wishRes.data.some(c => c.id === parseInt(id)));
        setEnrolled(enrollRes.data.some(e => e.course?.id === parseInt(id)));
      } catch {
        toast.error('Course not found');
        navigate('/courses');
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  const toggleWishlist = async () => {
    try {
      if (inWishlist) {
        await wishlistApi.remove(id);
        setInWishlist(false);
        toast.success('Removed from wishlist');
      } else {
        await wishlistApi.save(id);
        setInWishlist(true);
        toast.success('Saved to wishlist!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    }
  };

  const handleEnroll = async () => {
    setEnrolling(true);
    try {
      await enrollmentApi.enroll({
        course_id:         parseInt(id),
        payment_method_id: 'pm_card_visa', // test card
      });
      setEnrolled(true);
      toast.success('Successfully enrolled! You have been assigned to a group.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Enrollment failed');
    } finally {
      setEnrolling(false);
    }
  };

  const handleUnenroll = async () => {
    if (!confirm('Are you sure you want to unenroll from this course?')) return;
    try {
      await enrollmentApi.unenroll(id);
      setEnrolled(false);
      toast.success('Successfully unenrolled');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to unenroll');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="space-y-4 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/2" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Back button */}
        <button
          onClick={() => navigate('/courses')}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to courses
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left — Course info */}
          <div className="lg:col-span-2 space-y-6">

            {/* Header */}
            <div className="card">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-8 h-8 text-primary-600" />
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {course.title}
                  </h1>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <User className="w-4 h-4" />
                    <span>{course.teacher?.name}</span>
                  </div>
                </div>
              </div>

              {/* Interests/tags */}
              {course.interests?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {course.interests.map(interest => (
                    <span
                      key={interest.id}
                      className="flex items-center gap-1 text-xs bg-primary-50 text-primary-700 px-3 py-1 rounded-full"
                    >
                      <Tag className="w-3 h-3" />
                      {interest.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                About this course
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {course.description || 'No description provided for this course.'}
              </p>
            </div>

            {/* What you'll get */}
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                What's included
              </h2>
              <div className="space-y-3">
                {[
                  'Full access to course materials',
                  'Auto-assigned to a study group',
                  'Certificate upon completion',
                  'Lifetime access',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-600 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — Enrollment card */}
          <div className="space-y-4">
            <div className="card sticky top-6">

              {/* Price */}
              <div className="flex items-center gap-2 mb-6">
                <DollarSign className="w-6 h-6 text-primary-600" />
                <span className="text-3xl font-bold text-gray-900">
                  {course.price}
                </span>
              </div>

              {/* Enroll / Unenroll button */}
              {enrolled ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-3 rounded-lg">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium text-sm">You are enrolled</span>
                  </div>
                  <button
                    onClick={handleUnenroll}
                    className="btn-secondary w-full text-red-600 hover:bg-red-50 border-red-200"
                  >
                    Unenroll from course
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="btn-primary w-full py-3 text-base"
                >
                  {enrolling ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      Processing...
                    </span>
                  ) : 'Enroll Now'}
                </button>
              )}

              {/* Wishlist button */}
              <button
                onClick={toggleWishlist}
                className={`btn-secondary w-full mt-3 flex items-center justify-center gap-2 ${
                  inWishlist ? 'text-red-500 border-red-200 bg-red-50' : ''
                }`}
              >
                <Heart className={`w-4 h-4 ${inWishlist ? 'fill-red-500' : ''}`} />
                {inWishlist ? 'Remove from Wishlist' : 'Save to Wishlist'}
              </button>

              {/* Course details */}
              <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span>Max 25 students per group</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>Lifetime access</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-gray-400" />
                  <span>Certificate included</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
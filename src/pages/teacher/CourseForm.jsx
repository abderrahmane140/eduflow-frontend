import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { courseApi } from '../../api/courseApi';
import { useForm } from 'react-hook-form';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { BookMarked, ArrowLeft, Save, Tag } from 'lucide-react';

export default function CourseForm() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const isEdit     = !!id;
  const [loading,   setLoading]   = useState(false);
  const [fetching,  setFetching]  = useState(isEdit);
  const [interests, setInterests] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Load interests
  useEffect(() => {
    api.get('/interests').then(({ data }) => setInterests(data)).catch(() => {});
  }, []);

  // Load course data for edit
  useEffect(() => {
    if (!isEdit) return;
    courseApi.getOne(id)
      .then(({ data }) => {
        reset({
          title:       data.title,
          description: data.description,
          price:       data.price,
        });
        setSelectedInterests(data.interests?.map(i => i.id) || []);
      })
      .catch(() => {
        toast.error('Failed to load course');
        navigate('/teacher/courses');
      })
      .finally(() => setFetching(false));
  }, [id]);

  const toggleInterest = (interestId) => {
    setSelectedInterests(prev =>
      prev.includes(interestId)
        ? prev.filter(i => i !== interestId)
        : [...prev, interestId]
    );
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = { ...data, interest_ids: selectedInterests };
      if (isEdit) {
        await courseApi.update(id, payload);
        toast.success('Course updated successfully!');
      } else {
        await courseApi.create(payload);
        toast.success('Course created successfully!');
      }
      navigate('/teacher/courses');
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors) {
        Object.values(errors).flat().forEach(msg => toast.error(msg));
      } else {
        toast.error(err.response?.data?.message || 'Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto space-y-4 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="card space-y-4">
            <div className="h-10 bg-gray-200 rounded" />
            <div className="h-24 bg-gray-200 rounded" />
            <div className="h-10 bg-gray-200 rounded w-1/3" />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">

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
              {isEdit ? 'Edit Course' : 'Create Course'}
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">
              {isEdit ? 'Update your course details' : 'Fill in the details for your new course'}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="card space-y-5">

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Laravel API Development"
                className={`input-field ${errors.title ? 'border-red-500' : ''}`}
                {...register('title', { required: 'Title is required' })}
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                rows={4}
                placeholder="Describe what students will learn..."
                className="input-field resize-none"
                {...register('description')}
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (USD) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="49.99"
                  className={`input-field pl-7 ${errors.price ? 'border-red-500' : ''}`}
                  {...register('price', {
                    required: 'Price is required',
                    min: { value: 0, message: 'Price must be positive' },
                  })}
                />
              </div>
              {errors.price && (
                <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>
              )}
            </div>
          </div>

          {/* Interests */}
          {interests.length > 0 && (
            <div className="card">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-4 h-4 text-gray-400" />
                <h3 className="font-medium text-gray-700">Course Topics</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {interests.map(interest => (
                  <button
                    key={interest.id}
                    type="button"
                    onClick={() => toggleInterest(interest.id)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                      selectedInterests.includes(interest.id)
                        ? 'bg-primary-600 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {interest.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Submit */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate('/teacher/courses')}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  {isEdit ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {isEdit ? 'Update Course' : 'Create Course'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
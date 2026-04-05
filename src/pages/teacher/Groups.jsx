import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { groupApi } from '../../api/groupApi';
import { courseApi } from '../../api/courseApi';
import { ArrowLeft, Users, ChevronDown, ChevronUp, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Groups() {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const [groups,  setGroups]  = useState([]);
  const [course,  setCourse]  = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [groupsRes, courseRes] = await Promise.all([
          groupApi.getCourseGroups(id),
          courseApi.getOne(id),
        ]);
        setGroups(groupsRes.data);
        setCourse(courseRes.data);
        // Expand first group by default
        if (groupsRes.data.length > 0) {
          setExpanded({ [groupsRes.data[0].id]: true });
        }
      } catch {
        toast.error('Failed to load groups');
        navigate('/teacher/courses');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const toggleExpand = (groupId) => {
    setExpanded(prev => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const getCapacityColor = (count, max) => {
    const percent = count / max;
    if (percent >= 1)    return 'bg-red-100 text-red-700';
    if (percent >= 0.75) return 'bg-orange-100 text-orange-700';
    return 'bg-green-100 text-green-700';
  };

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
              {course?.title || 'Course'} — Groups
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">
              {groups.length} {groups.length === 1 ? 'group' : 'groups'} — max 25 students each
            </p>
          </div>
        </div>

        {/* Groups */}
        {loading ? (
          <div className="space-y-4">
            {[1,2].map(i => (
              <div key={i} className="card animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-1/4 mb-3" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : groups.length > 0 ? (
          <div className="space-y-4">
            {groups.map(group => (
              <div key={group.id} className="card overflow-hidden">

                {/* Group header */}
                <button
                  onClick={() => toggleExpand(group.id)}
                  className="w-full flex items-center justify-between hover:bg-gray-50
                    -m-6 p-6 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                      <Users className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-900">{group.name}</h3>
                      <p className="text-sm text-gray-500">
                        {group.students_count} / {group.max_students} students
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      getCapacityColor(group.students_count, group.max_students)
                    }`}>
                      {group.students_count >= group.max_students ? 'Full' :
                        `${group.max_students - group.students_count} spots left`}
                    </span>
                    {expanded[group.id]
                      ? <ChevronUp className="w-4 h-4 text-gray-400" />
                      : <ChevronDown className="w-4 h-4 text-gray-400" />
                    }
                  </div>
                </button>

                {/* Capacity bar */}
                <div className="mt-4 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-500 rounded-full transition-all duration-500"
                    style={{ width: `${(group.students_count / group.max_students) * 100}%` }}
                  />
                </div>

                {/* Students list */}
                {expanded[group.id] && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    {group.students?.length > 0 ? (
                      <div className="divide-y divide-gray-50">
                        {group.students.map(student => (
                          <div
                            key={student.id}
                            className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                          >
                            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center
                              justify-center flex-shrink-0">
                              <span className="text-primary-700 font-semibold text-xs">
                                {student.name?.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {student.name}
                              </p>
                              <div className="flex items-center gap-1 text-xs text-gray-400">
                                <Mail className="w-3 h-3" />
                                <span className="truncate">{student.email}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 text-center py-4">
                        No students in this group yet
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center py-12">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-gray-600 font-medium">No groups yet</h3>
            <p className="text-gray-400 text-sm mt-1">
              Groups are created automatically when students enroll
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
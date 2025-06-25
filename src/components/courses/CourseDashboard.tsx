import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCourses, getUserProgress } from '../../services/courseProgressService';
import { Course, UserProgress } from '../../types/courseProgress';
import { useAuth } from '../../lib/AuthContext'; // Corrected path to AuthContext

const CourseDashboard: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth(); // Get current user from auth context

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch courses
        const coursesData = await getCourses();
        setCourses(coursesData);

        // Fetch user progress if user is logged in
        if (user && user._id) {
          const progressData = await getUserProgress(user._id);
          setUserProgress(progressData);
        }

        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Navigate to course detail page
  const handleCourseClick = (courseId: string) => {
    navigate(`/courses/${courseId}`);
  };

  // Calculate progress percentage for a course
  const getProgressPercentage = (courseId: string): number => {
    if (!userProgress) return 0;

    const course = userProgress.courseProgress.find(c => c.courseId === courseId);
    return course ? course.percentComplete : 0;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Learning Dashboard</h1>

      {/* Progress Summary */}
      {userProgress && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Your Progress</h2>
          <div className="flex flex-wrap gap-6">
            <div className="bg-blue-50 p-4 rounded-lg flex-1">
              <p className="text-sm text-gray-600">Total Modules Completed</p>
              <p className="text-3xl font-bold">{userProgress.totalModulesCompleted}</p>
            </div>

            {/* Recent Activity */}
            <div className="bg-green-50 p-4 rounded-lg flex-1">
              <p className="text-sm text-gray-600">Recent Activity</p>
              <ul className="mt-2 space-y-2">
                {userProgress.recentActivity.length > 0 ? (
                  userProgress.recentActivity.map((activity, index) => (
                    <li key={index} className="text-sm">
                      Completed <span className="font-medium">{activity.moduleId.title}</span> in{' '}
                      <span className="font-medium">{activity.courseId.title}</span>
                      <span className="text-xs text-gray-500 block">
                        {new Date(activity.completedAt).toLocaleDateString()}
                      </span>
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-gray-500">No recent activity</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Course List */}
      <h2 className="text-2xl font-semibold mb-4">Available Courses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course._id}
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleCourseClick(course._id)}
          >
            {course.thumbnail ? (
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-40 object-cover"
              />
            ) : (
              <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">No Image</span>
              </div>
            )}

            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>

              {/* Progress bar */}
              {user && (
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Progress</span>
                    <span>{Math.round(getProgressPercentage(course._id))}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${getProgressPercentage(course._id)}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {courses.length === 0 && (
          <p className="text-gray-500 col-span-3 text-center py-8">No courses available yet.</p>
        )}
      </div>
    </div>
  );
};

export default CourseDashboard;

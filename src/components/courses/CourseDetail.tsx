import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getCourseById, getUserProgress } from '../../services/courseProgressService';
import { Course, UserProgress } from '../../types/courseProgress';
import { useAuth } from '../../lib/AuthContext';
import { CheckCircle, Circle } from 'lucide-react';

const CourseDetail: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (!courseId) return;

      try {
        setIsLoading(true);

        const courseData = await getCourseById(courseId);
        setCourse(courseData);

        if (user && user._id) {
          const progressData = await getUserProgress(user._id);
          setUserProgress(progressData);
        }

        setError(null);
      } catch (err) {
        console.error('Error fetching course details:', err);
        setError('Failed to load course details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [courseId, user]);

  const isModuleCompleted = (moduleId: string): boolean => {
    if (!userProgress || !user) return false;

    return userProgress.recentActivity.some(
      activity => activity.moduleId._id === moduleId
    );
  };

  const handleBackToDashboard = () => {
    navigate('/courses');
  };

  const calculateCourseProgress = (): number => {
    if (!userProgress || !courseId) return 0;

    const courseProgressItem = userProgress.courseProgress.find(c => c.courseId === courseId);
    return courseProgressItem ? courseProgressItem.percentComplete : 0;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <span className="block sm:inline">{error || 'Course not found'}</span>
        <button
          className="mt-3 bg-red-500 hover:bg-red-700 text-white py-1 px-3 rounded"
          onClick={handleBackToDashboard}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={handleBackToDashboard}
        className="flex items-center text-primary mb-4 hover:underline"
      >
        ← Back to Courses
      </button>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
            <p className="text-gray-600 mb-4">{course.description}</p>
          </div>

          {course.thumbnail && (
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-32 h-32 object-cover rounded-lg"
            />
          )}
        </div>

        {user && (
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Course Progress</span>
              <span>{Math.round(calculateCourseProgress())}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-primary h-2.5 rounded-full"
                style={{ width: `${calculateCourseProgress()}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-6">Course Modules</h2>

        {Array.isArray(course.modules) && course.modules.length > 0 ? (
          <div className="space-y-4">
            {course.modules.map((module: any) => {
              const isCompleted = isModuleCompleted(module._id);
              return (
                <Link
                  to={`/all-courses/case-interview/${module._id}`}
                  key={module._id}
                  className="block border rounded-lg p-4 hover:bg-gray-50 transition duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {isCompleted ? (
                        <CheckCircle className="text-green-500 mr-3" />
                      ) : (
                        <Circle className="text-gray-400 mr-3" />
                      )}
                      <div>
                        <h3 className="font-medium">{module.title}</h3>
                        {module.duration && (
                          <span className="text-xs text-gray-500">
                            Duration: {module.duration} minutes
                          </span>
                        )}
                      </div>
                    </div>

                    {user && isCompleted && (
                      <span className="text-sm text-green-600">Completed</span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No modules available for this course.</p>
        )}
      </div>
    </div>
  );
};

export default CourseDetail;

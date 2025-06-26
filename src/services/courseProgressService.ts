import { Course, Module, UserProgress } from '../types/courseProgress';
import { axiosInstance } from './axiosSetup';

// Get all courses with basic module info
export const getCourses = async (): Promise<Course[]> => {
  try {
    const response = await axiosInstance.get('/api/courses');
    return response.data;
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};

// Get detailed information about a specific course
export const getCourseById = async (courseId: string): Promise<Course> => {
  try {
    const response = await axiosInstance.get(`/api/courses/${courseId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching course with ID ${courseId}:`, error);
    throw error;
  }
};

// Mark a module as completed for a user
export const markModuleCompleted = async (
  userId: string,
  courseId: string,
  moduleId: string
): Promise<any> => {
  try {
    const response = await axiosInstance.post(`/api/users/${userId}/progress`, {
      courseId,
      moduleId,
    });
    return response.data;
  } catch (error) {
    console.error('Error marking module as completed:', error);
    throw error;
  }
};

// Get user's progress across all courses
export const getUserProgress = async (userId: string): Promise<UserProgress> => {
  try {
    const response = await axiosInstance.get(`/api/progress/${userId}/progress`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching progress for user ${userId}:`, error);
    throw error;
  }
};

// Get course modules with their unlock status for a user
export const getModulesWithStatus = async (
  userId: string,
  courseId: string
): Promise<{
  courseId: string;
  modules: (Module & { isCompleted: boolean; isUnlocked: boolean })[];
  userExperiencePoints: number;
}> => {
  try {
    const response = await axiosInstance.get(`/api/users/${userId}/course/${courseId}/modules`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching modules with status for course ${courseId}:`, error);
    throw error;
  }
};

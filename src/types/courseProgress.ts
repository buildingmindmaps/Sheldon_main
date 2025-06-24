// Types for Course Progress Tracking System

export interface Module {
  _id: string;
  title: string;
  courseId: string;
  order: number;
  duration: number; // duration in minutes
  content?: string;
  resources?: Array<{
    title: string;
    type: string;
    url: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  _id: string;
  title: string;
  description: string;
  slug: string;
  thumbnail?: string;
  modules: Module[] | string[]; // Can be array of IDs or populated Module objects
  createdAt: string;
  updatedAt: string;
}

export interface CompletedModule {
  courseId: string | Course;
  moduleId: string | Module;
  completedAt: string;
}

export interface UserProgress {
  totalModulesCompleted: number;
  recentActivity: Array<{
    courseId: {
      _id: string;
      title: string;
      slug: string;
    };
    moduleId: {
      _id: string;
      title: string;
      order: number;
    };
    completedAt: string;
  }>;
  courseProgress: Array<{
    courseId: string;
    courseTitle: string;
    completedModules: number;
    totalModules: number;
    percentComplete: number;
  }>;
}

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description: string;
  order: number;
}

export interface ISubject {
  _id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  thumbnail: string;
  category: string;
  featured: boolean;
  order: number;
  popularTopics: string[];
}

export interface ILessonResource {
  title: string;
  url: string;
}

export interface ILesson {
  _id: string;
  title: string;
  description: string;
  youtubeVideoId: string;
  duration: string;
  order: number;
  resources: ILessonResource[];
  important: boolean;
}

export interface IModule {
  _id: string;
  title: string;
  description: string;
  order: number;
  lessons: ILesson[];
}

export interface ICourse {
  _id: string;
  title: string;
  slug: string;
  description: string;
  subject: ISubject | string;
  subjectSlug: string;
  instructor: string;
  thumbnail: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  language: string;
  totalDuration: string;
  totalLessons: number;
  featured: boolean;
  tags: string[];
  modules: IModule[];
  createdAt: string;
  updatedAt: string;
}

export interface IOneShot {
  _id: string;
  title: string;
  slug: string;
  description: string;
  subject: ISubject | string;
  subjectSlug: string;
  instructor: string;
  youtubeVideoId: string;
  thumbnail: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  language: string;
  tags: string[];
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CourseProgress {
  courseId: string;
  courseSlug: string;
  courseTitle: string;
  instructor: string;
  subjectName: string;
  subjectSlug: string;
  completedLessonIds: string[];
  lastLessonId?: string;
  lastLessonTitle?: string;
  lastUpdated: number;
}

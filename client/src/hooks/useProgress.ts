import { useState, useEffect, useCallback } from 'react';
import { CourseProgress, ICourse } from '../types';

const STORAGE_KEY = 'techvault_course_progress';

export function useProgress() {
  const [progressMap, setProgressMap] = useState<Record<string, CourseProgress>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progressMap));
    } catch (e) {
      console.error('Failed to save progress to localStorage', e);
    }
  }, [progressMap]);

  const toggleLessonCompleted = useCallback((course: ICourse, lessonId: string) => {
    setProgressMap((prev) => {
      const existing = prev[course._id] || {
        courseId: course._id,
        courseSlug: course.slug,
        courseTitle: course.title,
        instructor: course.instructor,
        subjectName: typeof course.subject === 'object' ? course.subject.name : course.subjectSlug,
        subjectSlug: course.subjectSlug,
        completedLessonIds: [],
        lastUpdated: Date.now()
      };

      const isCompleted = existing.completedLessonIds.includes(lessonId);
      const newCompleted = isCompleted
        ? existing.completedLessonIds.filter((id) => id !== lessonId)
        : [...existing.completedLessonIds, lessonId];

      return {
        ...prev,
        [course._id]: {
          ...existing,
          completedLessonIds: newCompleted,
          lastUpdated: Date.now()
        }
      };
    });
  }, []);

  const markLessonCompleted = useCallback((course: ICourse, lessonId: string) => {
    setProgressMap((prev) => {
      const existing = prev[course._id] || {
        courseId: course._id,
        courseSlug: course.slug,
        courseTitle: course.title,
        instructor: course.instructor,
        subjectName: typeof course.subject === 'object' ? course.subject.name : course.subjectSlug,
        subjectSlug: course.subjectSlug,
        completedLessonIds: [],
        lastUpdated: Date.now()
      };

      if (existing.completedLessonIds.includes(lessonId)) {
        return prev;
      }

      return {
        ...prev,
        [course._id]: {
          ...existing,
          completedLessonIds: [...existing.completedLessonIds, lessonId],
          lastUpdated: Date.now()
        }
      };
    });
  }, []);

  const setLastWatchedLesson = useCallback((course: ICourse, lessonId: string, lessonTitle: string) => {
    setProgressMap((prev) => {
      const existing = prev[course._id] || {
        courseId: course._id,
        courseSlug: course.slug,
        courseTitle: course.title,
        instructor: course.instructor,
        subjectName: typeof course.subject === 'object' ? course.subject.name : course.subjectSlug,
        subjectSlug: course.subjectSlug,
        completedLessonIds: [],
        lastUpdated: Date.now()
      };

      return {
        ...prev,
        [course._id]: {
          ...existing,
          lastLessonId: lessonId,
          lastLessonTitle: lessonTitle,
          lastUpdated: Date.now()
        }
      };
    });
  }, []);

  const getCourseProgress = useCallback(
    (courseId: string) => {
      return progressMap[courseId] || null;
    },
    [progressMap]
  );

  const getRecentCourses = useCallback(() => {
    return Object.values(progressMap).sort((a, b) => b.lastUpdated - a.lastUpdated);
  }, [progressMap]);

  return {
    progressMap,
    toggleLessonCompleted,
    markLessonCompleted,
    setLastWatchedLesson,
    getCourseProgress,
    getRecentCourses
  };
}

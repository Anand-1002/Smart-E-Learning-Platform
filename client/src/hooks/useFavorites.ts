import { useState, useEffect, useCallback } from 'react';
import { ICourse, IOneShot } from '../types';

const FAVORITES_KEY = 'techvault_favorites';

interface FavoriteItems {
  courses: ICourse[];
  oneShots: IOneShot[];
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteItems>(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_KEY);
      return saved ? JSON.parse(saved) : { courses: [], oneShots: [] };
    } catch {
      return { courses: [], oneShots: [] };
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.error('Failed to save favorites to localStorage', e);
    }
  }, [favorites]);

  const isCourseFavorite = useCallback(
    (courseId: string) => {
      return favorites.courses.some((c) => c._id === courseId);
    },
    [favorites.courses]
  );

  const isOneShotFavorite = useCallback(
    (oneShotId: string) => {
      return favorites.oneShots.some((o) => o._id === oneShotId);
    },
    [favorites.oneShots]
  );

  const toggleFavoriteCourse = useCallback((course: ICourse) => {
    setFavorites((prev) => {
      const exists = prev.courses.some((c) => c._id === course._id);
      return {
        ...prev,
        courses: exists ? prev.courses.filter((c) => c._id !== course._id) : [course, ...prev.courses]
      };
    });
  }, []);

  const toggleFavoriteOneShot = useCallback((oneShot: IOneShot) => {
    setFavorites((prev) => {
      const exists = prev.oneShots.some((o) => o._id === oneShot._id);
      return {
        ...prev,
        oneShots: exists ? prev.oneShots.filter((o) => o._id !== oneShot._id) : [oneShot, ...prev.oneShots]
      };
    });
  }, []);

  return {
    favorites,
    isCourseFavorite,
    isOneShotFavorite,
    toggleFavoriteCourse,
    toggleFavoriteOneShot,
    totalFavorites: favorites.courses.length + favorites.oneShots.length
  };
}

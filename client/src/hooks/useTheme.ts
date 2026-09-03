import { useEffect } from 'react';

export const useTheme = () => {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark');
    root.classList.add('light');
    localStorage.setItem('techvault-theme', 'light');
  }, []);

  return {
    theme: 'light' as const,
    toggleTheme: () => {}
  };
};

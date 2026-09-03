import axios from 'axios';
import { ICategory, ISubject, ICourse, IOneShot } from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

export const apiService = {
  // Categories
  getCategories: async () => {
    const res = await api.get<{ success: boolean; data: ICategory[] }>('/categories');
    return res.data.data;
  },

  // Subjects
  getSubjects: async (params?: { category?: string; featured?: boolean; search?: string }) => {
    const res = await api.get<{ success: boolean; count: number; data: ISubject[] }>('/subjects', { params });
    return res.data.data;
  },
  getSubjectBySlug: async (slug: string) => {
    const res = await api.get<{ success: boolean; data: ISubject }>(`/subjects/${slug}`);
    return res.data.data;
  },

  // Courses
  getCourses: async (params?: {
    subject?: string;
    subjectSlug?: string;
    level?: string;
    language?: string;
    featured?: boolean;
    search?: string;
    sort?: string;
    page?: number;
    limit?: number;
  }) => {
    const res = await api.get<{
      success: boolean;
      count: number;
      total: number;
      totalPages: number;
      currentPage: number;
      data: ICourse[];
    }>('/courses', { params });
    return res.data;
  },
  getCourseBySlug: async (slug: string) => {
    const res = await api.get<{ success: boolean; data: ICourse }>(`/courses/${slug}`);
    return res.data.data;
  },
  getCoursesBySubject: async (subjectSlug: string) => {
    const res = await api.get<{ success: boolean; count: number; data: ICourse[] }>(`/courses/subject/${subjectSlug}`);
    return res.data.data;
  },

  // One-Shots
  getOneShots: async (params?: {
    subject?: string;
    subjectSlug?: string;
    level?: string;
    language?: string;
    featured?: boolean;
    search?: string;
    sort?: string;
    page?: number;
    limit?: number;
  }) => {
    const res = await api.get<{
      success: boolean;
      count: number;
      total: number;
      totalPages: number;
      currentPage: number;
      data: IOneShot[];
    }>('/one-shots', { params });
    return res.data;
  },
  getOneShotBySlug: async (slug: string) => {
    const res = await api.get<{ success: boolean; data: IOneShot; related: IOneShot[] }>(`/one-shots/${slug}`);
    return res.data;
  },
  getOneShotsBySubject: async (subjectSlug: string) => {
    const res = await api.get<{ success: boolean; count: number; data: IOneShot[] }>(`/one-shots/subject/${subjectSlug}`);
    return res.data.data;
  },

  // Global Search
  search: async (params: { q: string; type?: 'all' | 'course' | 'one-shot' | 'subject'; subject?: string; level?: string }) => {
    const res = await api.get<{
      success: boolean;
      query: string;
      counts: { total: number; courses: number; oneShots: number; subjects: number };
      data: { courses: ICourse[]; oneShots: IOneShot[]; subjects: ISubject[] };
    }>('/search', { params });
    return res.data;
  }
};

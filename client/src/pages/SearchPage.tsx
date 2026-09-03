import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiService } from '../services/api';
import { ICourse, IOneShot, ISubject } from '../types';
import { CourseCard } from '../components/cards/CourseCard';
import { OneShotCard } from '../components/cards/OneShotCard';
import { SubjectCard } from '../components/cards/SubjectCard';
import { SearchBar } from '../components/layout/SearchBar';
import { SkeletonCard } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { Search, BookOpen, Sparkles, Layers } from 'lucide-react';

export const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [courses, setCourses] = useState<ICourse[]>([]);
  const [oneShots, setOneShots] = useState<IOneShot[]>([]);
  const [subjects, setSubjects] = useState<ISubject[]>([]);
  const [counts, setCounts] = useState({ total: 0, courses: 0, oneShots: 0, subjects: 0 });
  const [activeTab, setActiveTab] = useState<'all' | 'courses' | 'one-shots' | 'subjects'>('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = query ? `Search: "${query}" | TechVault` : 'Search Learning Library | TechVault';

    const doSearch = async () => {
      if (!query.trim()) {
        setCourses([]);
        setOneShots([]);
        setSubjects([]);
        setCounts({ total: 0, courses: 0, oneShots: 0, subjects: 0 });
        return;
      }

      try {
        setLoading(true);
        const res = await apiService.search({ q: query });
        setCourses(res.data.courses);
        setOneShots(res.data.oneShots);
        setSubjects(res.data.subjects);
        setCounts(res.counts);
      } catch (err) {
        console.error('Search query failed', err);
      } finally {
        setLoading(false);
      }
    };

    doSearch();
  }, [query]);

  return (
    <div className="space-y-8">
      {/* Search Bar Header */}
      <div className="max-w-2xl mx-auto space-y-4 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Search Educational Resources
        </h1>
        <SearchBar initialQuery={query} autoFocus />
      </div>

      {query && (
        <div className="space-y-6">
          {/* Result Counts & Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
            <div className="text-sm text-muted-foreground">
              Showing <strong className="text-foreground">{counts.total}</strong> results for{' '}
              <span className="text-accent font-medium">"{query}"</span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  activeTab === 'all'
                    ? 'bg-primary text-primary-foreground font-semibold'
                    : 'bg-secondary text-muted-foreground hover:text-foreground'
                }`}
              >
                All Results ({counts.total})
              </button>
              <button
                onClick={() => setActiveTab('courses')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  activeTab === 'courses'
                    ? 'bg-primary text-primary-foreground font-semibold'
                    : 'bg-secondary text-muted-foreground hover:text-foreground'
                }`}
              >
                Courses ({counts.courses})
              </button>
              <button
                onClick={() => setActiveTab('one-shots')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  activeTab === 'one-shots'
                    ? 'bg-primary text-primary-foreground font-semibold'
                    : 'bg-secondary text-muted-foreground hover:text-foreground'
                }`}
              >
                One-Shots ({counts.oneShots})
              </button>
              <button
                onClick={() => setActiveTab('subjects')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  activeTab === 'subjects'
                    ? 'bg-primary text-primary-foreground font-semibold'
                    : 'bg-secondary text-muted-foreground hover:text-foreground'
                }`}
              >
                Subjects ({counts.subjects})
              </button>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <SkeletonCard key={n} />
              ))}
            </div>
          ) : counts.total === 0 ? (
            <EmptyState
              icon={Search}
              title="No Results Found"
              description={`We couldn't find any courses, one-shots, or subjects matching "${query}". Try searching for computer networks, os, dbms, or algorithms.`}
            />
          ) : (
            <div className="space-y-10">
              {/* Subjects Group */}
              {(activeTab === 'all' || activeTab === 'subjects') && subjects.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                    <Layers className="h-4 w-4 text-accent" />
                    <span>Subjects ({subjects.length})</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {subjects.map((subj) => (
                      <SubjectCard key={subj._id} subject={subj} />
                    ))}
                  </div>
                </div>
              )}

              {/* Courses Group */}
              {(activeTab === 'all' || activeTab === 'courses') && courses.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                    <BookOpen className="h-4 w-4 text-accent" />
                    <span>Full Courses ({courses.length})</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                      <CourseCard key={course._id} course={course} />
                    ))}
                  </div>
                </div>
              )}

              {/* One-Shots Group */}
              {(activeTab === 'all' || activeTab === 'one-shots') && oneShots.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    <span>One-Shot Revision Marathons ({oneShots.length})</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {oneShots.map((oneShot) => (
                      <OneShotCard key={oneShot._id} oneShot={oneShot} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

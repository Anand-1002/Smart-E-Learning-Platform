import React, { useState } from 'react';
import { useFavorites } from '../hooks/useFavorites';
import { CourseCard } from '../components/cards/CourseCard';
import { OneShotCard } from '../components/cards/OneShotCard';
import { EmptyState } from '../components/ui/EmptyState';
import { Bookmark, BookOpen, Sparkles, ShieldCheck } from 'lucide-react';

export const FavoritesPage: React.FC = () => {
  const { favorites } = useFavorites();
  const [activeTab, setActiveTab] = useState<'all' | 'courses' | 'one-shots'>('all');

  const totalCourses = favorites.courses.length;
  const totalOneShots = favorites.oneShots.length;
  const totalItems = totalCourses + totalOneShots;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2 border-b border-border pb-6">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-accent uppercase tracking-wider">
          <Bookmark className="h-4 w-4 fill-current" />
          <span>Local Library</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          Saved Favorites & Bookmarks
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Quickly access your saved courses and one-shot revision sessions. This data is stored strictly on your local browser without any account required.
        </p>
      </div>

      {/* Info Callout */}
      <div className="p-4 rounded-xl border border-border bg-secondary/40 flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 text-accent shrink-0 mt-0.5" />
        <div className="text-xs text-muted-foreground leading-relaxed">
          <strong className="text-foreground">Client-Side Storage:</strong> Your bookmarks are saved in your browser's <code className="bg-secondary px-1.5 py-0.5 rounded text-foreground font-mono text-[11px]">localStorage</code>. They remain available across sessions on this browser without needing any sign-in.
        </div>
      </div>

      {totalItems === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="No Bookmarks Yet"
          description="Click the bookmark icon on any course or one-shot card to pin it here for easy access."
          actionLabel="Explore Courses"
          onAction={() => (window.location.href = '/courses')}
        />
      ) : (
        <div className="space-y-8">
          {/* Tab Selector */}
          <div className="flex items-center gap-2 border-b border-border pb-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'all'
                  ? 'bg-primary text-primary-foreground font-semibold'
                  : 'bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              All Bookmarks ({totalItems})
            </button>
            <button
              onClick={() => setActiveTab('courses')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'courses'
                  ? 'bg-primary text-primary-foreground font-semibold'
                  : 'bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              Courses ({totalCourses})
            </button>
            <button
              onClick={() => setActiveTab('one-shots')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'one-shots'
                  ? 'bg-primary text-primary-foreground font-semibold'
                  : 'bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              One-Shots ({totalOneShots})
            </button>
          </div>

          {/* Courses */}
          {(activeTab === 'all' || activeTab === 'courses') && totalCourses > 0 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-accent" />
                <span>Saved Courses ({totalCourses})</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.courses.map((course) => (
                  <CourseCard key={course._id} course={course} />
                ))}
              </div>
            </div>
          )}

          {/* One-Shots */}
          {(activeTab === 'all' || activeTab === 'one-shots') && totalOneShots > 0 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <span>Saved One-Shots ({totalOneShots})</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.oneShots.map((oneShot) => (
                  <OneShotCard key={oneShot._id} oneShot={oneShot} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

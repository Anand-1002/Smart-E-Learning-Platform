import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { ISubject, ICategory } from '../types';
import { SubjectCard } from '../components/cards/SubjectCard';
import { SkeletonCard } from '../components/ui/Skeleton';
import { Layers } from 'lucide-react';

export const SubjectsPage: React.FC = () => {
  const [subjects, setSubjects] = useState<ISubject[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Subjects & Technical Domains — TechVault';

    const fetchData = async () => {
      try {
        setLoading(true);
        const [subjs, cats] = await Promise.all([
          apiService.getSubjects(),
          apiService.getCategories()
        ]);
        setSubjects(subjs);
        setCategories(cats);
      } catch (err) {
        console.error('Failed to load subjects', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredSubjects = selectedCategory === 'All'
    ? subjects
    : subjects.filter((s) => s.category === selectedCategory);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2 border-b border-border pb-6">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-accent uppercase tracking-wider">
          <Layers className="h-4 w-4" />
          <span>Curated Disciplines</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          Computer Science & Engineering Subjects
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Structured learning roadmaps, full courses, and one-shot revision playlists curated per technical subject.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('All')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-colors shrink-0 ${
            selectedCategory === 'All'
              ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
              : 'bg-secondary text-muted-foreground hover:text-foreground'
          }`}
        >
          All Categories ({subjects.length})
        </button>
        {categories.map((cat) => {
          const count = subjects.filter((s) => s.category === cat.name).length;
          return (
            <button
              key={cat._id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-colors shrink-0 ${
                selectedCategory === cat.name
                  ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                  : 'bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              {cat.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Subjects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <SkeletonCard key={n} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubjects.map((subject) => (
            <SubjectCard key={subject._id} subject={subject} />
          ))}
        </div>
      )}
    </div>
  );
};

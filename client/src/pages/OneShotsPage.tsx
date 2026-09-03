import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { IOneShot, ICategory, ISubject } from '../types';
import { OneShotCard } from '../components/cards/OneShotCard';
import { FilterBar } from '../components/filters/FilterBar';
import { SkeletonCard } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { Pagination } from '../components/ui/Pagination';
import { Sparkles } from 'lucide-react';

export const OneShotsPage: React.FC = () => {
  const [oneShots, setOneShots] = useState<IOneShot[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [subjects, setSubjects] = useState<ISubject[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('All Levels');
  const [selectedSort, setSelectedSort] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    document.title = 'One-Shot Revision Marathons — TechVault';

    const fetchTaxonomy = async () => {
      try {
        const [cats, subjs] = await Promise.all([
          apiService.getCategories(),
          apiService.getSubjects()
        ]);
        setCategories(cats);
        setSubjects(subjs);
      } catch (e) {
        console.error('Failed to load filters', e);
      }
    };

    fetchTaxonomy();
  }, []);

  useEffect(() => {
    const fetchOneShots = async () => {
      try {
        setLoading(true);
        const res = await apiService.getOneShots({
          subjectSlug: selectedSubject || undefined,
          level: selectedLevel !== 'All Levels' ? selectedLevel : undefined,
          sort: selectedSort,
          page: currentPage,
          limit: 9
        });

        let data = res.data;
        if (selectedCategory) {
          data = data.filter((o) => {
            const sObj = typeof o.subject === 'object' ? o.subject : null;
            return sObj?.category === selectedCategory;
          });
        }

        setOneShots(data);
        setTotalPages(res.totalPages || 1);
      } catch (err) {
        console.error('Failed to load one-shots', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOneShots();
  }, [selectedCategory, selectedSubject, selectedLevel, selectedSort, currentPage]);

  const handleResetFilters = () => {
    setSelectedCategory('');
    setSelectedSubject('');
    setSelectedLevel('All Levels');
    setSelectedSort('newest');
    setCurrentPage(1);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2 border-b border-border pb-6">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-500 uppercase tracking-wider">
          <Sparkles className="h-4 w-4" />
          <span>Marathon Revision & Exam Prep</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          One-Shot Revision Lectures
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl">
          High-yield, comprehensive single-video marathons covering full syllabi, formula summaries, and interview crash courses.
        </p>
      </div>

      {/* Filter Bar */}
      <FilterBar
        categories={categories}
        subjects={subjects}
        selectedCategory={selectedCategory}
        selectedSubject={selectedSubject}
        selectedLevel={selectedLevel}
        selectedSort={selectedSort}
        onCategoryChange={(c) => {
          setSelectedCategory(c);
          setCurrentPage(1);
        }}
        onSubjectChange={(s) => {
          setSelectedSubject(s);
          setCurrentPage(1);
        }}
        onLevelChange={(lvl) => {
          setSelectedLevel(lvl);
          setCurrentPage(1);
        }}
        onSortChange={(s) => {
          setSelectedSort(s);
          setCurrentPage(1);
        }}
        onReset={handleResetFilters}
      />

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <SkeletonCard key={n} />
          ))}
        </div>
      ) : oneShots.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title="No One-Shots Found"
          description="Try adjusting your filter preferences."
          actionLabel="Reset Filters"
          onAction={handleResetFilters}
        />
      ) : (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {oneShots.map((oneShot) => (
              <OneShotCard key={oneShot._id} oneShot={oneShot} />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(p) => setCurrentPage(p)}
          />
        </div>
      )}
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiService } from '../services/api';
import { ICourse, IOneShot, ISubject, ICategory } from '../types';
import { CourseCard } from '../components/cards/CourseCard';
import { OneShotCard } from '../components/cards/OneShotCard';
import { FilterBar } from '../components/filters/FilterBar';
import { SkeletonCard } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { Compass, BookOpen, Sparkles } from 'lucide-react';

export const ExplorePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCat = searchParams.get('category') || '';
  const initialSubj = searchParams.get('subject') || '';

  const [courses, setCourses] = useState<ICourse[]>([]);
  const [oneShots, setOneShots] = useState<IOneShot[]>([]);
  const [subjects, setSubjects] = useState<ISubject[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const [selectedSubject, setSelectedSubject] = useState(initialSubj);
  const [selectedLevel, setSelectedLevel] = useState('All Levels');
  const [selectedSort, setSelectedSort] = useState('newest');

  useEffect(() => {
    document.title = 'Explore Discovery Catalog — TechVault';

    const fetchTaxonomy = async () => {
      try {
        const [cats, subjs] = await Promise.all([
          apiService.getCategories(),
          apiService.getSubjects()
        ]);
        setCategories(cats);
        setSubjects(subjs);
      } catch (err) {
        console.error('Failed to load taxonomy', err);
      }
    };

    fetchTaxonomy();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [coursesRes, oneShotsRes] = await Promise.all([
          apiService.getCourses({
            subjectSlug: selectedSubject || undefined,
            level: selectedLevel !== 'All Levels' ? selectedLevel : undefined,
            sort: selectedSort,
            limit: 20
          }),
          apiService.getOneShots({
            subjectSlug: selectedSubject || undefined,
            level: selectedLevel !== 'All Levels' ? selectedLevel : undefined,
            sort: selectedSort,
            limit: 20
          })
        ]);

        let cData = coursesRes.data;
        let oData = oneShotsRes.data;

        if (selectedCategory) {
          cData = cData.filter((c) => {
            const sObj = typeof c.subject === 'object' ? c.subject : null;
            return sObj?.category === selectedCategory;
          });
          oData = oData.filter((o) => {
            const sObj = typeof o.subject === 'object' ? o.subject : null;
            return sObj?.category === selectedCategory;
          });
        }

        setCourses(cData);
        setOneShots(oData);
      } catch (err) {
        console.error('Failed to load explore data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCategory, selectedSubject, selectedLevel, selectedSort]);

  const handleReset = () => {
    setSelectedCategory('');
    setSelectedSubject('');
    setSelectedLevel('All Levels');
    setSelectedSort('newest');
    setSearchParams({});
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2 border-b border-border pb-6">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-accent uppercase tracking-wider">
          <Compass className="h-4 w-4" />
          <span>Full Directory</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          Explore Technical Learning Library
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Browse all technical courses, modules, and one-shot revision sessions filtered by subject, difficulty, and learning style.
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
        onCategoryChange={setSelectedCategory}
        onSubjectChange={setSelectedSubject}
        onLevelChange={setSelectedLevel}
        onSortChange={setSelectedSort}
        onReset={handleReset}
      />

      {/* Grid Results Header */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground font-semibold">
          Showing <span className="text-foreground font-bold">{courses.length + oneShots.length}</span> resources
        </p>
      </div>

      {/* Feed Content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <SkeletonCard key={n} />
          ))}
        </div>
      ) : courses.length === 0 && oneShots.length === 0 ? (
        <EmptyState
          icon={Compass}
          title="No Learning Material Found"
          description="Try adjusting your filter settings to discover more resources."
          actionLabel="Reset Filters"
          onAction={handleReset}
        />
      ) : (
        <div className="space-y-12">
          {/* Courses Section */}
          {courses.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-base font-bold text-foreground">
                  <BookOpen className="h-4 w-4 text-accent" />
                  <span>Structured Courses ({courses.length})</span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <CourseCard key={course._id} course={course} />
                ))}
              </div>
            </div>
          )}

          {/* One-Shots Section */}
          {oneShots.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-base font-bold text-foreground">
                  <Sparkles className="h-4 w-4 text-accent" />
                  <span>One-Shot Revision Sessions ({oneShots.length})</span>
                </div>
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
  );
};

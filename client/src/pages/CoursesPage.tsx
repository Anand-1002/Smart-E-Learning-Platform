import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { ICourse, ICategory, ISubject } from '../types';
import { CourseCard } from '../components/cards/CourseCard';
import { FilterBar } from '../components/filters/FilterBar';
import { SkeletonCard } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { Pagination } from '../components/ui/Pagination';
import { BookOpen } from 'lucide-react';

export const CoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [subjects, setSubjects] = useState<ISubject[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('All Levels');
  const [selectedSort, setSelectedSort] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    document.title = 'Full Technical Courses — TechVault';

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
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await apiService.getCourses({
          subjectSlug: selectedSubject || undefined,
          level: selectedLevel !== 'All Levels' ? selectedLevel : undefined,
          sort: selectedSort,
          page: currentPage,
          limit: 9
        });

        // If category is selected, filter on client side if not directly in subject query
        let data = res.data;
        if (selectedCategory) {
          data = data.filter((c) => {
            const sObj = typeof c.subject === 'object' ? c.subject : null;
            return sObj?.category === selectedCategory;
          });
        }

        setCourses(data);
        setTotalPages(res.totalPages || 1);
      } catch (err) {
        console.error('Failed to load courses', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
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
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-accent uppercase tracking-wider">
          <BookOpen className="h-4 w-4" />
          <span>Curated Curricula</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          Complete Technical Courses
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Multi-module video courses broken down by lesson, with essential concepts highlighted and offline progress tracked.
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

      {/* Courses List */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <SkeletonCard key={n} />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No Courses Match Your Filter"
          description="Try clearing or adjusting your selected categories or subjects."
          actionLabel="Reset Filters"
          onAction={handleResetFilters}
        />
      ) : (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course._id} course={course} />
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

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { ISubject, ICourse, IOneShot, ICategory } from '../types';
import { CourseCard } from '../components/cards/CourseCard';
import { OneShotCard } from '../components/cards/OneShotCard';
import { SubjectCard } from '../components/cards/SubjectCard';
import { CategoryCard } from '../components/cards/CategoryCard';
import { Button } from '../components/ui/Button';
import { SkeletonCard } from '../components/ui/Skeleton';
import { useProgress } from '../hooks/useProgress';
import {
  Sparkles,
  ArrowRight,
  Search,
  ShieldCheck,
  Tv,
  ListTree,
  RotateCcw
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [featuredSubjects, setFeaturedSubjects] = useState<ISubject[]>([]);
  const [popularCourses, setPopularCourses] = useState<ICourse[]>([]);
  const [oneShots, setOneShots] = useState<IOneShot[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);

  const { getRecentCourses } = useProgress();
  const recentCourses = getRecentCourses();

  useEffect(() => {
    document.title = 'TechVault — Curated Technical Learning Library';

    const fetchData = async () => {
      try {
        setLoading(true);
        const [subjRes, coursesRes, oneShotsRes, catRes] = await Promise.all([
          apiService.getSubjects({ featured: true }),
          apiService.getCourses({ featured: true, limit: 6 }),
          apiService.getOneShots({ featured: true, limit: 6 }),
          apiService.getCategories()
        ]);

        setFeaturedSubjects(subjRes);
        setPopularCourses(coursesRes.data);
        setOneShots(oneShotsRes.data);
        setCategories(catRes);
      } catch (err) {
        console.error('Failed to load homepage data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-16">
      {/* Hero Section with 3D Ambient Waves & Neumorphic Search Bar */}
      <section className="relative pt-8 pb-14 sm:pt-14 sm:pb-20 text-center max-w-5xl mx-auto overflow-visible rounded-3xl">
        {/* Left Organic Fluid Ambient Gradient Wave */}
        <div className="absolute -left-28 sm:-left-36 top-1/2 -translate-y-1/2 w-[340px] sm:w-[460px] h-[340px] sm:h-[460px] rounded-full neu-wave-left pointer-events-none select-none -z-10" />

        {/* Right Organic Fluid Ambient Gradient Wave */}
        <div className="absolute -right-28 sm:-right-36 top-1/2 -translate-y-1/2 w-[380px] sm:w-[500px] h-[380px] sm:h-[500px] rounded-full neu-wave-right pointer-events-none select-none -z-10" />

        {/* Bottom Right Floating Glossy 3D Clay Sphere */}
        <div className="hidden lg:block absolute -right-6 2xl:-right-12 bottom-6 pointer-events-none select-none z-20">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full neu-floating-sphere animate-bounce-subtle" />
        </div>

        {/* Center Hero Content */}
        <div className="relative z-20 space-y-6 max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full neu-btn text-xs font-semibold text-muted-foreground">
            <span className="flex h-2.5 w-2.5 rounded-full neu-accent-glow"></span>
            <span className="font-display tracking-wide uppercase text-[11px]">Curated Technical Learning Library</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold tracking-tight text-foreground leading-[1.1]">
            Learn technical subjects. <br />
            <span className="bg-gradient-to-r from-accent via-indigo-500 to-purple-600 bg-clip-text text-transparent">
              All in one place.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed font-body">
            Structured curricula, organized modules, and high-yield one-shot revision videos directly from world-class educators.
          </p>

          {/* Large Neumorphic Search Bar */}
          <div className="pt-2 max-w-2xl mx-auto">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const input = (e.currentTarget.elements.namedItem('search') as HTMLInputElement)?.value;
                if (input?.trim()) {
                  navigate(`/search?q=${encodeURIComponent(input.trim())}`);
                }
              }}
              className="relative flex items-center p-2 rounded-full neu-card transition-all duration-300 hover:shadow-lg"
            >
              <div className="pl-4 pr-3 text-muted-foreground pointer-events-none">
                <Search className="h-5 w-5 text-muted-foreground/70" />
              </div>
              <input
                type="text"
                name="search"
                placeholder="Search for courses, subjects or topics..."
                className="w-full bg-transparent text-foreground placeholder:text-muted-foreground/60 text-sm sm:text-base focus:outline-none pr-4 font-body"
              />
              <button
                type="submit"
                className="flex-shrink-0 w-11 h-11 rounded-full neu-accent-glow flex items-center justify-center text-white shadow-md hover:scale-105 active:scale-95 transition-all duration-200"
                aria-label="Search"
              >
                <ArrowRight className="h-5 w-5 stroke-[2.5]" />
              </button>
            </form>

            {/* Popular Topics Quick Tags */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-5 text-xs text-muted-foreground">
              <span className="font-semibold text-foreground/80">Popular right now:</span>
              {[
                { label: 'DSA', query: 'dsa' },
                { label: 'Web Development', query: 'web' },
                { label: 'Machine Learning', query: 'machine learning' },
                { label: 'System Design', query: 'system design' }
              ].map((item) => (
                <Link
                  key={item.label}
                  to={`/search?q=${encodeURIComponent(item.query)}`}
                  className="px-3.5 py-1 rounded-full neu-btn text-[11px] font-medium text-muted-foreground hover:text-foreground transition-all"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Continue Learning Banner (Neumorphic Card with Inset Progress) */}
      {recentCourses.length > 0 && (
        <section className="p-6 rounded-3xl neu-card">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-accent uppercase tracking-wider font-display">
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Continue Learning</span>
              </div>
              <h3 className="text-xl font-display font-bold text-foreground">
                {recentCourses[0].courseTitle}
              </h3>
              <p className="text-xs text-muted-foreground font-medium">
                {recentCourses[0].completedLessonIds.length} lessons completed
                {recentCourses[0].lastLessonTitle && (
                  <span> · Next up: <strong className="text-foreground">{recentCourses[0].lastLessonTitle}</strong></span>
                )}
              </p>
            </div>
            <Link to={`/courses/${recentCourses[0].courseSlug}`}>
              <Button variant="accent" size="sm">
                Resume Course
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </section>
      )}

      {/* Featured Subjects */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs font-semibold text-accent uppercase tracking-wider">
              Foundations
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-foreground mt-0.5">
              Featured Subjects
            </h2>
          </div>
          <Link
            to="/subjects"
            className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            <span>All Subjects</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((n) => (
              <SkeletonCard key={n} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredSubjects.map((subject) => (
              <SubjectCard key={subject._id} subject={subject} />
            ))}
          </div>
        )}
      </section>

      {/* Popular Courses */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs font-semibold text-accent uppercase tracking-wider">
              Step-by-Step
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-foreground mt-0.5">
              Popular Courses
            </h2>
          </div>
          <Link
            to="/courses"
            className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            <span>View All Courses</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <SkeletonCard key={n} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularCourses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
      </section>

      {/* One-Shot Revision Marathons */}
      <section className="space-y-6 p-6 sm:p-8 rounded-3xl border border-border bg-secondary/30">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-500 uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Exam & Interview Prep</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground mt-0.5">
              High-Yield One-Shot Revisions
            </h2>
            <p className="text-xs text-muted-foreground mt-1 max-w-xl">
              Complete subject marathons and fast crash courses designed for exam revisions, GATE preparation, and technical interviews.
            </p>
          </div>
          <Link
            to="/one-shots"
            className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Browse All One-Shots</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {[1, 2, 3].map((n) => (
              <SkeletonCard key={n} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {oneShots.map((oneShot) => (
              <OneShotCard key={oneShot._id} oneShot={oneShot} />
            ))}
          </div>
        )}
      </section>

      {/* Browse by Category */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs font-semibold text-accent uppercase tracking-wider">
              Taxonomy
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-foreground mt-0.5">
              Browse by Category
            </h2>
          </div>
          <Link
            to="/explore"
            className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            <span>Explore All</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <CategoryCard key={cat._id} category={cat} />
          ))}
        </div>
      </section>

      {/* Value Prop / Why TechVault */}
      <section className="pt-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold text-accent uppercase tracking-wider font-display">
            Curated Library
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-foreground">
            Built for Serious Technical Learning
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            We turn scattered YouTube playlists into structured, accessible engineering curricula with local progress tracking.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl neu-card space-y-3">
            <div className="h-12 w-12 rounded-2xl neu-inset text-accent flex items-center justify-center">
              <ListTree className="h-6 w-6" />
            </div>
            <h4 className="font-display font-bold text-base text-foreground">Structured Curricula</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Every course is divided into sequential modules and labeled lessons with key focus topics.
            </p>
          </div>

          <div className="p-6 rounded-3xl neu-card space-y-3">
            <div className="h-12 w-12 rounded-2xl neu-inset text-purple-400 flex items-center justify-center">
              <Sparkles className="h-6 w-6" />
            </div>
            <h4 className="font-display font-bold text-base text-foreground">One-Shot Discovery</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Quickly find 2–5 hour complete revision marathons before semester exams and technical interviews.
            </p>
          </div>

          <div className="p-6 rounded-3xl neu-card space-y-3">
            <div className="h-12 w-12 rounded-2xl neu-inset text-indigo-400 flex items-center justify-center">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h4 className="font-display font-bold text-base text-foreground">Zero-Auth Privacy</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              No logins, accounts, or cookies required. Your completed lessons and bookmarks stay strictly on your device.
            </p>
          </div>

          <div className="p-6 rounded-3xl neu-card space-y-3">
            <div className="h-12 w-12 rounded-2xl neu-inset text-violet-400 flex items-center justify-center">
              <Tv className="h-6 w-6" />
            </div>
            <h4 className="font-display font-bold text-base text-foreground">Official Embeds</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Clean player respecting original YouTube creator attribution and view metrics.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

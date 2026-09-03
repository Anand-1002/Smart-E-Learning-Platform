import React from 'react';
import { Link } from 'react-router-dom';
import { ICourse } from '../../types';
import { useFavorites } from '../../hooks/useFavorites';
import { useProgress } from '../../hooks/useProgress';
import { Bookmark, Clock, BookOpen, CheckCircle2 } from 'lucide-react';

interface CourseCardProps {
  course: ICourse;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const { isCourseFavorite, toggleFavoriteCourse } = useFavorites();
  const { getCourseProgress } = useProgress();

  const isFavorite = isCourseFavorite(course._id);
  const progress = getCourseProgress(course._id);
  const completedCount = progress?.completedLessonIds.length || 0;
  const progressPercent = course.totalLessons > 0
    ? Math.round((completedCount / course.totalLessons) * 100)
    : 0;

  const subjectName = typeof course.subject === 'object' && course.subject !== null
    ? course.subject.name
    : course.subjectSlug.replace('-', ' ');

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavoriteCourse(course);
  };

  return (
    <Link
      to={`/courses/${course.slug}`}
      className="group flex flex-col rounded-3xl neu-card neu-card-hover p-4 space-y-4 overflow-hidden"
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl neu-inset">
        <img
          src={course.thumbnail || `https://img.youtube.com/vi/${course.modules?.[0]?.lessons?.[0]?.youtubeVideoId}/hqdefault.jpg`}
          alt={course.title}
          loading="lazy"
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out opacity-90 group-hover:opacity-100"
        />
        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full neu-btn bg-background/90 text-foreground backdrop-blur-md">
            {subjectName}
          </span>
          {course.featured && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full neu-accent-glow text-white">
              Featured
            </span>
          )}
        </div>

        {/* Level Tag Bottom Right */}
        <div className="absolute bottom-3 right-3">
          <span className="text-[11px] font-semibold px-3 py-0.5 rounded-full neu-btn bg-background/80 text-foreground backdrop-blur-sm">
            {course.level}
          </span>
        </div>

        {/* Favorite Button Top Right */}
        <button
          onClick={handleFavoriteClick}
          className={`absolute top-3 right-3 p-2 rounded-full neu-btn transition-colors ${
            isFavorite
              ? 'neu-accent-glow text-white'
              : 'bg-background/80 text-foreground hover:scale-105'
          }`}
          aria-label={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
        >
          <Bookmark className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Card Content Area inside an Inner Sunken Tray */}
      <div className="flex flex-1 flex-col justify-between space-y-3 p-3.5 rounded-2xl neu-inset">
        <div>
          <h3 className="font-display font-bold text-base leading-snug line-clamp-2 text-foreground">
            {course.title}
          </h3>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
            By <span className="font-semibold text-foreground/80">{course.instructor}</span>
          </p>
        </div>

        {/* Progress bar if started */}
        {completedCount > 0 && (
          <div className="space-y-1.5 p-2 rounded-xl bg-background/50">
            <div className="flex items-center justify-between text-[11px] text-muted-foreground font-semibold">
              <span className="flex items-center gap-1 text-accent">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {completedCount}/{course.totalLessons} done
              </span>
              <span>{progressPercent}%</span>
            </div>
            <div className="h-1.5 w-full bg-muted/40 rounded-full overflow-hidden">
              <div
                className="h-full neu-accent-glow rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Metadata Footer */}
        <div className="pt-2 border-t border-border/40 flex items-center justify-between text-xs font-semibold text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <BookOpen className="h-4 w-4 text-accent" />
            <span>{course.totalLessons} Lessons</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            <span>{course.totalDuration}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

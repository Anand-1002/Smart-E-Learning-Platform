import React from 'react';
import { Link } from 'react-router-dom';
import { IOneShot } from '../../types';
import { useFavorites } from '../../hooks/useFavorites';
import { Bookmark, Clock, Sparkles } from 'lucide-react';

interface OneShotCardProps {
  oneShot: IOneShot;
}

export const OneShotCard: React.FC<OneShotCardProps> = ({ oneShot }) => {
  const { isOneShotFavorite, toggleFavoriteOneShot } = useFavorites();
  const isFavorite = isOneShotFavorite(oneShot._id);

  const subjectName = typeof oneShot.subject === 'object' && oneShot.subject !== null
    ? oneShot.subject.name
    : oneShot.subjectSlug.replace('-', ' ');

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavoriteOneShot(oneShot);
  };

  return (
    <Link
      to={`/one-shots/${oneShot.slug}`}
      className="group flex flex-col rounded-3xl neu-card neu-card-hover p-4 space-y-4 overflow-hidden"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl neu-inset">
        <img
          src={oneShot.thumbnail || `https://img.youtube.com/vi/${oneShot.youtubeVideoId}/hqdefault.jpg`}
          alt={oneShot.title}
          loading="lazy"
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out opacity-90 group-hover:opacity-100"
        />

        {/* ONE-SHOT Tag Top Left */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="neu-accent-glow text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
            <Sparkles className="h-3 w-3" />
            ONE-SHOT
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full neu-btn bg-background/90 text-foreground backdrop-blur-md">
            {subjectName}
          </span>
        </div>

        {/* Duration bottom right */}
        <div className="absolute bottom-3 right-3">
          <span className="text-[11px] font-semibold px-3 py-0.5 rounded-full neu-btn bg-background/80 text-foreground backdrop-blur-sm flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-accent" />
            {oneShot.duration}
          </span>
        </div>

        {/* Favorite Button */}
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

      {/* Content inside an Inner Sunken Tray */}
      <div className="flex flex-1 flex-col justify-between space-y-3 p-3.5 rounded-2xl neu-inset">
        <div>
          <h3 className="font-display font-bold text-base leading-snug line-clamp-2 text-foreground">
            {oneShot.title}
          </h3>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
            By <span className="font-semibold text-foreground/80">{oneShot.instructor}</span>
          </p>
        </div>

        <div className="pt-2 border-t border-border/40 flex items-center justify-between text-xs font-semibold text-muted-foreground">
          <span className="px-3 py-1 rounded-full bg-background/60 text-[11px]">
            {oneShot.level}
          </span>
          <span className="text-accent text-xs font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            Watch Revision →
          </span>
        </div>
      </div>
    </Link>
  );
};

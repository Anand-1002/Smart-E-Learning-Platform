import React from 'react';
import { Link } from 'react-router-dom';
import { ICategory } from '../../types';
import { FolderGit2, ArrowUpRight } from 'lucide-react';

interface CategoryCardProps {
  category: ICategory;
  count?: number;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, count }) => {
  return (
    <Link
      to={`/explore?category=${encodeURIComponent(category.name)}`}
      className="group relative flex flex-col p-6 rounded-3xl neu-card neu-card-hover space-y-3"
    >
      <div className="flex items-center justify-between">
        <div className="h-12 w-12 rounded-2xl neu-inset text-accent group-hover:scale-105 flex items-center justify-center transition-all duration-200">
          <FolderGit2 className="h-6 w-6" />
        </div>
        <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
      </div>

      {/* Inner Sunken Content Tray */}
      <div className="flex-1 space-y-2.5 p-4 rounded-2xl neu-inset">
        <h3 className="font-display font-bold text-base text-foreground transition-colors">
          {category.name}
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {category.description}
        </p>

        {count !== undefined && (
          <span className="text-[10px] font-bold uppercase tracking-wider text-accent bg-background/80 px-3 py-1 rounded-full inline-block mt-1">
            {count} resources
          </span>
        )}
      </div>
    </Link>
  );
};

import React from 'react';
import { cn } from '../../lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Skeleton: React.FC<SkeletonProps> = ({ className, ...props }) => {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-secondary/80 dark:bg-secondary/40', className)}
      {...props}
    />
  );
};

export const SkeletonCard: React.FC = () => {
  return (
    <div className="flex flex-col rounded-xl border border-border bg-card p-4 space-y-4">
      <Skeleton className="h-44 w-full rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-6 w-5/6" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="pt-2 flex justify-between items-center border-t border-border/50">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
      </div>
    </div>
  );
};

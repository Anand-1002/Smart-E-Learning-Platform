import React from 'react';
import { cn } from '../../lib/utils';

interface ProgressBarProps {
  value: number; // 0 to 100
  className?: string;
  showText?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  className,
  showText = false
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round(value)));

  return (
    <div className={cn('w-full space-y-1', className)}>
      <div className="h-2 w-full overflow-hidden rounded-full neu-inset p-0.5">
        <div
          className="h-full neu-accent-glow rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showText && (
        <div className="flex justify-between text-xs text-muted-foreground font-medium">
          <span>Progress</span>
          <span>{percentage}%</span>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const variantStyles = {
      primary: 'neu-btn text-foreground font-semibold hover:text-accent active:neu-inset',
      secondary: 'neu-btn bg-secondary/60 text-secondary-foreground font-medium',
      outline: 'neu-btn text-foreground font-medium',
      ghost: 'text-muted-foreground hover:text-foreground hover:neu-btn',
      accent: 'neu-accent-glow text-white font-bold hover:brightness-105 active:scale-[0.98]'
    };

    const sizeStyles = {
      sm: 'h-8 px-4 text-xs rounded-full',
      md: 'h-10 px-5 py-2 text-sm rounded-full',
      lg: 'h-12 px-7 text-base rounded-full font-medium',
      icon: 'h-9 w-9 p-0 rounded-full flex items-center justify-center'
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

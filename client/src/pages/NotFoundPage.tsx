import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Compass, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  useEffect(() => {
    document.title = '404 — Page Lost | TechVault';
  }, []);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-6 max-w-md mx-auto">
      <div className="h-16 w-16 rounded-2xl bg-secondary flex items-center justify-center text-muted-foreground font-mono text-xl font-bold border border-border">
        404
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Looks like this lesson got lost.
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          The curriculum or video you were looking for doesn't exist or may have been reorganized.
        </p>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Link to="/">
          <Button variant="primary" size="sm">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
        <Link to="/explore">
          <Button variant="outline" size="sm">
            <Compass className="h-4 w-4" />
            Explore Directory
          </Button>
        </Link>
      </div>
    </div>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import { ISubject } from '../../types';
import {
  Network,
  Cpu,
  Database,
  Binary,
  Layers,
  Cloud,
  BrainCircuit,
  Code,
  BookOpen,
  ArrowRight
} from 'lucide-react';

interface SubjectCardProps {
  subject: ISubject;
}

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Network,
  Cpu,
  Database,
  Binary,
  Layers,
  Cloud,
  BrainCircuit,
  Code,
  BookOpen
};

export const SubjectCard: React.FC<SubjectCardProps> = ({ subject }) => {
  const IconComponent = iconMap[subject.icon] || BookOpen;

  return (
    <Link
      to={`/subjects/${subject.slug}`}
      className="group relative flex flex-col p-6 rounded-3xl neu-card neu-card-hover space-y-4"
    >
      <div className="flex items-start justify-between">
        <div className="h-14 w-14 rounded-2xl neu-inset text-accent group-hover:scale-105 flex items-center justify-center transition-all duration-200">
          <IconComponent className="h-7 w-7" />
        </div>
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider neu-btn px-3 py-1 rounded-full">
          {subject.category}
        </span>
      </div>

      {/* Inner Sunken Content Tray */}
      <div className="flex-1 space-y-3 p-4 rounded-2xl neu-inset">
        <h3 className="font-display font-bold text-lg text-foreground flex items-center justify-between">
          <span>{subject.name}</span>
          <ArrowRight className="h-4 w-4 text-accent opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {subject.description}
        </p>

        {subject.popularTopics && subject.popularTopics.length > 0 && (
          <div className="pt-2.5 border-t border-border/40 flex flex-wrap gap-1.5">
            {subject.popularTopics.slice(0, 3).map((topic, i) => (
              <span
                key={i}
                className="text-[10px] font-semibold text-muted-foreground bg-background/70 px-2.5 py-0.5 rounded-full"
              >
                {topic}
              </span>
            ))}
            {subject.popularTopics.length > 3 && (
              <span className="text-[10px] text-muted-foreground/80 px-1 py-0.5 font-medium">
                +{subject.popularTopics.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
};

import React from 'react';
import { IModule, ILesson } from '../../types';
import {
  CheckCircle,
  Circle,
  Play,
  FileText,
  Clock,
  Sparkles,
  ChevronDown
} from 'lucide-react';

interface CourseCurriculumProps {
  modules: IModule[];
  currentLesson: ILesson | null;
  completedLessonIds: string[];
  onSelectLesson: (lesson: ILesson) => void;
  onToggleComplete: (lessonId: string) => void;
}

export const CourseCurriculum: React.FC<CourseCurriculumProps> = ({
  modules,
  currentLesson,
  completedLessonIds,
  onSelectLesson,
  onToggleComplete
}) => {
  const [openModuleIndex, setOpenModuleIndex] = React.useState<number>(0);

  const toggleModule = (index: number) => {
    setOpenModuleIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <div className="space-y-4 rounded-3xl neu-card p-5">
      <div className="flex items-center justify-between pb-3 border-b border-border/40">
        <div>
          <h3 className="font-display font-bold text-base text-foreground">Course Content</h3>
          <p className="text-xs text-muted-foreground mt-0.5 font-medium">
            {modules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0)} Lessons across {modules.length} Modules
          </p>
        </div>
        <span className="text-xs font-bold px-3 py-1 rounded-full neu-inset text-accent">
          {completedLessonIds.length} done
        </span>
      </div>

      <div className="space-y-3 pt-1">
        {modules.map((module, modIndex) => {
          const isOpen = openModuleIndex === modIndex;
          const completedInModule = module.lessons.filter((l) =>
            completedLessonIds.includes(l._id)
          ).length;

          return (
            <div
              key={module._id || modIndex}
              style={{
                maxHeight: isOpen ? '600px' : '76px',
                transition: 'max-height 320ms cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              className={`p-1.5 neu-btn rounded-2xl overflow-hidden flex flex-col transition-all duration-300 ${
                isOpen ? 'ring-1 ring-accent/20' : ''
              }`}
            >
              <div
                style={{
                  maxHeight: isOpen ? '580px' : '64px',
                  transition: 'max-height 320ms cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                className={`neu-inset w-full rounded-xl overflow-hidden flex flex-col ${
                  isOpen ? '' : 'cursor-pointer hover:brightness-95'
                }`}
                onClick={() => {
                  if (!isOpen) toggleModule(modIndex);
                }}
              >
                {/* Module Header Accordion Trigger (Fixed 64px Height) */}
                <div
                  onClick={(e) => {
                    if (isOpen) {
                      e.stopPropagation();
                      toggleModule(modIndex);
                    }
                  }}
                  className="h-16 min-h-[64px] px-4 flex items-center justify-between cursor-pointer select-none border-b border-transparent transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 pr-2">
                    <span className="text-muted-foreground shrink-0">
                      <ChevronDown
                        style={{ transition: 'transform 320ms cubic-bezier(0.4, 0, 0.2, 1)' }}
                        className={`h-4 w-4 ${isOpen ? 'rotate-180 text-accent' : 'rotate-0'}`}
                      />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h4 className={`font-display font-bold text-xs sm:text-sm leading-snug transition-colors ${
                        isOpen ? 'text-accent' : 'text-foreground'
                      }`}>
                        {module.title}
                      </h4>
                      {module.description && (
                        <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                          {module.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-[11px] font-bold text-muted-foreground whitespace-nowrap pl-2">
                    {completedInModule}/{module.lessons.length}
                  </div>
                </div>

                {/* Module Lessons List inside sunken accordion */}
                <div
                  style={{
                    opacity: isOpen ? 1 : 0,
                    transition: 'opacity 220ms ease-in-out'
                  }}
                  className="px-2.5 pb-2.5 overflow-hidden"
                >
                  <div className="space-y-1.5 pt-2 border-t border-border/40">
                    {module.lessons.map((lesson, lessonIndex) => {
                      const isSelected = currentLesson?._id === lesson._id;
                      const isCompleted = completedLessonIds.includes(lesson._id);

                      return (
                        <div
                          key={lesson._id || lessonIndex}
                          onClick={() => onSelectLesson(lesson)}
                          className={`flex items-start justify-between p-3 rounded-xl cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-background/80 ring-1 ring-accent/30 shadow-sm'
                              : 'hover:bg-foreground/5'
                          }`}
                        >
                          <div className="flex items-start gap-3 flex-1 pr-2">
                            {/* Complete Checkbox */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onToggleComplete(lesson._id);
                              }}
                              className="mt-0.5 text-muted-foreground hover:text-accent transition-colors"
                              title={isCompleted ? 'Mark as incomplete' : 'Mark as completed'}
                            >
                              {isCompleted ? (
                                <CheckCircle className="h-4 w-4 text-accent fill-accent/20" />
                              ) : (
                                <Circle className="h-4 w-4 text-muted-foreground/60" />
                              )}
                            </button>

                            {/* Lesson Info */}
                            <div className="flex-1 space-y-0.5">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span
                                  className={`text-xs font-semibold ${
                                    isSelected ? 'text-accent font-bold' : 'text-foreground'
                                  }`}
                                >
                                  {lesson.title}
                                </span>
                                {lesson.important && (
                                  <span className="text-[9px] font-bold px-2 py-0.2 rounded-full neu-accent-glow text-white flex items-center gap-0.5">
                                    <Sparkles className="h-2.5 w-2.5" />
                                    KEY
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-3 text-[11px] text-muted-foreground font-medium">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {lesson.duration}
                                </span>
                                {lesson.resources && lesson.resources.length > 0 && (
                                  <span className="flex items-center gap-1 text-accent font-semibold">
                                    <FileText className="h-3 w-3" />
                                    {lesson.resources.length} res
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Active playing indicator */}
                          {isSelected && (
                            <div className="h-6 w-6 rounded-full neu-accent-glow text-white flex items-center justify-center shrink-0 shadow-sm">
                              <Play className="h-3 w-3 fill-current ml-0.5" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

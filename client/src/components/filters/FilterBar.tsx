import React, { useState, useRef, useEffect } from 'react';
import { RotateCcw, ChevronDown, Check } from 'lucide-react';
import { Button } from '../ui/Button';
import { ICategory, ISubject } from '../../types';

interface FilterBarProps {
  categories: ICategory[];
  subjects: ISubject[];
  selectedCategory: string;
  selectedSubject: string;
  selectedLevel?: string;
  selectedSort: string;
  onCategoryChange: (category: string) => void;
  onSubjectChange: (subject: string) => void;
  onLevelChange?: (level: string) => void;
  onSortChange: (sort: string) => void;
  onReset: () => void;
}

interface CustomSelectProps {
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
}

const CustomDropdown: React.FC<CustomSelectProps> = ({ label, value, options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);
  const displayLabel = selectedOption && selectedOption.value ? selectedOption.label : label;

  return (
    <div
      ref={dropdownRef}
      style={{
        maxHeight: isOpen ? '300px' : '56px',
        transition: 'max-height 280ms cubic-bezier(0.4, 0, 0.2, 1)'
      }}
      className={`p-1.5 neu-btn w-52 sm:w-56 rounded-[28px] self-start overflow-hidden flex flex-col ${
        isOpen ? 'ring-1 ring-accent/20' : ''
      }`}
    >
      <div
        style={{
          maxHeight: isOpen ? '280px' : '44px',
          transition: 'max-height 280ms cubic-bezier(0.4, 0, 0.2, 1)'
        }}
        className={`neu-inset w-full rounded-[22px] overflow-hidden flex flex-col ${
          isOpen ? 'ring-1 ring-accent/20' : 'cursor-pointer hover:brightness-95'
        }`}
        onClick={() => {
          if (!isOpen) setIsOpen(true);
        }}
      >
        {/* Fixed Height Trigger Header (44px) */}
        <div
          onClick={(e) => {
            if (isOpen) {
              e.stopPropagation();
              setIsOpen(false);
            }
          }}
          className="h-11 min-h-[44px] px-5 flex items-center justify-between gap-2 cursor-pointer select-none border-b border-transparent transition-colors"
        >
          <span
            className={`text-xs font-bold truncate transition-colors ${
              isOpen || (selectedOption && selectedOption.value) ? 'text-accent' : 'text-foreground'
            }`}
          >
            {displayLabel}
          </span>
          <ChevronDown
            style={{ transition: 'transform 280ms cubic-bezier(0.4, 0, 0.2, 1)' }}
            className={`h-3.5 w-3.5 text-muted-foreground shrink-0 ${
              isOpen ? 'rotate-180 text-accent' : 'rotate-0'
            }`}
          />
        </div>

        {/* Options List Container */}
        <div
          style={{
            opacity: isOpen ? 1 : 0,
            transition: 'opacity 180ms ease-in-out'
          }}
          className="px-2.5 pb-2.5 overflow-hidden"
        >
          <div className="pt-1.5 border-t border-border/40 max-h-48 overflow-y-auto space-y-1 pr-1">
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors duration-150 ${
                    isSelected
                      ? 'neu-accent-glow text-white shadow-sm'
                      : 'text-foreground hover:bg-foreground/5 hover:text-accent'
                  }`}
                >
                  <span className="truncate">{option.label}</span>
                  {isSelected && <Check className="h-3.5 w-3.5 text-white shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export const FilterBar: React.FC<FilterBarProps> = ({
  categories,
  subjects,
  selectedCategory,
  selectedSubject,
  selectedSort,
  onCategoryChange,
  onSubjectChange,
  onSortChange,
  onReset
}) => {
  const sorts = [
    { label: 'Newest', value: 'newest' },
    { label: 'Most Popular', value: 'popular' },
    { label: 'Total Lessons', value: 'lessons' }
  ];

  const categoryOptions = [
    { label: 'All Categories', value: '' },
    ...categories.map((c) => ({ label: c.name, value: c.name }))
  ];

  const subjectOptions = [
    { label: 'All Subjects', value: '' },
    ...subjects.map((s) => ({ label: s.name, value: s.slug }))
  ];

  const hasActiveFilters =
    Boolean(selectedCategory) ||
    Boolean(selectedSubject) ||
    selectedSort !== 'newest';

  return (
    <div className="flex flex-wrap items-start gap-4 py-2">
      {/* Category Dropdown */}
      <CustomDropdown
        label="All Categories"
        value={selectedCategory}
        options={categoryOptions}
        onChange={onCategoryChange}
      />

      {/* Subject Dropdown */}
      <CustomDropdown
        label="All Subjects"
        value={selectedSubject}
        options={subjectOptions}
        onChange={onSubjectChange}
      />

      {/* Sort Dropdown */}
      <CustomDropdown
        label="Sort by"
        value={selectedSort}
        options={sorts}
        onChange={onSortChange}
      />

      {/* Reset Filters */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="text-xs h-11 px-5 text-muted-foreground hover:text-foreground neu-btn rounded-full font-semibold self-start"
        >
          <RotateCcw className="h-3.5 w-3.5 mr-1" />
          Reset
        </Button>
      )}
    </div>
  );
};

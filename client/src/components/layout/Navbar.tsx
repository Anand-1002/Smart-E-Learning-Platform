import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useFavorites } from '../../hooks/useFavorites';
import {
  BookOpen,
  Compass,
  Layers,
  Sparkles,
  Bookmark,
  Menu,
  X
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { totalFavorites } = useFavorites();

  const navLinks = [
    { name: 'Explore', path: '/explore', icon: Compass },
    { name: 'Courses', path: '/courses', icon: BookOpen },
    { name: 'One-Shots', path: '/one-shots', icon: Sparkles },
    { name: 'Subjects', path: '/subjects', icon: Layers }
  ];

  const getActiveIndex = () => {
    if (location.pathname === '/explore') return 0;
    if (location.pathname.startsWith('/courses')) return 1;
    if (location.pathname.startsWith('/one-shots')) return 2;
    if (location.pathname.startsWith('/subjects')) return 3;
    return -1;
  };

  const activeIndex = getActiveIndex();

  return (
    <header className="sticky top-4 z-40 w-full px-4 sm:px-6 lg:px-8 mb-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* PART 1: LEFT SIDE - App Logo Pill matching Favorites dimensions & larger text */}
        <div className="flex items-center">
          <div className="flex items-center p-1.5 rounded-full neu-btn">
            <Link
              to="/"
              className="flex items-center justify-center px-5 py-2.5 rounded-full neu-inset hover:brightness-95 transition-all group"
            >
              <span className="font-display font-extrabold text-lg tracking-wider neu-text-indent uppercase select-none leading-none">
                TECHVAULT
              </span>
            </Link>
          </div>
        </div>

        {/* PART 2: CENTER - Neumorphic Pill with Inner Sunken Indent & Flush Sliding Active Indicator */}
        <div className="hidden md:flex items-center p-1.5 rounded-full neu-btn">
          <nav className="relative flex items-center rounded-full neu-inset overflow-hidden">
            {/* 100% Flush Sliding Active Pill Background */}
            {activeIndex !== -1 && (
              <div
                className="absolute inset-y-0 rounded-full neu-accent-glow transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]"
                style={{
                  left: `${activeIndex * 25}%`,
                  width: `25%`
                }}
              />
            )}

            {navLinks.map((link, index) => {
              const Icon = link.icon;
              const active = activeIndex === index;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative z-10 flex items-center justify-center gap-2 w-28 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-colors duration-200 select-none ${
                    active
                      ? 'text-white'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* PART 3: RIGHT SIDE - Favorites Neumorphic Pill with Inner Sunken Indent */}
        <div className="flex items-center gap-3">
          <div className="flex items-center p-1.5 rounded-full neu-btn">
            <Link
              to="/favorites"
              className={`relative flex items-center gap-2 px-5 py-2.5 rounded-full neu-inset text-xs font-semibold transition-all ${
                location.pathname === '/favorites'
                  ? 'text-accent ring-1 ring-accent/30'
                  : 'text-muted-foreground hover:text-foreground hover:brightness-95'
              }`}
              title="Saved Favorites"
            >
              <Bookmark className={`h-4 w-4 ${location.pathname === '/favorites' ? 'fill-current text-accent' : ''}`} />
              <span className="hidden sm:inline">Favorites</span>
              {totalFavorites > 0 && (
                <span className="h-5 min-w-5 px-1.5 flex items-center justify-center text-[10px] font-bold rounded-full neu-accent-glow text-white">
                  {totalFavorites}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-3 md:hidden rounded-full neu-btn text-muted-foreground hover:text-foreground"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 p-5 rounded-3xl neu-card space-y-2.5 animate-in slide-in-from-top-2 duration-200">
          {navLinks.map((link, index) => {
            const Icon = link.icon;
            const active = activeIndex === index;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-5 py-3 rounded-full text-sm font-semibold transition-colors ${
                  active
                    ? 'neu-accent-glow text-white'
                    : 'neu-btn text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
                {link.name}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};

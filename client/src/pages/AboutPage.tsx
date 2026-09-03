import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import {
  BookOpen,
  Shield,
  Layers,
  Youtube
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  useEffect(() => {
    document.title = 'About TechVault & Educational Vision';
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Hero */}
      <div className="space-y-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-card text-xs font-medium text-accent">
          <span>Our Product Philosophy</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
          Why We Built TechVault
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          Finding world-class technical explanations and comprehensive engineering lectures shouldn't require opening twenty disorganized browser tabs.
        </p>
      </div>

      {/* Narrative Section */}
      <div className="p-8 rounded-3xl border border-border bg-card space-y-6">
        <h2 className="text-2xl font-bold text-foreground">The Problem in Tech Education</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          YouTube hosts arguably the world's most brilliant educators — from legendary university professors to independent engineers explaining distributed consensus or kernel architecture on digital whiteboards.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          However, algorithmic recommendation feeds are optimized for engagement rather than structured, sequential retention. Students frequently struggle with:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl border border-border bg-secondary/30 space-y-1">
            <span className="font-semibold text-sm text-foreground">Fragmented Playlists</span>
            <p className="text-xs text-muted-foreground">
              Essential prerequisites scattered across multiple creators without clear taxonomy.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-secondary/30 space-y-1">
            <span className="font-semibold text-sm text-foreground">One-Shot Discovery Friction</span>
            <p className="text-xs text-muted-foreground">
              Difficulty finding high-yield revision marathons right before exams or interviews.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-secondary/30 space-y-1">
            <span className="font-semibold text-sm text-foreground">Algorithmic Distractions</span>
            <p className="text-xs text-muted-foreground">
              Sidebar clickbait and endless scroll distracting learners from linear curriculum progress.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-secondary/30 space-y-1">
            <span className="font-semibold text-sm text-foreground">Account Fatigue & Paywalls</span>
            <p className="text-xs text-muted-foreground">
              Platforms requiring signups, credit cards, or spamming marketing emails for free content.
            </p>
          </div>
        </div>
      </div>

      {/* Core Architectural Pillars */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Our Architectural Principles</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border border-border bg-card space-y-3">
            <div className="h-10 w-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center font-bold">
              <Layers className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-base text-foreground">1. Curation Over Clutter</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Every course on TechVault is hand-picked for clarity, audio quality, and depth. No noise, just engineering rigor.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-border bg-card space-y-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
              <Shield className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-base text-foreground">2. Zero Authentication</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              No account creation, passwords, or tracking cookies. Your learning progress and saved bookmarks remain completely in your browser's local storage.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-border bg-card space-y-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
              <Youtube className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-base text-foreground">3. Official YouTube Embeds</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We never host or download video files. All streams use YouTube's official player API, ensuring original creators receive views, ad revenue, and full credit.
            </p>
          </div>
        </div>
      </div>

      {/* Attribution & Legal Notice */}
      <div className="p-6 rounded-2xl border border-border/80 bg-secondary/30 space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
          Attribution & Copyright Notice
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          TechVault is an open educational index and curated learning interface. All trademarks, videos, audio, and visual content belong to their respective creators and YouTube LLC. If you are a creator and wish to adjust how your public playlist is cataloged, you can always link directly back to your channel.
        </p>
      </div>

      {/* Bottom CTA */}
      <div className="text-center pt-4">
        <Link to="/courses">
          <Button variant="primary" size="lg">
            <BookOpen className="h-4 w-4" />
            Start Learning Now
          </Button>
        </Link>
      </div>
    </div>
  );
};

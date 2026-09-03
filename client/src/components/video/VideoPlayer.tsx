import React, { useState, useEffect, useRef } from 'react';
import { Play, ExternalLink, RefreshCw } from 'lucide-react';
import { getYouTubeThumbnail } from '../../lib/utils';

// Declare YouTube global for TypeScript
declare global {
  interface Window {
    YT?: {
      Player: new (
        elementId: string | HTMLElement,
        config: {
          videoId?: string;
          events?: {
            onReady?: (event: any) => void;
            onStateChange?: (event: any) => void;
          };
          playerVars?: Record<string, any>;
        }
      ) => any;
      PlayerState?: {
        PLAYING: number;
        PAUSED: number;
        ENDED: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface VideoPlayerProps {
  videoId: string;
  title: string;
  autoPlay?: boolean;
  className?: string;
  onProgress?: (progressPercent: number) => void;
  onComplete?: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoId,
  title,
  autoPlay = false,
  className = '',
  onProgress,
  onComplete
}) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [imgError, setImgError] = useState(false);
  const playerRef = useRef<any>(null);
  const containerId = useRef(`yt-player-${Math.random().toString(36).substring(2, 9)}`);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const completedTriggered = useRef(false);

  const thumbnailUrl = !imgError && videoId
    ? getYouTubeThumbnail(videoId, 'hq')
    : '';

  const youtubeWatchUrl = `https://www.youtube.com/watch?v=${videoId}`;

  // Keep latest callbacks in refs to avoid recreating player when parent state changes
  const onProgressRef = useRef(onProgress);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onProgressRef.current = onProgress;
    onCompleteRef.current = onComplete;
  }, [onProgress, onComplete]);

  // Reset completion trigger when video changes
  useEffect(() => {
    completedTriggered.current = false;
  }, [videoId]);

  // Load YouTube IFrame API script once if not present
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
    }
  }, []);

  // Initialize YT Player when isPlaying is true
  useEffect(() => {
    if (!isPlaying) return;

    const startTracking = (player: any) => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        try {
          if (player && typeof player.getCurrentTime === 'function' && typeof player.getDuration === 'function') {
            const currentTime = player.getCurrentTime();
            const duration = player.getDuration();
            if (duration > 0) {
              const percent = Math.min(100, Math.round((currentTime / duration) * 100));
              onProgressRef.current?.(percent);

              // 92% completion threshold
              if (percent >= 92 && !completedTriggered.current) {
                completedTriggered.current = true;
                onCompleteRef.current?.();
              }
            }
          }
        } catch {
          // Ignore cross-context calls
        }
      }, 1000);
    };

    const stopTracking = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    const initPlayer = () => {
      if (!window.YT || !window.YT.Player) {
        setTimeout(initPlayer, 200);
        return;
      }

      const element = document.getElementById(containerId.current);
      if (!element) return;

      playerRef.current = new window.YT.Player(containerId.current, {
        videoId,
        playerVars: {
          autoplay: 1,
          rel: 0,
          modestbranding: 1,
          enablejsapi: 1,
          origin: window.location.origin
        },
        events: {
          onStateChange: (event: any) => {
            // YT.PlayerState.PLAYING is 1
            if (event.data === 1) {
              startTracking(playerRef.current);
            } else {
              stopTracking();
              // YT.PlayerState.ENDED is 0
              if (event.data === 0 && !completedTriggered.current) {
                completedTriggered.current = true;
                onProgressRef.current?.(100);
                onCompleteRef.current?.();
              }
            }
          }
        }
      });
    };

    initPlayer();

    return () => {
      stopTracking();
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        try {
          playerRef.current.destroy();
        } catch {}
      }
    };
  }, [isPlaying, videoId]);

  return (
    <div className={`relative w-full overflow-hidden rounded-3xl neu-card p-3 ${className}`}>
      {/* 16:9 Aspect Ratio Container */}
      <div className="relative pb-[56.25%] h-0 w-full rounded-2xl overflow-hidden neu-inset">
        {isPlaying ? (
          <div
            id={containerId.current}
            className="absolute top-0 left-0 w-full h-full border-0 rounded-2xl"
          />
        ) : (
          <div className="absolute top-0 left-0 w-full h-full group cursor-pointer overflow-hidden flex items-center justify-center bg-zinc-900 rounded-2xl">
            {thumbnailUrl ? (
              <img
                src={thumbnailUrl}
                alt={title}
                onError={() => setImgError(true)}
                className="w-full h-full object-cover opacity-85 group-hover:opacity-95 group-hover:scale-105 transition-all duration-500 ease-out"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-zinc-500 p-6 text-center">
                <RefreshCw className="h-8 w-8 mb-2 animate-spin" />
                <span className="text-xs font-mono">Technical Lecture Stream</span>
              </div>
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 pointer-events-none" />

            {/* Play Button Action (Neumorphic Accent Glow) */}
            <button
              onClick={() => setIsPlaying(true)}
              className="absolute z-10 flex items-center justify-center h-16 w-16 sm:h-20 sm:w-20 rounded-full neu-accent-glow text-white shadow-2xl transition-all duration-300 group-hover:scale-110"
              aria-label={`Play ${title}`}
            >
              <Play className="h-7 w-7 sm:h-8 sm:w-8 fill-current ml-1" />
            </button>

            {/* Top Bar with YouTube Attribution */}
            <div className="absolute top-3 left-4 right-4 flex items-center justify-between z-10 text-white/90">
              <span className="text-xs font-medium bg-black/60 backdrop-blur-md px-3 py-1 rounded-full line-clamp-1 max-w-[80%]">
                {title}
              </span>
              <a
                href={youtubeWatchUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-xs flex items-center gap-1 bg-black/60 hover:bg-black/80 px-3 py-1 rounded-full backdrop-blur-md transition-colors"
                title="Watch directly on YouTube"
              >
                <span>YouTube</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

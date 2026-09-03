import React, { useEffect, useRef } from 'react';

interface RisingLinesProps {
  lineColor?: string;
  blobColor?: string;
  glowColor?: string;
  particleCount?: number;
  speed?: number;
  direction?: 'up' | 'down';
  horizonGlow?: boolean;
  opacity?: number;
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
  width: number;
  isBlob: boolean;
  radius: number;
  pulseSpeed: number;
  pulseOffset: number;
}

export const RisingLines: React.FC<RisingLinesProps> = ({
  lineColor = 'rgba(59, 130, 246, 0.45)',
  blobColor = 'rgba(99, 102, 241, 0.25)',
  glowColor = 'rgba(59, 130, 246, 0.15)',
  particleCount = 50,
  speed = 1,
  direction = 'up',
  horizonGlow = true,
  opacity = 1,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    window.addEventListener('resize', handleResize);

    let particles: Particle[] = [];

    const initParticles = () => {
      particles = [];
      const count = Math.floor((width * height) / 22000) + particleCount;

      for (let i = 0; i < count; i++) {
        const isBlob = Math.random() > 0.65;
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          length: isBlob ? 0 : Math.random() * 40 + 15,
          speed: (Math.random() * 0.8 + 0.4) * speed,
          opacity: Math.random() * 0.7 + 0.2,
          width: Math.random() * 1.5 + 0.5,
          isBlob,
          radius: isBlob ? Math.random() * 3.5 + 1.5 : 0,
          pulseSpeed: Math.random() * 0.03 + 0.01,
          pulseOffset: Math.random() * Math.PI * 2
        });
      }
    };

    initParticles();

    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);
      ctx.globalAlpha = opacity;
      ctx.globalCompositeOperation = 'lighter';

      // 1. Horizon Bottom / Top Glow
      if (horizonGlow) {
        const grad = ctx.createLinearGradient(
          0,
          direction === 'up' ? height : 0,
          0,
          direction === 'up' ? height - height * 0.45 : height * 0.45
        );
        grad.addColorStop(0, glowColor);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      }

      // 2. Render Particles & Glowing Lines
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Motion
        if (direction === 'up') {
          p.y -= p.speed;
          if (p.y + p.length < 0) {
            p.y = height + (p.isBlob ? 10 : p.length);
            p.x = Math.random() * width;
          }
        } else {
          p.y += p.speed;
          if (p.y - p.length > height) {
            p.y = -(p.isBlob ? 10 : p.length);
            p.x = Math.random() * width;
          }
        }

        const currentAlpha =
          p.opacity * (0.6 + 0.4 * Math.sin(frame * p.pulseSpeed + p.pulseOffset));

        if (p.isBlob) {
          // Soft Glowing Blob
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 2, 0, Math.PI * 2);
          ctx.fillStyle = blobColor.replace(/[\d.]+\)$/g, `${currentAlpha * 0.4})`);
          ctx.fill();

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = blobColor.replace(/[\d.]+\)$/g, `${currentAlpha})`);
          ctx.fill();
        } else {
          // Thin Glowing Line Spark
          const grad = ctx.createLinearGradient(
            p.x,
            direction === 'up' ? p.y + p.length : p.y - p.length,
            p.x,
            p.y
          );
          grad.addColorStop(0, 'rgba(0,0,0,0)');
          grad.addColorStop(1, lineColor.replace(/[\d.]+\)$/g, `${currentAlpha})`));

          ctx.strokeStyle = grad;
          ctx.lineWidth = p.width;
          ctx.beginPath();
          ctx.moveTo(p.x, direction === 'up' ? p.y + p.length : p.y - p.length);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();

          // Small tip spark
          ctx.fillStyle = lineColor.replace(/[\d.]+\)$/g, `${currentAlpha * 1.2})`);
          ctx.fillRect(p.x - p.width / 2, p.y - 1, p.width, 2);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [lineColor, blobColor, glowColor, particleCount, speed, direction, horizonGlow, opacity]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none fixed inset-0 z-0 h-full w-full ${className}`}
    />
  );
};

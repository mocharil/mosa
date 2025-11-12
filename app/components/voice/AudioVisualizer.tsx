"use client";

import { useEffect, useRef } from "react";

interface AudioVisualizerProps {
  isActive: boolean;
}

export default function AudioVisualizer({
  isActive,
}: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!isActive) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bars = 32;
    const barWidth = canvas.width / bars;

    let frameCount = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < bars; i++) {
        const height =
          Math.sin(frameCount * 0.05 + i * 0.5) * 40 +
          Math.random() * 30 +
          20;

        const x = i * barWidth + barWidth / 2 - 2;
        const y = canvas.height / 2 - height / 2;

        // Gradient color
        const gradient = ctx.createLinearGradient(x, y, x, y + height);
        gradient.addColorStop(0, "#3B82F6"); // primary-500
        gradient.addColorStop(1, "#10B981"); // accent-500

        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, 4, height);
      }

      frameCount++;
      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="w-full max-w-md mx-auto py-4">
      <canvas
        ref={canvasRef}
        width={400}
        height={100}
        className="w-full h-24 rounded-xl bg-gradient-to-r from-primary-50 to-accent-50"
      />
    </div>
  );
}

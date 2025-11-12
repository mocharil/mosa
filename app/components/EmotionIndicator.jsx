"use client";

import { useMemo } from 'react';
import VoiceEmotionAnalyzer from '@/app/lib/voiceEmotionAnalyzer';

export default function EmotionIndicator({ emotion, confidence, className = '' }) {
  const emotionData = useMemo(() => {
    return VoiceEmotionAnalyzer.getEmotionDescription(emotion);
  }, [emotion]);

  if (!emotion || emotion === 'neutral') return null;

  return (
    <div className={`animate-slide-up ${className}`}>
      <div
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full shadow-lg border-2"
        style={{
          backgroundColor: `${emotionData.color}20`,
          borderColor: emotionData.color,
        }}
      >
        <span className="text-2xl">{emotionData.icon}</span>
        <div className="flex flex-col">
          <span className="text-sm font-bold" style={{ color: emotionData.color }}>
            {emotionData.label}
          </span>
          <span className="text-xs text-gray-600">
            {Math.round(confidence * 100)}% confident
          </span>
        </div>
      </div>
      <p className="text-xs text-gray-600 mt-2 text-center">
        {emotionData.description}
      </p>
    </div>
  );
}

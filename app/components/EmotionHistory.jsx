"use client";

import { useMemo } from 'react';
import VoiceEmotionAnalyzer from '@/app/lib/voiceEmotionAnalyzer';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

export default function EmotionHistory({ emotions, className = '' }) {
  // Calculate emotion trend
  const emotionTrend = useMemo(() => {
    if (!emotions || emotions.length < 2) return 'stable';

    const recent = emotions.slice(-3);
    const positiveEmotions = ['happy'];
    const negativeEmotions = ['sad', 'angry', 'anxious'];

    let positiveCount = 0;
    let negativeCount = 0;

    recent.forEach((e) => {
      if (positiveEmotions.includes(e.emotion)) positiveCount++;
      if (negativeEmotions.includes(e.emotion)) negativeCount++;
    });

    if (positiveCount > negativeCount) return 'improving';
    if (negativeCount > positiveCount) return 'declining';
    return 'stable';
  }, [emotions]);

  // Get most common emotion
  const dominantEmotion = useMemo(() => {
    if (!emotions || emotions.length === 0) return null;

    const counts = {};
    emotions.forEach((e) => {
      counts[e.emotion] = (counts[e.emotion] || 0) + 1;
    });

    let maxCount = 0;
    let dominant = null;

    for (const [emotion, count] of Object.entries(counts)) {
      if (count > maxCount) {
        maxCount = count;
        dominant = emotion;
      }
    }

    return dominant;
  }, [emotions]);

  if (!emotions || emotions.length === 0) return null;

  const emotionData = dominantEmotion
    ? VoiceEmotionAnalyzer.getEmotionDescription(dominantEmotion)
    : null;

  return (
    <div className={`bg-white rounded-xl p-4 shadow-md border border-gray-200 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
          <Activity className="w-4 h-4" />
          Emosi Terdeteksi
        </h4>
        <div className="flex items-center gap-1 text-sm">
          {emotionTrend === 'improving' && (
            <>
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-green-600 font-medium">Membaik</span>
            </>
          )}
          {emotionTrend === 'declining' && (
            <>
              <TrendingDown className="w-4 h-4 text-red-500" />
              <span className="text-red-600 font-medium">Menurun</span>
            </>
          )}
          {emotionTrend === 'stable' && (
            <span className="text-gray-600 font-medium">Stabil</span>
          )}
        </div>
      </div>

      {/* Emotion timeline */}
      <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
        {emotions.slice(-5).map((e, index) => {
          const data = VoiceEmotionAnalyzer.getEmotionDescription(e.emotion);
          return (
            <div
              key={index}
              className="flex flex-col items-center min-w-fit"
              title={`${data.label} - ${Math.round(e.confidence * 100)}%`}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                style={{
                  backgroundColor: `${data.color}30`,
                  borderColor: data.color,
                  borderWidth: '2px',
                }}
              >
                {data.icon}
              </div>
              <span className="text-xs text-gray-500 mt-1">
                {Math.round(e.confidence * 100)}%
              </span>
            </div>
          );
        })}
      </div>

      {/* Dominant emotion */}
      {emotionData && (
        <div
          className="p-3 rounded-lg"
          style={{ backgroundColor: `${emotionData.color}10` }}
        >
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Emosi dominan:</span>{' '}
            <span className="font-bold" style={{ color: emotionData.color }}>
              {emotionData.label} {emotionData.icon}
            </span>
          </p>
          <p className="text-xs text-gray-600 mt-1">
            {emotionData.description}
          </p>
        </div>
      )}
    </div>
  );
}

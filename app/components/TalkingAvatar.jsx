"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import AvatarSVG from './AvatarSVG';
import { ANIMATION_CONFIG } from '@/app/lib/avatarConfig';

export default function TalkingAvatar({
  isSpeaking = false,
  transcript = '',
  mode = 'jkn',
  mouthOpenness = 0,
  onSpeechEnd = null,
  className = '',
}) {
  const [isBlinking, setIsBlinking] = useState(false);
  const [emotionState, setEmotionState] = useState('neutral');
  const blinkTimeoutRef = useRef(null);

  // Eye blinking effect
  useEffect(() => {
    const scheduleNextBlink = () => {
      // Random interval between min and max
      const { min, max } = ANIMATION_CONFIG.blink.interval;
      const nextBlinkDelay = Math.random() * (max - min) + min;

      blinkTimeoutRef.current = setTimeout(() => {
        setIsBlinking(true);

        // Blink duration
        setTimeout(() => {
          setIsBlinking(false);
          scheduleNextBlink(); // Schedule next blink
        }, ANIMATION_CONFIG.blink.duration);
      }, nextBlinkDelay);
    };

    // Start blinking cycle
    scheduleNextBlink();

    // Cleanup
    return () => {
      if (blinkTimeoutRef.current) {
        clearTimeout(blinkTimeoutRef.current);
      }
    };
  }, []);

  // Emotion detection based on mode and content
  useEffect(() => {
    if (!transcript) {
      setEmotionState('neutral');
      return;
    }

    const lowerTranscript = transcript.toLowerCase();

    // Detect emotion from text
    if (mode === 'curhat') {
      // Empathetic expressions for curhat mode
      if (
        lowerTranscript.includes('dengar') ||
        lowerTranscript.includes('pahami') ||
        lowerTranscript.includes('di sini')
      ) {
        setEmotionState('empathetic');
      } else {
        setEmotionState('neutral');
      }
    } else {
      // Professional but friendly for JKN mode
      if (
        lowerTranscript.includes('selamat') ||
        lowerTranscript.includes('terima kasih') ||
        lowerTranscript.includes('senang')
      ) {
        setEmotionState('happy');
      } else {
        setEmotionState('neutral');
      }
    }
  }, [transcript, mode]);

  // Notify when speech ends
  useEffect(() => {
    if (!isSpeaking && onSpeechEnd) {
      onSpeechEnd();
    }
  }, [isSpeaking, onSpeechEnd]);

  return (
    <div className={`relative ${className}`}>
      {/* Avatar Container with idle animations */}
      <div
        className={`
          transition-all duration-300
          ${isSpeaking ? '' : 'animate-breathing'}
        `}
        style={{
          willChange: 'transform',
        }}
      >
        {/* Head bobbing animation when idle */}
        <div
          className={`
            ${!isSpeaking ? 'animate-bobbing' : ''}
          `}
        >
          <AvatarSVG
            mouthOpenness={mouthOpenness}
            isBlinking={isBlinking}
            mode={mode}
            emotion={emotionState}
            className="drop-shadow-2xl"
          />
        </div>
      </div>

      {/* Status indicator */}
      {isSpeaking && (
        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-lg border border-gray-200">
            <div className="flex gap-1">
              <span
                className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                style={{ animationDelay: '0ms' }}
              />
              <span
                className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                style={{ animationDelay: '150ms' }}
              />
              <span
                className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                style={{ animationDelay: '300ms' }}
              />
            </div>
            <span className="text-xs font-medium text-gray-700">
              Sedang berbicara...
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

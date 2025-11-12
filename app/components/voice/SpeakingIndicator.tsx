"use client";

import { Volume2, StopCircle } from "lucide-react";

interface SpeakingIndicatorProps {
  isSpeaking: boolean;
  onStop?: () => void;
}

export default function SpeakingIndicator({ isSpeaking, onStop }: SpeakingIndicatorProps) {
  if (!isSpeaking) return null;

  return (
    <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50 animate-slide-up">
      <div className="flex items-center gap-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white px-6 py-3 rounded-full shadow-2xl">
        <Volume2 className="w-5 h-5 animate-pulse" />
        <span className="text-sm font-medium">AI sedang berbicara...</span>
        <div className="flex gap-1">
          <span className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>

        {/* Stop button */}
        {onStop && (
          <button
            onClick={onStop}
            className="ml-2 p-1.5 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
            title="Stop berbicara"
          >
            <StopCircle className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

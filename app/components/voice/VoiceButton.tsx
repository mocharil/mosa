"use client";

import { Mic, MicOff, Loader2, Volume2 } from "lucide-react";
import { cn } from "@/app/lib/utils";

interface VoiceButtonProps {
  isListening: boolean;
  isProcessing: boolean;
  isSpeaking?: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export default function VoiceButton({
  isListening,
  isProcessing,
  isSpeaking = false,
  onClick,
  disabled = false,
}: VoiceButtonProps) {

  return (
    <div className="relative flex items-center justify-center">
      {/* Pulse rings when listening */}
      {isListening && (
        <>
          <div className="absolute h-24 w-24 rounded-full opacity-75 animate-ping bg-gradient-to-br from-primary-500 to-accent-500" />
          <div className="absolute h-32 w-32 rounded-full opacity-50 animate-pulse bg-gradient-to-br from-primary-500 to-accent-500" />
        </>
      )}

      {/* Pulse rings when AI speaking - orange/amber color */}
      {isSpeaking && !isListening && (
        <>
          <div className="absolute h-24 w-24 rounded-full opacity-75 animate-ping bg-gradient-to-br from-amber-400 to-orange-500" />
          <div className="absolute h-32 w-32 rounded-full opacity-50 animate-pulse bg-gradient-to-br from-amber-400 to-orange-500" />
        </>
      )}

      {/* Main button */}
      <button
        onClick={onClick}
        disabled={disabled || isProcessing}
        className={cn(
          "relative z-10 flex h-20 w-20 items-center justify-center rounded-full transition-all duration-300 shadow-lg",
          isSpeaking && !isListening
            ? "bg-gradient-to-br from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
            : "bg-gradient-to-br from-primary-600 to-accent-500 hover:from-primary-700 hover:to-accent-600",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "active:scale-95",
          "focus:outline-none focus:ring-4",
          isSpeaking ? "ring-amber-300" : "ring-primary-300"
        )}
        aria-label={
          isSpeaking
            ? "Stop AI dan mulai bicara"
            : isListening
            ? "Stop listening"
            : "Start voice input"
        }
      >
        {isProcessing ? (
          <Loader2 className="h-8 w-8 text-white animate-spin" />
        ) : isSpeaking && !isListening ? (
          <Volume2 className="h-8 w-8 text-white animate-pulse" />
        ) : isListening ? (
          <MicOff className="h-8 w-8 text-white" />
        ) : (
          <Mic className="h-8 w-8 text-white" />
        )}
      </button>

      {/* Status text */}
      <div className="absolute -bottom-8 text-center">
        <p className="text-sm font-semibold text-gray-700">
          {isProcessing
            ? "Memproses..."
            : isSpeaking && !isListening
            ? "Tekan untuk interrupt"
            : isListening
            ? "Mendengarkan..."
            : "Tekan untuk bicara"}
        </p>
      </div>
    </div>
  );
}

"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useSettingsStore } from "@/app/lib/store";

export default function VoiceToggle() {
  const { autoSpeak, setAutoSpeak } = useSettingsStore();

  return (
    <button
      onClick={() => setAutoSpeak(!autoSpeak)}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-full
        transition-all duration-300 shadow-lg
        ${
          autoSpeak
            ? "bg-gradient-to-r from-primary-500 to-accent-500 text-white"
            : "bg-white text-gray-700 border-2 border-gray-200"
        }
        hover:scale-105 active:scale-95
      `}
      title={autoSpeak ? "Matikan suara AI" : "Aktifkan suara AI"}
    >
      {autoSpeak ? (
        <>
          <Volume2 className="w-5 h-5" />
          <span className="text-sm font-medium">Suara ON</span>
        </>
      ) : (
        <>
          <VolumeX className="w-5 h-5" />
          <span className="text-sm font-medium">Suara OFF</span>
        </>
      )}
    </button>
  );
}

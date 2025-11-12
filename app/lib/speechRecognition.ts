// Utility functions for speech recognition and synthesis

export interface SpeechRecognitionConfig {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
}

export const DEFAULT_CONFIG: SpeechRecognitionConfig = {
  lang: "id-ID",
  continuous: true,
  interimResults: true,
};

export function isSpeechRecognitionSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)
  );
}

export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export async function speak(text: string, lang: string = "id-ID"): Promise<void> {
  if (!isSpeechSynthesisSupported()) {
    console.warn("Speech synthesis not supported");
    return;
  }

  return new Promise((resolve, reject) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9;
    utterance.pitch = 1.0;

    utterance.onend = () => resolve();
    utterance.onerror = (error) => reject(error);

    window.speechSynthesis.speak(utterance);
  });
}

export function stopSpeaking(): void {
  if (isSpeechSynthesisSupported()) {
    window.speechSynthesis.cancel();
  }
}

export function detectLanguage(text: string): "id-ID" | "en-US" {
  // Simple language detection based on common Indonesian words
  const indonesianWords = [
    "yang",
    "dan",
    "di",
    "ke",
    "dari",
    "untuk",
    "dengan",
    "ini",
    "itu",
    "ada",
    "saya",
    "anda",
    "tidak",
    "adalah",
  ];

  const lowerText = text.toLowerCase();
  const indonesianWordCount = indonesianWords.filter((word) =>
    lowerText.includes(` ${word} `)
  ).length;

  return indonesianWordCount > 2 ? "id-ID" : "en-US";
}

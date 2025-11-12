import { create } from "zustand";
import { Message } from "./gemini";

export type Language = "id-ID" | "en-US";

interface ChatState {
  language: Language;
  messages: Message[];
  isListening: boolean;
  isProcessing: boolean;
  isSpeaking: boolean;
  transcript: string;

  setLanguage: (language: Language) => void;
  addMessage: (message: Message) => void;
  clearMessages: () => void;
  setIsListening: (isListening: boolean) => void;
  setIsProcessing: (isProcessing: boolean) => void;
  setIsSpeaking: (isSpeaking: boolean) => void;
  setTranscript: (transcript: string) => void;
  resetTranscript: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  language: "id-ID",
  messages: [],
  isListening: false,
  isProcessing: false,
  isSpeaking: false,
  transcript: "",

  setLanguage: (language) => set({ language }),
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  clearMessages: () => set({ messages: [] }),
  setIsListening: (isListening) => set({ isListening }),
  setIsProcessing: (isProcessing) => set({ isProcessing }),
  setIsSpeaking: (isSpeaking) => set({ isSpeaking }),
  setTranscript: (transcript) => set({ transcript }),
  resetTranscript: () => set({ transcript: "" }),
}));

// Settings store
interface SettingsState {
  autoSpeak: boolean;
  showTranscript: boolean;
  setAutoSpeak: (autoSpeak: boolean) => void;
  setShowTranscript: (showTranscript: boolean) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  autoSpeak: false,
  showTranscript: true,
  setAutoSpeak: (autoSpeak) => set({ autoSpeak }),
  setShowTranscript: (showTranscript) => set({ showTranscript }),
}));

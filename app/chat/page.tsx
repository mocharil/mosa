"use client";

import "regenerator-runtime/runtime";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useChatStore, useSettingsStore } from "@/app/lib/store";
import {
  speak,
  stopSpeaking,
  isSpeechRecognitionSupported,
  isSpeechSynthesisSupported,
} from "@/app/lib/speechRecognition";
import { speakWithAnimation } from "@/app/lib/speechSynthesisHandler";
import AudioVisualizer from "@/app/components/voice/AudioVisualizer";
import SpeakingIndicator from "@/app/components/voice/SpeakingIndicator";
import TalkingAvatar from "@/app/components/TalkingAvatar";
import EmotionIndicator from "@/app/components/EmotionIndicator";
import EmotionHistory from "@/app/components/EmotionHistory";
import ChatContainer from "@/app/components/chat/ChatContainer";
import ConversationSummary from "@/app/components/ConversationSummary";
import EmergencyButton from "@/app/components/EmergencyButton";
import VoiceEmotionAnalyzer from "@/app/lib/voiceEmotionAnalyzer";
import UnifiedInput from "@/app/components/chat/UnifiedInput";
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  FileText,
  Trash2,
  AlertTriangle,
  Sparkles,
  User,
} from "lucide-react";
import { cn } from "@/app/lib/utils";

export default function ChatPage() {
  const router = useRouter();
  const {
    language,
    messages,
    isListening,
    isProcessing,
    isSpeaking,
    transcript,
    setIsListening,
    setIsProcessing,
    setIsSpeaking,
    setTranscript,
    addMessage,
    clearMessages,
    resetTranscript,
  } = useChatStore();

  const { autoSpeak, setAutoSpeak } = useSettingsStore();
  const [showSummary, setShowSummary] = useState(false);
  const [summary, setSummary] = useState("");
  const [showRiskWarning, setShowRiskWarning] = useState(false);
  const [showAvatar, setShowAvatar] = useState(true);
  const [mouthOpenness, setMouthOpenness] = useState(0);
  const [currentAIText, setCurrentAIText] = useState("");
  const [currentEmotion, setCurrentEmotion] = useState(null);
  const [emotionHistory, setEmotionHistory] = useState([]);
  const [emotionAnalyzer, setEmotionAnalyzer] = useState(null);

  const {
    transcript: liveTranscript,
    listening,
    resetTranscript: resetSpeechTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  // Check browser support
  useEffect(() => {
    if (!isSpeechRecognitionSupported() || !browserSupportsSpeechRecognition) {
      alert(
        "Browser Anda tidak mendukung speech recognition. Gunakan Chrome atau Edge terbaru."
      );
    }
  }, [browserSupportsSpeechRecognition]);

  // Sync listening state
  useEffect(() => {
    setIsListening(listening);
  }, [listening, setIsListening]);

  // Update transcript
  useEffect(() => {
    if (liveTranscript) {
      setTranscript(liveTranscript);
    }
  }, [liveTranscript, setTranscript]);

  // Initialize emotion analyzer when listening starts
  useEffect(() => {
    const initEmotionAnalyzer = async () => {
      if (listening && !emotionAnalyzer) {
        try {
          // Get microphone stream
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

          // Create and initialize analyzer
          const analyzer = new VoiceEmotionAnalyzer();
          const initialized = await analyzer.initialize(stream);

          if (initialized) {
            analyzer.startAnalysis();
            setEmotionAnalyzer(analyzer);
            console.log('✅ Emotion analyzer started');
          }
        } catch (error) {
          console.error('Failed to initialize emotion analyzer:', error);
        }
      } else if (!listening && emotionAnalyzer) {
        // Stop analyzer when not listening
        emotionAnalyzer.stopAnalysis();
        setEmotionAnalyzer(null);
        console.log('🛑 Emotion analyzer stopped');
      }
    };

    initEmotionAnalyzer();
  }, [listening, emotionAnalyzer]);

  // Detect emotion periodically while listening
  useEffect(() => {
    if (!listening || !emotionAnalyzer) return;

    const intervalId = setInterval(() => {
      const result = emotionAnalyzer.getCurrentEmotion();

      if (result && result.confidence > 0.5) {
        setCurrentEmotion(result);

        // Add to history
        setEmotionHistory((prev) => [
          ...prev,
          {
            emotion: result.emotion,
            confidence: result.confidence,
            timestamp: new Date(),
          },
        ]);

        console.log('😊 Emotion detected:', result.emotion, `(${Math.round(result.confidence * 100)}%)`);
      }
    }, 2000); // Check every 2 seconds

    return () => clearInterval(intervalId);
  }, [listening, emotionAnalyzer]);

  // Send message to API
  const handleSendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isProcessing) return;

      const userMessage = {
        role: "user" as const,
        content: text.trim(),
        timestamp: new Date(),
      };

      addMessage(userMessage);
      setIsProcessing(true);

      try {
        const response = await fetch("/api/gemini", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "chat",
            userQuery: text.trim(),
            conversationHistory: messages,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to get response");
        }

        const data = await response.json();

        const assistantMessage = {
          role: "assistant" as const,
          content: data.answer,
          timestamp: new Date(),
        };

        addMessage(assistantMessage);

        // Show risk warning if high risk detected
        if (data.showEmergencyContacts) {
          setShowRiskWarning(true);
        }

        // Auto-speak response if enabled
        if (autoSpeak && isSpeechSynthesisSupported()) {
          setCurrentAIText(data.answer);
          setIsSpeaking(true);
          try {
            await speakWithAnimation(data.answer, {
              lang: language,
              rate: 0.9,
              pitch: 1.0,
              onMouthMove: (openness) => {
                setMouthOpenness(openness);
              },
              onStart: () => {
                console.log('Avatar started speaking');
              },
              onEnd: () => {
                setIsSpeaking(false);
                setMouthOpenness(0);
                setTimeout(() => setCurrentAIText(''), 500);
              },
              onError: (error) => {
                console.error("Speech error:", error);
                setIsSpeaking(false);
                setMouthOpenness(0);
                setCurrentAIText('');
              }
            });
          } catch (error) {
            console.error("Speech error:", error);
            setIsSpeaking(false);
            setMouthOpenness(0);
            setCurrentAIText('');
          }
        }
      } catch (error) {
        console.error("Error:", error);
        addMessage({
          role: "assistant",
          content:
            "Maaf, terjadi kesalahan. Silakan coba lagi atau hubungi layanan pelanggan BPJS Kesehatan di 1500-400.",
          timestamp: new Date(),
        });
      } finally {
        setIsProcessing(false);
      }
    },
    [
      isProcessing,
      addMessage,
      setIsProcessing,
      messages,
      autoSpeak,
      language,
      setIsSpeaking,
    ]
  );

  // Handle image send
  const handleSendImage = useCallback(
    async (imageData: { image: File; previewUrl: string; caption: string }) => {
      if (isProcessing) return;

      // Add user message with image
      const userMessage = {
        role: "user" as const,
        content: imageData.caption,
        timestamp: new Date(),
        imageUrl: imageData.previewUrl,
      };

      addMessage(userMessage);
      setIsProcessing(true);

      try {
        // Convert image to base64
        const reader = new FileReader();
        reader.readAsDataURL(imageData.image);

        const imageBase64 = await new Promise<string>((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
        });

        const response = await fetch("/api/gemini", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "image",
            imageBase64: imageBase64,
            userQuery: imageData.caption,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to analyze image");
        }

        const data = await response.json();

        const assistantMessage = {
          role: "assistant" as const,
          content: data.answer,
          timestamp: new Date(),
        };

        addMessage(assistantMessage);

        // Show risk warning if high risk detected
        if (data.showEmergencyContacts) {
          setShowRiskWarning(true);
        }

        // Auto-speak response if enabled
        if (autoSpeak && isSpeechSynthesisSupported()) {
          setCurrentAIText(data.answer);
          setIsSpeaking(true);
          try {
            await speakWithAnimation(data.answer, {
              lang: language,
              rate: 0.9,
              pitch: 1.0,
              onMouthMove: (openness) => {
                setMouthOpenness(openness);
              },
              onStart: () => {
                console.log('Avatar started speaking');
              },
              onEnd: () => {
                setIsSpeaking(false);
                setMouthOpenness(0);
                setTimeout(() => setCurrentAIText(''), 500);
              },
              onError: (error) => {
                console.error("Speech error:", error);
                setIsSpeaking(false);
                setMouthOpenness(0);
                setCurrentAIText('');
              }
            });
          } catch (error) {
            console.error("Speech error:", error);
            setIsSpeaking(false);
            setMouthOpenness(0);
            setCurrentAIText('');
          }
        }
      } catch (error) {
        console.error("Error:", error);
        addMessage({
          role: "assistant",
          content:
            "Maaf, terjadi kesalahan saat menganalisis gambar. Silakan coba lagi.",
          timestamp: new Date(),
        });
      } finally {
        setIsProcessing(false);
      }
    },
    [
      isProcessing,
      addMessage,
      setIsProcessing,
      autoSpeak,
      language,
      setIsSpeaking,
    ]
  );

  // Handle stop speaking
  const handleStopSpeaking = useCallback(() => {
    stopSpeaking();
    setIsSpeaking(false);
    setMouthOpenness(0);
    setCurrentAIText('');
  }, [setIsSpeaking]);

  // Handle voice input
  const handleVoiceToggle = useCallback(() => {
    if (listening) {
      SpeechRecognition.stopListening();
      if (transcript.trim()) {
        handleSendMessage(transcript);
        resetTranscript();
        resetSpeechTranscript();
      }
    } else {
      // Stop AI speaking if it's currently speaking
      if (isSpeaking) {
        handleStopSpeaking();
      }
      resetTranscript();
      resetSpeechTranscript();
      SpeechRecognition.startListening({
        continuous: true,
        language: language,
      });
    }
  }, [
    listening,
    transcript,
    language,
    isSpeaking,
    resetTranscript,
    resetSpeechTranscript,
    handleStopSpeaking,
    handleSendMessage,
  ]);

  // Generate summary
  const handleGenerateSummary = async () => {
    if (messages.length === 0) return;

    setIsProcessing(true);
    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "summary",
          conversationHistory: messages,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate summary");
      }

      const data = await response.json();
      setSummary(data.summary);
      setShowSummary(true);
    } catch (error) {
      console.error("Error generating summary:", error);
      alert("Gagal membuat ringkasan. Silakan coba lagi.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Clear chat
  const handleClearChat = () => {
    if (
      confirm(
        "Apakah Anda yakin ingin menghapus percakapan ini? Tindakan ini tidak dapat dibatalkan."
      )
    ) {
      clearMessages();
      setShowRiskWarning(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/")}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">
                    Voice Assistant
                  </h1>
                  <p className="text-xs text-gray-600">
                    JKN Info & Dukungan Emosional
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Avatar toggle */}
              <button
                onClick={() => setShowAvatar(!showAvatar)}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  showAvatar
                    ? "bg-accent-100 text-accent-600"
                    : "hover:bg-gray-100 text-gray-600"
                )}
                title={showAvatar ? "Sembunyikan avatar" : "Tampilkan avatar"}
              >
                <User className="h-5 w-5" />
              </button>

              {/* Auto-speak toggle */}
              <button
                onClick={() => setAutoSpeak(!autoSpeak)}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  autoSpeak
                    ? "bg-primary-100 text-primary-600"
                    : "hover:bg-gray-100 text-gray-600"
                )}
                title={
                  autoSpeak
                    ? "Matikan suara otomatis"
                    : "Nyalakan suara otomatis"
                }
              >
                {autoSpeak ? (
                  <Volume2 className="h-5 w-5" />
                ) : (
                  <VolumeX className="h-5 w-5" />
                )}
              </button>

              {/* Summary button */}
              <button
                onClick={handleGenerateSummary}
                disabled={messages.length === 0 || isProcessing}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-gray-700"
                title="Buat ringkasan"
              >
                <FileText className="h-5 w-5" />
              </button>

              {/* Clear chat button */}
              <button
                onClick={handleClearChat}
                disabled={messages.length === 0}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-gray-700"
                title="Hapus percakapan"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Risk warning banner */}
      {showRiskWarning && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-3 animate-slide-up">
          <div className="container mx-auto flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">
                Kami mendeteksi Anda mungkin membutuhkan bantuan profesional
              </p>
              <p className="text-sm text-red-600 mt-1">
                Silakan hubungi Hotline Kesehatan Jiwa di{" "}
                <a href="tel:119" className="underline font-semibold">
                  119 ext 8
                </a>{" "}
                atau kunjungi fasilitas kesehatan terdekat.
              </p>
            </div>
            <button
              onClick={() => setShowRiskWarning(false)}
              className="p-1 hover:bg-red-100 rounded transition-colors"
            >
              <span className="text-red-500 text-xl">&times;</span>
            </button>
          </div>
        </div>
      )}

      {/* Avatar Section */}
      {showAvatar && (
        <div className="bg-white/50 backdrop-blur-sm border-b border-gray-200">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col items-center gap-4">
              <div className="w-48 sm:w-56">
                <TalkingAvatar
                  isSpeaking={isSpeaking}
                  transcript={currentAIText}
                  mode="jkn"
                  mouthOpenness={mouthOpenness}
                />
              </div>

              {/* Emotion Indicator */}
              {currentEmotion && currentEmotion.emotion !== 'neutral' && (
                <EmotionIndicator
                  emotion={currentEmotion.emotion}
                  confidence={currentEmotion.confidence}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Chat area */}
      <div className="flex-1 overflow-hidden">
        <ChatContainer messages={messages} />
      </div>

      {/* Input area */}
      <div className="border-t bg-white/80 backdrop-blur-md">
        <div className="container mx-auto p-4 max-w-4xl">
          {/* Emotion History */}
          {emotionHistory.length > 0 && (
            <div className="mb-4">
              <EmotionHistory emotions={emotionHistory} />
            </div>
          )}

          {/* Audio visualizer (when listening) */}
          {isListening && (
            <div className="mb-4">
              <AudioVisualizer isActive={isListening} />
            </div>
          )}

          {/* Transcript display */}
          {transcript && (
            <div className="mb-4 p-4 bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl border border-primary-200 animate-slide-up">
              <p className="text-xs font-medium text-gray-600 mb-1">
                Anda mengatakan:
              </p>
              <p className="text-gray-900">{transcript}</p>
            </div>
          )}

          {/* Unified Input */}
          <UnifiedInput
            onSendText={handleSendMessage}
            onSendImage={handleSendImage}
            onVoiceToggle={handleVoiceToggle}
            isListening={isListening}
            isProcessing={isProcessing}
            isSpeaking={isSpeaking}
            voiceDisabled={!browserSupportsSpeechRecognition}
            placeholder="Ketik pesan atau gunakan voice/upload gambar..."
          />
        </div>
      </div>

      {/* Emergency button */}
      <EmergencyButton />

      {/* Speaking indicator */}
      <SpeakingIndicator isSpeaking={isSpeaking} onStop={handleStopSpeaking} />

      {/* Summary modal */}
      {showSummary && (
        <ConversationSummary
          summary={summary}
          onClose={() => setShowSummary(false)}
        />
      )}
    </div>
  );
}

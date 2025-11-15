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
import VoiceSphere from "@/app/components/voice/VoiceSphere";
import ChatContainer from "@/app/components/chat/ChatContainer";
import ConversationSummary from "@/app/components/ConversationSummary";
import VoiceEmotionAnalyzer from "@/app/lib/voiceEmotionAnalyzer";
import UnifiedInput from "@/app/components/chat/UnifiedInput";
import WelcomeScreen from "@/app/components/chat/WelcomeScreen";
import Image from "next/image";
import {
  ArrowLeft,
  AlertTriangle,
  Menu,
} from "lucide-react";
import { cn } from "@/app/lib/utils";
import SettingsMenu from "@/app/components/chat/SettingsMenu";
import { getDemoResponse } from "@/app/lib/demoResponses";

// Type definitions for emotion data
interface EmotionResult {
  emotion: string;
  confidence: number;
  features?: any;
  scores?: any;
}

interface EmotionHistoryItem {
  emotion: string;
  confidence: number;
  timestamp: Date;
}

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
  const [showMenu, setShowMenu] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [demoMode, setDemoMode] = useState(true); // Start with demo mode ON
  const [mouthOpenness, setMouthOpenness] = useState(0);
  const [currentAIText, setCurrentAIText] = useState("");
  const [currentEmotion, setCurrentEmotion] = useState<EmotionResult | null>(null);
  const [emotionHistory, setEmotionHistory] = useState<EmotionHistoryItem[]>([]);
  const [emotionAnalyzer, setEmotionAnalyzer] = useState<VoiceEmotionAnalyzer | null>(null);

  const {
    transcript: liveTranscript,
    listening,
    resetTranscript: resetSpeechTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  // Fallback check for speech recognition support
  const isSpeechSupported = browserSupportsSpeechRecognition ?? isSpeechRecognitionSupported();

  // Initialize SpeechRecognition on mount
  useEffect(() => {
    // Check if SpeechRecognition API exists
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognitionAPI) {
      console.log('✅ SpeechRecognition API found:', SpeechRecognitionAPI);
    } else {
      console.error('❌ SpeechRecognition API not found in window');
    }
  }, []);

  // Check browser support
  useEffect(() => {
    console.log('Speech Recognition Support Check:', {
      isSpeechRecognitionSupported: isSpeechRecognitionSupported(),
      browserSupportsSpeechRecognition: browserSupportsSpeechRecognition,
      isSpeechSupported: isSpeechSupported,
      windowSpeechRecognition: typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
    });

    if (!isSpeechSupported) {
      console.error('Speech recognition not supported');
      // Don't alert immediately, just log
      console.warn('⚠️ Speech recognition not available. Button will be disabled.');
    } else {
      console.log('✅ Speech recognition is supported and ready');
    }
  }, [browserSupportsSpeechRecognition, isSpeechSupported]);

  // Sync listening state
  useEffect(() => {
    console.log('Listening state changed:', listening);
    setIsListening(listening);
  }, [listening, setIsListening]);

  // Update transcript
  useEffect(() => {
    console.log('Transcript update effect:', {
      liveTranscript: liveTranscript,
      length: liveTranscript?.length || 0,
      listening: listening
    });

    if (liveTranscript) {
      console.log('✅ Transcript updated:', liveTranscript);
      setTranscript(liveTranscript);
    } else if (listening) {
      console.log('⚠️ Listening but no transcript yet...');
    }
  }, [liveTranscript, setTranscript, listening]);

  // Initialize emotion analyzer when listening starts
  // DISABLED: Can conflict with SpeechRecognition microphone access
  // TODO: Re-enable after fixing microphone access conflict
  useEffect(() => {
    // Emotion analyzer disabled to prevent microphone conflict
    console.log('Emotion analyzer is disabled to prevent microphone conflict');
    return;

    /* COMMENTED OUT - Uncomment after fixing
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
    */
  }, [listening, emotionAnalyzer]);

  // Detect emotion periodically while listening
  // DISABLED: Emotion analyzer is disabled
  useEffect(() => {
    // Emotion detection disabled
    return;

    /* COMMENTED OUT - Uncomment after fixing
    if (!listening || !emotionAnalyzer) return;

    const intervalId = setInterval(() => {
      const result = emotionAnalyzer.getCurrentEmotion() as EmotionResult;

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
    */
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

      // Clear transcript after sending
      resetTranscript();

      try {
        let responseText = "";

        if (demoMode) {
          // DEMO MODE: Use mock responses
          const demoResponse = getDemoResponse(text.trim());
          const delay = demoResponse?.delay || 1500;

          // Simulate network delay
          await new Promise(resolve => setTimeout(resolve, delay));

          responseText = demoResponse?.response || "Maaf, saya belum bisa memahami pertanyaan Anda. Coba tanyakan tentang rumah sakit, iuran JKN, atau ceritakan keluhan Anda.";
        } else {
          // REAL MODE: Use Gemini AI
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
          responseText = data.answer;

          // Show risk warning if high risk detected
          if (data.showEmergencyContacts) {
            setShowRiskWarning(true);
          }
        }

        const assistantMessage = {
          role: "assistant" as const,
          content: responseText,
          timestamp: new Date(),
        };

        addMessage(assistantMessage);

        // Auto-speak response if enabled
        if (autoSpeak && isSpeechSynthesisSupported()) {
          setCurrentAIText(responseText);
          setIsSpeaking(true);
          try {
            await speakWithAnimation(responseText, {
              lang: language,
              rate: 0.9,
              pitch: 1.0,
              onMouthMove: (openness: number) => {
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
              onError: (error: any) => {
                console.error("Speech error:", error);
                setIsSpeaking(false);
                setMouthOpenness(0);
                setCurrentAIText('');
              }
            } as any);
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
      demoMode,
      autoSpeak,
      language,
      setIsSpeaking,
      resetTranscript,
    ]
  );

  // Handle image send
  const handleSendImage = useCallback(
    async (imageData: { image: File; previewUrl: string; caption: string }) => {
      if (isProcessing) return;

      // Add user message with image
      const displayCaption = imageData.caption || "Gambar diunggah";

      const userMessage = {
        role: "user" as const,
        content: displayCaption,
        timestamp: new Date(),
        imageUrl: imageData.previewUrl,
      };

      console.log('Adding image message with caption:', displayCaption);
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

        // Use custom caption if provided, otherwise use default prompt
        const imageQuery = imageData.caption
          ? imageData.caption
          : "Apa yang ada di gambar ini? Jelaskan secara detail.";

        console.log('Sending image with query:', imageQuery);

        const response = await fetch("/api/gemini", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "image",
            imageBase64: imageBase64,
            userQuery: imageQuery,
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
              onMouthMove: (openness: number) => {
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
              onError: (error: any) => {
                console.error("Speech error:", error);
                setIsSpeaking(false);
                setMouthOpenness(0);
                setCurrentAIText('');
              }
            } as any);
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

  // Handle voice input - stays in voice mode
  const handleVoiceSubmit = useCallback(async () => {
    if (!transcript.trim()) return;

    console.log('🎤 Submitting voice message:', transcript);

    const userMessage = transcript.trim();

    // Add user message
    addMessage({
      role: "user",
      content: userMessage,
      timestamp: new Date(),
    });

    // Clear transcript and restart listening
    resetTranscript();
    resetSpeechTranscript();
    setIsProcessing(true);

    try {
      let responseText = "";

      if (demoMode) {
        // DEMO MODE: Use mock responses
        const demoResponse = getDemoResponse(userMessage);
        const delay = demoResponse?.delay || 1500;

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, delay));

        responseText = demoResponse?.response || "Maaf, saya belum bisa memahami pertanyaan Anda. Coba tanyakan tentang rumah sakit, iuran JKN, atau ceritakan keluhan Anda.";
      } else {
        // REAL MODE: Use Gemini AI
        const response = await fetch("/api/gemini", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "chat",
            userQuery: userMessage,
            conversationHistory: messages,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to get response");
        }

        const data = await response.json();
        responseText = data.answer;

        // Show risk warning if high risk detected
        if (data.showEmergencyContacts) {
          setShowRiskWarning(true);
        }
      }

      const assistantMessage = {
        role: "assistant" as const,
        content: responseText,
        timestamp: new Date(),
      };

      addMessage(assistantMessage);

      // Auto-speak response (always in voice mode)
      if (isSpeechSynthesisSupported()) {
        setCurrentAIText(responseText);
        setIsSpeaking(true);
        try {
          await speakWithAnimation(responseText, {
            lang: language,
            rate: 0.9,
            pitch: 1.0,
            onMouthMove: (openness: number) => {
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
            onError: (error: any) => {
              console.error("Speech error:", error);
              setIsSpeaking(false);
              setMouthOpenness(0);
              setCurrentAIText('');
            }
          } as any);
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
        content: "Maaf, terjadi kesalahan. Silakan coba lagi.",
        timestamp: new Date(),
      });
    } finally {
      setIsProcessing(false);
    }
  }, [
    transcript,
    messages,
    language,
    demoMode,
    addMessage,
    setIsProcessing,
    resetTranscript,
    resetSpeechTranscript,
    setIsSpeaking,
  ]);

  // Handle voice toggle - enter/exit voice mode
  const handleVoiceToggle = useCallback(async () => {
    console.log('🎤 Voice toggle clicked. Current state:', { listening, transcript, isVoiceMode });

    if (listening) {
      // Stop listening and stay in voice mode
      console.log('🛑 Stopping voice recognition...');
      SpeechRecognition.stopListening();

      // Send the transcript if available
      if (transcript.trim()) {
        console.log('✅ Sending voice message:', transcript);
        await handleVoiceSubmit();
      }
    } else if (!isVoiceMode) {
      // Enter voice mode for first time
      setIsVoiceMode(true);

      // Stop AI speaking if it's currently speaking
      if (isSpeaking) {
        console.log('🔇 Stopping AI speech...');
        handleStopSpeaking();
      }

      // Clear any existing transcript
      resetTranscript();
      resetSpeechTranscript();

      // Check browser support first
      if (!isSpeechSupported) {
        console.error('❌ Browser does not support speech recognition');
        alert('Browser Anda tidak mendukung speech recognition. Gunakan Chrome atau Edge terbaru.');
        return;
      }

      // Start listening
      console.log('🎤 Starting voice recognition with language:', language);

      try {
        await SpeechRecognition.startListening({
          continuous: true,
          language: language,
        });
        console.log('✅ Voice recognition started successfully');
      } catch (err) {
        console.error('❌ Failed to start voice recognition:', err);
        alert('Gagal memulai voice recognition. Pastikan Anda memberikan izin mikrofon dan menggunakan HTTPS atau localhost.');
      }
    } else {
      // Already in voice mode, restart listening
      // Clear any existing transcript
      resetTranscript();
      resetSpeechTranscript();

      // Start listening again
      console.log('🎤 Restarting voice recognition with language:', language);

      try {
        await SpeechRecognition.startListening({
          continuous: true,
          language: language,
        });
        console.log('✅ Voice recognition restarted successfully');
      } catch (err) {
        console.error('❌ Failed to restart voice recognition:', err);
        alert('Gagal memulai voice recognition. Pastikan Anda memberikan izin mikrofon dan menggunakan HTTPS atau localhost.');
      }
    }
  }, [
    listening,
    transcript,
    language,
    isSpeaking,
    isSpeechSupported,
    isVoiceMode,
    resetTranscript,
    resetSpeechTranscript,
    handleStopSpeaking,
    handleVoiceSubmit,
  ]);

  // Handle back from voice mode
  const handleBackFromVoice = useCallback(() => {
    // Exit voice mode
    setIsVoiceMode(false);

    // Stop listening
    if (listening) {
      SpeechRecognition.stopListening();
    }
    // Stop speaking
    if (isSpeaking) {
      handleStopSpeaking();
    }
    // Clear transcript
    resetTranscript();
    resetSpeechTranscript();
  }, [listening, isSpeaking, resetTranscript, resetSpeechTranscript, handleStopSpeaking]);

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
    <div className="flex flex-col h-screen bg-black">
      {/* Modern Dark Header with Glassmorphism */}
      <header className="sticky top-0 z-50 bg-gradient-to-br from-gray-900/95 via-purple-900/30 to-gray-900/95 border-b border-gray-700/30 shadow-2xl backdrop-blur-xl backdrop-saturate-150">
        <div className="container mx-auto px-4 py-3.5">
          <div className="flex items-center justify-between">
            {/* Left: Back button + Logo */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/")}
                className="p-2 hover:bg-white/5 rounded-xl transition-all duration-200 active:scale-95 group"
                aria-label="Back to home"
              >
                <ArrowLeft className="h-5 w-5 text-gray-300 group-hover:text-white transition-colors duration-200" />
              </button>
              <div className="flex items-center gap-2.5">
                <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20 p-1.5 ring-2 ring-purple-500/30 hover:ring-purple-400/50 transition-all duration-300">
                  <Image
                    src="/mosa_logo-removebg-preview.png"
                    alt="MOSA Logo"
                    width={40}
                    height={40}
                    className="object-contain"
                    priority
                  />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white tracking-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text">
                    MOSA
                  </h1>
                  <p className="text-[10px] text-gray-400 leading-tight">
                    AI Assistant
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Hamburger menu */}
            <button
              onClick={() => setShowMenu(true)}
              className="p-2.5 hover:bg-white/5 rounded-xl transition-all duration-200 active:scale-95 relative group"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6 text-gray-300 group-hover:text-white transition-colors duration-200" />
              {/* Notification dot if there are messages */}
              {messages.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-purple-500 rounded-full ring-2 ring-purple-500/30 animate-pulse shadow-lg shadow-purple-500/50" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Settings Menu */}
      <SettingsMenu
        isOpen={showMenu}
        onClose={() => setShowMenu(false)}
        autoSpeak={autoSpeak}
        demoMode={demoMode}
        onToggleAutoSpeak={() => setAutoSpeak(!autoSpeak)}
        onToggleDemoMode={() => setDemoMode(!demoMode)}
        onGenerateSummary={handleGenerateSummary}
        onClearChat={handleClearChat}
        messagesCount={messages.length}
        isProcessing={isProcessing}
      />

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

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto flex flex-col">
        {messages.length === 0 ? (
          /* Welcome Screen - shown when no messages */
          <WelcomeScreen
            onSelectTopic={(question) => {
              setTranscript(question);
              handleSendMessage(question);
            }}
          />
        ) : (
          /* Chat area - full height */
          <div className="flex-1 overflow-hidden">
            <ChatContainer messages={messages} isProcessing={isProcessing} />
          </div>
        )}
      </div>

      {/* Voice Mode Overlay - Modern Dark Design */}
      {isVoiceMode && (
        <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 z-40 flex flex-col items-center justify-between p-8">
          {/* Animated Background Effects */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>

          {/* Header */}
          <div className="w-full max-w-md relative z-10">
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={handleBackFromVoice}
                className="p-3 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all active:scale-95 border border-white/10"
              >
                <ArrowLeft className="w-5 h-5 text-gray-300" />
              </button>
              <h2 className="text-white text-lg font-medium">Voice Assistant</h2>
              <div className="w-11"></div>
            </div>
            <p className="text-gray-400 text-center text-sm">
              {isProcessing
                ? "Processing..."
                : isSpeaking
                ? "AI is speaking..."
                : listening
                ? "Listening..."
                : "Go ahead, I'm listening..."}
            </p>
          </div>

          {/* Fluid Organic Shape */}
          <div className="flex-1 flex items-center justify-center">
            <VoiceSphere isActive={listening || isSpeaking} mouthOpenness={mouthOpenness} />
          </div>

          {/* Content Display */}
          <div className="w-full max-w-md mb-8 relative z-10">
            {/* User Transcript - only show when listening */}
            {transcript && listening && (
              <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-3xl p-6 border border-gray-700/50 shadow-2xl">
                <p className="text-white text-base leading-relaxed text-center">
                  {transcript}
                </p>
              </div>
            )}

            {/* Processing indicator */}
            {isProcessing && !isSpeaking && !listening && (
              <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-3xl p-6 border border-gray-700/50 shadow-2xl">
                <div className="flex items-center justify-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-gray-300 text-sm">Thinking...</span>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Controls */}
          <div className="w-full max-w-md relative z-10">
            {/* Audio Visualizer Line - only show when active */}
            {(listening || isSpeaking) && (
              <div className="flex items-center justify-center gap-1 mb-6 h-12">
                {[...Array(30)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-gradient-to-t from-primary-400 to-purple-400 rounded-full transition-all"
                    style={{
                      height: `${20 + Math.sin((Date.now() / 100) + i) * 15}px`,
                      animation: `wave 0.8s ease-in-out infinite`,
                      animationDelay: `${i * 0.05}s`,
                      opacity: 0.6
                    }}
                  />
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-6">
              {/* Reset Button - only show when listening */}
              {listening && (
                <button
                  onClick={() => {
                    resetTranscript();
                    resetSpeechTranscript();
                  }}
                  className="p-4 rounded-2xl bg-gray-800/80 hover:bg-gray-700/80 backdrop-blur-sm transition-all active:scale-95 border border-gray-700/50"
                  title="Reset transcript"
                >
                  <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              )}

              {/* Mic Button - Center */}
              <button
                onClick={handleVoiceToggle}
                disabled={isProcessing}
                className={cn(
                  "relative p-8 rounded-full transition-all shadow-2xl disabled:opacity-50",
                  listening
                    ? "bg-gradient-to-br from-red-500 to-pink-500 hover:scale-105 active:scale-95 shadow-red-500/30"
                    : "bg-gradient-to-br from-primary-500 to-purple-500 hover:scale-105 active:scale-95 shadow-primary-500/30"
                )}
              >
                {/* Pulsing rings - only when listening */}
                {listening && (
                  <>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-500 to-pink-500 opacity-30 animate-ping"></div>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-500 to-pink-500 opacity-20 animate-pulse"></div>
                  </>
                )}

                <svg className="w-8 h-8 text-white relative z-10" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                  <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                </svg>
              </button>

              {/* Stop Speaking Button - show when AI is speaking */}
              {isSpeaking && (
                <button
                  onClick={handleStopSpeaking}
                  className="p-4 rounded-2xl bg-gray-800/80 hover:bg-gray-700/80 border border-gray-700/50 backdrop-blur-sm transition-all active:scale-95"
                  title="Stop AI"
                >
                  <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 6h12v12H6z"/>
                  </svg>
                </button>
              )}
            </div>

            {/* Helper text */}
            <p className="text-gray-500 text-xs text-center mt-4">
              {listening
                ? "Tap mic to send message"
                : isSpeaking
                ? "AI is responding..."
                : "Tap mic to start speaking"}
            </p>
          </div>
        </div>
      )}

      {/* Input area - Fixed at bottom */}
      <div className="border-t border-gray-800 bg-surface-dark relative z-10">
        <div className="container mx-auto px-4 py-3 max-w-4xl safe-area-bottom">
          {/* Unified Input */}
          <UnifiedInput
            onSendText={handleSendMessage}
            onSendImage={handleSendImage}
            onVoiceToggle={handleVoiceToggle}
            isListening={isListening}
            isProcessing={isProcessing}
            isSpeaking={isSpeaking}
            voiceDisabled={!isSpeechSupported}
            placeholder="Ketik pesan atau gunakan voice/upload gambar..."
          />
        </div>
      </div>


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

"use client";

import { useState, useCallback, useEffect } from 'react';
import TalkingAvatar from './TalkingAvatar';
import { speakWithAnimation, isSpeechSynthesisSupported } from '@/app/lib/speechSynthesisHandler';
import { Sparkles, Heart, Info, MessageCircle } from 'lucide-react';

export default function VoiceJKNAgentDemo() {
  const [mode, setMode] = useState('jkn'); // 'jkn' or 'curhat'
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const [mouthOpenness, setMouthOpenness] = useState(0);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    setIsSupported(isSpeechSynthesisSupported());
  }, []);

  const speak = useCallback(
    async (text) => {
      if (!isSupported) {
        alert('Speech Synthesis tidak didukung di browser Anda');
        return;
      }

      if (isSpeaking) {
        console.log('Already speaking, please wait...');
        return;
      }

      setCurrentText(text);
      setIsSpeaking(true);

      try {
        await speakWithAnimation(text, {
          lang: 'id-ID',
          rate: 0.9,
          pitch: mode === 'curhat' ? 1.05 : 1.0,
          onMouthMove: (openness) => {
            setMouthOpenness(openness);
          },
          onStart: () => {
            console.log('Started speaking');
          },
          onEnd: () => {
            console.log('Finished speaking');
            setIsSpeaking(false);
            setMouthOpenness(0);
            setTimeout(() => setCurrentText(''), 500);
          },
          onError: (error) => {
            console.error('Speech error:', error);
            setIsSpeaking(false);
            setMouthOpenness(0);
            setCurrentText('');
          },
        });
      } catch (error) {
        console.error('Error in speak:', error);
        setIsSpeaking(false);
        setMouthOpenness(0);
        setCurrentText('');
      }
    },
    [mode, isSpeaking, isSupported]
  );

  const quickPhrases = {
    jkn: [
      {
        label: 'Sambutan',
        text: 'Halo! Selamat datang di layanan JKN. Ada yang bisa saya bantu hari ini?',
        icon: <Sparkles className="w-5 h-5" />,
      },
      {
        label: 'Info Klaim',
        text: 'Untuk mengajukan klaim, silakan datang ke fasilitas kesehatan dengan membawa kartu JKN dan KTP Anda.',
        icon: <Info className="w-5 h-5" />,
      },
      {
        label: 'Pendaftaran',
        text: 'Pendaftaran JKN dapat dilakukan secara online melalui aplikasi Mobile JKN atau datang langsung ke kantor BPJS terdekat.',
        icon: <MessageCircle className="w-5 h-5" />,
      },
      {
        label: 'Penutup',
        text: 'Terima kasih telah menggunakan layanan kami. Semoga hari Anda menyenangkan!',
        icon: <Heart className="w-5 h-5" />,
      },
    ],
    curhat: [
      {
        label: 'Pembukaan',
        text: 'Saya di sini untuk mendengarkan. Ceritakan apa yang sedang Anda rasakan.',
        icon: <Heart className="w-5 h-5" />,
      },
      {
        label: 'Empati',
        text: 'Saya memahami bahwa ini tidak mudah untuk Anda. Perasaan Anda sangat valid dan penting.',
        icon: <Heart className="w-5 h-5" />,
      },
      {
        label: 'Dukungan',
        text: 'Anda tidak sendirian. Kami siap membantu dan mendukung Anda melalui ini semua.',
        icon: <Heart className="w-5 h-5" />,
      },
      {
        label: 'Penutup',
        text: 'Terima kasih telah berbagi dengan saya. Jaga diri Anda dengan baik, ya.',
        icon: <Sparkles className="w-5 h-5" />,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Voice JKN Agent - Talking Avatar
            </h1>
            <p className="text-gray-600 mt-2">
              Avatar Animasi dengan Lipsync & Ekspresi Wajah
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Avatar Section */}
        <div className="flex flex-col items-center gap-6">
          {/* Avatar */}
          <div className="w-full max-w-sm">
            <TalkingAvatar
              isSpeaking={isSpeaking}
              transcript={currentText}
              mode={mode}
              mouthOpenness={mouthOpenness}
            />
          </div>

          {/* Transcript Display */}
          {currentText && (
            <div className="w-full max-w-md animate-slide-up">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <p className="text-gray-700 text-center leading-relaxed">
                  "{currentText}"
                </p>
              </div>
            </div>
          )}

          {/* Mode Toggle */}
          <div className="flex gap-2 bg-white rounded-full p-1.5 shadow-lg border border-gray-200">
            <button
              onClick={() => !isSpeaking && setMode('jkn')}
              disabled={isSpeaking}
              className={`
                px-6 py-2.5 rounded-full transition-all font-medium
                ${
                  mode === 'jkn'
                    ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              Mode JKN
            </button>
            <button
              onClick={() => !isSpeaking && setMode('curhat')}
              disabled={isSpeaking}
              className={`
                px-6 py-2.5 rounded-full transition-all font-medium
                ${
                  mode === 'curhat'
                    ? 'bg-gradient-to-r from-green-600 to-emerald-500 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              Mode Curhat
            </button>
          </div>

          {/* Quick Phrases */}
          <div className="w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
              Coba Frasa Cepat:
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {quickPhrases[mode].map((phrase, index) => (
                <button
                  key={index}
                  onClick={() => speak(phrase.text)}
                  disabled={isSpeaking}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                    shadow-md hover:shadow-lg
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${
                      mode === 'jkn'
                        ? 'bg-gradient-to-br from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600'
                        : 'bg-gradient-to-br from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600'
                    }
                    text-white font-medium
                  `}
                >
                  {phrase.icon}
                  <span className="text-sm">{phrase.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full transition-colors ${
                isSpeaking ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
              }`}
            ></div>
            <span className="text-sm text-gray-600 font-medium">
              {isSpeaking ? 'Sedang berbicara...' : 'Siap mendengarkan'}
            </span>
          </div>

          {/* Browser Support Warning */}
          {!isSupported && (
            <div className="w-full bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <p className="text-yellow-800 text-sm text-center">
                ⚠️ Speech Synthesis tidak didukung di browser Anda. Gunakan
                Chrome, Edge, atau Safari terbaru.
              </p>
            </div>
          )}
        </div>

        {/* Features Info */}
        <div className="mt-12 grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-2">🎤 Lipsync</h4>
            <p className="text-sm text-gray-600">
              Mulut bergerak mengikuti suara secara real-time
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-2">👁️ Eye Blink</h4>
            <p className="text-sm text-gray-600">
              Kedipan mata natural setiap 3-5 detik
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-2">
              🎭 Idle Animation
            </h4>
            <p className="text-sm text-gray-600">
              Breathing & head bobbing saat tidak bicara
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

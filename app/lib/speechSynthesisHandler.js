/**
 * Speech Synthesis Handler untuk Text-to-Speech dengan analisis audio
 * Mendukung lip-sync animation dengan Web Audio API
 */

import AudioAnalyzer from './audioAnalyzer';

/**
 * Get available Indonesian voices
 * @returns {SpeechSynthesisVoice[]} Array of Indonesian voices
 */
export function getIndonesianVoices() {
  if (!window.speechSynthesis) {
    console.warn('Speech Synthesis not supported');
    return [];
  }

  const voices = window.speechSynthesis.getVoices();
  const indonesianVoices = voices.filter(
    (voice) => voice.lang.startsWith('id') || voice.lang.startsWith('in')
  );

  return indonesianVoices;
}

/**
 * Get best available voice for Indonesian
 * @returns {SpeechSynthesisVoice | null}
 */
export function getBestIndonesianVoice() {
  const voices = getIndonesianVoices();

  if (voices.length === 0) {
    // Fallback to any voice
    const allVoices = window.speechSynthesis.getVoices();
    return allVoices[0] || null;
  }

  // Prefer Google voices if available
  const googleVoice = voices.find((v) => v.name.includes('Google'));
  if (googleVoice) return googleVoice;

  // Otherwise return first Indonesian voice
  return voices[0];
}

/**
 * Speak text with animation callbacks
 * @param {string} text - Text to speak
 * @param {Object} options - Configuration options
 * @param {string} options.lang - Language code (default: 'id-ID')
 * @param {number} options.rate - Speech rate 0.1-10 (default: 0.9)
 * @param {number} options.pitch - Speech pitch 0-2 (default: 1.0)
 * @param {number} options.volume - Speech volume 0-1 (default: 1.0)
 * @param {SpeechSynthesisVoice} options.voice - Specific voice to use
 * @param {Function} options.onMouthMove - Callback(openness: 0-1)
 * @param {Function} options.onStart - Callback when speech starts
 * @param {Function} options.onEnd - Callback when speech ends
 * @param {Function} options.onError - Callback on error
 * @returns {Promise<void>}
 */
export async function speakWithAnimation(text, options = {}) {
  const {
    lang = 'id-ID',
    rate = 0.9,
    pitch = 1.0,
    volume = 1.0,
    voice = null,
    onMouthMove = null,
    onStart = null,
    onEnd = null,
    onError = null,
  } = options;

  return new Promise((resolve, reject) => {
    if (!window.speechSynthesis) {
      const error = new Error('Speech Synthesis not supported');
      if (onError) onError(error);
      reject(error);
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Create utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;

    // Set voice
    if (voice) {
      utterance.voice = voice;
    } else {
      // Try to get best Indonesian voice
      const bestVoice = getBestIndonesianVoice();
      if (bestVoice) {
        utterance.voice = bestVoice;
      }
    }

    // Audio analyzer for lip-sync
    let analyzer = null;

    // Event handlers
    utterance.onstart = () => {
      console.log('🎤 Speech started');
      if (onStart) onStart();

      // Start mouth animation based on speech events
      // Note: Web Audio API integration is complex with SpeechSynthesis
      // For now, use simple time-based animation
      if (onMouthMove) {
        startSimpleMouthAnimation(onMouthMove, utterance);
      }
    };

    utterance.onend = () => {
      console.log('✅ Speech ended');
      if (analyzer) {
        analyzer.stopAnalysis();
        analyzer = null;
      }
      if (onMouthMove) onMouthMove(0); // Close mouth
      if (onEnd) onEnd();
      resolve();
    };

    utterance.onerror = (event) => {
      console.error('❌ Speech error:', event);
      if (analyzer) {
        analyzer.stopAnalysis();
        analyzer = null;
      }
      if (onMouthMove) onMouthMove(0); // Close mouth
      if (onError) onError(event);
      reject(event);
    };

    // Speak
    window.speechSynthesis.speak(utterance);
  });
}

/**
 * Simple mouth animation based on speech timing
 * Since Web Audio API doesn't work directly with SpeechSynthesis,
 * we use a simulated wave pattern
 * @param {Function} onMouthMove - Callback(openness: 0-1)
 * @param {SpeechSynthesisUtterance} utterance - Current utterance
 */
function startSimpleMouthAnimation(onMouthMove, utterance) {
  let startTime = Date.now();
  let animationFrame = null;

  const animate = () => {
    if (!window.speechSynthesis.speaking) {
      onMouthMove(0);
      return;
    }

    const elapsed = Date.now() - startTime;

    // Create wave pattern for mouth movement
    // Use multiple frequencies for more natural look
    const wave1 = Math.sin(elapsed * 0.01) * 0.5;
    const wave2 = Math.sin(elapsed * 0.02) * 0.3;
    const wave3 = Math.sin(elapsed * 0.005) * 0.2;

    // Combine waves and normalize to 0-1
    let openness = (wave1 + wave2 + wave3 + 1) / 2;

    // Add some randomness for natural feel
    openness += (Math.random() - 0.5) * 0.1;

    // Clamp to 0-1
    openness = Math.max(0, Math.min(1, openness));

    onMouthMove(openness);

    animationFrame = requestAnimationFrame(animate);
  };

  animate();

  // Store animation frame for cleanup
  utterance._animationFrame = animationFrame;
}

/**
 * Stop current speech
 */
export function stopSpeaking() {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Pause current speech
 */
export function pauseSpeaking() {
  if (window.speechSynthesis) {
    window.speechSynthesis.pause();
  }
}

/**
 * Resume paused speech
 */
export function resumeSpeaking() {
  if (window.speechSynthesis) {
    window.speechSynthesis.resume();
  }
}

/**
 * Check if speech synthesis is supported
 * @returns {boolean}
 */
export function isSpeechSynthesisSupported() {
  return 'speechSynthesis' in window;
}

/**
 * Check if currently speaking
 * @returns {boolean}
 */
export function isSpeaking() {
  return window.speechSynthesis && window.speechSynthesis.speaking;
}

/**
 * Get all available voices
 * @returns {Promise<SpeechSynthesisVoice[]>}
 */
export function getAllVoices() {
  return new Promise((resolve) => {
    if (!window.speechSynthesis) {
      resolve([]);
      return;
    }

    let voices = window.speechSynthesis.getVoices();

    if (voices.length > 0) {
      resolve(voices);
      return;
    }

    // Some browsers load voices asynchronously
    window.speechSynthesis.onvoiceschanged = () => {
      voices = window.speechSynthesis.getVoices();
      resolve(voices);
    };
  });
}

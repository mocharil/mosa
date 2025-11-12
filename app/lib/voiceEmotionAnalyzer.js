/**
 * Voice Emotion Analyzer
 * Menganalisis emosi dari suara user berdasarkan fitur audio:
 * - Pitch (nada suara)
 * - Energy (intensitas/volume)
 * - Speech rate (kecepatan bicara)
 * - Frequency distribution
 */

class VoiceEmotionAnalyzer {
  constructor() {
    this.audioContext = null;
    this.analyser = null;
    this.dataArray = null;
    this.sampleRate = 44100;
    this.isAnalyzing = false;

    // Audio features untuk emotion detection
    this.features = {
      pitch: 0,           // Fundamental frequency (Hz)
      energy: 0,          // Average energy/volume
      zeroCrossingRate: 0, // Speech rate indicator
      spectralCentroid: 0, // Brightness of sound
      mfcc: [],           // Mel-frequency cepstral coefficients
    };

    // Emotion thresholds based on research
    this.emotionThresholds = {
      happy: {
        pitchMin: 200,
        pitchMax: 350,
        energyMin: 0.6,
        spectralCentroidMin: 1500,
      },
      sad: {
        pitchMin: 100,
        pitchMax: 180,
        energyMin: 0.2,
        energyMax: 0.5,
        spectralCentroidMax: 1200,
      },
      angry: {
        pitchMin: 180,
        pitchMax: 300,
        energyMin: 0.7,
        spectralCentroidMin: 1800,
      },
      neutral: {
        pitchMin: 150,
        pitchMax: 250,
        energyMin: 0.4,
        energyMax: 0.7,
      },
      anxious: {
        pitchMin: 200,
        energyMin: 0.5,
        zeroCrossingRateMin: 0.6, // Fast speech
      },
    };
  }

  /**
   * Initialize analyzer with audio stream
   * @param {MediaStream} stream - Audio stream from microphone
   * @returns {Promise<boolean>}
   */
  async initialize(stream) {
    try {
      // Create AudioContext
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioContext();
      this.sampleRate = this.audioContext.sampleRate;

      // Create analyser node
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 2048; // Higher resolution for better pitch detection
      this.analyser.smoothingTimeConstant = 0.8;

      // Connect microphone stream
      const source = this.audioContext.createMediaStreamSource(stream);
      source.connect(this.analyser);

      // Create data arrays
      const bufferLength = this.analyser.frequencyBinCount;
      this.dataArray = new Uint8Array(bufferLength);
      this.timeDataArray = new Uint8Array(bufferLength);

      console.log('✅ Voice Emotion Analyzer initialized');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Voice Emotion Analyzer:', error);
      return false;
    }
  }

  /**
   * Start analyzing audio and extracting features
   */
  startAnalysis() {
    if (!this.analyser) {
      console.warn('Analyzer not initialized');
      return;
    }

    this.isAnalyzing = true;
    this.analyzeFrame();
  }

  /**
   * Analyze single frame of audio
   */
  analyzeFrame() {
    if (!this.isAnalyzing) return;

    // Get frequency and time domain data
    this.analyser.getByteFrequencyData(this.dataArray);
    this.analyser.getByteTimeDomainData(this.timeDataArray);

    // Extract audio features
    this.features.pitch = this.estimatePitch();
    this.features.energy = this.calculateEnergy();
    this.features.zeroCrossingRate = this.calculateZeroCrossingRate();
    this.features.spectralCentroid = this.calculateSpectralCentroid();

    // Continue analysis
    requestAnimationFrame(() => this.analyzeFrame());
  }

  /**
   * Estimate pitch (fundamental frequency) using autocorrelation
   * @returns {number} Pitch in Hz
   */
  estimatePitch() {
    const buffer = this.timeDataArray;
    const bufferSize = buffer.length;

    // Simple autocorrelation method
    let maxCorrelation = 0;
    let bestOffset = -1;

    // Search for period in 50-500 Hz range (typical human voice)
    const minPeriod = Math.floor(this.sampleRate / 500); // 500 Hz
    const maxPeriod = Math.floor(this.sampleRate / 50);  // 50 Hz

    for (let offset = minPeriod; offset < maxPeriod; offset++) {
      let correlation = 0;
      for (let i = 0; i < bufferSize - offset; i++) {
        correlation += Math.abs((buffer[i] - 128) * (buffer[i + offset] - 128));
      }

      if (correlation > maxCorrelation) {
        maxCorrelation = correlation;
        bestOffset = offset;
      }
    }

    if (bestOffset === -1) return 0;

    const pitch = this.sampleRate / bestOffset;
    return pitch;
  }

  /**
   * Calculate energy (average volume/intensity)
   * @returns {number} Energy (0-1)
   */
  calculateEnergy() {
    let sum = 0;
    for (let i = 0; i < this.dataArray.length; i++) {
      sum += this.dataArray[i];
    }
    const average = sum / this.dataArray.length;
    return average / 255; // Normalize to 0-1
  }

  /**
   * Calculate zero crossing rate (speech rate indicator)
   * @returns {number} ZCR (0-1)
   */
  calculateZeroCrossingRate() {
    let crossings = 0;
    for (let i = 1; i < this.timeDataArray.length; i++) {
      if (
        (this.timeDataArray[i - 1] < 128 && this.timeDataArray[i] >= 128) ||
        (this.timeDataArray[i - 1] >= 128 && this.timeDataArray[i] < 128)
      ) {
        crossings++;
      }
    }
    return crossings / this.timeDataArray.length;
  }

  /**
   * Calculate spectral centroid (brightness of sound)
   * @returns {number} Spectral centroid in Hz
   */
  calculateSpectralCentroid() {
    let weightedSum = 0;
    let sum = 0;

    for (let i = 0; i < this.dataArray.length; i++) {
      const frequency = (i * this.sampleRate) / (2 * this.dataArray.length);
      const magnitude = this.dataArray[i];
      weightedSum += frequency * magnitude;
      sum += magnitude;
    }

    return sum > 0 ? weightedSum / sum : 0;
  }

  /**
   * Classify emotion based on extracted features
   * @returns {Object} Emotion classification with confidence
   */
  classifyEmotion() {
    const { pitch, energy, zeroCrossingRate, spectralCentroid } = this.features;

    // Ignore silence or very low energy
    if (energy < 0.1) {
      return {
        emotion: 'neutral',
        confidence: 0.5,
        features: { ...this.features },
      };
    }

    const scores = {
      happy: 0,
      sad: 0,
      angry: 0,
      anxious: 0,
      neutral: 0,
    };

    // Happy: High pitch, high energy, bright sound
    if (
      pitch >= this.emotionThresholds.happy.pitchMin &&
      pitch <= this.emotionThresholds.happy.pitchMax &&
      energy >= this.emotionThresholds.happy.energyMin &&
      spectralCentroid >= this.emotionThresholds.happy.spectralCentroidMin
    ) {
      scores.happy += 3;
    }

    // Sad: Low pitch, low energy, dark sound
    if (
      pitch >= this.emotionThresholds.sad.pitchMin &&
      pitch <= this.emotionThresholds.sad.pitchMax &&
      energy >= this.emotionThresholds.sad.energyMin &&
      energy <= this.emotionThresholds.sad.energyMax &&
      spectralCentroid <= this.emotionThresholds.sad.spectralCentroidMax
    ) {
      scores.sad += 3;
    }

    // Angry: Medium-high pitch, high energy, very bright sound
    if (
      pitch >= this.emotionThresholds.angry.pitchMin &&
      pitch <= this.emotionThresholds.angry.pitchMax &&
      energy >= this.emotionThresholds.angry.energyMin &&
      spectralCentroid >= this.emotionThresholds.angry.spectralCentroidMin
    ) {
      scores.angry += 3;
    }

    // Anxious: High pitch, medium energy, fast speech
    if (
      pitch >= this.emotionThresholds.anxious.pitchMin &&
      energy >= this.emotionThresholds.anxious.energyMin &&
      zeroCrossingRate >= this.emotionThresholds.anxious.zeroCrossingRateMin
    ) {
      scores.anxious += 2;
    }

    // Neutral: Middle range for all features
    if (
      pitch >= this.emotionThresholds.neutral.pitchMin &&
      pitch <= this.emotionThresholds.neutral.pitchMax &&
      energy >= this.emotionThresholds.neutral.energyMin &&
      energy <= this.emotionThresholds.neutral.energyMax
    ) {
      scores.neutral += 2;
    }

    // Find emotion with highest score
    let maxScore = 0;
    let detectedEmotion = 'neutral';

    for (const [emotion, score] of Object.entries(scores)) {
      if (score > maxScore) {
        maxScore = score;
        detectedEmotion = emotion;
      }
    }

    // Calculate confidence (0-1)
    const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
    const confidence = totalScore > 0 ? maxScore / totalScore : 0.5;

    return {
      emotion: detectedEmotion,
      confidence: confidence,
      features: { ...this.features },
      scores: { ...scores },
    };
  }

  /**
   * Get current emotion with confidence
   * @returns {Object} Current emotion classification
   */
  getCurrentEmotion() {
    return this.classifyEmotion();
  }

  /**
   * Stop analysis
   */
  stopAnalysis() {
    this.isAnalyzing = false;

    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
      this.audioContext = null;
    }

    this.analyser = null;
    this.dataArray = null;
    this.timeDataArray = null;

    console.log('✅ Voice Emotion Analyzer stopped');
  }

  /**
   * Get human-readable emotion description
   * @param {string} emotion - Emotion type
   * @returns {Object} Description and suggestion
   */
  static getEmotionDescription(emotion) {
    const descriptions = {
      happy: {
        label: 'Bahagia',
        icon: '😊',
        color: '#FCD34D',
        description: 'Anda terdengar ceria dan positif',
        aiResponse: 'senang',
      },
      sad: {
        label: 'Sedih',
        icon: '😔',
        color: '#93C5FD',
        description: 'Anda terdengar sedih atau kurang bersemangat',
        aiResponse: 'empati',
      },
      angry: {
        label: 'Marah',
        icon: '😠',
        color: '#FCA5A5',
        description: 'Anda terdengar kesal atau frustrasi',
        aiResponse: 'menenangkan',
      },
      anxious: {
        label: 'Cemas',
        icon: '😰',
        color: '#C4B5FD',
        description: 'Anda terdengar khawatir atau gelisah',
        aiResponse: 'menenangkan',
      },
      neutral: {
        label: 'Netral',
        icon: '😐',
        color: '#D1D5DB',
        description: 'Anda terdengar tenang dan biasa',
        aiResponse: 'normal',
      },
    };

    return descriptions[emotion] || descriptions.neutral;
  }
}

export default VoiceEmotionAnalyzer;

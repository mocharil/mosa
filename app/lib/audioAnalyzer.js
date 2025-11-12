/**
 * AudioAnalyzer - Web Audio API wrapper untuk analisis real-time
 * Digunakan untuk lip-sync animation berdasarkan volume audio
 */

class AudioAnalyzer {
  constructor() {
    this.audioContext = null;
    this.analyser = null;
    this.dataArray = null;
    this.animationFrame = null;
    this.previousVolume = 0;
    this.smoothingFactor = 0.7; // Higher = smoother but less responsive
  }

  /**
   * Initialize audio analyzer dengan audio element
   * @param {HTMLAudioElement} audioElement - Audio element dari speech synthesis
   * @returns {Promise<void>}
   */
  async initialize(audioElement) {
    try {
      // Create AudioContext (support legacy webkit prefix)
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioContext();

      // Create analyser node
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256; // Balance between detail and performance
      this.analyser.smoothingTimeConstant = 0.8; // Smooth but responsive

      // Connect audio element to analyser
      const source = this.audioContext.createMediaElementSource(audioElement);
      source.connect(this.analyser);
      this.analyser.connect(this.audioContext.destination);

      // Create data array for frequency data
      const bufferLength = this.analyser.frequencyBinCount;
      this.dataArray = new Uint8Array(bufferLength);

      console.log('✅ AudioAnalyzer initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize AudioAnalyzer:', error);
      return false;
    }
  }

  /**
   * Start analyzing audio and call callback with volume updates
   * @param {Function} onVolumeUpdate - Callback function(normalizedVolume: 0-1)
   */
  startAnalysis(onVolumeUpdate) {
    if (!this.analyser || !this.dataArray) {
      console.warn('AudioAnalyzer not initialized');
      return;
    }

    const analyze = () => {
      // Get frequency data
      this.analyser.getByteFrequencyData(this.dataArray);

      // Calculate volume from frequency data
      const volume = this.calculateVolume();

      // Smooth the volume changes
      const smoothedVolume = this.smoothVolume(volume);

      // Call update callback
      if (onVolumeUpdate) {
        onVolumeUpdate(smoothedVolume);
      }

      // Continue analysis loop
      this.animationFrame = requestAnimationFrame(analyze);
    };

    // Start the analysis loop
    analyze();
  }

  /**
   * Calculate volume from frequency data
   * Focuses on human voice frequency range (85Hz - 255Hz)
   * @returns {number} Normalized volume (0-1)
   */
  calculateVolume() {
    if (!this.dataArray) return 0;

    // Focus on frequency bins for human voice
    // Assuming fftSize 256 and sample rate 44100Hz
    // Bin 2-8 covers roughly 85Hz - 255Hz range
    const startBin = 2;
    const endBin = 8;

    let sum = 0;
    let count = 0;

    for (let i = startBin; i <= endBin; i++) {
      if (this.dataArray[i] !== undefined) {
        sum += this.dataArray[i];
        count++;
      }
    }

    if (count === 0) return 0;

    // Calculate average
    const average = sum / count;

    // Normalize to 0-1 range (0-255 -> 0-1)
    // Boost the signal a bit for more visible mouth movement
    const normalized = Math.min((average / 128) * 1.5, 1.0);

    return normalized;
  }

  /**
   * Smooth volume changes for natural animation
   * @param {number} currentVolume - Current volume value
   * @returns {number} Smoothed volume
   */
  smoothVolume(currentVolume) {
    // Exponential moving average for smooth transitions
    const smoothed =
      this.previousVolume * this.smoothingFactor +
      currentVolume * (1 - this.smoothingFactor);

    this.previousVolume = smoothed;
    return smoothed;
  }

  /**
   * Get current volume level
   * @returns {number} Current volume (0-1)
   */
  getVolume() {
    return this.previousVolume;
  }

  /**
   * Stop analysis and cleanup resources
   */
  stopAnalysis() {
    // Cancel animation frame
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }

    // Close audio context
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
      this.audioContext = null;
    }

    // Reset state
    this.analyser = null;
    this.dataArray = null;
    this.previousVolume = 0;

    console.log('✅ AudioAnalyzer stopped and cleaned up');
  }

  /**
   * Check if analyzer is currently active
   * @returns {boolean}
   */
  isActive() {
    return this.animationFrame !== null;
  }
}

export default AudioAnalyzer;

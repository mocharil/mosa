/**
 * Avatar Configuration
 * Constants untuk desain dan animasi avatar
 */

export const AVATAR_COLORS = {
  // Skin tones
  skin: {
    light: '#FFE0BD',
    medium: '#D4A574',
    dark: '#8D5524',
  },

  // Hair/Hijab colors
  hair: {
    black: '#2C3E50',
    brown: '#5D4037',
    darkBrown: '#3E2723',
  },

  // Eye colors
  eyes: {
    brown: '#4A2511',
    black: '#1A1A1A',
  },

  // Mouth colors based on mode
  mouth: {
    jkn: '#E67E80',
    curhat: '#FFB6C1',
    tongue: '#FF6B8A',
  },

  // Background gradients
  background: {
    jkn: {
      start: '#E8F4F8',
      end: '#B8D4E0',
    },
    curhat: {
      start: '#FFF5F7',
      end: '#FFE0E8',
    },
  },

  // Badge colors
  badge: {
    jkn: '#0066CC',
    curhat: '#48BB78',
  },
};

export const ANIMATION_CONFIG = {
  // Mouth animation
  mouth: {
    minWidth: 20,
    maxWidth: 30,
    minHeight: 5,
    maxHeight: 20,
    transitionDuration: '100ms',
  },

  // Eye blinking
  blink: {
    duration: 150, // ms
    interval: {
      min: 3000,
      max: 5000,
    },
  },

  // Idle breathing
  breathing: {
    duration: 4000, // ms
    scaleMin: 0.98,
    scaleMax: 1.0,
  },

  // Head bobbing
  bobbing: {
    duration: 3000, // ms
    translateMin: -2,
    translateMax: 2,
  },
};

export const AVATAR_DIMENSIONS = {
  viewBox: '0 0 300 300',
  width: 300,
  height: 300,

  // Face
  face: {
    cx: 150,
    cy: 160,
    rx: 75,
    ry: 90,
  },

  // Eyes
  leftEye: {
    cx: 130,
    cy: 150,
    rx: 8,
    ry: 10,
  },
  rightEye: {
    cx: 170,
    cy: 150,
    rx: 8,
    ry: 10,
  },

  // Eye highlights
  leftHighlight: {
    cx: 132,
    cy: 148,
    r: 3,
  },
  rightHighlight: {
    cx: 172,
    cy: 148,
    r: 3,
  },

  // Nose
  nose: {
    cx: 150,
    cy: 165,
  },

  // Mouth
  mouth: {
    cx: 150,
    cy: 185,
  },

  // Badge
  badge: {
    cx: 230,
    cy: 100,
    r: 25,
  },
};

export const EMOTION_STATES = {
  neutral: {
    eyebrowAngle: 0,
    mouthCurve: 0,
    eyeOpenness: 1.0,
  },
  happy: {
    eyebrowAngle: 5,
    mouthCurve: 10,
    eyeOpenness: 0.8,
  },
  empathetic: {
    eyebrowAngle: -5,
    mouthCurve: -5,
    eyeOpenness: 1.0,
  },
  surprised: {
    eyebrowAngle: 10,
    mouthCurve: 0,
    eyeOpenness: 1.2,
  },
};

# 🎭 Talking Avatar - Voice JKN Agent

Avatar animasi dengan lipsync real-time, eye blinking natural, dan idle animations untuk aplikasi Voice JKN Agent.

## ✨ Features

### 1. **Real-time Lipsync**
- Mulut bergerak mengikuti suara
- Wave-based animation yang natural
- Smooth transitions dengan easing

### 2. **Natural Eye Blinking**
- Kedip otomatis setiap 3-5 detik (random interval)
- Smooth blink animation (150ms)
- Eye highlights untuk tampilan lebih hidup

### 3. **Idle Animations**
- **Breathing effect**: Subtle scale pulse (98% → 100%)
- **Head bobbing**: Gentle vertical movement (-2px → 2px)
- Hanya aktif saat tidak berbicara

### 4. **Mode Switching**
- **Mode JKN**: Warna biru, ekspresi profesional
- **Mode Curhat**: Warna hijau/pink, ekspresi empati
- Smooth color transitions

### 5. **Status Indicators**
- Speaking indicator dengan animated dots
- Visual sound waves saat berbicara
- Status text (Siap mendengarkan / Sedang berbicara)

## 📁 File Structure

```
/app
  /voice-agent
    page.jsx                              # Demo page
  /components
    TalkingAvatar.jsx                     # Main avatar component
    AvatarSVG.jsx                         # SVG design with animations
    VoiceJKNAgentDemo.jsx                 # Integration demo
  /lib
    audioAnalyzer.js                      # Web Audio API handler
    speechSynthesisHandler.js             # TTS with lipsync
    avatarConfig.js                       # Design constants
```

## 🚀 Usage

### Basic Usage

```jsx
import TalkingAvatar from '@/app/components/TalkingAvatar';
import { speakWithAnimation } from '@/app/lib/speechSynthesisHandler';

function MyComponent() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [mouthOpenness, setMouthOpenness] = useState(0);

  const speak = async (text) => {
    setIsSpeaking(true);

    await speakWithAnimation(text, {
      lang: 'id-ID',
      rate: 0.9,
      onMouthMove: (openness) => {
        setMouthOpenness(openness);
      },
      onEnd: () => {
        setIsSpeaking(false);
        setMouthOpenness(0);
      }
    });
  };

  return (
    <div>
      <TalkingAvatar
        isSpeaking={isSpeaking}
        transcript="Halo, selamat datang!"
        mode="jkn"
        mouthOpenness={mouthOpenness}
      />

      <button onClick={() => speak('Halo, selamat datang!')}>
        Speak
      </button>
    </div>
  );
}
```

### Advanced Usage with Full Control

```jsx
import { speakWithAnimation } from '@/app/lib/speechSynthesisHandler';

const speak = async (text) => {
  await speakWithAnimation(text, {
    // Language
    lang: 'id-ID',

    // Speech parameters
    rate: 0.9,              // 0.1 - 10 (default: 0.9)
    pitch: 1.0,             // 0 - 2 (default: 1.0)
    volume: 1.0,            // 0 - 1 (default: 1.0)

    // Callbacks
    onMouthMove: (openness) => {
      // openness: 0-1
      setMouthOpenness(openness);
    },
    onStart: () => {
      console.log('Started speaking');
    },
    onEnd: () => {
      console.log('Finished speaking');
    },
    onError: (error) => {
      console.error('Speech error:', error);
    }
  });
};
```

## 🎨 Component Props

### TalkingAvatar

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isSpeaking` | boolean | `false` | Status apakah avatar sedang berbicara |
| `transcript` | string | `''` | Teks yang sedang diucapkan |
| `mode` | `'jkn' \| 'curhat'` | `'jkn'` | Mode untuk styling berbeda |
| `mouthOpenness` | number | `0` | Tingkat bukaan mulut (0-1) |
| `onSpeechEnd` | function | `null` | Callback saat selesai bicara |
| `className` | string | `''` | Additional CSS classes |

### AvatarSVG

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `mouthOpenness` | number | `0` | Tingkat bukaan mulut (0-1) |
| `isBlinking` | boolean | `false` | Status kedipan mata |
| `mode` | `'jkn' \| 'curhat'` | `'jkn'` | Mode untuk warna berbeda |
| `emotion` | string | `'neutral'` | Ekspresi wajah |
| `className` | string | `''` | Additional CSS classes |

## 🎯 API Reference

### speechSynthesisHandler.js

#### `speakWithAnimation(text, options)`
Speak text dengan animation callbacks

**Parameters:**
- `text` (string): Text to speak
- `options` (object):
  - `lang` (string): Language code (default: 'id-ID')
  - `rate` (number): Speech rate 0.1-10 (default: 0.9)
  - `pitch` (number): Speech pitch 0-2 (default: 1.0)
  - `volume` (number): Volume 0-1 (default: 1.0)
  - `onMouthMove` (function): Callback(openness: 0-1)
  - `onStart` (function): Callback when speech starts
  - `onEnd` (function): Callback when speech ends
  - `onError` (function): Callback on error

**Returns:** `Promise<void>`

#### `getIndonesianVoices()`
Get available Indonesian voices

**Returns:** `SpeechSynthesisVoice[]`

#### `getBestIndonesianVoice()`
Get best available Indonesian voice

**Returns:** `SpeechSynthesisVoice | null`

#### `stopSpeaking()`
Stop current speech

#### `isSpeechSynthesisSupported()`
Check if speech synthesis is supported

**Returns:** `boolean`

### audioAnalyzer.js

#### `AudioAnalyzer` Class

```javascript
const analyzer = new AudioAnalyzer();

// Initialize with audio element
await analyzer.initialize(audioElement);

// Start analyzing
analyzer.startAnalysis((volume) => {
  console.log('Volume:', volume); // 0-1
});

// Stop analyzing
analyzer.stopAnalysis();

// Check if active
const isActive = analyzer.isActive();
```

## 🎬 Demo

Akses demo di: `http://localhost:3002/voice-agent`

Demo mencakup:
- Mode switching (JKN vs Curhat)
- Quick phrases untuk testing
- Real-time transcript display
- Status indicators

## 🖌️ Customization

### Mengubah Warna Avatar

Edit `app/lib/avatarConfig.js`:

```javascript
export const AVATAR_COLORS = {
  skin: {
    light: '#FFE0BD',  // Ubah warna kulit
  },
  hair: {
    black: '#2C3E50',  // Ubah warna hijab/rambut
  },
  mouth: {
    jkn: '#E67E80',    // Ubah warna mulut mode JKN
    curhat: '#FFB6C1', // Ubah warna mulut mode Curhat
  },
};
```

### Mengubah Timing Animasi

Edit `app/lib/avatarConfig.js`:

```javascript
export const ANIMATION_CONFIG = {
  blink: {
    duration: 150,     // Durasi kedip (ms)
    interval: {
      min: 3000,       // Interval minimum (ms)
      max: 5000,       // Interval maximum (ms)
    },
  },
  breathing: {
    duration: 4000,    // Durasi breathing cycle (ms)
  },
};
```

### Mengubah Speech Rate

```javascript
await speakWithAnimation(text, {
  rate: 0.85,  // Lebih lambat untuk clarity
  // atau
  rate: 1.1,   // Lebih cepat untuk efisiensi
});
```

## 🌐 Browser Support

| Feature | Chrome | Edge | Safari | Firefox |
|---------|--------|------|--------|---------|
| Speech Synthesis | ✅ | ✅ | ✅ | ⚠️ Limited |
| Web Audio API | ✅ | ✅ | ✅ | ✅ |
| SVG Animations | ✅ | ✅ | ✅ | ✅ |
| Indonesian Voice | ✅ | ✅ | ✅ | ❌ |

**Recommended:** Chrome atau Edge untuk pengalaman terbaik

## 📱 Mobile Support

- ✅ Fully responsive
- ✅ Touch-friendly buttons
- ✅ Smooth animations on mobile
- ⚠️ iOS Safari: Memerlukan user interaction untuk play audio

## 🐛 Troubleshooting

### Avatar tidak berbicara

**Problem:** `speakWithAnimation()` tidak menghasilkan suara

**Solutions:**
1. Cek browser support:
   ```javascript
   if (!isSpeechSynthesisSupported()) {
     console.error('Speech Synthesis not supported');
   }
   ```

2. Pastikan voices sudah loaded:
   ```javascript
   window.speechSynthesis.onvoiceschanged = () => {
     const voices = window.speechSynthesis.getVoices();
     console.log('Voices loaded:', voices.length);
   };
   ```

3. Mobile iOS: Perlu user interaction first

### Mulut tidak bergerak

**Problem:** `mouthOpenness` tidak update

**Solution:**
Pastikan callback `onMouthMove` terhubung dengan state:

```javascript
await speakWithAnimation(text, {
  onMouthMove: (openness) => {
    setMouthOpenness(openness);  // Must update state!
  }
});
```

### Eye blinking terlalu cepat/lambat

**Solution:**
Adjust di `avatarConfig.js`:

```javascript
blink: {
  interval: {
    min: 2000,  // Lebih cepat
    max: 4000,
  },
}
```

### Animasi lag di low-end devices

**Solutions:**
1. Reduce animation complexity:
   ```javascript
   // Disable idle animations saat speaking
   <div className={!isSpeaking ? 'animate-breathing' : ''}>
   ```

2. Lower animation framerate di `speechSynthesisHandler.js`:
   ```javascript
   // Throttle mouth updates
   let lastUpdate = 0;
   const throttle = 50; // ms

   const animate = () => {
     const now = Date.now();
     if (now - lastUpdate > throttle) {
       onMouthMove(openness);
       lastUpdate = now;
     }
   };
   ```

## 🚀 Performance Tips

1. **Reuse Components:**
   ```javascript
   // Good: Satu instance avatar
   const avatar = <TalkingAvatar {...props} />;

   // Bad: Multiple instances
   ```

2. **Memoize Heavy Calculations:**
   ```javascript
   const colors = useMemo(() => ({
     // calculations
   }), [mode]);
   ```

3. **Cleanup Properly:**
   ```javascript
   useEffect(() => {
     return () => {
       analyzer.stopAnalysis();
       window.speechSynthesis.cancel();
     };
   }, []);
   ```

## 📦 Dependencies

- Next.js 14+
- React 18+
- Tailwind CSS 3+
- Web Speech API (built-in browser)
- Web Audio API (built-in browser)
- lucide-react (icons)

## 🎓 Learning Resources

- [Web Speech API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [Web Audio API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [SVG Animations](https://developer.mozilla.org/en-US/docs/Web/SVG/SVG_animation_with_SMIL)

## 🤝 Contributing

Untuk improve avatar:

1. **Add new emotions:**
   - Edit `EMOTION_STATES` di `avatarConfig.js`
   - Update emotion detection di `TalkingAvatar.jsx`

2. **Add gestures:**
   - Create new SVG elements di `AvatarSVG.jsx`
   - Add animation keyframes di `tailwind.config.ts`

3. **Improve lipsync:**
   - Enhance `AudioAnalyzer` dengan better frequency analysis
   - Add phoneme-based mouth shapes

## 📄 License

MIT License - Feel free to use in your projects!

---

**Created with ❤️ for Voice JKN Agent**

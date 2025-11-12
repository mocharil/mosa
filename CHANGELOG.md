# Changelog

All notable changes to Voice JKN Agent will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2025-01-10

### 🎉 Initial Release - MVP (Phase 1)

#### Added
- **Voice Interface**
  - Voice input dengan Web Speech API
  - Audio visualizer saat mendengarkan
  - Support bahasa Indonesia dan Inggris
  - Auto-detect bahasa dari input

- **Mode Konsultasi JKN**
  - Menjawab pertanyaan umum tentang JKN
  - Sistem triage untuk rekomendasi poli
  - Sitasi sumber resmi (hardcoded untuk 6 sumber utama)
  - Format jawaban dengan langkah-langkah actionable

- **Mode Curhat Aman**
  - Respons empatik dan non-judgmental
  - Deteksi kata kunci risiko tinggi (7 keywords)
  - Emotional scoring sederhana
  - Warning banner untuk risiko tinggi
  - Rujukan otomatis ke hotline (119 ext 8)

- **Chat Interface**
  - Real-time chat bubbles
  - Transcript display
  - Scroll ke pesan terbaru otomatis
  - Empty state untuk new conversations

- **Conversation Summary**
  - Generate ringkasan dengan AI
  - Export ke file text
  - Modal dengan preview

- **Emergency Features**
  - Floating emergency button
  - Modal dengan 4 kontak darurat
  - One-tap call links

- **UI/UX**
  - Responsive design (mobile-first)
  - Tema warna berbeda per mode (biru/hijau)
  - Loading states & animations
  - Disclaimer yang jelas

#### Tech Stack
- Next.js 14.2 dengan App Router
- React 18 dengan TypeScript
- Tailwind CSS untuk styling
- Google Gemini API (gemini-1.5-flash)
- Zustand untuk state management
- react-speech-recognition untuk voice input
- Web Speech API untuk TTS (opsional)

#### Developer Tools
- ESLint untuk linting
- TypeScript untuk type safety
- Hot reload untuk development
- Build optimization untuk production

#### Documentation
- Comprehensive README.md
- SETUP_GUIDE.md untuk developers
- DEPLOYMENT.md untuk deployment
- CONTRIBUTING.md untuk contributors
- API documentation dalam code comments

### Known Issues
- Web Speech API hanya bekerja di Chrome dan Edge
- Firefox memiliki dukungan terbatas
- Safari tidak fully supported
- Requires HTTPS di production (atau localhost)

### Limitations (MVP)
- Sitasi sumber masih hardcoded (belum RAG)
- Belum ada database untuk persistent storage
- Belum ada user authentication
- Belum ada analytics/monitoring
- Text input belum tersedia (voice only)

---

## [Planned] - Future Releases

### Version 0.2.0 (Phase 2) - Enhanced Features
**Target**: Q1 2025

#### Planned Features
- [ ] RAG implementation untuk sitasi dinamis
- [ ] Expanded JKN knowledge base (20+ sources)
- [ ] Advanced emotion detection
- [ ] Conversation history dengan database
- [ ] Text input sebagai fallback
- [ ] Multi-session support
- [ ] Better error handling & retry logic

### Version 0.3.0 (Phase 3) - Production Ready
**Target**: Q2 2025

#### Planned Features
- [ ] User authentication (optional)
- [ ] Analytics dashboard untuk admin
- [ ] Integration dengan API BPJS (jika tersedia)
- [ ] Advanced safety features
- [ ] Rate limiting & abuse prevention
- [ ] Monitoring & alerting
- [ ] A/B testing framework

### Version 1.0.0 - Full Production
**Target**: Q3 2025

#### Planned Features
- [ ] Multi-language support (10+ languages)
- [ ] Mobile app (React Native)
- [ ] Offline mode dengan caching
- [ ] Voice customization
- [ ] Advanced analytics
- [ ] Professional mental health integration
- [ ] BPJS official partnership (aspirational)

---

## Version History

### [0.1.0] - 2025-01-10
First public release - MVP with core features

---

## How to Read This Changelog

### Types of Changes
- **Added**: New features
- **Changed**: Changes in existing functionality
- **Deprecated**: Soon-to-be removed features
- **Removed**: Removed features
- **Fixed**: Bug fixes
- **Security**: Security vulnerability fixes

### Version Numbers
- **MAJOR**: Incompatible API changes (1.0.0 → 2.0.0)
- **MINOR**: New features, backwards-compatible (0.1.0 → 0.2.0)
- **PATCH**: Bug fixes, backwards-compatible (0.1.0 → 0.1.1)

---

## Contributing

Suggestions for future features? Open an issue or submit a PR!

## Support

For issues with current version, see [GitHub Issues](https://github.com/yourusername/voice-jkn-agent/issues)

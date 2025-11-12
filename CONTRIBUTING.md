# Contributing to Voice JKN Agent

Terima kasih atas minat Anda untuk berkontribusi! Dokumen ini berisi panduan untuk kontributor.

## Code of Conduct

Dengan berpartisipasi dalam project ini, Anda setuju untuk:
- Bersikap respectful kepada semua kontributor
- Memberikan kritik yang konstruktif
- Fokus pada apa yang terbaik untuk komunitas
- Menunjukkan empati terhadap kontributor lain

## Bagaimana Cara Berkontribusi?

### 1. Report Bugs
Jika menemukan bug, buat issue dengan:
- **Judul jelas**: "Bug: Speech recognition tidak bekerja di Firefox"
- **Deskripsi detail**: Langkah-langkah reproduce bug
- **Environment**: OS, browser, Node version
- **Screenshot/video** (jika relevan)

### 2. Suggest Features
Untuk request fitur baru:
- **Judul**: "Feature: Add multilingual support"
- **Use case**: Jelaskan kenapa fitur ini penting
- **Implementation ideas**: (opsional) Bagaimana cara implementasi

### 3. Submit Pull Requests
Ikuti workflow di bawah ini.

## Development Setup

```bash
# Fork repository di GitHub

# Clone fork Anda
git clone https://github.com/YOUR_USERNAME/voice-jkn-agent.git
cd voice-jkn-agent

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
# Edit .env.local dengan API key Anda

# Create branch untuk feature/fix
git checkout -b feature/your-feature-name

# Start development
npm run dev
```

## Pull Request Process

### 1. Branch Naming Convention
- `feature/feature-name` - Untuk fitur baru
- `fix/bug-description` - Untuk bug fixes
- `docs/what-changed` - Untuk dokumentasi
- `refactor/component-name` - Untuk refactoring

### 2. Commit Message Format
Gunakan conventional commits:
```
type(scope): subject

body (opsional)

footer (opsional)
```

**Types**:
- `feat`: Fitur baru
- `fix`: Bug fix
- `docs`: Perubahan dokumentasi
- `style`: Formatting, white-space
- `refactor`: Code refactoring
- `test`: Menambah tests
- `chore`: Maintenance tasks

**Contoh**:
```bash
git commit -m "feat(chat): add text input fallback for voice"
git commit -m "fix(api): handle rate limit errors gracefully"
git commit -m "docs(readme): update installation steps"
```

### 3. Code Quality Checklist

Sebelum submit PR, pastikan:
- [ ] Code linting passed: `npm run lint`
- [ ] Build successful: `npm run build`
- [ ] Tested manually di browser
- [ ] No console errors/warnings
- [ ] Responsive di mobile
- [ ] Commented complex logic
- [ ] Updated documentation jika perlu

### 4. Pull Request Template

Saat membuat PR, isi template:
```markdown
## Description
[Jelaskan apa yang diubah dan kenapa]

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
[Jelaskan bagaimana Anda test perubahan ini]

## Screenshots (jika UI changes)
[Tambahkan screenshot before/after]

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Commented complex code
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tested on Chrome & Edge
- [ ] Tested on mobile
```

## Coding Standards

### TypeScript
```typescript
// ✅ Good - Type everything
interface Props {
  message: string;
  onSend: (text: string) => void;
}

// ❌ Bad - No any
function process(data: any) { ... }

// ✅ Good - Specific types
function process(data: Message[]) { ... }
```

### React Components
```tsx
// ✅ Good - Functional components with TypeScript
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export default function Button({ label, onClick, disabled = false }: ButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}

// ❌ Bad - No types, unclear naming
export default function Btn({ l, o, d }) { ... }
```

### File Naming
- Components: `PascalCase.tsx` (e.g., `VoiceButton.tsx`)
- Utils: `camelCase.ts` (e.g., `speechRecognition.ts`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `SYSTEM_PROMPT_JKN`)

### CSS/Tailwind
```tsx
// ✅ Good - Semantic, organized
<div className="flex flex-col gap-4 p-6 bg-white rounded-lg shadow-md">
  <h2 className="text-xl font-bold text-gray-900">Title</h2>
  <p className="text-sm text-gray-600">Description</p>
</div>

// ❌ Bad - Unorganized, hard to read
<div className="flex p-6 bg-white text-xl flex-col rounded-lg gap-4 shadow-md font-bold">
```

### API Routes
```typescript
// ✅ Good - Proper error handling
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.query) {
      return NextResponse.json(
        { error: "Query is required" },
        { status: 400 }
      );
    }

    const result = await processQuery(body.query);
    return NextResponse.json(result);

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ❌ Bad - No error handling
export async function POST(request: NextRequest) {
  const body = await request.json();
  const result = await processQuery(body.query);
  return NextResponse.json(result);
}
```

## Areas for Contribution

### Priority 1 (High Impact)
- **Multilingual Support**: Tambah bahasa Sunda, Jawa, dll
- **Offline Mode**: Cache responses untuk offline usage
- **Accessibility**: Screen reader support, keyboard navigation
- **Performance**: Reduce bundle size, optimize loading

### Priority 2 (Medium Impact)
- **Authentication**: User accounts untuk save history
- **Database Integration**: Persistent chat history
- **Analytics**: Track usage patterns (privacy-conscious)
- **Testing**: Unit tests, integration tests

### Priority 3 (Nice to Have)
- **Dark Mode**: Theme switcher
- **Voice Cloning**: Custom TTS voices
- **Advanced RAG**: Better document retrieval
- **Mobile App**: React Native version

## Testing Guidelines

### Manual Testing
1. **Mode JKN**:
   - Test berbagai pertanyaan (prosedur, iuran, rujukan)
   - Verifikasi sitasi sumber muncul
   - Test sistem triage (keluhan → poli)

2. **Mode Curhat**:
   - Test respons empati
   - Test deteksi risiko tinggi (kata kunci)
   - Verifikasi emergency contacts muncul

3. **Voice Input**:
   - Test bahasa Indonesia
   - Test bahasa Inggris
   - Test dengan noise background
   - Test stop/start mic

4. **Edge Cases**:
   - Koneksi lambat
   - API timeout
   - Permission denied (mic)
   - Browser tidak support

### Automated Testing (Coming Soon)
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e
```

## Documentation

Saat menambah fitur baru, update:
- `README.md` - Overview & quick start
- `SETUP_GUIDE.md` - Development details
- `DEPLOYMENT.md` - Deployment instructions
- Code comments untuk complex logic

## Review Process

1. **Submit PR**: Buat PR dengan deskripsi jelas
2. **Automated Checks**: Build & lint must pass
3. **Code Review**: Maintainer akan review
4. **Request Changes**: Jika ada yang perlu diperbaiki
5. **Approval**: Setelah semua OK
6. **Merge**: Maintainer akan merge

## Questions?

- **General Questions**: Buat discussion di GitHub
- **Bug Reports**: Buat issue dengan label "bug"
- **Feature Requests**: Buat issue dengan label "enhancement"
- **Security Issues**: Email: security@yourproject.com (jangan public)

## Recognition

Semua kontributor akan:
- Ditambahkan ke CONTRIBUTORS.md
- Credited di release notes
- Mentioned di social media (jika ada)

## License

Dengan berkontribusi, Anda setuju bahwa kontribusi Anda akan dilisensikan di bawah MIT License yang sama dengan project ini.

---

**Terima kasih telah berkontribusi!** 🙏

Setiap kontribusi, sekecil apapun, sangat dihargai. Bersama-sama kita bisa membuat aplikasi ini lebih baik untuk membantu peserta JKN dan orang yang membutuhkan dukungan kesehatan mental.

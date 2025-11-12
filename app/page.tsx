"use client";

import { useRouter } from "next/navigation";
import { Sparkles, Heart, Shield, Mic, FileCheck, Zap, ArrowRight, User } from "lucide-react";

export default function HomePage() {
  const router = useRouter();

  const handleStart = () => {
    router.push("/chat");
  };

  const features = [
    {
      icon: <User className="h-6 w-6" />,
      title: "Avatar Animasi dengan Lipsync",
      description: "Avatar yang bicara dengan mulut bergerak, mata berkedip, dan ekspresi natural",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: <Mic className="h-6 w-6" />,
      title: "Percakapan Suara 2 Arah",
      description: "Bicara dan dengarkan jawaban AI dengan suara - seperti mengobrol dengan teman",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Dukungan Emosional",
      description: "Ruang aman untuk berbagi cerita dengan respons empatik dan profesional",
      gradient: "from-pink-500 to-rose-500",
    },
    {
      icon: <FileCheck className="h-6 w-6" />,
      title: "Informasi JKN Akurat",
      description: "Jawaban lengkap dengan sitasi sumber resmi dari peraturan BPJS",
      gradient: "from-purple-500 to-indigo-500",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Privasi Terjamin",
      description: "Data percakapan aman, tidak disimpan tanpa persetujuan Anda",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Respons Cepat",
      description: "AI modern yang memahami konteks dan memberikan jawaban instant",
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: "Unified Experience",
      description: "Tanya JKN dan curhat dalam satu tempat, switch topik dengan mudah",
      gradient: "from-violet-500 to-purple-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Voice JKN Agent</h1>
              <p className="text-xs text-gray-600">Asisten Kesehatan AI</p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6 animate-fade-in">
            <Sparkles className="h-4 w-4" />
            <span>Powered by Google Gemini AI</span>
          </div>

          {/* Main Heading */}
          <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Asisten Kesehatan{" "}
            <span className="bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
              Untuk Anda
            </span>
          </h2>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Tanyakan apapun tentang layanan JKN atau berbagi cerita Anda.
            Kami siap membantu dengan informasi akurat dan dukungan emosional.
          </p>

          {/* CTA Button */}
          <button
            onClick={handleStart}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Mic className="h-6 w-6" />
            <span>Mulai Percakapan</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <p className="text-sm text-gray-500 mt-4">
            Gratis • Tanpa Login • Privasi Terjamin
          </p>
        </div>

        {/* Features Grid */}
        <div className="max-w-6xl mx-auto mt-20">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Fitur Unggulan
          </h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl p-6 shadow-soft hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary-200 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} text-white mb-4 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h4 className="font-semibold text-lg text-gray-900 mb-2">
                  {feature.title}
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="max-w-4xl mx-auto mt-20">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Cara Menggunakan
          </h3>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white text-2xl font-bold mb-4 shadow-lg">
                1
              </div>
              <h4 className="font-semibold text-lg mb-2">Tekan Mikrofon</h4>
              <p className="text-gray-600 text-sm">
                Klik tombol mikrofon besar di halaman chat
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-accent-500 to-accent-600 text-white text-2xl font-bold mb-4 shadow-lg">
                2
              </div>
              <h4 className="font-semibold text-lg mb-2">Bicara dengan Jelas</h4>
              <p className="text-gray-600 text-sm">
                Tanyakan tentang JKN atau ceritakan perasaan Anda
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-purple-600 text-white text-2xl font-bold mb-4 shadow-lg">
                3
              </div>
              <h4 className="font-semibold text-lg mb-2">Dapatkan Bantuan</h4>
              <p className="text-gray-600 text-sm">
                Terima jawaban akurat atau dukungan emosional
              </p>
            </div>
          </div>
        </div>

        {/* Use Cases */}
        <div className="max-w-6xl mx-auto mt-20">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Apa yang Bisa Anda Tanyakan?
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-8 border border-primary-200">
              <div className="flex items-center gap-3 mb-4">
                <FileCheck className="h-8 w-8 text-primary-600" />
                <h4 className="text-xl font-bold text-primary-900">Pertanyaan JKN</h4>
              </div>
              <ul className="space-y-3 text-primary-800">
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 mt-1">•</span>
                  <span>"Bagaimana cara mendaftar JKN?"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 mt-1">•</span>
                  <span>"Berapa iuran JKN per bulan?"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 mt-1">•</span>
                  <span>"Bagaimana prosedur rujukan?"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600 mt-1">•</span>
                  <span>"Saya sakit perut, harus ke poli apa?"</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-accent-50 to-accent-100 rounded-2xl p-8 border border-accent-200">
              <div className="flex items-center gap-3 mb-4">
                <Heart className="h-8 w-8 text-accent-600" />
                <h4 className="text-xl font-bold text-accent-900">Curhat & Dukungan</h4>
              </div>
              <ul className="space-y-3 text-accent-800">
                <li className="flex items-start gap-2">
                  <span className="text-accent-600 mt-1">•</span>
                  <span>"Saya merasa stres dengan pekerjaan"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-600 mt-1">•</span>
                  <span>"Saya cemas tentang kesehatan saya"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-600 mt-1">•</span>
                  <span>"Saya butuh seseorang untuk diajak bicara"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-600 mt-1">•</span>
                  <span>"Saya merasa sendirian"</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="max-w-4xl mx-auto mt-20 text-center">
          <div className="bg-gradient-to-br from-primary-600 to-accent-500 rounded-3xl p-12 shadow-2xl text-white">
            <Sparkles className="h-12 w-12 mx-auto mb-4 animate-bounce-subtle" />
            <h3 className="text-3xl font-bold mb-4">
              Siap untuk Memulai?
            </h3>
            <p className="text-primary-100 mb-8 text-lg max-w-2xl mx-auto">
              Tidak perlu daftar, tidak perlu login. Langsung bicara dan dapatkan bantuan yang Anda butuhkan.
            </p>
            <button
              onClick={handleStart}
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-primary-600 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Mic className="h-6 w-6" />
              <span>Mulai Sekarang</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-16 max-w-3xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <h4 className="font-semibold text-yellow-900 mb-2 flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Penting untuk Diketahui
            </h4>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Layanan ini BUKAN pengganti konsultasi medis atau psikologis profesional</li>
              <li>• Untuk kondisi darurat, segera hubungi 119 atau kunjungi fasilitas kesehatan terdekat</li>
              <li>• Informasi yang diberikan bersifat umum dan edukatif</li>
              <li>• Percakapan Anda aman dan tidak disimpan tanpa persetujuan</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold">Voice JKN Agent</span>
          </div>
          <p className="text-gray-400 mb-4">
            Asisten Kesehatan AI untuk informasi JKN dan dukungan emosional
          </p>
          <div className="flex justify-center gap-6 text-sm text-gray-400 mb-6">
            <span>Hotline BPJS: 1500-400</span>
            <span>•</span>
            <span>Kesehatan Jiwa: 119 ext 8</span>
            <span>•</span>
            <span>Halo Kemkes: 1500-567</span>
          </div>
          <p className="text-xs text-gray-500">
            &copy; 2025 Voice JKN Agent. Dibuat untuk membantu masyarakat Indonesia.
          </p>
        </div>
      </footer>
    </div>
  );
}

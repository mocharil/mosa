"use client";

import { useEffect, useRef } from "react";
import { Message } from "@/app/lib/gemini";
import ChatBubble from "./ChatBubble";
import ThinkingIndicator from "./ThinkingIndicator";
import { Sparkles, Heart, FileCheck } from "lucide-react";

interface ChatContainerProps {
  messages: Message[];
  isProcessing?: boolean;
}

export default function ChatContainer({ messages, isProcessing = false }: ChatContainerProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isProcessing]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="mb-4 max-w-2xl">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 mb-6 shadow-lg">
            <Sparkles className="h-10 w-10 text-white" />
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Selamat Datang di Voice Assistant
          </h3>

          <p className="text-gray-600 mb-8 leading-relaxed">
            Tekan tombol mikrofon dan mulai percakapan. Anda bisa:
          </p>

          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-6 border border-primary-200">
              <FileCheck className="h-8 w-8 text-primary-600 mb-3 mx-auto" />
              <h4 className="font-semibold text-primary-900 mb-2">
                Tanya tentang JKN
              </h4>
              <p className="text-sm text-primary-700">
                Prosedur, iuran, klaim, rujukan, dan layanan BPJS Kesehatan
              </p>
            </div>

            <div className="bg-gradient-to-br from-accent-50 to-accent-100 rounded-xl p-6 border border-accent-200">
              <Heart className="h-8 w-8 text-accent-600 mb-3 mx-auto" />
              <h4 className="font-semibold text-accent-900 mb-2">
                Berbagi Cerita
              </h4>
              <p className="text-sm text-accent-700">
                Ruang aman untuk curhat dan mendapat dukungan emosional
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 overflow-y-auto h-full scroll-smooth
      scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900/50
      hover:scrollbar-thumb-gray-600 scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
      {messages.map((message, index) => (
        <ChatBubble
          key={index}
          message={message}
          isLatest={index === messages.length - 1 && message.role === "assistant"}
        />
      ))}

      {/* Show thinking indicator when processing */}
      {isProcessing && <ThinkingIndicator />}

      <div ref={bottomRef} />
    </div>
  );
}

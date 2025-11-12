"use client";

import { Message } from "@/app/lib/gemini";
import { cn } from "@/app/lib/utils";
import { parseMarkdown } from "@/app/lib/markdown";
import { Sparkles, User } from "lucide-react";

interface ChatBubbleProps {
  message: Message;
}

export default function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex gap-3 items-start animate-slide-up",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl shadow-sm",
          isUser
            ? "bg-gradient-to-br from-primary-500 to-primary-600"
            : "bg-gradient-to-br from-primary-500 to-accent-500"
        )}
      >
        {isUser ? (
          <User className="h-5 w-5 text-white" />
        ) : (
          <Sparkles className="h-5 w-5 text-white" />
        )}
      </div>

      {/* Message bubble */}
      <div
        className={cn(
          "flex flex-col gap-2 rounded-2xl px-4 py-3 max-w-[80%]",
          isUser
            ? "bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-soft"
            : "bg-white border border-gray-200 shadow-soft"
        )}
      >
        {/* Image if present */}
        {message.imageUrl && (
          <div className="rounded-xl overflow-hidden mb-2">
            <img
              src={message.imageUrl}
              alt="Uploaded image"
              className="w-full h-auto max-h-64 object-contain"
            />
          </div>
        )}

        <div className={cn(
          "text-sm leading-relaxed",
          isUser ? "text-white whitespace-pre-wrap" : "text-gray-900"
        )}>
          {isUser ? message.content : parseMarkdown(message.content)}
        </div>

        {/* Timestamp */}
        <div
          className={cn(
            "text-xs",
            isUser ? "text-right text-primary-100" : "text-left text-gray-500"
          )}
        >
          {new Date(message.timestamp).toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
}

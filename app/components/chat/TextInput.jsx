"use client";

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';

export default function TextInput({
  onSend,
  isProcessing = false,
  disabled = false,
  placeholder = "Ketik pesan Anda...",
  className = ""
}) {
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [text]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() && !isProcessing && !disabled) {
      onSend(text.trim());
      setText('');

      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e) => {
    // Submit on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="flex items-end gap-2 bg-white rounded-2xl border-2 border-gray-200 focus-within:border-primary-500 transition-colors p-2 shadow-sm">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled || isProcessing}
          rows={1}
          className="flex-1 resize-none outline-none px-2 py-2 max-h-32 overflow-y-auto text-gray-900 placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ minHeight: '40px' }}
        />

        <button
          type="submit"
          disabled={!text.trim() || isProcessing || disabled}
          className="shrink-0 p-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-primary-600 disabled:hover:to-primary-500 shadow-md hover:shadow-lg"
        >
          {isProcessing ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Hint text */}
      <p className="text-xs text-gray-500 mt-2 px-2">
        Tekan <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs">Enter</kbd> untuk kirim,
        <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs ml-1">Shift+Enter</kbd> untuk baris baru
      </p>
    </form>
  );
}

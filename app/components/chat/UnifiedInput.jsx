"use client";

import { useState, useRef, useEffect } from 'react';
import { Send, Mic, Image as ImageIcon, X, Loader2 } from 'lucide-react';
import { cn } from '@/app/lib/utils';

export default function UnifiedInput({
  onSendText,
  onSendImage,
  onVoiceToggle,
  isListening = false,
  isProcessing = false,
  isSpeaking = false,
  voiceDisabled = false,
  placeholder = "Ketik pesan atau gunakan voice/upload gambar..."
}) {
  const [text, setText] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [text]);

  // Handle text submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() && !isProcessing) {
      onSendText(text);
      setText('');
    }
  };

  // Handle Enter key
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Handle file select
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Hanya file gambar yang diperbolehkan');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file maksimal 5MB');
      return;
    }

    setSelectedImage(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Handle image send
  const handleSendImage = () => {
    if (selectedImage && !isProcessing) {
      onSendImage({
        image: selectedImage,
        previewUrl: previewUrl,
        caption: text.trim() || 'Gambar diunggah'
      });
      // Clear after send
      setSelectedImage(null);
      setPreviewUrl(null);
      setText('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Remove image
  const handleRemoveImage = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      {/* Image Preview */}
      {previewUrl && (
        <div className="relative bg-gray-100 rounded-xl overflow-hidden animate-slide-up">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-auto max-h-48 object-contain"
          />

          {/* Remove button */}
          <button
            type="button"
            onClick={handleRemoveImage}
            disabled={isProcessing}
            className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-colors disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Image info */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
            <div className="flex items-center gap-2 text-white text-xs">
              <ImageIcon className="w-3 h-3" />
              <span className="truncate">{selectedImage.name}</span>
              <span className="opacity-75">
                ({(selectedImage.size / 1024).toFixed(0)} KB)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Input Bar */}
      <form onSubmit={selectedImage ? (e) => { e.preventDefault(); handleSendImage(); } : handleSubmit}>
        <div className="flex items-end gap-2 bg-white rounded-2xl p-2 shadow-lg border border-gray-200">
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={isProcessing || isListening}
            className="hidden"
          />

          {/* Image upload button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing || isListening}
            className={cn(
              "p-2.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0",
              selectedImage
                ? "bg-purple-100 text-purple-600 hover:bg-purple-200"
                : "hover:bg-gray-100 text-gray-600"
            )}
            title="Upload gambar"
          >
            <ImageIcon className="w-5 h-5" />
          </button>

          {/* Text input */}
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={isProcessing}
            rows={1}
            className="flex-1 resize-none outline-none bg-transparent px-2 py-2.5 text-gray-900 placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed max-h-[120px] overflow-y-auto"
          />

          {/* Voice button */}
          <button
            type="button"
            onClick={onVoiceToggle}
            disabled={voiceDisabled || isProcessing}
            className={cn(
              "p-2.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0",
              isListening
                ? "bg-red-500 text-white hover:bg-red-600 animate-pulse"
                : isSpeaking
                ? "bg-orange-500 text-white hover:bg-orange-600"
                : "bg-green-500 text-white hover:bg-green-600"
            )}
            title={isListening ? "Stop recording" : isSpeaking ? "AI sedang berbicara (klik untuk interrupt)" : "Mulai voice chat"}
          >
            <Mic className="w-5 h-5" />
          </button>

          {/* Send button */}
          <button
            type="submit"
            disabled={(!text.trim() && !selectedImage) || isProcessing}
            className="p-2.5 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg shrink-0"
            title="Kirim"
          >
            {isProcessing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </form>

      {/* Helper text */}
      <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
        <span>💬 Ketik pesan</span>
        <span>•</span>
        <span>🎤 Voice chat</span>
        <span>•</span>
        <span>🖼️ Upload gambar</span>
      </div>
    </div>
  );
}

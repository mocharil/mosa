"use client";

import { useState, useRef, useEffect } from 'react';
import { Send, Mic, Image as ImageIcon, X, Loader2, Camera, Paperclip } from 'lucide-react';
import { cn } from '@/app/lib/utils';
import dynamic from 'next/dynamic';

// Dynamically import CameraCapture (client-only component)
const CameraCapture = dynamic(() => import('@/app/components/camera/CameraCapture'), {
  ssr: false,
});

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
  const [showCamera, setShowCamera] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const attachMenuRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [text]);

  // Close attach menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (attachMenuRef.current && !attachMenuRef.current.contains(event.target)) {
        setShowAttachMenu(false);
      }
    };

    if (showAttachMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAttachMenu]);

  // Handle text submit
  const handleSubmit = (e) => {
    e.preventDefault();

    // If there's a selected image, send it with caption
    if (selectedImage) {
      handleSendImage();
      return;
    }

    // Otherwise send as text message
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
      // Use text as caption if provided, otherwise empty string
      const caption = text.trim() || '';

      console.log('Sending image with caption:', caption || '(no caption)');

      onSendImage({
        image: selectedImage,
        previewUrl: previewUrl,
        caption: caption
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

  // Handle camera capture
  const handleCameraCapture = (imageData) => {
    setSelectedImage(imageData.image);
    setPreviewUrl(imageData.previewUrl);
    setShowCamera(false);
    setShowAttachMenu(false);
  };

  return (
    <div className="space-y-3">
      {/* Camera Capture Modal */}
      {showCamera && (
        <CameraCapture
          onCapture={handleCameraCapture}
          onClose={() => setShowCamera(false)}
        />
      )}

      {/* Minimalist Image Preview */}
      {previewUrl && (
        <div className="relative bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl rounded-2xl overflow-hidden animate-slide-up border border-white/10 shadow-2xl">
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
            className="absolute top-3 right-3 p-2 bg-red-500/90 hover:bg-red-600 text-white rounded-xl shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-50 backdrop-blur-sm"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Image info */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between gap-2 text-white text-xs">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className="p-1.5 bg-white/10 rounded-lg">
                  <ImageIcon className="w-3 h-3 shrink-0" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="truncate font-medium">{selectedImage.name}</div>
                  <div className="text-[10px] text-gray-400">
                    {(selectedImage.size / 1024).toFixed(0)} KB
                  </div>
                </div>
              </div>
              {text.trim() && (
                <span className="bg-gradient-to-r from-primary-500 to-accent-500 px-2.5 py-1 rounded-lg text-[10px] font-medium shrink-0 shadow-lg">
                  + Caption
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Minimalist Input Bar */}
      <form onSubmit={handleSubmit}>
        <div className="relative flex items-end gap-2 bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl rounded-2xl p-3 shadow-2xl border border-white/10">
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              handleFileSelect(e);
              setShowAttachMenu(false);
            }}
            disabled={isProcessing || isListening}
            className="hidden"
          />

          {/* Attachment button with popup menu */}
          <div className="relative shrink-0" ref={attachMenuRef}>
            <button
              type="button"
              onClick={() => setShowAttachMenu(!showAttachMenu)}
              disabled={isProcessing || isListening}
              className={cn(
                "p-2.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed",
                showAttachMenu || selectedImage
                  ? "bg-primary-500/20 text-primary-400"
                  : "hover:bg-white/10 text-gray-400"
              )}
              title="Attach file"
            >
              <Paperclip className="w-5 h-5" />
            </button>

            {/* Attachment popup menu */}
            {showAttachMenu && (
              <div className="absolute bottom-full left-0 mb-2 bg-gradient-to-br from-gray-900 to-black border border-white/20 rounded-xl shadow-2xl overflow-hidden animate-slide-up min-w-[160px] z-[100]">
                <button
                  type="button"
                  onClick={() => {
                    setShowCamera(true);
                    setShowAttachMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors text-left"
                >
                  <Camera className="w-4 h-4 text-primary-400" />
                  <span className="text-sm text-white">Camera</span>
                </button>
                <div className="h-px bg-white/10" />
                <button
                  type="button"
                  onClick={() => {
                    fileInputRef.current?.click();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors text-left"
                >
                  <ImageIcon className="w-4 h-4 text-accent-400" />
                  <span className="text-sm text-white">Gallery</span>
                </button>
              </div>
            )}
          </div>

          {/* Text input */}
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={selectedImage ? "Add caption (optional)..." : "Type a message..."}
            disabled={isProcessing}
            rows={1}
            className="flex-1 resize-none outline-none bg-transparent px-2 py-2.5 text-white placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed max-h-[120px] overflow-y-auto"
          />

          {/* Voice button */}
          <button
            type="button"
            onClick={onVoiceToggle}
            disabled={voiceDisabled || isProcessing || selectedImage !== null}
            className={cn(
              "p-2.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0 relative",
              isListening
                ? "bg-red-500/90 text-white hover:bg-red-600 shadow-lg shadow-red-500/30"
                : isSpeaking
                ? "bg-orange-500/90 text-white hover:bg-orange-600 shadow-lg shadow-orange-500/30"
                : "bg-gradient-to-br from-primary-500 to-accent-500 text-white hover:scale-105 shadow-lg shadow-primary-500/20"
            )}
            title={
              selectedImage
                ? "Voice unavailable with images"
                : isListening
                ? "Stop & send"
                : isSpeaking
                ? "AI speaking (click to stop)"
                : "Start voice input"
            }
          >
            <Mic className="w-5 h-5" />
            {isListening && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full border-2 border-red-500 animate-ping"></span>
            )}
          </button>

          {/* Send button */}
          <button
            type="submit"
            disabled={(!text.trim() && !selectedImage) || isProcessing}
            className={cn(
              "p-2.5 rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed shrink-0",
              (!text.trim() && !selectedImage) || isProcessing
                ? "bg-gray-700 text-gray-500"
                : "bg-gradient-to-br from-primary-500 to-accent-500 text-white hover:scale-105 shadow-lg shadow-primary-500/30 active:scale-95"
            )}
            title={
              selectedImage && text.trim()
                ? "Send image with caption"
                : selectedImage
                ? "Send image"
                : "Send message"
            }
          >
            {isProcessing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </form>

      {/* Minimalist helper text */}
      <div className="flex items-center justify-center gap-2 text-[10px] text-gray-600">
        <span className="opacity-60">Voice · Attach · Type</span>
      </div>
    </div>
  );
}

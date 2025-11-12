"use client";

import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2, Send } from 'lucide-react';

export default function ImageUpload({
  onSend,
  isProcessing = false,
  disabled = false,
  className = ""
}) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [caption, setCaption] = useState('');
  const fileInputRef = useRef(null);

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

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setCaption('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedImage && !isProcessing) {
      onSend({
        image: selectedImage,
        previewUrl: previewUrl,
        caption: caption.trim() || 'Gambar diunggah'
      });
      handleRemoveImage();
    }
  };

  return (
    <div className={`${className}`}>
      {/* File input (hidden) */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        disabled={disabled || isProcessing}
        className="hidden"
      />

      {!selectedImage ? (
        /* Upload button */
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isProcessing}
          className="w-full p-8 border-2 border-dashed border-gray-300 rounded-2xl hover:border-primary-500 hover:bg-primary-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex flex-col items-center gap-3">
            <div className="p-4 bg-primary-100 rounded-full">
              <Upload className="w-8 h-8 text-primary-600" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-gray-900 mb-1">
                Upload Gambar
              </p>
              <p className="text-sm text-gray-600">
                Klik untuk memilih gambar atau drag & drop
              </p>
              <p className="text-xs text-gray-500 mt-2">
                PNG, JPG, JPEG • Max 5MB
              </p>
            </div>
          </div>
        </button>
      ) : (
        /* Preview and send */
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image preview */}
          <div className="relative bg-gray-100 rounded-2xl overflow-hidden">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-auto max-h-96 object-contain"
            />

            {/* Remove button */}
            <button
              type="button"
              onClick={handleRemoveImage}
              disabled={isProcessing}
              className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Image info */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <div className="flex items-center gap-2 text-white text-sm">
                <ImageIcon className="w-4 h-4" />
                <span className="truncate">{selectedImage.name}</span>
                <span className="text-xs opacity-75">
                  ({(selectedImage.size / 1024).toFixed(0)} KB)
                </span>
              </div>
            </div>
          </div>

          {/* Caption input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Caption (opsional)
            </label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Tambahkan keterangan gambar..."
              disabled={isProcessing}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Send button */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-3 px-4 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Mengirim...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Kirim Gambar</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}

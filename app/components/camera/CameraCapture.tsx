"use client";

import { useRef, useState, useEffect } from "react";
import { Camera, X, RotateCcw, Check, SwitchCamera, Zap } from "lucide-react";

interface CameraCaptureProps {
  onCapture: (imageData: { image: File; previewUrl: string }) => void;
  onClose: () => void;
}

export default function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize camera
  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [facingMode]);

  const startCamera = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Stop existing stream
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      // Request camera access
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });

      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }

      setIsLoading(false);
    } catch (err) {
      console.error("Camera error:", err);
      setError("Tidak dapat mengakses kamera. Pastikan Anda memberikan izin kamera.");
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    // Set canvas size to video size
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert to blob
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          setCapturedImage(url);
        }
      }, "image/jpeg", 0.95);
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  const confirmPhoto = () => {
    if (!capturedImage || !canvasRef.current) return;

    canvasRef.current.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `photo-${Date.now()}.jpg`, {
          type: "image/jpeg",
        });

        onCapture({
          image: file,
          previewUrl: capturedImage,
        });

        stopCamera();
        onClose();
      }
    }, "image/jpeg", 0.95);
  };

  const switchCamera = () => {
    setFacingMode(prev => prev === "user" ? "environment" : "user");
    setCapturedImage(null);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-[10] bg-gradient-to-b from-black/80 to-transparent p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
          >
            <X className="h-6 w-6 text-white" />
          </button>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-500/20 backdrop-blur-sm border border-primary-500/30">
            <Camera className="h-4 w-4 text-primary-400" />
            <span className="text-sm font-medium text-white">Camera</span>
          </div>

          {!capturedImage && (
            <button
              onClick={switchCamera}
              className="p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
            >
              <SwitchCamera className="h-6 w-6 text-white" />
            </button>
          )}

          {capturedImage && <div className="w-10" />}
        </div>
      </div>

      {/* Camera View / Preview */}
      <div className="relative w-full h-full flex items-center justify-center bg-black">
        {/* Video Stream */}
        {!capturedImage && (
          <div className="relative w-full h-full">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />

            {/* Loading indicator */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-full border-4 border-primary-500/30 border-t-primary-500 animate-spin"></div>
                  <p className="text-white text-sm">Initializing camera...</p>
                </div>
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80 p-6">
                <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-2xl p-6 max-w-sm">
                  <p className="text-white text-center mb-4">{error}</p>
                  <button
                    onClick={startCamera}
                    className="w-full px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}

            {/* Guide overlay */}
            {!isLoading && !error && (
              <div className="absolute inset-0 pointer-events-none">
                {/* Corner guides */}
                <div className="absolute top-1/4 left-8 w-12 h-12 border-l-2 border-t-2 border-white/30"></div>
                <div className="absolute top-1/4 right-8 w-12 h-12 border-r-2 border-t-2 border-white/30"></div>
                <div className="absolute bottom-1/4 left-8 w-12 h-12 border-l-2 border-b-2 border-white/30"></div>
                <div className="absolute bottom-1/4 right-8 w-12 h-12 border-r-2 border-b-2 border-white/30"></div>

                {/* Center hint */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="px-4 py-2 bg-black/50 backdrop-blur-sm rounded-lg border border-white/20">
                    <p className="text-white text-sm">Position subject in frame</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Captured Image Preview */}
        {capturedImage && (
          <div className="relative w-full h-full">
            <img
              src={capturedImage}
              alt="Captured"
              className="w-full h-full object-contain bg-black"
            />
          </div>
        )}

        {/* Hidden canvas for capture */}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 right-0 z-[10] bg-gradient-to-t from-black/80 to-transparent p-6 pb-8">
        {!capturedImage ? (
          /* Capture Button */
          <div className="flex items-center justify-center gap-8">
            <div className="w-16" />

            <button
              onClick={capturePhoto}
              disabled={isLoading || !!error}
              className="relative group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {/* Outer ring */}
              <div className="absolute inset-0 -m-2 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 opacity-0 group-hover:opacity-100 transition-opacity blur-md"></div>

              {/* Button */}
              <div className="relative w-20 h-20 rounded-full bg-white border-4 border-gray-800 group-hover:scale-95 group-active:scale-90 transition-transform flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                  <Zap className="h-8 w-8 text-white" />
                </div>
              </div>
            </button>

            <div className="w-16" />
          </div>
        ) : (
          /* Preview Controls */
          <div className="flex items-center justify-center gap-6">
            {/* Retake */}
            <button
              onClick={retakePhoto}
              className="flex flex-col items-center gap-2 group"
            >
              <div className="p-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 group-hover:bg-white/20 group-active:scale-95 transition-all">
                <RotateCcw className="h-6 w-6 text-white" />
              </div>
              <span className="text-xs text-white/80 font-medium">Retake</span>
            </button>

            {/* Confirm */}
            <button
              onClick={confirmPhoto}
              className="flex flex-col items-center gap-2 group"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full blur-lg opacity-50 group-hover:opacity-70 transition-opacity"></div>
                <div className="relative p-5 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 group-hover:scale-105 group-active:scale-95 transition-all">
                  <Check className="h-7 w-7 text-white" />
                </div>
              </div>
              <span className="text-xs text-white font-medium">Use Photo</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

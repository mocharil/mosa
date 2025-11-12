"use client";

import { useState } from "react";
import { FileText, X, Download } from "lucide-react";

interface ConversationSummaryProps {
  summary: string;
  onClose: () => void;
}

export default function ConversationSummary({
  summary,
  onClose,
}: ConversationSummaryProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);

    // Create a simple text file
    const text = `Ringkasan Percakapan - Voice JKN Agent\n`;
    const dateStr = `Tanggal: ${new Date().toLocaleString("id-ID")}\n\n`;
    const content = text + dateStr + summary;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ringkasan-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setTimeout(() => setIsExporting(false), 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-primary-50 to-accent-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-primary-600" />
              <h2 className="text-xl font-bold text-gray-900">
                Ringkasan Percakapan
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/50 rounded-lg transition-colors text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[50vh]">
          <div className="prose prose-sm max-w-none">
            <div className="whitespace-pre-wrap leading-relaxed text-gray-700">
              {summary}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors font-medium text-gray-800"
          >
            Tutup
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="h-4 w-4" />
            {isExporting ? "Mengekspor..." : "Ekspor"}
          </button>
        </div>
      </div>
    </div>
  );
}

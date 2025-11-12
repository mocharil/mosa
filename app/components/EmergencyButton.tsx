"use client";

import { useState } from "react";
import { Phone, X } from "lucide-react";

export default function EmergencyButton() {
  const [showModal, setShowModal] = useState(false);

  const emergencyContacts = [
    {
      name: "Hotline Kesehatan Jiwa",
      number: "119 ext 8",
      description: "Layanan darurat kesehatan mental 24/7",
    },
    {
      name: "BPJS Kesehatan",
      number: "1500-400",
      description: "Layanan informasi dan bantuan BPJS",
    },
    {
      name: "Halo Kemkes",
      number: "1500-567",
      description: "Layanan informasi kesehatan Kementerian Kesehatan",
    },
  ];

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 bg-red-500 hover:bg-red-600 text-white p-4 rounded-full shadow-lg transition-all hover:scale-110 z-40"
        aria-label="Emergency contacts"
      >
        <Phone className="h-6 w-6" />
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            {/* Header */}
            <div className="p-6 border-b bg-red-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Phone className="h-6 w-6 text-red-500" />
                  <h2 className="text-xl font-bold text-red-500">
                    Kontak Darurat
                  </h2>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-red-100 rounded-lg transition-colors text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">
                Jika Anda atau seseorang yang Anda kenal membutuhkan bantuan
                segera, silakan hubungi nomor darurat berikut:
              </p>

              <div className="space-y-4">
                {emergencyContacts.map((contact, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <h3 className="font-semibold text-gray-900">
                      {contact.name}
                    </h3>
                    <a
                      href={`tel:${contact.number.replace(/\s/g, "")}`}
                      className="text-2xl font-bold text-red-500 hover:underline"
                    >
                      {contact.number}
                    </a>
                    <p className="text-sm text-gray-600 mt-1">
                      {contact.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Catatan:</strong> Layanan ini bukan pengganti
                  konsultasi medis profesional. Untuk kondisi darurat, segera
                  kunjungi fasilitas kesehatan terdekat.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t bg-gray-50">
              <button
                onClick={() => setShowModal(false)}
                className="w-full px-6 py-3 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors font-medium text-gray-800"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

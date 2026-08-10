"use client";

import { useState, useEffect, useRef } from "react";

export default function QRScanner() {
  const [status, setStatus] = useState<string>("disconnected");
  const [qrData, setQrData] = useState<string>("");
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState("");
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    checkStatus();
    pollRef.current = setInterval(checkStatus, 3000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, []);

  const checkStatus = async () => {
    try {
      const res = await fetch("/api/whatsapp/status");
      const data = await res.json();
      setStatus(data.status);
      if (data.qr) setQrData(data.qr);
      if (data.status === "connected") setQrData("");
    } catch {
      // ignore
    }
  };

  const handleConnect = async () => {
    setConnecting(true);
    setError("");
    try {
      const res = await fetch("/api/whatsapp/qr", { method: "POST" });
      const data = await res.json();
      if (data.qr) setQrData(data.qr);
      if (data.error) setError(data.error);
      checkStatus();
    } catch (err: any) {
      setError(err.message || "Gagal terhubung");
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await fetch("/api/whatsapp/qr", { method: "DELETE" });
      setQrData("");
      checkStatus();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">Koneksi WhatsApp</h3>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              status === "connected"
                ? "bg-green-100 text-green-700"
                : status === "connecting"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {status === "connected" ? "Connected" : status === "connecting" ? "Connecting..." : "Disconnected"}
          </span>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        {qrData && status === "connecting" && (
          <div className="text-center space-y-4">
            <p className="text-sm text-gray-800">Scan QR Code ini dengan WhatsApp Anda:</p>
            <div className="bg-white p-4 rounded-lg border border-gray-200 inline-block">
              <div id="qrcode-canvas" className="w-64 h-64 mx-auto" />
              <QRCodeDisplay data={qrData} />
            </div>
            <p className="text-xs text-gray-800">Buka WhatsApp &gt; Linked Devices &gt; Scan QR Code</p>
          </div>
        )}

        {status === "connected" && (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-gray-800 font-medium">WhatsApp Terhubung</p>
            <p className="text-sm text-gray-900">Pengingat otomatis akan dikirim via WhatsApp</p>
          </div>
        )}

        <div className="mt-4 flex gap-3">
          {status !== "connected" ? (
            <button
              onClick={handleConnect}
              disabled={connecting || status === "connecting"}
              className="flex-1 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition text-sm font-medium"
            >
              {connecting ? "Menghubungkan..." : "Hubungkan WhatsApp"}
            </button>
          ) : (
            <button
              onClick={handleDisconnect}
              className="flex-1 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium"
            >
              Putuskan Koneksi
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h4 className="font-semibold text-gray-800 mb-2">Informasi</h4>
        <ul className="text-sm text-gray-800 space-y-2">
          <li>WhatsApp digunakan untuk mengirim pengingat otomatis H-1 dan 1 jam sebelum jadwal</li>
          <li>Pastikan nomor WhatsApp yang digunakan sudah terdaftar sebagai WhatsApp Business</li>
          <li>Koneksi akan tetap aktif selama server berjalan</li>
        </ul>
      </div>
    </div>
  );
}

function QRCodeDisplay({ data }: { data: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!data || !canvasRef.current) return;
    import("qrcode").then((QRCode) => {
      QRCode.toCanvas(canvasRef.current!, data, { width: 256 });
    });
  }, [data]);

  return <canvas ref={canvasRef} />;
}

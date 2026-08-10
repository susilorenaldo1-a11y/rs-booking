import QRScanner from "@/components/whatsapp/QRScanner";
import Link from "next/link";

export default function WhatsAppPage() {
  return (
    <div className="py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/admin" className="text-sm text-blue-600 hover:text-blue-800">
            &larr; Kembali ke Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-1">Koneksi WhatsApp</h1>
          <p className="text-gray-500 mt-1">Hubungkan WhatsApp untuk mengirim pengingat otomatis</p>
        </div>
        <QRScanner />
      </div>
    </div>
  );
}

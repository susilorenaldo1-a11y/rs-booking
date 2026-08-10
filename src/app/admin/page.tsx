import Link from "next/link";

export default function AdminPage() {
  return (
    <div className="py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
          <p className="text-gray-500 mt-2">Kelola jadwal dokter, koneksi WhatsApp, dan pengingat</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Link
            href="/admin/calendar"
            className="bg-white rounded-xl shadow-sm border border-sky-100 p-6 hover:shadow-md transition group"
          >
            <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-sky-200 transition">
              <svg className="w-6 h-6 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">Kalender Jadwal</h3>
            <p className="text-sm text-gray-500">Visualisasi jadwal dokter dengan FullCalendar</p>
          </Link>

          <Link
            href="/admin/whatsapp"
            className="bg-white rounded-xl shadow-sm border border-sky-100 p-6 hover:shadow-md transition group"
          >
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-200 transition">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">Koneksi WhatsApp</h3>
            <p className="text-sm text-gray-500">Scan QR Code untuk mengaktifkan pengingat WhatsApp</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

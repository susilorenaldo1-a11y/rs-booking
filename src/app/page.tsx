import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col">
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight">
            Reservasi Rumah Sakit Mudah & Cepat
          </h1>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Booking dokter online dengan bantuan AI Chatbot. Dapatkan pengingat otomatis via WhatsApp.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/booking"
              className="px-6 py-3 bg-white text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition shadow-lg"
            >
              Booking Sekarang
            </Link>
            <Link
              href="/chat"
              className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-400 transition border border-blue-400"
            >
              Tanya AI Asisten
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Booking Interaktif</h3>
            <p className="text-sm text-gray-500">Pilih dokter, tanggal, dan jam dengan form interaktif 3 langkah mudah.</p>
          </div>
          <div className="text-center p-6">
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">AI Chatbot (RAG)</h3>
            <p className="text-sm text-gray-500">Tanya jadwal & booking dokter melalui chat dengan bantuan AI yang terhubung knowledge base.</p>
          </div>
          <div className="text-center p-6">
            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Pengingat WhatsApp</h3>
            <p className="text-sm text-gray-500">Dapatkan notifikasi otomatis H-1 dan 1 jam sebelum janji temu via WhatsApp.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

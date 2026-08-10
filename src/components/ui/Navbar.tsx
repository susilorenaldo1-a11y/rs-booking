import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="font-bold text-gray-900 text-lg">RS Booking</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/booking" className="text-sm text-gray-600 hover:text-blue-600 transition">
              Booking
            </Link>
            <Link href="/chat" className="text-sm text-gray-600 hover:text-blue-600 transition">
              AI Chat
            </Link>
            <Link href="/admin" className="text-sm text-gray-600 hover:text-blue-600 transition">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

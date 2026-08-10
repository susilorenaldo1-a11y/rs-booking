import DoctorCalendar from "@/components/calendar/DoctorCalendar";
import Link from "next/link";

export default function CalendarPage() {
  return (
    <div className="py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/admin" className="text-sm text-blue-600 hover:text-blue-800">
              &larr; Kembali ke Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mt-1">Kalender Jadwal Dokter</h1>
          </div>
        </div>
        <DoctorCalendar />
      </div>
    </div>
  );
}

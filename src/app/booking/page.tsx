import { BookingForm } from "@/components/booking/BookingForm";

export default function BookingPage() {
  return (
    <div className="py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Booking Dokter</h1>
          <p className="text-gray-700 mt-2">Isi form berikut untuk membuat janji temu dengan dokter pilihan Anda</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <BookingForm />
        </div>
      </div>
    </div>
  );
}

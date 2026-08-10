"use client";

import { useState, useEffect, useCallback } from "react";

interface Doctor {
  id: string;
  name: string;
  specialization: string;
}

interface TimeSlot {
  startTime: string;
  endTime: string;
}

interface DatePickerProps {
  selectedDate: string;
  onChange: (date: string) => void;
  minDate?: string;
}

export default function DatePicker({ selectedDate, onChange, minDate }: DatePickerProps) {
  const today = minDate || new Date().toISOString().split("T")[0];
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Pilih Tanggal
      </label>
      <input
        type="date"
        value={selectedDate}
        min={today}
        max={maxDate.toISOString().split("T")[0]}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
      />
    </div>
  );
}

interface TimeSlotPickerProps {
  slots: TimeSlot[];
  selectedSlot: TimeSlot | null;
  onChange: (slot: TimeSlot) => void;
  loading: boolean;
}

export function TimeSlotPicker({ slots, selectedSlot, onChange, loading }: TimeSlotPickerProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-12 bg-gray-100 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <p className="text-gray-500 text-sm">
        Tidak ada slot tersedia untuk tanggal ini. Silakan pilih tanggal lain.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      {slots.map((slot) => (
        <button
          key={slot.startTime}
          type="button"
          onClick={() => onChange(slot)}
          className={`px-3 py-2.5 rounded-lg text-sm font-medium transition border ${
            selectedSlot?.startTime === slot.startTime
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-700 border-gray-200 hover:border-blue-400 hover:bg-blue-50"
          }`}
        >
          {slot.startTime}
        </button>
      ))}
    </div>
  );
}

export function BookingForm() {
  const [step, setStep] = useState(1);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/doctors")
      .then((r) => r.json())
      .then((data) => setDoctors(data))
      .catch(console.error);
  }, []);

  const generateSlots = useCallback((date: string, doctorId: string) => {
    if (!date || !doctorId) {
      setSlots([]);
      return;
    }
    setSlotsLoading(true);
    const dayOfWeek = new Date(date).getDay();
    if (dayOfWeek === 0) {
      setSlots([]);
      setSlotsLoading(false);
      return;
    }
    const generated: TimeSlot[] = [];
    const morningStart = 8;
    const morningEnd = 12;
    const afternoonStart = 13;
    const afternoonEnd = 16;
    for (let h = morningStart; h < morningEnd; h++) {
      generated.push({
        startTime: `${h.toString().padStart(2, "0")}:00`,
        endTime: `${(h + 1).toString().padStart(2, "0")}:00`,
      });
    }
    for (let h = afternoonStart; h < afternoonEnd; h++) {
      generated.push({
        startTime: `${h.toString().padStart(2, "0")}:00`,
        endTime: `${(h + 1).toString().padStart(2, "0")}:00`,
      });
    }
    setTimeout(() => {
      setSlots(generated);
      setSlotsLoading(false);
    }, 300);
  }, []);

  useEffect(() => {
    setSelectedSlot(null);
    generateSlots(selectedDate, selectedDoctor);
  }, [selectedDate, selectedDoctor, generateSlots]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) return;
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorId: selectedDoctor,
          ...formData,
          date: selectedDate,
          startTime: selectedSlot.startTime,
          endTime: selectedSlot.endTime,
          notes: formData.notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal membuat booking");
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Booking Berhasil!</h2>
        <p className="text-gray-600 mb-6">Anda akan menerima pengingat via WhatsApp sebelum jadwal janji temu.</p>
        <button
          onClick={() => {
            setSuccess(false);
            setStep(1);
            setSelectedDoctor("");
            setSelectedDate("");
            setSelectedSlot(null);
            setFormData({ name: "", email: "", phone: "", notes: "" });
          }}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Booking Baru
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="flex items-center gap-2 mb-6">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                s <= step ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"
              }`}
            >
              {s}
            </div>
            {s < 3 && <div className={`w-8 h-0.5 ${s < step ? "bg-blue-600" : "bg-gray-200"}`} />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Pilih Dokter</h3>
          <div className="space-y-2">
            {doctors.map((doc) => (
              <button
                key={doc.id}
                type="button"
                onClick={() => {
                  setSelectedDoctor(doc.id);
                  setStep(2);
                }}
                className={`w-full text-left p-4 rounded-lg border transition ${
                  selectedDoctor === doc.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300"
                }`}
              >
                <p className="font-medium text-gray-800">{doc.name}</p>
                <p className="text-sm text-gray-500">{doc.specialization}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setStep(1)} className="text-blue-600 hover:text-blue-800 text-sm">
              &larr; Kembali
            </button>
            <h3 className="text-lg font-semibold text-gray-800">Pilih Jadwal</h3>
          </div>
          <DatePicker selectedDate={selectedDate} onChange={setSelectedDate} />
          {selectedDate && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Slot Tersedia</label>
              <TimeSlotPicker
                slots={slots}
                selectedSlot={selectedSlot}
                onChange={(slot) => {
                  setSelectedSlot(slot);
                  setStep(3);
                }}
                loading={slotsLoading}
              />
            </div>
          )}
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setStep(2)} className="text-blue-600 hover:text-blue-800 text-sm">
              &larr; Kembali
            </button>
            <h3 className="text-lg font-semibold text-gray-800">Data Diri</h3>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
            <p><span className="font-medium">Dokter:</span> {doctors.find((d) => d.id === selectedDoctor)?.name}</p>
            <p><span className="font-medium">Tanggal:</span> {selectedDate}</p>
            <p><span className="font-medium">Jam:</span> {selectedSlot?.startTime} - {selectedSlot?.endTime}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              placeholder="Masukkan nama Anda"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              placeholder="email@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nomor WhatsApp</label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              placeholder="08123456789"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Catatan (opsional)</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              rows={3}
              placeholder="Gejala atau keluhan..."
            />
          </div>

          <button
            type="submit"
            disabled={submitting || !selectedSlot}
            className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
          >
            {submitting ? "Memproses..." : "Konfirmasi Booking"}
          </button>
        </div>
      )}
    </form>
  );
}

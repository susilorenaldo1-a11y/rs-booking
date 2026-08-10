"use client";

import { useState, useEffect, useCallback } from "react";

const DUMMY_DOCTORS = [
  { id: "1", name: "Dr. Andini Lestari", specialization: "Dokter Umum", rating: 4.8, patients: 1240, schedule: "Sen-Jum 08:00-16:00", photo: "👩‍⚕️" },
  { id: "2", name: "Dr. Budi Santoso", specialization: "Dokter Gigi", rating: 4.7, patients: 980, schedule: "Sen-Jum 09:00-15:00", photo: "👨‍⚕️" },
  { id: "3", name: "Dr. Citra Dewi", specialization: "Dokter Anak", rating: 4.9, patients: 1560, schedule: "Sen-Sab 08:00-14:00", photo: "👩‍⚕️" },
  { id: "4", name: "Dr. Darma Wijaya", specialization: "Dokter Penyakit Dalam", rating: 4.6, patients: 820, schedule: "Sen-Jum 10:00-16:00", photo: "👨‍⚕️" },
  { id: "5", name: "Dr. Eka Putri", specialization: "Dokter Kulit & Kelamin", rating: 4.7, patients: 670, schedule: "Sel-Sab 08:00-13:00", photo: "👩‍⚕️" },
  { id: "6", name: "Dr. Fajar Nugroho", specialization: "Dokter Jantung", rating: 4.9, patients: 2100, schedule: "Sen-Kam 08:00-15:00", photo: "👨‍⚕️" },
  { id: "7", name: "Dr. Gita Rahayu", specialization: "Dokter Mata", rating: 4.8, patients: 1450, schedule: "Sen-Jum 09:00-16:00", photo: "👩‍⚕️" },
  { id: "8", name: "Dr. Hadi Pratama", specialization: "Dokter Saraf", rating: 4.5, patients: 560, schedule: "Sen, Rab, Jum 08:00-14:00", photo: "👨‍⚕️" },
];

interface TimeSlot {
  startTime: string;
  endTime: string;
}

interface RegistrationData {
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  gender: string;
}

interface BookingProgress {
  step: number;
  regData: RegistrationData;
  selectedDoctor: string;
  selectedDate: string;
  selectedSlot: TimeSlot | null;
  notes: string;
}

function loadProgress(): BookingProgress | null {
  if (typeof window === "undefined") return null;
  try {
    const saved = localStorage.getItem("rs-booking-progress");
    return saved ? JSON.parse(saved) : null;
  } catch { return null; }
}

function saveProgress(data: BookingProgress) {
  if (typeof window === "undefined") return;
  localStorage.setItem("rs-booking-progress", JSON.stringify(data));
}

function clearProgress() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("rs-booking-progress");
}

export function BookingForm() {
  const saved = loadProgress();
  const [step, setStep] = useState(saved?.step ?? 0);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);

  const [regData, setRegData] = useState<RegistrationData>(
    saved?.regData ?? { name: "", email: "", phone: "", birthDate: "", gender: "" }
  );
  const [selectedDoctor, setSelectedDoctor] = useState(saved?.selectedDoctor ?? "");
  const [selectedDate, setSelectedDate] = useState(saved?.selectedDate ?? "");
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(saved?.selectedSlot ?? null);
  const [notes, setNotes] = useState(saved?.notes ?? "");
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [regError, setRegError] = useState("");

  useEffect(() => {
    const p: BookingProgress = { step, regData, selectedDoctor, selectedDate, selectedSlot, notes };
    saveProgress(p);
  }, [step, regData, selectedDoctor, selectedDate, selectedSlot, notes]);

  const generateSlots = useCallback((date: string) => {
    if (!date) { setSlots([]); return; }
    setSlotsLoading(true);
    const dayOfWeek = new Date(date + "T00:00:00").getDay();
    if (dayOfWeek === 0) { setSlots([]); setSlotsLoading(false); return; }
    const generated: TimeSlot[] = [];
    const doctor = DUMMY_DOCTORS.find((d) => d.id === selectedDoctor);
    const isSaturday = dayOfWeek === 6;
    const maxHour = isSaturday ? 13 : (doctor?.id === "6" ? 15 : 16);
    const minHour = doctor?.id === "4" ? 10 : (doctor?.id === "5" && !isSaturday ? 8 : 8);
    for (let h = minHour; h < maxHour; h++) {
      if ((h >= 12 && h < 13 && !isSaturday) || (h < 12)) {
        generated.push({ startTime: `${h.toString().padStart(2, "0")}:00`, endTime: `${(h + 1).toString().padStart(2, "0")}:00` });
      }
    }
    setTimeout(() => { setSlots(generated); setSlotsLoading(false); }, 200);
  }, [selectedDoctor]);

  useEffect(() => { setSelectedSlot(null); generateSlots(selectedDate); }, [selectedDate, generateSlots]);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regData.name.trim() || !regData.phone.trim()) {
      setRegError("Nama dan nomor WhatsApp wajib diisi");
      return;
    }
    if (regData.phone.length < 10) {
      setRegError("Nomor WhatsApp minimal 10 digit");
      return;
    }
    setRegError("");
    setStep(1);
  };

  const handleDoctorSelect = (id: string) => {
    setSelectedDoctor(id);
    setStep(2);
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot);
    setStep(3);
  };

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
          name: regData.name,
          email: regData.email,
          phone: regData.phone,
          date: selectedDate,
          startTime: selectedSlot.startTime,
          endTime: selectedSlot.endTime,
          notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal membuat booking");
      clearProgress();
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleExit = () => { setShowExitConfirm(true); };
  const confirmExit = () => { clearProgress(); window.location.href = "/"; };
  const handleSave = () => {
    const p: BookingProgress = { step, regData, selectedDoctor, selectedDate, selectedSlot, notes };
    saveProgress(p);
    setShowSaveConfirm(true);
    setTimeout(() => setShowSaveConfirm(false), 2000);
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto text-center py-12 px-4">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Booking Berhasil!</h2>
        <p className="text-gray-600 mb-2">Nomor booking: <strong>BK-{Date.now().toString(36).toUpperCase()}</strong></p>
        <p className="text-gray-500 text-sm mb-6">Pengingat akan dikirim via WhatsApp H-1 dan 1 jam sebelum jadwal.</p>
        <button onClick={() => { setSuccess(false); setStep(0); setSelectedDoctor(""); setSelectedDate(""); setSelectedSlot(null); setNotes(""); }} className="px-6 py-2.5 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition font-medium">
          Booking Baru
        </button>
      </div>
    );
  }

  const selectedDoc = DUMMY_DOCTORS.find((d) => d.id === selectedDoctor);
  const steps = ["Registrasi", "Pilih Dokter", "Pilih Jadwal", "Konfirmasi"];

  return (
    <div className="max-w-2xl mx-auto relative">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
          {error}
        </div>
      )}

      {showSaveConfirm && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm z-50 animate-pulse">
          Progress tersimpan!
        </div>
      )}

      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 shadow-xl max-w-sm w-full mx-4">
            <h4 className="font-semibold text-gray-800 mb-2">Keluar dari Booking?</h4>
            <p className="text-sm text-gray-500 mb-4">Progress Anda akan dihapus kecuali sudah disimpan.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowExitConfirm(false)} className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">Batal</button>
              <button onClick={confirmExit} className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700">Keluar</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-1.5 flex-wrap">
          {steps.map((label, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition ${
                i <= step ? "bg-sky-500 text-white shadow" : "bg-gray-200 text-gray-500"
              }`}>
                {i < step ? "✓" : i + 1}
              </div>
              <span className={`text-xs hidden sm:inline ${i <= step ? "text-sky-600 font-medium" : "text-gray-400"}`}>{label}</span>
              {i < 3 && <div className={`w-4 sm:w-6 h-0.5 ${i < step ? "bg-sky-500" : "bg-gray-200"}`} />}
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={handleSave} className="px-3 py-1.5 text-xs border border-sky-300 text-sky-600 rounded-lg hover:bg-sky-50 transition font-medium">
            Simpan
          </button>
          <button type="button" onClick={handleExit} className="px-3 py-1.5 text-xs border border-red-300 text-red-500 rounded-lg hover:bg-red-50 transition font-medium">
            Keluar
          </button>
        </div>
      </div>

      <form onSubmit={step === 0 ? handleRegister : step === 3 ? handleSubmit : (e) => e.preventDefault()} className="space-y-6">
        {step === 0 && (
          <div className="bg-white rounded-xl border border-gray-100 p-5 sm:p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <span className="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center text-sky-600 text-sm">1</span>
              Registrasi Pasien
            </h3>
            <p className="text-sm text-gray-500">Daftar dulu sebelum booking. Data Anda aman.</p>
            {regError && <p className="text-red-500 text-sm">{regError}</p>}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap *</label>
                <input type="text" required value={regData.name} onChange={(e) => setRegData({ ...regData, name: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none" placeholder="Nama lengkap Anda" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={regData.email} onChange={(e) => setRegData({ ...regData, email: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none" placeholder="email@contoh.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">No. WhatsApp *</label>
                <input type="tel" required value={regData.phone} onChange={(e) => setRegData({ ...regData, phone: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none" placeholder="08123456789" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Lahir</label>
                <input type="date" value={regData.birthDate} onChange={(e) => setRegData({ ...regData, birthDate: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</label>
                <select value={regData.gender} onChange={(e) => setRegData({ ...regData, gender: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none">
                  <option value="">Pilih</option>
                  <option value="male">Laki-laki</option>
                  <option value="female">Perempuan</option>
                </select>
              </div>
            </div>
            <button type="submit" className="w-full py-2.5 bg-sky-500 text-white font-medium rounded-lg hover:bg-sky-600 transition">
              Lanjut Pilih Dokter →
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <button type="button" onClick={() => setStep(0)} className="text-sky-600 hover:text-sky-800 text-sm">&larr; Kembali ke Registrasi</button>
                <h3 className="text-lg font-semibold text-gray-800 mt-1">Pilih Dokter</h3>
              </div>
              <span className="text-xs text-gray-400">{DUMMY_DOCTORS.length} dokter tersedia</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {DUMMY_DOCTORS.map((doc) => (
                <button key={doc.id} type="button" onClick={() => handleDoctorSelect(doc.id)}
                  className={`text-left p-4 rounded-xl border-2 transition hover:shadow-md ${
                    selectedDoctor === doc.id ? "border-sky-500 bg-sky-50 shadow-md" : "border-gray-100 bg-white hover:border-sky-200"
                  }`}>
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{doc.photo}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 text-sm">{doc.name}</p>
                      <p className="text-xs text-sky-600 font-medium">{doc.specialization}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-yellow-500 text-xs">★ {doc.rating}</span>
                        <span className="text-gray-300 text-xs">|</span>
                        <span className="text-gray-400 text-xs">{doc.patients}+ pasien</span>
                      </div>
                      <p className="text-gray-400 text-xs mt-1">{doc.schedule}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <button type="button" onClick={() => setStep(1)} className="text-sky-600 hover:text-sky-800 text-sm">&larr; Ganti Dokter</button>
              <h3 className="text-lg font-semibold text-gray-800 mt-1">Pilih Jadwal</h3>
            </div>
            {selectedDoc && (
              <div className="bg-sky-50 rounded-lg p-3 flex items-center gap-3 text-sm">
                <span className="text-2xl">{selectedDoc.photo}</span>
                <div>
                  <p className="font-semibold text-gray-800">{selectedDoc.name}</p>
                  <p className="text-gray-500 text-xs">{selectedDoc.schedule}</p>
                </div>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Tanggal</label>
              <input type="date" value={selectedDate}
                min={new Date().toISOString().split("T")[0]}
                max={new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0]}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none" />
            </div>
            {selectedDate && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Slot Tersedia</label>
                {slotsLoading ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="h-11 bg-gray-100 animate-pulse rounded-lg" />
                    ))}
                  </div>
                ) : slots.length === 0 ? (
                  <p className="text-gray-500 text-sm">Tidak ada slot tersedia. Pilih tanggal lain.</p>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {slots.map((slot) => (
                      <button key={slot.startTime} type="button" onClick={() => handleSlotSelect(slot)}
                        className={`px-3 py-2.5 rounded-lg text-sm font-medium transition border ${
                          selectedSlot?.startTime === slot.startTime
                            ? "bg-sky-500 text-white border-sky-500 shadow"
                            : "bg-white text-gray-700 border-gray-200 hover:border-sky-300 hover:bg-sky-50"
                        }`}>{slot.startTime}</button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 bg-white rounded-xl border border-gray-100 p-5 sm:p-6">
            <div>
              <button type="button" onClick={() => setStep(2)} className="text-sky-600 hover:text-sky-800 text-sm">&larr; Ganti Jadwal</button>
              <h3 className="text-lg font-semibold text-gray-800 mt-1">Konfirmasi Booking</h3>
            </div>

            <div className="bg-sky-50 rounded-lg p-4 space-y-2 text-sm">
              <p><span className="font-medium text-gray-600">Pasien:</span> {regData.name}</p>
              <p><span className="font-medium text-gray-600">WhatsApp:</span> {regData.phone}</p>
              <p><span className="font-medium text-gray-600">Dokter:</span> {selectedDoc?.name}</p>
              <p><span className="font-medium text-gray-600">Tanggal:</span> {selectedDate && new Date(selectedDate + "T00:00:00").toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
              <p><span className="font-medium text-gray-600">Jam:</span> {selectedSlot?.startTime} - {selectedSlot?.endTime} WIB</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Catatan / Keluhan</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none" rows={3}
                placeholder="Jelaskan gejala atau keluhan Anda..." />
            </div>

            <button type="submit" disabled={submitting || !selectedSlot}
              className="w-full py-3 bg-sky-500 text-white font-medium rounded-lg hover:bg-sky-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition text-sm">
              {submitting ? "⏳ Memproses..." : "✅ Konfirmasi Booking"}
            </button>
            <p className="text-xs text-gray-400 text-center">Dengan konfirmasi, Anda setuju menerima pengingat WhatsApp</p>
          </div>
        )}
      </form>
    </div>
  );
}

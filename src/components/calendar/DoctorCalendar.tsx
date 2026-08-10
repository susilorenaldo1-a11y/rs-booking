"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useState, useMemo } from "react";
import { DUMMY_DOCTORS } from "@/lib/dummyData";

const PATIENT_NAMES = ["Budi Raharjo", "Siti Nurhaliza", "Ahmad Fauzi", "Dewi Sartika", "Rina Amelia", "Tono Hartono", "Mega Putri", "Rahmat Hidayat", "Lina Mariana", "Doni Prasetyo"];

function generateDummyAppointments() {
  const events: Array<{
    id: string;
    title: string;
    start: string;
    end: string;
    backgroundColor: string;
    borderColor: string;
    extendedProps: { patientName: string; doctorName: string; status: string };
  }> = [];

  const statusColors: Record<string, { bg: string; border: string }> = {
    confirmed: { bg: "#10B981", border: "#059669" },
    pending: { bg: "#F59E0B", border: "#D97706" },
    cancelled: { bg: "#EF4444", border: "#DC2626" },
  };

  const statuses = ["confirmed", "pending", "cancelled"];

  DUMMY_DOCTORS.forEach((doctor, di) => {
    const numAppts = 3 + Math.floor(Math.random() * 6);
    for (let i = 0; i < numAppts; i++) {
      const offset = Math.floor(Math.random() * 14) - 3;
      const d = new Date();
      d.setDate(d.getDate() + offset);
      if (d.getDay() === 0) d.setDate(d.getDate() + 1);

      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      const dateStr = `${yyyy}-${mm}-${dd}`;

      const hour = 8 + Math.floor(Math.random() * 8);
      const startTime = `${String(hour).padStart(2, "0")}:00`;
      const endTime = `${String(hour + 1).padStart(2, "0")}:00`;

      const patientIdx = (di * 3 + i) % PATIENT_NAMES.length;
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const colors = statusColors[status];

      events.push({
        id: `dummy-${doctor.id}-${i}`,
        title: `${PATIENT_NAMES[patientIdx]} - ${doctor.name}`,
        start: `${dateStr}T${startTime}:00`,
        end: `${dateStr}T${endTime}:00`,
        backgroundColor: colors.bg,
        borderColor: colors.border,
        extendedProps: {
          patientName: PATIENT_NAMES[patientIdx],
          doctorName: doctor.name,
          status,
        },
      });
    }
  });

  return events;
}

export default function DoctorCalendar() {
  const [selectedDoctor, setSelectedDoctor] = useState<string>("all");

  const allEvents = useMemo(() => generateDummyAppointments(), []);

  const events = useMemo(() => {
    if (selectedDoctor === "all") return allEvents;
    return allEvents.filter((e) => e.extendedProps.doctorName === DUMMY_DOCTORS.find((d) => d.id === selectedDoctor)?.name);
  }, [allEvents, selectedDoctor]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 flex-wrap">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-1">Filter Dokter</label>
          <select
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none text-sm text-gray-900"
          >
            <option value="all">Semua Dokter</option>
            {DUMMY_DOCTORS.map((d) => (
              <option key={d.id} value={d.id}>{d.name} - {d.specialization}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-900 font-medium">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block" /> Pending
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-green-500 inline-block" /> Confirmed
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-red-500 inline-block" /> Cancelled
          </span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-sky-100 p-4 text-gray-900">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          height="auto"
          slotMinTime="08:00:00"
          slotMaxTime="18:00:00"
          allDaySlot={false}
          events={events}
          locale="id"
          slotLabelFormat={{
            hour: "2-digit",
            minute: "2-digit",
          }}
          eventTimeFormat={{
            hour: "2-digit",
            minute: "2-digit",
          }}
        />
      </div>
    </div>
  );
}

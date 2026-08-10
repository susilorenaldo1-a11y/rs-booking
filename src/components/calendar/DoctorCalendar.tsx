"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useState, useEffect, useCallback } from "react";

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  backgroundColor?: string;
  borderColor?: string;
  extendedProps: {
    patientName: string;
    doctorName: string;
    status: string;
  };
}

export default function DoctorCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string>("all");
  const [doctors, setDoctors] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    fetch("/api/doctors")
      .then((r) => r.json())
      .then(setDoctors)
      .catch(console.error);
  }, []);

  const fetchEvents = useCallback(async () => {
    try {
      const url = selectedDoctor === "all"
        ? "/api/bookings"
        : `/api/bookings?doctorId=${selectedDoctor}`;
      const res = await fetch(url);
      const data = await res.json();
      const mapped: CalendarEvent[] = data.map((apt: any) => ({
        id: apt.id,
        title: `${apt.patient?.name || "Pasien"} - ${apt.doctor?.name || "Dokter"}`,
        start: `${apt.date.split("T")[0]}T${apt.startTime}:00`,
        end: `${apt.date.split("T")[0]}T${apt.endTime}:00`,
        backgroundColor: apt.status === "confirmed" ? "#10B981" : apt.status === "pending" ? "#F59E0B" : "#EF4444",
        borderColor: apt.status === "confirmed" ? "#059669" : apt.status === "pending" ? "#D97706" : "#DC2626",
        extendedProps: {
          patientName: apt.patient?.name || "-",
          doctorName: apt.doctor?.name || "-",
          status: apt.status,
        },
      }));
      setEvents(mapped);
    } catch (err) {
      console.error(err);
    }
  }, [selectedDoctor]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 flex-wrap">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Filter Dokter</label>
          <select
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm"
          >
            <option value="all">Semua Dokter</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-yellow-500" /> Pending
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-green-500" /> Confirmed
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-red-500" /> Cancelled
          </span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
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

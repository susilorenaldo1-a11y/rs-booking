import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const doctorId = searchParams.get("doctorId");

  const where = doctorId ? { doctorId } : {};
  const appointments = await prisma.appointment.findMany({
    where,
    include: { patient: true, doctor: true },
    orderBy: { date: "asc" },
  });
  return NextResponse.json(appointments);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { doctorId, name, email, phone, date, startTime, endTime, notes } = body;

    let patient = await prisma.user.findUnique({ where: { email } });
    if (!patient) {
      patient = await prisma.user.create({
        data: { name, email, phone, role: "patient" },
      });
    }

    const appointment = await prisma.appointment.create({
      data: {
        patientId: patient.id,
        doctorId,
        date: new Date(date + "T00:00:00.000Z"),
        startTime,
        endTime,
        notes: notes || null,
        status: "pending",
      },
      include: { patient: true, doctor: true },
    });

    const appointmentDate = new Date(date + "T00:00:00.000Z");

    const h1Date = new Date(appointmentDate);
    h1Date.setDate(h1Date.getDate() - 1);
    h1Date.setHours(8, 0, 0, 0);

    const hourBefore = new Date(appointmentDate);
    const [hours, minutes] = startTime.split(":").map(Number);
    hourBefore.setHours(hours, minutes, 0, 0);
    hourBefore.setHours(hourBefore.getHours() - 1);

    const now = new Date();

    if (h1Date > now) {
      await prisma.reminderLog.create({
        data: {
          appointmentId: appointment.id,
          type: "h1",
          recipientType: "patient",
          recipientPhone: patient.phone,
          status: "pending",
          scheduledAt: h1Date,
        },
      });
    }

    if (hourBefore > now) {
      await prisma.reminderLog.createMany({
        data: [
          {
            appointmentId: appointment.id,
            type: "1h",
            recipientType: "patient",
            recipientPhone: patient.phone,
            status: "pending",
            scheduledAt: hourBefore,
          },
          {
            appointmentId: appointment.id,
            type: "1h",
            recipientType: "doctor",
            recipientPhone: appointment.doctor.phone,
            status: "pending",
            scheduledAt: hourBefore,
          },
        ],
      });
    }

    return NextResponse.json(appointment, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

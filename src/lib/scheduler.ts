import { prisma } from "./prisma";
import { sendWhatsAppMessage, getConnectionStatus } from "./whatsapp";

export async function processReminders(): Promise<{ sent: number; failed: number }> {
  const now = new Date();
  let sent = 0;
  let failed = 0;

  const pendingLogs = await prisma.reminderLog.findMany({
    where: {
      status: "pending",
      scheduledAt: { lte: now },
    },
    include: {
      appointment: {
        include: { patient: true, doctor: true },
      },
    },
  });

  for (const log of pendingLogs) {
    try {
      let message = "";
      if (log.recipientType === "patient") {
        message = `Halo ${log.appointment.patient.name}, ini pengingat janji temu Anda.\n\nDokter: ${log.appointment.doctor.name} (${log.appointment.doctor.specialization})\nTanggal: ${new Date(log.appointment.date).toLocaleDateString("id-ID")}\nJam: ${log.appointment.startTime} - ${log.appointment.endTime}\n\n${log.type === "h1" ? "Janji temu Anda besok." : "Janji temu Anda 1 jam lagi."}\n\nTerima kasih.`;
      } else if (log.recipientType === "doctor") {
        message = `Halo Dr. ${log.appointment.doctor.name}, pengingat jadwal konsultasi.\n\nPasien: ${log.appointment.patient.name}\nTanggal: ${new Date(log.appointment.date).toLocaleDateString("id-ID")}\nJam: ${log.appointment.startTime} - ${log.appointment.endTime}\n\n${log.type === "h1" ? "Konsultasi besok." : "Konsultasi 1 jam lagi."}\n\nRumah Sakit Booking.`;
      }

      const success = await sendWhatsAppMessage(log.recipientPhone, message);
      if (success) {
        await prisma.reminderLog.update({
          where: { id: log.id },
          data: { status: "sent", sentAt: new Date() },
        });
        sent++;
      } else {
        await prisma.reminderLog.update({
          where: { id: log.id },
          data: { status: "failed" },
        });
        failed++;
      }
    } catch (error) {
      failed++;
      console.error("Reminder error:", error);
    }
  }

  return { sent, failed };
}

export function startScheduler(): void {
  if (typeof window !== "undefined") return;

  const cron = require("node-cron");
  cron.schedule("* * * * *", async () => {
    console.log("[Scheduler] Checking reminders...");
    const result = await processReminders();
    if (result.sent > 0 || result.failed > 0) {
      console.log(`[Scheduler] Sent: ${result.sent}, Failed: ${result.failed}`);
    }
  });
  console.log("[Scheduler] Reminder checker started (every minute)");
}

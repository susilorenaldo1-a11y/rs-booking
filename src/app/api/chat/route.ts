import { NextRequest, NextResponse } from "next/server";
import { searchKnowledgeBase, buildRAGContext } from "@/lib/rag";
import { prisma } from "@/lib/prisma";

const SYSTEM_PROMPT = `Anda adalah asisten AI untuk Rumah Sakit Booking. Tugas Anda:
1. Membantu pasien mencari informasi jadwal dokter
2. Membantu proses booking janji temu
3. Menjawab pertanyaan seputar layanan rumah sakit

Gunakan konteks knowledge base yang tersedia untuk menjawab. Jika booking, arahkan ke halaman /booking.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1]?.content || "";

    const [matches, doctors, appointments] = await Promise.all([
      searchKnowledgeBase(lastMessage),
      prisma.doctor.findMany(),
      prisma.appointment.findMany({
        where: { date: { gte: new Date() } },
        include: { doctor: true },
        take: 10,
      }),
    ]);

    const ragContext = buildRAGContext(matches);

    let doctorList = "";
    if (doctors.length > 0) {
      doctorList = "Daftar dokter tersedia:\n" +
        doctors.map((d) => `- ${d.name} (${d.specialization})`).join("\n");
    }

    let appointmentInfo = "";
    if (appointments.length > 0) {
      appointmentInfo = "\nAppointment mendatang:\n" +
        appointments.map((a) =>
          `- ${a.doctor.name}: ${new Date(a.date).toLocaleDateString("id-ID")} ${a.startTime}-${a.endTime} (${a.status})`
        ).join("\n");
    }

    const contextParts = [ragContext, doctorList, appointmentInfo].filter(Boolean).join("\n\n");
    const fullPrompt = `${SYSTEM_PROMPT}\n\nKonteks:\n${contextParts}\n\nPertanyaan pasien: ${lastMessage}`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY || "sk-placeholder"}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: fullPrompt },
        ],
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI error: ${response.statusText}`);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Maaf, saya tidak dapat memproses pertanyaan Anda saat ini.";

    return NextResponse.json({ role: "assistant", content: reply });
  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json({
      role: "assistant",
      content: "Maaf, terjadi kesalahan. Silakan coba lagi nanti.",
    });
  }
}

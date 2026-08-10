import { NextRequest, NextResponse } from "next/server";

const KNOWLEDGE_BASE: Record<string, string> = {
  "jadwal|dokter umum|dr andini|dr. andini": "Dokter Umum: Dr. Andini Lestari tersedia Senin-Jumat pukul 08:00-16:00. Rating 4.8 dengan 1.240+ pasien. Silakan booking di halaman /booking.",
  "dokter gigi|dr budi|dr. budi|gigi": "Dokter Gigi: Dr. Budi Santoso tersedia Senin-Jumat pukul 09:00-15:00. Rating 4.7 dengan 980+ pasien. Tersedia juga untuk tambal gigi, scaling, dan cabut gigi.",
  "dokter anak|dr citra|dr. citra|anak": "Dokter Anak: Dr. Citra Dewi tersedia Senin-Sabtu pukul 08:00-14:00. Rating 4.9 dengan 1.560+ pasien. Melayani imunisasi, tumbuh kembang, dan konsultasi anak.",
  "dokter penyakit dalam|dr darma|dr. darma|penyakit dalam": "Dokter Penyakit Dalam: Dr. Darma Wijaya tersedia Senin-Jumat pukul 10:00-16:00. Rating 4.6 dengan 820+ pasien. Spesialis diagnosa penyakit dewasa.",
  "dokter kulit|dr eka|dr. eka|kulit|kelamin": "Dokter Kulit & Kelamin: Dr. Eka Putri tersedia Selasa-Sabtu pukul 08:00-13:00. Rating 4.7 dengan 670+ pasien.",
  "dokter jantung|dr fajar|dr. fajar|jantung": "Dokter Jantung: Dr. Fajar Nugroho tersedia Senin-Kamis pukul 08:00-15:00. Rating 4.9 dengan 2.100+ pasien. Tersedia EKG dan treadmill test.",
  "dokter mata|dr gita|dr. gita|mata": "Dokter Mata: Dr. Gita Rahayu tersedia Senin-Jumat pukul 09:00-16:00. Rating 4.8 dengan 1.450+ pasien. Pemeriksaan refraksi dan konsultasi mata.",
  "dokter saraf|dr hadi|dr. hadi|saraf": "Dokter Saraf: Dr. Hadi Pratama tersedia Senin, Rabu, Jumat pukul 08:00-14:00. Rating 4.5 dengan 560+ pasien.",

  "booking|cara booking|cara daftar|buat janji": "Cara booking: 1) Registrasi di halaman /booking, 2) Pilih dokter, 3) Pilih tanggal & jam, 4) Konfirmasi. Sangat mudah, hanya 4 langkah!",
  "jam operasional|jam buka|buka jam|jam kerja|jam praktek": "Jam operasional RS: Senin-Jumat 08:00-16:00 WIB, Sabtu 08:00-14:00 WIB. Minggu & hari libur nasional TUTUP.",
  "pembatalan|batal|cancel|reschedule": "Untuk membatalkan atau reschedule janji temu, hubungi call center 1500-123 atau kirim email ke admin@rsbooking.com.",
  "biaya|harga|tarif|konsultasi|berapa": "Biaya konsultasi: Dokter Umum mulai Rp 150.000, Dokter Spesialis mulai Rp 250.000, Dokter Jantung mulai Rp 350.000. Pembayaran bisa di tempat atau via transfer.",
  "pengingat|reminder|notifikasi|wa|whatsapp": "Sistem kami otomatis mengirim pengingat via WhatsApp H-1 hari dan 1 jam sebelum janji temu. Pastikan nomor WhatsApp Anda aktif.",
  "dokter tersedia|daftar dokter|dokter apa saja": "Kami memiliki 8 dokter: Umum, Gigi, Anak, Penyakit Dalam, Kulit, Jantung, Mata, dan Saraf. Semua dokter berpengalaman & bersertifikasi.",
  "lokasi|alamat|dimana|maps": "RS Booking berlokasi di Jl. Kesehatan No. 123, Jakarta Pusat. Dekat Stasiun Gambir. Parkir luas tersedia gratis.",
  "bpjs|asuransi|jaminan": "Kami menerima BPJS Kesehatan (non darurat) dan berbagai asuransi swasta: Allianz, Prudential, AXA Mandiri, Sinarmas. Bawa kartu asuransi saat kunjungan.",
  "halo|hai|hello|hi": "Halo! Saya AI Asisten RS Booking. Saya bisa bantu: cek jadwal dokter, cara booking, jam operasional, biaya konsultasi, dan info lainnya. Apa yang ingin Anda tanyakan?",
  "terima kasih|makasih|thanks|thx": "Sama-sama! Senang bisa membantu. Jika ada pertanyaan lain, silakan tanya lagi. Jangan lupa booking dokter Anda di /booking ya! 😊",
  "gawat darurat|emergency|darurat|igd|ugd": "Untuk kondisi DARURAT, segera hubungi 119 atau kunjungi IGD RS terdekat. Layanan IGD kami buka 24 jam. Jangan booking online untuk kondisi darurat!",
  "obat|resep|farmasi|apotek": "Kami memiliki apotek 24 jam di lantai dasar. Resep dokter bisa langsung ditebus. Tersedia juga layanan antar obat untuk area Jabodetabek.",
  "lab|laboratorium|tes darah|rontgen|usg": "Layanan penunjang tersedia: Laboratorium 24 jam, Rontgen, USG 4D, CT Scan, dan MRI. Hasil lab bisa diakses online melalui portal pasien.",

  "selamat pagi|pagi": "Selamat pagi! Semoga hari Anda menyenangkan. Ada yang bisa saya bantu terkait booking dokter atau info RS?",
  "selamat siang|siang": "Selamat siang! Ada yang bisa saya bantu? Silakan tanya seputar jadwal dokter, booking, atau layanan RS kami.",
  "selamat malam|malam": "Selamat malam! Meskipun malam, saya tetap siap membantu. Untuk darurat, IGD kami buka 24 jam. Ada yang bisa dibantu?",
};

function findAnswer(question: string): string {
  const q = question.toLowerCase().trim();
  const entries = Object.entries(KNOWLEDGE_BASE);

  let bestMatch = { answer: "", score: 0 };

  for (const [keywords, answer] of entries) {
    const keywordList = keywords.split("|");
    let matchCount = 0;
    for (const kw of keywordList) {
      if (q.includes(kw.toLowerCase())) matchCount++;
    }
    if (matchCount > 0) {
      const score = matchCount / keywordList.length;
      if (score > bestMatch.score) {
        bestMatch = { answer, score };
      }
    }
  }

  if (bestMatch.score > 0) return bestMatch.answer;

  if (q.includes("dokter") || q.includes("dr")) {
    return "Kami memiliki 8 spesialis dokter. Sebutkan spesialisasi yang Anda cari (contoh: dokter gigi, dokter anak, dokter jantung) dan saya akan berikan informasinya.";
  }

  if (q.includes("booking") || q.includes("janji") || q.includes("jadwal")) {
    return "Untuk booking, kunjungi halaman /booking. Anda tinggal registrasi, pilih dokter, pilih tanggal & jam, lalu konfirmasi. Mudah dan cepat!";
  }

  return "Maaf, saya belum memiliki informasi tentang itu. Coba tanyakan: jadwal dokter tertentu, cara booking, jam operasional, biaya konsultasi, BPJS/asuransi, atau lokasi RS. Atau kunjungi halaman /booking untuk langsung booking dokter.";
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    const lastMessage: string = messages?.[messages.length - 1]?.content || "";

    const localAnswer = findAnswer(lastMessage);
    const needsAI = lastMessage.length > 5 && (lastMessage.includes("?") || lastMessage.length > 30);

    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey && apiKey !== "sk-your-openai-api-key" && apiKey !== "sk-placeholder" && needsAI) {
      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              { role: "system", content: "Anda asisten AI RS Booking. Bantu pasien dengan info dokter, jadwal, dan booking. Jawab dalam Bahasa Indonesia yang ramah." },
              { role: "user", content: `Konteks pengetahuan lokal: ${localAnswer}\n\nPertanyaan pasien: ${lastMessage}` },
            ],
            max_tokens: 400,
            temperature: 0.7,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const reply = data.choices?.[0]?.message?.content || localAnswer;
          return NextResponse.json({ role: "assistant", content: reply });
        }
      } catch {
        // fallback to local
      }
    }

    await new Promise((r) => setTimeout(r, 500 + Math.random() * 1000));
    return NextResponse.json({ role: "assistant", content: localAnswer });
  } catch {
    return NextResponse.json({
      role: "assistant",
      content: "Maaf, terjadi kesalahan sistem. Silakan coba lagi nanti.",
    });
  }
}

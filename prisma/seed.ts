import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const doctors = await Promise.all([
    prisma.doctor.upsert({
      where: { email: "dr.andini@rs.com" },
      update: {},
      create: {
        name: "Dr. Andini Lestari",
        specialization: "Dokter Umum",
        email: "dr.andini@rs.com",
        phone: "62812345678",
      },
    }),
    prisma.doctor.upsert({
      where: { email: "dr.budi@rs.com" },
      update: {},
      create: {
        name: "Dr. Budi Santoso",
        specialization: "Dokter Gigi",
        email: "dr.budi@rs.com",
        phone: "62812345679",
      },
    }),
    prisma.doctor.upsert({
      where: { email: "dr.citra@rs.com" },
      update: {},
      create: {
        name: "Dr. Citra Dewi",
        specialization: "Dokter Anak",
        email: "dr.citra@rs.com",
        phone: "62812345680",
      },
    }),
    prisma.doctor.upsert({
      where: { email: "dr.darma@rs.com" },
      update: {},
      create: {
        name: "Dr. Darma Wijaya",
        specialization: "Dokter Penyakit Dalam",
        email: "dr.darma@rs.com",
        phone: "62812345681",
      },
    }),
    prisma.doctor.upsert({
      where: { email: "dr.eka@rs.com" },
      update: {},
      create: {
        name: "Dr. Eka Putri",
        specialization: "Dokter Kulit & Kelamin",
        email: "dr.eka@rs.com",
        phone: "62812345682",
      },
    }),
  ]);

  console.log(`Seeded ${doctors.length} doctors`);

  const knowledgeEntries = [
    {
      topic: "jadwal",
      question: "Apa jadwal dokter umum?",
      answer: "Dokter Umum tersedia Senin-Jumat pukul 08:00-16:00. Dr. Andini Lestari adalah dokter umum kami. Silakan booking di halaman /booking.",
    },
    {
      topic: "booking",
      question: "Bagaimana cara booking dokter?",
      answer: "Anda dapat booking dokter melalui halaman /booking. Pilih dokter, tanggal, dan slot jam yang tersedia, lalu isi data diri Anda.",
    },
    {
      topic: "waktu",
      question: "Jam operasional rumah sakit?",
      answer: "Rumah sakit beroperasi Senin-Jumat pukul 08:00-16:00 WIB. Sabtu pukul 08:00-12:00 WIB. Minggu dan hari libur nasional tutup.",
    },
    {
      topic: "pembatalan",
      question: "Bagaimana cara membatalkan janji temu?",
      answer: "Untuk membatalkan janji temu, hubungi call center kami di nomor 1500-123 atau gunakan halaman booking untuk melihat status appointment Anda.",
    },
    {
      topic: "dokter",
      question: "Dokter apa saja yang tersedia?",
      answer: "Kami memiliki Dokter Umum (Dr. Andini), Dokter Gigi (Dr. Budi), Dokter Anak (Dr. Citra), Dokter Penyakit Dalam (Dr. Darma), dan Dokter Kulit (Dr. Eka).",
    },
    {
      topic: "dokter",
      question: "Apakah ada dokter gigi?",
      answer: "Ya, kami memiliki Dr. Budi Santoso sebagai dokter gigi. Beliau tersedia Senin-Jumat pukul 08:00-16:00. Silakan booking di halaman /booking.",
    },
    {
      topic: "biaya",
      question: "Berapa biaya konsultasi?",
      answer: "Biaya konsultasi bervariasi tergantung dokter dan spesialisasi. Dokter umum mulai dari Rp 150.000, dokter spesialis mulai dari Rp 250.000. Hubungi admin untuk informasi lebih lanjut.",
    },
    {
      topic: "pengingat",
      question: "Apakah ada pengingat jadwal?",
      answer: "Ya, sistem kami mengirim pengingat otomatis via WhatsApp H-1 hari dan 1 jam sebelum jadwal janji temu Anda. Pastikan nomor WhatsApp Anda benar saat booking.",
    },
  ];

  for (const entry of knowledgeEntries) {
    await prisma.knowledgeEntry.upsert({
      where: { id: entry.question.replace(/\s+/g, "-").substring(0, 25) },
      update: entry,
      create: { id: entry.question.replace(/\s+/g, "-").substring(0, 25), ...entry },
    });
  }

  console.log(`Seeded ${knowledgeEntries.length} knowledge entries`);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });

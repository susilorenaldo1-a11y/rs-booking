export interface DummyDoctor {
  id: string;
  name: string;
  specialization: string;
  rating: number;
  patients: number;
  schedule: string;
  photo: string;
}

export const DUMMY_DOCTORS: DummyDoctor[] = [
  { id: "1", name: "Dr. Andini Lestari", specialization: "Dokter Umum", rating: 4.8, patients: 1240, schedule: "Sen-Jum 08:00-16:00", photo: "👩‍⚕️" },
  { id: "2", name: "Dr. Budi Santoso", specialization: "Dokter Gigi", rating: 4.7, patients: 980, schedule: "Sen-Jum 09:00-15:00", photo: "👨‍⚕️" },
  { id: "3", name: "Dr. Citra Dewi", specialization: "Dokter Anak", rating: 4.9, patients: 1560, schedule: "Sen-Sab 08:00-14:00", photo: "👩‍⚕️" },
  { id: "4", name: "Dr. Darma Wijaya", specialization: "Dokter Penyakit Dalam", rating: 4.6, patients: 820, schedule: "Sen-Jum 10:00-16:00", photo: "👨‍⚕️" },
  { id: "5", name: "Dr. Eka Putri", specialization: "Dokter Kulit & Kelamin", rating: 4.7, patients: 670, schedule: "Sel-Sab 08:00-13:00", photo: "👩‍⚕️" },
  { id: "6", name: "Dr. Fajar Nugroho", specialization: "Dokter Jantung", rating: 4.9, patients: 2100, schedule: "Sen-Kam 08:00-15:00", photo: "👨‍⚕️" },
  { id: "7", name: "Dr. Gita Rahayu", specialization: "Dokter Mata", rating: 4.8, patients: 1450, schedule: "Sen-Jum 09:00-16:00", photo: "👩‍⚕️" },
  { id: "8", name: "Dr. Hadi Pratama", specialization: "Dokter Saraf", rating: 4.5, patients: 560, schedule: "Sen, Rab, Jum 08:00-14:00", photo: "👨‍⚕️" },
];

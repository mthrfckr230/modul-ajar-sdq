import { DimensiP3, FaseKurikulum, JenjangPendidikan } from '../types';

export interface MataPelajaranOption {
  id: string;
  nama: string;
  jenjang: JenjangPendidikan[];
  elemenContoh: string[];
}

export const LIST_JENJANG: { id: JenjangPendidikan; label: string; faseDefault: FaseKurikulum[] }[] = [
  { id: 'SD/MI', label: 'SD / Madrasah Ibtidaiyah (MI)', faseDefault: ['Fase A (Kelas 1-2)', 'Fase B (Kelas 3-4)', 'Fase C (Kelas 5-6)'] },
  { id: 'SMP/MTs', label: 'SMP / Madrasah Tsanawiyah (MTs)', faseDefault: ['Fase D (Kelas 7-9)'] },
  { id: 'SMA/MA', label: 'SMA / Madrasah Aliyah (MA)', faseDefault: ['Fase E (Kelas 10)', 'Fase F (Kelas 11-12)'] },
  { id: 'SMK', label: 'SMK (Kejuruan)', faseDefault: ['Fase E (Kelas 10)', 'Fase F (Kelas 11-12)'] },
  { id: 'PAUD/TK', label: 'PAUD / TK', faseDefault: ['Fase Fondasi'] },
];

export const LIST_FASE: { id: FaseKurikulum; label: string; kelasOptions: string[] }[] = [
  { id: 'Fase Fondasi', label: 'Fase Fondasi (PAUD / TK A-B)', kelasOptions: ['TK A', 'TK B', 'Kelompok Bermain'] },
  { id: 'Fase A (Kelas 1-2)', label: 'Fase A (Kelas 1 - 2 SD)', kelasOptions: ['Kelas 1', 'Kelas 2'] },
  { id: 'Fase B (Kelas 3-4)', label: 'Fase B (Kelas 3 - 4 SD)', kelasOptions: ['Kelas 3', 'Kelas 4'] },
  { id: 'Fase C (Kelas 5-6)', label: 'Fase C (Kelas 5 - 6 SD)', kelasOptions: ['Kelas 5', 'Kelas 6'] },
  { id: 'Fase D (Kelas 7-9)', label: 'Fase D (Kelas 7 - 9 SMP)', kelasOptions: ['Kelas 7', 'Kelas 8', 'Kelas 9'] },
  { id: 'Fase E (Kelas 10)', label: 'Fase E (Kelas 10 SMA/SMK)', kelasOptions: ['Kelas 10'] },
  { id: 'Fase F (Kelas 11-12)', label: 'Fase F (Kelas 11 - 12 SMA/SMK)', kelasOptions: ['Kelas 11', 'Kelas 12'] },
];

export const LIST_DIMENSI_P3: { dimensi: DimensiP3; icon: string; elemen: string[] }[] = [
  {
    dimensi: 'Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia',
    icon: 'HeartHandshake',
    elemen: ['Akhlak Beragama', 'Akhlak Pribadi', 'Akhlak kepada Manusia', 'Akhlak kepada Alam', 'Akhlak Bernegara']
  },
  {
    dimensi: 'Berkebinekaan Global',
    icon: 'Globe',
    elemen: ['Mengenal dan menghargai budaya', 'Komunikasi & interaksi antar budaya', 'Refleksi & tanggung jawab kebinekaan', 'Berkeadilan Sosial']
  },
  {
    dimensi: 'Gotong Royong',
    icon: 'Users',
    elemen: ['Kolaborasi', 'Kepedulian sesama', 'Berbagi']
  },
  {
    dimensi: 'Mandiri',
    icon: 'UserCheck',
    elemen: ['Pemahaman diri dan situasi', 'Regulasi diri & disiplin']
  },
  {
    dimensi: 'Bernalar Kritis',
    icon: 'BrainCircuit',
    elemen: ['Memperoleh & memproses informasi', 'Menganalisis & mengevaluasi penalaran', 'Refleksi pemikiran & proses berpikir']
  },
  {
    dimensi: 'Kreatif',
    icon: 'Sparkles',
    elemen: ['Menghasilkan gagasan orisinal', 'Menghasilkan karya & tindakan orisinal', 'Memiliki keluwesan berpikir dalam mencari alternatif solusi']
  }
];

export const LIST_MAPEL: MataPelajaranOption[] = [
  {
    id: 'ipas',
    nama: 'IPAS (Ilmu Pengetahuan Alam dan Sosial)',
    jenjang: ['SD/MI'],
    elemenContoh: ['Pemahaman IPAS (Sains & Sosial)', 'Keterampilan Proses (Mengamati, Menyelidiki, Menyimpulkan)']
  },
  {
    id: 'matematika',
    nama: 'Matematika',
    jenjang: ['SD/MI', 'SMP/MTs', 'SMA/MA', 'SMK'],
    elemenContoh: ['Bilangan', 'Aljabar', 'Pengukuran', 'Geometri', 'Analisis Data dan Peluang']
  },
  {
    id: 'bahasa_indonesia',
    nama: 'Bahasa Indonesia',
    jenjang: ['SD/MI', 'SMP/MTs', 'SMA/MA', 'SMK'],
    elemenContoh: ['Menyimak', 'Membaca dan Memirsa', 'Berbicara dan Mempresentasikan', 'Menulis']
  },
  {
    id: 'bahasa_inggris',
    nama: 'Bahasa Inggris',
    jenjang: ['SD/MI', 'SMP/MTs', 'SMA/MA', 'SMK'],
    elemenContoh: ['Menyimak-Berbicara (Listening-Speaking)', 'Membaca-Memirsa (Reading-Viewing)', 'Menulis-Mempresentasikan (Writing-Presenting)']
  },
  {
    id: 'ipa',
    nama: 'IPA (Ilmu Pengetahuan Alam)',
    jenjang: ['SMP/MTs'],
    elemenContoh: ['Pemahaman IPA (Biologi, Fisika, Kimia)', 'Keterampilan Proses Sains']
  },
  {
    id: 'ips',
    nama: 'IPS (Ilmu Pengetahuan Sosial)',
    jenjang: ['SMP/MTs'],
    elemenContoh: ['Pemahaman Konsep IPS (Sejarah, Geografi, Ekonomi, Sosiologi)', 'Keterampilan Proses Inkuiri Sosial']
  },
  {
    id: 'biologi',
    nama: 'Biologi',
    jenjang: ['SMA/MA'],
    elemenContoh: ['Pemahaman Biologi (Sel, Ekosistem, Genetika, Evolusi)', 'Keterampilan Proses Ilmiah']
  },
  {
    id: 'fisika',
    nama: 'Fisika',
    jenjang: ['SMA/MA'],
    elemenContoh: ['Pemahaman Fisika (Mekanika, Termodinamika, Gelombang, Listrik-Magnet)', 'Keterampilan Proses Fisika']
  },
  {
    id: 'kimia',
    nama: 'Kimia',
    jenjang: ['SMA/MA'],
    elemenContoh: ['Pemahaman Kimia (Struktur Atom, Ikatan, Stoikiometri, Reaksi)', 'Keterampilan Penyelidikan Kimia']
  },
  {
    id: 'informatika',
    nama: 'Informatika',
    jenjang: ['SMP/MTs', 'SMA/MA', 'SMK'],
    elemenContoh: ['Berpikir Komputasional (BK)', 'Teknologi Informasi & Komunikasi (TIK)', 'Sistem Komputer (SK)', 'Analisis Data (AD)', 'Algoritma & Pemrograman (AP)', 'Dampak Sosial Informatika (DSI)']
  },
  {
    id: 'ppkn',
    nama: 'Pendidikan Pancasila',
    jenjang: ['SD/MI', 'SMP/MTs', 'SMA/MA', 'SMK'],
    elemenContoh: ['Pancasila', 'Undang-Undang Dasar Negara Republik Indonesia 1945', 'Bhinneka Tunggal Ika', 'Negara Kesatuan Republik Indonesia']
  },
  {
    id: 'pai',
    nama: 'Pendidikan Agama Islam dan Budi Pekerti',
    jenjang: ['SD/MI', 'SMP/MTs', 'SMA/MA', 'SMK'],
    elemenContoh: ['Al-Qur’an dan Hadis', 'Akidah', 'Akhlak', 'Fikih', 'Sejarah Peradaban Islam']
  },
  {
    id: 'pjok',
    nama: 'PJOK (Pendidikan Jasmani, Olahraga, dan Kesehatan)',
    jenjang: ['SD/MI', 'SMP/MTs', 'SMA/MA', 'SMK'],
    elemenContoh: ['Keterampilan Gerak', 'Pengetahuan Gerak', 'Pemanfaatan Gerak', 'Pengembangan Karakter & Internalisasi Nilai Gerak']
  },
  {
    id: 'seni_budaya',
    nama: 'Seni Rupa / Seni Musik / Seni Tari / Seni Teater',
    jenjang: ['SD/MI', 'SMP/MTs', 'SMA/MA', 'SMK'],
    elemenContoh: ['Mengalami (Experiencing)', 'Menciptakan (Making/Creating)', 'Merefleksikan (Reflecting)', 'Berdampak (Impacting)']
  }
];

export const LIST_MODEL_PEMBELAJARAN = [
  'Problem Based Learning (PBL)',
  'Project Based Learning (PjBL)',
  'Discovery Learning',
  'Inquiry Learning',
  'Diferensiasi Terpadu',
  'Kooperatif / Jigsaw'
] as const;

export const CONTOH_TEMPLATE_KURIKULUM_MERDEKA = `
FORMAT MODUL AJAR KURIKULUM MERDEKA (STANDAR BSKAP KEMENDIKBUDRISTEK):
1. INFORMASI UMUM
   - Identitas Modul (Nama Guru, Satuan Pendidikan, Tahun, Jenjang, Fase, Kelas, Mapel, Alokasi Waktu)
   - Kompetensi Awal (Prasyarat peserta didik)
   - Profil Pelajar Pancasila (Dimensi dan elemen yang dikembangkan)
   - Sarana dan Prasarana (Media, alat, sumber belajar digital/fisik)
   - Target Peserta Didik (Reguler, Kesulitan Belajar, Pencapaian Tinggi / Berdiferensiasi)
   - Model Pembelajaran (PBL/PjBL/Inquiry dengan sintaks jelas)

2. KOMPONEN INTI
   - Capaian Pembelajaran (CP) dan Tujuan Pembelajaran (TP)
   - Kriteria Ketercapaian Tujuan Pembelajaran (KKTP) berbasis Rubrik / Interval Nilai
   - Pemahaman Bermakna (Manfaat materi dalam kehidupan nyata)
   - Pertanyaan Pemantik (Pertanyaan esensial untuk memicu rasa ingin tahu)
   - Diferensiasi Pembelajaran (Diferensiasi Konten, Proses, dan Produk)
   - Kegiatan Pembelajaran (Pendahuluan, Inti sesuai sintaks model, Penutup)
   - Asesmen (Diagnostik/Awal, Formatif, Sumatif)
   - Kegiatan Pengayaan dan Remedial
   - Refleksi Guru dan Peserta Didik

3. LAMPIRAN
   - Lembar Kerja Peserta Didik (LKPD) yang aplikatif
   - Bahan Bacaan Guru dan Peserta Didik
   - Glosarium (Daftar istilah penting)
   - Daftar Pustaka
`.trim();

export type JenjangPendidikan = 'PAUD/TK' | 'SD/MI' | 'SMP/MTs' | 'SMA/MA' | 'SMK';

export type FaseKurikulum = 'Fase Fondasi' | 'Fase A (Kelas 1-2)' | 'Fase B (Kelas 3-4)' | 'Fase C (Kelas 5-6)' | 'Fase D (Kelas 7-9)' | 'Fase E (Kelas 10)' | 'Fase F (Kelas 11-12)';

export type DimensiP3 = 
  | 'Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia'
  | 'Berkebinekaan Global'
  | 'Gotong Royong'
  | 'Mandiri'
  | 'Bernalar Kritis'
  | 'Kreatif';

export interface KopSekolah {
  namaYayasan: string;
  aktaNotaris?: string;
  skKemenkumham?: string;
  jenjangSekolah: string;
  namaSekolah: string;
  alamatSekolah: string;
  logoUrl?: string;
}

export interface IdentitasModul {
  namaPenyusun: string;
  namaSekolah: string;
  tahunAjaran: string;
  jenjang: JenjangPendidikan;
  fase: FaseKurikulum;
  kelas: string;
  namaKelasSpesifik?: string; // e.g. "3 Zaid bin Tsabit", "3 Ubay bin Ka'ab"
  mataPelajaran: string;
  elemen: string;
  alokasiWaktu: string;
  jumlahPertemuan: number;
  hariTanggal?: string; // e.g. "Rabu, 19 Agustus 2026"
  modelPembelajaranTeks?: string; // e.g. "Praktik / Learning by Doing"
  saranaPrasaranaTeks?: string; // e.g. "komputer, aplikasi paint."
  targetMuridTeks?: string;
  softSkillsTeks?: string; // e.g. "tanggung jawab, mandiri, jujur, teliti, percaya diri."
  namaWakasekKurikulum?: string; // e.g. "Riana Rizki Abidin, S. S"
  namaGuruBidangStudi?: string; // e.g. "Laila Nabilatu Rohmah, S.Pd"
}

export interface KomponenAwal {
  kompetensiAwal: string[];
  profilPelajarPancasila: DimensiP3[];
  saranaPrasarana: string[];
  targetPesertaDidik: 'Reguler/Tipikal' | 'Pencapaian Tinggi' | 'Kesulitan Belajar' | 'Inklusi (Berdiferensiasi)';
  modelPembelajaran: 'Problem Based Learning (PBL)' | 'Project Based Learning (PjBL)' | 'Discovery Learning' | 'Inquiry Learning' | 'Diferensiasi Terpadu' | 'Kooperatif / Jigsaw' | 'Praktik / Learning by Doing';
  metodePembelajaran: string[];
}

export interface SiswaAsesmenRow {
  no: number;
  nama: string;
  indikatorNilai: { [indikatorIndex: number]: boolean | number | string };
  catatan?: string;
}

export interface LembarAsesmenFormat {
  mataPelajaran: string;
  kelas: string;
  hariTanggal: string;
  indikator: string[]; // 3 indikator terukur
  daftarSiswa: SiswaAsesmenRow[];
}

export interface KomponenInti {
  capaianPembelajaran: string;
  tujuanPembelajaran: string[];
  kriteriaKetercapaianTP: string[]; // KKTP / Indikator Penilaian
  pemahamanBermakna: string[];
  pertanyaanPemantik: string[];
  diferensiasi: {
    konten: string;
    proses: string;
    produk: string;
  };
  kegiatanPembelajaran: PertemuanPembelajaran[];
  asesmen: {
    diagnostik: string;
    formatif: string;
    sumatif: string;
    rubrikKKTP: RubrikPenilaianItem[];
  };
  pengayaanDanRemedial: {
    pengayaan: string;
    remedial: string;
  };
  refleksi: {
    refleksiGuru: string[];
    refleksiPesertaDidik: string[];
  };
}

export interface PertemuanPembelajaran {
  pertemuanKe: number;
  fokusMateri: string;
  alokasiMenit: number;
  pendahuluan: {
    durasiMenit: number;
    kegiatan: string[];
  };
  inti: {
    durasiMenit: number;
    sintaks: string; // e.g. Orientasi masalah, Praktik/Demo, dll
    kegiatan: string[];
    diferensiasiAktivitas?: string;
  };
  penutup: {
    durasiMenit: number;
    kegiatan: string[];
  };
}

export interface RubrikPenilaianItem {
  aspek: string;
  perluBimbingan: string; // 0 - 60
  cukup: string;         // 61 - 70
  baik: string;          // 71 - 85
  sangatBaik: string;    // 86 - 100
}

export interface LembarKerjaPesertaDidik {
  judulLKPD: string;
  petunjukPengerjaan: string[];
  aktivitas: {
    langkah: string;
    instruksi: string;
  }[];
  tugasKelompokOrIndividu: string;
}

export interface LampiranModul {
  lkpd: LembarKerjaPesertaDidik;
  bahanBacaanGuruDanSiswa: string;
  glosarium: { istilah: string; arti: string }[];
  daftarPustaka: string[];
}

export interface ModulAjar {
  id: string;
  createdAt: string;
  updatedAt: string;
  judul: string;
  kopSekolah?: KopSekolah;
  identitas: IdentitasModul;
  komponenAwal: KomponenAwal;
  komponenInti: KomponenInti;
  lembarAsesmenMurid?: LembarAsesmenFormat;
  lampiran: LampiranModul;
  googleDriveFileId?: string;
  googleDocsId?: string;
  googleDocsUrl?: string;
}

// Bank Soal
export type TipeSoal = 'Pilihan Ganda' | 'Pilihan Ganda Kompleks' | 'Menjodohkan' | 'Isian Singkat' | 'Uraian (HOTS)';
export type TingkatKesulitan = 'Dasar (LOTS)' | 'Sedang (MOTS)' | 'Tinggi (HOTS)';
export type TargetKemampuanSiswa = 'Remedial' | 'Reguler' | 'Pengayaan';

export interface SoalItem {
  id: string;
  tipe: TipeSoal;
  tingkat: TingkatKesulitan;
  target: TargetKemampuanSiswa;
  tujuanPembelajaran: string;
  stimulus?: string;
  pertanyaan: string;
  pilihanJawaban?: string[];
  kunciJawaban: string | string[];
  pembahasan: string;
  bobotSkor: number;
}

export interface BankSoalPaket {
  id: string;
  judulPaket: string;
  mataPelajaran: string;
  fase: FaseKurikulum;
  kelas: string;
  topik: string;
  daftarSoal: SoalItem[];
  createdAt: string;
}

// Penilaian Siswa & Analitik
export type StatusCapaianKKTP = 'Belum Mencapai KKTP' | 'Tercapai Bersyarat' | 'Tercapai (Optimal)' | 'Tercapai Sangat Baik' | 'Perlu Remedial' | 'Tuntas' | 'Siap Pengayaan';
export type SiswaData = Siswa;
export type TingkatKesulitanSoal = TingkatKesulitan;

export interface Siswa {
  id: string;
  nisn: string;
  nama: string;
  gender: 'L' | 'P';
  gayaBelajar: 'Visual' | 'Auditori' | 'Kinestetik';
  kategoriAwal?: 'Perlu Bimbingan' | 'Cukup' | 'Mahir';
}

export interface NilaiCapaianTP {
  tujuanPembelajaranId: string;
  tujuanPembelajaranTeks?: string;
  nilaiFormatif: number; // 0-100
  nilaiSumatif: number;  // 0-100
  statusKKTP?: 'Belum Tercapai' | 'Tercapai Bersyarat' | 'Tercapai' | 'Tercapai (Optimal)' | 'Sangat Baik' | 'Baik';
  catatanGuru?: string;
}

export interface RekapNilaiSiswa {
  siswaId: string;
  namaSiswa: string;
  gender: 'L' | 'P';
  nilaiPerTP: NilaiCapaianTP[];
  nilaiRataRata: number;
  statusAkhir: StatusCapaianKKTP;
  catatanDeskripsiRapor: string;
}

export type NilaiSiswaRow = RekapNilaiSiswa;

export interface AssessmentProject {
  id: string;
  judul: string;
  mataPelajaran: string;
  kelas: string;
  semester: 'Ganjil' | 'Genap';
  tahunAjaran: string;
  kkmKktp: number;
  daftarTP: { id: string; kode: string; deskripsi: string }[];
  daftarSiswa: Siswa[];
  rekapNilai: RekapNilaiSiswa[];
  googleSpreadsheetId?: string;
  googleSpreadsheetUrl?: string;
  lastSyncedAt?: string;
}

export interface GoogleDriveFolder {
  id: string;
  name: string;
  webViewLink?: string;
}

export interface GoogleDriveFileInfo {
  id: string;
  name: string;
  mimeType: string;
  webViewLink: string;
  createdTime?: string;
  modifiedTime?: string;
  size?: string;
}

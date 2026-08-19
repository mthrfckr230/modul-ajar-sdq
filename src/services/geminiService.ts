import { AssessmentProject, BankSoalPaket, ModulAjar } from '../types';

export interface GenerateModulParams {
  namaYayasan?: string;
  namaSekolah?: string;
  namaPenyusun?: string;
  namaWakasekKurikulum?: string;
  tahunAjaran?: string;
  jenjang: string;
  fase: string;
  kelas: string;
  namaKelasSpesifik?: string;
  hariTanggal?: string;
  mataPelajaran: string;
  elemen: string;
  topik: string;
  tujuanPembelajaranBuku?: string[] | string;
  alokasiWaktu?: string;
  jumlahPertemuan?: number;
  profilPelajarPancasila: string[];
  modelPembelajaran?: string;
  saranaPrasaranaInput?: string;
  softSkills?: string;
  targetPesertaDidik?: string;
  kebutuhanKhusus?: string;
  customPromptTambahan?: string;
}

export interface GenerateQuizParams {
  mataPelajaran: string;
  fase: string;
  kelas: string;
  topik: string;
  tujuanPembelajaran?: string;
  jumlahSoal?: number;
  tipeSoalList?: string[];
  fokusTingkatKesulitan?: string;
}

export async function apiGenerateModul(params: GenerateModulParams): Promise<ModulAjar> {
  const res = await fetch('/api/gemini/generate-modul', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Gagal menghasilkan Modul Ajar dari AI');
  }

  return await res.json();
}

export async function apiGenerateQuiz(params: GenerateQuizParams): Promise<BankSoalPaket> {
  const res = await fetch('/api/gemini/generate-quiz', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Gagal menyusun Bank Soal');
  }

  return await res.json();
}

export async function apiAnalyzeAssessment(projectData: AssessmentProject): Promise<any> {
  const res = await fetch('/api/gemini/analyze-assessment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ projectData }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Gagal menganalisis data penilaian siswa');
  }

  return await res.json();
}

export async function apiRefineModul(modul: ModulAjar, instruksiPerbaikan: string): Promise<ModulAjar> {
  const res = await fetch('/api/gemini/refine-modul', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ modul, instruksiPerbaikan }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Gagal menyempurnakan modul');
  }

  return await res.json();
}

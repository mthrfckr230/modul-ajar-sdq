import React, { useState } from 'react';
import { 
  Sparkles, 
  Layers, 
  BookOpen, 
  Clock, 
  CheckSquare, 
  HelpCircle, 
  Wand2, 
  GraduationCap, 
  School,
  FileCode,
  RotateCcw,
  Lightbulb,
  ArrowRight,
  Monitor,
  Languages,
  Calculator,
  Building2,
  Plus,
  Trash2,
  ListOrdered,
  ClipboardPaste,
  BookMarked
} from 'lucide-react';
import { 
  LIST_DIMENSI_P3, 
  LIST_FASE, 
  LIST_JENJANG, 
  LIST_MAPEL, 
  LIST_MODEL_PEMBELAJARAN,
} from '../data/curriculumData';
import { 
  SAMPLE_MODUL_AJAR_TIK, 
  SAMPLE_MODUL_AJAR_INGGRIS, 
  SAMPLE_MODUL_AJAR_MATEMATIKA 
} from '../data/sampleModulData';
import { DimensiP3, FaseKurikulum, JenjangPendidikan, ModulAjar } from '../types';
import { apiGenerateModul } from '../services/geminiService';

interface ModulGeneratorProps {
  onModulGenerated: (modul: ModulAjar) => void;
  onLoadSample: () => void;
}

export const ModulGenerator: React.FC<ModulGeneratorProps> = ({
  onModulGenerated,
  onLoadSample,
}) => {
  const [namaYayasan, setNamaYayasan] = useState('YAYASAN SIROJUL MUKHLASIN');
  const [namaSekolah, setNamaSekolah] = useState('SDQ AL MAHMUDAH');
  const [namaPenyusun, setNamaPenyusun] = useState('Laila Nabilatu Rohmah, S.Pd');
  const [namaWakasekKurikulum, setNamaWakasekKurikulum] = useState('Riana Rizki Abidin, S. S');
  const [tahunAjaran, setTahunAjaran] = useState('2026/2027');

  const [jenjang, setJenjang] = useState<JenjangPendidikan>('SD/MI');
  const [fase, setFase] = useState<FaseKurikulum>('Fase B (Kelas 3-4)');
  const [kelas, setKelas] = useState('3/I');
  const [namaKelasSpesifik, setNamaKelasSpesifik] = useState('3 Zaid bin Tsabit');
  const [hariTanggal, setHariTanggal] = useState('Rabu, 19 Agustus 2026');

  const [mataPelajaran, setMataPelajaran] = useState('TIK');
  const [elemen, setElemen] = useState('Literasi Digital & Keterampilan Komputer');
  const [topik, setTopik] = useState('Pengenalan Fitur Sederhana Paint & Menggambar Rumah/Pemandangan');

  // TUJUAN PEMBELAJARAN (TP) DARI BUKU PEGANGAN GURU / BUKU SISWA (WAJIB DIISI SEBELUM GENERATE)
  const [tpList, setTpList] = useState<string[]>([
    'Peserta didik mampu mengenali dan menyebutkan fungsi fitur sederhana aplikasi Paint.',
    'Peserta didik mampu menggunakan mouse dan fitur Paint untuk membuat gambar sederhana (rumah/pemandangan).',
    'Peserta didik mampu menunjukkan sikap tanggung jawab, mandiri, dan tertib selama kegiatan pembelajaran di laboratorium komputer.'
  ]);

  const [isBulkPasteMode, setIsBulkPasteMode] = useState(false);
  const [bulkTpText, setBulkTpText] = useState('');

  const [alokasiWaktu, setAlokasiWaktu] = useState('2 JP');
  const [jumlahPertemuan, setJumlahPertemuan] = useState(1);

  const [modelPembelajaran, setModelPembelajaran] = useState('Praktik / Learning by Doing');
  const [saranaPrasaranaInput, setSaranaPrasaranaInput] = useState('komputer, aplikasi paint.');
  const [softSkills, setSoftSkills] = useState('tanggung jawab, mandiri, jujur, teliti, percaya diri, kreativitas.');
  const [targetPesertaDidik, setTargetPesertaDidik] = useState('Inklusi (Berdiferensiasi)');
  const [kebutuhanKhusus, setKebutuhanKhusus] = useState('Menjangkau gaya belajar visual, auditori, kinestetik');
  const [customPromptTambahan, setCustomPromptTambahan] = useState('');

  const [selectedP3, setSelectedP3] = useState<DimensiP3[]>([
    'Mandiri',
    'Bernalar Kritis',
    'Kreatif'
  ]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Manipulasi Daftar TP Buku
  const handleAddTpRow = () => {
    setTpList([...tpList, '']);
  };

  const handleUpdateTpRow = (index: number, val: string) => {
    const updated = [...tpList];
    updated[index] = val;
    setTpList(updated);
  };

  const handleRemoveTpRow = (index: number) => {
    if (tpList.length <= 1) {
      setTpList(['']);
      return;
    }
    setTpList(tpList.filter((_, i) => i !== index));
  };

  const handleApplyBulkPaste = () => {
    if (!bulkTpText.trim()) return;
    const lines = bulkTpText
      .split('\n')
      .map(l => l.replace(/^([•\-\d\.]+\s*)/, '').trim())
      .filter(l => l.length > 0);

    if (lines.length > 0) {
      setTpList(lines);
      setIsBulkPasteMode(false);
      setBulkTpText('');
    }
  };

  const loadPreset = (preset: ModulAjar) => {
    setNamaYayasan(preset.kopSekolah?.namaYayasan || 'YAYASAN SIROJUL MUKHLASIN');
    setNamaSekolah(preset.kopSekolah?.namaSekolah || preset.identitas.namaSekolah);
    setNamaPenyusun(preset.identitas.namaGuruBidangStudi || preset.identitas.namaPenyusun);
    setNamaWakasekKurikulum(preset.identitas.namaWakasekKurikulum || 'Riana Rizki Abidin, S. S');
    setTahunAjaran(preset.identitas.tahunAjaran);
    setJenjang(preset.identitas.jenjang);
    setFase(preset.identitas.fase);
    setKelas(preset.identitas.kelas);
    setNamaKelasSpesifik(preset.identitas.namaKelasSpesifik || '3 Zaid bin Tsabit');
    setHariTanggal(preset.identitas.hariTanggal || 'Rabu, 19 Agustus 2026');
    setMataPelajaran(preset.identitas.mataPelajaran);
    setElemen(preset.identitas.elemen);
    setTopik(preset.judul);
    setAlokasiWaktu(preset.identitas.alokasiWaktu);
    setJumlahPertemuan(preset.identitas.jumlahPertemuan);
    setModelPembelajaran(preset.identitas.modelPembelajaranTeks || preset.komponenAwal.modelPembelajaran);
    setSaranaPrasaranaInput(preset.identitas.saranaPrasaranaTeks || preset.komponenAwal.saranaPrasarana.join(', '));
    setSoftSkills(preset.identitas.softSkillsTeks || 'tanggung jawab, mandiri, jujur, teliti, percaya diri.');

    // Muat TP dari buku sesuai preset
    if (preset.komponenInti?.tujuanPembelajaran && preset.komponenInti.tujuanPembelajaran.length > 0) {
      setTpList(preset.komponenInti.tujuanPembelajaran);
    }

    onModulGenerated(preset);
  };

  const toggleP3 = (dimensi: DimensiP3) => {
    if (selectedP3.includes(dimensi)) {
      if (selectedP3.length > 1) {
        setSelectedP3(selectedP3.filter(p => p !== dimensi));
      }
    } else {
      setSelectedP3([...selectedP3, dimensi]);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topik.trim()) {
      setErrorMessage('Harap masukkan topik atau materi pembelajaran.');
      return;
    }

    // VALIDASI: Guru harus memasukkan TP dari buku terlebih dahulu
    const validTpList = tpList.map(t => t.trim()).filter(t => t.length > 0);
    if (validTpList.length === 0) {
      setErrorMessage('PENTING: Guru harus memasukkan minimal 1 Tujuan Pembelajaran (TP) dari buku pegangan terlebih dahulu sebelum men-generate modul.');
      return;
    }

    setIsGenerating(true);
    setErrorMessage(null);
    setGenerationStep('Menganalisis TP dari Buku Pegangan & Kurikulum Merdeka...');

    try {
      setTimeout(() => setGenerationStep('Menyelaraskan Kriteria KKTP, Pertanyaan Pemantik, & Soft Skills...'), 1500);
      setTimeout(() => setGenerationStep('Menyusun Sintaks Langkah Pembelajaran (✓ ➢ ▪) & Lembar Asesmen Siswa...'), 3500);

      const generated = await apiGenerateModul({
        namaYayasan,
        namaSekolah,
        namaPenyusun,
        namaWakasekKurikulum,
        tahunAjaran,
        jenjang,
        fase,
        kelas,
        namaKelasSpesifik,
        hariTanggal,
        mataPelajaran,
        elemen,
        topik,
        tujuanPembelajaranBuku: validTpList,
        alokasiWaktu,
        jumlahPertemuan,
        modelPembelajaran,
        saranaPrasaranaInput,
        softSkills,
        targetPesertaDidik,
        kebutuhanKhusus,
        profilPelajarPancasila: selectedP3,
        customPromptTambahan: customPromptTambahan ? customPromptTambahan : undefined,
      });

      onModulGenerated(generated);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Terjadi kesalahan saat menyusun Modul Ajar oleh AI.');
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Quick Load Presets Banner */}
      <div className="bg-white p-6 rounded-[28px] border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              Format Otentik SDQ Al Mahmudah
            </span>
            <h3 className="text-lg font-black tracking-tight text-slate-900 mt-1">
              Pilih Contoh Modul Ajar Sesuai Format Sekolah
            </h3>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Klik tombol di bawah untuk memuat modul beserta TP buku:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Preset 1: TIK Paint */}
          <button
            type="button"
            onClick={() => loadPreset(SAMPLE_MODUL_AJAR_TIK)}
            className="p-4 text-left rounded-2xl border-2 border-indigo-600 bg-indigo-50/50 hover:bg-indigo-50 transition-all group"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-xs shadow-xs">
                <Monitor className="w-4 h-4" />
              </div>
              <span className="text-xs font-black uppercase text-indigo-900">TIK - Kelas 3</span>
            </div>
            <p className="text-xs font-bold text-slate-800 line-clamp-2">
              Aplikasi Paint & Menggambar Sederhana (3 Zaid bin Tsabit)
            </p>
          </button>

          {/* Preset 2: Bahasa Inggris Food & Drinks */}
          <button
            type="button"
            onClick={() => loadPreset(SAMPLE_MODUL_AJAR_INGGRIS)}
            className="p-4 text-left rounded-2xl border border-slate-200 hover:border-indigo-400 bg-slate-50 hover:bg-white transition-all group"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xs shadow-xs">
                <Languages className="w-4 h-4" />
              </div>
              <span className="text-xs font-black uppercase text-emerald-900">B. Inggris - Kelas 3</span>
            </div>
            <p className="text-xs font-bold text-slate-800 line-clamp-2">
              Evaluasi BAB 1 Food & Drinks (3 Zaid bin Tsabit)
            </p>
          </button>

          {/* Preset 3: Matematika Sifat Operasi */}
          <button
            type="button"
            onClick={() => loadPreset(SAMPLE_MODUL_AJAR_MATEMATIKA)}
            className="p-4 text-left rounded-2xl border border-slate-200 hover:border-indigo-400 bg-slate-50 hover:bg-white transition-all group"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center font-black text-xs shadow-xs">
                <Calculator className="w-4 h-4" />
              </div>
              <span className="text-xs font-black uppercase text-amber-900">Matematika - Kelas 3</span>
            </div>
            <p className="text-xs font-bold text-slate-800 line-clamp-2">
              Sifat Pertukaran & Pengurangan (3 Ubay bin Ka'ab)
            </p>
          </button>
        </div>
      </div>

      {/* Generator Form */}
      <form onSubmit={handleGenerate} className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm space-y-8">
        <div className="border-b border-slate-200 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                AI Modul Generator
              </span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900">
              Susun RPP Otomatis Kurikulum Merdeka
            </h2>
          </div>

          <button
            type="button"
            onClick={onLoadSample}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors self-start sm:self-auto"
          >
            <RotateCcw className="w-4 h-4 text-slate-400" />
            <span>Muat Template Awal</span>
          </button>
        </div>

        {errorMessage && (
          <div className="p-4 bg-rose-50 border-2 border-rose-200 text-rose-800 rounded-2xl text-xs font-bold leading-relaxed flex items-start gap-2">
            <span className="text-rose-600 font-black">⚠️</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* 1. Kop & Identitas Satuan Pendidikan */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
              01. Kop Yayasan & Satuan Pendidikan
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Nama Yayasan</label>
              <input
                type="text"
                value={namaYayasan}
                onChange={(e) => setNamaYayasan(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-indigo-600"
                placeholder="YAYASAN SIROJUL MUKHLASIN"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Satuan Pendidikan</label>
              <input
                type="text"
                value={namaSekolah}
                onChange={(e) => setNamaSekolah(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-indigo-600"
                placeholder="SDQ AL MAHMUDAH"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Tahun Ajaran</label>
              <input
                type="text"
                value={tahunAjaran}
                onChange={(e) => setTahunAjaran(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-indigo-600"
                placeholder="2026/2027"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Nama Guru / Penyusun</label>
              <input
                type="text"
                value={namaPenyusun}
                onChange={(e) => setNamaPenyusun(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-indigo-600"
                placeholder="Laila Nabilatu Rohmah, S.Pd"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">WAKASEK Kurikulum</label>
              <input
                type="text"
                value={namaWakasekKurikulum}
                onChange={(e) => setNamaWakasekKurikulum(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-indigo-600"
                placeholder="Riana Rizki Abidin, S. S"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Hari / Tanggal Pelaksanaan</label>
              <input
                type="text"
                value={hariTanggal}
                onChange={(e) => setHariTanggal(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-indigo-600"
                placeholder="Rabu, 19 Agustus 2026"
              />
            </div>
          </div>
        </div>

        {/* 2. Informasi Mapel & Topik */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
              02. Mata Pelajaran, Kelas & Topik
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Fase Kurikulum</label>
              <select
                value={fase}
                onChange={(e) => setFase(e.target.value as FaseKurikulum)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-indigo-600"
              >
                {LIST_FASE.map((f) => (
                  <option key={f.id} value={f.id}>{f.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Kelas / Semester</label>
              <input
                type="text"
                value={kelas}
                onChange={(e) => setKelas(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-indigo-600"
                placeholder="3/I"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Nama Kelas Spesifik</label>
              <input
                type="text"
                value={namaKelasSpesifik}
                onChange={(e) => setNamaKelasSpesifik(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-indigo-600"
                placeholder="3 Zaid bin Tsabit / 3 Ubay bin Ka'ab"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Mata Pelajaran</label>
              <input
                type="text"
                value={mataPelajaran}
                onChange={(e) => setMataPelajaran(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-indigo-600"
                placeholder="TIK / Matematika / Bahasa Inggris"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Topik / Materi Pembelajaran</label>
              <input
                type="text"
                required
                value={topik}
                onChange={(e) => setTopik(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-indigo-600"
                placeholder="Contoh: Pengenalan Fitur Sederhana Paint & Menggambar Rumah/Pemandangan"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Alokasi Waktu</label>
              <input
                type="text"
                value={alokasiWaktu}
                onChange={(e) => setAlokasiWaktu(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-indigo-600"
                placeholder="2 JP"
              />
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. TUJUAN PEMBELAJARAN (TP) DARI BUKU PEGANGAN GURU / TEKS (WAJIB)         */}
        {/* ========================================================================= */}
        <div className="p-6 bg-indigo-50/70 border-2 border-indigo-200 rounded-[28px] space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                <BookMarked className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-indigo-950 flex items-center gap-2">
                  <span>Tujuan Pembelajaran (TP) dari Buku Pegangan</span>
                  <span className="px-2 py-0.5 bg-indigo-600 text-white text-[10px] rounded-full font-black uppercase tracking-widest">
                    Wajib Diisi Guru
                  </span>
                </h3>
                <p className="text-xs text-indigo-800 font-medium mt-0.5">
                  Masukkan poin TP dari buku guru/siswa. AI akan menyusun langkah kegiatan, KKTP, pertanyaan pemantik, dan instrumen asesmen berdasarkan TP ini.
                </p>
              </div>
            </div>

            {/* Toggle Mode Paste */}
            <button
              type="button"
              onClick={() => setIsBulkPasteMode(!isBulkPasteMode)}
              className="px-3.5 py-2 bg-white hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl border border-indigo-200 transition-colors flex items-center gap-1.5"
            >
              {isBulkPasteMode ? <ListOrdered className="w-3.5 h-3.5" /> : <ClipboardPaste className="w-3.5 h-3.5" />}
              <span>{isBulkPasteMode ? 'Mode Daftar Per Poin' : 'Tempel Teks Buku'}</span>
            </button>
          </div>

          {/* Mode 1: Bulk Paste Textarea */}
          {isBulkPasteMode ? (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-indigo-900">
                Tempel kalimat Tujuan Pembelajaran (TP) langsung dari buku (pisahkan baris per baris):
              </label>
              <textarea
                rows={4}
                value={bulkTpText}
                onChange={(e) => setBulkTpText(e.target.value)}
                placeholder="Contoh:&#10;1. Peserta didik mampu mengenal fitur dasar aplikasi Paint.&#10;2. Peserta didik mampu menggambar bentuk rumah secara mandiri.&#10;3. Peserta didik menunjukkan ketelitian dan tanggung jawab."
                className="w-full p-4 bg-white border border-indigo-200 rounded-2xl text-xs font-semibold focus:ring-2 focus:ring-indigo-600"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsBulkPasteMode(false)}
                  className="px-4 py-2 bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleApplyBulkPaste}
                  className="px-4 py-2 bg-indigo-600 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-xs"
                >
                  Terapkan Poin TP
                </button>
              </div>
            </div>
          ) : (
            /* Mode 2: List of TP Items */
            <div className="space-y-3">
              {tpList.map((tpItem, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <span className="w-7 h-10 rounded-xl bg-indigo-600 text-white text-xs font-black flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    required
                    value={tpItem}
                    onChange={(e) => handleUpdateTpRow(idx, e.target.value)}
                    placeholder={`Tujuan Pembelajaran ${idx + 1} dari buku pegangan...`}
                    className="flex-1 px-4 py-2.5 bg-white border border-indigo-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-600 shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveTpRow(idx)}
                    className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded-xl transition-colors shrink-0"
                    title="Hapus baris TP ini"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleAddTpRow}
                  className="px-4 py-2 bg-white hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl border border-indigo-200 transition-colors flex items-center gap-2 shadow-2xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Tujuan Pembelajaran (TP)</span>
                </button>

                <span className="text-[11px] font-bold text-indigo-700">
                  Total: {tpList.filter(t => t.trim().length > 0).length} TP siap diproses
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 4. Pedagogi, Model, Sarana, & Soft Skills */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
              04. Model Pembelajaran, Sarana, & Soft Skills
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Model Pembelajaran</label>
              <input
                type="text"
                value={modelPembelajaran}
                onChange={(e) => setModelPembelajaran(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-indigo-600"
                placeholder="Praktik / Learning by Doing, PBL, Inquiry"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Sarana dan Prasarana</label>
              <input
                type="text"
                value={saranaPrasaranaInput}
                onChange={(e) => setSaranaPrasaranaInput(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-indigo-600"
                placeholder="komputer, aplikasi paint / buku paket"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Soft Skills</label>
              <input
                type="text"
                value={softSkills}
                onChange={(e) => setSoftSkills(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-indigo-600"
                placeholder="tanggung jawab, mandiri, jujur, teliti, percaya diri."
              />
            </div>
          </div>

          {/* Dimensi Profil Pelajar Pancasila */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Dimensi Profil Pelajar Pancasila (P3):
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {LIST_DIMENSI_P3.map((item) => {
                const isSelected = selectedP3.includes(item.dimensi);
                return (
                  <button
                    key={item.dimensi}
                    type="button"
                    onClick={() => toggleP3(item.dimensi)}
                    className={`p-3 rounded-2xl text-left text-xs font-bold transition-all border ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-3.5 h-3.5 rounded flex items-center justify-center ${isSelected ? 'bg-indigo-600 text-white' : 'border border-slate-300'}`}>
                        {isSelected && '✓'}
                      </div>
                      <span className="line-clamp-1">{item.dimensi}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div className="pt-4 border-t border-slate-200">
          <button
            type="submit"
            disabled={isGenerating}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-md transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Wand2 className="w-5 h-5 animate-spin" />
                <span>{generationStep || 'Menyusun Modul Ajar AI Berdasarkan TP Buku...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Generate Modul Ajar Berdasarkan TP Buku</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

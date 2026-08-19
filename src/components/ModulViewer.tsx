import React, { useState } from 'react';
import { 
  FileDown, 
  Printer, 
  CloudUpload, 
  ExternalLink, 
  Sparkles, 
  CheckCircle2, 
  FileText,
  Wand2,
  Check,
  Building2,
  BookOpen,
  UserCheck,
  CheckSquare,
  Square
} from 'lucide-react';
import { ModulAjar } from '../types';
import { generateDocxBlob, downloadBlob } from '../services/docxExportService';
import { saveModulToDrive } from '../services/googleDriveService';
import { exportModulToGoogleDocs } from '../services/googleDocsService';
import { apiRefineModul } from '../services/geminiService';

interface ModulViewerProps {
  modul: ModulAjar;
  onUpdateModul: (modul: ModulAjar) => void;
  hasGoogleToken: boolean;
  onRequireLogin: () => void;
}

export const ModulViewer: React.FC<ModulViewerProps> = ({
  modul,
  onUpdateModul,
  hasGoogleToken,
  onRequireLogin,
}) => {
  const [activeLayout, setActiveLayout] = useState<'sdq' | 'bskap'>('sdq');
  const [isSavingToDrive, setIsSavingToDrive] = useState(false);
  const [isExportingToDocs, setIsExportingToDocs] = useState(false);
  const [docsLink, setDocsLink] = useState<string | null>(modul.googleDocsUrl || null);

  const [isRefining, setIsRefining] = useState(false);
  const [showRefineModal, setShowRefineModal] = useState(false);
  const [refinePrompt, setRefinePrompt] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleDownloadDocx = async () => {
    try {
      const blob = await generateDocxBlob(modul);
      const safeName = `Modul_Ajar_${(modul.identitas.mataPelajaran || 'Mapel').replace(/\s+/g, '_')}_${(modul.identitas.namaKelasSpesifik || modul.identitas.kelas || '3').replace(/\s+/g, '_')}.docx`;
      downloadBlob(blob, safeName);
      showToast('Dokumen Word (.docx) berhasil diunduh!');
    } catch (err: any) {
      console.error(err);
      alert('Gagal membuat dokumen Word: ' + err.message);
    }
  };

  const handlePrintPdf = () => {
    window.print();
  };

  const handleSaveToDrive = async () => {
    if (!hasGoogleToken) {
      onRequireLogin();
      return;
    }

    setIsSavingToDrive(true);
    try {
      const result = await saveModulToDrive(modul);
      const updated = { ...modul, googleDriveFileId: result.fileId };
      onUpdateModul(updated);
      showToast('Modul Ajar berhasil disimpan ke Google Drive!');
    } catch (err: any) {
      console.error(err);
      alert('Gagal menyimpan ke Google Drive: ' + err.message);
    } finally {
      setIsSavingToDrive(false);
    }
  };

  const handleExportToGoogleDocs = async () => {
    if (!hasGoogleToken) {
      onRequireLogin();
      return;
    }

    setIsExportingToDocs(true);
    try {
      const result = await exportModulToGoogleDocs(modul);
      const updated = {
        ...modul,
        googleDocsId: result.docId,
        googleDocsUrl: result.docUrl
      };
      onUpdateModul(updated);
      setDocsLink(result.docUrl);
      showToast('Google Doc baru berhasil dibuat di Drive!');
    } catch (err: any) {
      console.error(err);
      alert('Gagal ekspor ke Google Docs: ' + err.message);
    } finally {
      setIsExportingToDocs(false);
    }
  };

  const handleRefineWithAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refinePrompt.trim()) return;

    setIsRefining(true);
    try {
      const updated = await apiRefineModul(modul, refinePrompt);
      onUpdateModul(updated);
      setShowRefineModal(false);
      setRefinePrompt('');
      showToast('Modul Ajar berhasil disempurnakan!');
    } catch (err: any) {
      console.error(err);
      alert('Gagal menyempurnakan modul: ' + err.message);
    } finally {
      setIsRefining(false);
    }
  };

  const toggleStudentIndicator = (studentIndex: number, indicatorIdx: number) => {
    if (!modul.lembarAsesmenMurid) return;
    const currentList = [...modul.lembarAsesmenMurid.daftarSiswa];
    const targetStudent = { ...currentList[studentIndex] };
    const currentVal = !!targetStudent.indikatorNilai[indicatorIdx];
    targetStudent.indikatorNilai = {
      ...targetStudent.indikatorNilai,
      [indicatorIdx]: !currentVal
    };
    currentList[studentIndex] = targetStudent;

    onUpdateModul({
      ...modul,
      lembarAsesmenMurid: {
        ...modul.lembarAsesmenMurid,
        daftarSiswa: currentList
      }
    });
  };

  const updateStudentNote = (studentIndex: number, note: string) => {
    if (!modul.lembarAsesmenMurid) return;
    const currentList = [...modul.lembarAsesmenMurid.daftarSiswa];
    currentList[studentIndex] = {
      ...currentList[studentIndex],
      catatan: note
    };

    onUpdateModul({
      ...modul,
      lembarAsesmenMurid: {
        ...modul.lembarAsesmenMurid,
        daftarSiswa: currentList
      }
    });
  };

  const kop = modul.kopSekolah;
  const identitas = modul.identitas;
  const komponenAwal = modul.komponenAwal;
  const komponenInti = modul.komponenInti;
  const lembarAsesmen = modul.lembarAsesmenMurid;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3.5 bg-slate-900 text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-xl animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Action Toolbar */}
      <div className="bg-white p-4 sm:p-5 rounded-[28px] border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        {/* Format Selector */}
        <div className="flex items-center gap-2">
          <button
            id="tab-format-sdq"
            onClick={() => setActiveLayout('sdq')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
              activeLayout === 'sdq'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Format Otentik SDQ (1 Lembar + Asesmen)</span>
          </button>

          <button
            id="tab-format-bskap"
            onClick={() => setActiveLayout('bskap')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
              activeLayout === 'bskap'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Format Komprehensif BSKAP</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Export Word */}
          <button
            id="btn-export-docx"
            onClick={handleDownloadDocx}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-bold rounded-xl border border-slate-200 transition-colors"
            title="Download file Microsoft Word (.docx) rapi sesuai format"
          >
            <FileDown className="w-4 h-4 text-indigo-600" />
            <span>Word (.docx)</span>
          </button>

          {/* Cetak PDF */}
          <button
            id="btn-print-pdf"
            onClick={handlePrintPdf}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-bold rounded-xl border border-slate-200 transition-colors"
            title="Cetak atau Simpan sebagai PDF"
          >
            <Printer className="w-4 h-4 text-slate-700" />
            <span>PDF</span>
          </button>

          {/* Google Docs */}
          <button
            id="btn-export-gdocs"
            onClick={handleExportToGoogleDocs}
            disabled={isExportingToDocs}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl border border-indigo-200 transition-colors disabled:opacity-50"
          >
            <FileText className="w-4 h-4 text-indigo-600" />
            <span>{isExportingToDocs ? 'Membuat Docs...' : 'Google Docs'}</span>
          </button>

          {/* Google Drive */}
          <button
            id="btn-save-drive"
            onClick={handleSaveToDrive}
            disabled={isSavingToDrive}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-xs transition-all disabled:opacity-50"
          >
            <CloudUpload className="w-4 h-4 text-emerald-400" />
            <span>{isSavingToDrive ? 'Menyimpan...' : 'Simpan ke Drive'}</span>
          </button>

          {docsLink && (
            <a
              id="link-open-gdoc"
              href={docsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-200 transition-colors"
            >
              <span>Buka Google Doc</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

          {/* AI Refine */}
          <button
            id="btn-refine-ai"
            onClick={() => setShowRefineModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-indigo-200" />
            <span>Edit AI</span>
          </button>
        </div>
      </div>

      {/* AI Refine Modal */}
      {showRefineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-[32px] shadow-2xl border border-slate-200 p-8 animate-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                  <Wand2 className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-black tracking-tight text-slate-900">Kustomisasi Modul dengan AI</h3>
              </div>
              <button
                onClick={() => setShowRefineModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm p-1"
              >
                ✕
              </button>
            </div>
            <p className="text-xs font-medium text-slate-500 leading-relaxed">
              Ketik instruksi perbaikan (misal: "Ubah nama guru menjadi Ahmad Zaki, S.Pd", "Tambahkan pertanyaan pemantik tentang aplikasi Paint", "Sesuaikan kelas menjadi 3 Ubay bin Ka'ab").
            </p>

            <form onSubmit={handleRefineWithAI} className="space-y-4">
              <textarea
                id="textarea-refine-prompt"
                rows={4}
                required
                value={refinePrompt}
                onChange={(e) => setRefinePrompt(e.target.value)}
                className="w-full p-4 text-xs font-medium bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-indigo-600"
                placeholder="Tuliskan instruksi penyempurnaan..."
              />

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRefineModal(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  id="btn-submit-refine"
                  type="submit"
                  disabled={isRefining}
                  className="px-5 py-2.5 text-xs font-black uppercase tracking-wider bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm disabled:opacity-50"
                >
                  {isRefining ? 'Memproses...' : 'Terapkan AI'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. OTENTIK SDQ AL MAHMUDAH LAYOUT (100% PERSIS SEPERTI CONTOH PDF)       */}
      {/* ========================================================================= */}
      {activeLayout === 'sdq' && (
        <div className="space-y-8">
          {/* LEMBAR 1: MODUL AJAR UTAMA */}
          <div 
            id="sdq-modul-paper"
            className="bg-white rounded-[24px] border border-slate-300 shadow-sm p-8 sm:p-12 max-w-4xl mx-auto space-y-6 font-sans text-slate-900 print:border-none print:shadow-none print:p-0 print:m-0"
          >
            {/* KOP YAYASAN & SEKOLAH */}
            <div className="text-center space-y-1 pb-3 border-b-4 border-double border-slate-900">
              <h2 className="text-base sm:text-lg font-black tracking-wide uppercase text-slate-900">
                {kop?.namaYayasan || 'YAYASAN SIROJUL MUKHLASIN'}
              </h2>
              {kop?.aktaNotaris && (
                <p className="text-[11px] text-slate-600 font-medium">
                  {kop.aktaNotaris}
                </p>
              )}
              {kop?.skKemenkumham && (
                <p className="text-[11px] text-slate-600 font-medium">
                  {kop.skKemenkumham}
                </p>
              )}
              <p className="text-sm font-bold tracking-wider text-slate-800 pt-1">
                {kop?.jenjangSekolah || "SEKOLAH DASAR QUR'AN"}
              </p>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-950">
                {kop?.namaSekolah || 'SDQ AL MAHMUDAH'}
              </h1>
              <p className="text-[11px] italic text-slate-600">
                {kop?.alamatSekolah || 'Kp. Cogreg Rt 002/003 Ds. Cogreg Kec. Parung Kab. Bogor-Jawa Barat'}
              </p>
            </div>

            {/* TITLE: MODUL AJAR (UNDERLINED) */}
            <div className="text-center pt-2">
              <h2 className="text-lg font-black tracking-wider uppercase underline underline-offset-4 decoration-2">
                MODUL AJAR
              </h2>
            </div>

            {/* TABEL INFORMASI 2 KOLOM (BORDERED) */}
            <div className="border border-slate-900 rounded-lg overflow-hidden grid grid-cols-1 md:grid-cols-2 text-xs">
              {/* Kolom Kiri */}
              <div className="p-3.5 space-y-2 border-b md:border-b-0 md:border-r border-slate-900 bg-slate-50/40">
                <div className="flex">
                  <span className="w-36 font-bold text-slate-900 shrink-0">Nama Guru</span>
                  <span className="mr-1">:</span>
                  <span className="font-semibold text-slate-800">{identitas.namaGuruBidangStudi || identitas.namaPenyusun}</span>
                </div>
                <div className="flex">
                  <span className="w-36 font-bold text-slate-900 shrink-0">Mapel</span>
                  <span className="mr-1">:</span>
                  <span className="font-semibold text-slate-800">{identitas.mataPelajaran}</span>
                </div>
                <div className="flex">
                  <span className="w-36 font-bold text-slate-900 shrink-0">Fase</span>
                  <span className="mr-1">:</span>
                  <span className="font-semibold text-slate-800">{identitas.fase.replace('Fase ', '').split(' ')[0]}</span>
                </div>
                <div className="flex">
                  <span className="w-36 font-bold text-slate-900 shrink-0">Model pembelajaran</span>
                  <span className="mr-1">:</span>
                  <span className="font-medium text-slate-800">{identitas.modelPembelajaranTeks || komponenAwal.modelPembelajaran}</span>
                </div>
                <div className="flex">
                  <span className="w-36 font-bold text-slate-900 shrink-0">Sarana dan prasarana</span>
                  <span className="mr-1">:</span>
                  <span className="font-medium text-slate-800">{identitas.saranaPrasaranaTeks || komponenAwal.saranaPrasarana.join(', ')}</span>
                </div>
              </div>

              {/* Kolom Kanan */}
              <div className="p-3.5 space-y-2 bg-slate-50/40">
                <div className="flex">
                  <span className="w-36 font-bold text-slate-900 shrink-0">Satuan pendidikan</span>
                  <span className="mr-1">:</span>
                  <span className="font-semibold text-slate-800">{kop?.namaSekolah || identitas.namaSekolah}</span>
                </div>
                <div className="flex">
                  <span className="w-36 font-bold text-slate-900 shrink-0">Alokasi waktu</span>
                  <span className="mr-1">:</span>
                  <span className="font-semibold text-slate-800">{identitas.alokasiWaktu}</span>
                </div>
                <div className="flex">
                  <span className="w-36 font-bold text-slate-900 shrink-0">Kelas/semester</span>
                  <span className="mr-1">:</span>
                  <span className="font-semibold text-slate-800">{identitas.kelas}</span>
                </div>
                <div className="flex">
                  <span className="w-36 font-bold text-slate-900 shrink-0">Hari/tanggal</span>
                  <span className="mr-1">:</span>
                  <span className="font-semibold text-slate-800">{identitas.hariTanggal || 'Rabu, 19 Agustus 2026'}</span>
                </div>
                <div className="flex items-start">
                  <span className="w-36 font-bold text-slate-900 shrink-0">Target Murid</span>
                  <span className="mr-1">:</span>
                  <span className="font-medium text-slate-800 leading-relaxed text-[11.5px]">
                    {identitas.targetMuridTeks || komponenAwal.targetPesertaDidik}
                  </span>
                </div>
              </div>
            </div>

            {/* SOFT SKILLS BAR */}
            <div className="text-xs">
              <span className="font-bold text-slate-900">Soft skills : </span>
              <span className="text-slate-800 font-medium italic">
                {identitas.softSkillsTeks || 'tanggung jawab, mandiri, jujur, teliti, percaya diri, kreativitas.'}
              </span>
            </div>

            {/* TUJUAN PEMBELAJARAN */}
            <div className="space-y-1 text-xs">
              <p className="font-bold text-slate-900">Tujuan pembelajaran:</p>
              <ul className="space-y-1 pl-4 text-slate-800 font-medium">
                {komponenInti.tujuanPembelajaran.map((tp, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="font-black text-slate-900">•</span>
                    <span className="leading-relaxed">{tp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* TABEL 2 KOLOM: PERTANYAAN PEMANTIK & KRITERIA KKTP */}
            <div className="border border-slate-900 rounded-lg overflow-hidden text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-900">
                {/* Kolom Kiri: Pertanyaan Pemantik */}
                <div className="p-3.5 space-y-2">
                  <p className="font-black text-slate-900 pb-1 border-b border-slate-200">
                    Pertanyaan Pemantik:
                  </p>
                  <ol className="space-y-1.5 pl-4 text-slate-800 list-decimal font-medium">
                    {komponenInti.pertanyaanPemantik.map((pp, idx) => (
                      <li key={idx} className="leading-relaxed">{pp}</li>
                    ))}
                  </ol>
                </div>

                {/* Kolom Kanan: Kriteria KKTP */}
                <div className="p-3.5 space-y-2 bg-slate-50/30">
                  <p className="font-black text-slate-900 pb-1 border-b border-slate-200">
                    Kriteria untuk mengukur ketercapaian TP:
                  </p>
                  <ul className="space-y-1.5 text-slate-800 font-medium">
                    {komponenInti.kriteriaKetercapaianTP.map((kktp, idx) => (
                      <li key={idx} className="flex items-start gap-2 leading-relaxed">
                        <span className="font-black text-slate-900">•</span>
                        <span>{kktp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* LANGKAH-LANGKAH PEMBELAJARAN (PENDAHULUAN, INTI, PENUTUP) */}
            <div className="space-y-4 text-xs">
              <p className="font-bold text-slate-900 text-sm">Langkah-langkah Pembelajaran:</p>

              {/* 1. Pendahuluan (✓) */}
              <div className="space-y-1.5 pl-2">
                <p className="font-bold text-slate-900">Pendahuluan</p>
                <div className="space-y-1 text-slate-800 font-medium pl-3">
                  {(komponenInti.kegiatanPembelajaran[0]?.pendahuluan.kegiatan || []).map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="font-bold text-emerald-700 shrink-0">✓</span>
                      <span className="leading-relaxed">{item.replace(/^([✓•\-\d\.]+\s*)/, '')}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Kegiatan Inti (➢) */}
              <div className="space-y-1.5 pl-2">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-slate-900">Kegiatan Inti</p>
                  <span className="text-[10px] text-slate-500 italic">
                    (Model: {komponenInti.kegiatanPembelajaran[0]?.inti.sintaks || komponenAwal.modelPembelajaran})
                  </span>
                </div>
                <div className="space-y-1.5 text-slate-800 font-medium pl-3">
                  {(komponenInti.kegiatanPembelajaran[0]?.inti.kegiatan || []).map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="font-bold text-indigo-700 shrink-0">➢</span>
                      <span className="leading-relaxed">{item.replace(/^([➢•\-\d\.]+\s*)/, '')}</span>
                    </div>
                  ))}
                  {komponenInti.kegiatanPembelajaran[0]?.inti.diferensiasiAktivitas && (
                    <p className="mt-2 text-[11px] font-semibold text-amber-900 bg-amber-50 p-2 rounded border border-amber-200">
                      💡 Diferensiasi: {komponenInti.kegiatanPembelajaran[0].inti.diferensiasiAktivitas}
                    </p>
                  )}
                </div>
              </div>

              {/* 3. Penutup (▪) */}
              <div className="space-y-1.5 pl-2">
                <p className="font-bold text-slate-900">Penutup</p>
                <div className="space-y-1 text-slate-800 font-medium pl-3">
                  {(komponenInti.kegiatanPembelajaran[0]?.penutup.kegiatan || []).map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="font-bold text-slate-700 shrink-0">▪</span>
                      <span className="leading-relaxed">{item.replace(/^([▪•\-\d\.]+\s*)/, '')}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* PENGESAHAN TANDA TANGAN (WAKASEK & GURU BIDANG STUDI) */}
            <div className="pt-8 grid grid-cols-2 text-xs text-slate-900">
              <div className="space-y-1">
                <p>Mengetahui,</p>
                <p className="font-bold">WAKASEK Kurikulum</p>
                <div className="h-16" />
                <p className="font-bold underline underline-offset-2">
                  ( {identitas.namaWakasekKurikulum || 'Riana Rizki Abidin, S. S'} )
                </p>
              </div>

              <div className="space-y-1 text-right sm:text-left sm:pl-16">
                <p>Bogor, {identitas.hariTanggal || '19 Agustus 2026'}</p>
                <p className="font-bold">Guru Bidang Studi</p>
                <div className="h-16" />
                <p className="font-bold underline underline-offset-2">
                  ( {identitas.namaGuruBidangStudi || identitas.namaPenyusun} )
                </p>
              </div>
            </div>
          </div>

          {/* LEMBAR 2: LEMBAR ASESMEN KEGIATAN MURID (100% PERSIS SEPERTI PDF) */}
          <div 
            id="sdq-asesmen-paper"
            className="bg-white rounded-[24px] border border-slate-300 shadow-sm p-8 sm:p-12 max-w-4xl mx-auto space-y-6 font-sans text-slate-900 print:border-none print:shadow-none print:p-0 print:m-0"
          >
            <div className="text-center space-y-1 pb-2">
              <h2 className="text-base sm:text-lg font-black tracking-wide uppercase underline underline-offset-4 decoration-2">
                Lembar Asesmen Kegiatan Murid
              </h2>
            </div>

            {/* Info Lembar Asesmen */}
            <div className="text-xs space-y-1 font-semibold text-slate-800">
              <div className="flex">
                <span className="w-32">Mata Pelajaran</span>
                <span className="mr-2">:</span>
                <span>{lembarAsesmen?.mataPelajaran || identitas.mataPelajaran}</span>
              </div>
              <div className="flex">
                <span className="w-32">Kelas</span>
                <span className="mr-2">:</span>
                <span>{lembarAsesmen?.kelas || identitas.namaKelasSpesifik || identitas.kelas}</span>
              </div>
              <div className="flex">
                <span className="w-32">Hari/tanggal</span>
                <span className="mr-2">:</span>
                <span>{lembarAsesmen?.hariTanggal || identitas.hariTanggal || 'Rabu, 19 Agustus 2026'}</span>
              </div>
            </div>

            {/* TABEL DAFTAR SISWA & INDIKATOR CHECKBOX */}
            <div className="overflow-x-auto border border-slate-900 rounded-lg">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-900 font-black text-slate-900">
                    <th className="p-2.5 text-center border-r border-slate-900 w-12">No</th>
                    <th className="p-2.5 border-r border-slate-900">Nama</th>
                    <th className="p-2.5 text-center border-r border-slate-900 w-36">
                      Indikator (1, 2, 3)
                    </th>
                    <th className="p-2.5">Catatan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300">
                  {(lembarAsesmen?.daftarSiswa || []).map((siswa, idx) => (
                    <tr key={siswa.no} className="hover:bg-slate-50/80">
                      <td className="p-2 text-center font-bold text-slate-800 border-r border-slate-900 bg-slate-50/30">
                        {siswa.no}
                      </td>
                      <td className="p-2 font-bold text-slate-900 border-r border-slate-900">
                        {siswa.nama}
                      </td>
                      <td className="p-2 border-r border-slate-900 text-center">
                        <div className="flex items-center justify-center gap-2 font-bold">
                          {[0, 1, 2].map((indNum) => {
                            const isChecked = !!siswa.indikatorNilai[indNum];
                            return (
                              <button
                                key={indNum}
                                type="button"
                                onClick={() => toggleStudentIndicator(idx, indNum)}
                                className={`w-7 h-7 rounded flex items-center justify-center text-xs transition-colors ${
                                  isChecked
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-400 font-black'
                                    : 'bg-slate-100 text-slate-400 border border-slate-300 hover:bg-slate-200'
                                }`}
                                title={`Toggle Indikator ${indNum + 1}`}
                              >
                                {isChecked ? '✓' : `${indNum + 1}`}
                              </button>
                            );
                          })}
                        </div>
                      </td>
                      <td className="p-1.5">
                        <input
                          type="text"
                          value={siswa.catatan || ''}
                          onChange={(e) => updateStudentNote(idx, e.target.value)}
                          placeholder="Catatan perkembangan murid..."
                          className="w-full px-2 py-1 text-xs bg-transparent hover:bg-white focus:bg-white border-0 focus:ring-1 focus:ring-indigo-600 rounded"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* KETERANGAN INDIKATOR */}
            <div className="space-y-1.5 text-xs text-slate-800 pt-2">
              <p className="font-bold text-slate-900">Keterangan Indikator:</p>
              <ol className="space-y-1 pl-4 list-decimal font-medium">
                {(lembarAsesmen?.indikator || komponenInti.kriteriaKetercapaianTP).map((ind, i) => (
                  <li key={i} className="leading-relaxed">{ind}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. FORMAT KOMPREHENSIF BSKAP (LKPD, GLOSARIUM, RUBRIK DETIL)             */}
      {/* ========================================================================= */}
      {activeLayout === 'bskap' && (
        <div 
          id="bskap-modul-paper"
          className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-8 sm:p-12 max-w-4xl mx-auto space-y-8 font-sans print:border-none print:shadow-none print:p-0 print:m-0"
        >
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-wider">
                  {identitas.jenjang} • {identitas.fase}
                </span>
                <span className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-bold">
                  Standar BSKAP Kemendikbudristek
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                {modul.judul}
              </h2>
              <p className="text-slate-400 font-bold text-xs mt-1">
                {identitas.mataPelajaran} — {identitas.kelas} ({identitas.namaKelasSpesifik || ''})
              </p>
            </div>

            <div className="text-left sm:text-right text-xs text-slate-500 font-medium">
              <p className="font-bold text-slate-900">{kop?.namaSekolah || identitas.namaSekolah}</p>
              <p>Penyusun: {identitas.namaGuruBidangStudi || identitas.namaPenyusun}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">T.A. {identitas.tahunAjaran}</p>
            </div>
          </div>

          {/* Diferensiasi Tri-Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-indigo-50">
              <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Diferensiasi Konten</p>
              <p className="text-xs font-bold text-indigo-900 mt-1">{komponenInti.diferensiasi.konten}</p>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50">
              <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Diferensiasi Proses</p>
              <p className="text-xs font-bold text-emerald-900 mt-1">{komponenInti.diferensiasi.proses}</p>
            </div>
            <div className="p-4 rounded-2xl bg-amber-50">
              <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">Diferensiasi Produk</p>
              <p className="text-xs font-bold text-amber-950 mt-1">{komponenInti.diferensiasi.produk}</p>
            </div>
          </div>

          {/* Rubrik KKTP Table */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
              Rubrik Kriteria Ketercapaian Tujuan Pembelajaran (KKTP)
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border border-slate-200 rounded-2xl overflow-hidden">
                <thead>
                  <tr className="bg-slate-900 text-white">
                    <th className="p-3 font-bold">Aspek Penilaian</th>
                    <th className="p-3 font-bold text-rose-300">Perlu Bimbingan (&lt;70)</th>
                    <th className="p-3 font-bold text-amber-300">Cukup (70-79)</th>
                    <th className="p-3 font-bold text-blue-300">Baik (80-89)</th>
                    <th className="p-3 font-bold text-emerald-300">Sangat Baik (90-100)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {komponenInti.asesmen.rubrikKKTP.map((r, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900 bg-slate-50/50">{r.aspek}</td>
                      <td className="p-3 text-slate-600 font-medium">{r.perluBimbingan}</td>
                      <td className="p-3 text-slate-600 font-medium">{r.cukup}</td>
                      <td className="p-3 text-slate-600 font-medium">{r.baik}</td>
                      <td className="p-3 text-slate-600 font-medium">{r.sangatBaik}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* LKPD Box */}
          <div className="p-6 bg-indigo-600 rounded-[28px] text-white space-y-4">
            <div className="flex items-center justify-between border-b border-white/20 pb-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">
                  Lembar Kerja Peserta Didik (LKPD)
                </p>
                <h4 className="text-xl font-bold mt-0.5">{modul.lampiran.lkpd.judulLKPD}</h4>
              </div>
              <span className="px-3 py-1 bg-white/20 text-white rounded-full text-[10px] font-black uppercase tracking-wider">
                Aktivitas Murid
              </span>
            </div>

            <div className="space-y-3 text-xs">
              {modul.lampiran.lkpd.aktivitas.map((a, i) => (
                <div key={i} className="p-4 bg-white/10 rounded-xl border border-white/10">
                  <p className="font-black text-amber-300 mb-1">{a.langkah}</p>
                  <p className="text-indigo-100 font-medium leading-relaxed">{a.instruksi}</p>
                </div>
              ))}
            </div>

            <div className="p-3 bg-white text-indigo-900 rounded-xl font-bold text-xs">
              🎯 Tugas Akhir: {modul.lampiran.lkpd.tugasKelompokOrIndividu}
            </div>
          </div>

          {/* Glosarium & Pustaka */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <p className="font-bold text-slate-900">Glosarium:</p>
              <ul className="space-y-1 text-slate-600 font-medium">
                {modul.lampiran.glosarium.map((g, i) => (
                  <li key={i}>
                    <span className="font-bold text-slate-800">{g.istilah}:</span> {g.arti}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <p className="font-bold text-slate-900">Daftar Pustaka:</p>
              <ul className="space-y-1 text-slate-600 font-medium list-disc list-inside">
                {modul.lampiran.daftarPustaka.map((dp, i) => (
                  <li key={i}>{dp}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

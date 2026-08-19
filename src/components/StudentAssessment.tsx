import React, { useState } from 'react';
import { 
  BarChart3, 
  Sparkles, 
  CloudUpload, 
  ExternalLink, 
  UserPlus, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  FileSpreadsheet, 
  Layers, 
  Download, 
  RotateCcw, 
  TrendingUp, 
  BrainCircuit, 
  Award 
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { AssessmentProject, NilaiSiswaRow, SiswaData, StatusCapaianKKTP } from '../types';
import { SAMPLE_ASSESSMENT_PROJECT } from '../data/sampleModulData';
import { createOrSyncStudentSpreadsheet } from '../services/googleSheetsService';
import { apiAnalyzeAssessment } from '../services/geminiService';
import { ConfirmModal } from './ConfirmModal';

interface StudentAssessmentProps {
  hasGoogleToken: boolean;
  onRequireLogin: () => void;
}

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444'];

export const StudentAssessment: React.FC<StudentAssessmentProps> = ({
  hasGoogleToken,
  onRequireLogin,
}) => {
  const [project, setProject] = useState<AssessmentProject>(SAMPLE_ASSESSMENT_PROJECT);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [spreadsheetUrl, setSpreadsheetUrl] = useState<string | null>(null);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<any | null>(null);

  // New Student Modal / Form state
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [newNama, setNewNama] = useState('');
  const [newNisn, setNewNisn] = useState('');
  const [newGender, setNewGender] = useState<'L' | 'P'>('L');
  const [newGaya, setNewGaya] = useState<'Visual' | 'Auditori' | 'Kinestetik'>('Visual');

  // Delete Confirm Modal
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Quick Notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  // Recalculate average and KKTP status
  const calculateStudentScore = (nilaiPerTP: { tujuanPembelajaranId: string; nilaiFormatif: number; nilaiSumatif: number }[]): { rataRata: number; status: StatusCapaianKKTP } => {
    if (nilaiPerTP.length === 0) return { rataRata: 0, status: 'Belum Mencapai KKTP' };
    const sum = nilaiPerTP.reduce((acc, curr) => acc + (curr.nilaiFormatif + curr.nilaiSumatif) / 2, 0);
    const avg = Math.round(sum / nilaiPerTP.length);

    let status: StatusCapaianKKTP = 'Belum Mencapai KKTP';
    if (avg >= 90) status = 'Tercapai Sangat Baik';
    else if (avg >= 80) status = 'Tercapai (Optimal)';
    else if (avg >= project.kkmKktp) status = 'Tercapai Bersyarat';
    else status = 'Belum Mencapai KKTP';

    return { rataRata: avg, status };
  };

  const handleScoreChange = (siswaId: string, tpId: string, field: 'nilaiFormatif' | 'nilaiSumatif', val: number) => {
    const safeVal = Math.min(100, Math.max(0, val || 0));

    setProject(prev => {
      const updatedRekap = prev.rekapNilai.map(r => {
        if (r.siswaId !== siswaId) return r;

        const updatedTP = r.nilaiPerTP.map(tp => {
          if (tp.tujuanPembelajaranId !== tpId) return tp;
          return { ...tp, [field]: safeVal };
        });

        const { rataRata, status } = calculateStudentScore(updatedTP);
        return {
          ...r,
          nilaiPerTP: updatedTP,
          nilaiRataRata: rataRata,
          statusAkhir: status
        };
      });

      return { ...prev, rekapNilai: updatedRekap, lastSyncedAt: new Date().toISOString() };
    });
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNama.trim()) return;

    const newId = 's-' + Date.now();
    const newStudentObj: SiswaData = {
      id: newId,
      nama: newNama,
      nisn: newNisn || '00' + Math.floor(10000000 + Math.random() * 90000000),
      gender: newGender,
      gayaBelajar: newGaya
    };

    const initialTPScores = project.daftarTP.map(tp => ({
      tujuanPembelajaranId: tp.id,
      nilaiFormatif: 75,
      nilaiSumatif: 75
    }));

    const { rataRata, status } = calculateStudentScore(initialTPScores);

    const newRekapRow: NilaiSiswaRow = {
      siswaId: newId,
      namaSiswa: newNama,
      gender: newGender,
      nilaiPerTP: initialTPScores,
      nilaiRataRata: rataRata,
      statusAkhir: status,
      catatanDeskripsiRapor: `Menunjukkan penguasaan yang baik dalam capaian pembelajaran ${project.mataPelajaran}.`
    };

    setProject(prev => ({
      ...prev,
      daftarSiswa: [...prev.daftarSiswa, newStudentObj],
      rekapNilai: [...prev.rekapNilai, newRekapRow]
    }));

    setShowAddStudent(false);
    setNewNama('');
    setNewNisn('');
    showToast(`Data siswa ${newNama} berhasil ditambahkan.`);
  };

  const handleDeleteStudent = () => {
    if (!deleteTargetId) return;

    setProject(prev => ({
      ...prev,
      daftarSiswa: prev.daftarSiswa.filter(s => s.id !== deleteTargetId),
      rekapNilai: prev.rekapNilai.filter(r => r.siswaId !== deleteTargetId)
    }));

    setDeleteTargetId(null);
    showToast('Data siswa berhasil dihapus.');
  };

  const handleSyncToSheets = async () => {
    if (!hasGoogleToken) {
      onRequireLogin();
      return;
    }

    setIsSyncing(true);
    try {
      const result = await createOrSyncStudentSpreadsheet(project);
      setProject(prev => ({
        ...prev,
        googleSpreadsheetId: result.spreadsheetId,
        googleSpreadsheetUrl: result.spreadsheetUrl,
        lastSyncedAt: new Date().toISOString()
      }));
      setSpreadsheetUrl(result.spreadsheetUrl);
      showToast('Buku Nilai berhasil disinkronkan ke Google Sheets!');
    } catch (err: any) {
      console.error(err);
      alert('Gagal menyinkronkan ke Google Sheets: ' + err.message);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleRunAiAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const result = await apiAnalyzeAssessment(project);
      setAiAnalysisResult(result);

      if (result.analisisPerSiswa && Array.isArray(result.analisisPerSiswa)) {
        setProject(prev => {
          const updatedRekap = prev.rekapNilai.map(r => {
            const match = result.analisisPerSiswa.find((item: any) => item.namaSiswa === r.namaSiswa || item.siswaId === r.siswaId);
            if (match && match.deskripsiRaporOtomatis) {
              return { ...r, catatanDeskripsiRapor: match.deskripsiRaporOtomatis };
            }
            return r;
          });
          return { ...prev, rekapNilai: updatedRekap };
        });
      }

      showToast('Analisis diagnostik & narasi rapor otomatis selesai dibuat oleh AI!');
    } catch (err: any) {
      console.error(err);
      alert('Gagal menganalisis data penilaian: ' + err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Prepare chart data
  const tpChartData = project.daftarTP.map(tp => {
    const scores = project.rekapNilai.map(r => {
      const found = r.nilaiPerTP.find(n => n.tujuanPembelajaranId === tp.id);
      return found ? (found.nilaiFormatif + found.nilaiSumatif) / 2 : 0;
    });
    const avg = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    return {
      name: tp.kode,
      fullTitle: tp.deskripsi,
      RataRata: avg,
      TargetKKTP: project.kkmKktp
    };
  });

  const pieData = [
    { name: 'Sangat Baik (≥90)', value: project.rekapNilai.filter(r => r.nilaiRataRata >= 90).length },
    { name: 'Optimal (80-89)', value: project.rekapNilai.filter(r => r.nilaiRataRata >= 80 && r.nilaiRataRata < 90).length },
    { name: 'Bersyarat (75-79)', value: project.rekapNilai.filter(r => r.nilaiRataRata >= project.kkmKktp && r.nilaiRataRata < 80).length },
    { name: 'Perlu Bimbingan (<75)', value: project.rekapNilai.filter(r => r.nilaiRataRata < project.kkmKktp).length },
  ].filter(d => d.value > 0);

  const averageClassScore = project.rekapNilai.length > 0 
    ? Math.round(project.rekapNilai.reduce((a, b) => a + b.nilaiRataRata, 0) / project.rekapNilai.length) 
    : 0;

  const tuntasCount = project.rekapNilai.filter(r => r.nilaiRataRata >= project.kkmKktp).length;
  const tuntasPercent = project.rekapNilai.length > 0 ? Math.round((tuntasCount / project.rekapNilai.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3.5 bg-slate-900 text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-xl">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={!!deleteTargetId}
        title="Hapus Data Siswa"
        message="Apakah Anda yakin ingin menghapus data siswa ini dari tabel penilaian? Tindakan ini tidak dapat dibatalkan."
        confirmLabel="Hapus Data"
        isDestructive={true}
        onConfirm={handleDeleteStudent}
        onCancel={() => setDeleteTargetId(null)}
      />

      {/* Header Banner: Bold Typography */}
      <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest border border-emerald-200">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Buku Nilai & Asesmen Kurikulum Merdeka</span>
            </div>
            <h2 className="text-3xl font-black tracking-tighter text-slate-900">
              Analitik <span className="text-indigo-600">Siswa</span> Real-Time
            </h2>
            <p className="text-xs text-slate-400 font-medium max-w-2xl">
              Pencatatan asesmen formatif & sumatif terintegrasi KKTP, sinkronisasi Google Sheets, dan auto-generate narasi rapor Kurikulum Merdeka.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Sync to Google Sheets Button */}
            <button
              id="btn-sync-sheets"
              onClick={handleSyncToSheets}
              disabled={isSyncing}
              className="flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-xs transition-all disabled:opacity-50"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>{isSyncing ? 'Sinkron...' : 'Simpan ke Sheet'}</span>
            </button>

            {spreadsheetUrl && (
              <a
                id="link-open-gsheet"
                href={spreadsheetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-bold rounded-xl transition-colors border border-slate-200"
              >
                <span>Buka Sheet</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            {/* AI Analysis Button */}
            <button
              id="btn-ai-analyze"
              onClick={handleRunAiAnalysis}
              disabled={isAnalyzing}
              className="flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-xs transition-all disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{isAnalyzing ? 'Menganalisis...' : 'Analisis AI & Draf Rapor'}</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid: Bold Typography Metric Block */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-100">
          <div className="p-5 rounded-2xl bg-indigo-50">
            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Siswa Aktif</p>
            <p className="text-3xl font-black text-indigo-700 mt-1">{project.daftarSiswa.length}</p>
          </div>
          <div className="p-5 rounded-2xl bg-emerald-50">
            <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Skor Rata2</p>
            <p className="text-3xl font-black text-emerald-700 mt-1">{averageClassScore}</p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ketuntasan KKTP</p>
            <p className="text-3xl font-black text-slate-900 mt-1">{tuntasPercent}%</p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Standar KKTP</p>
            <p className="text-3xl font-black text-slate-900 mt-1">{project.kkmKktp}</p>
          </div>
        </div>
      </div>

      {/* Analytics Visualizer Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Bar Chart: Capaian TP */}
        <div className="lg:col-span-8 bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-black text-base tracking-tight text-slate-900">Distribusi Capaian per Tujuan Pembelajaran (TP)</h3>
              <p className="text-xs text-slate-400 font-medium">Perbandingan rata-rata kelas terhadap batas interval KKTP</p>
            </div>
            <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              {project.mataPelajaran}
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tpChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B', fontWeight: 'bold' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748B', fontWeight: 'bold' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', color: '#FFF', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}
                  formatter={(val: any) => [`${val} Poin`, '']}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px', fontWeight: 'bold' }} />
                <Bar dataKey="RataRata" fill="#4F46E5" radius={[8, 8, 0, 0]} name="Rata-rata Siswa" />
                <Bar dataKey="TargetKKTP" fill="#CBD5E1" radius={[8, 8, 0, 0]} name="KKTP Minimum" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Status Breakdown */}
        <div className="lg:col-span-4 bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm">
          <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Ketuntasan Belajar</h4>
          <div className="flex items-baseline justify-between mb-4">
            <span className="text-4xl font-black tracking-tighter">{tuntasPercent}%</span>
            <span className="text-xs font-bold text-slate-400">{tuntasCount} dari {project.rekapNilai.length} Siswa</span>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px', fontWeight: 'bold' }} />
                <Legend wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI Diagnostic Result Box (If analyzed) */}
      {aiAnalysisResult && (
        <div className="bg-indigo-600 rounded-[32px] p-8 text-white relative overflow-hidden shadow-md space-y-6 animate-in fade-in duration-300">
          <div className="relative z-10 flex items-center justify-between border-b border-white/20 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-white text-indigo-600 font-black">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-lg">Hasil Analisis Diagnostik & Rekomendasi AI</h3>
                <p className="text-xs text-indigo-200 font-medium">Berdasarkan prinsip evaluasi & diferensiasi Kurikulum Merdeka</p>
              </div>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">
              Gemini AI
            </span>
          </div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-200 block">TP Paling Dikuasai:</span>
              <p className="text-xs font-bold text-amber-300 mt-1">{aiAnalysisResult.ringkasanStatistik?.tpTertinggi || 'TP.4.1 (Identifikasi Siklus)'}</p>
            </div>
            <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-200 block">TP Butuh Intervensi:</span>
              <p className="text-xs font-bold text-rose-300 mt-1">{aiAnalysisResult.ringkasanStatistik?.tpTerendah || 'TP.4.3 (Rancangan Pelestarian)'}</p>
            </div>
            <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-200 block">Kesiapan Belajar:</span>
              <p className="text-xs font-bold text-white mt-1">
                {aiAnalysisResult.ringkasanStatistik?.jumlahPengayaan || 2} Pengayaan • {aiAnalysisResult.ringkasanStatistik?.jumlahPerluRemedial || 1} Remedial
              </p>
            </div>
          </div>

          {/* Rekomendasi Guru */}
          {aiAnalysisResult.rekomendasiGuru && (
            <div className="relative z-10 p-5 bg-white/10 rounded-2xl space-y-2 text-xs">
              <span className="font-black text-amber-300 uppercase tracking-wider text-[10px] block">
                Strategi Tindak Lanjut Guru:
              </span>
              <ul className="list-disc list-inside space-y-1 text-indigo-100 font-medium">
                {aiAnalysisResult.rekomendasiGuru.map((rec: string, idx: number) => (
                  <li key={idx}>{rec}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="absolute -right-4 -bottom-4 w-28 h-28 bg-white/10 rounded-full blur-2xl" />
        </div>
      )}

      {/* Gradebook Table */}
      <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-black text-lg text-slate-900 tracking-tight">Tabel Penilaian Formatif & Sumatif</h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Edit nilai per TP untuk memperbarui otomatis status KKTP dan narasi rapor
            </p>
          </div>

          <button
            id="btn-open-add-student"
            onClick={() => setShowAddStudent(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-xs transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Tambah Siswa</span>
          </button>
        </div>

        {/* Add Student Form */}
        {showAddStudent && (
          <div className="p-6 bg-slate-50 border-b border-slate-200 animate-in fade-in">
            <form onSubmit={handleAddStudent} className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-end">
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">Nama Lengkap Siswa</label>
                <input
                  type="text"
                  required
                  value={newNama}
                  onChange={e => setNewNama(e.target.value)}
                  placeholder="Contoh: Muhammad Farhan"
                  className="w-full px-3 py-2 text-xs font-bold bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">NISN (Opsional)</label>
                <input
                  type="text"
                  value={newNisn}
                  onChange={e => setNewNisn(e.target.value)}
                  placeholder="0081234567"
                  className="w-full px-3 py-2 text-xs font-bold bg-white border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">Gaya Belajar</label>
                <select
                  value={newGaya}
                  onChange={e => setNewGaya(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs font-bold bg-white border border-slate-200 rounded-xl"
                >
                  <option value="Visual">Visual</option>
                  <option value="Auditori">Auditori</option>
                  <option value="Kinestetik">Kinestetik</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-wider rounded-xl"
                >
                  Simpan
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddStudent(false)}
                  className="px-4 py-2.5 bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Main Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white">
                <th className="p-4 font-black w-12 text-center">No</th>
                <th className="p-4 font-black min-w-[180px]">Nama Lengkap Siswa</th>
                <th className="p-4 font-bold text-center w-12">L/P</th>
                <th className="p-4 font-bold text-center w-24">Gaya</th>

                {/* TP Columns */}
                {project.daftarTP.map(tp => (
                  <th key={tp.id} className="p-4 font-black border-l border-slate-800 text-center" colSpan={2}>
                    <span className="block text-indigo-300">{tp.kode}</span>
                    <span className="text-[10px] font-medium text-slate-300 line-clamp-1 max-w-[140px] mx-auto">
                      {tp.deskripsi}
                    </span>
                    <div className="grid grid-cols-2 gap-1 mt-1 text-[9px] text-slate-300 font-bold border-t border-slate-800 pt-1">
                      <span>Fmt</span>
                      <span>Sum</span>
                    </div>
                  </th>
                ))}

                <th className="p-4 font-black text-center border-l border-slate-800 w-20">Rata-2</th>
                <th className="p-4 font-black border-l border-slate-800 min-w-[150px]">Status KKTP</th>
                <th className="p-4 font-black border-l border-slate-800 min-w-[240px]">Deskripsi Rapor Kurikulum Merdeka</th>
                <th className="p-4 font-black text-center w-12">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {project.rekapNilai.map((row, idx) => {
                const sInfo = project.daftarSiswa.find(s => s.id === row.siswaId);
                return (
                  <tr key={row.siswaId} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 text-center text-slate-400 font-bold">{idx + 1}</td>
                    <td className="p-4 font-black text-slate-900">
                      <span>{row.namaSiswa}</span>
                      <span className="block text-[10px] font-semibold text-slate-400">NISN: {sInfo?.nisn || '-'}</span>
                    </td>
                    <td className="p-4 text-center text-slate-600 font-bold">{row.gender}</td>
                    <td className="p-4 text-center">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                        {sInfo?.gayaBelajar || 'Visual'}
                      </span>
                    </td>

                    {/* TP Formatif & Sumatif Inputs */}
                    {project.daftarTP.map(tp => {
                      const tpScore = row.nilaiPerTP.find(n => n.tujuanPembelajaranId === tp.id);
                      return (
                        <React.Fragment key={tp.id}>
                          <td className="p-2.5 border-l border-slate-100 text-center w-14">
                            <input
                              type="number"
                              min={0}
                              max={100}
                              value={tpScore ? tpScore.nilaiFormatif : ''}
                              onChange={e => handleScoreChange(row.siswaId, tp.id, 'nilaiFormatif', Number(e.target.value))}
                              className="w-12 text-center py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-600 font-bold"
                            />
                          </td>
                          <td className="p-2.5 text-center w-14">
                            <input
                              type="number"
                              min={0}
                              max={100}
                              value={tpScore ? tpScore.nilaiSumatif : ''}
                              onChange={e => handleScoreChange(row.siswaId, tp.id, 'nilaiSumatif', Number(e.target.value))}
                              className="w-12 text-center py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-600 font-bold bg-slate-50"
                            />
                          </td>
                        </React.Fragment>
                      );
                    })}

                    {/* Average */}
                    <td className="p-4 text-center font-black border-l border-slate-100">
                      <span className={`px-2.5 py-1 rounded-xl text-xs font-black ${
                        row.nilaiRataRata >= 90
                          ? 'bg-emerald-100 text-emerald-800'
                          : row.nilaiRataRata >= project.kkmKktp
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {row.nilaiRataRata}
                      </span>
                    </td>

                    {/* KKTP Status */}
                    <td className="p-4 border-l border-slate-100">
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        row.statusAkhir === 'Tercapai Sangat Baik'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : row.statusAkhir === 'Tercapai (Optimal)'
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          : row.statusAkhir === 'Tercapai Bersyarat'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {row.statusAkhir}
                      </span>
                    </td>

                    {/* Catatan Deskripsi Rapor */}
                    <td className="p-4 border-l border-slate-100 text-[11px] text-slate-700">
                      <textarea
                        rows={2}
                        value={row.catatanDeskripsiRapor}
                        onChange={e => {
                          const val = e.target.value;
                          setProject(prev => ({
                            ...prev,
                            rekapNilai: prev.rekapNilai.map(r => r.siswaId === row.siswaId ? { ...r, catatanDeskripsiRapor: val } : r)
                          }));
                        }}
                        className="w-full p-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-600"
                      />
                    </td>

                    {/* Delete action */}
                    <td className="p-4 text-center">
                      <button
                        onClick={() => setDeleteTargetId(row.siswaId)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                        title="Hapus Siswa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

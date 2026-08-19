import React, { useState, useEffect } from 'react';
import { 
  HardDrive, 
  FileText, 
  FileSpreadsheet, 
  FileCode, 
  ExternalLink, 
  Trash2, 
  Download, 
  RefreshCw, 
  CheckCircle2, 
  Folder, 
  Cloud, 
  AlertCircle, 
  FolderOpen 
} from 'lucide-react';
import { GoogleDriveFileInfo, ModulAjar } from '../types';
import { listAppFiles, deleteDriveFile, loadModulFromDrive } from '../services/googleDriveService';
import { ConfirmModal } from './ConfirmModal';

interface GoogleDriveManagerProps {
  hasGoogleToken: boolean;
  onRequireLogin: () => void;
  onLoadModul: (modul: ModulAjar) => void;
}

export const GoogleDriveManager: React.FC<GoogleDriveManagerProps> = ({
  hasGoogleToken,
  onRequireLogin,
  onLoadModul,
}) => {
  const [files, setFiles] = useState<GoogleDriveFileInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteTargetFile, setDeleteTargetFile] = useState<GoogleDriveFileInfo | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'modul' | 'docs' | 'sheets'>('all');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  const fetchFiles = async () => {
    if (!hasGoogleToken) return;
    setIsLoading(true);
    try {
      const data = await listAppFiles();
      setFiles(data);
    } catch (err: any) {
      console.error(err);
      showToast('Gagal memuat daftar file dari Google Drive');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (hasGoogleToken) {
      fetchFiles();
    }
  }, [hasGoogleToken]);

  const handleDelete = async () => {
    if (!deleteTargetFile) return;

    try {
      await deleteDriveFile(deleteTargetFile.id);
      setFiles(prev => prev.filter(f => f.id !== deleteTargetFile.id));
      showToast(`File ${deleteTargetFile.name} berhasil dihapus dari Google Drive`);
    } catch (err: any) {
      console.error(err);
      alert('Gagal menghapus file: ' + err.message);
    } finally {
      setDeleteTargetFile(null);
    }
  };

  const handleOpenModul = async (file: GoogleDriveFileInfo) => {
    try {
      showToast('Mengunduh modul dari Google Drive...');
      const loaded = await loadModulFromDrive(file.id);
      onLoadModul(loaded);
      showToast('Modul Ajar berhasil dimuat ke editor!');
    } catch (err: any) {
      console.error(err);
      alert('Gagal memuat modul: ' + err.message);
    }
  };

  const filteredFiles = files.filter(f => {
    if (filterType === 'all') return true;
    if (filterType === 'modul') return f.name.endsWith('.json');
    if (filterType === 'docs') return f.mimeType.includes('document') || f.name.endsWith('.docx');
    if (filterType === 'sheets') return f.mimeType.includes('spreadsheet') || f.name.endsWith('.csv');
    return true;
  });

  return (
    <div className="space-y-6">
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3.5 bg-slate-900 text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-xl">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTargetFile}
        title="Hapus File dari Google Drive"
        message={`Apakah Anda yakin ingin menghapus permanen "${deleteTargetFile?.name}" dari Google Drive Anda?`}
        confirmLabel="Hapus Permanen"
        isDestructive={true}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTargetFile(null)}
      />

      {/* Header Banner: Bold Typography */}
      <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase tracking-widest border border-indigo-200">
              <HardDrive className="w-3.5 h-3.5" />
              <span>Google Drive & Sheets Storage</span>
            </div>
            <h2 className="text-3xl font-black tracking-tighter text-slate-900">
              Database <span className="text-indigo-600">Cloud</span> Pribadi
            </h2>
            <p className="text-xs text-slate-400 font-medium max-w-2xl">
              Seluruh Modul Ajar JSON, berkas Google Docs, dan buku nilai Google Sheets disimpan otomatis pada folder <strong>"AI Modul Ajar - Kurikulum Merdeka"</strong> di Google Drive Anda.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {hasGoogleToken ? (
              <button
                id="btn-refresh-drive"
                onClick={fetchFiles}
                disabled={isLoading}
                className="flex items-center gap-2 px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Segarkan Berkas</span>
              </button>
            ) : (
              <button
                onClick={onRequireLogin}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-xs transition-all"
              >
                <Cloud className="w-4 h-4" />
                <span>Hubungkan Google Drive</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {!hasGoogleToken ? (
        /* Not Logged In CTA */
        <div className="bg-indigo-600 rounded-[32px] p-10 text-center text-white space-y-4 shadow-md relative overflow-hidden">
          <div className="relative z-10 w-16 h-16 rounded-2xl bg-white text-indigo-600 flex items-center justify-center mx-auto shadow-lg">
            <HardDrive className="w-8 h-8" />
          </div>
          <div className="relative z-10 max-w-md mx-auto space-y-1">
            <h3 className="text-xl font-black tracking-tight">Otentikasi Google Drive & Sheets</h3>
            <p className="text-xs text-indigo-100 font-medium leading-relaxed">
              Hubungkan akun Google Anda untuk mengaktifkan penyimpanan cloud otomatis, ekspor Google Docs instan, dan sinkronisasi buku nilai Google Sheets.
            </p>
          </div>
          <button
            onClick={onRequireLogin}
            className="relative z-10 inline-flex items-center gap-2 px-8 py-3.5 bg-white text-indigo-600 font-black text-xs uppercase tracking-widest rounded-xl shadow-md transition-all hover:bg-indigo-50"
          >
            <Cloud className="w-4 h-4" />
            <span>Masuk dengan Akun Google</span>
          </button>
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        </div>
      ) : (
        /* File Explorer */
        <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
          {/* Filter Bar */}
          <div className="p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <FolderOpen className="w-5 h-5 text-amber-500" />
              <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                Folder: <span className="text-indigo-600">AI Modul Ajar - Kurikulum Merdeka</span>
              </span>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              {[
                { id: 'all', label: 'Semua Berkas' },
                { id: 'modul', label: 'Modul JSON' },
                { id: 'docs', label: 'Google Docs' },
                { id: 'sheets', label: 'Google Sheets' },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilterType(f.id as any)}
                  className={`px-3.5 py-1.5 text-xs font-black uppercase tracking-wider rounded-lg transition-all ${
                    filterType === f.id ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* List of Files */}
          {isLoading ? (
            <div className="p-16 text-center text-slate-500 space-y-3">
              <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-bold uppercase tracking-wider">Memuat berkas dari Google Drive...</p>
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="p-16 text-center text-slate-500 space-y-2">
              <Folder className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-base font-black text-slate-900">Belum ada berkas tersimpan</p>
              <p className="text-xs text-slate-400 font-medium max-w-sm mx-auto">
                Buat modul ajar baru di RPP Generator lalu klik "Simpan ke Drive" atau sinkronkan buku nilai ke Google Sheets.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredFiles.map(file => {
                const isSheet = file.mimeType.includes('spreadsheet') || file.name.includes('Penilaian');
                const isDoc = file.mimeType.includes('document') || file.name.endsWith('.docx');
                const isJson = file.name.endsWith('.json');

                return (
                  <div
                    key={file.id}
                    className="p-5 hover:bg-slate-50 transition-colors flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className={`p-3 rounded-2xl shrink-0 ${
                        isSheet
                          ? 'bg-emerald-100 text-emerald-700'
                          : isDoc
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-purple-100 text-purple-700'
                      }`}>
                        {isSheet ? (
                          <FileSpreadsheet className="w-5 h-5" />
                        ) : isDoc ? (
                          <FileText className="w-5 h-5" />
                        ) : (
                          <FileCode className="w-5 h-5" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <h4 className="text-xs font-black text-slate-900 truncate">{file.name}</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                          Diperbarui: {new Date(file.modifiedTime).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isJson && (
                        <button
                          onClick={() => handleOpenModul(file)}
                          className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-black uppercase tracking-wider rounded-xl border border-indigo-200 transition-colors"
                        >
                          Buka di Editor
                        </button>
                      )}

                      {file.webViewLink && (
                        <a
                          href={file.webViewLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-bold rounded-xl transition-colors border border-slate-200"
                        >
                          <span>Buka Google</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}

                      <button
                        onClick={() => setDeleteTargetFile(file)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                        title="Hapus dari Google Drive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { Navbar } from './components/Navbar';
import { ModulGenerator } from './components/ModulGenerator';
import { ModulViewer } from './components/ModulViewer';
import { QuestionBank } from './components/QuestionBank';
import { StudentAssessment } from './components/StudentAssessment';
import { GoogleDriveManager } from './components/GoogleDriveManager';
import { ModulAjar } from './types';
import { SAMPLE_MODUL_AJAR } from './data/sampleModulData';
import { googleSignIn, initAuth, logout } from './services/firebase';
import { 
  FileText, 
  Sparkles, 
  HelpCircle, 
  BarChart3, 
  HardDrive, 
  PenTool, 
  Eye, 
  PlusCircle, 
  RotateCcw,
  CheckCircle2
} from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<'modul' | 'quiz' | 'assessment' | 'drive'>('modul');
  const [currentModul, setCurrentModul] = useState<ModulAjar>(SAMPLE_MODUL_AJAR);
  const [modulSubView, setModulSubView] = useState<'form' | 'preview'>('preview');

  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [hasGoogleToken, setHasGoogleToken] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    const unsubscribe = initAuth(
      (authUser, token) => {
        setUser(authUser);
        setHasGoogleToken(!!token);
      },
      () => {
        setUser(null);
        setHasGoogleToken(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setHasGoogleToken(true);
      }
    } catch (err: any) {
      if (
        err?.code !== 'auth/cancelled-popup-request' &&
        err?.code !== 'auth/popup-closed-by-user'
      ) {
        console.error('Login failed:', err);
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setHasGoogleToken(false);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleModulGenerated = (newModul: ModulAjar) => {
    setCurrentModul(newModul);
    setModulSubView('preview');
  };

  const handleLoadSample = () => {
    setCurrentModul(SAMPLE_MODUL_AJAR);
    setModulSubView('preview');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        hasGoogleToken={hasGoogleToken}
        isLoggingIn={isLoggingIn}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Tab 1: Modul Ajar (RPP) */}
        {activeTab === 'modul' && (
          <div className="space-y-6">
            {/* Sub-view toggle bar: Bold Typography */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white p-3 rounded-[24px] border border-slate-200 shadow-2xs gap-3">
              <div className="flex items-center gap-1.5">
                <button
                  id="btn-subview-preview"
                  onClick={() => setModulSubView('preview')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                    modulSubView === 'preview'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Tinjauan Dokumen RPP</span>
                </button>

                <button
                  id="btn-subview-form"
                  onClick={() => setModulSubView('form')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                    modulSubView === 'form'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Susun RPP Baru</span>
                </button>
              </div>

              <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 font-bold px-3">
                <span className="text-[10px] uppercase tracking-wider">Modul Aktif:</span>
                <strong className="text-slate-800 truncate max-w-[240px] font-black">{currentModul.judul}</strong>
              </div>
            </div>

            {modulSubView === 'form' ? (
              <ModulGenerator
                onModulGenerated={handleModulGenerated}
                onLoadSample={handleLoadSample}
              />
            ) : (
              <ModulViewer
                modul={currentModul}
                onUpdateModul={setCurrentModul}
                hasGoogleToken={hasGoogleToken}
                onRequireLogin={handleLogin}
              />
            )}
          </div>
        )}

        {/* Tab 2: Bank Soal Interaktif */}
        {activeTab === 'quiz' && (
          <QuestionBank
            currentMapel={currentModul.identitas.mataPelajaran}
            currentFase={currentModul.identitas.fase}
            currentKelas={currentModul.identitas.kelas}
            currentTopik={currentModul.judul}
          />
        )}

        {/* Tab 3: Penilaian & Analitik Siswa */}
        {activeTab === 'assessment' && (
          <StudentAssessment
            hasGoogleToken={hasGoogleToken}
            onRequireLogin={handleLogin}
          />
        )}

        {/* Tab 4: Database Google Drive & Google Sheets */}
        {activeTab === 'drive' && (
          <GoogleDriveManager
            hasGoogleToken={hasGoogleToken}
            onRequireLogin={handleLogin}
            onLoadModul={(m) => {
              setCurrentModul(m);
              setActiveTab('modul');
              setModulSubView('preview');
            }}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-bold text-slate-700">
            MODUL<span className="text-indigo-600">.AI</span> • Kurikulum Merdeka Edition Kemendikbudristek RI
          </p>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Penyimpanan Otomatis Google Drive & Sheets
          </p>
        </div>
      </footer>
    </div>
  );
}
export default App;

import React from 'react';
import { 
  BookOpen, 
  HelpCircle, 
  BarChart3, 
  HardDrive, 
  Sparkles, 
  LogOut, 
  CheckCircle2, 
  Cloud,
  FileText
} from 'lucide-react';
import { User } from 'firebase/auth';

interface NavbarProps {
  activeTab: 'modul' | 'quiz' | 'assessment' | 'drive';
  setActiveTab: (tab: 'modul' | 'quiz' | 'assessment' | 'drive') => void;
  user: User | null;
  hasGoogleToken: boolean;
  isLoggingIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  user,
  hasGoogleToken,
  isLoggingIn,
  onLogin,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo & Brand: Bold Typography */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tighter text-indigo-600 leading-none">
                  MODUL<span className="text-slate-400">.AI</span>
                </h1>
                <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-700">
                  Guru Penggerak
                </span>
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">
                Kurikulum Merdeka Edition
              </p>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200">
            <button
              id="nav-tab-modul"
              onClick={() => setActiveTab('modul')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-black transition-all ${
                activeTab === 'modul'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>RPP Generator</span>
            </button>

            <button
              id="nav-tab-quiz"
              onClick={() => setActiveTab('quiz')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-black transition-all ${
                activeTab === 'quiz'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Bank Soal</span>
            </button>

            <button
              id="nav-tab-assessment"
              onClick={() => setActiveTab('assessment')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-black transition-all ${
                activeTab === 'assessment'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Analitik Siswa</span>
            </button>

            <button
              id="nav-tab-drive"
              onClick={() => setActiveTab('drive')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-black transition-all ${
                activeTab === 'drive'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <HardDrive className="w-4 h-4" />
              <span>Drive & Sheets</span>
            </button>
          </nav>

          {/* Right Action: Auth / Workspace Status */}
          <div className="flex items-center gap-3">
            {user && hasGoogleToken ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs shadow-xs">
                  <div className="w-5 h-5 bg-white/20 rounded flex items-center justify-center font-black text-[10px]">
                    GD
                  </div>
                  <div>
                    <p className="font-black text-[11px] leading-tight">Google Drive</p>
                    <p className="opacity-60 text-[9px] font-bold uppercase tracking-wider">Connected</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pl-1 border-l border-slate-200">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'Guru'}
                      className="w-9 h-9 rounded-xl border border-slate-200 object-cover shadow-2xs"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 font-black text-xs flex items-center justify-center">
                      {(user.displayName || user.email || 'G')[0].toUpperCase()}
                    </div>
                  )}
                  <div className="hidden xl:block text-left text-xs leading-tight">
                    <p className="font-black text-slate-900 truncate max-w-[130px]">{user.displayName || 'Ibu Sarah'}</p>
                    <p className="text-slate-400 font-semibold text-[10px] truncate max-w-[130px]">{user.email}</p>
                  </div>
                  <button
                    id="btn-logout-google"
                    onClick={onLogout}
                    title="Keluar / Ganti Akun"
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                id="btn-signin-google"
                onClick={onLogin}
                disabled={isLoggingIn}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-sm transition-all"
              >
                <svg className="w-4 h-4" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
                <span>{isLoggingIn ? 'Menghubungkan...' : 'Hubungkan Google'}</span>
              </button>
            )}
          </div>

        </div>

        {/* Mobile Sub-Navigation */}
        <div className="lg:hidden flex items-center justify-between gap-1 py-2.5 border-t border-slate-100 overflow-x-auto">
          <button
            onClick={() => setActiveTab('modul')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider shrink-0 ${
              activeTab === 'modul' ? 'bg-indigo-600 text-white' : 'text-slate-600 bg-slate-100'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>RPP Gen</span>
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider shrink-0 ${
              activeTab === 'quiz' ? 'bg-indigo-600 text-white' : 'text-slate-600 bg-slate-100'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Bank Soal</span>
          </button>
          <button
            onClick={() => setActiveTab('assessment')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider shrink-0 ${
              activeTab === 'assessment' ? 'bg-indigo-600 text-white' : 'text-slate-600 bg-slate-100'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Analitik</span>
          </button>
          <button
            onClick={() => setActiveTab('drive')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider shrink-0 ${
              activeTab === 'drive' ? 'bg-indigo-600 text-white' : 'text-slate-600 bg-slate-100'
            }`}
          >
            <HardDrive className="w-3.5 h-3.5" />
            <span>Drive</span>
          </button>
        </div>
      </div>
    </header>
  );
};

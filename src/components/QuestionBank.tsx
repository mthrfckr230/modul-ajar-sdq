import React, { useState } from 'react';
import { 
  HelpCircle, 
  Sparkles, 
  CheckCircle, 
  XCircle, 
  Award, 
  Printer, 
  FileDown, 
  Layers, 
  Wand2, 
  RotateCcw, 
  BookOpen, 
  Filter, 
  Check 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BankSoalPaket, SoalItem, TingkatKesulitanSoal, TipeSoal } from '../types';
import { SAMPLE_BANK_SOAL } from '../data/sampleModulData';
import { apiGenerateQuiz } from '../services/geminiService';

interface QuestionBankProps {
  currentMapel: string;
  currentFase: string;
  currentKelas: string;
  currentTopik: string;
}

export const QuestionBank: React.FC<QuestionBankProps> = ({
  currentMapel,
  currentFase,
  currentKelas,
  currentTopik,
}) => {
  const [paketSoal, setPaketSoal] = useState<BankSoalPaket>(SAMPLE_BANK_SOAL);
  const [topikInput, setTopikInput] = useState(currentTopik || 'Siklus Hidup Hewan & Ekosistem');
  const [jumlahSoal, setJumlahSoal] = useState(5);
  const [filterTingkat, setFilterTingkat] = useState<string>('Semua');
  const [isGenerating, setIsGenerating] = useState(false);

  // Interactive Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [activeTabMode, setActiveTabMode] = useState<'interactive' | 'list'>('list');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setShowResults(false);
    setQuizAnswers({});

    try {
      const generated = await apiGenerateQuiz({
        mataPelajaran: currentMapel,
        fase: currentFase,
        kelas: currentKelas,
        topik: topikInput,
        jumlahSoal,
        tipeSoalList: ['Pilihan Ganda', 'Pilihan Ganda Kompleks', 'Uraian (HOTS)', 'Menjodohkan'],
        fokusTingkatKesulitan: 'Seimbang (LOTS 20%, MOTS 40%, HOTS 40%)'
      });
      setPaketSoal(generated);
    } catch (err: any) {
      console.error(err);
      alert('Gagal menyusun bank soal: ' + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnswerSelect = (soalId: string, answerText: string) => {
    if (showResults) return;
    setQuizAnswers(prev => ({ ...prev, [soalId]: answerText }));
  };

  const handleCheckAnswers = () => {
    setShowResults(true);
    let correctCount = 0;
    paketSoal.daftarSoal.forEach(s => {
      if (s.pilihanJawaban && quizAnswers[s.id]) {
        const userChoice = quizAnswers[s.id].trim();
        const key = s.kunciJawaban.toString().trim();
        if (userChoice.startsWith(key[0]) || userChoice === key) {
          correctCount++;
        }
      }
    });

    if (correctCount >= Math.ceil(paketSoal.daftarSoal.length * 0.7)) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const resetQuiz = () => {
    setQuizAnswers({});
    setShowResults(false);
  };

  const filteredSoal = paketSoal.daftarSoal.filter(s => {
    if (filterTingkat === 'Semua') return true;
    if (filterTingkat === 'HOTS') return s.tingkat.includes('HOTS');
    if (filterTingkat === 'MOTS') return s.tingkat.includes('MOTS');
    if (filterTingkat === 'LOTS') return s.tingkat.includes('LOTS');
    if (filterTingkat === 'Pengayaan') return s.target === 'Pengayaan';
    if (filterTingkat === 'Remedial') return s.target === 'Remedial';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner: Bold Typography */}
      <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase tracking-widest border border-indigo-200">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Bank Soal Adaptif Kurikulum Merdeka</span>
            </div>
            <h2 className="text-3xl font-black tracking-tighter text-slate-900">
              Bank Soal <span className="text-indigo-600">Interaktif</span>
            </h2>
            <p className="text-xs text-slate-400 font-medium max-w-2xl">
              Paket soal diferensiasi (LOTS, MOTS, HOTS) dengan stimulus literasi-numerasi, kunci jawaban, dan pembahasan pedagogis terstruktur.
            </p>
          </div>

          {/* Generator Form */}
          <form onSubmit={handleGenerate} className="flex flex-wrap items-center gap-2.5 bg-slate-50 p-2 rounded-2xl border border-slate-200">
            <input
              id="input-quiz-topik"
              type="text"
              value={topikInput}
              onChange={(e) => setTopikInput(e.target.value)}
              className="px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 w-56 font-bold text-slate-900"
              placeholder="Topik Soal..."
              required
            />
            <select
              id="select-quiz-count"
              value={jumlahSoal}
              onChange={(e) => setJumlahSoal(Number(e.target.value))}
              className="px-3 py-2.5 text-xs bg-white border border-slate-200 rounded-xl font-bold text-slate-800"
            >
              <option value={3}>3 Soal</option>
              <option value={5}>5 Soal</option>
              <option value={8}>8 Soal</option>
            </select>
            <button
              id="btn-generate-quiz"
              type="submit"
              disabled={isGenerating}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-xs flex items-center gap-2 disabled:opacity-50 transition-all"
            >
              {isGenerating ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Menyusun...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-3.5 h-3.5 text-amber-300" />
                  <span>Generate Baru</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Control Tabs: Filter & View Mode */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-[28px] border border-slate-200 shadow-xs">
        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTabMode('list')}
            className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all ${
              activeTabMode === 'list' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            📋 Tinjauan Soal
          </button>
          <button
            onClick={() => setActiveTabMode('interactive')}
            className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all ${
              activeTabMode === 'interactive' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            🎯 Mode Kuis Siswa
          </button>
        </div>

        {/* Filter Tingkat */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Filter:
          </span>
          {['Semua', 'HOTS', 'MOTS', 'LOTS', 'Pengayaan', 'Remedial'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterTingkat(t)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors shrink-0 ${
                filterTingkat === t
                  ? 'bg-slate-900 text-white font-black'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Questions Display */}
      {activeTabMode === 'list' ? (
        <div className="space-y-4">
          {filteredSoal.map((soal, idx) => (
            <div key={soal.id} className="bg-white rounded-[28px] border border-slate-200 p-8 shadow-sm space-y-4">
              {/* Top Tags */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-xl bg-slate-900 text-white font-black text-xs flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-black uppercase tracking-wider text-slate-900">{soal.tipe}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${
                    soal.tingkat.includes('HOTS')
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : soal.tingkat.includes('MOTS')
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}>
                    {soal.tingkat}
                  </span>

                  <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${
                    soal.target === 'Pengayaan'
                      ? 'bg-purple-100 text-purple-700'
                      : soal.target === 'Remedial'
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    Target: {soal.target}
                  </span>
                  <span className="text-xs font-bold text-slate-400">{soal.bobotSkor} Poin</span>
                </div>
              </div>

              {/* TP Indicator */}
              <p className="text-xs text-slate-500 font-bold">
                🎯 Capaian TP: <span className="text-slate-700">{soal.tujuanPembelajaran}</span>
              </p>

              {/* Stimulus Context */}
              {soal.stimulus && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-xs text-slate-700 leading-relaxed font-medium">
                  <strong className="block text-slate-900 font-bold mb-1 uppercase tracking-wider text-[10px]">
                    Stimulus / Kasus:
                  </strong>
                  {soal.stimulus}
                </div>
              )}

              {/* Pertanyaan */}
              <p className="text-base font-black text-slate-900 leading-snug">
                {soal.pertanyaan}
              </p>

              {/* Pilihan Jawaban */}
              {soal.pilihanJawaban && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {soal.pilihanJawaban.map((pil, pIdx) => {
                    const isKey = soal.kunciJawaban.toString().startsWith(pil[0]);
                    return (
                      <div
                        key={pIdx}
                        className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between ${
                          isKey
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                            : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <span>{pil}</span>
                        {isKey && <Check className="w-4 h-4 text-emerald-600" />}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Kunci & Pembahasan */}
              <div className="p-4 bg-indigo-50/70 rounded-2xl border border-indigo-100 text-xs space-y-1.5">
                <div className="flex items-center gap-2 font-black text-indigo-950">
                  <span className="uppercase tracking-wider text-[10px]">Kunci Jawaban:</span>
                  <span className="text-indigo-700 bg-white px-2 py-0.5 rounded-lg border border-indigo-200">{soal.kunciJawaban}</span>
                </div>
                <p className="text-slate-700 text-xs leading-relaxed font-medium">
                  <strong className="text-indigo-900 font-bold">Pembahasan:</strong> {soal.pembahasan}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Interactive Quiz Simulation Mode */
        <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-black tracking-tight text-slate-900">Simulasi Asesmen Mandiri Siswa</h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Pilih jawaban untuk menguji pemahaman dan ketuntasan belajar.
              </p>
            </div>
            {showResults && (
              <button
                onClick={resetQuiz}
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black uppercase tracking-wider rounded-xl"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Ulangi Kuis</span>
              </button>
            )}
          </div>

          <div className="space-y-6">
            {paketSoal.daftarSoal.map((soal, idx) => {
              const selectedAns = quizAnswers[soal.id];
              const isAnswered = !!selectedAns;
              const isCorrect = isAnswered && (selectedAns.startsWith(soal.kunciJawaban[0]) || selectedAns === soal.kunciJawaban);

              return (
                <div key={soal.id} className="p-6 bg-slate-50 rounded-[24px] border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-indigo-700">
                      Soal #{idx + 1} ({soal.tingkat})
                    </span>
                    {showResults && (
                      <span className={`text-xs font-bold flex items-center gap-1 px-3 py-1 rounded-full ${
                        isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {isCorrect ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                        {isCorrect ? 'Benar (+10)' : 'Perlu Diperbaiki'}
                      </span>
                    )}
                  </div>

                  {soal.stimulus && (
                    <p className="text-xs text-slate-600 font-medium bg-white p-3.5 rounded-xl border border-slate-200">
                      {soal.stimulus}
                    </p>
                  )}

                  <p className="text-sm font-black text-slate-900 leading-snug">{soal.pertanyaan}</p>

                  {soal.pilihanJawaban ? (
                    <div className="space-y-2 pt-1">
                      {soal.pilihanJawaban.map((pil, pIdx) => {
                        const isSelected = selectedAns === pil;
                        let optionStyle = 'bg-white border-slate-200 text-slate-800 hover:border-indigo-400 font-medium';
                        if (isSelected) optionStyle = 'bg-indigo-50 border-indigo-600 text-indigo-900 font-bold';
                        if (showResults) {
                          if (pil.startsWith(soal.kunciJawaban[0])) optionStyle = 'bg-emerald-100 border-emerald-500 text-emerald-950 font-bold';
                          else if (isSelected && !isCorrect) optionStyle = 'bg-rose-100 border-rose-500 text-rose-950';
                        }

                        return (
                          <button
                            key={pIdx}
                            type="button"
                            onClick={() => handleAnswerSelect(soal.id, pil)}
                            className={`w-full p-3.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${optionStyle}`}
                          >
                            <span>{pil}</span>
                            {isSelected && <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <textarea
                        rows={2}
                        value={selectedAns || ''}
                        onChange={(e) => handleAnswerSelect(soal.id, e.target.value)}
                        placeholder="Tuliskan jawaban Anda..."
                        className="w-full p-3 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 font-medium"
                        disabled={showResults}
                      />
                    </div>
                  )}

                  {showResults && (
                    <div className="p-4 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
                      <p className="font-bold text-slate-800">
                        Kunci: <span className="text-indigo-600 font-black">{soal.kunciJawaban}</span>
                      </p>
                      <p className="text-slate-600 text-[11px] font-medium">{soal.pembahasan}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="border-t border-slate-100 pt-4 flex justify-end">
            {!showResults ? (
              <button
                id="btn-check-answers"
                onClick={handleCheckAnswers}
                className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-md transition-all"
              >
                Periksa Hasil Belajar
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400 font-medium">Kuis Selesai.</span>
                <button
                  onClick={resetQuiz}
                  className="px-5 py-2.5 bg-indigo-600 text-white text-xs font-black uppercase tracking-wider rounded-xl"
                >
                  Coba Lagi
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

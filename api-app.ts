import express from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

export function createApiApp() {
  const app = express();

  app.use(express.json({ limit: '10mb' }));

  // Lazy initialize Gemini client
  const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured in environment variables.');
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  };

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // 1. GENERATE MODUL AJAR (KURIKULUM MERDEKA & FORMAT STANDAR SEKOLAH)
  app.post('/api/gemini/generate-modul', async (req, res) => {
    try {
      const {
        jenjang,
        fase,
        kelas,
        namaKelasSpesifik,
        mataPelajaran,
        elemen,
        topik,
        tujuanPembelajaranBuku,
        alokasiWaktu,
        jumlahPertemuan,
        hariTanggal,
        profilPelajarPancasila,
        modelPembelajaran,
        targetPesertaDidik,
        kebutuhanKhusus,
        namaPenyusun,
        namaSekolah,
        namaYayasan,
        namaWakasekKurikulum,
        tahunAjaran,
        softSkills,
        saranaPrasaranaInput,
        customPromptTambahan,
      } = req.body;

      let tpBukuText = '';
      if (Array.isArray(tujuanPembelajaranBuku) && tujuanPembelajaranBuku.length > 0) {
        tpBukuText = tujuanPembelajaranBuku.filter(Boolean).map((tp: string, i: number) => `${i + 1}. ${tp}`).join('\n');
      } else if (typeof tujuanPembelajaranBuku === 'string' && tujuanPembelajaranBuku.trim()) {
        tpBukuText = tujuanPembelajaranBuku.trim();
      }

      const ai = getGeminiClient();

      const systemPrompt = `Anda adalah Asisten Ahli Kurikulum Merdeka Kemendikbudristek RI dan Konsultan Pedagogi Master Teacher.
Tugas Anda adalah menyusun Modul Ajar (RPP) yang SANGAT LENGKAP, OTENTIK, BERBOBOT TINGGI, BERDIFERENSIASI, MEMUAT ASESMEN KKTP, LEMBAR ASESMEN KEGIATAN MURID, serta LKPD sesuai standar resmi.
Gunakan Bahasa Indonesia yang baku, edukatif, dan inspiratif.

KRUSIAL: Jika guru telah memasukkan Tujuan Pembelajaran (TP) dari buku pegangan guru / buku siswa, Anda WAJIB menggunakan poin-poin TP dari buku tersebut sebagai acuan utama pada "komponenInti.tujuanPembelajaran". Selaraskan Kriteria Ketercapaian TP (KKTP), Pertanyaan Pemantik, Langkah Pembelajaran, dan Indikator Lembar Asesmen secara terpadu dari TP buku tersebut!

Pastikan output adalah JSON valid tanpa markdown backticks (atau JSON terstruktur murni) yang mematuhi format yang diminta.`;

      const userPrompt = `Susunlah Modul Ajar Kurikulum Merdeka Lengkap dengan rincian berikut:
- Nama Yayasan: ${namaYayasan || 'YAYASAN SIROJUL MUKHLASIN'}
- Satuan Pendidikan: ${namaSekolah || 'SDQ AL MAHMUDAH'}
- Nama Guru / Penyusun: ${namaPenyusun || 'Laila Nabilatu Rohmah, S.Pd'}
- Wakasek Kurikulum: ${namaWakasekKurikulum || 'Riana Rizki Abidin, S. S'}
- Tahun Ajaran: ${tahunAjaran || '2026/2027'}
- Jenjang: ${jenjang || 'SD/MI'}
- Fase: ${fase || 'Fase B (Kelas 3-4)'}
- Kelas / Semester: ${kelas || '3/I'}
- Nama Kelas Spesifik: ${namaKelasSpesifik || '3 Zaid bin Tsabit'}
- Hari / Tanggal Pelaksanaan: ${hariTanggal || 'Rabu, 19 Agustus 2026'}
- Mata Pelajaran: ${mataPelajaran}
- Elemen / Domain: ${elemen || 'Sesuai Standar CP'}
- Topik / Materi Pembelajaran: ${topik}
${tpBukuText ? `- TUJUAN PEMBELAJARAN (TP) DARI BUKU PEGANGAN/TEKS:\n${tpBukuText}\n(Gunakan dan cantumkan TP dari buku ini secara persis dan lengkap di komponenInti.tujuanPembelajaran)` : ''}
- Alokasi Waktu: ${alokasiWaktu || '2 JP'}
- Model Pembelajaran: ${modelPembelajaran || 'Praktik / Learning by Doing'}
- Profil Pelajar Pancasila: ${Array.isArray(profilPelajarPancasila) ? profilPelajarPancasila.join(', ') : 'Mandiri, Bernalar Kritis, Kreatif'}
- Sarana dan Prasarana: ${saranaPrasaranaInput || 'komputer, aplikasi paint'}
- Target Peserta Didik: ${targetPesertaDidik || 'Inklusi (Berdiferensiasi)'}
- Soft Skills yang Dibiasakan: ${softSkills || 'tanggung jawab, mandiri, jujur, teliti, percaya diri, kreativitas.'}
- Kebutuhan Khusus / Diferensiasi: ${kebutuhanKhusus || 'Diferensiasi proses, konten, dan produk untuk gaya belajar visual, auditori, kinestetik'}
${customPromptTambahan ? `- Catatan Khusus Guru: ${customPromptTambahan}` : ''}

Format Dokumen Standar:
1. Kop Satuan Pendidikan & Yayasan di bagian atas.
2. Identitas 2 Kolom lengkap.
3. Komponen Inti memuat Capaian Pembelajaran, TP Buku, KKTP, Pemahaman Bermakna, Pertanyaan Pemantik.
4. Langkah Pembelajaran menggunakan simbol baku:
   - Pendahuluan menggunakan tanda checkmark "✓" (Contoh: "✓ Guru memberi salam...", "✓ Guru mengajak berdoa...")
   - Kegiatan Inti menggunakan tanda panah "➢" (Contoh: "➢ Guru mendemonstrasikan...", "➢ Murid mempraktikkan...")
   - Kegiatan Penutup menggunakan tanda kotak hitam "▪" (Contoh: "▪ Guru dan murid menyimpulkan...", "▪ Guru menutup dengan doa...")
5. Lembar Asesmen Kegiatan Murid (dengan 3-4 indikator penilaian konkret berdasarkan TP buku yang dievaluasi).
6. LKPD (Lembar Kerja Peserta Didik) yang menarik dan aplikatif.
7. Asesmen Diagnostik, Formatif, dan Sumatif lengkap dengan rubrik.
8. Lembar Tanda Tangan Pengesahan (WAKASEK Kurikulum & Guru Bidang Studi).`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: userPrompt,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              judul: { type: Type.STRING },
              kopSekolah: {
                type: Type.OBJECT,
                properties: {
                  namaYayasan: { type: Type.STRING },
                  aktaNotaris: { type: Type.STRING },
                  skKemenkumham: { type: Type.STRING },
                  namaSekolah: { type: Type.STRING },
                  alamatLengkap: { type: Type.STRING },
                  kontakInfo: { type: Type.STRING },
                },
                required: ['namaYayasan', 'namaSekolah'],
              },
              identitas: {
                type: Type.OBJECT,
                properties: {
                  namaGuruBidangStudi: { type: Type.STRING },
                  namaPenyusun: { type: Type.STRING },
                  namaSekolah: { type: Type.STRING },
                  satuanPendidikan: { type: Type.STRING },
                  namaWakasekKurikulum: { type: Type.STRING },
                  tahunAjaran: { type: Type.STRING },
                  jenjang: { type: Type.STRING },
                  fase: { type: Type.STRING },
                  kelas: { type: Type.STRING },
                  namaKelasSpesifik: { type: Type.STRING },
                  hariTanggal: { type: Type.STRING },
                  mataPelajaran: { type: Type.STRING },
                  elemen: { type: Type.STRING },
                  alokasiWaktu: { type: Type.STRING },
                  jumlahPertemuan: { type: Type.NUMBER },
                  targetPesertaDidik: { type: Type.STRING },
                  modelPembelajaranTeks: { type: Type.STRING },
                  saranaPrasaranaTeks: { type: Type.STRING },
                  softSkillsTeks: { type: Type.STRING },
                },
                required: ['namaPenyusun', 'mataPelajaran', 'fase', 'kelas', 'alokasiWaktu'],
              },
              komponenAwal: {
                type: Type.OBJECT,
                properties: {
                  kompetensiAwal: { type: Type.ARRAY, items: { type: Type.STRING } },
                  profilPelajarPancasila: { type: Type.ARRAY, items: { type: Type.STRING } },
                  saranaPrasarana: { type: Type.ARRAY, items: { type: Type.STRING } },
                  targetPesertaDidik: { type: Type.STRING },
                  modelPembelajaran: { type: Type.STRING },
                },
                required: ['kompetensiAwal', 'profilPelajarPancasila', 'saranaPrasarana'],
              },
              komponenInti: {
                type: Type.OBJECT,
                properties: {
                  capaianPembelajaran: { type: Type.STRING },
                  tujuanPembelajaran: { type: Type.ARRAY, items: { type: Type.STRING } },
                  kriteriaKetercapaian: { type: Type.ARRAY, items: { type: Type.STRING } },
                  pemahamanBermakna: { type: Type.ARRAY, items: { type: Type.STRING } },
                  pertanyaanPemantik: { type: Type.ARRAY, items: { type: Type.STRING } },
                  persiapanPembelajaran: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ['tujuanPembelajaran', 'kriteriaKetercapaian', 'pemahamanBermakna', 'pertanyaanPemantik'],
              },
              kegiatanPembelajaran: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    pertemuan: { type: Type.NUMBER },
                    topikPertemuan: { type: Type.STRING },
                    alokasiWaktu: { type: Type.STRING },
                    pendahuluan: {
                      type: Type.OBJECT,
                      properties: {
                        kegiatan: { type: Type.ARRAY, items: { type: Type.STRING } },
                        alokasiWaktu: { type: Type.STRING },
                      },
                      required: ['kegiatan', 'alokasiWaktu'],
                    },
                    inti: {
                      type: Type.OBJECT,
                      properties: {
                        kegiatan: { type: Type.ARRAY, items: { type: Type.STRING } },
                        alokasiWaktu: { type: Type.STRING },
                        diferensiasiKonten: { type: Type.STRING },
                        diferensiasiProses: { type: Type.STRING },
                        diferensiasiProduk: { type: Type.STRING },
                      },
                      required: ['kegiatan', 'alokasiWaktu'],
                    },
                    penutup: {
                      type: Type.OBJECT,
                      properties: {
                        kegiatan: { type: Type.ARRAY, items: { type: Type.STRING } },
                        alokasiWaktu: { type: Type.STRING },
                      },
                      required: ['kegiatan', 'alokasiWaktu'],
                    },
                  },
                  required: ['pertemuan', 'topikPertemuan', 'pendahuluan', 'inti', 'penutup'],
                },
              },
              lembarAsesmenKegiatan: {
                type: Type.OBJECT,
                properties: {
                  judulKegiatan: { type: Type.STRING },
                  mataPelajaran: { type: Type.STRING },
                  kelas: { type: Type.STRING },
                  hariTanggal: { type: Type.STRING },
                  indikatorPenilaian: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        kode: { type: Type.STRING },
                        label: { type: Type.STRING },
                        deskripsi: { type: Type.STRING },
                      },
                      required: ['id', 'kode', 'label'],
                    },
                  },
                  daftarSiswa: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        no: { type: Type.NUMBER },
                        nama: { type: Type.STRING },
                        pencapaianIndikator: {
                          type: Type.OBJECT,
                          properties: {
                            ind1: { type: Type.BOOLEAN },
                            ind2: { type: Type.BOOLEAN },
                            ind3: { type: Type.BOOLEAN },
                            ind4: { type: Type.BOOLEAN },
                          },
                        },
                        catatanGuru: { type: Type.STRING },
                        tindakLanjut: { type: Type.STRING },
                      },
                      required: ['no', 'nama', 'pencapaianIndikator'],
                    },
                  },
                },
              },
              asesmen: {
                type: Type.OBJECT,
                properties: {
                  diagnostik: {
                    type: Type.OBJECT,
                    properties: {
                      nonKognitif: { type: Type.ARRAY, items: { type: Type.STRING } },
                      kognitif: { type: Type.ARRAY, items: { type: Type.STRING } },
                    },
                  },
                  formatif: {
                    type: Type.OBJECT,
                    properties: {
                      teknik: { type: Type.ARRAY, items: { type: Type.STRING } },
                      instrumen: { type: Type.ARRAY, items: { type: Type.STRING } },
                      rubrik: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            aspek: { type: Type.STRING },
                            mahir: { type: Type.STRING },
                            cakap: { type: Type.STRING },
                            layak: { type: Type.STRING },
                            berkembang: { type: Type.STRING },
                          },
                          required: ['aspek', 'mahir', 'cakap', 'layak', 'berkembang'],
                        },
                      },
                    },
                  },
                  sumatif: {
                    type: Type.OBJECT,
                    properties: {
                      teknik: { type: Type.ARRAY, items: { type: Type.STRING } },
                      instrumen: { type: Type.ARRAY, items: { type: Type.STRING } },
                    },
                  },
                },
                required: ['diagnostik', 'formatif', 'sumatif'],
              },
              lkpd: {
                type: Type.OBJECT,
                properties: {
                  judul: { type: Type.STRING },
                  tujuan: { type: Type.ARRAY, items: { type: Type.STRING } },
                  alatBahan: { type: Type.ARRAY, items: { type: Type.STRING } },
                  petunjukKerja: { type: Type.ARRAY, items: { type: Type.STRING } },
                  aktivitas: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        langkah: { type: Type.NUMBER },
                        instruksi: { type: Type.STRING },
                        pertanyaan: { type: Type.ARRAY, items: { type: Type.STRING } },
                      },
                      required: ['langkah', 'instruksi'],
                    },
                  },
                  kesimpulan: { type: Type.STRING },
                },
                required: ['judul', 'tujuan', 'petunjukKerja', 'aktivitas'],
              },
              pengayaanRemedial: {
                type: Type.OBJECT,
                properties: {
                  pengayaan: { type: Type.ARRAY, items: { type: Type.STRING } },
                  remedial: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ['pengayaan', 'remedial'],
              },
              glosarium: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    istilah: { type: Type.STRING },
                    definisi: { type: Type.STRING },
                  },
                  required: ['istilah', 'definisi'],
                },
              },
              daftarPustaka: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: [
              'judul',
              'kopSekolah',
              'identitas',
              'komponenAwal',
              'komponenInti',
              'kegiatanPembelajaran',
              'asesmen',
              'lkpd',
              'pengayaanRemedial',
              'glosarium',
              'daftarPustaka',
            ],
          },
          temperature: 0.7,
        },
      });

      const jsonText = response.text;
      if (!jsonText) {
        throw new Error('AI tidak menghasilkan respon yang valid.');
      }

      const modulData = JSON.parse(jsonText);
      modulData.id = 'modul-' + Date.now();
      modulData.createdAt = new Date().toISOString();
      modulData.updatedAt = new Date().toISOString();

      res.json(modulData);
    } catch (err: any) {
      console.error('Error generating modul:', err);
      res.status(500).json({ error: err.message || 'Gagal menghasilkan modul ajar' });
    }
  });

  // 2. GENERATE QUIZ / BANK SOAL (Handler for both endpoints)
  const handleGenerateQuiz = async (req: express.Request, res: express.Response) => {
    try {
      const {
        mataPelajaran,
        fase,
        kelas,
        topik,
        tujuanPembelajaran,
        jumlahSoal,
        tipeSoalList,
        fokusTingkatKesulitan,
      } = req.body;
      const ai = getGeminiClient();

      const prompt = `Buatlah Paket Bank Soal Asesmen Pembelajaran Kurikulum Merdeka yang bermutu tinggi untuk:
Mata Pelajaran: ${mataPelajaran}
Topik: ${topik}
Fase / Kelas: ${fase} / Kelas ${kelas}
Tujuan Pembelajaran: ${tujuanPembelajaran || 'Penguasaan konsep dan aplikasi'}
Jumlah Soal: ${jumlahSoal || 5} butir
Tipe Soal yang Diminta: ${Array.isArray(tipeSoalList) ? tipeSoalList.join(', ') : 'Pilihan Ganda, Uraian'}
Fokus Kesulitan: ${fokusTingkatKesulitan || 'Campuran (Mudah, Sedang, HOTS)'}

Formatkan dalam JSON valid dengan properti:
judulPaket, mataPelajaran, fase, kelas, topik, daftarSoal (array of { id, nomor, tipe, pertanyaan, stimulusTeks, opsiJawaban: [{id, teks}], kunciJawaban, pembahasan, tingkatKesulitan, taksonomiBloom, rubrikPenilaian })`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          systemInstruction: 'Anda adalah Pengembang Soal Asesmen Nasional dan Kurikulum Merdeka Kemendikbudristek.',
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const result = JSON.parse(response.text || '{}');
      if (!result.id) result.id = 'quiz-' + Date.now();
      if (!result.createdAt) result.createdAt = new Date().toISOString();
      res.json(result);
    } catch (err: any) {
      console.error('Error generating quiz:', err);
      res.status(500).json({ error: err.message || 'Gagal membuat bank soal' });
    }
  };

  app.post('/api/gemini/generate-quiz', handleGenerateQuiz);
  app.post('/api/gemini/generate-bank-soal', handleGenerateQuiz);

  // 3. ANALYZE ASSESSMENT DATA
  app.post('/api/gemini/analyze-assessment', async (req, res) => {
    try {
      const { projectData } = req.body;
      const ai = getGeminiClient();

      const prompt = `Lakukan Analisis Hasil Belajar & Rekomendasi Tindak Lanjut Diferensiasi untuk data penilaian berikut:\n${JSON.stringify(projectData, null, 2)}\n
Kembalikan JSON terstruktur dengan properti:
ringkasanKetercapaian, siswaButuhRemedial, siswaSiapPengayaan, catatanPedagogisGuru, rekomendasiStrategiPembelajaran.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          systemInstruction: 'Anda adalah Konsultan Evaluasi Pembelajaran & Psikologi Pendidikan.',
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const result = JSON.parse(response.text || '{}');
      res.json(result);
    } catch (err: any) {
      console.error('Error analyzing assessment:', err);
      res.status(500).json({ error: err.message || 'Gagal menganalisis asesmen' });
    }
  });

  // 4. REFINE / ADAPT MODUL AJAR
  app.post('/api/gemini/refine-modul', async (req, res) => {
    try {
      const { modul, instruksiPerbaikan, instruksi } = req.body;
      const ai = getGeminiClient();
      const promptInstruksi = instruksiPerbaikan || instruksi || 'Tingkatkan kualitas dan kelengkapan modul ajar';

      const prompt = `Berikut adalah Modul Ajar saat ini:\n${JSON.stringify(modul, null, 2)}\n\nInstruksi Penyempurnaan:\n${promptInstruksi}\n\nPerbarui Modul Ajar tersebut dan kembalikan struktur JSON yang telah disempurnakan.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          systemInstruction: 'Anda adalah Asisten Modul Ajar Kurikulum Merdeka yang siap melakukan penyempurnaan sesuai instruksi spesifik guru.',
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const updated = JSON.parse(response.text || '{}');
      updated.id = modul.id;
      updated.updatedAt = new Date().toISOString();
      res.json(updated);
    } catch (err: any) {
      console.error('Error refining modul:', err);
      res.status(500).json({ error: err.message || 'Gagal menyempurnakan modul ajar' });
    }
  });

  return app;
}

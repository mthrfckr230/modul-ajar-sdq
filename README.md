# 📘 AI Modul Ajar Guru (Kurikulum Merdeka) — SDQ Al Mahmudah

Aplikasi web modern untuk membantu guru menyusun **Modul Ajar (RPP)** Kurikulum Merdeka secara otomatis, lengkap, terstruktur, dan siap cetak dengan format resmi **SDQ Al Mahmudah** / Yayasan Sirojul Mukhlasin.

---

## ✨ Fitur Utama

1. **Format Resmi SDQ Al Mahmudah**:
   - Kop surat resmi yayasan, akta notaris, & SK Kemenkumham.
   - Tabel identitas 2 kolom lengkap (Nama Guru, Satuan Pendidikan, Mapel, Alokasi Waktu, Fase/Kelas, Sarpras, Target Murid, Soft Skills).
   - Simbol baku sintaks pembelajaran: Pendahuluan (`✓`), Kegiatan Inti (`➢`), dan Penutup (`▪`).
   - Lembar Pengesahan Tanda Tangan WAKASEK Kurikulum & Guru Bidang Studi.

2. **Input Tujuan Pembelajaran (TP) Buku Wajib**:
   - Guru memasukkan TP langsung dari Buku Guru / Siswa sebelum generate.
   - AI menyelaraskan Kriteria KKTP, pertanyaan pemantik, langkah kegiatan, dan asesmen secara konsisten dari TP buku.

3. **Lembar Asesmen Kegiatan Murid Interaktif**:
   - Buku nilai digital dengan checklist indikator pencapaian KKTP per siswa.
   - Catatan diferensiasi dan rekomendasi remedial/pengayaan.

4. **Bank Soal Formatif Berdiferensiasi**:
   - Pembuatan soal pilihan ganda, pilihan ganda kompleks, uraian HOTS, dan isian singkat.
   - Dilengkapi kunci jawaban dan pembahasan pedagogis.

5. **Ekspor Fleksibel**:
   - Ekspor dokumen Microsoft Word (`.docx`) siap edit dan cetak.
   - Cetak langsung / Simpan PDF (*print-ready*).
   - Integrasi Google Drive & Google Sheets.

---

## 🔒 Keamanan Data & API Key

- **Aman untuk di-upload ke GitHub**: Semua file `.env` yang memuat API key pribadi sudah di-ignore oleh `.gitignore` dan **tidak akan terunggah ke repositori publik**.
- API Key Gemini diproses secara aman di sisi server (*server-side proxy*) dan tidak pernah diekspos ke browser pengguna.

---

## 🚀 Panduan Deploy ke Vercel (100% Siap & Kompatibel)

Proyek ini telah dikonfigurasi secara modular dengan `vercel.json` dan Serverless Function handler di `/api/index.ts`.

### Langkah-langkah Deploy ke Vercel:

1. **Hubungkan Repositori GitHub ke Vercel**:
   - Buka dashboard [Vercel](https://vercel.com/) dan pilih **Add New Project**.
   - Pilih repositori GitHub Anda.

2. **Konfigurasi Environment Variables di Vercel**:
   - Pada halaman konfigurasi sebelum deploy, buka bagian **Environment Variables**.
   - Tambahkan variabel:
     - **Key**: `GEMINI_API_KEY`
     - **Value**: Masukkan API Key Gemini Anda (didapatkan gratis dari [Google AI Studio](https://aistudio.google.com/)).

3. **Deploy**:
   - Klik tombol **Deploy**. Vercel akan otomatis melakukan build frontend Vite dan mengaktifkan Serverless API secara instan.
   - Aplikasi Anda siap digunakan secara online 24/7 oleh seluruh guru.

---

## 💻 Panduan Menjalankan Aplikasi di Komputer Lokal

### 1. Prasyarat
- [Node.js](https://nodejs.org/) versi 18 atau yang lebih baru.
- Kunci API Gemini dari Google AI Studio.

### 2. Instalasi & Menjalankan

```bash
# 1. Clone repositori ini
git clone https://github.com/username-anda/ai-modul-ajar.git
cd ai-modul-ajar

# 2. Install dependensi
npm install

# 3. Buat file .env dari template
cp .env.example .env

# 4. Masukkan API Key Gemini Anda di file .env
# GEMINI_API_KEY=AIzaSy...

# 5. Jalankan aplikasi di mode pengembangan
npm run dev
```

Buka browser di `http://localhost:3000`.

---

## 🌐 Alternatif Praktis: Bagikan Langsung ke Rekan Guru

Jika rekan guru di sekolah Anda tidak terbiasa menggunakan Git atau koding, Anda cukup membagikan **Tautan Langsung (Shared App URL)** dari Google AI Studio:
- **Shared App URL**: Guru dapat langsung membuka tautan web melalui HP / Laptop tanpa perlu menginstal apapun.

---

## 📄 Lisensi
Hak Cipta © 2026 SDQ Al Mahmudah & Tim Pengembang. Dibuat untuk mendukung digitalisasi pembelajaran Kurikulum Merdeka.

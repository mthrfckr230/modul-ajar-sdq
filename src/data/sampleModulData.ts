import { AssessmentProject, BankSoalPaket, ModulAjar, KopSekolah } from '../types';

export const SAMPLE_KOP_SDQ: KopSekolah = {
  namaYayasan: 'YAYASAN SIROJUL MUKHLASIN',
  aktaNotaris: 'Akta Notaris Perubahan : Hj. Jamilah Abdul Gani, S.H.,M. Kn No.09 Tanggal 24 - 08 - 2020',
  skKemenkumham: 'SK Kemenkum dan HAM. R.I; No. AHU-0020308.AHA.01.12.Tahun 2020 Tanggal 9 - 09 - 2020',
  jenjangSekolah: "SEKOLAH DASAR QUR'AN",
  namaSekolah: 'SDQ AL MAHMUDAH',
  alamatSekolah: 'Kp. Cogreg Rt 002/003 Ds. Cogreg Kec. Parung Kab. Bogor-Jawa Barat',
};

// 1. TIK Sample (Page 1-4 from PDF)
export const SAMPLE_MODUL_AJAR_TIK: ModulAjar = {
  id: 'modul-tik-paint',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  judul: 'Modul Ajar TIK Fase B Kelas 3: Pengenalan Aplikasi Paint & Menggambar Sederhana',
  kopSekolah: SAMPLE_KOP_SDQ,
  identitas: {
    namaPenyusun: 'Laila Nabilatu Rohmah, S.Pd',
    namaGuruBidangStudi: 'Laila Nabilatu Rohmah, S.Pd',
    namaWakasekKurikulum: 'Riana Rizki Abidin, S. S',
    namaSekolah: 'SDQ Al Mahmudah',
    tahunAjaran: '2026/2027',
    jenjang: 'SD/MI',
    fase: 'Fase B (Kelas 3-4)',
    kelas: '3/I',
    namaKelasSpesifik: '3 Zaid bin Tsabit',
    mataPelajaran: 'TIK',
    elemen: 'Literasi Digital & Praktik Komputer',
    alokasiWaktu: '2 JP',
    jumlahPertemuan: 1,
    hariTanggal: 'Rabu, 19 Agustus 2026',
    modelPembelajaranTeks: 'Praktik / Learning by Doing',
    saranaPrasaranaTeks: 'komputer, aplikasi paint.',
    targetMuridTeks: 'Murid mampu mengenal dan menggunakan fitur sederhana pada aplikasi Paint untuk membuat gambar sederhana serta menunjukkan kreativitas, ketelitian, dan tanggung jawab selama kegiatan praktik.',
    softSkillsTeks: 'Kreativitas, ketelitian, tanggung jawab, dan kemandirian.',
  },
  komponenAwal: {
    kompetensiAwal: [
      'Murid mampu mengoperasikan mouse komputer dasar (klik, tahan, geser).',
      'Murid mampu mengenali ikon aplikasi di desktop komputer.'
    ],
    profilPelajarPancasila: ['Mandiri', 'Bernalar Kritis', 'Kreatif'],
    saranaPrasarana: ['komputer', 'aplikasi paint.'],
    targetPesertaDidik: 'Inklusi (Berdiferensiasi)',
    modelPembelajaran: 'Praktik / Learning by Doing',
    metodePembelajaran: ['Demonstrasi Langsung', 'Praktik Mandiri / Learning by Doing', 'Bimbingan Personal']
  },
  komponenInti: {
    capaianPembelajaran: 'Peserta didik mampu menggunakan perangkat teknologi informasi dasar untuk berkarya kreatif dan memanfaatkan fitur aplikasi grafis sederhana secara bertanggung jawab.',
    tujuanPembelajaran: [
      'Murid mampu mengenal fungsi dasar aplikasi Paint.',
      'Murid mampu menggunakan fitur sederhana pada Paint untuk membuat gambar.',
      'Murid mampu membuat gambar sederhana menggunakan bentuk, garis, warna, dan alat gambar pada Paint dengan kreatif dan bertanggung jawab.'
    ],
    kriteriaKetercapaianTP: [
      'Murid mampu mengenali dan menyebutkan fungsi beberapa fitur sederhana pada Paint.',
      'Murid mampu menggunakan mouse dan fitur Paint untuk membuat gambar sederhana.',
      'Murid mampu menunjukkan kreativitas dalam membuat gambar serta bertanggung jawab menggunakan perangkat selama praktik. (Kreativitas & Tanggung Jawab)'
    ],
    pemahamanBermakna: [
      'Komputer dan aplikasi Paint adalah media kreatif digital yang dapat membantu mengekspresikan ide menjadi karya visual yang rapi dan bermakna.'
    ],
    pertanyaanPemantik: [
      'Pernahkah kamu menggambar menggunakan komputer?',
      'Menurutmu, apa yang dapat kita lakukan dengan aplikasi Paint?',
      'Fitur apa yang dapat digunakan untuk membuat gambar menjadi lebih menarik?'
    ],
    diferensiasi: {
      konten: 'Tersedia panduan bergambar ikon Paint untuk murid yang memerlukan bantuan visual.',
      proses: 'Guru memberikan pendampingan intensif bagi murid yang baru belajar navigasi mouse, dan memberikan kebebasan eksplorasi bentuk bagi murid yang sudah lincah.',
      produk: 'Murid dapat menghasilkan gambar sesuai imajinasi (misal: rumah, pemandangan, mobil) dengan variasi minimal 3 bentuk dan 3 warna.'
    },
    kegiatanPembelajaran: [
      {
        pertemuanKe: 1,
        fokusMateri: 'Fitur Dasar Paint: Pensil, Kuas, Shapes, Warna, & Fill',
        alokasiMenit: 70,
        pendahuluan: {
          durasiMenit: 10,
          kegiatan: [
            'Salam',
            'Berdoa sebelum kegiatan',
            'Apersepsi (masuk dalam SOP apersepsi)',
            'Mengingatkan kembali aturan di dalam kelas',
            'Guru melakukan apersepsi dengan pertanyaan pemantik.',
            'Guru mengingatkan aturan menggunakan komputer dengan aman dan tertib.',
            'Guru menyampaikan tujuan pembelajaran.'
          ]
        },
        inti: {
          durasiMenit: 50,
          sintaks: 'Praktik / Learning by Doing',
          kegiatan: [
            'Guru membuka aplikasi Paint pada komputer.',
            'Guru menunjukkan bagian-bagian sederhana pada Paint, seperti pensil, kuas, penghapus, bentuk, warna, dan fill.',
            'Murid mengamati penjelasan guru.',
            'Guru mendemonstrasikan cara menggunakan beberapa fitur dasar.',
            'Murid membuka aplikasi Paint pada komputer masing-masing.',
            'Murid mencoba menggunakan pensil dan kuas untuk membuat garis.',
            'Murid mencoba memilih dan menggunakan berbagai warna.',
            'Murid mencoba membuat bentuk sederhana menggunakan fitur shapes.',
            'Guru membimbing murid selama praktik.',
            'Murid menunjukkan hasil gambar kepada guru.'
          ],
          diferensiasiAktivitas: 'Murid dengan kesiapan tinggi diarahkan menambahkan detail background dengan Fill with Color, murid yang butuh bimbingan dipandu membuat kombinasi lingkaran dan persegi.'
        },
        penutup: {
          durasiMenit: 10,
          kegiatan: [
            'Guru berkeliling memberikan bimbingan kepada murid yang memerlukan bantuan.',
            'Guru memberikan apresiasi terhadap hasil praktik.',
            'Guru mengingatkan murid untuk menutup aplikasi dan mematikan komputer dengan benar.',
            'Guru menyampaikan pesan untuk menggunakan komputer dengan hati-hati dan bertanggung jawab.',
            'Guru menutup pembelajaran dengan doa dan salam.'
          ]
        }
      }
    ],
    asesmen: {
      diagnostik: 'Tanya jawab pengalaman menggunakan mouse dan aplikasi Paint.',
      formatif: 'Observasi unjuk kerja saat murid mencoba fitur shapes dan pewarnaan.',
      sumatif: 'Hasil karya gambar sederhana di Paint berdasarkan rubrik kreativitas dan ketelitian.',
      rubrikKKTP: [
        {
          aspek: 'Pengenalan Fitur Paint',
          perluBimbingan: 'Belum mampu membedakan pensil, kuas, dan shapes',
          cukup: 'Mengenal 2-3 fitur dengan panduan guru',
          baik: 'Mampu memilih fitur pensil, kuas, shapes secara mandiri',
          sangatBaik: 'Sangat mahir memilih dan mengombinasikan berbagai alat gambar'
        },
        {
          aspek: 'Keterampilan Menggambar & Mewarnai',
          perluBimbingan: 'Garis belum rapi dan pewarnaan bocor',
          cukup: 'Mampu membuat bentuk dasar namun warna terbatas',
          baik: 'Mampu membuat gambar utuh dengan warna variatif',
          sangatBaik: 'Gambar sangat rapi, proporsional, dan penuh warna harmonis'
        },
        {
          aspek: 'Kreativitas & Tanggung Jawab',
          perluBimbingan: 'Kurang fokus dan meninggalkan perangkat belum rapi',
          cukup: 'Cukup tertib selama praktik dengan sedikit dorongan',
          baik: 'Kreatif dan merapikan komputer setelah selesai',
          sangatBaik: 'Sangat kreatif, mandiri, dan mematikan komputer dengan tertib'
        }
      ]
    },
    pengayaanDanRemedial: {
      pengayaan: 'Murid membuat gambar bertema dengan menambahkan teks (Text Tool) dan variasi efek kuas.',
      remedial: 'Bimbingan personal cara mengklik dan menarik mouse untuk membuat bentuk kotak dan lingkaran.'
    },
    refleksi: {
      refleksiGuru: [
        'Apakah seluruh murid dapat mengikuti langkah praktik di komputer?',
        'Fitur Paint mana yang paling diminati murid?',
        'Bagaimana efektivitas alokasi waktu praktik komputer?'
      ],
      refleksiPesertaDidik: [
        'Fitur apa yang paling seru saat kamu gunakan di Paint?',
        'Gambar apa yang paling kamu banggakan hari ini?'
      ]
    }
  },
  lembarAsesmenMurid: {
    mataPelajaran: 'TIK',
    kelas: '3 Zaid bin Tsabit',
    hariTanggal: 'Rabu, 19 Agustus 2026',
    indikator: [
      'Murid mampu mengenali dan menyebutkan fungsi beberapa fitur sederhana pada Paint.',
      'Murid mampu menggunakan mouse dan fitur Paint untuk membuat gambar sederhana.',
      'Murid mampu menunjukkan kreativitas dalam membuat gambar serta bertanggung jawab menggunakan perangkat selama praktik. (Kreativitas & Tanggung Jawab)'
    ],
    daftarSiswa: [
      { no: 1, nama: 'ABU BAKAR AL-RASYID', indikatorNilai: { 0: true, 1: true, 2: true }, catatan: 'Sangat terampil menggunakan mouse' },
      { no: 2, nama: 'ANDRYA NAIFA FADELA RUBIYANTO', indikatorNilai: { 0: true, 1: true, 2: true }, catatan: 'Gambar rapi dan kreatif' },
      { no: 3, nama: 'ARASHYA KINZA KIANO', indikatorNilai: { 0: true, 1: true, 2: true }, catatan: 'Pewarnaan baik' },
      { no: 4, nama: 'ARKANSYAH PUTRA ELBI', indikatorNilai: { 0: true, 1: true, 2: true }, catatan: 'Mampu membuat bentuk rumah' },
      { no: 5, nama: 'ARRAFI FARZAN SHAKEEL', indikatorNilai: { 0: true, 1: true, 2: true }, catatan: 'Fokus dan tertib' },
      { no: 6, nama: 'ARSYILA KHANZA FAUZIAH', indikatorNilai: { 0: true, 1: true, 2: true }, catatan: 'Kombinasi warna menarik' },
      { no: 7, nama: 'FATIMA KANAYA LARASATI', indikatorNilai: { 0: true, 1: true, 2: true }, catatan: 'Cepat memahami instruksi' },
      { no: 8, nama: 'FATIMAH AZ ZAHRA', indikatorNilai: { 0: true, 1: true, 2: true }, catatan: 'Sangat mandiri' },
      { no: 9, nama: 'FEAZIA MOUNERA', indikatorNilai: { 0: true, 1: true, 2: true }, catatan: 'Hasil gambar detail' },
      { no: 10, nama: 'IBRAHIM NAZRIL RASYAD', indikatorNilai: { 0: true, 1: true, 2: true }, catatan: 'Kreatif memilih kuas' },
      { no: 11, nama: 'KHOSYATILLAH ADZKADINA', indikatorNilai: { 0: true, 1: true, 2: true }, catatan: 'Antusias saat mencoba shapes' },
      { no: 12, nama: 'MUHAMAD AGAM PUTRA SISMAYA', indikatorNilai: { 0: true, 1: true, 2: true }, catatan: 'Perlu sedikit latihan klik ganda' },
      { no: 13, nama: 'MUHAMAD ALIF ALFATIH', indikatorNilai: { 0: true, 1: true, 2: true }, catatan: 'Bentuk gambar variatif' },
      { no: 14, nama: 'MUHAMMAD FAIZ ALFARIQ', indikatorNilai: { 0: true, 1: true, 2: true }, catatan: 'Tertib mematikan komputer' },
      { no: 15, nama: 'MUKHAMMAD EMIR RAYYAN', indikatorNilai: { 0: true, 1: true, 2: true }, catatan: 'Kreativitas sangat baik' },
      { no: 16, nama: 'NAIMA ZITA NURALISHBA', indikatorNilai: { 0: true, 1: true, 2: true }, catatan: 'Pilihan palet warna harmonis' },
      { no: 17, nama: 'NAJWA SHAKILA KAFABIH', indikatorNilai: { 0: true, 1: true, 2: true }, catatan: 'Bagus dalam membuat garis' },
      { no: 18, nama: 'RATU AKLEEMA AR RUKMANA', indikatorNilai: { 0: true, 1: true, 2: true }, catatan: 'Karya selesai tepat waktu' },
      { no: 19, nama: 'SYAHNA ALIFIYA FIRDAUS', indikatorNilai: { 0: true, 1: true, 2: true }, catatan: 'Aktif bertanya' },
      { no: 20, nama: 'ZHAFIRA SWASTININGRUM', indikatorNilai: { 0: true, 1: true, 2: true }, catatan: 'Sangat teliti' }
    ]
  },
  lampiran: {
    lkpd: {
      judulLKPD: 'Lembar Praktik Murid: Berkarya Kreatif dengan Paint',
      petunjukPengerjaan: [
        '1. Buka aplikasi Paint pada komputer masing-masing.',
        '2. Gunakan fitur Shapes (Lingkaran, Persegi, Segitiga) untuk membuat gambar pemandangan atau rumah impian.',
        '3. Warnai gambar menggunakan fitur Fill with Color.',
        '4. Simpan hasil karyamu dan tunjukkan kepada guru.'
      ],
      aktivitas: [
        {
          langkah: 'Langkah 1: Menggambar Pola Dasar',
          instruksi: 'Pilih ikon Shapes persegi dan buat dinding rumah, lalu gunakan segitiga untuk atap rumah.'
        },
        {
          langkah: 'Langkah 2: Pewarnaan',
          instruksi: 'Pilih warna kesukaanmu pada Color Palette, lalu klik alat ember cat (Fill with color) pada bagian dalam bentuk.'
        }
      ],
      tugasKelompokOrIndividu: 'Karya Mandiri: Gambar Kreatif Berwarna di Aplikasi Paint'
    },
    bahanBacaanGuruDanSiswa: 'Aplikasi Paint merupakan perangkat lunak pengolah gambar sederhana bawaan sistem operasi Windows yang sangat ramah anak untuk melatih koordinasi motorik halus, logika visual, dan kreativitas spasial.',
    glosarium: [
      { istilah: 'Paint', arti: 'Aplikasi komputer untuk membuat dan mengedit gambar sederhana.' },
      { istilah: 'Shapes', arti: 'Alat untuk membuat bentuk geometris otomatis seperti lingkaran, persegi, dan bintang.' },
      { istilah: 'Fill with Color', arti: 'Alat berbentuk ember cat untuk mengisi seluruh area tertutup dengan satu warna.' }
    ],
    daftarPustaka: [
      'Buku Panduan Guru & Siswa Informatika SD Kelas 3 Kemendikbudristek RI.',
      'SOP Praktik Laboratorium Komputer SDQ Al Mahmudah.'
    ]
  }
};

// 2. Bahasa Inggris Sample (Page 5-8 from PDF)
export const SAMPLE_MODUL_AJAR_INGGRIS: ModulAjar = {
  id: 'modul-inggris-eval-bab1',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  judul: 'Modul Ajar Bahasa Inggris Fase B Kelas 3: Evaluasi BAB 1 Food and Drinks',
  kopSekolah: SAMPLE_KOP_SDQ,
  identitas: {
    namaPenyusun: 'Laila Nabilatu Rohmah, S.Pd',
    namaGuruBidangStudi: 'Laila Nabilatu Rohmah, S.Pd',
    namaWakasekKurikulum: 'Riana Rizki Abidin, S. S',
    namaSekolah: 'SDQ Al Mahmudah',
    tahunAjaran: '2026/2027',
    jenjang: 'SD/MI',
    fase: 'Fase B (Kelas 3-4)',
    kelas: '3/I',
    namaKelasSpesifik: '3 Zaid bin Tsabit',
    mataPelajaran: 'Bahasa Inggris',
    elemen: 'Menyimak-Berbicara, Membaca-Memirsa',
    alokasiWaktu: '2 JP',
    jumlahPertemuan: 1,
    hariTanggal: 'Rabu, 19 Agustus 2026',
    modelPembelajaranTeks: 'Inquiry Based Learning',
    saranaPrasaranaTeks: 'Buku paket.',
    targetMuridTeks: 'Murid mampu mengerjakan dan memahami Evaluasi BAB 1 dengan baik dan memperbaiki kesalahan setelah pembahasan serta menunjukkan sikap mandiri, teliti, bertanggung jawab selama kegiatan evaluasi.',
    softSkillsTeks: 'tanggung jawab, mandiri, jujur, teliti, percaya diri.',
  },
  komponenAwal: {
    kompetensiAwal: [
      'Murid telah mengenal kosakata makanan dan minuman (rice, noodles, water, milk, etc.).',
      'Murid memahami pola kalimat sederhana "I like..." dan "I want...".'
    ],
    profilPelajarPancasila: ['Mandiri', 'Bernalar Kritis', 'Gotong Royong'],
    saranaPrasarana: ['Buku paket.', 'Papan tulis', 'Flashcards kosakata'],
    targetPesertaDidik: 'Inklusi (Berdiferensiasi)',
    modelPembelajaran: 'Inquiry Learning',
    metodePembelajaran: ['Pengerjaan Mandiri', 'Pembahasan Bersama / Peer Review', 'Refleksi Reflektif']
  },
  komponenInti: {
    capaianPembelajaran: 'Peserta didik memahami dan merespon teks lisan serta tulisan sederhana tentang makanan, minuman, dan preferensi dalam bahasa Inggris.',
    tujuanPembelajaran: [
      'Murid mengerjakan evaluasi BAB 1 tentang kosakata makanan dan minuman dengan baik.',
      'Murid mampu membahas dan memperbaiki jawaban evaluasi berdasarkan pembahasan bersama guru.',
      'Murid menunjukkan sikap teliti dan bertanggung jawab dalam mengerjakan evaluasi.'
    ],
    kriteriaKetercapaianTP: [
      'Murid mampu menjawab soal dengan benar.',
      'Murid mampu memperbaiki kesalahan setelah mengikuti pembahasan evaluasi.',
      'Murid mampu mengerjakan evaluasi secara mandiri, jujur, teliti, dan bertanggung jawab.'
    ],
    pemahamanBermakna: [
      'Mempelajari evaluasi dan kesalahan adalah bagian penting dari proses menguasai bahasa baru.'
    ],
    pertanyaanPemantik: [
      'What food do you remember?',
      'What drink do you like?',
      'How do we say "Saya suka nasi goreng" in English?'
    ],
    diferensiasi: {
      konten: 'Pilihan bantuan gambar pendukung untuk kosakata yang sulit.',
      proses: 'Siswa yang selesai lebih cepat dapat membantu mencocokkan kartu flashcard dengan teman sebaya.',
      produk: 'Perbaikan buku evaluasi mandiri disertai catatan arti kata.'
    },
    kegiatanPembelajaran: [
      {
        pertemuanKe: 1,
        fokusMateri: 'Pengerjaan & Pembahasan Evaluasi BAB 1 Food and Drinks',
        alokasiMenit: 70,
        pendahuluan: {
          durasiMenit: 10,
          kegiatan: [
            'Salam',
            'Berdoa sebelum kegiatan',
            'Apersepsi (masuk dalam SOP apersepsi)',
            'Guru menjelaskan bahwa pembelajaran hari ini adalah mengerjakan dan membahas Evaluasi BAB 1.',
            'Guru menyampaikan aturan mengerjakan evaluasi dengan jujur, teliti, dan mandiri.'
          ]
        },
        inti: {
          durasiMenit: 50,
          sintaks: 'Inquiry Based Learning',
          kegiatan: [
            'Guru menugaskan murid mengerjakan Evaluasi BAB 1.',
            'Guru bersama murid membaca dan memahami petunjuk pengerjaan.',
            'Murid mengerjakan soal evaluasi secara mandiri dengan bimbingan guru.',
            'Guru berkeliling untuk mengamati dan membantu murid yang mengalami kesulitan dalam memahami instruksi soal.',
            'Setelah selesai, guru bersama murid membahas setiap soal Evaluasi BAB 1 secara bertahap.',
            'Guru memberikan penjelasan dan penguatan terhadap jawaban yang benar.',
            'Murid memeriksa hasil pekerjaannya dan memperbaiki jawaban yang masih salah.',
            'Guru memberikan kesempatan kepada murid untuk bertanya mengenai soal atau materi yang belum dipahami.',
            'Guru bersama murid menyimpulkan materi BAB 1 Food and Drinks yang telah dipelajari.'
          ],
          diferensiasiAktivitas: 'Bimbingan pelafalan pronunciation secara personal pada murid yang masih ragu.'
        },
        penutup: {
          durasiMenit: 10,
          kegiatan: [
            'Guru menyimpulkan materi.',
            'Mengulas kembali ungkapan yang telah dipelajari.',
            'Memberikan apresiasi kepada murid.',
            'Menyampaikan kegiatan pembelajaran berikutnya.',
            'Do’a pulang'
          ]
        }
      }
    ],
    asesmen: {
      diagnostik: 'Quick review vocabulary lisan.',
      formatif: 'Keterlibatan aktif saat pembahasan soal evaluasi.',
      sumatif: 'Skor hasil pengerjaan dan koreksi evaluasi BAB 1.',
      rubrikKKTP: [
        {
          aspek: 'Ketepatan Jawaban Kosakata',
          perluBimbingan: 'Skor < 65',
          cukup: 'Skor 65-74',
          baik: 'Skor 75-89',
          sangatBaik: 'Skor 90-100'
        },
        {
          aspek: 'Kemandirian & Kejujuran',
          perluBimbingan: 'Sering meniru teman',
          cukup: 'Cukup mandiri dengan arahan',
          baik: 'Mandiri dan teliti',
          sangatBaik: 'Sangat mandiri, jujur, dan berani memperbaiki kesalahan'
        }
      ]
    },
    pengayaanDanRemedial: {
      pengayaan: 'Menyusun kalimat percakapan pesan makanan sederhana (role play ordering food).',
      remedial: 'Mengulang 5 kosakata inti dengan bantuan gambar dan kartu kata.'
    },
    refleksi: {
      refleksiGuru: ['Sejauh mana penguasaan kosakata food & drinks pada murid?'],
      refleksiPesertaDidik: ['Soal nomor berapa yang menurutmu paling mudah dan menantang?']
    }
  },
  lembarAsesmenMurid: {
    mataPelajaran: 'Bahasa Inggris',
    kelas: '3 Zaid bin Tsabit',
    hariTanggal: 'Rabu, 19 Agustus 2026',
    indikator: [
      'Murid mampu menjawab soal dengan benar.',
      'Murid mampu memperbaiki kesalahan setelah mengikuti pembahasan evaluasi.',
      'Murid mampu mengerjakan evaluasi secara mandiri, jujur, teliti, dan bertanggung jawab.'
    ],
    daftarSiswa: [
      { no: 1, nama: 'ABU BAKAR AL-RASYID', indikatorNilai: { 0: true, 1: true, 2: true }, catatan: 'Jawaban benar dan lengkap' },
      { no: 2, nama: 'ANDRYA NAIFA FADELA RUBIYANTO', indikatorNilai: { 0: true, 1: true, 2: true }, catatan: 'Teliti dalam membaca soal' },
      { no: 3, nama: 'ARASHYA KINZA KIANO', indikatorNilai: { 0: true, 1: true, 2: true }, catatan: 'Aktif saat pembahasan' },
      { no: 4, nama: 'ARKANSYAH PUTRA ELBI', indikatorNilai: { 0: true, 1: true, 2: true }, catatan: 'Mandiri mengerjakan' },
      { no: 5, nama: 'ARRAFI FARZAN SHAKEEL', indikatorNilai: { 0: true, 1: true, 2: true }, catatan: 'Memperbaiki jawaban dengan rapi' },
      { no: 6, nama: 'ARSYILA KHANZA FAUZIAH', indikatorNilai: { 0: true, 1: true, 2: true }, catatan: 'Paham seluruh kosakata' },
      { no: 7, nama: 'FATIMA KANAYA LARASATI', indikatorNilai: { 0: true, 1: true, 2: true }, catatan: 'Skor sangat baik' },
      { no: 8, nama: 'FATIMAH AZ ZAHRA', indikatorNilai: { 0: true, 1: true, 2: true }, catatan: 'Sangat teliti' },
      { no: 9, nama: 'FEAZIA MOUNERA', indikatorNilai: { 0: true, 1: true, 2: true }, catatan: 'Mandiri dan jujur' },
      { no: 10, nama: 'IBRAHIM NAZRIL RASYAD', indikatorNilai: { 0: true, 1: true, 2: true }, catatan: 'Antusias bertanya' },
      { no: 11, nama: 'KHOSYATILLAH ADZKADINA', indikatorNilai: { 0: true, 1: true, 2: true }, catatan: 'Mampu menjelaskan arti kata' },
      { no: 12, nama: 'MUHAMAD AGAM PUTRA SISMAYA', indikatorNilai: { 0: true, 1: true, 2: true }, catatan: 'Perlu latihan menulis kata' },
      { no: 13, nama: 'MUHAMAD ALIF ALFATIH', indikatorNilai: { 0: true, 1: true, 2: true }, catatan: 'Baik dalam pemahaman teks' },
      { no: 14, nama: 'MUHAMMAD FAIZ ALFARIQ', indikatorNilai: { 0: true, 1: true, 2: true }, catatan: 'Tertib selama evaluasi' },
      { no: 15, nama: 'MUKHAMMAD EMIR RAYYAN', indikatorNilai: { 0: true, 1: true, 2: true }, catatan: 'Penguasaan kosakata baik' },
      { no: 16, nama: 'NAIMA ZITA NURALISHBA', indikatorNilai: { 0: true, 1: true, 2: true }, catatan: 'Sangat cermat' },
      { no: 17, nama: 'NAJWA SHAKILA KAFABIH', indikatorNilai: { 0: true, 1: true, 2: true }, catatan: 'Selesai tepat waktu' },
      { no: 18, nama: 'RATU AKLEEMA AR RUKMANA', indikatorNilai: { 0: true, 1: true, 2: true }, catatan: 'Pemahaman materi baik' },
      { no: 19, nama: 'SYAHNA ALIFIYA FIRDAUS', indikatorNilai: { 0: true, 1: true, 2: true }, catatan: 'Koreksi mandiri rapi' },
      { no: 20, nama: 'ZHAFIRA SWASTININGRUM', indikatorNilai: { 0: true, 1: true, 2: true }, catatan: 'Sangat baik' }
    ]
  },
  lampiran: {
    lkpd: {
      judulLKPD: 'Evaluasi BAB 1: Food and Drinks Vocabulary & Preferences',
      petunjukPengerjaan: [
        '1. Baca instruksi soal pada buku paket halaman 18-20 dengan cermat.',
        '2. Jawab soal secara mandiri dan teliti.',
        '3. Beri tanda centang pada jawaban yang benar saat pembahasan bersama guru.'
      ],
      aktivitas: [
        {
          langkah: 'Bagian A: Vocabulary Matching',
          instruksi: 'Match the food picture with the correct English word.'
        },
        {
          langkah: 'Bagian B: Sentence Completion',
          instruksi: 'Complete the sentence using "I like..." or "I want...".'
        }
      ],
      tugasKelompokOrIndividu: 'Tugas Individu: Evaluasi BAB 1 Buku Paket'
    },
    bahanBacaanGuruDanSiswa: 'Daftar kosakata makanan dan minuman: Fried rice (nasi goreng), Noodles (mie), Soup (sup), Milk (susu), Orange juice (jus jeruk), Water (air putih).',
    glosarium: [
      { istilah: 'Evaluation', arti: 'Kegiatan penilaian untuk mengukur pemahaman belajar.' },
      { istilah: 'Preference', arti: 'Pilihan atau kesukaan seseorang.' }
    ],
    daftarPustaka: [
      'My Next Words Grade 3 - Student Book for Elementary School, Kemendikbudristek.',
      'Syllabus SDQ Al Mahmudah.'
    ]
  }
};

// 3. Matematika Sample (Page 9-12 from PDF)
export const SAMPLE_MODUL_AJAR_MATEMATIKA: ModulAjar = {
  id: 'modul-matematika-sifat-operasi',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  judul: 'Modul Ajar Matematika Fase B Kelas 3: Sifat Pertukaran Penjumlahan & Pengurangan Bilangan Cacah',
  kopSekolah: SAMPLE_KOP_SDQ,
  identitas: {
    namaPenyusun: 'Laila Nabilatu Rohmah, S.Pd',
    namaGuruBidangStudi: 'Laila Nabilatu Rohmah, S.Pd',
    namaWakasekKurikulum: 'Riana Rizki Abidin, S. S',
    namaSekolah: 'SDQ Al Mahmudah',
    tahunAjaran: '2026/2027',
    jenjang: 'SD/MI',
    fase: 'Fase B (Kelas 3-4)',
    kelas: '3/I',
    namaKelasSpesifik: '3 Ubay bin Ka’ab',
    mataPelajaran: 'Matematika',
    elemen: 'Bilangan & Operasi Hitung',
    alokasiWaktu: '2 JP',
    jumlahPertemuan: 1,
    hariTanggal: 'Kamis, 19 Agustus 2026',
    modelPembelajaranTeks: 'Problem Based Learning (PBL)',
    saranaPrasaranaTeks: 'buku matematika, papan tulis dan spidol.',
    targetMuridTeks: 'Murid mampu memahami sifat pertukaran dan pengelompokan pada penjumlahan, melakukan operasi pengurangan bilangan cacah dua angka.',
    softSkillsTeks: 'Berpikir kritis, penyelesaian masalah, ketelitian',
  },
  komponenAwal: {
    kompetensiAwal: [
      'Murid telah menguasai penjumlahan bilangan cacah sampai 100.',
      'Murid memahami konsep nilai tempat satuan dan puluhan.'
    ],
    profilPelajarPancasila: ['Bernalar Kritis', 'Mandiri', 'Kreatif'],
    saranaPrasarana: ['buku matematika', 'papan tulis dan spidol.'],
    targetPesertaDidik: 'Inklusi (Berdiferensiasi)',
    modelPembelajaran: 'Problem Based Learning (PBL)',
    metodePembelajaran: ['Problem Solving', 'Demonstrasi Nilai Tempat', 'Latihan Mandiri']
  },
  komponenInti: {
    capaianPembelajaran: 'Peserta didik mampu melakukan operasi penjumlahan dan pengurangan bilangan cacah hingga 1.000 dengan memanfaatkan sifat-sifat operasi hitung (komutatif dan asosiatif) serta menyelesaikan masalah kontekstual.',
    tujuanPembelajaran: [
      'Murid memahami sifat pertukaran dan pengelompokan pada penjumlahan.',
      'Murid menyelesaikan pengurangan bilangan dua angka tanpa meminjam.',
      'Murid menyelesaikan pengurangan bilangan cacah dua angka dengan meminjam.'
    ],
    kriteriaKetercapaianTP: [
      'Murid mampu menerapkan sifat pertukaran dan pengelompokan pada penjumlahan dengan tepat.',
      'Murid mampu menyelesaikan pengurangan bilangan cacah dua angka tanpa meminjam dan dengan meminjam.',
      'Murid mampu menganalisis nilai tempat dan menentukan langkah yang tepat dalam menyelesaikan operasi pengurangan (berpikir kritis).'
    ],
    pemahamanBermakna: [
      'Sifat pertukaran dan pengelompokan mempermudah kita menghitung belanjaan dan memecahkan persoalan matematika sehari-hari secara fleksibel.'
    ],
    pertanyaanPemantik: [
      'Apakah 3 + 5 akan menghasilkan jawaban yang sama dengan 5 + 3? Mengapa?',
      'Apakah bilangan dalam penjumlahan dapat ditukar posisinya tanpa mengubah hasil?',
      'Apa yang terjadi jika angka satuan yang dikurangi lebih kecil daripada angka yang mengurangi?'
    ],
    diferensiasi: {
      konten: 'Penggunaan balok Dienes atau kartu nilai tempat untuk murid yang memerlukan visualisasi konkret.',
      proses: 'Latihan bertahap mulai dari tanpa meminjam menuju teknik meminjam 1 puluhan menjadi 10 satuan.',
      produk: 'Penyelesaian soal latihan halaman 52, 54, 60, dan 63-64.'
    },
    kegiatanPembelajaran: [
      {
        pertemuanKe: 1,
        fokusMateri: 'Sifat Pertukaran Penjumlahan & Pengurangan Bilangan Cacah',
        alokasiMenit: 70,
        pendahuluan: {
          durasiMenit: 10,
          kegiatan: [
            'Salam',
            'Berdoa sebelum kegiatan',
            'Apersepsi (masuk dalam SOP apersepsi)',
            'Mengingatkan kembali aturan di dalam kelas',
            'Guru memberikan contoh sederhana: 4 + 6 = 10',
            'Kemudian guru bertanya: 6 + 4 = ...',
            'Guru menghubungkan jawaban murid dengan sifat pertukaran pada penjumlahan.',
            'Guru menyampaikan tujuan pembelajaran.'
          ]
        },
        inti: {
          durasiMenit: 50,
          sintaks: 'Problem Based Learning (PBL)',
          kegiatan: [
            'Guru menjelaskan konsep sifat pertukaran pada penjumlahan.',
            'Guru memberikan contoh.',
            'Guru menjelaskan bahwa posisi bilangan dapat ditukar dan hasil penjumlahannya tetap sama.',
            'Murid memperhatikan penjelasan dan contoh guru.',
            'Murid mengerjakan halaman 52.',
            'Guru menjelaskan konsep sifat pengelompokan.',
            'Guru memberikan contoh.',
            'Guru menjelaskan bahwa pengelompokan bilangan dapat diubah tanpa mengubah hasil penjumlahan.',
            'Murid mengerjakan halaman 54.',
            'Guru menjelaskan konsep pengurangan dua angka tanpa meminjam.',
            'Guru mencontohkan.',
            'Guru menjelaskan pengurangan berdasarkan nilai tempat satuan dan puluhan.',
            'Murid memperhatikan contoh yang diberikan.',
            'Murid mengerjakan halaman 60.',
            'Guru menjelaskan konsep pengurangan dengan meminjam.',
            'Guru memberikan contoh.',
            'Guru menjelaskan bahwa karena 2 satuan tidak dapat dikurangi 8 satuan, maka 1 puluhan ditukar menjadi 10 satuan.',
            'Murid memperhatikan langkah pengerjaan.',
            'Murid mengerjakan halaman 63-64.'
          ],
          diferensiasiAktivitas: 'Bimbingan khusus pada penukaran nilai tempat puluhan ke satuan.'
        },
        penutup: {
          durasiMenit: 10,
          kegiatan: [
            'Guru bersama murid menyimpulkan pembelajaran.',
            'Guru memberikan penguatan terhadap materi.',
            'Guru menyampaikan tindak lanjut pembelajaran.',
            'Guru memberikan umpan balik.',
            'Berdoa bersama.'
          ]
        }
      }
    ],
    asesmen: {
      diagnostik: 'Tanya jawab cepat sifat komutatif (4+6 vs 6+4).',
      formatif: 'Observasi langkah pengerjaan soal di papan tulis dan buku tugas.',
      sumatif: 'Latihan ulangan harian operasi hitung bilangan cacah.',
      rubrikKKTP: [
        {
          aspek: 'Sifat Pertukaran & Pengelompokan',
          perluBimbingan: 'Belum memahami konsep penukaran posisi angka',
          cukup: 'Mampu menukar angka dengan bantuan contoh',
          baik: 'Menerapkan sifat komutatif secara mandiri',
          sangatBaik: 'Sangat mahir menerapkan sifat komutatif dan asosiatif pada soal cerita'
        },
        {
          aspek: 'Pengurangan dengan Meminjam',
          perluBimbingan: 'Sering keliru saat mengurangi satuan yang lebih kecil',
          cukup: 'Mampu menghitung jika dibimbing langkah pinjam puluhan',
          baik: 'Mampu menyelesaikan pengurangan meminjam dengan benar',
          sangatBaik: 'Sangat cepat dan teliti menyelesaikan pengurangan bersusun'
        }
      ]
    },
    pengayaanDanRemedial: {
      pengayaan: 'Menyelesaikan soal teka-teki silang angka dan soal cerita kontekstual 3 digit.',
      remedial: 'Latihan menggunakan bantuan tabel nilai tempat dan stik hitung.'
    },
    refleksi: {
      refleksiGuru: ['Apakah konsep meminjam nilai tempat sudah dipahami seluruh murid?'],
      refleksiPesertaDidik: ['Langkah mana yang paling kamu sukai saat menyelesaikan pengurangan?']
    }
  },
  lembarAsesmenMurid: {
    mataPelajaran: 'Matematika',
    kelas: '3 Ubay bin Ka’ab',
    hariTanggal: 'Kamis, 19 Agustus 2026',
    indikator: [
      'Murid mampu menerapkan sifat pertukaran dan pengelompokan pada penjumlahan dengan tepat.',
      'Murid mampu menyelesaikan pengurangan bilangan cacah dua angka tanpa meminjam dan dengan meminjam.',
      'Murid mampu menganalisis nilai tempat dan menentukan langkah yang tepat dalam menyelesaikan operasi pengurangan (berpikir kritis).'
    ],
    daftarSiswa: [
      { no: 1, nama: 'AIRIN NABILA AFFANDI', indikatorNilai: { 0: true, 1: true, 2: true }, catatan: 'Kritis dan teliti' },
      { no: 2, nama: 'AISHA MUGHNI SHALIHA', indikatorNilai: { 0: true, 1: true, 2: true }, catatan: 'Hitungan cepat dan tepat' },
      { no: 3, nama: 'ALESHA SYAKILA ALSAVA', indikatorNilai: { 0: true, 1: true, 2: true }, catatan: 'Paham konsep pertukaran' },
      { no: 4, nama: 'ALTHAF ELZAFRAN SETIAWAN', indikatorNilai: { 0: true, 1: true, 2: true }, catatan: 'Rapi dalam menulis bersusun' },
      { no: 5, nama: 'ALVARO RAYANDRA ATTHARRIZQI', indikatorNilai: { 0: true, 1: true, 2: true }, catatan: 'Mampu meminjam puluhan dengan benar' },
      { no: 6, nama: 'AQILLA FARIZA MUFIA', indikatorNilai: { 0: true, 1: true, 2: true }, catatan: 'Sangat mandiri' },
      { no: 7, nama: 'ARKAN SHAQUILLE KAMIL', indikatorNilai: { 0: true, 1: true, 2: true }, catatan: 'Aktif maju ke papan tulis' },
      { no: 8, nama: 'ASHILA SHAFIYURRAHMAH', indikatorNilai: { 0: true, 1: true, 2: true }, catatan: 'Semua jawaban benar' },
      { no: 9, nama: 'EGI PUTRA LESMANA', indikatorNilai: { 0: true, 1: true, 2: true }, catatan: 'Fokus belajar baik' },
      { no: 10, nama: 'ENZO ARKAN ZAIDAN FATHURRAHMAN', indikatorNilai: { 0: true, 1: true, 2: true }, catatan: 'Logika matematika bagus' },
      { no: 11, nama: 'FATHIYAH KHAIRINA', indikatorNilai: { 0: true, 1: true, 2: true }, catatan: 'Selesai tepat waktu' },
      { no: 12, nama: 'HABIBAH HUMAIRA HASAN', indikatorNilai: { 0: true, 1: true, 2: true }, catatan: 'Penulisan nilai tempat rapi' },
      { no: 13, nama: 'HANA SHIDQIA', indikatorNilai: { 0: true, 1: true, 2: true }, catatan: 'Teliti dalam menghitung' },
      { no: 14, nama: 'HILMA AZKIYA FADLY', indikatorNilai: { 0: true, 1: true, 2: true }, catatan: 'Memahami sifat asosiatif' },
      { no: 15, nama: 'JIHAN ADZKIYA', indikatorNilai: { 0: true, 1: true, 2: true }, catatan: 'Sangat teliti' },
      { no: 16, nama: 'KYLA DEVI MAHARANI', indikatorNilai: { 0: true, 1: true, 2: true }, catatan: 'Pengurangan meminjam lancar' },
      { no: 17, nama: 'MUHAMMAD ALTHAF HABIBIE', indikatorNilai: { 0: true, 1: true, 2: true }, catatan: 'Konsentrasi baik' },
      { no: 18, nama: 'SHEVA BIANDA ALFATHUNISA', indikatorNilai: { 0: true, 1: true, 2: true }, catatan: 'Skor sempurna' },
      { no: 19, nama: 'SYABIL RAFKY HAFIDZUAN', indikatorNilai: { 0: true, 1: true, 2: true }, catatan: 'Koreksi mandiri tepat' }
    ]
  },
  lampiran: {
    lkpd: {
      judulLKPD: 'Latihan Operasi Hitung: Sifat Pertukaran & Pengurangan Bilangan',
      petunjukPengerjaan: [
        '1. Buka buku paket Matematika halaman 52, 54, 60, dan 63-64.',
        '2. Kerjakan soal dengan langkah runtut dan rapi.',
        '3. Periksa kembali sebelum dikumpulkan ke guru.'
      ],
      aktivitas: [
        {
          langkah: 'Latihan 1: Sifat Pertukaran',
          instruksi: 'Tuliskan bentuk pertukaran dari penjumlahan 24 + 36 = ... + ...'
        },
        {
          langkah: 'Latihan 2: Pengurangan Meminjam',
          instruksi: 'Hitunglah 52 - 28 menggunakan cara susun pendek dengan meminjam 1 puluhan.'
        }
      ],
      tugasKelompokOrIndividu: 'Latihan Individu Buku Matematika'
    },
    bahanBacaanGuruDanSiswa: 'Sifat pertukaran (komutatif): a + b = b + a. Sifat pengelompokan (asosiatif): (a + b) + c = a + (b + c). Pada pengurangan meminjam: 1 puluhan bernilai 10 satuan.',
    glosarium: [
      { istilah: 'Komutatif', arti: 'Sifat pertukaran urutan bilangan yang menghasilkan nilai sama.' },
      { istilah: 'Asosiatif', arti: 'Sifat pengelompokan bilangan dalam operasi hitung.' },
      { istilah: 'Nilai Tempat', arti: 'Nilai dari suatu angka berdasarkan posisinya (satuan, puluhan, ratusan).' }
    ],
    daftarPustaka: [
      'Buku Siswa Matematika Kelas 3 SD/MI Kurikulum Merdeka, Kemendikbudristek.',
      'Bank Soal Operasi Hitung SDQ Al Mahmudah.'
    ]
  }
};

// Set default initial modul to TIK from user's PDF
export const SAMPLE_MODUL_AJAR: ModulAjar = SAMPLE_MODUL_AJAR_TIK;

export const SAMPLE_BANK_SOAL: BankSoalPaket = {
  id: 'soal-sample-tik',
  judulPaket: 'Bank Soal Formatif TIK Kelas 3 - Fitur Aplikasi Paint',
  mataPelajaran: 'TIK',
  fase: 'Fase B (Kelas 3-4)',
  kelas: 'Kelas 3',
  topik: 'Fitur Aplikasi Paint & Gambar Sederhana',
  createdAt: new Date().toISOString(),
  daftarSoal: [
    {
      id: 'q-1',
      tipe: 'Pilihan Ganda',
      tingkat: 'Dasar (LOTS)',
      target: 'Reguler',
      tujuanPembelajaran: 'Mengenal fungsi alat gambar pada Paint',
      stimulus: 'Ahmad ingin membuat gambar matahari bulat sempurna dan mewarnainya dengan warna kuning cerah di aplikasi Paint.',
      pertanyaan: 'Alat (tools) apa yang paling tepat digunakan Ahmad untuk membuat bentuk bulat dan mewarnai bagian dalamnya secara cepat?',
      pilihanJawaban: [
        'A. Pensil (Pencil) dan Penghapus (Eraser)',
        'B. Shapes Lingkaran (Oval) dan Fill with Color (Ember Cat)',
        'C. Kuas (Brushes) dan Kaca Pembesar (Magnifier)',
        'D. Text Tool dan Color Picker'
      ],
      kunciJawaban: 'B. Shapes Lingkaran (Oval) dan Fill with Color (Ember Cat)',
      pembahasan: 'Shapes Oval berfungsi membuat bentuk lingkaran sempurna secara otomatis, dan Fill with Color (ember cat) berfungsi mengisi area tertutup dengan warna dalam satu kali klik.',
      bobotSkor: 20
    },
    {
      id: 'q-2',
      tipe: 'Pilihan Ganda Kompleks',
      tingkat: 'Sedang (MOTS)',
      target: 'Reguler',
      tujuanPembelajaran: 'Mengidentifikasi fitur bentuk shapes pada Paint',
      stimulus: 'Berikut adalah daftar bagian bentuk pada gambar rumah sederhana: Atap (Segitiga), Dinding (Persegi), Pintu (Persegi Panjang), Jendela (Kotak).',
      pertanyaan: 'Manakah pernyataan yang BENAR mengenai fitur Shapes di aplikasi Paint? (Pilih lebih dari satu)',
      pilihanJawaban: [
        'A. Shapes menyediakan bentuk segitiga, persegi panjang, dan bintang secara otomatis.',
        'B. Warna garis luar shapes dapat diubah pada Color Palette.',
        'C. Shapes hanya bisa digambar dalam warna hitam putih.',
        'D. Tebal garis shapes dapat diatur menggunakan menu Size.'
      ],
      kunciJawaban: [
        'A. Shapes menyediakan bentuk segitiga, persegi panjang, dan bintang secara otomatis.',
        'B. Warna garis luar shapes dapat diubah pada Color Palette.',
        'D. Tebal garis shapes dapat diatur menggunakan menu Size.'
      ],
      pembahasan: 'Di Paint, fitur shapes sangat fleksibel; kita dapat memilih aneka bentuk geometri, mengatur ketebalan garis melalui menu Size, dan menentukan warna garis luar (Outline) maupun warna isian (Fill).',
      bobotSkor: 25
    },
    {
      id: 'q-3',
      tipe: 'Uraian (HOTS)',
      tingkat: 'Tinggi (HOTS)',
      target: 'Pengayaan',
      tujuanPembelajaran: 'Menganalisis masalah pewarnaan yang bocor pada Paint',
      stimulus: 'Ketika Fatimah menggunakan alat Fill with Color (ember cat) untuk mewarnai atap rumah dengan warna merah, seluruh layar kanvas putihnya ikut berubah menjadi merah.',
      pertanyaan: 'Mengapa hal tersebut bisa terjadi dan langkah apa yang harus dilakukan Fatimah untuk memperbaikinya?',
      kunciJawaban: 'Hal itu terjadi karena garis bentuk atap belum tertutup rapat (ada celah/lubang garis terbuka). Solusinya: Klik Undo (Ctrl+Z), lalu gunakan alat Pencil atau Brush untuk menyambung celah garis hingga benar-benar tertutup rapat sebelum mengklik Fill with Color kembali.',
      pembahasan: 'Alat Fill with Color bekerja dengan mengisi semua piksel warna yang tersambung. Jika garis pembatas memiliki celah meskipun 1 piksel, warna akan bocor ke area kanvas lainnya.',
      bobotSkor: 30
    },
    {
      id: 'q-4',
      tipe: 'Isian Singkat',
      tingkat: 'Dasar (LOTS)',
      target: 'Remedial',
      tujuanPembelajaran: 'Mengetahui cara mematikan komputer dengan tertib',
      pertanyaan: 'Setelah selesai menggambar di aplikasi Paint dan menyimpannya, langkah tertib yang benar sebelum meninggalkan laboratorium komputer adalah mematikan komputer melalui tombol menu ...',
      kunciJawaban: 'Start > Shut Down',
      pembahasan: 'Mematikan komputer wajib menggunakan prosedur standar Start -> Shut Down agar sistem operasi dan data tersimpan dengan aman.',
      bobotSkor: 25
    }
  ]
};

export const SAMPLE_BANK_SOAL_PAKET: BankSoalPaket = SAMPLE_BANK_SOAL;

export const SAMPLE_ASSESSMENT_PROJECT: AssessmentProject = {
  id: 'assessment-sdq-al-mahmudah',
  judul: 'Buku Nilai & Asesmen TIK Kelas 3 Zaid bin Tsabit - SDQ Al Mahmudah',
  mataPelajaran: 'TIK',
  kelas: '3 Zaid bin Tsabit',
  semester: 'Ganjil',
  tahunAjaran: '2026/2027',
  kkmKktp: 75,
  daftarTP: [
    { id: 'tp-1', kode: 'TP 3.1', deskripsi: 'Mengenali dan menyebutkan fungsi fitur sederhana aplikasi Paint' },
    { id: 'tp-2', kode: 'TP 3.2', deskripsi: 'Menggunakan mouse dan fitur Paint untuk membuat gambar sederhana' },
    { id: 'tp-3', kode: 'TP 3.3', deskripsi: 'Menunjukkan kreativitas dan tanggung jawab dalam penggunaan perangkat (Kreativitas & Tanggung Jawab)' }
  ],
  daftarSiswa: [
    { id: 's-1', nisn: '002026001', nama: 'ABU BAKAR AL-RASYID', gender: 'L', gayaBelajar: 'Kinestetik', kategoriAwal: 'Mahir' },
    { id: 's-2', nisn: '002026002', nama: 'ANDRYA NAIFA FADELA RUBIYANTO', gender: 'P', gayaBelajar: 'Visual', kategoriAwal: 'Mahir' },
    { id: 's-3', nisn: '002026003', nama: 'ARASHYA KINZA KIANO', gender: 'L', gayaBelajar: 'Visual', kategoriAwal: 'Cukup' },
    { id: 's-4', nisn: '002026004', nama: 'ARKANSYAH PUTRA ELBI', gender: 'L', gayaBelajar: 'Kinestetik', kategoriAwal: 'Cukup' },
    { id: 's-5', nisn: '002026005', nama: 'ARRAFI FARZAN SHAKEEL', gender: 'L', gayaBelajar: 'Auditori', kategoriAwal: 'Cukup' },
    { id: 's-6', nisn: '002026006', nama: 'ARSYILA KHANZA FAUZIAH', gender: 'P', gayaBelajar: 'Visual', kategoriAwal: 'Mahir' },
    { id: 's-7', nisn: '002026007', nama: 'FATIMA KANAYA LARASATI', gender: 'P', gayaBelajar: 'Auditori', kategoriAwal: 'Mahir' },
    { id: 's-8', nisn: '002026008', nama: 'FATIMAH AZ ZAHRA', gender: 'P', gayaBelajar: 'Visual', kategoriAwal: 'Mahir' },
    { id: 's-9', nisn: '002026009', nama: 'FEAZIA MOUNERA', gender: 'P', gayaBelajar: 'Visual', kategoriAwal: 'Mahir' },
    { id: 's-10', nisn: '002026010', nama: 'IBRAHIM NAZRIL RASYAD', gender: 'L', gayaBelajar: 'Kinestetik', kategoriAwal: 'Cukup' },
    { id: 's-11', nisn: '002026011', nama: 'KHOSYATILLAH ADZKADINA', gender: 'P', gayaBelajar: 'Auditori', kategoriAwal: 'Cukup' },
    { id: 's-12', nisn: '002026012', nama: 'MUHAMAD AGAM PUTRA SISMAYA', gender: 'L', gayaBelajar: 'Kinestetik', kategoriAwal: 'Perlu Bimbingan' },
    { id: 's-13', nisn: '002026013', nama: 'MUHAMAD ALIF ALFATIH', gender: 'L', gayaBelajar: 'Visual', kategoriAwal: 'Cukup' },
    { id: 's-14', nisn: '002026014', nama: 'MUHAMMAD FAIZ ALFARIQ', gender: 'L', gayaBelajar: 'Kinestetik', kategoriAwal: 'Cukup' },
    { id: 's-15', nisn: '002026015', nama: 'MUKHAMMAD EMIR RAYYAN', gender: 'L', gayaBelajar: 'Visual', kategoriAwal: 'Mahir' },
    { id: 's-16', nisn: '002026016', nama: 'NAIMA ZITA NURALISHBA', gender: 'P', gayaBelajar: 'Visual', kategoriAwal: 'Mahir' },
    { id: 's-17', nisn: '002026017', nama: 'NAJWA SHAKILA KAFABIH', gender: 'P', gayaBelajar: 'Auditori', kategoriAwal: 'Cukup' },
    { id: 's-18', nisn: '002026018', nama: 'RATU AKLEEMA AR RUKMANA', gender: 'P', gayaBelajar: 'Visual', kategoriAwal: 'Mahir' },
    { id: 's-19', nisn: '002026019', nama: 'SYAHNA ALIFIYA FIRDAUS', gender: 'P', gayaBelajar: 'Auditori', kategoriAwal: 'Cukup' },
    { id: 's-20', nisn: '002026020', nama: 'ZHAFIRA SWASTININGRUM', gender: 'P', gayaBelajar: 'Visual', kategoriAwal: 'Mahir' }
  ],
  rekapNilai: [
    {
      siswaId: 's-1',
      namaSiswa: 'ABU BAKAR AL-RASYID',
      gender: 'L',
      nilaiPerTP: [
        { tujuanPembelajaranId: 'tp-1', tujuanPembelajaranTeks: 'TP 3.1', nilaiFormatif: 92, nilaiSumatif: 95, statusKKTP: 'Sangat Baik' },
        { tujuanPembelajaranId: 'tp-2', tujuanPembelajaranTeks: 'TP 3.2', nilaiFormatif: 90, nilaiSumatif: 92, statusKKTP: 'Sangat Baik' },
        { tujuanPembelajaranId: 'tp-3', tujuanPembelajaranTeks: 'TP 3.3', nilaiFormatif: 88, nilaiSumatif: 90, statusKKTP: 'Sangat Baik' }
      ],
      nilaiRataRata: 91,
      statusAkhir: 'Tercapai Sangat Baik',
      catatanDeskripsiRapor: 'Ananda Abu Bakar sangat terampil mengoperasikan mouse dan fitur Paint serta menunjukkan kreativitas menggambar yang tinggi.'
    },
    {
      siswaId: 's-2',
      namaSiswa: 'ANDRYA NAIFA FADELA RUBIYANTO',
      gender: 'P',
      nilaiPerTP: [
        { tujuanPembelajaranId: 'tp-1', tujuanPembelajaranTeks: 'TP 3.1', nilaiFormatif: 90, nilaiSumatif: 92, statusKKTP: 'Sangat Baik' },
        { tujuanPembelajaranId: 'tp-2', tujuanPembelajaranTeks: 'TP 3.2', nilaiFormatif: 94, nilaiSumatif: 96, statusKKTP: 'Sangat Baik' },
        { tujuanPembelajaranId: 'tp-3', tujuanPembelajaranTeks: 'TP 3.3', nilaiFormatif: 90, nilaiSumatif: 92, statusKKTP: 'Sangat Baik' }
      ],
      nilaiRataRata: 92,
      statusAkhir: 'Tercapai Sangat Baik',
      catatanDeskripsiRapor: 'Ananda Andrya Naifa sangat mandiri dan rapi dalam membuat gambar rumah dan pemandangan di Paint.'
    },
    {
      siswaId: 's-3',
      namaSiswa: 'ARASHYA KINZA KIANO',
      gender: 'L',
      nilaiPerTP: [
        { tujuanPembelajaranId: 'tp-1', tujuanPembelajaranTeks: 'TP 3.1', nilaiFormatif: 82, nilaiSumatif: 84, statusKKTP: 'Tercapai (Optimal)' },
        { tujuanPembelajaranId: 'tp-2', tujuanPembelajaranTeks: 'TP 3.2', nilaiFormatif: 80, nilaiSumatif: 82, statusKKTP: 'Tercapai (Optimal)' },
        { tujuanPembelajaranId: 'tp-3', tujuanPembelajaranTeks: 'TP 3.3', nilaiFormatif: 80, nilaiSumatif: 82, statusKKTP: 'Tercapai (Optimal)' }
      ],
      nilaiRataRata: 82,
      statusAkhir: 'Tercapai (Optimal)',
      catatanDeskripsiRapor: 'Ananda Arashya menguasai teknik pewarnaan shapes dengan baik dan tertib selama praktik.'
    },
    {
      siswaId: 's-4',
      namaSiswa: 'ARKANSYAH PUTRA ELBI',
      gender: 'L',
      nilaiPerTP: [
        { tujuanPembelajaranId: 'tp-1', tujuanPembelajaranTeks: 'TP 3.1', nilaiFormatif: 78, nilaiSumatif: 80, statusKKTP: 'Tercapai (Optimal)' },
        { tujuanPembelajaranId: 'tp-2', tujuanPembelajaranTeks: 'TP 3.2', nilaiFormatif: 80, nilaiSumatif: 82, statusKKTP: 'Tercapai (Optimal)' },
        { tujuanPembelajaranId: 'tp-3', tujuanPembelajaranTeks: 'TP 3.3', nilaiFormatif: 78, nilaiSumatif: 80, statusKKTP: 'Tercapai (Optimal)' }
      ],
      nilaiRataRata: 80,
      statusAkhir: 'Tercapai (Optimal)',
      catatanDeskripsiRapor: 'Ananda Arkansyah mampu menyelesaikan tugas gambar Paint dengan bentuk geometris yang baik.'
    },
    {
      siswaId: 's-12',
      namaSiswa: 'MUHAMAD AGAM PUTRA SISMAYA',
      gender: 'L',
      nilaiPerTP: [
        { tujuanPembelajaranId: 'tp-1', tujuanPembelajaranTeks: 'TP 3.1', nilaiFormatif: 70, nilaiSumatif: 74, statusKKTP: 'Tercapai Bersyarat' },
        { tujuanPembelajaranId: 'tp-2', tujuanPembelajaranTeks: 'TP 3.2', nilaiFormatif: 72, nilaiSumatif: 75, statusKKTP: 'Tercapai Bersyarat' },
        { tujuanPembelajaranId: 'tp-3', tujuanPembelajaranTeks: 'TP 3.3', nilaiFormatif: 74, nilaiSumatif: 76, statusKKTP: 'Tercapai Bersyarat' }
      ],
      nilaiRataRata: 74,
      statusAkhir: 'Tercapai Bersyarat',
      catatanDeskripsiRapor: 'Ananda Muhamad Agam menunjukkan kemajuan baik dalam mengoperasikan mouse dan perlu pembiasaan membuat garis lurus di Paint.'
    }
  ]
};

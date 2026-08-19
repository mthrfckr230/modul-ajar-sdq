import { ModulAjar } from '../types';
import { getAccessToken } from './firebase';
import { getOrCreateAppFolder } from './googleDriveService';

export async function exportModulToGoogleDocs(modul: ModulAjar): Promise<{ docId: string; docUrl: string }> {
  const token = await getAccessToken();
  if (!token) throw new Error('Silakan login dengan akun Google terlebih dahulu');

  const kop = modul.kopSekolah;
  const identitas = modul.identitas;
  const komponenAwal = modul.komponenAwal;
  const komponenInti = modul.komponenInti;
  const lembarAsesmen = modul.lembarAsesmenMurid;

  // 1. Create a blank Google Document
  const createDocRes = await fetch('https://docs.googleapis.com/v1/documents', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: `Modul Ajar ${identitas.mataPelajaran} - ${identitas.namaKelasSpesifik || identitas.kelas} - ${identitas.namaGuruBidangStudi || identitas.namaPenyusun}`
    })
  });

  if (!createDocRes.ok) {
    const err = await createDocRes.json();
    throw new Error(err.error?.message || 'Gagal membuat Google Doc');
  }

  const docData = await createDocRes.json();
  const docId = docData.documentId;

  // 2. Move file into the App Folder in Drive
  try {
    const folderId = await getOrCreateAppFolder();
    await fetch(`https://www.googleapis.com/drive/v3/files/${docId}?addParents=${folderId}&fields=id,parents`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  } catch (folderErr) {
    console.warn('Could not move doc to specific folder:', folderErr);
  }

  // 3. Build text body for batchUpdate matching authentic PDF format
  let contentText = '';

  // Kop Yayasan / Sekolah
  contentText += `${kop?.namaYayasan || 'YAYASAN SIROJUL MUKHLASIN'}\n`;
  if (kop?.aktaNotaris) contentText += `${kop.aktaNotaris}\n`;
  if (kop?.skKemenkumham) contentText += `${kop.skKemenkumham}\n`;
  contentText += `${kop?.jenjangSekolah || "SEKOLAH DASAR QUR'AN"}\n`;
  contentText += `${kop?.namaSekolah || 'SDQ AL MAHMUDAH'}\n`;
  contentText += `${kop?.alamatSekolah || 'Kp. Cogreg Rt 002/003 Ds. Cogreg Kec. Parung Kab. Bogor-Jawa Barat'}\n`;
  contentText += `_________________________________________________________________________________\n\n`;

  // Judul
  contentText += `MODUL AJAR\n\n`;

  // Identitas & Info 2-Kolom
  contentText += `Nama Guru            : ${identitas.namaGuruBidangStudi || identitas.namaPenyusun}\n`;
  contentText += `Satuan Pendidikan    : ${kop?.namaSekolah || identitas.namaSekolah}\n`;
  contentText += `Mapel                : ${identitas.mataPelajaran}\n`;
  contentText += `Alokasi Waktu        : ${identitas.alokasiWaktu}\n`;
  contentText += `Fase                 : ${identitas.fase.replace('Fase ', '').split(' ')[0]}\n`;
  contentText += `Kelas / Semester     : ${identitas.kelas} (${identitas.namaKelasSpesifik || ''})\n`;
  contentText += `Hari / Tanggal       : ${identitas.hariTanggal || 'Sesuai Jadwal'}\n`;
  contentText += `Model Pembelajaran   : ${identitas.modelPembelajaranTeks || komponenAwal.modelPembelajaran}\n`;
  contentText += `Sarana & Prasarana   : ${identitas.saranaPrasaranaTeks || komponenAwal.saranaPrasarana.join(', ')}\n`;
  contentText += `Target Murid         : ${identitas.targetMuridTeks || komponenAwal.targetPesertaDidik}\n\n`;

  // Soft Skills
  contentText += `Soft skills : ${identitas.softSkillsTeks || 'tanggung jawab, mandiri, jujur, teliti, percaya diri, kreativitas, berpikir kritis.'}\n\n`;

  // Tujuan Pembelajaran
  contentText += `Tujuan Pembelajaran:\n`;
  komponenInti.tujuanPembelajaran.forEach((tp) => {
    contentText += `• ${tp}\n`;
  });
  contentText += `\n`;

  // Pertanyaan Pemantik vs Kriteria KKTP
  contentText += `Pertanyaan Pemantik:\n`;
  komponenInti.pertanyaanPemantik.forEach((pp, idx) => {
    contentText += `${idx + 1}. ${pp}\n`;
  });
  contentText += `\nKriteria untuk Mengukur Ketercapaian TP:\n`;
  komponenInti.kriteriaKetercapaianTP.forEach((kktp) => {
    contentText += `• ${kktp}\n`;
  });
  contentText += `\n`;

  // Langkah-Langkah Pembelajaran
  contentText += `Langkah-langkah Pembelajaran:\n\n`;

  contentText += `Pendahuluan:\n`;
  (komponenInti.kegiatanPembelajaran[0]?.pendahuluan.kegiatan || []).forEach((k) => {
    contentText += `✓ ${k.replace(/^([✓•\-\d\.]+\s*)/, '')}\n`;
  });
  contentText += `\n`;

  contentText += `Kegiatan Inti (Sintaks: ${komponenInti.kegiatanPembelajaran[0]?.inti.sintaks || komponenAwal.modelPembelajaran}):\n`;
  (komponenInti.kegiatanPembelajaran[0]?.inti.kegiatan || []).forEach((k) => {
    contentText += `➢ ${k.replace(/^([➢•\-\d\.]+\s*)/, '')}\n`;
  });
  if (komponenInti.kegiatanPembelajaran[0]?.inti.diferensiasiAktivitas) {
    contentText += `* Catatan Diferensiasi: ${komponenInti.kegiatanPembelajaran[0].inti.diferensiasiAktivitas}\n`;
  }
  contentText += `\n`;

  contentText += `Penutup:\n`;
  (komponenInti.kegiatanPembelajaran[0]?.penutup.kegiatan || []).forEach((k) => {
    contentText += `▪ ${k.replace(/^([▪•\-\d\.]+\s*)/, '')}\n`;
  });
  contentText += `\n`;

  // Pengesahan / Tanda Tangan
  contentText += `Mengetahui,\n`;
  contentText += `WAKASEK Kurikulum: ${identitas.namaWakasekKurikulum || 'Riana Rizki Abidin, S. S'}\n`;
  contentText += `Guru Bidang Studi: ${identitas.namaGuruBidangStudi || identitas.namaPenyusun}\n\n`;
  contentText += `=================================================================================\n\n`;

  // Lembar Asesmen Kegiatan Murid
  contentText += `Lembar Asesmen Kegiatan Murid\n`;
  contentText += `Mata Pelajaran : ${lembarAsesmen?.mataPelajaran || identitas.mataPelajaran}\n`;
  contentText += `Kelas          : ${lembarAsesmen?.kelas || identitas.namaKelasSpesifik || identitas.kelas}\n`;
  contentText += `Hari/tanggal   : ${lembarAsesmen?.hariTanggal || identitas.hariTanggal || 'Rabu, 19 Agustus 2026'}\n\n`;

  contentText += `Daftar Penilaian Siswa:\n`;
  contentText += `No | Nama Siswa | Indikator (1, 2, 3) | Catatan\n`;
  (lembarAsesmen?.daftarSiswa || []).forEach((s) => {
    const ind1 = s.indikatorNilai[0] ? '✓' : '-';
    const ind2 = s.indikatorNilai[1] ? '✓' : '-';
    const ind3 = s.indikatorNilai[2] ? '✓' : '-';
    contentText += `${s.no}. ${s.nama.padEnd(30, ' ')} | [${ind1} ${ind2} ${ind3}] | ${s.catatan || ''}\n`;
  });
  contentText += `\nKeterangan Indikator:\n`;
  (lembarAsesmen?.indikator || komponenInti.kriteriaKetercapaianTP).forEach((ind, i) => {
    contentText += `${i + 1}. ${ind}\n`;
  });

  // 4. Batch update Google Docs text
  const updateRes = await fetch(`https://docs.googleapis.com/v1/documents/${docId}:batchUpdate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      requests: [
        {
          insertText: {
            location: {
              index: 1
            },
            text: contentText
          }
        }
      ]
    })
  });

  if (!updateRes.ok) {
    const err = await updateRes.json();
    throw new Error(err.error?.message || 'Gagal mengisi konten ke Google Doc');
  }

  const docUrl = `https://docs.google.com/document/d/${docId}/edit`;
  return { docId, docUrl };
}

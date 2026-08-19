import { AssessmentProject } from '../types';
import { getAccessToken } from './firebase';
import { getOrCreateAppFolder } from './googleDriveService';

export async function createOrSyncStudentSpreadsheet(project: AssessmentProject): Promise<{ spreadsheetId: string; spreadsheetUrl: string }> {
  const token = await getAccessToken();
  if (!token) throw new Error('Silakan login dengan akun Google terlebih dahulu');

  let spreadsheetId = project.googleSpreadsheetId;

  // 1. If no spreadsheet ID exists yet, create one
  if (!spreadsheetId) {
    const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        properties: {
          title: `Database Penilaian Kurikulum Merdeka - ${project.mataPelajaran} (${project.kelas})`
        },
        sheets: [
          {
            properties: {
              title: 'Rekap_Nilai_Capaian_TP',
              gridProperties: { rowCount: 100, columnCount: 20 }
            }
          },
          {
            properties: {
              title: 'Master_Tujuan_Pembelajaran',
              gridProperties: { rowCount: 50, columnCount: 10 }
            }
          }
        ]
      })
    });

    if (!createRes.ok) {
      const err = await createRes.json();
      throw new Error(err.error?.message || 'Gagal membuat Google Spreadsheet');
    }

    const sheetData = await createRes.json();
    spreadsheetId = sheetData.spreadsheetId;

    // Move to App folder
    try {
      const folderId = await getOrCreateAppFolder();
      await fetch(`https://www.googleapis.com/drive/v3/files/${spreadsheetId}?addParents=${folderId}&fields=id,parents`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (fErr) {
      console.warn('Folder move skipped:', fErr);
    }
  }

  // 2. Build row values for "Rekap_Nilai_Capaian_TP"
  // Headers
  const tpHeaders: string[] = [];
  project.daftarTP.forEach((tp) => {
    tpHeaders.push(`${tp.kode} (Formatif)`);
    tpHeaders.push(`${tp.kode} (Sumatif)`);
  });

  const headers = [
    'No',
    'NISN',
    'Nama Lengkap Siswa',
    'L/P',
    'Gaya Belajar',
    ...tpHeaders,
    'Nilai Rata-rata',
    'Status Capaian KKTP',
    'Deskripsi Capaian Rapor'
  ];

  const rows: any[][] = [headers];

  project.rekapNilai.forEach((r, idx) => {
    const studentInfo = project.daftarSiswa.find(s => s.id === r.siswaId);
    const rowValues: any[] = [
      idx + 1,
      studentInfo?.nisn || '-',
      r.namaSiswa,
      r.gender,
      studentInfo?.gayaBelajar || 'Visual'
    ];

    project.daftarTP.forEach(tp => {
      const tpScore = r.nilaiPerTP.find(n => n.tujuanPembelajaranId === tp.id);
      rowValues.push(tpScore ? tpScore.nilaiFormatif : 0);
      rowValues.push(tpScore ? tpScore.nilaiSumatif : 0);
    });

    rowValues.push(r.nilaiRataRata);
    rowValues.push(r.statusAkhir);
    rowValues.push(r.catatanDeskripsiRapor);

    rows.push(rowValues);
  });

  // Write Rekap Sheet
  const updateRekapRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Rekap_Nilai_Capaian_TP!A1?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        range: 'Rekap_Nilai_Capaian_TP!A1',
        majorDimension: 'ROWS',
        values: rows
      })
    }
  );

  if (!updateRekapRes.ok) {
    const err = await updateRekapRes.json();
    throw new Error(err.error?.message || 'Gagal menyinkronkan data ke Google Sheet');
  }

  // Write Master TP Sheet
  const tpRows: any[][] = [
    ['Kode TP', 'Deskripsi Tujuan Pembelajaran (Capaian Kompetensi)']
  ];
  project.daftarTP.forEach(tp => {
    tpRows.push([tp.kode, tp.deskripsi]);
  });

  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Master_Tujuan_Pembelajaran!A1?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        range: 'Master_Tujuan_Pembelajaran!A1',
        majorDimension: 'ROWS',
        values: tpRows
      })
    }
  );

  const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;
  return { spreadsheetId: spreadsheetId!, spreadsheetUrl };
}

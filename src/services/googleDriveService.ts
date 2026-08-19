import { GoogleDriveFileInfo, ModulAjar } from '../types';
import { getAccessToken } from './firebase';

const APP_FOLDER_NAME = 'AI Modul Ajar - Kurikulum Merdeka';

export async function getOrCreateAppFolder(): Promise<string> {
  const token = await getAccessToken();
  if (!token) throw new Error('Token Google tidak ditemukan. Silakan login dengan Google terlebih dahulu.');

  // 1. Search if folder already exists
  const query = encodeURIComponent(`mimeType='application/vnd.google-apps.folder' and name='${APP_FOLDER_NAME}' and trashed=false`);
  const searchRes = await fetch(`https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name)`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!searchRes.ok) {
    const err = await searchRes.json();
    throw new Error(err.error?.message || 'Gagal mencari folder di Google Drive');
  }

  const searchData = await searchRes.json();
  if (searchData.files && searchData.files.length > 0) {
    return searchData.files[0].id;
  }

  // 2. If not found, create folder
  const createRes = await fetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: APP_FOLDER_NAME,
      mimeType: 'application/vnd.google-apps.folder',
      description: 'Folder penyimpanan Modul Ajar, Bank Soal, dan Database Nilai Kurikulum Merdeka'
    })
  });

  if (!createRes.ok) {
    const err = await createRes.json();
    throw new Error(err.error?.message || 'Gagal membuat folder di Google Drive');
  }

  const folderData = await createRes.json();
  return folderData.id;
}

export async function saveModulToDrive(modul: ModulAjar): Promise<{ fileId: string; webViewLink: string }> {
  const token = await getAccessToken();
  if (!token) throw new Error('Silakan login dengan akun Google terlebih dahulu');

  const folderId = await getOrCreateAppFolder();
  const fileName = `Modul_${modul.identitas.mataPelajaran.replace(/[^a-zA-Z0-9]/g, '_')}_${modul.identitas.kelas.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.json`;

  const metadata = {
    name: fileName,
    parents: [folderId],
    description: `Modul Ajar Kurikulum Merdeka: ${modul.judul}`,
    mimeType: 'application/json'
  };

  const fileContent = JSON.stringify(modul, null, 2);
  const boundary = '-------314159265358979323846';
  const delimiter = "\r\n--" + boundary + "\r\n";
  const closeDelim = "\r\n--" + boundary + "--";

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    'Content-Type: application/json\r\n\r\n' +
    fileContent +
    closeDelim;

  const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': `multipart/related; boundary=${boundary}`
    },
    body: multipartRequestBody
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || 'Gagal menyimpan file ke Google Drive');
  }

  const data = await res.json();
  return {
    fileId: data.id,
    webViewLink: data.webViewLink || `https://drive.google.com/file/d/${data.id}/view`
  };
}

export async function listAppFiles(): Promise<GoogleDriveFileInfo[]> {
  const token = await getAccessToken();
  if (!token) return [];

  try {
    const folderId = await getOrCreateAppFolder();
    const query = encodeURIComponent(`'${folderId}' in parents and trashed=false`);
    const res = await fetch(`https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,mimeType,webViewLink,createdTime,modifiedTime,size)&orderBy=modifiedTime desc`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) return [];
    const data = await res.json();
    return data.files || [];
  } catch (err) {
    console.error('Error listing files from Google Drive:', err);
    return [];
  }
}

export async function loadModulFromDrive(fileId: string): Promise<ModulAjar> {
  const token = await getAccessToken();
  if (!token) throw new Error('Token otentikasi tidak ditemukan');

  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    throw new Error('Gagal mengunduh file modul dari Google Drive');
  }

  const data = await res.json();
  return data as ModulAjar;
}

export async function deleteDriveFile(fileId: string): Promise<void> {
  const token = await getAccessToken();
  if (!token) throw new Error('Token otentikasi tidak ditemukan');

  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok && res.status !== 204) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Gagal menghapus file dari Google Drive');
  }
}

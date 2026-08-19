import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  UnderlineType,
  ShadingType
} from 'docx';
import { ModulAjar } from '../types';

export async function generateDocxBlob(modul: ModulAjar): Promise<Blob> {
  const kop = modul.kopSekolah;
  const identitas = modul.identitas;
  const komponenAwal = modul.komponenAwal;
  const komponenInti = modul.komponenInti;
  const lembarAsesmen = modul.lembarAsesmenMurid;

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1000,
              bottom: 1000,
              left: 1100,
              right: 1100,
            },
          },
        },
        children: [
          // 1. KOP SEKOLAH
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: kop?.namaYayasan || 'YAYASAN SIROJUL MUKHLASIN',
                bold: true,
                size: 24, // 12pt
                font: 'Arial',
              }),
            ],
          }),
          ...(kop?.aktaNotaris ? [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: kop.aktaNotaris,
                  size: 16, // 8pt
                  font: 'Arial',
                }),
              ],
            }),
          ] : []),
          ...(kop?.skKemenkumham ? [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: kop.skKemenkumham,
                  size: 16,
                  font: 'Arial',
                }),
              ],
            }),
          ] : []),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: kop?.jenjangSekolah || "SEKOLAH DASAR QUR'AN",
                bold: true,
                size: 22,
                font: 'Arial',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: kop?.namaSekolah || 'SDQ AL MAHMUDAH',
                bold: true,
                size: 24,
                font: 'Arial',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: kop?.alamatSekolah || 'Kp. Cogreg Rt 002/003 Ds. Cogreg Kec. Parung Kab. Bogor-Jawa Barat',
                italics: true,
                size: 16,
                font: 'Arial',
              }),
            ],
            spacing: { after: 150 },
          }),

          // Divider Line
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: '_________________________________________________________________________________',
                bold: true,
                size: 18,
              }),
            ],
            spacing: { after: 200 },
          }),

          // JUDUL: MODUL AJAR
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'MODUL AJAR',
                bold: true,
                size: 24,
                underline: { type: UnderlineType.SINGLE },
                font: 'Arial',
              }),
            ],
            spacing: { after: 200 },
          }),

          // TABEL INFORMASI 2 KOLOM
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  // Kolom Kiri
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: [
                      createCompactInfoRow('Nama Guru', identitas.namaGuruBidangStudi || identitas.namaPenyusun),
                      createCompactInfoRow('Mapel', identitas.mataPelajaran),
                      createCompactInfoRow('Fase', identitas.fase.replace('Fase ', '').split(' ')[0]),
                      createCompactInfoRow('Model pembelajaran', identitas.modelPembelajaranTeks || komponenAwal.modelPembelajaran),
                      createCompactInfoRow('Sarana dan prasarana', identitas.saranaPrasaranaTeks || komponenAwal.saranaPrasarana.join(', ')),
                    ],
                  }),
                  // Kolom Kanan
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: [
                      createCompactInfoRow('Satuan pendidikan', kop?.namaSekolah || identitas.namaSekolah),
                      createCompactInfoRow('Alokasi waktu', identitas.alokasiWaktu),
                      createCompactInfoRow('Kelas/semester', identitas.kelas),
                      createCompactInfoRow('Hari/tanggal', identitas.hariTanggal || 'Sesuai Jadwal'),
                      createCompactInfoRow('Target Murid', identitas.targetMuridTeks || komponenAwal.targetPesertaDidik),
                    ],
                  }),
                ],
              }),
            ],
          }),

          // Soft Skills Bar
          new Paragraph({
            children: [
              new TextRun({ text: 'Soft skills : ', bold: true, size: 20, font: 'Arial' }),
              new TextRun({ text: identitas.softSkillsTeks || 'tanggung jawab, mandiri, jujur, teliti, percaya diri, berpikir kritis, kreativitas.', size: 20, font: 'Arial' }),
            ],
            spacing: { before: 150, after: 150 },
          }),

          // Tujuan Pembelajaran
          new Paragraph({
            children: [new TextRun({ text: 'Tujuan pembelajaran:', bold: true, size: 20, font: 'Arial' })],
            spacing: { before: 100, after: 60 },
          }),
          ...komponenInti.tujuanPembelajaran.map(
            (tp) =>
              new Paragraph({
                children: [
                  new TextRun({ text: '•  ', bold: true }),
                  new TextRun({ text: tp, size: 20, font: 'Arial' }),
                ],
                spacing: { after: 40 },
              })
          ),

          // TABEL 2 KOLOM: PERTANYAAN PEMANTIK & KRITERIA KKTP
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    shading: { fill: 'F3F4F6' },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Pertanyaan Pemantik', bold: true, size: 20, font: 'Arial' })] })],
                  }),
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    shading: { fill: 'F3F4F6' },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Kriteria untuk mengukur ketercapaian TP', bold: true, size: 20, font: 'Arial' })] })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  // Pertanyaan Pemantik
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: komponenInti.pertanyaanPemantik.map((pp, idx) =>
                      new Paragraph({
                        children: [
                          new TextRun({ text: `${idx + 1}. `, bold: true }),
                          new TextRun({ text: pp, size: 19, font: 'Arial' }),
                        ],
                        spacing: { after: 50 },
                      })
                    ),
                  }),
                  // Kriteria KKTP
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: komponenInti.kriteriaKetercapaianTP.map((kktp) =>
                      new Paragraph({
                        children: [
                          new TextRun({ text: '• ', bold: true }),
                          new TextRun({ text: kktp, size: 19, font: 'Arial' }),
                        ],
                        spacing: { after: 50 },
                      })
                    ),
                  }),
                ],
              }),
            ],
          }),

          // LANGKAH-LANGKAH PEMBELAJARAN
          new Paragraph({
            children: [new TextRun({ text: 'Langkah-langkah Pembelajaran:', bold: true, size: 20, font: 'Arial' })],
            spacing: { before: 200, after: 100 },
          }),

          // Pendahuluan
          new Paragraph({
            children: [new TextRun({ text: 'Pendahuluan', bold: true, size: 20, font: 'Arial' })],
            spacing: { before: 80, after: 60 },
          }),
          ...(komponenInti.kegiatanPembelajaran[0]?.pendahuluan.kegiatan || []).map(
            (item) =>
              new Paragraph({
                children: [
                  new TextRun({ text: '✓  ', bold: true, color: '16A34A' }),
                  new TextRun({ text: item.replace(/^([✓•\-\d\.]+\s*)/, ''), size: 19, font: 'Arial' }),
                ],
                spacing: { after: 40 },
              })
          ),

          // Kegiatan Inti
          new Paragraph({
            children: [new TextRun({ text: 'Kegiatan Inti', bold: true, size: 20, font: 'Arial' })],
            spacing: { before: 120, after: 60 },
          }),
          ...(komponenInti.kegiatanPembelajaran[0]?.inti.kegiatan || []).map(
            (item) =>
              new Paragraph({
                children: [
                  new TextRun({ text: '➢  ', bold: true, color: '2563EB' }),
                  new TextRun({ text: item.replace(/^([➢•\-\d\.]+\s*)/, ''), size: 19, font: 'Arial' }),
                ],
                spacing: { after: 40 },
              })
          ),

          // Penutup
          new Paragraph({
            children: [new TextRun({ text: 'Penutup', bold: true, size: 20, font: 'Arial' })],
            spacing: { before: 120, after: 60 },
          }),
          ...(komponenInti.kegiatanPembelajaran[0]?.penutup.kegiatan || []).map(
            (item) =>
              new Paragraph({
                children: [
                  new TextRun({ text: '▪  ', bold: true, color: '4B5563' }),
                  new TextRun({ text: item.replace(/^([▪•\-\d\.]+\s*)/, ''), size: 19, font: 'Arial' }),
                ],
                spacing: { after: 40 },
              })
          ),

          // TANDA TANGAN (WAKASEK & GURU)
          new Paragraph({ text: '', spacing: { before: 200 } }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({ children: [new TextRun({ text: 'Mengetahui,', size: 19, font: 'Arial' })] }),
                      new Paragraph({ children: [new TextRun({ text: 'WAKASEK Kurikulum', bold: true, size: 19, font: 'Arial' })] }),
                      new Paragraph({ text: '', spacing: { after: 600 } }),
                      new Paragraph({ children: [new TextRun({ text: `( ${identitas.namaWakasekKurikulum || 'Riana Rizki Abidin, S. S'} )`, bold: true, size: 19, font: 'Arial' })] }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({ children: [new TextRun({ text: `Bogor, ${identitas.hariTanggal || '19 Agustus 2026'}`, size: 19, font: 'Arial' })] }),
                      new Paragraph({ children: [new TextRun({ text: 'Guru Bidang Studi', bold: true, size: 19, font: 'Arial' })] }),
                      new Paragraph({ text: '', spacing: { after: 600 } }),
                      new Paragraph({ children: [new TextRun({ text: `( ${identitas.namaGuruBidangStudi || identitas.namaPenyusun} )`, bold: true, size: 19, font: 'Arial' })] }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          // LEMBAR ASESMEN KEGIATAN MURID (PAGE 2)
          new Paragraph({
            text: '',
            spacing: { before: 400 },
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'Lembar Asesmen Kegiatan Murid',
                bold: true,
                size: 22,
                underline: { type: UnderlineType.SINGLE },
                font: 'Arial',
              }),
            ],
            spacing: { before: 200, after: 150 },
          }),

          new Paragraph({
            children: [
              new TextRun({ text: 'Mata Pelajaran  : ', bold: true, size: 19 }),
              new TextRun({ text: lembarAsesmen?.mataPelajaran || identitas.mataPelajaran, size: 19 }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Kelas                    : ', bold: true, size: 19 }),
              new TextRun({ text: lembarAsesmen?.kelas || identitas.namaKelasSpesifik || identitas.kelas, size: 19 }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Hari/tanggal       : ', bold: true, size: 19 }),
              new TextRun({ text: lembarAsesmen?.hariTanggal || identitas.hariTanggal || 'Rabu, 19 Agustus 2026', size: 19 }),
            ],
            spacing: { after: 150 },
          }),

          // TABEL ASESMEN SISWA
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createHeaderCell('No', 8),
                  createHeaderCell('Nama', 42),
                  createHeaderCell('Indikator (1, 2, 3)', 25),
                  createHeaderCell('Catatan', 25),
                ],
              }),
              ...(lembarAsesmen?.daftarSiswa || []).map((s) =>
                new TableRow({
                  children: [
                    new TableCell({
                      width: { size: 8, type: WidthType.PERCENTAGE },
                      children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${s.no}`, size: 18 })] })],
                    }),
                    new TableCell({
                      width: { size: 42, type: WidthType.PERCENTAGE },
                      children: [new Paragraph({ children: [new TextRun({ text: s.nama, size: 18, bold: true })] })],
                    }),
                    new TableCell({
                      width: { size: 25, type: WidthType.PERCENTAGE },
                      children: [
                        new Paragraph({
                          alignment: AlignmentType.CENTER,
                          children: [
                            new TextRun({ text: s.indikatorNilai[0] ? '✓ ' : '- ', color: '16A34A', bold: true }),
                            new TextRun({ text: s.indikatorNilai[1] ? '✓ ' : '- ', color: '16A34A', bold: true }),
                            new TextRun({ text: s.indikatorNilai[2] ? '✓' : '-', color: '16A34A', bold: true }),
                          ],
                        }),
                      ],
                    }),
                    new TableCell({
                      width: { size: 25, type: WidthType.PERCENTAGE },
                      children: [new Paragraph({ children: [new TextRun({ text: s.catatan || '', size: 17 })] })],
                    }),
                  ],
                })
              ),
            ],
          }),

          // KETERANGAN INDIKATOR ASESMEN
          new Paragraph({
            children: [new TextRun({ text: 'Keterangan Indikator:', bold: true, size: 19, font: 'Arial' })],
            spacing: { before: 150, after: 60 },
          }),
          ...(lembarAsesmen?.indikator || komponenInti.kriteriaKetercapaianTP).map((ind, i) =>
            new Paragraph({
              children: [
                new TextRun({ text: `${i + 1}. `, bold: true }),
                new TextRun({ text: ind, size: 18, font: 'Arial' }),
              ],
              spacing: { after: 30 },
            })
          ),
        ],
      },
    ],
  });

  return await Packer.toBlob(doc);
}

function createCompactInfoRow(label: string, value: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({ text: `${label} : `, bold: true, size: 19, font: 'Arial' }),
      new TextRun({ text: value || '-', size: 19, font: 'Arial' }),
    ],
    spacing: { after: 30 },
  });
}

function createHeaderCell(text: string, widthPercent: number): TableCell {
  return new TableCell({
    width: { size: widthPercent, type: WidthType.PERCENTAGE },
    shading: { fill: 'F3F4F6' },
    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text, bold: true, size: 18, font: 'Arial' })] })],
  });
}

export function downloadBlob(blob: Blob, fileName: string) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

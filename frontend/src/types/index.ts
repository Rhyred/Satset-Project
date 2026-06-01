export interface User {
  id: number;
  nik: string;
  namaLengkap: string;
  username: string;
  email: string;
  role: 'ADMIN' | 'USER';
  noTelepon?: string;
  alamat?: string;
  createdAt?: string;
}

export interface KategoriLayanan {
  id: number;
  namaKategori: string;
  tipe: 'BIROKRASI' | 'PENGADUAN';
}

export interface Laporan {
  id: number;
  judulLaporan: string;
  deskripsi: string;
  statusLaporan: 'DITERIMA' | 'DIPROSES' | 'SELESAI' | 'DITOLAK';
  pelapor?: User;
  kategori?: KategoriLayanan;
  createdAt?: string;
  updatedAt?: string;
  userId?: number;
}

export interface TindakLanjutLaporan {
  id: number;
  catatanAdmin: string;
  waktuTindak: string;
  laporanId: number;
  adminId: number;
  admin?: User;
}

export interface TiketLayanan {
  id: number;
  nomorAntrian: string;
  jenisSurat: string;
  statusAntrian: 'MENUNGGU' | 'DIPANGGIL' | 'DILAYANI' | 'SELESAI';
  pemohon?: User;
  kategori?: KategoriLayanan;
  waktuPengajuan?: string;
  createdAt?: string;
  updatedAt?: string;
  userId?: number;
}

export interface Mading {
  id: number;
  judul: string;
  konten: string;
  jenisInformasi: 'PENTING' | 'INFO_WARGA' | 'PENGUMUMAN';
  isPublished: boolean;
  createdAt?: string;
  admin?: User;
}

export interface ContactMessage {
  id: number;
  nama: string;
  email: string;
  subjek: string;
  pesan: string;
  createdAt?: string;
}

export interface Notifikasi {
  id: number;
  pesan: string;
  isRead: boolean;
  createdAt?: string;
  judul?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface LoginRequest {
  email?: string;
  password?: string;
}

export interface RegisterRequest {
  nik?: string;
  namaLengkap?: string;
  username?: string;
  email?: string;
  password?: string;
  noTelepon?: string;
  alamat?: string;
}

export interface ActivityItem {
  id: string;
  type: 'laporan' | 'antrean' | 'notifikasi';
  title: string;
  desc: string;
  date: string;
  link: string;
  isUnread: boolean;
}

export interface NextAction {
  type: 'action' | 'info' | 'warning' | 'success';
  title: string;
  message: string;
  actionText: string;
  actionLink: string;
}

export interface TimelineEvent {
  id: number | string;
  status: string;
  title: string;
  description: string;
  timestamp: string;
  actor: string;
  isActive: boolean;
  isCompleted: boolean;
}

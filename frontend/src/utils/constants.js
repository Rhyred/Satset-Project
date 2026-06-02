import {
  Bell,
  BookText,
  ClipboardList,
  Home,
  LayoutDashboard,
  MessageSquareWarning,
  Newspaper,
  ShieldCheck,
  Users,
} from 'lucide-react'

export const citizenNavItems = [
  { label: 'Beranda', to: '/', icon: Home },
  { label: 'Antrean', to: '/queue', icon: ClipboardList },
  { label: 'Laporan', to: '/reports', icon: MessageSquareWarning },
  { label: 'Mading', to: '/mading', icon: Newspaper },
  { label: 'Notifikasi', to: '/notifications', icon: Bell },
  { label: 'Akun', to: '/account', icon: ShieldCheck },
]

export const adminNavItems = [
  { label: 'Admin Panel', to: '/admin', icon: LayoutDashboard },
  { label: 'Kelola User', to: '/users', icon: Users },
]

export const demoAccounts = [
  { role: 'Admin', email: 'admin@satset.id', password: 'admin123' },
  { role: 'Warga', email: 'warga@satset.id', password: 'warga123' },
]

export const reportStatusOptions = ['DITERIMA', 'DIPROSES', 'SELESAI', 'DITOLAK']
export const queueStatusOptions = ['MENUNGGU', 'DIPANGGIL', 'DILAYANI', 'SELESAI']
export const madingTypeOptions = ['PENTING', 'INFO_WARGA', 'PENGUMUMAN']

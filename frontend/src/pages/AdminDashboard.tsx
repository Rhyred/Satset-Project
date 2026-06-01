import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { 
  Users, FileText, ClipboardList, Megaphone, 
  X, Trash2, Edit3, Plus, Activity, Search
} from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Laporan, TiketLayanan, Mading, User } from '../types';
import { motion } from 'framer-motion';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

interface AdminStats {
  totalUsers: number;
  totalLaporan: number;
  totalAntrean: number;
  totalMading: number;
  laporanDiterima: number;
  laporanDiproses: number;
  laporanSelesai: number;
  laporanDitolak: number;
  antreanMenunggu: number;
  antreanSelesai: number;
}

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0, totalLaporan: 0, totalAntrean: 0, totalMading: 0,
    laporanDiterima: 0, laporanDiproses: 0, laporanSelesai: 0, laporanDitolak: 0,
    antreanMenunggu: 0, antreanSelesai: 0
  });

  const [activeTab, setActiveTab] = useState<'overview' | 'laporan' | 'antrean' | 'mading' | 'user'>('overview');
  const [laporans, setLaporans] = useState<Laporan[]>([]);
  const [antreans, setAntreans] = useState<TiketLayanan[]>([]);
  const [madings, setMadings] = useState<Mading[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Mading Modal
  const [showMadingModal, setShowMadingModal] = useState(false);
  const [madingForm, setMadingForm] = useState<{id?: number; judul: string; konten: string; jenisInformasi: 'PENTING' | 'INFO_WARGA' | 'PENGUMUMAN'; isPublished: boolean}>({
    judul: '', konten: '', jenisInformasi: 'PENGUMUMAN', isPublished: true
  });

  // User Management Modal
  const [showUserModal, setShowUserModal] = useState(false);
  const [userForm, setUserForm] = useState({
    id: undefined as number | undefined, nik: '', namaLengkap: '', username: '',
    email: '', password: '', role: 'USER' as 'USER' | 'ADMIN', noTelepon: '', alamat: ''
  });

  const loadDashboardData = async () => {
    try {
      const [statsRes, lapRes, antRes, madRes, userRes] = await Promise.all([
        fetch('/api/dashboard/stats'), fetch('/api/laporan'), 
        fetch('/api/antrean'), fetch('/api/mading/all'), fetch('/api/users')
      ]);
      
      if(statsRes.ok) setStats((await statsRes.json()).data);
      if(lapRes.ok) { const d = await lapRes.json(); if(Array.isArray(d)) setLaporans(d.sort((a,b)=>b.id-a.id)); }
      if(antRes.ok) { const d = await antRes.json(); if(Array.isArray(d)) setAntreans(d.sort((a,b)=>b.id-a.id)); }
      if(madRes.ok) { const d = await madRes.json(); if(Array.isArray(d)) setMadings(d.sort((a,b)=>b.id-a.id)); }
      if(userRes.ok) { const d = await userRes.json(); if(Array.isArray(d)) setUsers(d); }
    } catch (err) {
      console.error('Error loading admin data:', err);
      showToast('Gagal memuat data dashboard', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Update Status Helpers
  const handleUpdateLaporanStatus = async (id: number, status: string) => {
    const catatan = prompt(`Catatan Tindak Lanjut untuk status: ${status} (opsional):`);
    if (catatan === null) return; 
    try {
      const res = await fetch(`/api/laporan/${id}/status`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, catatan })
      });
      if ((await res.json()).success) {
        const lap = laporans.find(l => l.id === id);
        if (lap) await fetch('/api/notifikasi', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ pesan: `Laporan Anda "${lap.judulLaporan}" statusnya kini: ${status}`, user: { id: lap.userId } }) });
        showToast(`Laporan di-update ke ${status}`);
        loadDashboardData();
      }
    } catch (e) { showToast('Gagal mengupdate laporan', 'danger'); }
  };

  const handleUpdateAntreanStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(`/api/antrean/${id}/status`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if ((await res.json()).success) {
        const ant = antreans.find(a => a.id === id);
        if (ant) await fetch('/api/notifikasi', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ pesan: `Antrean Anda ${ant.nomorAntrian} dipanggil. Status: ${status}`, user: { id: ant.userId } }) });
        showToast(`Antrean di-update ke ${status}`);
        loadDashboardData();
      }
    } catch (e) { showToast('Gagal mengupdate antrean', 'danger'); }
  };

  // Mading Helpers
  const handleSaveMading = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!madingForm.judul || !madingForm.konten) return showToast('Input wajib diisi!', 'danger');
    try {
      const url = madingForm.id ? `/api/mading/${madingForm.id}` : '/api/mading';
      const method = madingForm.id ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(madingForm) });
      if ((await res.json()).success) {
        showToast(madingForm.id ? 'Mading diperbarui' : 'Mading diterbitkan');
        setShowMadingModal(false); loadDashboardData();
      }
    } catch (e) { showToast('Gagal menyimpan mading', 'danger'); }
  };

  const handleDeleteMading = async (id: number) => {
    if (!confirm('Hapus mading ini?')) return;
    try {
      const res = await fetch(`/api/mading/${id}`, { method: 'DELETE' });
      if ((await res.json()).success) { showToast('Mading dihapus'); loadDashboardData(); }
    } catch (e) { showToast('Gagal menghapus mading', 'danger'); }
  };

  // User Helpers
  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = userForm.id ? `/api/users/${userForm.id}` : '/api/users';
      const method = userForm.id ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(userForm) });
      if (res.ok) {
        showToast(userForm.id ? 'User diperbarui' : 'User dibuat');
        setShowUserModal(false); loadDashboardData();
      } else { showToast('Gagal menyimpan user', 'danger'); }
    } catch (e) { showToast('Gagal menyimpan user', 'danger'); }
  };

  // Charts
  const laporanChartData = {
    labels: ['Diterima', 'Diproses', 'Selesai', 'Ditolak'],
    datasets: [{
      data: [stats.laporanDiterima, stats.laporanDiproses, stats.laporanSelesai, stats.laporanDitolak],
      backgroundColor: ['#3b82f6', '#f59e0b', '#10b981', '#ef4444'], borderWidth: 0
    }]
  };
  const antreanChartData = {
    labels: ['Menunggu', 'Dipanggil', 'Dilayani', 'Selesai'],
    datasets: [{
      label: 'Antrean',
      data: [stats.antreanMenunggu, antreans.filter(a => a.statusAntrian === 'DIPANGGIL').length, antreans.filter(a => a.statusAntrian === 'DILAYANI').length, stats.antreanSelesai],
      backgroundColor: ['#f59e0b', '#3b82f6', '#6366f1', '#10b981'], borderRadius: 4
    }]
  };
  const chartOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' as const, labels: { font: { family: 'Inter', size: 11 }, usePointStyle: true, boxWidth: 6 } } } };

  const getStatusBadge = (s: string) => {
    switch (s) {
      case 'SELESAI': return 'badge-success';
      case 'DITOLAK': return 'badge-error';
      case 'DIPROSES': case 'DIPANGGIL': return 'badge-primary';
      case 'DILAYANI': return 'badge-info';
      default: return 'badge-warning';
    }
  };

  // Priority 9: Service Quality Metrics Calculation
  const completedLaporans = laporans.filter(l => l.statusLaporan === 'SELESAI' && l.updatedAt && l.createdAt);
  let totalTimeMs = 0;
  let slaBreachCount = 0;
  completedLaporans.forEach(l => {
    const timeToResolve = new Date(l.updatedAt!).getTime() - new Date(l.createdAt!).getTime();
    totalTimeMs += timeToResolve;
    // Assume SLA is 72 hours (3 days)
    if (timeToResolve > 72 * 60 * 60 * 1000) {
      slaBreachCount++;
    }
  });
  
  const avgResolutionHours = completedLaporans.length > 0 ? (totalTimeMs / completedLaporans.length) / (1000 * 60 * 60) : 0;
  const completionRate = laporans.length > 0 ? (completedLaporans.length / laporans.length) * 100 : 0;
  const slaBreachRate = completedLaporans.length > 0 ? (slaBreachCount / completedLaporans.length) * 100 : 0;


  if (loading) {
    return (
      <div className="page-container flex-col gap-6" style={{ paddingBottom: '4rem' }}>
        <div className="page-header mb-0">
          <div className="skeleton" style={{ width: '250px', height: '32px', marginBottom: '8px' }}></div>
          <div className="skeleton" style={{ width: '350px', height: '20px' }}></div>
        </div>
        <div className="tabs border-b border-border">
          <div className="skeleton" style={{ width: '100px', height: '24px', margin: '12px' }}></div>
          <div className="skeleton" style={{ width: '150px', height: '24px', margin: '12px' }}></div>
          <div className="skeleton" style={{ width: '120px', height: '24px', margin: '12px' }}></div>
        </div>
        <div className="grid grid-4 gap-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="skeleton card" style={{ height: '90px' }}></div>)}
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="skeleton card" style={{ height: '300px' }}></div>
          <div className="skeleton card" style={{ height: '300px' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container flex-col gap-6" style={{ paddingBottom: '4rem' }}>
      
      {/* Header */}
      <div className="page-header mb-0">
        <h2 className="text-2xl font-bold text-primary-color">Command Center</h2>
        <p className="text-sm text-secondary">Pantau performa layanan dan kelola platform SATSET.</p>
      </div>

      {/* Primary Tabs */}
      <div className="tabs border-b border-border">
        <button className={`tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Overview</button>
        <button className={`tab ${activeTab === 'laporan' ? 'active' : ''}`} onClick={() => setActiveTab('laporan')}>Laporan & Aduan</button>
        <button className={`tab ${activeTab === 'antrean' ? 'active' : ''}`} onClick={() => setActiveTab('antrean')}>Antrean Aktif</button>
        <button className={`tab ${activeTab === 'mading' ? 'active' : ''}`} onClick={() => setActiveTab('mading')}>Portal Mading</button>
        <button className={`tab ${activeTab === 'user' ? 'active' : ''}`} onClick={() => setActiveTab('user')}>Manajemen User</button>
      </div>

      {/* Tab: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="fade-in flex flex-col gap-6">
          <div className="mb-2 pb-2 border-b" style={{ borderColor: 'var(--border)' }}>
            <h3 className="text-sm font-bold text-primary-color uppercase tracking-wider">Volume Layanan</h3>
          </div>
          <div className="grid grid-4 gap-4 mb-4">
            <div className="card flex items-center justify-between p-4 bg-surface-1">
              <div>
                <p className="text-xs font-semibold text-tertiary uppercase mb-1">Total Pengguna</p>
                <h4 className="text-2xl font-bold text-primary-color tabular-nums">{stats.totalUsers}</h4>
              </div>
              <div className="w-10 h-10 rounded-full bg-surface-2 text-primary flex items-center justify-center"><Users size={20} /></div>
            </div>
            <div className="card flex items-center justify-between p-4 bg-surface-1">
              <div>
                <p className="text-xs font-semibold text-tertiary uppercase mb-1">Laporan Masuk</p>
                <h4 className="text-2xl font-bold text-primary-color tabular-nums">{stats.totalLaporan}</h4>
              </div>
              <div className="w-10 h-10 rounded-full bg-surface-2 text-primary flex items-center justify-center"><FileText size={20} /></div>
            </div>
            <div className="card flex items-center justify-between p-4 bg-surface-1">
              <div>
                <p className="text-xs font-semibold text-tertiary uppercase mb-1">Antrean Harian</p>
                <h4 className="text-2xl font-bold text-primary-color tabular-nums">{stats.totalAntrean}</h4>
              </div>
              <div className="w-10 h-10 rounded-full bg-surface-2 text-primary flex items-center justify-center"><ClipboardList size={20} /></div>
            </div>
            <div className="card flex items-center justify-between p-4 bg-surface-1">
              <div>
                <p className="text-xs font-semibold text-tertiary uppercase mb-1">Pengumuman</p>
                <h4 className="text-2xl font-bold text-primary-color tabular-nums">{stats.totalMading}</h4>
              </div>
              <div className="w-10 h-10 rounded-full bg-surface-2 text-primary flex items-center justify-center"><Megaphone size={20} /></div>
            </div>
          </div>

          <div className="mb-2 pb-2 border-b" style={{ borderColor: 'var(--border)' }}>
            <h3 className="text-sm font-bold text-primary-color uppercase tracking-wider">Indikator Kinerja Layanan (SLA)</h3>
          </div>
          <motion.div 
            className="grid md:grid-cols-3 gap-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ staggerChildren: 0.1, duration: 0.4 }}
          >
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card p-5 border-l-4" style={{ borderColor: avgResolutionHours > 72 ? 'var(--error)' : 'var(--success)' }}>
              <p className="text-xs font-bold text-tertiary uppercase mb-1">Rata-Rata Waktu Penyelesaian</p>
              <div className="flex items-end gap-2">
                <h4 className="text-3xl font-bold text-primary-color tabular-nums">{avgResolutionHours.toFixed(1)}</h4>
                <span className="text-sm font-medium text-secondary mb-1">Jam</span>
              </div>
              <p className="text-xs mt-2 font-medium" style={{ color: avgResolutionHours > 72 ? 'var(--error)' : 'var(--success)' }}>
                {avgResolutionHours > 72 ? 'Lebih lambat dari target (72 Jam)' : 'Lebih cepat dari target (72 Jam)'}
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="card p-5 border-l-4" style={{ borderColor: completionRate < 50 ? 'var(--warning)' : 'var(--primary)' }}>
              <p className="text-xs font-bold text-tertiary uppercase mb-1">Tingkat Penyelesaian Laporan</p>
              <div className="flex items-end gap-2">
                <h4 className="text-3xl font-bold text-primary-color tabular-nums">{completionRate.toFixed(1)}</h4>
                <span className="text-sm font-medium text-secondary mb-1">%</span>
              </div>
              <div className="w-full h-1.5 bg-surface-2 rounded-full mt-3 overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${completionRate}%` }}></div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="card p-5 border-l-4" style={{ borderColor: slaBreachRate > 10 ? 'var(--error)' : 'var(--success)' }}>
              <p className="text-xs font-bold text-tertiary uppercase mb-1">Pelanggaran SLA (&gt;3 Hari)</p>
              <div className="flex items-end gap-2">
                <h4 className="text-3xl font-bold text-primary-color tabular-nums">{slaBreachRate.toFixed(1)}</h4>
                <span className="text-sm font-medium text-secondary mb-1">%</span>
              </div>
              <p className="text-xs mt-2 font-medium" style={{ color: slaBreachRate > 10 ? 'var(--error)' : 'var(--success)' }}>
                {slaBreachCount} laporan melewati batas SLA
              </p>
            </motion.div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="card" style={{ padding: '1.5rem' }}>
              <h3 className="text-sm font-semibold text-primary-color mb-4 flex items-center gap-2"><Activity size={16} /> Distribusi Status Laporan</h3>
              <div style={{ height: '240px' }}><Doughnut data={laporanChartData} options={chartOptions} /></div>
            </div>
            <div className="card" style={{ padding: '1.5rem' }}>
              <h3 className="text-sm font-semibold text-primary-color mb-4 flex items-center gap-2"><Activity size={16} /> Throughput Antrean (Live)</h3>
              <div style={{ height: '240px' }}><Bar data={antreanChartData} options={{...chartOptions, scales: { x: { grid: { display: false } }, y: { beginAtZero: true, ticks: { stepSize: 1 } } }, plugins: { legend: { display: false } }}} /></div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: LAPORAN */}
      {activeTab === 'laporan' && (
        <div className="fade-in table-wrap">
          <table className="table">
            <thead>
              <tr><th>Pelapor</th><th>Judul Aduan</th><th>Deskripsi</th><th>Status</th><th className="text-right">Aksi</th></tr>
            </thead>
            <tbody>
              {laporans.map(l => (
                <tr key={l.id}>
                  <td className="strong">{l.pelapor?.namaLengkap || 'Anonim'}</td>
                  <td>{l.judulLaporan}</td>
                  <td><div className="truncate" style={{ maxWidth: '200px' }}>{l.deskripsi}</div></td>
                  <td><span className={`badge ${getStatusBadge(l.statusLaporan)}`}>{l.statusLaporan}</span></td>
                  <td>
                    <div className="flex gap-2 justify-end">
                      {l.statusLaporan === 'DITERIMA' && <button className="btn btn-sm btn-primary" onClick={() => handleUpdateLaporanStatus(l.id, 'DIPROSES')}>Proses</button>}
                      {l.statusLaporan === 'DIPROSES' && <button className="btn btn-sm btn-success" onClick={() => handleUpdateLaporanStatus(l.id, 'SELESAI')}>Selesai</button>}
                      {(l.statusLaporan === 'DITERIMA' || l.statusLaporan === 'DIPROSES') && <button className="btn btn-sm btn-danger" onClick={() => handleUpdateLaporanStatus(l.id, 'DITOLAK')}>Tolak</button>}
                    </div>
                  </td>
                </tr>
              ))}
              {laporans.length === 0 && <tr><td colSpan={5} className="text-center py-8">Tidak ada data laporan</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab: ANTREAN */}
      {activeTab === 'antrean' && (
        <div className="fade-in table-wrap">
          <table className="table">
            <thead>
              <tr><th>Nomor</th><th>Pemohon</th><th>Layanan</th><th>Status</th><th className="text-right">Aksi</th></tr>
            </thead>
            <tbody>
              {antreans.map(a => (
                <tr key={a.id}>
                  <td><span className="font-bold text-primary">{a.nomorAntrian}</span></td>
                  <td className="strong">{a.pemohon?.namaLengkap || 'Warga'}</td>
                  <td>{a.jenisSurat}</td>
                  <td><span className={`badge ${getStatusBadge(a.statusAntrian)}`}>{a.statusAntrian}</span></td>
                  <td>
                    <div className="flex gap-2 justify-end">
                      {a.statusAntrian === 'MENUNGGU' && <button className="btn btn-sm btn-primary" onClick={() => handleUpdateAntreanStatus(a.id, 'DIPANGGIL')}>Panggil</button>}
                      {a.statusAntrian === 'DIPANGGIL' && <button className="btn btn-sm btn-info" onClick={() => handleUpdateAntreanStatus(a.id, 'DILAYANI')}>Layani</button>}
                      {a.statusAntrian === 'DILAYANI' && <button className="btn btn-sm btn-success" onClick={() => handleUpdateAntreanStatus(a.id, 'SELESAI')}>Selesai</button>}
                    </div>
                  </td>
                </tr>
              ))}
              {antreans.length === 0 && <tr><td colSpan={5} className="text-center py-8">Tidak ada antrean aktif</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab: MADING */}
      {activeTab === 'mading' && (
        <div className="fade-in">
          <div className="flex justify-end mb-3">
            <button onClick={() => { setMadingForm({judul: '', konten: '', jenisInformasi: 'PENGUMUMAN', isPublished: true}); setShowMadingModal(true); }} className="btn btn-primary btn-sm">
              <Plus size={16} /> Buat Pengumuman
            </button>
          </div>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr><th>Judul</th><th>Kategori</th><th>Status</th><th className="text-right">Aksi</th></tr>
              </thead>
              <tbody>
                {madings.map(m => (
                  <tr key={m.id}>
                    <td className="strong">{m.judul}</td>
                    <td>{m.jenisInformasi.replace('_', ' ')}</td>
                    <td><span className={`badge ${m.isPublished ? 'badge-success' : 'badge-neutral'}`}>{m.isPublished ? 'Published' : 'Draft'}</span></td>
                    <td>
                      <div className="flex gap-2 justify-end">
                        <button className="btn-icon btn-ghost text-primary" onClick={() => { setMadingForm({id: m.id, judul: m.judul, konten: m.konten, jenisInformasi: m.jenisInformasi, isPublished: m.isPublished}); setShowMadingModal(true); }}><Edit3 size={16} /></button>
                        <button className="btn-icon btn-ghost text-error" onClick={() => handleDeleteMading(m.id)}><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {madings.length === 0 && <tr><td colSpan={4} className="text-center py-8">Tidak ada data mading</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: USER */}
      {activeTab === 'user' && (
        <div className="fade-in">
          <div className="flex justify-end mb-3">
            <button onClick={() => { setUserForm({id: undefined, nik: '', namaLengkap: '', username: '', email: '', password: '', role: 'USER', noTelepon: '', alamat: ''}); setShowUserModal(true); }} className="btn btn-primary btn-sm">
              <Plus size={16} /> Tambah User
            </button>
          </div>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr><th>Nama Lengkap</th><th>NIK</th><th>Username / Email</th><th>Role</th><th className="text-right">Aksi</th></tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td className="strong">{u.namaLengkap}</td>
                    <td>{u.nik}</td>
                    <td>
                      <div>{u.username}</div>
                      <div className="text-xs text-tertiary">{u.email}</div>
                    </td>
                    <td><span className={`badge ${u.role === 'ADMIN' ? 'badge-error' : 'badge-primary'}`}>{u.role}</span></td>
                    <td>
                      <div className="flex gap-2 justify-end">
                        <button className="btn-icon btn-ghost text-primary" onClick={() => { setUserForm({id: u.id, nik: u.nik, namaLengkap: u.namaLengkap, username: u.username, email: u.email, password: '', role: u.role as 'USER'|'ADMIN', noTelepon: u.noTelepon || '', alamat: u.alamat || ''}); setShowUserModal(true); }}><Edit3 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MADING MODAL */}
      {showMadingModal && (
        <div className="modal-overlay">
          <div className="modal-backdrop" onClick={() => setShowMadingModal(false)} />
          <div className="modal-panel">
            <div className="modal-header"><h3 className="modal-title">{madingForm.id ? 'Edit Mading' : 'Buat Mading'}</h3><button onClick={() => setShowMadingModal(false)} className="btn-icon btn-ghost"><X size={18} /></button></div>
            <form onSubmit={handleSaveMading} className="modal-body">
              <div className="form-group">
                <label className="form-label">Judul</label>
                <input type="text" className="input" value={madingForm.judul} onChange={e => setMadingForm({...madingForm, judul: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">Kategori</label>
                <select className="select" value={madingForm.jenisInformasi} onChange={e => setMadingForm({...madingForm, jenisInformasi: e.target.value as any})}>
                  <option value="PENTING">Penting</option><option value="INFO_WARGA">Info Warga</option><option value="PENGUMUMAN">Pengumuman</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Konten</label>
                <textarea className="textarea" rows={4} value={madingForm.konten} onChange={e => setMadingForm({...madingForm, konten: e.target.value})} required />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <input type="checkbox" id="isPub" checked={madingForm.isPublished} onChange={e => setMadingForm({...madingForm, isPublished: e.target.checked})} />
                <label htmlFor="isPub" className="text-sm cursor-pointer">Terbitkan Sekarang</label>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowMadingModal(false)}>Batal</button>
                <button type="submit" className="btn btn-primary">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* USER MODAL */}
      {showUserModal && (
        <div className="modal-overlay">
          <div className="modal-backdrop" onClick={() => setShowUserModal(false)} />
          <div className="modal-panel" style={{ maxWidth: '600px' }}>
            <div className="modal-header"><h3 className="modal-title">{userForm.id ? 'Edit User' : 'Tambah User'}</h3><button onClick={() => setShowUserModal(false)} className="btn-icon btn-ghost"><X size={18} /></button></div>
            <form onSubmit={handleSaveUser} className="modal-body">
              <div className="grid grid-2 gap-4">
                <div className="form-group"><label className="form-label">NIK *</label><input type="text" className="input" value={userForm.nik} onChange={e => setUserForm({...userForm, nik: e.target.value})} required /></div>
                <div className="form-group"><label className="form-label">Nama Lengkap *</label><input type="text" className="input" value={userForm.namaLengkap} onChange={e => setUserForm({...userForm, namaLengkap: e.target.value})} required /></div>
              </div>
              <div className="grid grid-2 gap-4">
                <div className="form-group"><label className="form-label">Username *</label><input type="text" className="input" value={userForm.username} onChange={e => setUserForm({...userForm, username: e.target.value})} required /></div>
                <div className="form-group"><label className="form-label">Email *</label><input type="email" className="input" value={userForm.email} onChange={e => setUserForm({...userForm, email: e.target.value})} required /></div>
              </div>
              <div className="grid grid-2 gap-4">
                <div className="form-group"><label className="form-label">Password {userForm.id && '(Isi untuk ubah)'}</label><input type="password" className="input" value={userForm.password} onChange={e => setUserForm({...userForm, password: e.target.value})} required={!userForm.id} /></div>
                <div className="form-group"><label className="form-label">Role</label><select className="select" value={userForm.role} onChange={e => setUserForm({...userForm, role: e.target.value as any})}><option value="USER">User (Warga)</option><option value="ADMIN">Admin</option></select></div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowUserModal(false)}>Batal</button>
                <button type="submit" className="btn btn-primary">Simpan User</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

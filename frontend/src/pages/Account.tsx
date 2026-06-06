import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, Clock } from 'lucide-react';
import type { Laporan, TiketLayanan } from '../types';
import { EmptyState } from '../components/EmptyState';

interface HistoryItem {
  id: string;
  type: 'antrean' | 'laporan';
  title: string;
  status: string;
  date?: string;
}

export const Account: React.FC = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'profil' | 'riwayat' | 'keamanan'>('profil');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Load history (combined queues and reports)
  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;
      try {
        const [qRes, rRes] = await Promise.all([
          fetch('/api/antrean'),
          fetch('/api/laporan')
        ]);
        
        let queues: TiketLayanan[] = [];
        let reports: Laporan[] = [];
        
        if (qRes.ok) {
          const qData = await qRes.json();
          if (Array.isArray(qData)) queues = qData.filter(q => q.userId === user.id);
        }
        
        if (rRes.ok) {
          const rData = await rRes.json();
          if (Array.isArray(rData)) reports = rData.filter(r => r.userId === user.id);
        }

        const combined: HistoryItem[] = [
          ...queues.map(q => ({ 
            id: `q-${q.id}`, type: 'antrean' as const, title: q.jenisSurat, status: q.statusAntrian, date: q.createdAt || q.waktuPengajuan
          })),
          ...reports.map(r => ({ 
            id: `r-${r.id}`, type: 'laporan' as const, title: r.judulLaporan, status: r.statusLaporan, date: r.createdAt
          }))
        ];

        combined.sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
        setHistory(combined);
      } catch (err) {
        console.error('Error fetching history:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [user]);

  if (!user) return null;

  const avatarChar = user.namaLengkap.substring(0, 1).toUpperCase();

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getStatusBadge = (status: string) => {
    const s = status.toUpperCase();
    if (s === 'SELESAI') return <span className="badge badge-success">{status}</span>;
    if (s === 'DITOLAK') return <span className="badge badge-error">{status}</span>;
    return <span className="badge badge-warning">{status}</span>;
  };

  return (
    <div className="page-container page-narrow" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '6rem' }}>
      
      {/* Page Header */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-primary-color tracking-tight">Pusat Identitas Digital</h2>
        <p className="text-secondary mt-1">Kelola data pribadi, riwayat layanan, dan preferensi keamanan Anda.</p>
      </div>

      {/* Profile Card (GovTech Identity Card Style) */}
      <div className="card" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--border)' }}>
        <div style={{ height: '80px', background: 'var(--primary)' }} />
        <div className="relative" style={{ padding: '0 1.5rem 1.5rem 1.5rem' }}>
          <div className="absolute flex items-center justify-center border-4" style={{ top: '-48px', left: '24px', width: '6rem', height: '6rem', borderRadius: '50%', background: 'var(--surface-0)', borderColor: 'var(--surface-0)', color: 'var(--primary)', fontSize: '2.5rem', fontWeight: 'bold', boxShadow: 'var(--shadow-sm)' }}>
            {avatarChar}
          </div>
          
          <div className="flex justify-between items-start" style={{ marginTop: '3.5rem' }}>
            <div>
              <h2 className="text-2xl font-bold text-primary-color mb-1">{user.namaLengkap}</h2>
              <div className="flex items-center gap-2">
                <span className="text-secondary text-sm">@{user.username}</span>
                <span className="badge badge-success text-xs font-bold px-2 py-0.5">TERVERIFIKASI</span>
                {user.role === 'ADMIN' && (
                  <span className="badge badge-error text-xs font-bold px-2 py-0.5">PETUGAS</span>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs inside profile card */}
        <div className="border-t bg-surface-1" style={{ borderColor: 'var(--border)', padding: '0 0.5rem' }}>
          <div className="tabs pt-1 border-none m-0">
            <button className={`tab ${activeTab === 'profil' ? 'active' : ''}`} style={activeTab === 'profil' ? {color: 'var(--primary)', fontWeight: 700} : {}} onClick={() => setActiveTab('profil')}>Informasi Pribadi</button>
            <button className={`tab ${activeTab === 'riwayat' ? 'active' : ''}`} style={activeTab === 'riwayat' ? {color: 'var(--primary)', fontWeight: 700} : {}} onClick={() => setActiveTab('riwayat')}>Riwayat Pelayanan</button>
            <button className={`tab ${activeTab === 'keamanan' ? 'active' : ''}`} style={activeTab === 'keamanan' ? {color: 'var(--primary)', fontWeight: 700} : {}} onClick={() => setActiveTab('keamanan')}>Pengaturan & Keamanan</button>
          </div>
        </div>
      </div>

      {activeTab === 'profil' && (
        <div className="grid grid-2 gap-4 fade-in">
          <div className="card">
            <div className="flex justify-between items-center mb-4 pb-2 border-b" style={{ borderColor: 'var(--border)' }}>
              <h3 className="text-lg font-bold text-primary-color">Identitas Resmi</h3>
              <button className="btn btn-ghost btn-sm text-primary font-bold">Edit</button>
            </div>
            <div className="flex flex-col gap-5 mt-4">
              <div>
                <div className="text-xs font-bold text-tertiary uppercase tracking-wider mb-1">Nomor Induk Kependudukan (NIK)</div>
                <div className="text-base font-bold text-primary-color font-mono flex items-center">{user.nik} <CheckCircle size={16} className="text-success ml-2" /></div>
              </div>
              <div>
                <div className="text-xs font-bold text-tertiary uppercase tracking-wider mb-1">Nama Lengkap Sesuai KTP</div>
                <div className="text-base font-bold text-primary-color">{user.namaLengkap}</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex justify-between items-center mb-4 pb-2 border-b" style={{ borderColor: 'var(--border)' }}>
              <h3 className="text-lg font-bold text-primary-color">Kontak & Domisili</h3>
              <button className="btn btn-ghost btn-sm text-primary font-bold">Ubah</button>
            </div>
            <div className="flex flex-col gap-5 mt-4">
              <div>
                <div className="text-xs font-bold text-tertiary uppercase tracking-wider mb-1">Alamat Email Aktif</div>
                <div className="text-base font-medium text-primary-color">{user.email}</div>
              </div>
              <div>
                <div className="text-xs font-bold text-tertiary uppercase tracking-wider mb-1">Nomor Telepon / WhatsApp</div>
                <div className="text-base font-medium text-primary-color">{user.noTelepon || 'Belum diatur'}</div>
              </div>
              <div>
                <div className="text-xs font-bold text-tertiary uppercase tracking-wider mb-1">Alamat Domisili</div>
                <div className="text-base font-medium text-primary-color">{user.alamat || 'Belum diatur'}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'riwayat' && (
        <div className="card fade-in">
          <h3 className="text-lg font-bold mb-4 text-primary-color pb-2 border-b" style={{ borderColor: 'var(--border)' }}>Rekam Jejak Pelayanan</h3>
          
          {loading ? (
            <div className="flex flex-col gap-4 py-4">
              <div className="skeleton rounded-md" style={{ height: '80px', width: '100%' }}></div>
              <div className="skeleton rounded-md" style={{ height: '80px', width: '100%' }}></div>
            </div>
          ) : history.length === 0 ? (
            <div className="bg-surface-0 rounded-md border" style={{ borderColor: 'var(--border)' }}>
              <EmptyState
                icon={Clock}
                title="Belum Ada Riwayat"
                message="Anda belum pernah mengajukan laporan masalah infrastruktur atau mengambil antrean layanan."
                actionText="Jelajahi Layanan"
                actionLink="/dashboard"
              />
            </div>
          ) : (
            <div className="timeline">
              {history.map((item) => (
                <div key={item.id} className="timeline-item pb-6">
                  <div className="timeline-dot" style={{ 
                    background: item.type === 'antrean' ? 'var(--info)' : 'var(--warning)',
                    color: '#fff',
                    border: 'none',
                    width: '24px', height: '24px'
                  }}>
                    {item.type === 'antrean' ? 'A' : 'L'}
                  </div>
                  <div className="timeline-content p-4 rounded-md" style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}>
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <div className="text-xs font-bold text-tertiary mb-1 uppercase tracking-wider">
                          {item.type === 'antrean' ? 'Layanan Administrasi' : 'Laporan Infrastruktur'}
                        </div>
                        <h4 className="text-base font-bold text-primary-color mb-2">{item.title}</h4>
                        <div className="text-sm font-medium text-secondary">{formatDate(item.date)}</div>
                      </div>
                      <div>
                        {getStatusBadge(item.status)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'keamanan' && (
        <div className="card fade-in">
          <h3 className="text-lg font-bold mb-4 text-primary-color pb-2 border-b" style={{ borderColor: 'var(--border)' }}>Keamanan & Pengaturan Akun</h3>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center p-4 rounded-md border" style={{ borderColor: 'var(--border)' }}>
              <div>
                <h4 className="text-base font-bold text-primary-color">Ubah Kata Sandi</h4>
                <p className="text-sm text-secondary">Perbarui kata sandi Anda secara berkala untuk menjaga keamanan akun.</p>
              </div>
              <button className="btn btn-secondary">Ubah</button>
            </div>
            <div className="flex justify-between items-center p-4 rounded-md border" style={{ borderColor: 'var(--border)' }}>
              <div>
                <h4 className="text-base font-bold text-primary-color">Preferensi Notifikasi</h4>
                <p className="text-sm text-secondary">Terima pemberitahuan melalui email atau SMS mengenai status layanan.</p>
              </div>
              <button className="btn btn-secondary">Atur</button>
            </div>
            <div className="flex justify-between items-center p-4 rounded-md border" style={{ borderColor: 'var(--border)', background: 'var(--error-subtle)' }}>
              <div>
                <h4 className="text-base font-bold text-error">Hapus Akun</h4>
                <p className="text-sm text-secondary">Tindakan ini permanen dan akan menghapus semua riwayat layanan Anda.</p>
              </div>
              <button className="btn btn-danger btn-sm">Hapus</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

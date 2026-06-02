import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { FileText, Plus, X, MessageSquare, Search, AlertCircle, Activity, Printer } from 'lucide-react';
import { Laporan, KategoriLayanan, TindakLanjutLaporan, TimelineEvent } from '../types';
import { EmptyState } from '../components/EmptyState';
import { ServiceTimeline } from '../components/ServiceTimeline';

export const ReportFeed: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'mine' | 'community'>('mine');
  const [showModal, setShowModal] = useState(false);
  const [laporans, setLaporans] = useState<Laporan[]>([]);
  const [categories, setCategories] = useState<KategoriLayanan[]>([]);
  const [tindakLanjuts, setTindakLanjuts] = useState<TindakLanjutLaporan[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Form State
  const [judulLaporan, setJudulLaporan] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [kategoriId, setKategoriId] = useState<number | ''>('');

  const fetchLaporan = async () => {
    try {
      const res = await fetch('/api/laporan');
      const data = await res.json();
      if (Array.isArray(data)) {
        setLaporans(data.sort((a, b) => b.id - a.id));
      }
    } catch (e) {
      console.error('Error fetching reports:', e);
    }
  };

  const fetchTindakLanjuts = async () => {
    try {
      const res = await fetch('/api/tindak-lanjut');
      const data = await res.json();
      if (Array.isArray(data)) {
        setTindakLanjuts(data);
      }
    } catch (e) {
      console.error('Error fetching follow-ups:', e);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/kategori-layanan');
      const data = await res.json();
      if (Array.isArray(data)) {
        const reportCats = data.filter(c => c.tipe === 'PENGADUAN');
        setCategories(reportCats.length > 0 ? reportCats : data);
        if (reportCats.length > 0) {
          setKategoriId(reportCats[0].id);
        } else if (data.length > 0) {
          setKategoriId(data[0].id);
        }
      }
    } catch (e) {
      console.error('Error fetching categories:', e);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchLaporan();
    fetchTindakLanjuts();
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!judulLaporan || !deskripsi || !kategoriId || !user) {
      showToast('Semua input harus diisi!', 'danger');
      return;
    }
    setLoading(true);

    try {
      const payload = {
        judulLaporan,
        deskripsi,
        kategoriId: Number(kategoriId),
        userId: user.id
      };

      const res = await fetch('/api/laporan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        setJudulLaporan('');
        setDeskripsi('');
        await fetchLaporan();
        setActiveTab('mine');
        showToast('Laporan berhasil dikirim!');
      } else {
        showToast(data.message || 'Gagal mengirim laporan.', 'danger');
      }
    } catch (err) {
      console.error('Error submitting report:', err);
      showToast('Gagal mengirim laporan.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const getTindakLanjutForLaporan = (laporanId: number) => {
    return tindakLanjuts.filter((t) => t.laporanId === laporanId);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // Interactive Service Timeline Component (Priority 1)
  const ReportTimeline = ({ laporan, followUps }: { laporan: Laporan, followUps: TindakLanjutLaporan[] }) => {
    if (laporan.statusLaporan === 'DITOLAK') {
      return (
        <div className="flex items-center gap-3 text-error font-medium my-6 p-5 rounded-md border" style={{ background: 'var(--error-subtle)', borderColor: 'var(--error)' }}>
          <AlertCircle size={24} /> 
          <div>
            <h4 className="font-bold">Laporan Ditolak</h4>
            <p className="text-sm">Silakan lihat tanggapan resmi dari petugas admin di bawah ini untuk mengetahui alasannya.</p>
          </div>
        </div>
      );
    }

    const events: TimelineEvent[] = [];
    
    // 1. Dibuat
    events.push({ id: 'dibuat', status: 'DITERIMA', title: 'Laporan Dibuat', description: 'Anda telah mengirimkan laporan.', actor: laporan.pelapor?.namaLengkap || 'Anda', timestamp: laporan.createdAt || '', isCompleted: true, isActive: false });

    // 2. Diterima Sistem
    events.push({ id: 'diterima', status: 'DITERIMA', title: 'Diterima Sistem', description: 'Laporan berhasil masuk antrean.', actor: 'Sistem SATSET', timestamp: laporan.createdAt || '', isCompleted: true, isActive: laporan.statusLaporan === 'DITERIMA' && followUps.length === 0 });

    // 3. Diverifikasi
    const isVerifikasi = followUps.length > 0 || laporan.statusLaporan === 'DIPROSES' || laporan.statusLaporan === 'SELESAI';
    events.push({ id: 'diverifikasi', status: 'DIPROSES', title: 'Diverifikasi', description: 'Pengecekan validitas laporan.', actor: isVerifikasi && followUps.length > 0 ? followUps[0].admin?.namaLengkap || 'Admin' : '', timestamp: isVerifikasi && followUps.length > 0 ? followUps[0].waktuTindak : '', isCompleted: isVerifikasi, isActive: laporan.statusLaporan === 'DITERIMA' && followUps.length > 0 });

    // 4. Ditugaskan
    events.push({ id: 'ditugaskan', status: 'DIPROSES', title: 'Ditugaskan ke Petugas', description: 'Laporan diteruskan ke dinas terkait.', actor: '', timestamp: '', isCompleted: isVerifikasi, isActive: false });

    // 5. Diproses
    const isDiproses = laporan.statusLaporan === 'DIPROSES';
    events.push({ id: 'diproses', status: 'DIPROSES', title: 'Diproses', description: 'Petugas mulai menangani aduan.', actor: '', timestamp: '', isCompleted: laporan.statusLaporan === 'SELESAI', isActive: isDiproses });

    // 6. Tindak Lanjut Lapangan
    events.push({ id: 'tindak_lanjut', status: 'DIPROSES', title: 'Tindak Lanjut', description: 'Aksi lapangan dilakukan.', actor: '', timestamp: '', isCompleted: laporan.statusLaporan === 'SELESAI', isActive: false });

    // 7. Selesai
    const isSelesai = laporan.statusLaporan === 'SELESAI';
    events.push({ id: 'selesai', status: 'SELESAI', title: 'Selesai', description: 'Laporan telah berhasil ditutup.', actor: isSelesai && followUps.length > 0 ? followUps[followUps.length - 1].admin?.namaLengkap || 'Admin' : '', timestamp: isSelesai && followUps.length > 0 ? followUps[followUps.length - 1].waktuTindak : '', isCompleted: isSelesai, isActive: false });

    return (
      <div className="w-full my-6 bg-surface-0 p-6 rounded-lg border shadow-sm" style={{ borderColor: 'var(--border)' }}>
        <h5 className="text-sm font-bold text-primary-color mb-2 flex items-center gap-2">
          <Activity size={18} className="text-primary"/> Jejak Pelacakan Layanan (Live)
        </h5>
        <ServiceTimeline events={events} />
      </div>
    );
  };

  const displayList = laporans
    .filter((l) => activeTab === 'mine' ? l.userId === user?.id : true)
    .filter((l) => filterStatus === 'ALL' ? true : l.statusLaporan === filterStatus)
    .filter((l) => searchQuery ? 
      (l.judulLaporan.toLowerCase().includes(searchQuery.toLowerCase()) || l.deskripsi.toLowerCase().includes(searchQuery.toLowerCase())) 
      : true
    );

  return (
    <div className="page-container page-narrow flex-col gap-6" style={{ paddingBottom: '6rem' }}>
      
      {/* Header Panel (GovTech Style) */}
      <div className="flex justify-between items-end flex-wrap gap-4 mb-2 pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <div>
          <h2 className="text-2xl font-bold text-primary-color">Laporan & Pengaduan</h2>
          <p className="text-secondary mt-1">Pantau status laporan infrastruktur publik secara transparan.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary shadow-md">
          <Plus size={18} /> Buat Laporan Baru
        </button>
      </div>

      <div className="card" style={{ padding: 0, boxShadow: 'none' }}>
        
        {/* Toolbar */}
        <div className="flex justify-between items-center p-4 border-b bg-surface-1" style={{ borderColor: 'var(--border)' }}>
          <div className="tabs" style={{ borderBottom: 'none', margin: 0 }}>
            <button 
              className={`tab ${activeTab === 'mine' ? 'active' : ''}`}
              style={{ fontWeight: activeTab === 'mine' ? 700 : 500, color: activeTab === 'mine' ? 'var(--primary)' : 'var(--text-secondary)' }}
              onClick={() => setActiveTab('mine')}
            >
              Laporan Saya
            </button>
            <button 
              className={`tab ${activeTab === 'community' ? 'active' : ''}`}
              style={{ fontWeight: activeTab === 'community' ? 700 : 500, color: activeTab === 'community' ? 'var(--primary)' : 'var(--text-secondary)' }}
              onClick={() => setActiveTab('community')}
            >
              Semua Laporan Publik
            </button>
          </div>
          
          <div className="flex gap-2 hide-mobile">
            <select 
              className="input text-sm"
              style={{ padding: '0.25rem 0.5rem', minHeight: '32px' }}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="ALL">Semua Status</option>
              <option value="DITERIMA">Diterima</option>
              <option value="DIPROSES">Diproses</option>
              <option value="SELESAI">Selesai</option>
              <option value="DITOLAK">Ditolak</option>
            </select>

            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '0.5rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', display: 'flex' }}>
                <Search size={14} />
              </div>
              <input 
                type="text"
                placeholder="Cari laporan..."
                className="input text-sm"
                style={{ padding: '0.25rem 0.5rem 0.25rem 2rem', minHeight: '32px', width: '200px' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* List content with thick separators */}
      <div className="flex flex-col gap-6">
          {fetching ? (
            <>
              <div className="skeleton bg-surface-0 rounded-md border" style={{ height: '200px', width: '100%' }}></div>
              <div className="skeleton bg-surface-0 rounded-md border" style={{ height: '200px', width: '100%' }}></div>
              <div className="skeleton bg-surface-0 rounded-md border" style={{ height: '200px', width: '100%' }}></div>
            </>
          ) : displayList.length === 0 ? (
            <div className="bg-surface-0 rounded-md border" style={{ borderColor: 'var(--border)' }}>
              <EmptyState 
                icon={FileText}
                title="Belum Ada Laporan"
                message="Bantu perbaiki fasilitas publik di lingkungan Anda dengan melaporkan masalah infrastruktur yang Anda temukan."
                actionText="Buat Laporan Pertama"
                onActionClick={() => setShowModal(true)}
              />
            </div>
          ) : (
            displayList.map((laporan, index) => {
              const isSelf = laporan.userId === user?.id;
              const reporterName = isSelf ? 'Anda' : (laporan.pelapor?.namaLengkap || 'Warga Anonim');
              const avatarText = isSelf ? 'A' : reporterName.substring(0, 1).toUpperCase();
              const followUps = getTindakLanjutForLaporan(laporan.id);
              
              // Status Styling
              let statusBg = 'var(--primary-subtle)';
              let statusColor = 'var(--primary)';
              let statusLabel = 'Laporan Diterima';
              if (laporan.statusLaporan === 'DIPROSES') {
                statusBg = 'var(--warning-subtle)';
                statusColor = 'var(--warning)';
                statusLabel = 'Sedang Ditindaklanjuti';
              } else if (laporan.statusLaporan === 'SELESAI') {
                statusBg = 'var(--success-subtle)';
                statusColor = 'var(--success)';
                statusLabel = 'Masalah Selesai';
              } else if (laporan.statusLaporan === 'DITOLAK') {
                statusBg = 'var(--error-subtle)';
                statusColor = 'var(--error)';
                statusLabel = 'Laporan Ditolak';
              }

              return (
                <div key={laporan.id} className="card bg-surface-0 shadow-sm" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                  
                  {/* Report Header */}
                  <div className="flex justify-between items-start mb-6 pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-sm" style={{ background: isSelf ? 'var(--primary)' : 'var(--surface-3)', color: isSelf ? 'white' : 'var(--text-secondary)' }}>
                        {avatarText}
                      </div>
                      <div>
                        <div className="text-base font-bold text-primary-color">{reporterName}</div>
                        <div className="text-sm text-secondary font-medium mt-0.5">Dikirim pada: {formatDate(laporan.createdAt)}</div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2">
                        {isSelf && (
                          <button onClick={() => window.print()} className="btn btn-outline btn-sm shadow-sm flex items-center gap-2">
                            <Printer size={14} /> Cetak Bukti
                          </button>
                        )}
                        <div className="px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider" style={{ background: statusBg, color: statusColor, border: `1px solid ${statusColor}33` }}>
                          {statusLabel}
                        </div>
                      </div>
                      {laporan.kategori && (
                        <span className="badge badge-neutral text-xs font-bold uppercase tracking-wider">
                          {laporan.kategori.namaKategori}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Print Template (Hidden on Screen) */}
                  <div className="print-only card p-8 mb-8" style={{ border: '2px solid #000' }}>
                    <div className="text-center mb-6 pb-4" style={{ borderBottom: '2px solid #000' }}>
                      <h1 className="text-2xl font-black mb-1 uppercase tracking-widest">SATSET GOVTECH</h1>
                      <p className="text-sm font-semibold uppercase tracking-wider">Tanda Terima Laporan / Pengaduan Publik</p>
                    </div>
                    
                    <div className="mb-6">
                      <div className="grid grid-cols-2 gap-4 text-sm font-semibold border-b pb-4 mb-4" style={{ borderColor: '#000' }}>
                        <div>
                          <p className="uppercase tracking-wider opacity-70 mb-1">ID Pelapor</p>
                          <p className="text-lg">{reporterName}</p>
                        </div>
                        <div className="text-right">
                          <p className="uppercase tracking-wider opacity-70 mb-1">Tanggal Masuk</p>
                          <p className="text-lg">{formatDate(laporan.createdAt)}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm font-semibold border-b pb-4 mb-4" style={{ borderColor: '#000' }}>
                        <div>
                          <p className="uppercase tracking-wider opacity-70 mb-1">Kategori Laporan</p>
                          <p className="text-lg">{laporan.kategori?.namaKategori || '-'}</p>
                        </div>
                        <div className="text-right">
                          <p className="uppercase tracking-wider opacity-70 mb-1">Status Laporan</p>
                          <p className="text-lg uppercase" style={{ color: statusColor }}>{laporan.statusLaporan}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <p className="text-sm font-bold uppercase tracking-wider mb-2">Judul Laporan</p>
                      <h4 className="text-xl font-bold text-black mb-4">{laporan.judulLaporan}</h4>
                      
                      <p className="text-sm font-bold uppercase tracking-wider mb-2">Detail Laporan</p>
                      <p className="text-base text-black leading-relaxed p-4 border" style={{ borderColor: '#000', backgroundColor: '#f9fafb' }}>
                        {laporan.deskripsi}
                      </p>
                    </div>
                  </div>
                  
                  {/* Report Content */}
                  <h4 className="text-xl font-bold text-primary-color mb-3">{laporan.judulLaporan}</h4>
                  <div className="mb-4 bg-surface-1 p-5 rounded-md border" style={{ borderColor: 'var(--border)' }}>
                    <p className="text-xs font-bold text-tertiary uppercase tracking-wider mb-2">Isi Laporan / Aduan:</p>
                    <p className="text-base text-secondary leading-relaxed">
                      {laporan.deskripsi}
                    </p>
                  </div>
                  
                  {/* Tracker Timeline */}
                  <ReportTimeline laporan={laporan} followUps={followUps} />

                  {/* Follow-ups from Govt */}
                  {followUps.length > 0 && (
                    <div className="mt-6 pt-5 border-t border-dashed" style={{ borderColor: 'var(--border)' }}>
                      <h5 className="text-sm font-bold text-tertiary uppercase tracking-wider mb-4 flex items-center gap-2">
                        <MessageSquare size={16} className="text-primary"/> Tanggapan Resmi Petugas
                      </h5>
                      <div className="flex flex-col gap-4 pl-5 border-l-4" style={{ borderColor: 'var(--primary)' }}>
                        {followUps.map((t) => (
                          <div key={t.id} className="text-sm bg-surface-1 p-4 rounded-md border" style={{ borderColor: 'var(--primary-subtle)' }}>
                            <div className="flex items-center gap-2 mb-2 pb-2 border-b" style={{ borderColor: 'var(--border)' }}>
                              <span className="font-bold text-primary-color text-base">
                                {t.admin?.namaLengkap || 'Petugas Instansi'}
                              </span>
                              <span className="text-xs font-bold text-white bg-primary px-2 py-0.5 rounded-full">PETUGAS</span>
                              <span className="text-xs text-tertiary font-medium ml-auto">{formatDate(t.waktuTindak)}</span>
                            </div>
                            <p className="text-base text-secondary leading-relaxed font-medium">{t.catatanAdmin}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              );
            })
          )}
        </div>

      {/* Create Modal (Accessible GovTech Style) */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-backdrop" onClick={() => setShowModal(false)} />
          <div className="modal-panel" style={{ borderRadius: '8px', border: '1px solid var(--border)' }}>
            <div className="modal-header border-b" style={{ borderColor: 'var(--border)' }}>
              <h3 className="text-lg font-bold text-primary-color">Formulir Laporan Baru</h3>
              <button onClick={() => setShowModal(false)} className="btn-icon btn-ghost">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
              <div className="form-group">
                <label className="text-sm font-bold text-primary-color mb-1">Kategori Layanan *</label>
                <select 
                  className="input"
                  value={kategoriId} 
                  onChange={(e) => setKategoriId(e.target.value ? Number(e.target.value) : '')}
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.namaKategori}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="text-sm font-bold text-primary-color mb-1">Judul Laporan *</label>
                <input
                  type="text" className="input"
                  value={judulLaporan}
                  onChange={(e) => setJudulLaporan(e.target.value)}
                  placeholder="Misal: Jalan berlubang di depan pasar"
                  required
                />
              </div>

              <div className="form-group">
                <label className="text-sm font-bold text-primary-color mb-1">Deskripsi Detail *</label>
                <textarea
                  className="input" style={{ minHeight: '120px', resize: 'vertical' }}
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  placeholder="Jelaskan secara spesifik masalah yang terjadi, lokasi akurat, dan kondisi saat ini..."
                  required
                />
                <p className="text-xs text-tertiary mt-1">Laporan yang jelas akan lebih cepat ditindaklanjuti oleh petugas.</p>
              </div>

              <div className="flex justify-end gap-3 mt-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                  Batal
                </button>
                <button type="submit" disabled={loading} className="btn btn-primary">
                  {loading ? 'Memproses Laporan...' : 'Kirim Laporan Resmi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

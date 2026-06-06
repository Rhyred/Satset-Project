import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ClipboardList,
  FileText,
  Activity,
  Bell,
  ArrowRight,
  Info,
  Clock
} from 'lucide-react';
import type { Mading, Laporan, TiketLayanan, Notifikasi, ActivityItem, NextAction, TimelineEvent } from '../types';
import { useAuth } from '../context/AuthContext';
import { NextActionCard } from '../components/NextActionCard';
import { ServiceTimeline } from '../components/ServiceTimeline';

export const Home: React.FC = () => {
  const { user } = useAuth();
  const [madings, setMadings] = useState<Mading[]>([]);
  const [myLaporans, setMyLaporans] = useState<Laporan[]>([]);
  const [myAntreans, setMyAntreans] = useState<TiketLayanan[]>([]);
  const [activityFeed, setActivityFeed] = useState<ActivityItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const loadData = async () => {
      try {
        const [madingRes, laporanRes, antreanRes, notifRes] = await Promise.all([
          fetch('/api/mading'),
          fetch('/api/laporan'),
          fetch('/api/antrean'),
          fetch('/api/notifikasi/my')
        ]);
        
        const madingData = await madingRes.json().catch(() => []);
        const laporanData = await laporanRes.json().catch(() => []);
        const antreanData = await antreanRes.json().catch(() => []);
        const notifData = await notifRes.json().catch(() => []);
        
        if (Array.isArray(madingData)) setMadings(madingData);
        if (Array.isArray(laporanData)) {
          const activeLaporans = laporanData.filter((l: Laporan) => 
            (l.userId === user.id || l.pelapor?.id === user.id) && l.statusLaporan !== 'SELESAI' && l.statusLaporan !== 'DITOLAK'
          );
          setMyLaporans(activeLaporans);
        }
        if (Array.isArray(antreanData)) {
          const activeAntreans = antreanData.filter((a: TiketLayanan) => 
            (a.userId === user.id || a.pemohon?.id === user.id) && a.statusAntrian !== 'SELESAI'
          );
          setMyAntreans(activeAntreans);
        }
        if (Array.isArray(notifData)) {
          setUnreadCount(notifData.filter((n: Notifikasi) => !n.isRead).length);
        }

        // Priority 2: Unified Activity Feed
        const combinedActivities: ActivityItem[] = [
          ...((Array.isArray(laporanData) ? laporanData : []).filter((l: Laporan) => l.userId === user.id).map((l: Laporan) => ({ 
            id: `l-${l.id}`, type: 'laporan' as const, 
            title: 'Pembaruan Laporan', 
            desc: `Status laporan "${l.judulLaporan}" kini: ${l.statusLaporan}`, 
            date: l.updatedAt || l.createdAt || '', 
            isUnread: false, link: '/reports' 
          }))),
          ...((Array.isArray(antreanData) ? antreanData : []).filter((a: TiketLayanan) => a.userId === user.id).map((a: TiketLayanan) => ({ 
            id: `a-${a.id}`, type: 'antrean' as const, 
            title: 'Pembaruan Antrean', 
            desc: `Antrean ${a.nomorAntrian} untuk ${a.jenisSurat} kini: ${a.statusAntrian}`, 
            date: a.updatedAt || a.waktuPengajuan || '', 
            isUnread: false, link: '/queue' 
          }))),
          ...((Array.isArray(notifData) ? notifData : []).map((n: Notifikasi) => ({ 
            id: `n-${n.id}`, type: 'notifikasi' as const, 
            title: n.judul || 'Pemberitahuan Sistem', 
            desc: n.pesan, 
            date: n.createdAt || '', 
            isUnread: !n.isRead, 
            link: n.pesan.toLowerCase().includes('laporan') ? '/reports' : (n.pesan.toLowerCase().includes('antrean') ? '/queue' : '/notifikasi') 
          })))
        ].sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()).slice(0, 5);
        setActivityFeed(combinedActivities);
        
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user]);

  const hour = new Date().getHours();
  let greeting = 'Selamat pagi';
  if (hour >= 12 && hour < 15) greeting = 'Selamat siang';
  else if (hour >= 15 && hour < 18) greeting = 'Selamat sore';
  else if (hour >= 18 || hour < 4) greeting = 'Selamat malam';

  const [showWelcome, setShowWelcome] = useState(
    user ? localStorage.getItem('satset_welcomed_' + user.id) !== 'true' : false
  );

  const dismissWelcome = () => {
    if (user) localStorage.setItem('satset_welcomed_' + user.id, 'true');
    setShowWelcome(false);
  };

  // Determine Next Action
  let nextAction: NextAction = {
    type: 'success', title: 'Layanan Digital', message: 'Anda tidak memiliki layanan aktif. Jelajahi layanan kami untuk membuat pengajuan atau laporan baru.', actionText: 'Buat Laporan', actionLink: '/reports'
  };
  let activeTimelineEvents: TimelineEvent[] | null = null;

  if (myAntreans.length > 0) {
    const q = myAntreans[0];
    if (q.statusAntrian === 'DIPANGGIL') {
      nextAction = { type: 'action', title: 'Giliran Anda Dipanggil', message: `Antrean ${q.nomorAntrian} sedang dipanggil. Segera menuju ke loket pelayanan.`, actionText: 'Lihat Antrean', actionLink: '/queue' };
    } else {
      nextAction = { type: 'warning', title: 'Antrean Aktif', message: `Antrean ${q.nomorAntrian} sedang menunggu giliran. Estimasi waktu dipanggil menyesuaikan sisa antrean.`, actionText: 'Pantau Progres', actionLink: '/queue' };
    }
    activeTimelineEvents = [
      { id: 1, status: 'MENUNGGU', title: 'Antrean Diterima', description: 'Anda telah masuk antrean.', timestamp: q.waktuPengajuan || '', actor: '', isActive: q.statusAntrian === 'MENUNGGU', isCompleted: q.statusAntrian !== 'MENUNGGU' },
      { id: 2, status: 'DIPANGGIL', title: 'Pemanggilan', description: 'Nomor giliran dipanggil ke loket.', timestamp: '', actor: '', isActive: q.statusAntrian === 'DIPANGGIL', isCompleted: q.statusAntrian === 'DILAYANI' || q.statusAntrian === 'SELESAI' },
      { id: 3, status: 'DILAYANI', title: 'Dilayani', description: 'Pemberian layanan fisik.', timestamp: '', actor: '', isActive: q.statusAntrian === 'DILAYANI', isCompleted: q.statusAntrian === 'SELESAI' }
    ];
  } else if (myLaporans.length > 0) {
    const l = myLaporans[0];
    if (l.statusLaporan === 'DIPROSES') {
      nextAction = { type: 'info', title: 'Laporan Diproses', message: 'Laporan Anda sedang ditangani oleh petugas terkait di lapangan. Tidak ada tindakan lanjutan yang perlu Anda lakukan.', actionText: 'Lacak Laporan', actionLink: '/reports' };
    } else {
      nextAction = { type: 'warning', title: 'Menunggu Verifikasi', message: 'Laporan Anda telah kami terima dan sedang dalam tahap verifikasi sebelum diteruskan ke petugas.', actionText: 'Lihat Detail', actionLink: '/reports' };
    }
    activeTimelineEvents = [
      { id: 1, status: 'DITERIMA', title: 'Laporan Diterima', description: 'Laporan masuk sistem.', timestamp: l.createdAt || '', actor: '', isActive: l.statusLaporan === 'DITERIMA', isCompleted: l.statusLaporan !== 'DITERIMA' },
      { id: 2, status: 'DIPROSES', title: 'Diproses', description: 'Sedang ditindaklanjuti lapangan.', timestamp: '', actor: '', isActive: l.statusLaporan === 'DIPROSES', isCompleted: l.statusLaporan === 'SELESAI' },
      { id: 3, status: 'SELESAI', title: 'Selesai', description: 'Telah diselesaikan.', timestamp: '', actor: '', isActive: false, isCompleted: l.statusLaporan === 'SELESAI' }
    ];
  }

  return (
    <div className="page-container flex-col gap-6" style={{ paddingBottom: '3rem' }}>
      
      {/* Welcome Tour Modal */}
      {showWelcome && (
        <div className="modal-overlay" style={{ zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="modal-content p-6" style={{ maxWidth: '400px', textAlign: 'center', animation: 'fadeIn 0.3s ease-out' }}>
            <div className="w-16 h-16 rounded-full bg-primary-subtle text-primary flex items-center justify-center mx-auto mb-4">
              <span style={{ fontSize: '2rem' }}>👋</span>
            </div>
            <h2 className="text-2xl font-bold text-primary-color mb-2">Selamat Datang di SATSET</h2>
            <p className="text-secondary text-sm mb-6">
              Kami mendesain platform ini agar pelayanan publik menjadi lebih cepat, transparan, dan mudah dipantau.
            </p>
            <button className="btn btn-primary btn-full" onClick={dismissWelcome}>
              Mulai Eksplorasi
            </button>
          </div>
        </div>
      )}
      
      {/* 0. Header Panel */}
      <div className="flex justify-between items-end mb-4 border-b pb-6" style={{ borderColor: 'var(--border)' }}>
        <div>
          <h2 className="text-xl font-medium text-secondary">{greeting},</h2>
          <h1 className="text-3xl font-bold text-primary-color mt-1">{user?.namaLengkap || 'Warga'}</h1>
          <p className="text-tertiary mt-2">Pusat Komando Layanan Administrasi Terpadu</p>
        </div>
      </div>

      {/* 1. Service Status Summary */}
      <section className="mb-2">
        <h3 className="text-sm font-bold text-primary-color mb-3 uppercase tracking-wider">Ringkasan Status</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="card p-4 flex items-center justify-between bg-surface-1">
            <div><p className="text-xs font-bold text-tertiary uppercase">Laporan Aktif</p><h4 className="text-2xl font-bold tabular-nums text-primary-color">{myLaporans.length}</h4></div>
            <div className="w-10 h-10 rounded-full bg-primary-subtle text-primary flex items-center justify-center"><FileText size={20}/></div>
          </div>
          <div className="card p-4 flex items-center justify-between bg-surface-1">
            <div><p className="text-xs font-bold text-tertiary uppercase">Antrean Aktif</p><h4 className="text-2xl font-bold tabular-nums text-primary-color">{myAntreans.length}</h4></div>
            <div className="w-10 h-10 rounded-full bg-success-subtle text-success flex items-center justify-center"><ClipboardList size={20}/></div>
          </div>
          <div className="card p-4 flex items-center justify-between bg-surface-1">
            <div><p className="text-xs font-bold text-tertiary uppercase">Notifikasi Unread</p><h4 className="text-2xl font-bold tabular-nums text-primary-color">{unreadCount}</h4></div>
            <div className="w-10 h-10 rounded-full bg-warning-subtle text-warning flex items-center justify-center"><Bell size={20}/></div>
          </div>
        </div>
      </section>

      {/* 2. Next Action Card */}
      <section className="mb-4">
        <h3 className="text-sm font-bold text-primary-color mb-3 uppercase tracking-wider">Tindakan Selanjutnya</h3>
        <NextActionCard {...nextAction} />
      </section>

      {/* 3 & 4. Activity Feed & Active Service Timeline */}
      <section className="grid md:grid-cols-2 gap-6 mb-4">
        {/* Activity Feed */}
        <div className="card flex flex-col">
          <h3 className="text-base font-bold text-primary-color mb-4 pb-2 border-b flex items-center gap-2" style={{ borderColor: 'var(--border)' }}>
            <Activity size={18} className="text-primary" /> Jejak Aktivitas Terpadu
          </h3>
          <div className="flex flex-col gap-0 flex-1 relative">
            <div className="absolute top-2 bottom-2 left-[15px] w-px bg-border z-0" style={{ background: 'var(--border)' }}></div>
            {loading ? (
              <div className="flex flex-col gap-4 pl-10 relative z-10 pt-2">
                <div className="skeleton" style={{ height: '60px' }}></div>
                <div className="skeleton" style={{ height: '60px' }}></div>
              </div>
            ) : activityFeed.length === 0 ? (
              <div className="p-4 rounded-md flex justify-center items-center flex-1 text-sm text-tertiary border-dashed" style={{ border: '1px dashed var(--border)' }}>
                Belum ada aktivitas.
              </div>
            ) : (
              activityFeed.map((feed) => (
                <Link to={feed.link} key={feed.id} className="relative z-10 flex gap-4 p-3 hover:bg-surface-2 transition-colors rounded-md group">
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 bg-surface-1 group-hover:border-primary transition-colors`} 
                       style={{ borderColor: feed.isUnread ? 'var(--primary)' : 'var(--border)', zIndex: 10 }}>
                    {feed.type === 'laporan' ? <FileText size={14} className={feed.isUnread ? 'text-primary' : 'text-tertiary'} /> 
                     : feed.type === 'antrean' ? <ClipboardList size={14} className={feed.isUnread ? 'text-primary' : 'text-tertiary'} /> 
                     : <Bell size={14} className={feed.isUnread ? 'text-primary' : 'text-tertiary'} />}
                  </div>
                  <div className="flex-1 pb-2">
                    <div className="flex justify-between items-start mb-1">
                      <p className={`text-sm font-bold ${feed.isUnread ? 'text-primary-color' : 'text-secondary'}`}>{feed.title}</p>
                      <p className="text-[10px] font-bold text-tertiary uppercase tracking-wider">
                        {new Date(feed.date || '').toLocaleDateString('id-ID', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <p className="text-sm text-secondary line-clamp-2 leading-relaxed">{feed.desc}</p>
                  </div>
                </Link>
              ))
            )}
          </div>
          <Link to="/notifikasi" className="btn btn-ghost btn-sm mt-4 btn-full justify-center">Lihat Semua Riwayat</Link>
        </div>

        {/* Active Service Timeline */}
        <div className="card flex flex-col">
          <h3 className="text-base font-bold text-primary-color mb-4 pb-2 border-b flex items-center gap-2" style={{ borderColor: 'var(--border)' }}>
            <Clock size={18} className="text-primary" /> Pelacakan Layanan Terkini
          </h3>
          <div className="flex-1">
            {activeTimelineEvents ? (
              <ServiceTimeline events={activeTimelineEvents} />
            ) : (
              <div className="h-full min-h-[200px] flex items-center justify-center text-sm text-tertiary p-6 text-center border border-dashed rounded-lg" style={{ borderColor: 'var(--border)' }}>
                Belum ada pelacakan layanan yang aktif.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5. Public Announcements */}
      <section className="mb-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-primary-color flex items-center gap-2">
            <Info size={20} className="text-primary" /> Pengumuman Resmi
          </h3>
          <Link to="/mading" className="text-primary text-sm font-medium hover:underline flex items-center">
            Semua Berita <ArrowRight size={14} className="ml-1" />
          </Link>
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {loading ? (
            <div className="p-6 text-center text-tertiary">Memuat pengumuman...</div>
          ) : madings.length === 0 ? (
            <div className="p-6 text-center text-tertiary">Belum ada pengumuman terkini.</div>
          ) : (
            <div className="grid md:grid-cols-1" style={{ gridTemplateColumns: madings.length > 1 ? '1fr 1fr' : '1fr' }}>
              <Link to="/mading" className="p-6" style={{ background: 'var(--surface-1)', display: 'flex', flexDirection: 'column', borderRight: madings.length > 1 ? '1px solid var(--border)' : 'none' }}>
                <div className="flex items-center gap-2 mb-4">
                  <span className={`badge ${madings[0].jenisInformasi === 'PENTING' ? 'badge-error' : 'badge-primary'}`}>
                    {madings[0].jenisInformasi.replace('_', ' ')}
                  </span>
                  <span className="text-sm text-tertiary font-medium">
                    {new Date(madings[0].createdAt || '').toLocaleDateString('id-ID')}
                  </span>
                </div>
                <h4 className="text-xl font-bold text-primary-color mb-3">{madings[0].judul}</h4>
                <p className="text-secondary text-sm line-clamp-3">{madings[0].konten}</p>
              </Link>
              {madings.length > 1 && (
                <div className="flex flex-col">
                  {madings.slice(1, 4).map((item, idx) => (
                    <Link to="/mading" key={item.id} className="p-5 flex flex-col justify-center card-interactive" style={{ flex: 1, borderBottom: idx < Math.min(madings.length - 1, 3) - 1 ? '1px solid var(--border)' : 'none', borderRadius: 0, border: 'none', borderBottomColor: 'var(--border)' }}>
                      <div className="flex items-center gap-2 mb-2">
                         <span className="text-xs font-bold text-primary uppercase">{item.jenisInformasi.replace('_', ' ')}</span>
                         <span className="text-xs text-tertiary">· {new Date(item.createdAt || '').toLocaleDateString('id-ID')}</span>
                      </div>
                      <h4 className="text-base font-bold text-primary-color line-clamp-2">{item.judul}</h4>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* 6. Quick Services */}
      <section className="mb-6">
        <h3 className="text-lg font-bold text-primary-color mb-4">Layanan Cepat</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Link to="/reports" className="card card-interactive" style={{ display: 'flex', flexDirection: 'column' }}>
             <div className="flex items-center gap-3 mb-3">
               <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'var(--primary-subtle)', color: 'var(--primary)' }}>
                 <FileText size={24} />
               </div>
               <h3 className="text-lg font-bold text-primary-color">Buat Laporan / Pengaduan</h3>
             </div>
             <p className="text-secondary text-sm mb-4 flex-1">Laporkan masalah infrastruktur atau fasilitas umum di lingkungan Anda agar dapat ditindaklanjuti.</p>
          </Link>
          <Link to="/queue" className="card card-interactive" style={{ display: 'flex', flexDirection: 'column' }}>
             <div className="flex items-center gap-3 mb-3">
               <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'var(--success-subtle)', color: 'var(--success)' }}>
                 <ClipboardList size={24} />
               </div>
               <h3 className="text-lg font-bold text-primary-color">Ambil Antrean Layanan</h3>
             </div>
             <p className="text-secondary text-sm mb-4 flex-1">Dapatkan nomor antrean digital untuk pengurusan dokumen kependudukan secara tatap muka.</p>
          </Link>
        </div>
      </section>

    </div>
  );
};

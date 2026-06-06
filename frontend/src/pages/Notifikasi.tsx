import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Bell, Trash2, CheckCircle2, Info, AlertTriangle, MessageSquare, ArrowRight } from 'lucide-react';
import type { Notifikasi as NotifikasiType } from '../types';
import { EmptyState } from '../components/EmptyState';
import { Link } from 'react-router-dom';

export const Notifikasi: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [notifikasis, setNotifikasis] = useState<NotifikasiType[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');

  const fetchNotifikasi = async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/notifikasi/my`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setNotifikasis(data.sort((a, b) => b.id - a.id));
      }
    } catch (e) {
      console.error('Error fetching notifikasi:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifikasi();
  }, [user]);

  const handleMarkRead = async (id: number) => {
    try {
      const res = await fetch(`/api/notifikasi/${id}/read`, { method: 'PUT' });
      if (res.ok) {
        setNotifikasis(prev => 
          prev.map(n => n.id === id ? { ...n, isRead: true } : n)
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const unreadIds = notifikasis.filter(n => !n.isRead).map(n => n.id);
      if (unreadIds.length === 0) return;
      
      await Promise.all(unreadIds.map(id => fetch(`/api/notifikasi/${id}/read`, { method: 'PUT' })));
      
      setNotifikasis(prev => prev.map(n => ({ ...n, isRead: true })));
      showToast('Semua notifikasi ditandai sudah dibaca');
    } catch (e) {
      console.error(e);
      showToast('Gagal menandai semua dibaca', 'danger');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/notifikasi/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setNotifikasis(prev => prev.filter(n => n.id !== id));
        showToast('Notifikasi dihapus');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const getIconAndColor = (type?: string) => {
    // Basic logic based on message content since there's no strict type
    if (!type) return { icon: <Info size={20} />, color: 'var(--info)' };
    return { icon: <Bell size={20} />, color: 'var(--primary)' };
  };

  const unreadCount = notifikasis.filter(n => !n.isRead).length;
  const displayList = activeTab === 'unread' ? notifikasis.filter(n => !n.isRead) : notifikasis;

  return (
    <div className="page-container flex-col gap-6" style={{ maxWidth: '800px', margin: '0 auto' }}>
      
      <div className="page-header flex justify-between items-end mb-4 border-b pb-4" style={{ borderColor: 'var(--border)' }}>
        <div>
          <h2 className="text-2xl font-bold text-primary-color tracking-tight">Pusat Komunikasi Warga</h2>
          <p className="text-secondary mt-1">Pemberitahuan resmi dan instruksi lanjutan terkait layanan Anda.</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={handleMarkAllRead} className="btn btn-primary btn-sm">
            <CheckCircle2 size={16} /> Tandai Semua Dibaca
          </button>
        )}
      </div>

      <div className="card" style={{ padding: 0, boxShadow: 'none' }}>
        
        {/* Tabs */}
        <div className="flex px-4 pt-3 border-b bg-surface-1" style={{ borderColor: 'var(--border)' }}>
          <div className="tabs m-0 border-none">
            <button 
              className={`tab ${activeTab === 'all' ? 'active' : ''}`}
              style={{ fontWeight: activeTab === 'all' ? 700 : 500, color: activeTab === 'all' ? 'var(--primary)' : 'var(--text-secondary)' }}
              onClick={() => setActiveTab('all')}
            >
              Semua Pesan
            </button>
            <button 
              className={`tab ${activeTab === 'unread' ? 'active' : ''}`}
              onClick={() => setActiveTab('unread')}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: activeTab === 'unread' ? 700 : 500, color: activeTab === 'unread' ? 'var(--primary)' : 'var(--text-secondary)' }}
            >
              Membutuhkan Perhatian
              {unreadCount > 0 && (
                <span style={{ 
                  background: 'var(--error)', color: '#fff', 
                  padding: '2px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: 800 
                }}>
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex flex-col">
          {loading ? (
            <div className="flex flex-col">
              {[1, 2, 3].map(i => <div key={i} className="skeleton border-b" style={{ height: '140px', width: '100%', borderRadius: 0, borderColor: 'var(--border)' }}></div>)}
            </div>
          ) : displayList.length === 0 ? (
            <div className="bg-surface-0 rounded-b-md border border-t-0" style={{ borderColor: 'var(--border)' }}>
              <EmptyState
                icon={Bell}
                title="Tidak Ada Pesan"
                message="Anda telah membaca semua instruksi dan pemberitahuan, atau belum ada pemberitahuan baru yang masuk."
              />
            </div>
          ) : (
            displayList.map((item) => {
              const styleInfo = getIconAndColor(item.id.toString()); // Dummy logic for color
              
              // Structure the message into What, Why, Next Steps
              // Since the API returns a flat 'pesan' string, we format it visually to look structured.
              const isStatusUpdate = item.pesan.toLowerCase().includes('status');
              const what = isStatusUpdate ? "Pembaruan Status Layanan" : "Pemberitahuan Sistem";
              const why = item.pesan;
              const nextStep = isStatusUpdate 
                ? "Silakan cek riwayat layanan Anda untuk melihat detail tindak lanjut dari petugas terkait."
                : "Tidak ada tindakan lanjutan yang diperlukan dari Anda saat ini.";

              return (
                <div key={item.id} className="p-6 border-b transition-colors hover:bg-surface-1 flex gap-5" style={{ borderColor: 'var(--border)', background: !item.isRead ? 'var(--primary-subtle)' : 'transparent' }}>
                  
                  <div className="mt-1 flex-shrink-0">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm" style={{ background: styleInfo.color }}>
                      {styleInfo.icon}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-xs font-bold text-tertiary uppercase tracking-wider block mb-1">
                          {formatDate(item.createdAt)}
                        </span>
                        <h4 className={`text-lg font-bold ${!item.isRead ? 'text-primary' : 'text-primary-color'}`}>
                          {item.judul || what}
                        </h4>
                      </div>
                      <div className="flex gap-2">
                        {!item.isRead && (
                          <button 
                            onClick={() => handleMarkRead(item.id)}
                            className="btn btn-ghost btn-sm text-primary font-bold px-3 py-1 border" style={{ borderColor: 'var(--primary)' }}
                          >
                            Tandai Selesai
                          </button>
                        )}
                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="btn-icon btn-ghost text-tertiary hover:text-error"
                          title="Hapus Pesan"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 bg-surface-0 p-4 rounded-md border" style={{ borderColor: 'var(--border)' }}>
                      <div>
                        <h5 className="text-xs font-bold text-primary-color uppercase mb-2 flex items-center gap-1">
                          <MessageSquare size={12} className="text-tertiary"/> Apa yang terjadi?
                        </h5>
                        <p className="text-sm text-secondary leading-relaxed">{why}</p>
                      </div>
                      <div className="md:border-l md:pl-4" style={{ borderColor: 'var(--border)' }}>
                        <h5 className="text-xs font-bold text-primary-color uppercase mb-2 flex items-center gap-1">
                          <AlertTriangle size={12} className="text-warning"/> Tindakan Selanjutnya
                        </h5>
                        <p className="text-sm text-secondary leading-relaxed mb-3">{nextStep}</p>
                        {isStatusUpdate && (
                          <Link to="/reports" className="btn btn-outline btn-sm shadow-sm hover:bg-surface-2 transition-colors">
                            Lihat Rincian <ArrowRight size={14} className="ml-1" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

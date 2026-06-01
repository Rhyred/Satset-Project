import React, { useEffect, useState } from 'react';
import { Search, Megaphone, Info, AlertCircle, FileText } from 'lucide-react';
import { Mading } from '../types';
import { EmptyState } from '../components/EmptyState';

export const MadingFeed: React.FC = () => {
  const [madings, setMadings] = useState<Mading[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>('SEMUA');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchMadings = async () => {
    try {
      const res = await fetch('/api/mading');
      const data = await res.json();
      if (Array.isArray(data)) {
        setMadings(data);
      }
    } catch (err) {
      console.error('Error fetching mading:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMadings();
  }, []);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const getCategoryIcon = (jenis: string) => {
    switch (jenis) {
      case 'PENTING': return <AlertCircle size={14} />;
      case 'INFO_WARGA': return <Info size={14} />;
      default: return <FileText size={14} />;
    }
  };

  const getCategoryClass = (jenis: string) => {
    switch (jenis) {
      case 'PENTING': return 'badge-error';
      case 'INFO_WARGA': return 'badge-info';
      default: return 'badge-primary';
    }
  };

  const filtered = madings.filter((m) => {
    const matchFilter = activeFilter === 'SEMUA' || m.jenisInformasi === activeFilter;
    const matchSearch = m.judul.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        m.konten.toLowerCase().includes(searchQuery.toLowerCase());
    return matchFilter && matchSearch;
  });

  const featured = filtered.length > 0 && activeFilter === 'SEMUA' && searchQuery === '' 
    ? filtered.find(m => m.jenisInformasi === 'PENTING') || filtered[0] 
    : null;
    
  const list = featured ? filtered.filter(m => m.id !== featured.id) : filtered;

  return (
    <div className="page-container flex-col gap-6" style={{ paddingBottom: '3rem' }}>
      
      {/* Header Panel */}
      <div className="flex flex-col gap-4 mb-4 pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <h2 className="text-3xl font-bold text-primary-color tracking-tight">Pusat Informasi Publik</h2>
        <p className="text-secondary" style={{ maxWidth: '40rem' }}>
          Papan pengumuman resmi untuk warga. Temukan informasi terkini seputar layanan publik, infrastruktur, dan pemberitahuan darurat.
        </p>
        
        <div className="flex flex-wrap gap-4 items-center justify-between mt-2">
          <div className="filter-pills" style={{ gap: '0.5rem' }}>
            <button className={`btn btn-sm ${activeFilter === 'SEMUA' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveFilter('SEMUA')}>Semua Informasi</button>
            <button className={`btn btn-sm ${activeFilter === 'PENTING' ? 'btn-danger' : 'btn-secondary'}`} onClick={() => setActiveFilter('PENTING')}>Darurat / Penting</button>
            <button className={`btn btn-sm ${activeFilter === 'INFO_WARGA' ? 'btn-secondary' : 'btn-secondary'}`} style={activeFilter === 'INFO_WARGA' ? {background: 'var(--info)', color: 'white', borderColor: 'var(--info)'} : {}} onClick={() => setActiveFilter('INFO_WARGA')}>Layanan Publik</button>
            <button className={`btn btn-sm ${activeFilter === 'PENGUMUMAN' ? 'btn-secondary' : 'btn-secondary'}`} style={activeFilter === 'PENGUMUMAN' ? {background: 'var(--success)', color: 'white', borderColor: 'var(--success)'} : {}} onClick={() => setActiveFilter('PENGUMUMAN')}>Infrastruktur & Komunitas</button>
          </div>
          
          <div className="search-box" style={{ maxWidth: '300px', width: '100%' }}>
            <Search className="search-icon" size={16} />
            <input 
              type="text" 
              className="input rounded-full" 
              placeholder="Cari pengumuman..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col gap-6">
          <div className="skeleton card" style={{ height: '300px' }}></div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="skeleton card" style={{ height: '200px' }}></div>
            <div className="skeleton card" style={{ height: '200px' }}></div>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-surface-0 rounded-md border" style={{ borderColor: 'var(--border)' }}>
          <EmptyState
            icon={Megaphone}
            title="Tidak Ada Pengumuman"
            message="Belum ada informasi yang dipublikasikan atau sesuai dengan filter pencarian Anda saat ini."
          />
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          
          {/* Featured Article (Critical Highlight) */}
          {featured && (
            <article className="card" style={{ padding: '2rem', border: '1px solid var(--border)', borderLeft: featured.jenisInformasi === 'PENTING' ? '6px solid var(--error)' : '6px solid var(--primary)', background: featured.jenisInformasi === 'PENTING' ? 'var(--error-subtle)' : 'var(--surface-1)', boxShadow: 'none' }}>
              <div className="flex items-center gap-3 mb-4">
                <span className={`badge ${getCategoryClass(featured.jenisInformasi)} font-bold px-3 py-1`}>
                   {featured.jenisInformasi === 'PENTING' ? 'PENGUMUMAN DARURAT' : 'PENGUMUMAN UTAMA'}
                </span>
                <span className="text-sm font-bold text-tertiary uppercase tracking-wider">{formatDate(featured.createdAt)}</span>
              </div>
              <h3 className="text-2xl font-bold text-primary-color mb-3">{featured.judul}</h3>
              <p className="text-secondary text-base leading-relaxed whitespace-pre-wrap">{featured.konten}</p>
              
              {featured.admin && (
                <div className="mt-6 pt-4 border-t flex items-center gap-2" style={{ borderColor: 'var(--border)' }}>
                  <div className="w-8 h-8 rounded-full bg-surface-3 flex items-center justify-center font-bold text-secondary">
                    {featured.admin.namaLengkap.substring(0,1)}
                  </div>
                  <div className="text-sm font-medium text-secondary">
                    Diterbitkan oleh: <strong className="text-primary-color">{featured.admin.namaLengkap}</strong>
                  </div>
                </div>
              )}
            </article>
          )}

          {/* Bulletin Board List (Not blog cards, but structured list) */}
          {list.length > 0 && (
            <div className="card" style={{ padding: 0 }}>
              <div className="flex flex-col">
                {list.map((item, idx) => (
                  <article key={item.id} className="p-6 hover:bg-surface-1 transition-colors" style={{ borderBottom: idx < list.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                      
                      {/* Date Block */}
                      <div className="flex flex-col items-center justify-center p-3 rounded-md min-w-[100px]" style={{ background: 'var(--surface-3)', border: '1px solid var(--border)' }}>
                        <span className="text-2xl font-bold text-primary-color">{new Date(item.createdAt || '').getDate()}</span>
                        <span className="text-xs font-bold text-tertiary uppercase">{new Date(item.createdAt || '').toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}</span>
                      </div>
                      
                      {/* Content Block */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`badge ${getCategoryClass(item.jenisInformasi)} text-xs font-bold`}>
                            {item.jenisInformasi.replace('_', ' ')}
                          </span>
                        </div>
                        <h4 className="text-xl font-bold text-primary-color mb-2">{item.judul}</h4>
                        <p className="text-secondary text-sm leading-relaxed mb-3">{item.konten}</p>
                        
                        {item.admin && (
                          <div className="text-xs font-medium text-tertiary">
                            Oleh: {item.admin.namaLengkap}
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

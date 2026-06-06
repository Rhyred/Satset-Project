import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ClipboardList, ArrowRight, Printer, CheckCircle, Clock } from 'lucide-react';
import type { TiketLayanan } from '../types';
import { EmptyState } from '../components/EmptyState';
import { QueueProgressCard } from '../components/QueueProgressCard';

interface KategoriLayanan {
  id: number;
  namaKategori: string;
  deskripsi?: string;
  tipe: 'BIROKRASI' | 'PENGADUAN';
}

export const Queue: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState<KategoriLayanan[]>([]);
  const [selectedType, setSelectedType] = useState('');
  const [keperluan, setKeperluan] = useState('');
  const [waktuPengajuan, setWaktuPengajuan] = useState('');
  const [ticketResult, setTicketResult] = useState<TiketLayanan | null>(null);
  const [myQueues, setMyQueues] = useState<TiketLayanan[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/kategori-layanan');
      const data = await res.json();
      if (Array.isArray(data)) {
        setCategories(data.filter(c => c.tipe === 'BIROKRASI'));
      }
    } catch (e) {
      console.error('Error fetching categories:', e);
    }
  };

  const fetchActiveQueues = async () => {
    if (!user) return;
    try {
      const res = await fetch('/api/antrean');
      const data = await res.json();
      if (Array.isArray(data)) {
        const filtered = data
          .filter((q) => q.userId === user.id)
          .sort((a, b) => b.id - a.id);
        setMyQueues(filtered);
      }
    } catch (e) {
      console.error('Error fetching active queues:', e);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchActiveQueues();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType || !keperluan || !waktuPengajuan || !user) return;
    setLoading(true);

    try {
      const cat = categories.find((c) => c.namaKategori === selectedType);
      const payload = {
        jenisSurat: `${selectedType} - ${keperluan}`,
        statusAntrian: 'MENUNGGU',
        userId: user.id,
        kategoriId: cat ? cat.id : 1
      };

      const res = await fetch('/api/antrean', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setTicketResult(data.data);
        setStep(3);
        showToast('Antrean berhasil diajukan!');
        fetchActiveQueues();
      } else {
        showToast(data.message || 'Gagal mengajukan antrean.', 'danger');
      }
    } catch (e) {
      console.error('Error:', e);
      showToast('Gagal mengajukan antrean.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('id-ID', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  const handleReset = () => {
    setStep(1); setSelectedType(''); setKeperluan(''); setWaktuPengajuan('');
    setTicketResult(null); fetchActiveQueues();
  };

  return (
    <div className="page-container page-narrow flex-col gap-6" style={{ paddingBottom: '3rem' }}>
      
      {/* 1. Active Queues Tracker (GovTech Style) */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-primary-color mb-4">Status Antrean Saat Ini</h2>
        
        {fetching ? (
          <div className="skeleton card" style={{ height: '240px', width: '100%' }}></div>
        ) : myQueues.length === 0 ? (
          <div className="card">
            <EmptyState
              icon={ClipboardList}
              title="Belum Ada Antrean"
              message="Anda belum mengambil tiket antrean layanan apa pun. Silakan ambil antrean di bawah untuk memulai layanan tatap muka."
            />
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {myQueues.map((q) => {
              // Mock real-time queue data for UI Demonstration
              const isWaiting = q.statusAntrian === 'MENUNGGU';
              const peopleAhead = isWaiting ? 3 : 0;
              const counter = 'Loket 3';
              
              // Parse mock number (e.g. B-012)
              const myNum = q.nomorAntrian;
              const currentServingNum = isWaiting && myNum.includes('-') 
                ? `${myNum.split('-')[0]}-${String(Math.max(1, parseInt(myNum.split('-')[1]) - peopleAhead)).padStart(3, '0')}` 
                : myNum;

              return (
                <div key={q.id} className="mb-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-primary-color">{q.jenisSurat}</h3>
                      <p className="text-sm text-secondary flex items-center gap-1 mt-1">
                        <Clock size={14} /> Dipesan pada: {formatDate(q.waktuPengajuan)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="badge text-sm px-3 py-1 font-bold" style={{
                        background: isWaiting ? 'var(--warning-subtle)' : 'var(--success-subtle)',
                        color: isWaiting ? 'var(--warning)' : 'var(--success)',
                        border: `1px solid ${isWaiting ? 'rgba(217,119,6,0.3)' : 'rgba(5,150,105,0.3)'}`
                      }}>
                        {isWaiting ? 'Harap Menunggu Giliran' : 'Telah Dilayani'}
                      </span>
                      <button onClick={() => window.print()} className="btn btn-outline btn-sm shadow-sm flex items-center gap-2">
                        <Printer size={14} /> Cetak Tiket
                      </button>
                    </div>
                  </div>

                  {/* Print Template (Hidden on Screen) */}
                  <div className="print-only card p-8 mb-8" style={{ border: '2px solid #000' }}>
                    <div className="text-center mb-6 pb-4" style={{ borderBottom: '2px solid #000' }}>
                      <h1 className="text-2xl font-black mb-1 uppercase tracking-widest">SATSET GOVTECH</h1>
                      <p className="text-sm font-semibold uppercase tracking-wider">Tiket Antrean Layanan Publik</p>
                    </div>
                    <div className="text-center mb-6">
                      <p className="text-sm font-bold uppercase tracking-wider mb-2">Nomor Antrean Anda</p>
                      <div className="text-6xl font-black tabular-nums tracking-tighter" style={{ fontSize: '5rem', lineHeight: '1' }}>{myNum}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm font-semibold border-t pt-4" style={{ borderColor: '#000' }}>
                      <div>
                        <p className="uppercase tracking-wider opacity-70 mb-1">Jenis Layanan</p>
                        <p className="text-lg">{q.jenisSurat}</p>
                      </div>
                      <div className="text-right">
                        <p className="uppercase tracking-wider opacity-70 mb-1">Tanggal</p>
                        <p className="text-lg">{formatDate(q.waktuPengajuan)}</p>
                      </div>
                    </div>
                  </div>

                  <QueueProgressCard 
                    myNumber={myNum}
                    currentNumber={currentServingNum}
                    totalWaiting={10}
                    remainingPeople={peopleAhead}
                    counterName={counter}
                    estimatedWaitMinutes={peopleAhead * 5}
                    progressPercentage={isWaiting ? Math.round(((10 - peopleAhead) / 10) * 100) : 100}
                  />
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 2. Wizard Pengambilan Antrean Baru */}
      <section className="card">
        <h2 className="text-lg font-bold text-primary-color mb-6 pb-2 border-b" style={{ borderColor: 'var(--border)' }}>Ambil Antrean Baru</h2>
        
        {step === 1 && (
          <div className="fade-in">
            <p className="text-sm text-secondary mb-4">Pilih kategori layanan administrasi publik yang Anda butuhkan.</p>
            
            <div className="grid gap-3 mb-6">
              {categories.length === 0 ? (
                <>
                  <div className="skeleton rounded-md" style={{ height: '70px', width: '100%' }}></div>
                  <div className="skeleton rounded-md" style={{ height: '70px', width: '100%' }}></div>
                </>
              ) : (
                categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    className="p-4 rounded-md border flex items-center gap-4 cursor-pointer transition-all"
                    style={{
                      width: '100%',
                      borderColor: selectedType === cat.namaKategori ? 'var(--primary)' : 'var(--border)',
                      background: selectedType === cat.namaKategori ? 'var(--primary-subtle)' : 'var(--surface-1)'
                    }}
                    onClick={() => setSelectedType(cat.namaKategori)}
                    aria-pressed={selectedType === cat.namaKategori}
                  >
                    <div
                      className="w-10 h-10 flex items-center justify-center rounded-full text-white font-bold"
                      style={{
                        background: selectedType === cat.namaKategori ? 'var(--primary)' : '#9CA3AF'
                      }}
                    >
                      {cat.namaKategori.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-primary-color">{cat.namaKategori}</div>
                      <div className="text-xs text-secondary mt-1">{cat.deskripsi || 'Layanan administrasi publik'}</div>
                    </div>
                  </button>
                ))
              )}
            </div>
            <div className="flex justify-end">
              <button className="btn btn-primary" disabled={!selectedType} onClick={() => setStep(2)}>
                Lanjut <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="fade-in">
            <button onClick={() => setStep(1)} className="btn btn-ghost btn-sm mb-4" style={{ marginLeft: '-0.5rem' }}>
              ← Kembali
            </button>
            <p className="text-sm text-secondary mb-4">Lengkapi detail untuk layanan <span className="font-bold text-primary-color">{selectedType}</span>.</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="form-group">
                <label className="form-label font-bold text-primary-color">Keperluan Spesifik</label>
                <input
                  type="text" 
                  className={`input ${keperluan === '' && step === 2 ? '' : keperluan.length < 5 && keperluan.length > 0 ? 'border-error' : ''}`}
                  value={keperluan} 
                  onChange={(e) => setKeperluan(e.target.value)}
                  placeholder="Contoh: Pembuatan KTP Baru, Perpanjang KK"
                  required
                />
                {keperluan.length > 0 && keperluan.length < 5 && (
                  <span className="text-xs text-error mt-1">Keperluan terlalu singkat (min. 5 karakter)</span>
                )}
              </div>
              <div className="form-group">
                <label className="form-label font-bold text-primary-color">Jadwal Kedatangan</label>
                <input
                  type="date" 
                  className="input"
                  min={new Date().toISOString().split('T')[0]}
                  value={waktuPengajuan} 
                  onChange={(e) => setWaktuPengajuan(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button type="button" className="btn btn-secondary" onClick={() => setStep(1)}>Batal</button>
                <button type="submit" className="btn btn-primary" disabled={loading || keperluan.length < 5 || !waktuPengajuan}>
                  {loading ? 'Memproses...' : 'Ambil Antrean Sekarang'}
                </button>
              </div>
            </form>
          </div>
        )}

        {step === 3 && ticketResult && (
          <div className="fade-in text-center py-4">
            <div className="flex justify-center mb-3 text-success hide-on-print">
              <CheckCircle size={40} />
            </div>
            <h3 className="text-lg font-bold text-primary-color mb-1">Tiket Berhasil Diterbitkan</h3>
            <p className="text-sm text-secondary mb-6 hide-on-print">Sistem telah mendaftarkan antrean Anda.</p>
            
            {/* The actual ticket details can be shown here when printing */}
            <div className="card mb-6 mx-auto text-left" style={{ maxWidth: '400px', border: '2px dashed var(--border)' }}>
              <h4 className="text-sm font-bold text-tertiary uppercase text-center mb-4">Bukti Reservasi Antrean</h4>
              <div className="flex justify-between mb-2">
                <span className="text-secondary text-sm">Layanan</span>
                <span className="font-bold text-primary-color">{ticketResult.jenisSurat}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-secondary text-sm">Nomor Antrean</span>
                <span className="font-bold text-primary-color text-xl tabular-nums">{ticketResult.nomorAntrian}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary text-sm">Estimasi Kedatangan</span>
                <span className="font-bold text-primary-color">{formatDate(ticketResult.waktuPengajuan)}</span>
              </div>
            </div>

            <div className="flex justify-center gap-3 hide-on-print">
              <button className="btn btn-secondary" onClick={() => window.print()}>
                <Printer size={18} /> Cetak Tiket
              </button>
              <button className="btn btn-primary" onClick={handleReset}>Mengerti & Selesai</button>
            </div>
          </div>
        )}
      </section>

    </div>
  );
};

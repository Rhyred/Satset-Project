import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart3,
  BookOpen,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Star,
  Newspaper,
  Smartphone,
  MessageCircle,
  CalendarDays,
  Clock,
  MapPin,
  Sun,
  Moon
} from 'lucide-react';

const problems = [
  {
    title: 'Antrean fisik lama',
    description: 'Warga tidak perlu lagi datang lebih pagi untuk mengambil nomor antrian secara manual.',
    icon: <Clock size={20} />
  },
  {
    title: 'Laporan tak jelas',
    description: 'Aduan warga tersampaikan dengan ringkas dan bisa dilacak oleh petugas kelurahan.',
    icon: <MessageCircle size={20} />
  },
  {
    title: 'Informasi terpisah',
    description: 'Pengumuman resmi dan layanan publik tersedia dalam satu platform terpadu.',
    icon: <Newspaper size={20} />
  }
];

const services = [
  {
    title: 'Antrean Digital',
    description: 'Ambil antrean administrasi langsung dari ponsel dan datang sesuai jadwal.'
  },
  {
    title: 'Laporan Warga',
    description: 'Kirim aduan infrastruktur atau pelayanan dengan bukti dan status tindak lanjut.'
  },
  {
    title: 'Pengumuman Resmi',
    description: 'Pantau informasi vaksinasi, program publik, dan pengumuman kelurahan terbaru.'
  }
];

const featureHighlights = [
  {
    title: 'Ringkas & Terstruktur',
    description: 'Semua proses antrean, laporan, dan pengumuman ditata dalam satu dashboard yang mudah dipahami.',
    icon: <BookOpen size={18} />
  },
  {
    title: 'Analitik Layanan',
    description: 'Pantau kinerja layanan dengan metrik kepuasan, waktu tunggu, dan pelaporan real-time.',
    icon: <BarChart3 size={18} />
  },
  {
    title: 'Notifikasi Pintar',
    description: 'Pesan otomatis memberi tahu warga saat antrean siap dan laporan sudah ditindaklanjuti.',
    icon: <Sparkles size={18} />
  }
];

const supportBadges = [
  { label: 'Layanan Publik', description: 'Antrean KTP, KK, surat domisili, dan lain-lain.' },
  { label: 'Komunitas Warga', description: 'Sarana interaksi pengumuman dan aspirasi kelurahan.' },
  { label: 'Integrasi Data', description: 'Riwayat layanan tersimpan aman dan dapat dilacak.' }
];

const steps = [
  {
    title: 'Pilih layanan',
    description: 'Temukan jenis antrean atau laporan yang Anda butuhkan.',
    icon: <ShieldCheck size={20} />
  },
  {
    title: 'Ajukan secara online',
    description: 'Isi data dan pilih jadwal tanpa harus datang langsung ke kantor kelurahan.',
    icon: <CalendarDays size={20} />
  },
  {
    title: 'Pantau dan datang tepat waktu',
    description: 'Dapatkan notifikasi dan status antrean secara transparan.',
    icon: <MapPin size={20} />
  }
];

const stats = [
  { value: '98%', label: 'Kepuasan pengguna' },
  { value: '4.500+', label: 'Laporan ditindaklanjuti' },
  { value: '12.000+', label: 'Antrean digital dibuat' }
];

const faq = [
  {
    question: 'Apakah saya harus mendaftar dahulu?',
    answer: 'Ya, membuat akun diperlukan untuk mengambil antrean dan melaporkan masalah.'
  },
  {
    question: 'Bagaimana cara melihat status antrean saya?',
    answer: 'Masuk ke dashboard, lalu pilih menu Antrean untuk melihat informasi terbaru.'
  },
  {
    question: 'Apakah semua pengumuman resmi ditampilkan?',
    answer: 'Semua informasi publik dan pengumuman layanan tersedia di Mading Digital.'
  }
];

export const LandingPage: React.FC = () => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('dark-mode') === 'true' || 
    (!('dark-mode' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem('dark-mode', String(next));
    document.documentElement.classList.toggle('dark', next);
  };

  useEffect(() => {
    const handleButtonClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const btn = target.closest('.btn');
      if (!btn) return;

      // Create ripple element
      const ripple = document.createElement('span');
      ripple.className = 'btn-click-ripple';
      
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      
      btn.appendChild(ripple);
      
      // Remove after animation finishes
      setTimeout(() => {
        ripple.remove();
      }, 850);
    };

    document.addEventListener('mousedown', handleButtonClick);
    return () => document.removeEventListener('mousedown', handleButtonClick);
  }, []);

  return (
    <div className="landing-page-root flex-col gap-20" style={{ paddingBottom: '4rem', overflowY: 'auto', height: '100vh', width: '100%' }}>
      <header className="landing-hero">
        <nav className="landing-nav">
          <div className="landing-brand">
            <div className="nav-logo-icon" style={{ width: '2.5rem', height: '2.5rem' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <div className="text-lg font-bold text-primary-color">SatSet</div>
              <div className="text-xs uppercase text-tertiary" style={{ letterSpacing: '0.12em' }}>Super App</div>
            </div>
          </div>

          <div className="landing-links">
            {[ 'Masalah', 'Layanan', 'Cara Kerja', 'Statistik', 'FAQ' ].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} className="text-sm text-secondary hover:text-primary">
                {item}
              </a>
            ))}
          </div>

          <div className="landing-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button 
              onClick={toggleDarkMode}
              className="btn btn-ghost btn-icon"
              title="Ganti Tema"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link to="/login" className="btn btn-ghost btn-sm">Masuk</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Daftar</Link>
          </div>
        </nav>

        <div className="landing-hero-grid">
          <div className="landing-hero-copy">
            <span className="landing-chip">Solusi pelayanan kelurahan modern</span>
            <h1 className="landing-title">Layanan administrasi kelurahan yang modern, cepat, dan ramah warga.</h1>
            <p className="landing-description">
              SATSET hadir sebagai platform digital untuk antrean, pengaduan, dan pengumuman publik sehingga pelayanan kelurahan menjadi lebih profesional dan mudah diikuti.
            </p>

            <div className="landing-hero-buttons">
              <Link to="/register" className="btn btn-primary btn-lg">Mulai Sekarang</Link>
              <Link to="/login" className="btn btn-secondary btn-lg">Masuk ke Dashboard</Link>
            </div>

            <div className="landing-support-grid">
              {supportBadges.map((badge) => (
                <div key={badge.label} className="landing-support-card">
                  <div className="text-xs uppercase font-semibold text-tertiary mb-2">{badge.label}</div>
                  <p className="text-sm text-secondary">{badge.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="landing-hero-panel card">
            <div className="landing-panel-header">
              <span className="badge badge-info">Visualisasi Layanan</span>
              <span className="badge badge-success">Terpercaya</span>
            </div>
            <div className="landing-panel-body">
              <div className="landing-panel-stat">
                <span className="landing-panel-label">Antrean Aktif</span>
                <div className="landing-panel-value">B-011</div>
                <p className="text-sm text-secondary mt-2">Jadwal kunjungan yang jelas, antrean langsung terupdate.</p>
              </div>
              <div className="landing-panel-grid">
                <div className="landing-panel-metric">
                  <span className="landing-panel-label">Kecepatan Proses</span>
                  <div className="landing-panel-value-sm">95%</div>
                </div>
                <div className="landing-panel-metric">
                  <span className="landing-panel-label">Kepuasan</span>
                  <div className="landing-panel-value-sm">98%</div>
                </div>
              </div>
            </div>
            <div className="landing-hero-floating" />
          </div>
        </div>
      </header>

      <section id="masalah" className="landing-section">
        <div className="landing-section-header">
          <div>
            <span className="badge badge-primary">Tantangan yang diselesaikan</span>
            <h2 className="landing-section-title">Permasalahan pelayanan kini bisa ditangani lebih cepat.</h2>
          </div>
          <p className="text-secondary max-w-2xl">
            SATSET mempermudah warga dan kelurahan dengan proses antrean, laporan, dan informasi yang rapi serta jelas.
          </p>
        </div>

        <div className="landing-feature-grid">
          {problems.map((item) => (
            <div key={item.title} className="card card-interactive landing-feature-card">
              <div className="landing-feature-icon">{item.icon}</div>
              <h3 className="text-xl font-bold text-primary-color mb-2">{item.title}</h3>
              <p className="text-secondary text-sm">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="layanan" className="landing-section landing-alt-bg">
        <div className="landing-section-header">
          <div>
            <span className="badge badge-info">Layanan unggulan</span>
            <h2 className="landing-section-title">Akses layanan kelurahan dari satu tempat.</h2>
          </div>
          <p className="text-secondary max-w-2xl">
            Warga bisa mengambil antrean, mengirim laporan, dan melihat pengumuman tanpa harus datang fisik ke kantor kelurahan.
          </p>
        </div>

        <div className="landing-feature-grid">
          {services.map((item) => (
            <div key={item.title} className="card card-interactive landing-feature-card">
              <div className="landing-feature-icon"> <Star size={16} className="text-primary" /> </div>
              <h3 className="text-lg font-bold text-primary-color mb-2">{item.title}</h3>
              <p className="text-secondary text-sm">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="solusi" className="landing-section">
        <div className="landing-section-header">
          <div>
            <span className="badge badge-primary">Kenapa SATSET</span>
            <h2 className="landing-section-title">Platform yang dirancang untuk kelurahan modern.</h2>
          </div>
        </div>

        <div className="landing-feature-grid">
          {featureHighlights.map((item) => (
            <div key={item.title} className="kpi-card card-interactive landing-feature-card">
              <div className="kpi-icon bg-primary-subtle text-primary">{item.icon}</div>
              <div>
                <div className="text-base font-semibold text-primary-color">{item.title}</div>
                <p className="text-secondary text-sm mt-2">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="cara-kerja" className="landing-section landing-alt-bg">
        <div className="landing-section-header">
          <div>
            <span className="badge badge-info">Cara kerja</span>
            <h2 className="landing-section-title">Gunakan SATSET dengan tiga langkah sederhana.</h2>
          </div>
        </div>

        <div className="landing-step-grid">
          {steps.map((item) => (
            <div key={item.title} className="card landing-step-card">
              <div className="flex items-center gap-3 mb-4 text-primary-color">{item.icon}<span className="font-semibold">{item.title}</span></div>
              <p className="text-secondary text-sm">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="tracking" className="landing-section grid gap-6 lg:grid-cols-[1fr_0.9fr] items-center">
        <div>
          <span className="badge badge-primary">Tracking Transparan</span>
          <h2 className="text-3xl font-bold text-primary-color mt-4 mb-4">Pantau status pelayanan dan antrean secara jelas.</h2>
          <p className="text-secondary max-w-xl mb-6">SATSET memberi visibilitas ke setiap tahap layanan: dari pengajuan antrean, update laporan, sampai pemberitahuan panggilan.</p>
          <ul className="space-y-3 text-sm text-secondary">
            <li className="flex items-start gap-3"><CheckCircle2 size={16} className="text-success mt-1" /> Notifikasi status real-time</li>
            <li className="flex items-start gap-3"><CheckCircle2 size={16} className="text-success mt-1" /> Riwayat layanan digital</li>
            <li className="flex items-start gap-3"><CheckCircle2 size={16} className="text-success mt-1" /> Keterangan loket dan estimasi</li>
          </ul>
        </div>
        <div className="card landing-card-slim">
          <div className="flex items-center justify-between mb-4">
            <span className="font-semibold text-primary-color">Antrean Saya</span>
            <span className="badge badge-success">Aktif</span>
          </div>
          <div className="p-4 rounded-xl bg-surface-3 border" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase text-tertiary">Nomor Antrean</span>
              <span className="text-lg font-bold text-primary-color">B-011</span>
            </div>
            <div className="text-sm text-secondary">Loket 3 · Estimasi kedatangan 15 menit</div>
          </div>
        </div>
      </section>

      <section id="statistik" className="landing-section">
        <div className="grid gap-6 lg:grid-cols-3">
          {stats.map((item) => (
            <div key={item.label} className="card text-center landing-card-slim" style={{ padding: '1.5rem' }}>
              <div className="text-4xl font-bold text-primary-color mb-2">{item.value}</div>
              <p className="text-sm text-secondary">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="mading" className="landing-section grid gap-6 lg:grid-cols-[1.1fr_0.9fr] items-start">
        <div className="card landing-card-slim" style={{ padding: '1.5rem' }}>
          <span className="badge badge-info">Mading Digital</span>
          <h2 className="text-2xl font-bold text-primary-color mt-4 mb-4">Preview pengumuman dan informasi publik terbaru</h2>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-surface-3 border" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-primary-color">Program Vaksinasi Gratis</span>
                <span className="text-xs text-tertiary">1 Jun 2026</span>
              </div>
              <p className="text-sm text-secondary">Puskesmas Kelurahan SatSet menyelenggarakan vaksinasi booster gratis setiap Sabtu 08.00–12.00 WIB.</p>
            </div>
            <div className="p-4 rounded-xl bg-surface-3 border" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-primary-color">Pelayanan Administrasi Kelurahan</span>
                <span className="text-xs text-tertiary">28 Mei 2026</span>
              </div>
              <p className="text-sm text-secondary">Semua layanan kependudukan kini menggunakan antrean online melalui aplikasi SATSET.</p>
            </div>
          </div>
          <Link to="/mading" className="btn btn-ghost btn-sm mt-6">Lihat semua pengumuman</Link>
        </div>
        <div className="card landing-card-slim" style={{ padding: '1.5rem' }}>
          <h3 className="text-xl font-bold text-primary-color mb-3">Mobile Experience</h3>
          <p className="text-secondary mb-4">Aplikasi web dirancang responsif untuk penggunaan di ponsel dan tablet, sehingga warga bisa mengakses layanan kapan saja.</p>
          <div className="grid gap-3">
            <div className="p-4 rounded-xl bg-surface-3 border" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-3 mb-3"><Smartphone size={18} className="text-primary" /><span className="font-semibold">Tampilan ringkas</span></div>
              <p className="text-sm text-secondary">Antrean dan laporan mudah diakses melalui layar kecil dengan navigasi sederhana.</p>
            </div>
            <div className="p-4 rounded-xl bg-surface-3 border" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-3 mb-3"><Sparkles size={18} className="text-primary" /><span className="font-semibold">Notifikasi langsung</span></div>
              <p className="text-sm text-secondary">Dapatkan informasi status antrean dan pesan penting tanpa harus membuka banyak menu.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="landing-section">
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <span className="badge badge-primary">FAQ</span>
            <h2 className="text-3xl font-bold text-primary-color mt-4 mb-4">Pertanyaan yang sering diajukan</h2>
          </div>
          <div className="space-y-4">
            {faq.map((item) => (
              <div key={item.question} className="card landing-card-slim" style={{ padding: '1.5rem' }}>
                <h4 className="text-lg font-semibold text-primary-color mb-2">{item.question}</h4>
                <p className="text-secondary text-sm">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="cta" className="landing-section">
        <div className="card landing-card-slim" style={{ padding: '2rem', textAlign: 'center' }}>
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-primary-color mb-4">Siap bergabung dengan SATSET?</h2>
            <p className="text-secondary mb-6">Daftar sekarang untuk mulai gunakan antrean online, kirim laporan, dan terima informasi publik dari kelurahan Anda.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/register" className="btn btn-primary btn-lg">Daftar Akun</Link>
              <Link to="/login" className="btn btn-secondary btn-lg">Masuk</Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <div className="landing-footer-brand">
            <div className="text-lg font-bold text-primary-color">SatSet</div>
            <p className="text-secondary">Platform pelayanan publik digital untuk masyarakat kelurahan.</p>
          </div>
          <nav className="landing-footer-nav">
            <Link to="#masalah" className="landing-footer-link">Masalah</Link>
            <Link to="#layanan" className="landing-footer-link">Layanan</Link>
            <Link to="#faq" className="landing-footer-link">FAQ</Link>
            <Link to="/login" className="landing-footer-link">Masuk</Link>
          </nav>
        </div>
        <div className="landing-footer-copy">© 2026 SatSet. Semua hak cipta dilindungi.</div>
      </footer>
    </div>
  );
};

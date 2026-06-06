import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError('Email dan password harus diisi'); return; }
    setLoading(true);
    setError('');
    try {
      const data = await login({ email, password });
      if (data.success) {
        navigate(data.data.role === 'ADMIN' ? '/admin' : '/dashboard');
      } else {
        setError(data.message || 'Email atau password salah');
      }
    } catch {
      setError('Terjadi kesalahan koneksi ke server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      {/* Left Brand Panel */}
      <div className="auth-brand">
        <div className="auth-brand-bg" />
        <div className="auth-brand-content">
          <div style={{ marginBottom: '2rem' }}>
            <div className="flex items-center gap-3" style={{ marginBottom: '1.5rem' }}>
              <div className="nav-logo-icon" style={{ width: '2.5rem', height: '2.5rem', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: '1.125rem', fontWeight: 700, letterSpacing: 0 }}>SatSet</div>
                <div style={{ fontSize: '0.5625rem', textTransform: 'uppercase' as const, letterSpacing: 0, opacity: 0.6 }}>Super App</div>
              </div>
            </div>
          </div>

          <h1 style={{ fontSize: '2.25rem', fontWeight: 700, lineHeight: 1.15, letterSpacing: 0, marginBottom: '1rem', color: '#fff' }}>
            Layanan publik<br />
            <span style={{ color: '#a5b4fc' }}>cepat & transparan.</span>
          </h1>
          <p style={{ color: '#c7d2fe', maxWidth: '24rem', lineHeight: 1.7, fontSize: '0.9375rem' }}>
            Sistem Administrasi Terpadu & Sentralisasi Elektronik — platform pelayanan masyarakat digital terpadu.
          </p>

          <div className="flex flex-col gap-3" style={{ marginTop: '2.5rem' }}>
            {[
              'Antrean birokrasi digital tanpa antri fisik',
              'Pengaduan masyarakat real-time & transparan',
              'Informasi publik terpusat & terkini'
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-3" style={{ color: '#e0e7ff', fontSize: '0.8125rem' }}>
                <div style={{ width: '1.5rem', height: '1.5rem', borderRadius: '6px', background: 'rgba(165,180,252,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#a5b4fc" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                </div>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="auth-form-side">
        <div className="auth-form">
          <h2 className="auth-title">Masuk</h2>
          <p className="auth-subtitle">Masuk ke akun Anda untuk mengakses layanan</p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                required
              />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary btn-lg btn-full" style={{ marginTop: '0.25rem' }}>
              {loading ? <><span className="spinner" /> Memproses...</> : 'Masuk'}
            </button>
          </form>

          <div className="auth-divider"><span>atau</span></div>

          <p style={{ textAlign: 'center', fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>
            Belum punya akun?{' '}
            <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Daftar sekarang</Link>
          </p>

          <div className="auth-demo">
            <strong>Akun Demo</strong>
            Admin: <code>admin@satset.id</code> / <code>admin123</code><br />
            Warga: <code>warga@satset.id</code> / <code>warga123</code>
          </div>
        </div>
      </div>
    </div>
  );
};

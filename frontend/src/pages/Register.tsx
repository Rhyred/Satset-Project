import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Register: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nik: '',
    namaLengkap: '',
    username: '',
    email: '',
    password: '',
    noTelepon: '',
    alamat: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nik || !form.namaLengkap || !form.username || !form.email || !form.password) {
      setError('Semua field wajib (*) harus diisi');
      return;
    }
    if (form.nik.length !== 16) {
      setError('NIK harus berjumlah 16 digit');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const data = await register(form);
      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(data.message || 'Registrasi gagal');
      }
    } catch (err) {
      setError('Terjadi kesalahan koneksi ke server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout" style={{ overflowY: 'auto' }}>
      <div className="auth-form-side" style={{ maxWidth: '640px', margin: '0 auto', background: 'transparent' }}>
        <div className="auth-form" style={{ maxWidth: '520px', padding: '2rem 0' }}>
          
          <div className="flex items-center gap-2" style={{ marginBottom: '2rem', justifyContent: 'center' }}>
            <div className="nav-logo-icon" style={{ width: '2rem', height: '2rem' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span style={{ fontSize: '1.125rem', fontWeight: 700, letterSpacing: 0, color: 'var(--text-primary)' }}>SatSet</span>
          </div>

          <h2 className="auth-title" style={{ textAlign: 'center' }}>Daftar Akun</h2>
          <p className="auth-subtitle" style={{ textAlign: 'center' }}>Buat akun baru untuk mengakses layanan publik</p>

          {error && <div className="auth-error">{error}</div>}
          {success && (
            <div className="auth-success">
              Registrasi berhasil! Mengarahkan ke halaman login...
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="form-group">
              <label className="form-label">NIK (Nomor Induk Kependudukan) *</label>
              <input
                type="text"
                name="nik"
                value={form.nik}
                onChange={handleChange}
                placeholder="16 digit NIK"
                maxLength={16}
                required
              />
            </div>

            <div className="grid grid-2 gap-4">
              <div className="form-group">
                <label className="form-label">Nama Lengkap *</label>
                <input
                  type="text"
                  name="namaLengkap"
                  value={form.namaLengkap}
                  onChange={handleChange}
                  placeholder="Sesuai KTP"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Username *</label>
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Pilih username"
                  required
                />
              </div>
            </div>

            <div className="grid grid-2 gap-4">
              <div className="form-group">
                <label className="form-label">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="nama@email.com"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Password *</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Minimal 4 karakter"
                  required
                />
              </div>
            </div>

            <div className="grid grid-2 gap-4">
              <div className="form-group">
                <label className="form-label">No. Telepon</label>
                <input
                  type="text"
                  name="noTelepon"
                  value={form.noTelepon}
                  onChange={handleChange}
                  placeholder="08xxxxxxxxxx"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Alamat</label>
                <input
                  type="text"
                  name="alamat"
                  value={form.alamat}
                  onChange={handleChange}
                  placeholder="Alamat tempat tinggal"
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary btn-lg btn-full mt-2">
              {loading ? <><span className="spinner" /> Memproses...</> : 'Daftar Sekarang'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '0.8125rem', color: 'var(--text-tertiary)', marginTop: '2rem' }}>
            Sudah punya akun?{' '}
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Masuk di sini</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

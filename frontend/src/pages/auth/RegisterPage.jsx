import { ArrowRight } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { AuthLayout } from '../../layouts/AuthLayout.jsx'
import { Card } from '../../components/ui/Card.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { authService } from '../../services/authService.js'
import { getErrorMessage } from '../../services/api.js'
import { useToast } from '../../hooks/useToast.js'
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js'

const initialForm = {
  nik: '',
  namaLengkap: '',
  username: '',
  email: '',
  password: '',
  noTelepon: '',
  alamat: '',
}

export function RegisterPage() {
  useDocumentTitle('Registrasi')
  const navigate = useNavigate()
  const { addToast } = useToast()
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      await authService.register(form)
      addToast({
        tone: 'success',
        title: 'Registrasi berhasil',
        description: 'Silakan masuk menggunakan akun yang baru dibuat.',
      })
      navigate('/login', { replace: true })
    } catch (submissionError) {
      const message = getErrorMessage(submissionError, 'Registrasi gagal')
      setError(message)
      addToast({ tone: 'error', title: 'Registrasi gagal', description: message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      aside={
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-300">Bergabung</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight text-white">
            Buat akun untuk mengakses layanan publik SatSet.
          </h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-slate-300">
            Registrasi memberi akses ke antrean digital, pengaduan warga, notifikasi, dan profil layanan.
          </p>
        </div>
      }
    >
      <Card className="p-6 sm:p-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-700 dark:text-primary-300">
            Daftar
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">
            Buat akun baru
          </h2>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            Lengkapi data dasar untuk mengaktifkan akun Anda.
          </p>
        </div>

        {error ? (
          <div className="mt-5 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200">
            {error}
          </div>
        ) : null}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="field-label" htmlFor="nik">
                NIK
              </label>
              <input
                id="nik"
                value={form.nik}
                onChange={updateField('nik')}
                className="field-input"
                placeholder="16 digit NIK"
                maxLength={16}
                required
              />
            </div>
            <div>
              <label className="field-label" htmlFor="namaLengkap">
                Nama Lengkap
              </label>
              <input
                id="namaLengkap"
                value={form.namaLengkap}
                onChange={updateField('namaLengkap')}
                className="field-input"
                placeholder="Nama sesuai KTP"
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="field-label" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                value={form.username}
                onChange={updateField('username')}
                className="field-input"
                placeholder="Username unik"
                required
              />
            </div>
            <div>
              <label className="field-label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={updateField('email')}
                className="field-input"
                placeholder="nama@email.com"
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="field-label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={form.password}
                onChange={updateField('password')}
                className="field-input"
                placeholder="Minimal 4 karakter"
                required
              />
            </div>
            <div>
              <label className="field-label" htmlFor="noTelepon">
                No. Telepon
              </label>
              <input
                id="noTelepon"
                value={form.noTelepon}
                onChange={updateField('noTelepon')}
                className="field-input"
                placeholder="08xxxxxxxxxx"
              />
            </div>
          </div>

          <div>
            <label className="field-label" htmlFor="alamat">
              Alamat
            </label>
            <textarea
              id="alamat"
              value={form.alamat}
              onChange={updateField('alamat')}
              className="field-input min-h-24"
              placeholder="Alamat tempat tinggal"
            />
          </div>

          <Button type="submit" className="w-full justify-center" disabled={loading}>
            {loading ? 'Memproses...' : 'Daftar Akun'}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          Sudah punya akun?{' '}
          <Link to="/login" className="font-semibold text-primary-700 hover:underline dark:text-primary-300">
            Masuk di sini
          </Link>
        </p>
      </Card>
    </AuthLayout>
  )
}

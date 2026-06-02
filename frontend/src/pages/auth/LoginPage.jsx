import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AuthLayout } from '../../layouts/AuthLayout.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { Card } from '../../components/ui/Card.jsx'
import { demoAccounts } from '../../utils/constants.js'
import { useAuth } from '../../hooks/useAuth.js'
import { useToast } from '../../hooks/useToast.js'
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js'
import { authService } from '../../services/authService.js'
import { getErrorMessage } from '../../services/api.js'

export function LoginPage() {
  useDocumentTitle('Login')
  const navigate = useNavigate()
  const location = useLocation()
  const { refreshUser } = useAuth()
  const { addToast } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const from = location.state?.from?.pathname || '/'

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)

    try {
      await authService.login({ email, password })
      await refreshUser()
      addToast({ tone: 'success', title: 'Login berhasil', description: 'Anda sedang diarahkan ke dashboard.' })
      navigate(from, { replace: true })
    } catch (error) {
      addToast({ tone: 'error', title: 'Login gagal', description: getErrorMessage(error) })
    } finally {
      setLoading(false)
    }
  }

  const aside = (
    <div className="max-w-xl space-y-8 text-slate-50">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary-300">SatSet</p>
        <h1 className="mt-4 text-5xl font-semibold tracking-tight">
          Layanan publik yang lebih cepat, lebih jelas, dan lebih rapi.
        </h1>
        <p className="mt-5 max-w-lg text-lg leading-8 text-slate-300">
          Masuk untuk memantau antrean, pengaduan, notifikasi, dan mading digital dalam satu tempat.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {[
          { icon: ShieldCheck, label: 'Akses aman ke akun Anda' },
          { icon: CheckCircle2, label: 'Status layanan lebih transparan' },
        ].map(({ icon: Icon, label }) => (
          <div key={label} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <Icon className="h-5 w-5 text-primary-300" />
            <p className="mt-3 text-sm text-slate-300">{label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-primary-500/30 bg-primary-950/60 p-5">
        <div className="flex items-center gap-3 text-primary-200">
          <Sparkles className="h-5 w-5" />
          <p className="text-sm font-semibold uppercase tracking-[0.18em]">Akun demo</p>
        </div>
        <div className="mt-4 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
          {demoAccounts.map((account) => (
            <div key={account.role} className="rounded-xl bg-white/5 p-3">
              <p className="font-semibold text-slate-100">{account.role}</p>
              <p className="mt-1 break-all text-slate-300">{account.email}</p>
              <p className="mt-1 text-slate-400">{account.password}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <AuthLayout aside={aside}>
      <Card className="animate-slide-up border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900 sm:p-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-700 dark:text-primary-300">
            Masuk ke akun
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">
            Selamat datang kembali
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Gunakan akun warga atau admin untuk mengakses layanan SatSet.
          </p>
        </div>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="field-label">Email</label>
            <input
              type="email"
              className="field-input"
              placeholder="nama@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
            />
          </div>
          <div>
            <label className="field-label">Password</label>
            <input
              type="password"
              className="field-input"
              placeholder="Masukkan password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
            />
          </div>

          <Button type="submit" className="w-full justify-center" disabled={loading}>
            {loading ? 'Memproses...' : 'Masuk'}
            {!loading ? <ArrowRight className="h-4 w-4" /> : null}
          </Button>
        </form>

        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-300">
          Belum punya akun?{' '}
          <Link to="/register" className="font-semibold text-primary-700 hover:underline dark:text-primary-300">
            Daftar di sini
          </Link>
        </div>
      </Card>
    </AuthLayout>
  )
}
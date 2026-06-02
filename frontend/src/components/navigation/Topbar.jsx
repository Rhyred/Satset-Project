import { Bell, LogOut, Menu, MoonStar, SunMedium } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { notificationService } from '../../services/notificationService'
import { getErrorMessage, api } from '../../services/api'
import { useAuth } from '../../hooks/useAuth'
import { useTheme } from '../../hooks/useTheme'
import { useToast } from '../../hooks/useToast'
import { Button } from '../ui/Button'
import { getInitials } from '../../utils/formatters'

const pageLabels = {
  '/': 'Beranda',
  '/queue': 'Manajemen Antrean',
  '/reports': 'Pengaduan Warga',
  '/mading': 'Mading Digital',
  '/notifications': 'Pusat Notifikasi',
  '/account': 'Profil Warga',
  '/admin': 'Panel Admin',
  '/users': 'Manajemen Pengguna',
}

export function Topbar({ onOpenSidebar }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, setUser } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { addToast } = useToast()
  const [unreadCount, setUnreadCount] = useState(0)

  const pageTitle = useMemo(() => pageLabels[location.pathname] ?? 'SatSet', [location.pathname])

  useEffect(() => {
    let active = true

    const fetchUnread = async () => {
      try {
        const count = await notificationService.getUnreadCount()
        if (active) setUnreadCount(count)
      } catch (_error) {
        if (active) setUnreadCount(0)
      }
    }

    fetchUnread()

    const refreshUnread = () => fetchUnread()
    window.addEventListener('notifications:refresh', refreshUnread)

    return () => {
      active = false
      window.removeEventListener('notifications:refresh', refreshUnread)
    }
  }, [location.pathname])

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout')
      setUser(null)
      navigate('/login')
    } catch (error) {
      addToast({
        tone: 'error',
        title: 'Logout gagal',
        description: getErrorMessage(error),
      })
    }
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Button size="icon" variant="ghost" className="md:hidden" onClick={onOpenSidebar}>
            <Menu className="h-5 w-5" />
          </Button>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-700 dark:text-primary-300">
              SatSet Dashboard
            </p>
            <h1 className="text-lg font-semibold tracking-tight text-slate-950 dark:text-slate-50">
              {pageTitle}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/notifications"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-50"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 ? (
              <span className="absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-rose-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                {unreadCount}
              </span>
            ) : null}
          </Link>

          <Button size="icon" variant="ghost" onClick={toggleTheme}>
            {theme === 'dark' ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
          </Button>

          <div className="hidden items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-slate-800 dark:bg-slate-900 sm:flex">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700 dark:bg-primary-950/70 dark:text-primary-200">
              {getInitials(user?.namaLengkap)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-950 dark:text-slate-50">
                {user?.namaLengkap}
              </p>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                {user?.role === 'ADMIN' ? 'Administrator' : 'Warga'}
              </p>
            </div>
          </div>

          <Button variant="secondary" size="icon" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}

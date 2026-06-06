import { CheckCheck, RefreshCcw, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Button } from '../components/ui/Button.jsx'
import { Card } from '../components/ui/Card.jsx'
import { EmptyState } from '../components/ui/EmptyState.jsx'
import { LoadingScreen } from '../components/ui/LoadingScreen.jsx'
import { SectionHeader } from '../components/ui/SectionHeader.jsx'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { useToast } from '../hooks/useToast.js'
import { notificationService } from '../services/notificationService.js'
import { getErrorMessage } from '../services/api.js'
import { formatDateTime } from '../utils/formatters.js'
import { toArray } from './pageHelpers.js'

export function NotificationsPage() {
  useDocumentTitle('Notifikasi')
  const { addToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    let active = true

    const loadNotifications = async () => {
      try {
        const response = await notificationService.getMyNotifications()
        if (active) setNotifications(toArray(response))
      } catch (error) {
        if (active) {
          addToast({ tone: 'error', title: 'Gagal memuat notifikasi', description: getErrorMessage(error) })
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    loadNotifications()

    return () => {
      active = false
    }
  }, [addToast])

  const unreadCount = useMemo(() => notifications.filter((item) => !item.isRead).length, [notifications])
  const visibleNotifications = useMemo(() => {
    if (filter === 'unread') return notifications.filter((item) => !item.isRead)
    return notifications
  }, [filter, notifications])

  const refreshSignal = () => {
    window.dispatchEvent(new Event('notifications:refresh'))
  }

  const reload = async () => {
    try {
      const response = await notificationService.getMyNotifications()
      setNotifications(toArray(response))
      refreshSignal()
    } catch (error) {
      addToast({ tone: 'error', title: 'Gagal memuat ulang notifikasi', description: getErrorMessage(error) })
    }
  }

  const markRead = async (id) => {
    try {
      await notificationService.markRead(id)
      setNotifications((current) => current.map((item) => (item.id === id ? { ...item, isRead: true } : item)))
      refreshSignal()
      addToast({ tone: 'success', title: 'Notifikasi ditandai dibaca' })
    } catch (error) {
      addToast({ tone: 'error', title: 'Gagal memperbarui notifikasi', description: getErrorMessage(error) })
    }
  }

  const markAllRead = async () => {
    try {
      await Promise.all(notifications.filter((item) => !item.isRead).map((item) => notificationService.markRead(item.id)))
      setNotifications((current) => current.map((item) => ({ ...item, isRead: true })))
      refreshSignal()
      addToast({ tone: 'success', title: 'Semua notifikasi dibaca' })
    } catch (error) {
      addToast({ tone: 'error', title: 'Gagal memperbarui notifikasi', description: getErrorMessage(error) })
    }
  }

  const deleteNotification = async (id) => {
    try {
      await notificationService.delete(id)
      setNotifications((current) => current.filter((item) => item.id !== id))
      refreshSignal()
      addToast({ tone: 'success', title: 'Notifikasi dihapus' })
    } catch (error) {
      addToast({ tone: 'error', title: 'Gagal menghapus notifikasi', description: getErrorMessage(error) })
    }
  }

  if (loading) {
    return <LoadingScreen label="Memuat notifikasi..." />
  }

  return (
    <div className="page-section">
      <SectionHeader
        eyebrow="Pusat notifikasi"
        title="Notifikasi Anda"
        description="Pantau status laporan, antrean, dan pesan penting yang masuk."
        actions={
          <>
            <Button variant="secondary" onClick={reload}>
              <RefreshCcw className="h-4 w-4" />
              Muat ulang
            </Button>
            <Button variant="secondary" onClick={markAllRead} disabled={!unreadCount}>
              <CheckCheck className="h-4 w-4" />
              Tandai semua dibaca
            </Button>
          </>
        }
      />

      <div className="flex gap-3 border-b border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`border-b-2 px-1 py-3 text-sm font-medium transition ${filter === 'all' ? 'border-primary-600 text-primary-700 dark:text-primary-300' : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'}`}
        >
          Semua ({notifications.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('unread')}
          className={`border-b-2 px-1 py-3 text-sm font-medium transition ${filter === 'unread' ? 'border-primary-600 text-primary-700 dark:text-primary-300' : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'}`}
        >
          Belum dibaca ({unreadCount})
        </button>
      </div>

      {visibleNotifications.length ? (
        <div className="space-y-3">
          {visibleNotifications.map((notification) => (
            <Card
              key={notification.id}
              className={`p-4 ${notification.isRead ? '' : 'border-primary-200 bg-primary-50/60 dark:border-primary-900 dark:bg-primary-950/30'}`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${notification.isRead ? 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300' : 'bg-primary-600 text-white'}`}
                >
                  !
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm leading-7 text-slate-700 dark:text-slate-200">
                    {notification.pesan || notification.message || notification.judul || 'Notifikasi baru'}
                  </p>
                  <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                    {formatDateTime(notification.createdAt || notification.waktu || notification.tanggal)}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  {!notification.isRead ? (
                    <button
                      type="button"
                      onClick={() => markRead(notification.id)}
                      className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                      title="Tandai dibaca"
                    >
                      <CheckCheck className="h-4 w-4" />
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => deleteNotification(notification.id)}
                    className="rounded-lg p-2 text-slate-500 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40"
                    title="Hapus"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState title="Tidak ada notifikasi" description="Semua notifikasi Anda akan tampil di sini ketika ada pembaruan." />
      )}
    </div>
  )
}
import { Bell, ClipboardList, MessageSquareWarning, Newspaper } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '../components/ui/Card.jsx'
import { EmptyState } from '../components/ui/EmptyState.jsx'
import { LoadingScreen } from '../components/ui/LoadingScreen.jsx'
import { SectionHeader } from '../components/ui/SectionHeader.jsx'
import { StatCard } from '../components/dashboard/StatCard.jsx'
import { StatusBadge } from '../components/ui/StatusBadge.jsx'
import { dashboardService } from '../services/dashboardService.js'
import { useAuth } from '../hooks/useAuth.js'
import { useToast } from '../hooks/useToast.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { getErrorMessage } from '../services/api.js'
import { humanizeKey, pickValue, toArray, toObject } from './pageHelpers.js'

function ReportItem({ item }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-950 dark:text-slate-50">
            {pickValue(item, ['judulLaporan', 'judul', 'title'])}
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {pickValue(item, ['deskripsi', 'konten', 'description'])}
          </p>
        </div>
        <StatusBadge status={pickValue(item, ['status', 'statusLaporan', 'statusAntrian'], 'BARU')} />
      </div>
    </div>
  )
}

export function DashboardPage() {
  useDocumentTitle('Beranda')
  const { user } = useAuth()
  const { addToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({})
  const [recentReports, setRecentReports] = useState([])
  const [activeQueues, setActiveQueues] = useState([])

  useEffect(() => {
    let active = true

    const loadDashboard = async () => {
      try {
        const [statsData, reportsData, queuesData] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getRecentReports(),
          dashboardService.getActiveQueues(),
        ])

        if (!active) return

        setStats(toObject(statsData))
        setRecentReports(toArray(reportsData))
        setActiveQueues(toArray(queuesData))
      } catch (error) {
        if (active) {
          addToast({ tone: 'error', title: 'Gagal memuat dashboard', description: getErrorMessage(error) })
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    loadDashboard()

    return () => {
      active = false
    }
  }, [addToast])

  if (loading) {
    return <LoadingScreen label="Memuat dashboard..." />
  }

  const entries = Object.entries(stats).filter(([, value]) => ['string', 'number', 'boolean'].includes(typeof value))
  const visibleStats = entries.length
    ? entries.slice(0, 4)
    : [
        ['totalLaporan', recentReports.length],
        ['totalAntrean', activeQueues.length],
        ['notifikasi', 0],
        ['mading', 0],
      ]

  const icons = [MessageSquareWarning, ClipboardList, Bell, Newspaper]

  return (
    <div className="page-section">
      <Card className="overflow-hidden p-6 md:p-8">
        <div className="grid gap-6 lg:grid-cols-[1.5fr_0.9fr] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-700 dark:text-primary-300">
              Ringkasan hari ini
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">
              Selamat datang, {user?.namaLengkap || 'Pengguna'}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500 dark:text-slate-400">
              Pantau antrean, laporan, notifikasi, dan informasi publik dari satu dashboard.
            </p>
          </div>

          <div className="rounded-2xl border border-primary-200 bg-primary-50 p-5 dark:border-primary-900 dark:bg-primary-950/40">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-700 dark:text-primary-300">
              Aksi cepat
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                to="/queue"
                className="inline-flex rounded-lg bg-primary-700 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-600"
              >
                Ambil antrean
              </Link>
              <Link
                to="/reports"
                className="inline-flex rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
              >
                Buat laporan
              </Link>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {visibleStats.map(([key, value], index) => {
          const Icon = icons[index % icons.length]
          return (
            <StatCard
              key={key}
              icon={Icon}
              title={humanizeKey(key)}
              value={typeof value === 'boolean' ? (value ? 'Ya' : 'Tidak') : value}
              helper="Ringkasan otomatis dari server"
            />
          )
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="p-6">
          <SectionHeader
            eyebrow="Laporan terbaru"
            title="Pengaduan dan tindak lanjut"
            description="Data yang paling baru masuk dari layanan pengaduan."
          />
          <div className="mt-6 space-y-4">
            {recentReports.length ? (
              recentReports.slice(0, 5).map((item) => (
                <ReportItem key={item.id ?? pickValue(item, ['judulLaporan', 'judul'])} item={item} />
              ))
            ) : (
              <EmptyState
                icon={MessageSquareWarning}
                title="Belum ada laporan terbaru"
                description="Saat ada laporan baru, data akan muncul di sini."
              />
            )}
          </div>
        </Card>

        <Card className="p-6">
          <SectionHeader
            eyebrow="Antrean aktif"
            title="Status pelayanan berjalan"
            description="Nomor antrean yang sedang diproses oleh petugas."
          />
          <div className="mt-6 space-y-4">
            {activeQueues.length ? (
              activeQueues.slice(0, 5).map((item) => (
                <div
                  key={item.id ?? pickValue(item, ['nomorAntrian', 'jenisSurat'])}
                  className="rounded-lg border border-slate-200 p-4 dark:border-slate-800"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-950 dark:text-slate-50">
                        {pickValue(item, ['nomorAntrian', 'kodeAntrian', 'jenisSurat'])}
                      </p>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {pickValue(item, ['jenisSurat', 'keperluan', 'deskripsi'])}
                      </p>
                    </div>
                    <StatusBadge status={pickValue(item, ['statusAntrian', 'status'], 'MENUNGGU')} />
                  </div>
                </div>
              ))
            ) : (
              <EmptyState
                icon={ClipboardList}
                title="Belum ada antrean aktif"
                description="Permintaan antrean yang masuk akan tampil di sini."
              />
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
